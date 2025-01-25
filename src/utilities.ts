import path = require('path');
import * as vscode from 'vscode';

export function getRootDirPath(): string {
    const folders = vscode.workspace.workspaceFolders;
    return folders?.[0]?.uri.fsPath ?? '';
}

export function getActiveFilePath(): string {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.uri.scheme === 'file' ? editor.document.uri.fsPath : '';
}

export async function executeCommand(rootPath: string, command: string, information: any) {
    switch (command) {
        case 'editorShowFile':
            // Open a code editor to the relative file path provided message.information
            const document = await vscode.workspace.openTextDocument(path.join(rootPath, information.file_path));
            const start = document.positionAt(information.start_byte);
            const end = document.positionAt(information.end_byte);
            const range = new vscode.Range(start, end);
            await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.Beside,
                preserveFocus: false
            });
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.selection = new vscode.Selection(start, end);
                editor.revealRange(range);
            }
            return;
    }
}

export function getWebviewContent(
    diagramApi: string,
    rootPath: string,
    filePath: string,
    fnName: string,
    startByte = 0,
    endByte = 0
): string {
    const port = 8129;
    const url = `http://localhost:${port}/${diagramApi}?prj_path=${rootPath}&file_path=${filePath}&fn_name=${fnName}&start_byte=${startByte}&end_byte=${endByte}`;
    
    console.log(url);
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      iframe { width: 100%; height: 100%; border: none; }
    </style>
  </head>
  <body>
    <iframe src="${url}"></iframe>
    <script>
        // Validate the source of the message if necessary
        const vscode = acquireVsCodeApi();
        // Listen for messages from the iframe
        window.addEventListener('message', (event) => {
            vscode.postMessage({
                command: event.data.command,
                information: event.data.information
            });
        });
    </script>
  </body>
</html>
`;
}
