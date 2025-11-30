const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openOutputFolder: () => ipcRenderer.invoke('open-output-folder'),
    selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
    openLogFile: () => ipcRenderer.invoke('open-log-file')
});
