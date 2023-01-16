// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs')
const path = require('path')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let openFileOnPath = vscode.commands.registerCommand('pathify.openFileOnPath', function () {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		let regeTon = new RegExp(/(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')/);
		//Get the selection starting from the cursor position and searching for a regular expression (default search between quotes or double quotes)
		let range = editor.document.getWordRangeAtPosition(editor.selection.active, regeTon);

		if (range) {
			var currentlyOpenTabfilePath = editor.document.fileName;
			//Get the pure match against the regualr expression
			let text = editor.document.getText(range);
			let strippedFromQuotes = text.substring(1, text.length - 1);

			var resolvedPath;

			if (strippedFromQuotes.startsWith('.')) {
				// relative path
				let segments = strippedFromQuotes.split("/");

				resolvedPath = path.join(path.dirname(currentlyOpenTabfilePath), ...segments);
			} else {
				resolvedPath = strippedFromQuotes;
			}

			if (!fs.existsSync(resolvedPath)) {
				vscode.window.showInformationMessage("File does not exist.")
				return;
			}

			let url = vscode.Uri.parse('file:///' + resolvedPath);
			vscode.commands.executeCommand('vscode.open', url);
		}

		
	});

	context.subscriptions.push(openFileOnPath);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
