import * as vscode from "vscode";
import path = require("path");

export function getRootDirPath(): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }
  return "";
}

export function getFilePath() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const uri = editor.document.uri;
    if (uri.scheme === "file") {
      return uri.fsPath;
    }
  }
  return "";
}

// Define the function to get the HTML content of the panel
export function getWebviewContent(
  api: string,
  path: string,
  file: string,
  func: string
) {
  console.log(`http://localhost:3000/${api}?file=${file}&func=${func}&path=${path}`);
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          iframe {
            display: block;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="http://localhost:3000/${api}?file=${file}&func=${func}&path=${path}"></iframe>
      </body>
    </html>`;
}
