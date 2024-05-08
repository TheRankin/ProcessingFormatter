export function key(code: string): string {
  /**
   * F "} <any space>"
   * T "}
   * <any space>"
   */
  code = code.replaceAll(/\}(?=[\S ]+)/gm, '}\n');

  /**
   * From <anything>}
   * To <anything>;
   * }
   */
  code = code.replaceAll(/(?:[\w;]+ *)\}/gm, ';\n}');
  /**
   * F "}
   * <method name>(arg1,argN) {"
   * T "}
   *
   * "
   */
  code = code.replaceAll(/\}\n *(?=.+\([\w ,]*\) *\{)/gm, '}\n\n');


  /**
   * F "{<method name>(arg1,argN)"
   * T "{
   * <method name>(arg1,argN)"
   */
  code = code.replaceAll(/\{(?=[\S\w ]+)/gm, '{\n');

  /**
   * F "<any space>{"
   * T " {"
   */
  code = code.replaceAll(/[\s]*\{/gm, ' {');
  return code;
}