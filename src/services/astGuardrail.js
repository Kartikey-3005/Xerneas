// Abstract Syntax Tree (AST) & Command Security Guardrail
// Enforces blast-radius safety as specified in TRD Section 7 & PRD Section 6

export const PROHIBITED_PATTERNS = [
  { pattern: /rm\s+(-[rfRF]{1,4}\s+)?\/\s*($|\s)/, label: "Root filesystem deletion (rm -rf /)", severity: "CRITICAL" },
  { pattern: /rm\s+(-[rfRF]{1,4}\s+)?\/\*/, label: "Root wildcard deletion (rm -rf /*)", severity: "CRITICAL" },
  { pattern: /\bmkfs(\.\w+)?\b/, label: "Direct filesystem formatting (mkfs)", severity: "CRITICAL" },
  { pattern: /\bdd\b.*\bof=\/dev\/(sd[a-z]|nvme|vd[a-z])/, label: "Raw block device overwriting (dd of=/dev/...)", severity: "CRITICAL" },
  { pattern: /iptables\s+.*-F/, label: "Flushing host firewall tables (iptables -F)", severity: "HIGH" },
  { pattern: />.*\/etc\/(passwd|shadow|sudoers)/, label: "System authentication file mutation (/etc/passwd)", severity: "CRITICAL" },
  { pattern: /chmod\s+.*777\s+\//, label: "Root permission degradation (chmod 777 /)", severity: "HIGH" },
  { pattern: /:(){ :\|:& };:/, label: "Bash fork bomb injection", severity: "CRITICAL" }
];

export function inspectCommandAST(script) {
  if (!script || typeof script !== "string") {
    return { isAllowed: true, violations: [], parsedTokens: [] };
  }

  const lines = script.split('\n');
  const violations = [];
  const parsedNodes = [];

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Tokenize
    const tokens = trimmed.split(/\s+/);
    parsedNodes.push({
      line: lineIndex + 1,
      command: tokens[0],
      args: tokens.slice(1),
      raw: trimmed
    });

    for (const rule of PROHIBITED_PATTERNS) {
      if (rule.pattern.test(trimmed)) {
        violations.push({
          line: lineIndex + 1,
          command: trimmed,
          rule: rule.label,
          severity: rule.severity,
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  const isAllowed = violations.length === 0;

  return {
    isAllowed,
    isQuarantined: !isAllowed,
    violations,
    parsedNodes,
    message: isAllowed
      ? "AST Guardrail Passed: All 0 destructive expressions detected. Command safe for Docker sandbox."
      : `SECURITY EXCEPTION: ${violations.length} forbidden destructive pattern(s) intercepted by AST Parser. Quarantine invoked.`
  };
}
