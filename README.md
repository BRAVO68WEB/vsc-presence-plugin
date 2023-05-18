## `INDEV`

# Visual Studio Code Presence Plugin
> ## vs-presence-plugin

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/BRAVO68WEB/vsc-presence-plugin/build-vsix.yaml?color=blue&label=VSCODE%20Plugin%20Build&logo=visualstudiocode&logoColor=blue&style=for-the-badge)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/BRAVO68WEB/vsc-presence-plugin/build-n-test.yaml?color=green&label=Code%20Build&logo=Node.js&logoColor=green&style=for-the-badge)

## Description

This is a plugin for Visual Studio Code that allows you to project your vscode presence to a custom rich presence server.

## Installation

1. Download the latest release from the [releases page](https://github.com/BRAVO68WEB/vsc-presence-plugin/releases)
2. Install the plugin by running `code --install-extension vsc-presence-plugin.vsix` in your terminal.
3. Reload VSCode.

## Configuration

1. Open the settings menu by pressing `Ctrl + ,` or by navigating to `File > Preferences > Settings`.
2. Hit `Ctrl + Shift + P` and type `VSP: Set Publisher Key`.
3. Enter your `publisher key`.
4. Turn on Auto Start if you want the plugin to automatically start when you open VSCode by `Ctrl + Shift + P` and typing `VSP: Auto Start`, or `Ctrl + Shift + P` and type `VSP: Notice Presence`.
5. Reload VSCode.
6. You're done!