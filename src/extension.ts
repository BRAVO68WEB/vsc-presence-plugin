import * as vscode from 'vscode';
import * as WebSocket from 'ws';
import * as config from './config';
import * as fetch from 'node-fetch';

function getPresence(editor: vscode.TextEditor, ws: { send: (arg0: string) => void; }) {
	if (!config.get('PublisherKey')) {
		vscode.window.showErrorMessage('Please set your publisher key first');
		return;
	}
	let startTimestamp = Date.now();
	if (editor) {
		const filename = editor.document.fileName;
		const isInsider = vscode.env.appName.includes('Insider');
		const workspace = vscode.workspace.name;
		const language = editor.document.languageId;
		const line = editor.selection.active.line;
		const column = editor.selection.active.character;
		const text = editor.document.getText(editor.selection);
		const presence = {
			details: `${filename} | ${workspace}`,
			state: `${language} | ${line}:${column}`,
			largeImageKey: 'vscode',
			largeImageText: isInsider ? 'Visual Studio Code Insider' : 'Visual Studio Code',
			smallImageKey: language,
			smallImageText: `${language}`,
			startTimestamp: Date.now(),
			timeDiff: Date.now() - startTimestamp,
			text: text,
		};
		console.log(presence, text);

		const message = JSON.stringify({
			msgType: 'presence',
			presence, pubkey: config.get('PublisherKey')
		});
		ws.send(message);
		console.log('Sent initial message to server:', message);
	}
}

export function activate(context: vscode.ExtensionContext) {
	const WS_URL = 'ws://localhost:3000';
	const REST_URL = 'http://localhost:3000';

	let ws = new WebSocket(WS_URL);

	ws.on('close', () => {
		// Reconnect every 5 seconds
		console.log('Disconnected from WebSocket server');
		setTimeout(() => {
			ws = new WebSocket(WS_URL);
			ws.on('open', () => {
				console.log('Reconnected to WebSocket server');
				setInterval(() => {
					ws.send(JSON.stringify({
						msgType: 'heartbeat',
						pubkey: config.get('PublisherKey')
					}));
					console.log('Sent heartbeat to server');
				}, 9000);
			});
		}
			, 5000);
	});

	if (!config.get('PublisherKey')) {
		vscode.window.showErrorMessage('Please set your publisher key first');
		return;
	}

	if (!config.get('AutoStart')) {
		vscode.window.showInformationMessage('AutoStart is disabled. Please use the command "Start Monitoring" to start monitoring for presence.');
		return;
	} else {
		vscode.window.showInformationMessage('AutoStart is enabled. Monitoring for Presence!');

		ws.on('open', () => {
			console.log('Connected to WebSocket server');
			setInterval(() => {
				ws.send(JSON.stringify({
					msgType: 'heartbeat',
					pubkey: config.get('PublisherKey')
				}));
				console.log('Sent heartbeat to server');
			}, 9000);

			const editor = vscode.window.activeTextEditor;
			if (editor) {
				getPresence(editor, ws);
				console.log('Sent initial presence to server');
			}
			vscode.window.onDidChangeActiveTextEditor((editor) => {
				if (editor) {
					getPresence(editor, ws);
				}
			});
		});
	}

	let connectServer = vscode.commands.registerCommand('vsc-presence-plugin.connectServer', () => {
		ws = new WebSocket(WS_URL);
		ws.on('open', () => {
			console.log('Reconnected to WebSocket server');
			setInterval(() => {
				ws.send(JSON.stringify({
					msgType: 'heartbeat',
					pubkey: config.get('PublisherKey')
				}));
				console.log('Sent heartbeat to server');
			}, 9000);
		});
	});

	let startMonitoring = vscode.commands.registerCommand('vsc-presence-plugin.startMonitoring', () => {
		vscode.window.showInformationMessage('Monitoring for Presence!');

		ws.on('open', () => {
			console.log('Connected to WebSocket server');
			setInterval(() => {
				ws.send(JSON.stringify({
					msgType: 'heartbeat',
					pubkey: config.get('PublisherKey')
				}));
				console.log('Sent heartbeat to server');
			}, 9000);
		});

		const editor = vscode.window.activeTextEditor;
		if (!config.get('PublisherKey')) {
			vscode.window.showErrorMessage('Please set your publisher key first');
			return;
		}
		if (editor) {
			getPresence(editor, ws);
			console.log('Sent initial presence to server');
		}
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				getPresence(editor, ws);
			}
		});
	});

	let setPublisherkey = vscode.commands.registerCommand('vsc-presence-plugin.setPublisherkey', () => {
		vscode.window.showInputBox({
			prompt: 'Enter your publisher key',
			placeHolder: 'Publisher key',
			password: true,
		}).then((value) => {
			if (value) {
				config.update('PublisherKey', value);
				vscode.window.showInformationMessage('Publisher key saved');
			}
		});
	});

	let getFetchkey = vscode.commands.registerCommand('vsc-presence-plugin.getFetchkey', async () => {
		const pubkey: any = config.get('PublisherKey');
		const fKey: any = await fetch.default(`${REST_URL}/fetchkey/${pubkey}`).then((res) => {
			return res.json();
		});
		vscode.window.showInformationMessage(fKey.data.toString());
	});

	let setAutoStart = vscode.commands.registerCommand('vsc-presence-plugin.setAutoStart', () => {
		vscode.window.showInformationMessage('Auto start is now enabled');
		config.update('AutoStart', true);
	});;

	context.subscriptions.push(
		connectServer,
		startMonitoring,
		setPublisherkey,
		getFetchkey,
		setAutoStart
	);
}

export function deactivate() {
	console.log('Deactivated');
}