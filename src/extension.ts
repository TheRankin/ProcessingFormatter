import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('pde', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const range = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
			try {
				return [vscode.TextEdit.replace(range, formatCode(document.getText(range)))];
			} catch (error) {
				console.log(error);
				vscode.window.showErrorMessage('Error formatting code');
			}
			return [vscode.TextEdit.replace(range, document.getText(range))];
		}
	}));

	context.subscriptions.push(
		vscode.languages.registerDocumentRangeFormattingEditProvider('pde', {
			provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
				try {
					return [vscode.TextEdit.replace(range, formatCode(document.getText(range)))];
				} catch (error) {
					console.log(error);
					vscode.window.showErrorMessage('Error formatting code');
				}
				return [vscode.TextEdit.replace(range, document.getText(range))];
			}
		})
	);
}

function formatCode(code: string): string {

	code = spaces(code);

	code = semiColon(code);

	code = keyOperator(code);

	code = indentation(code);

	code = methods(code);

	code = conditions(code);

	code = forLoop(code);

	code = variables(code);

	/**
	 * F "<more than 2 new lines>"
	 * T "<2 lines>"
	 */
	code = code.replaceAll(/\n{3,}/gm, '\n\n');

	/**
	 * F "}<any space>)"
	 * T "})"
	 */
	code = code.replaceAll(/\}[\s\n]+\)/gm, '})');

	/**
	 * Trailing spaces
	 * F "<any extra space>"
	 * T ""
	 */
	code = code.replaceAll(/[ \t]+$/gm, '');

	// if final 2 lines are empty, remove one
	if (code.endsWith('\n\n')) {
		code = code.slice(0, -1);
	}
	return code;
}

function semiColon(code: string): string {
	/**
	 * F ";<any variable>;"
	 * T ";
	 * <any variable>;"
	 */
	code = code.replaceAll(/;((?:(?!\/\/).)*?)(?=;)/gm, ';\n$1');

	/**
	 * F "<any variable><any space>;"
	 * T "<any variable>;"
	 */
	code = code.replaceAll(/[\s\n]+;/gm, ';');

	// TODO: organize splitted words with /n
	// code = code.replace(/(?<!;)\n *([\S]+);?/gm, ' $1');
	return code;
}

function keyOperator(code: string): string {
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

function indentation(code: string): string {
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

function conditions(code: string): string {
	/**
	 * F "if       ("
	 * T "if ("
	 */
	code = code.replaceAll(/if\s*\(/gm, 'if (');

	/**
	 * F "}        else {"
	 * T "} else {"
	 */
	code = code.replaceAll(/\}[\s]*else \{/gm, '} else {');
	return code;
}

function forLoop(code: string): string {

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

function variables(code: string): string {
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

function spaces(code: string): string {
	/**
	 * F "<any variable spaces>"
	 * T "<type> <name>"
	 */
	code = code.replaceAll(/(?<![;\s]|\/\/.*|\*\/)[\s]{2,}/gm, ' ');
	return code;
}

function methods(code: string): string {
	/**
	 * F "<method name> ("
	 * T "<method name>("
	 */
	code = code.replaceAll(/\s+\(/gm, '(');

	/**
	 * F "<method name> ("
	 * T "<method name>("
	 */
	code = code.replaceAll(/\(\s/gm, '(');

	/**
	 * F "<method name>(arg1 , arg2)"
	 * T "<method name>(arg1, arg2)"
	 */
	code = code.replaceAll(/\s+,/gm, ',');

	/**
	 * F "<method name>(arg1,    arg2)"
	 * T "<method name>(arg1, arg2)"
	 */
	code = code.replaceAll(/,\s+/gm, ', ');

	/**
	 * F "<method name>(arg1, arg2 )"
	 * T "<method name>(arg1, arg2)"
	 */
	code = code.replaceAll(/(?=.)\s+\)/gm, ')');
	return code;
}