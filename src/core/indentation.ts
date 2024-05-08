export function indentation(code: string): string {
  // Indentation checking all lines
  let lines = code.split('\n');
  let formattedCode = '';
  let currentIdent = 0;
  let nextIdent = 0;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // if { is on the same line, increase indent
    if (line.includes('{')) {
      nextIdent++;
    }
    // if } is on the same line, decrease indent
    if (line.includes('}')) {
      nextIdent--;
      if (nextIdent < 0) {
        nextIdent = 0;
        console.error('Indentation error');
      }
    }

    const trimmedLine = line.trim();
    if (line.match(/^[\s]*\}/g)) {
      formattedCode += trimmedLine.replace(/^[\s]*\}/g, `${'  '.repeat(nextIdent)}\}\n`);
    } else {
      if (trimmedLine.length > 0) {
        formattedCode += '  '.repeat(currentIdent) + trimmedLine + '\n';
      } else {
        formattedCode += '\n';
      }
    }

    currentIdent = nextIdent;
  }
  return formattedCode;
  ;
}