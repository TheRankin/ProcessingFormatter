export function conditions(code: string): string {
  /**
   * F "if       ("
   * T "if ("
   */
  code = code.replaceAll(/if\s*\(/gm, 'if (');

  /**
   * F "}        else {"
   * T "} else {"
   */
  code = code.replaceAll(/\}[\s]*else \{/gm, '} else {');
  return code;
}
