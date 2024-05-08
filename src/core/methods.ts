export function methods(code: string): string {
  /**
   * F "<method name> ("
   * T "<method name>("
   */
  code = code.replaceAll(/\s+\(/gm, '(');

  /**
   * F "<method name> ("
   * T "<method name>("
   */
  code = code.replaceAll(/\(\s/gm, '(');

  /**
   * F "<method name>(arg1 , arg2)"
   * T "<method name>(arg1, arg2)"
   */
  code = code.replaceAll(/\s+,/gm, ',');

  /**
   * F "<method name>(arg1,    arg2)"
   * T "<method name>(arg1, arg2)"
   */
  code = code.replaceAll(/,\s+/gm, ', ');

  /**
   * F "<method name>(arg1, arg2 )"
   * T "<method name>(arg1, arg2)"
   */
  code = code.replaceAll(/(?=.)\s+\)/gm, ')');
  return code;
}