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

	code = semiColon(code);

	code = keyOperator(code);

	code = indentation(code);

	code = conditions(code);

	code = forLoop(code);

	code = variables(code);

	// Remove more than 2 empty lines
	code = code.replaceAll(/\n{3,}/gm, '\n\n');
	code = code.replaceAll(/\}[\s\n]+\)/gm, '})');

	// Trailing spaces
	code = code.replaceAll(/[ \t]+$/gm, '');

	// if final 2 lines are empty, remove one
	if (code.endsWith('\n\n')) {
		code = code.slice(0, -1);
	}
	return code;
}

function semiColon(code: string): string {
	code = code.replaceAll(/;((?:(?!\/\/).)*?)(?=;)/gm, ';\n$1');
	code = code.replaceAll(/[\s\n]+;/gm, ';');
	code = code.replaceAll(/;([ \w]+)/gm, ';\n$1');

	// TODO: organize splitted words with /n
	// code = code.replace(/(?<!;)\n *([\S]+);?/gm, ' $1');
	return code;
}

function keyOperator(code: string): string {
	// Work with }
	code = code.replaceAll(/\}(?=[\S ]+)/gm, '}\n');
	code = code.replaceAll(/(?:[\w;]+ *)\}/gm, ';\n}');
	code = code.replaceAll(/\}\n *(?=.+\([\w ,]*\) *{)/gm, '}\n\n');


	// Work with {
	code = code.replaceAll(/\{(?=[\S\w ]+)/gm, '{\n');

	// Add space after {
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
	code = code.replaceAll(/\}[\s]*else \{/gm, '} else {');
	return code;
}

function forLoop(code: string): string {
	code = code.replaceAll(/for \([\s]*([\w\W]+?;)[\s]*([\w\W]+?;)[\s]*([\w+\-,]+)[\s]*?\)/gm, 'for ($1 $2 $3)');
	return code;
}

function variables(code: string): string {
	code = code.replaceAll(/\n(?=.+\([\w ,]*\) *{)/gm, '\n\n');
	return code;
}