import { replaceAll } from "./utils";

export function variables(code: string): string {
  /**
   * F "
   * <method name>(args**) {"
   * T "
   *
   * <method name>(args**) {"
   */
  code = replaceAll(code, /\n(?=.+\([\w ,]*\) *{)/gm, '\n\n');

  // TODO: <T> type variables
  return code;
}