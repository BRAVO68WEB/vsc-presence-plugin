import * as vscode from 'vscode';
import * as WebSocket from 'ws';

// Function to save data to settings.json
function saveDataToSettings(data: any) {
	const config = vscode.workspace.getConfiguration();
	const target = config.inspect('vsPresennce.data');
  
	if (target && target.workspaceFolderValue) {
	  // Update the value in the workspace settings
	  config.update('vsPresennce.data', data, vscode.ConfigurationTarget.Workspace);
	} else {
	  // Update the value in the global settings
	  config.update('vsPresennce.data', data, vscode.ConfigurationTarget.Global);
	}
} 

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vsc-presence-plugin" is now active!');
	
	const ws = new WebSocket('ws://localhost:3000');

	let disposable = vscode.commands.registerCommand('vsc-presence-plugin.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vsc-presence-plugin!');
	});

	let disposable2 = vscode.commands.registerCommand('vsc-presence-plugin.startMonitoring', () => {
		vscode.window.showInformationMessage('Monitoring for Presence!');
		
		ws.on('open', () => {
			console.log('Connected to WebSocket server');
		})

		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				const filename = editor.document.fileName;
				const workspace = vscode.workspace.name;
				const language = editor.document.languageId;
				const line = editor.selection.active.line;
				const column = editor.selection.active.character;
				const text = editor.document.getText(editor.selection);
				const presence = {
					details: `${filename} | ${workspace}`,
					state: `${language} | ${line}:${column}`,
					largeImageKey: 'vscode',
					largeImageText: 'Visual Studio Code',
					smallImageKey: 'vscode',
					smallImageText: 'Visual Studio Code',
					instance: false,
				};
				console.log(presence, text);
				
				setInterval(() => {
					const message = JSON.stringify({
					presence, text
					});
					ws.send(message);
					console.log('Sent message to server:', message);
				}, 1000);				

				ws.on('message', (message: string) => {
					console.log('Received message from server:', message);
				});	  
			}
		});
	});

	

	context.subscriptions.push(disposable, disposable2);
}

export function deactivate() {
	console.log('Deactivated');
}