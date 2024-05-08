import * as vscode from 'vscode';
import format from './formatter';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('pde', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const range = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
			try {
				return [vscode.TextEdit.replace(range, format(document.getText(range)))];
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
					return [vscode.TextEdit.replace(range, format(document.getText(range)))];
				} catch (error) {
					console.log(error);
					vscode.window.showErrorMessage('Error formatting code');
				}
				return [vscode.TextEdit.replace(range, document.getText(range))];
			}
		})
	);
}

