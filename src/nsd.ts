import * as vscode from "vscode";
import path = require("path");
import {
    getRootDirPath,
    getFilePath,
    getWebviewContent
} from "./utilities";

export function handleNSDOption(filPath: string, funName: string) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        // Implement the logic for your custom option here
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const fileName = path.basename(activeEditor.document.fileName);
        let selection = activeEditor.selection;
        let start = selection.start;
        let end = selection.end;
        // Get the text at the cursor position
        let fnName = funName === "" ? editor.document.getText(
            new vscode.Range(start, end)
        ) : funName;
        const panel = vscode.window.createWebviewPanel(
            "RigVe",
            fnName,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        let rootPath = getRootDirPath();
        let filePath = filPath === "" ? getFilePath() : filPath;

        if (rootPath !== undefined) {
            panel.webview.html = getWebviewContent("nsd", rootPath, filePath, fnName);
        }
    }
    else if (funName !== "") {
        // Get the text at the cursor position
        let fnName = funName;
        const panel = vscode.window.createWebviewPanel(
            "RigVe",
            fnName,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        let rootPath = getRootDirPath();
        let filePath: string = rootPath + filPath.slice(1);
        if (filePath !== undefined) {
            // Set the HTML content of the panel to your Next.js app URL
            panel.webview.html = getWebviewContent("nsd", "", filePath, fnName);
        }
    }
}
