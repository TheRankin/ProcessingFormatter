import { replaceAll } from "./utils";

export function spaces(code: string): string {
  /**
   * F "<any variable spaces>"
   * T "<type> <name>"
   */
  code = replaceAll(code, /(?<![;\s]|\/\/.*|\*\/)[\s]{2,}/gm, ' ');
  return code;
}
