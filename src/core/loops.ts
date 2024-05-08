export function loops(code: string): string {

  /**
   * F "for*<any order and spaces>*{"
   * T "for (classic 'for' order) {"
  */
  code = code.replaceAll(/for\s*\(\s*(\w+)\s+(\w+)\s*=\s*(\w+)?\s*;\s*(\w+)\s*([<>!=]+)\s*(\w+)\s*;\s*([\w-+=]+)\s*\)\s*{/gm, 'for ($1 $2=$3; $4$5$6; $7) {');

  /**
   * F "for*<any order and spaces>*{"
   * T "for (classic 'foreach' order) {"
   */
  code = code.replaceAll(/for\s*\(\s*(\w+)\s+(\w)\s+:\s+(\w+)\s*\)\s*{/gm, 'for ($1 $2: $3) {');

  // TODO: more complex 'for' loops with more args
  return code;
}