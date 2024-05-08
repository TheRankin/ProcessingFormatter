export function variables(code: string): string {
  /**
   * F "
   * <method name>(args**) {"
   * T "
   *
   * <method name>(args**) {"
   */
  code = code.replaceAll(/\n(?=.+\([\w ,]*\) *{)/gm, '\n\n');

  // TODO: <T> type variables
  return code;
}