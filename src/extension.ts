import * as vscode from "vscode";
import * as path from "path";
import {
    getRootDirPath,
} from "./utilities";
import { handleNSDOption } from "./nsd";
import { trpc } from "./lib/trpc/client";

let serverCheckInterval: NodeJS.Timeout | undefined;

async function checkServerStatus(): Promise<boolean> {
    try {
        await trpc.health.query();
        return true;
    } catch (error) {
        return false;
    }
}

function startServerStatusMonitoring(runButton: vscode.StatusBarItem) {
    // if (serverCheckInterval) {
    //     clearInterval(serverCheckInterval);
    // }
    
    serverCheckInterval = setInterval(async () => {
        const isRunning = await checkServerStatus();
        if (!isRunning) {
            runButton.text = "$(stop) RigVe Offline";
            runButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
            vscode.window.showErrorMessage('RigVe server has stopped or crashed');
        } else {
            runButton.text = "$(pass) RigVe Online";
            runButton.backgroundColor = undefined;
        }
    }, 5000); // Check every 5 seconds
}

function monitorEditorChanges(context: vscode.ExtensionContext): void {
    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (editor) {
            const fileUri = editor.document.uri;
            const rootPath = getRootDirPath();
            const currentFileRelativePath = rootPath ? path.relative(rootPath, fileUri.fsPath) : fileUri.fsPath;
            await trpc.rigve_current_file.mutate(currentFileRelativePath);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(async (event) => {
        const fileUri = event.document.uri;
        const rootPath = getRootDirPath();
        const currentFileRelativePath = rootPath ? path.relative(rootPath, fileUri.fsPath) : fileUri.fsPath;
        await trpc.rigve_current_file.mutate(currentFileRelativePath);
    }, null, context.subscriptions);
}

export function activate(context: vscode.ExtensionContext): void {
    const nsDiagram = vscode.commands.registerCommand("RigVe.nsDiagram", handleNSDOption);

    const runCommand = vscode.commands.registerCommand('RigVe.runServer', async () => {
        const config = vscode.workspace.getConfiguration('RigVe');
        const serverLocation = config.get<string>('serverLocation', '**/');
        if (serverLocation === '**/') {
            vscode.window.showErrorMessage('Please set the server location in the settings');
            return;
        }
        
        const executablePath = `cd ${serverLocation}; bash runme.sh`;
        const terminal = vscode.window.createTerminal({
            name: 'RigVe Server',
            shellPath: '/bin/bash'
        });
        terminal.sendText(executablePath);
        terminal.show();
        
        // Wait a bit for the server to start
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const isRunning = await checkServerStatus();
        if (isRunning) {
            vscode.window.showInformationMessage('RigVe server started successfully');
            runButton.text = "$(pass) RigVe Online";
        } else {
            vscode.window.showErrorMessage('Failed to start RigVe server');
            runButton.text = "$(stop) RigVe Offline";
            runButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        }
    });
    
    context.subscriptions.push(
        nsDiagram,
        runCommand
    );
    // Create a "Run" button in the status bar
    const runButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    runButton.text = "$(play) RigVe"; // Use a built-in icon with text
    runButton.command = "RigVe.runServer"; // Command to execute on click
    runButton.tooltip = "Run rigve server"; // Tooltip on hover
    runButton.show();

    startServerStatusMonitoring(runButton);
    
    context.subscriptions.push(runButton, {
        dispose: () => {
            if (serverCheckInterval) {
                clearInterval(serverCheckInterval);
            }
        }
    });

    monitorEditorChanges(context);
}

export function deactivate(): void {
    if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
    }
}
