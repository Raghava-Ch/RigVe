import * as vscode from "vscode";
import * as path from "path";
import { getRootDirPath, getActiveFilePath, getWebviewContent } from "./utilities";

export function handleNSDOption(): void {
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
        "RigVe",
        fnName,
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const rootPath = getRootDirPath();
    const currentFilePath = getActiveFilePath();
    if (!rootPath || !currentFilePath) {
        return;
    }

    const relativePath = path.relative(rootPath, currentFilePath);
    panel.webview.html = getWebviewContent(
        "ns_diagram",
        rootPath,
        relativePath,
        fnName,
        startOffset,
        endOffset
    );
}
