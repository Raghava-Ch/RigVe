// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";
import path = require("path");
import {startTimer, stopTimer} from "./timer";
import {
  getRootDirPath,
  getFilePath,
  getWebviewContent
} from "./utilities";
import {handleNSDOption} from './nsd';

function handleSequenceOption() {

  const activeEditor = vscode.window.activeTextEditor;
  let filPath: string = "", funName: string = "";
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
          panel.webview.html = getWebviewContent("sequence", rootPath, filePath, fnName);
      }
  }
  else {
    vscode.window.showInformationMessage('Please select the function name');
  }
}


function handleDepandanciesOption() {
  // Implement the logic for your custom option here
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  // Get the current selection range
  let selection = editor.selection;
  let start = selection.start;
  let end = selection.end;
  // Get the text at the cursor position
  let fnName: string = "";
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const fileName = path.basename(activeEditor.document.fileName);
    let selection = activeEditor.selection;
    let start = selection.start;
    let end = selection.end;
    // Get the text at the cursor position
    let fnName = editor.document.getText(
      new vscode.Range(start, end)
    );
    const panel = vscode.window.createWebviewPanel(
      "RigVe",
      fileName,
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    let rootPath = getRootDirPath();
    let filePath = getFilePath();

    if (rootPath !== undefined) {
      // Set the HTML content of the panel to your Next.js app URL

      panel.webview.html = getWebviewContent("dependancy", rootPath, filePath, "");
    }
  }
}

let disposable: vscode.Disposable;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  startTimer();

  	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
  disposable = vscode.commands.registerCommand(
    "RigVe.setPath",
    setRootDirectory
  );

  context.subscriptions.push(disposable);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
  // Register the onDidOpenTextDocument event

  let disposable2 = vscode.commands.registerCommand(
    "RigVe.sequence",
    handleSequenceOption
  );
  context.subscriptions.push(disposable2);

  let disposable3 = vscode.commands.registerCommand(
    "RigVe.nsDiagram",
    () => {handleNSDOption("", "");}
  );
  context.subscriptions.push(disposable3);

  let disposable4 = vscode.commands.registerCommand(
    "RigVe.depDiagram",
    handleDepandanciesOption
  );
  context.subscriptions.push(disposable4);

  // Register the "extension.stopTimer" command
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.stopTimer', stopTimer)
);
}

async function setRootDirectory() {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
  // vscode.window.showInformationMessage('Hello World from RigVe!');
  let rDir = getRootDirPath();
  const url = `http://localhost:3000/api/SetRootDir?dir=${rDir}`;
  try {
    const response = await axios.get(url);
    // handle successful response
  } catch (error) {
    // handle error
    console.error(error);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {
  // disposable.dispose();
  stopTimer();
}
