import { replaceAll } from "./utils";

export function key(code: string): string {
  /**
   * F "} <any space>"
   * T "}
   * <any space>"
   */
  code = replaceAll(code, /\}(?=[\S ]+)/gm, '}\n');

  /**
   * From <anything>}
   * To <anything>;
   * }
   */
  code = replaceAll(code, /(?:[\w;]+ *)\}/gm, ';\n}');
  /**
   * F "}
   * <method name>(arg1,argN) {"
   * T "}
   *
   * "
   */
  code = replaceAll(code, /\}\n *(?=.+\([\w ,]*\) *\{)/gm, '}\n\n');


  /**
   * F "{<method name>(arg1,argN)"
   * T "{
   * <method name>(arg1,argN)"
   */
  code = replaceAll(code, /\{(?=[\S\w ]+)/gm, '{\n');

  /**
   * F "<any space>{"
   * T " {"
   */
  code = replaceAll(code, /[\s]*\{/gm, ' {');
  return code;
}