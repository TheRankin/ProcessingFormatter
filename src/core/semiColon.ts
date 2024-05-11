import { replaceAll } from "./utils";

export function semiColon(code: string): string {
  /**
   * F ";<any variable>;"
   * T ";
   * <any variable>;"
   */
  code = replaceAll(code, /;((?:(?!\/\/).)*?)(?=;)/gm, ';\n$1');

  /**
   * F "<any variable><any space>;"
   * T "<any variable>;"
   */
  code = replaceAll(code, /[\s\n]+;/gm, ';');

  // TODO: organize splitted words with /n
  // code = code.replace(/(?<!;)\n *([\S]+);?/gm, ' $1');
  return code;
}