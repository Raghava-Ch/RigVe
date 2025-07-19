import path = require("path");
import * as vscode from "vscode";

export function getRootDirPath(): string {
    const folders = vscode.workspace.workspaceFolders;
    return folders?.[0]?.uri.fsPath ?? "";
}

export function getActiveFilePath(): string {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.uri.scheme === "file"
        ? editor.document.uri.fsPath
        : "";
}

async function showFile(rootPath: string, information: any) {
    // Open a code editor to the relative file path provided message.information
    const document = await vscode.workspace.openTextDocument(
        path.join(rootPath, information.file_path),
    );
    const start = document.positionAt(information.start_byte);
    const end = document.positionAt(information.end_byte);
    const range = new vscode.Range(start, end);
    await vscode.window.showTextDocument(document, {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: false,
    });
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.selection = new vscode.Selection(start, end);
        editor.revealRange(range);
    }
}

async function mapCodeFromFile(rootPath: string, information: any): Promise<any> {
    // get the source code from the given start and stop bytes and return it
    const document = await vscode.workspace.openTextDocument(
        path.join(rootPath, information.file_path)
    );
    let coded_nodes = information.nodes.map((node: any) => {
        // Calculate code units (UTF-16) from byte offsets to handle emojis and surrogate pairs correctly
        const fileBuffer = Buffer.from(document.getText(), 'utf8');
        const startByte = node.data.CfgNodeData.startByte;
        const endByte = node.data.CfgNodeData.endByte;
        // Convert byte offsets to string offsets
        const textDecoder = new TextDecoder('utf-8');
        const startOffset = textDecoder.decode(Uint8Array.prototype.slice.call(fileBuffer, 0, startByte)).length;
        const endOffset = textDecoder.decode(Uint8Array.prototype.slice.call(fileBuffer, 0, endByte)).length;
        const start = document.positionAt(startOffset);
        const end = document.positionAt(endOffset);
        const range = new vscode.Range(start, end);
        const code = document.getText(range);
        return {
            ...node,
            data: {
            ...node.data,
            code
            }
        };
    });

    return coded_nodes;
}

export async function executeCommand(
    rootPath: string,
    command: string,
    information: any,
): Promise<undefined | any> {
    switch (command) {
        case "editorShowFile":
            await showFile(rootPath, information);
            return undefined;

        case "editorMapCode":
            let coded_nodes = await mapCodeFromFile(rootPath, information);
            return {
                file_path: rootPath,
                nodes: coded_nodes,
            };
    }
}

export function getWebviewContent(
    diagramApi: string,
    rootPath: string,
    filePath: string,
    fnName: string,
    startByte = 0,
    endByte = 0,
): string {
    const port = 8129;
    const baseUrl = `http://localhost:${port}`;
    const params = new URLSearchParams({
        prj_path: rootPath,
        file_path: filePath,
        fn_name: fnName,
        start_byte: startByte.toString(),
        end_byte: endByte.toString(),
    });
    const url = `${baseUrl}/${diagramApi}?${params.toString()}`;
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
    <iframe id="diagramFrame" src="${url}"></iframe>
    <script>
        // Validate the source of the message if necessary
        const vscode = acquireVsCodeApi();
        const idiagramFrame = document.getElementById('diagramFrame');
        // Listen for messages from the iframe and send it to vs code
        window.addEventListener('message', (event) => {
            if (event.data.target === 'editor') {
                vscode.postMessage({
                    command: event.data.command,
                    information: event.data.information
                });
            }
        });
        
        // Listen for messages from the Vs Code and send it to iframe
        window.addEventListener('message', (event) => {
            if (event.data.target === 'iframe') {
                console.log("iframe traget", event.data);
                idiagramFrame.contentWindow.postMessage({
                    command: event.data.command,
                    information: event.data.information
                }, '*');
            }
        });
    </script>
  </body>
</html>
`;
}
