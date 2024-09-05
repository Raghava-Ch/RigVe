import * as vscode from 'vscode';
import axios from "axios";
const path = require('path');
import {handleNSDOption} from './nsd';
let timerInterval: NodeJS.Timeout | undefined;

let running = false;

interface Location {
    ln_start: number;
    ln_end: number;
    col_start: number;
    col_end: number;
}


function openFileToLine(fileName: string, lineNumber:Location) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folders are opened.');
        return;
    }

    if (!fileName) {
        vscode.window.showErrorMessage('File not found.');
        return;
    }

    // Replace 'example.txt' with the desired file name and lineNumber with the line number you want to navigate to.
    const desiredFileName = fileName || '';
    // const desiredLineNumber = lineNumber || 1; // Default to line 1 if not specified.

    const firstWorkspaceFolder = workspaceFolders[0];
    if (!firstWorkspaceFolder) {
        vscode.window.showErrorMessage('No workspace folders found.');
        return;
    }

    const filePath = path.join(firstWorkspaceFolder.uri.fsPath, desiredFileName);

    vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.window.showTextDocument(document, {
            selection: new vscode.Range(lineNumber.ln_start, lineNumber.col_start,  lineNumber.ln_end, lineNumber.col_end), // Adjust for 0-based line numbers
        });
    });
}

const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

async function performTaskWithProgressBar(msg: any) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification, // Location of the progress bar
        title: 'Indexing in Progress', // Title of the progress bar
        cancellable: true // Whether the progress bar can be cancelled
    }, async (progress, token) => {
        token.onCancellationRequested(() => {
            vscode.window.showInformationMessage('Indexing will be continiued background');
        });
        // This function will run asynchronously and can report progress to the progress bar
        let pValue = 0;
        // Perform your task here
        pValue = JSON.parse(msg.data.p_value);
        progress.report({ increment: 1, message: `${pValue}%` });
        for (;;) {
            const url = `http://localhost:3000/api/GetReqs`;
            
            try {
                const response = await axios.get(url);
                let message = JSON.parse(response.data.message);
                if (message[0].command === 'Notification_Progress') {
                    pValue = JSON.parse(message[0].data.p_value);
                }
            } catch (error) {
                // handle error
                console.error(error);
            }
            // Report progress to the progress bar
            progress.report({ increment: 1, message: `${pValue}%` });
            // Check if the operation is cancelled by the user
            if (token.isCancellationRequested || pValue > 99) {
                // Perform cleanup or handle cancellation logic
                break;
            }
        }
        
        // Task completed
        running = false;
        return new Promise(resolve => resolve('Indexing completed'));
    });
}

async function processTheCommand() {
    const url = `http://localhost:3000/api/GetReqs`;
    try {
        const response = await axios.get(url);
        // handle successful response

        let message = JSON.parse(response.data.message);
        if (message[0].command === 'OpenCode') {
            let loc = JSON.parse(message[0].data.loc);
            openFileToLine(message[0].data.def_file, loc);
        }
        else if (message[0].command === 'Notification_Info') {
            vscode.window.showInformationMessage(message[0].data);
        }
        else if (message[0].command === 'OpenNSD') {
            handleNSDOption(message[0].data.def_file, message[0].data.fun_name);
        }
        else if (message[0].command === 'Notification_Progress' && running === false) {
            running = true;
            performTaskWithProgressBar(message[0]).then(result => {
                vscode.window.showInformationMessage(`Compilation completed`);
            }).catch(error => {
                vscode.window.showErrorMessage(`Task failed: ${error}`);
            });
        }
    } catch (error) {
        // handle error
        console.error(error);
    }
}

export function startTimer() {
    if (timerInterval) {
        // Timer is already running
        return;
    }

    timerInterval = setInterval(() => {
        processTheCommand();
    }, 2000); // Timer ticks every 1 second (1000 milliseconds)
}

export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
        // vscode.window.showInformationMessage('Timer stopped.');
    }
}