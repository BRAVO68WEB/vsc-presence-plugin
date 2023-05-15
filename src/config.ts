import * as vscode from "vscode";

//

const vsconfig = () => vscode.workspace.getConfiguration("vsPresence");

export const get: (key: string) => any = (key: string) => {
    return vsconfig().get(key);
}

export const update: (key: string, value: any, skipWarning?: boolean) => void = (key: string, value: any) => {
    vsconfig().update(key, value, vscode.ConfigurationTarget.Global);
}