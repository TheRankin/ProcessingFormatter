import { replaceAll } from "./utils";

export function methods(code: string): string {
  /**
   * F "<method name> ("
   * T "<method name>("
   */
  code = replaceAll(code, /\s+\(/gm, '(');

  /**
   * F "<method name> ("
   * T "<method name>("
   */
  code = replaceAll(code, /\(\s/gm, '(');

  /**
   * F "<method name>(arg1 , arg2)"
   * T "<method name>(arg1, arg2)"
   */
  code = replaceAll(code, /\s+,/gm, ',');

  /**
   * F "<method name>(arg1,    arg2)"
   * T "<method name>(arg1, arg2)"
   */
  code = replaceAll(code, /,\s+/gm, ', ');

  /**
   * F "<method name>(arg1, arg2 )"
   * T "<method name>(arg1, arg2)"
   */
  code = replaceAll(code, /(?=.)\s+\)/gm, ')');
  return code;
}