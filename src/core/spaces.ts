export function spaces(code: string): string {
  /**
   * F "<any variable spaces>"
   * T "<type> <name>"
   */
  code = code.replaceAll(/(?<![;\s]|\/\/.*|\*\/)[\s]{2,}/gm, ' ');
  return code;
}
