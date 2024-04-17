import { EventTypeMain } from '../eventtypes';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getServerInfo: () => {
    return ipcRenderer.invoke(EventTypeMain.GetServerInfo);
  },
  broadcastLabUIReady: () => {
    ipcRenderer.send(EventTypeMain.LabUIReady);
  },
  recipeOpenFile: () => {
    return ipcRenderer.invoke(EventTypeMain.SelectFilePath);
  },
  recipeOpenFolder: () => {
    return ipcRenderer.invoke(EventTypeMain.SelectDirectoryPath);
  },
  getLicense: () => {
    return ipcRenderer.invoke(EventTypeMain.GetLicenseEvent);
  },
  validateLicense: (license: string) => {
    return ipcRenderer.invoke(EventTypeMain.ValidateLicenseEvent, license);
  }
});

export { };
