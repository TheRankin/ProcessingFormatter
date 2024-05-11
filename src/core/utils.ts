export function replaceAll(code: string, pattern: RegExp, replacement: string) {
  // TODO: console.log match and replacement to debug
  return code.replaceAll(pattern, replacement);
}

export function replace(code: string, pattern: RegExp, replacement: string) {
  // TODO: console.log match and replacement to debug
  return code.replace(pattern, replacement);
}