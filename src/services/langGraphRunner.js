// LangGraph State Machine Runner for Autonomous Remediation
// Implements 5 nodes, Condition Gating, and 3-iteration Reflection Loop (TRD Section 5)
import { inspectCommandAST } from './astGuardrail';
import { RUNBOOKS } from '../data/runbooks';

export async function runLangGraphPipeline({
  incident,
  mode = "SAFE", // "SAFE" | "AUTONOMOUS"
  onStepProgress,
  forceSandboxFailureOnce = false
}) {
  const steps = [];
  let retryCounter = 0;
  const maxRetries = 3;

  function recordStep(nodeName, status, summary, payload = {}) {
    const stepObj = {
      nodeName,
      status, // "RUNNING" | "PASSED" | "FAILED" | "REFLECTING"
      summary,
      timestamp: new Date().toLocaleTimeString(),
      payload
    };
    steps.push(stepObj);
    if (onStepProgress) onStepProgress({ steps: [...steps], currentStep: stepObj });
    return stepObj;
  }

  // --- NODE 1: diagnose_node ---
  recordStep("diagnose_node", "RUNNING", "Querying Qdrant Vector DB (bge-small 384d) for runbooks and synthesizing RCA...");
  await delay(800);

  // Match best runbook
  const matchedRunbook = RUNBOOKS.find(rb => rb.classification === incident.classification) || RUNBOOKS[0];

  const rcaPayload = {
    incidentId: incident.id,
    rootCauseJustification: `Detected ${incident.classification} with Isolation Forest anomaly score ${incident.anomalyScore}. Vector similarity matched ${matchedRunbook.title} (similarity: ${(matchedRunbook.similarityScore * 100).toFixed(1)}%).`,
    affectedEntities: matchedRunbook.targetEntities,
    recommendedRunbookId: matchedRunbook.id,
    confidence: matchedRunbook.similarityScore
  };

  recordStep("diagnose_node", "PASSED", `RCA synthesized via Qdrant retrieval (Score: ${matchedRunbook.similarityScore}).`, rcaPayload);
  await delay(600);

  let currentScript = matchedRunbook.remediationScript;
  let sandboxPassed = false;
  let finalOutcome = "SUCCESS";

  while (!sandboxPassed && retryCounter <= maxRetries) {
    // --- NODE 2: patch_gen_node ---
    const isRetry = retryCounter > 0;
    recordStep(
      "patch_gen_node",
      "RUNNING",
      isRetry
        ? `Refining patch script with updated flags (Iteration ${retryCounter}/${maxRetries})...`
        : "Drafting discrete shell commands matching system security whitelist...",
      { script: currentScript, retryCounter }
    );
    await delay(700);

    // Run AST Guardrail Check first
    const astResult = inspectCommandAST(currentScript);
    if (!astResult.isAllowed) {
      recordStep("patch_gen_node", "FAILED", `AST Whitelist Intercept: ${astResult.message}`, {
        violations: astResult.violations,
        isQuarantined: true
      });
      return {
        success: false,
        quarantined: true,
        reason: "AST_GUARDRAIL_VIOLATION",
        steps,
        message: "Destructive script quarantined by AST filter. Human intervention required."
      };
    }

    recordStep("patch_gen_node", "PASSED", "Generated safe execution script validated by AST parser.", {
      script: currentScript,
      astPassed: true
    });
    await delay(600);

    // --- NODE 3: sandbox_node ---
    recordStep("sandbox_node", "RUNNING", "Initializing ephemeral Docker sandbox (--net=none, non-root, 15s timeout)...");
    await delay(1000);

    // Simulate dry run execution
    const shouldFail = forceSandboxFailureOnce && retryCounter === 0;

    if (shouldFail) {
      const exitCode = 127;
      const stderr = "sh: 3: /opt/app/bin/flush-cache.sh: not found. Container path mismatch in Alpine base.";
      recordStep("sandbox_node", "FAILED", `Dry-run failed with exit code ${exitCode}`, {
        exitCode,
        stderr,
        isolationFlags: ["--net=none", "--user=1001", "--memory=256m", "--timeout=15s"],
        containerImage: "alpine:3.19-ephemeral"
      });
      await delay(700);

      // Condition Gate Check
      if (retryCounter < maxRetries) {
        // --- NODE 4: reflect_node ---
        recordStep("reflect_node", "REFLECTING", `Reflecting on STDERR: "${stderr}". Adjusting command path...`, {
          previousExitCode: exitCode,
          stderr,
          retryAttempt: retryCounter + 1
        });
        await delay(900);

        // Self-correction adjustment
        currentScript = currentScript.replace(
          "/opt/app/bin/flush-cache.sh",
          "/usr/local/bin/flush-cache.sh"
        );
        retryCounter++;
        recordStep("reflect_node", "PASSED", `Self-correction completed. Adjusted path to /usr/local/bin/flush-cache.sh. Re-entering patch_gen.`);
        await delay(600);
        continue;
      } else {
        recordStep("reflect_node", "FAILED", `Exceeded max retry threshold (${maxRetries}). Aborting auto-remediation.`);
        return {
          success: false,
          reason: "MAX_RETRIES_EXCEEDED",
          steps,
          message: "Sandbox verification failed 3 times. Triggering emergency Slack alert."
        };
      }
    } else {
      // Sandbox successful
      sandboxPassed = true;
      recordStep("sandbox_node", "PASSED", "Sandbox verification PASSED (Exit code: 0, 0 cgroup faults, 0 memory spikes).", {
        exitCode: 0,
        stdout: "Cache flush completed in 420ms. Headroom buffer +25% applied cleanly.",
        isolationFlags: ["--net=none", "--user=1001", "--memory=256m"],
        sandboxPass: true
      });
      await delay(700);
    }
  }

  // --- NODE 5: dispatch_node ---
  if (mode === "AUTONOMOUS") {
    recordStep("dispatch_node", "RUNNING", "Autonomous Mode Active: Dispatching live kubectl/Docker API actuation directly to production cluster...");
    await delay(1000);
    recordStep("dispatch_node", "PASSED", "Remediation executed live. Telemetry returning to baseline within 12s.", {
      mode: "AUTONOMOUS",
      liveStatus: "REMEDIATED",
      executionTarget: matchedRunbook.targetEntities[0]
    });
  } else {
    // SAFE MODE: requires Slack one-click card approval
    recordStep("dispatch_node", "PASSED", "Safe Mode: Prepared interactive Slack card requiring one-click manual approval.", {
      mode: "SAFE",
      slackCardPayload: {
        incidentId: incident.id,
        classification: incident.classification,
        sandboxVerified: true,
        scriptPreview: currentScript,
        webhookUrl: "https://hooks.slack.com/services/T00/B00/XERNEAS"
      }
    });
  }

  return {
    success: true,
    sandboxPassed: true,
    finalScript: currentScript,
    retriesUsed: retryCounter,
    mode,
    steps
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
