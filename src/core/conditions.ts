import { replaceAll } from "./utils";

export function conditions(code: string): string {
  /**
   * F "if       ("
   * T "if ("
   */
  code = replaceAll(code, /if\s*\(/gm, 'if (');

  /**
   * F "}        else {"
   * T "} else {"
   */
  code = replaceAll(code, /\}[\s]*else \{/gm, '} else {');
  return code;
}
