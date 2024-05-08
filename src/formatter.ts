import { conditions } from "./core/conditions";
import { extra } from "./core/extra";
import { indentation } from "./core/identation";
import { key } from "./core/key";
import { loops } from "./core/loops";
import { methods } from "./core/methods";
import { semiColon } from "./core/semiColon";
import { spaces } from "./core/spaces";
import { variables } from "./core/variables";

export default function format(code: string): string {

  code = spaces(code);

  code = semiColon(code);

  code = key(code);

  code = indentation(code);

  code = methods(code);

  code = conditions(code);

  code = loops(code);

  code = variables(code);

  code = extra(code);

  return code;
}
