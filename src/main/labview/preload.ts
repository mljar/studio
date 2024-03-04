import { dialog } from 'electron';
import { EventTypeMain } from '../eventtypes';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getServerInfo: () => {
    return ipcRenderer.invoke(EventTypeMain.GetServerInfo);
  },
  broadcastLabUIReady: () => {
    ipcRenderer.send(EventTypeMain.LabUIReady);
  },
  recipeOpenFile: async () => {
    console.log('recipeOpenFile');
    ipcRenderer.invoke(EventTypeMain.SelectFilePath);
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
      return filePaths[0]
    }
  },
});

export { };
