export function extra(code: string): string {
  /**
   * F "<more than 2 new lines>"
   * T "<2 lines>"
   */
  code = code.replaceAll(/\n{3,}/gm, '\n\n');

  /**
   * F "}<any space>)"
   * T "})"
   */
  code = code.replaceAll(/\}[\s\n]+\)/gm, '})');

  /**
   * Trailing spaces
   * F "<any extra space>"
   * T ""
   */
  code = code.replaceAll(/[ \t]+$/gm, '');

  // if final 2 lines are empty, remove one
  if (code.endsWith('\n\n')) {
    code = code.slice(0, -1);
  }

  return code;
}