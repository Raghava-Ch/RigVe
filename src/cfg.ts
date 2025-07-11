import * as vscode from "vscode";
import * as path from "path";
import { getRootDirPath, getActiveFilePath, getWebviewContent, executeCommand } from "./utilities";

export function handleCFGOption(context: vscode.ExtensionContext): void {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }

    const selection = activeEditor.selection;
    const text = activeEditor.document.getText();
    const startOffset = Buffer.from(text.slice(0, activeEditor.document.offsetAt(selection.start))).length;
    const endOffset = Buffer.from(text.slice(0, activeEditor.document.offsetAt(selection.end))).length;
    const fnName = activeEditor.document.getText(selection);

    const panel = vscode.window.createWebviewPanel(
        "RigVeCFG",
        fnName,
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(
      async message => {
        const information = await executeCommand(rootPath, message.command, message.information);
        panel.webview.postMessage({ target: "iframe", command: 'uiGotCode', information: information });
      },
      undefined,
      context.subscriptions
    );

    const rootPath = getRootDirPath();
    const currentFilePath = getActiveFilePath();
    if (!rootPath || !currentFilePath) {
        return;
    }

    const relativePath = path.relative(rootPath, currentFilePath);
    panel.webview.html = getWebviewContent(
        "cfg_diagram",
        rootPath,
        relativePath,
        fnName,
        startOffset,
        endOffset
    );
}
