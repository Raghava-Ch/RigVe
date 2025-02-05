---
sidebar_position: 4
---

## Prerequisites
- Visual Studio Code version 1.60.0 or higher
- Server components installed (see Server Setup below)

## Installing the Extension

### Direct Method
To install RigVe via the **VS Code Marketplace**, navigate to the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RigVe-tools.rigve) and search for **RigVe** in the extensions panel. Click **Install** to add the extension to your development environment.

### Manual Installation (via VSIX)
If you have obtained RigVe through an external source such as **Gumroad**, follow the steps below to install the extension manually:

1. Upon successful purchase, download the provided ZIP file.
2. Extract the ZIP file to access the folder containing the `**/PLUGINS/VS Code/rigve-<Version>.vsix` file.
3. Open **Visual Studio Code**.
4. Access the **Command Palette** by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
5. Type **"Install from VSIX"** and select the corresponding command.
6. Navigate to the extracted `.vsix` file and select it for installation.
7. Restart **Visual Studio Code** if necessary to complete the installation.
8. For additional guidance, refer to the [official VS Code documentation](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix).

## Server Setup Guide
1. Download the ZIP File
    - Upon successful purchase, download the provided ZIP file to your system.
2. Extract the Files
    - Locate the downloaded ZIP file and extract its contents to a preferred directory on your computer.
3. Open Visual Studio Code
    - Launch Visual Studio Code to proceed with the setup.
4. Access Settings
    - Open the Settings panel in VS Code.
    - In the search bar, type "RigVe" to locate the relevant settings.
5. Configure the Server Location
    - Find the setting labeled "RigVe: Server Location."
    - Click on it and set the extracted folder path as the server location.

Your RigVe server is now configured and ready to use. 🚀

## Verifying Installation
1. Open Visual Studio Code
2. Look for the RigVe icon in the activity bar
3. Click the icon to verify the extension is properly loaded
4. Check the status bar for server connection status

## Troubleshooting
If you encounter connection issues:
1. Verify server paths are correct
2. Check server service status
3. Ensure firewall settings allow localhost connection