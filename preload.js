const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    loadGameData: () => {
      return new Promise((resolve, reject) => {
          fs.readFile(path.join(__dirname, 'assets/data/choices.json'), 'utf-8', (err, data) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(JSON.parse(data));
              }
          });
      });
    },
    onUpdateGameState: (callback) => ipcRenderer.on('update-game-state', callback),
    sendNewGameState: () => ipcRenderer.send('new-game-state'),
    sendLoadGameState: () => ipcRenderer.send('load-game-state'),
    sendShowLoader: () => ipcRenderer.send('show-loader'),
    sendSaveGameState: (state) => ipcRenderer.send('save-game-state', state),
    sendQuitGame: () => ipcRenderer.send("quit-game"),
    checkLoadGameState: () => {
      return new Promise(async (resolve, reject) => {
        let pathData = await ipcRenderer.invoke('get-user-data-path');
        fs.readFile(path.join(pathData, 'savegame.json'), 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
      });
    },
    getAppVersion: async () => {
      return await ipcRenderer.invoke('get-app-version');
    },
    getGameSettings: () => {
      return new Promise(async (resolve, reject) => {
        fs.readFile('./assets/data/settings.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
      });
    },
    setPrintMode: (printMode) => ipcRenderer.send('set-print-mode', printMode),
    setResolution: (resolution) => ipcRenderer.send('set-resolution', resolution),
    sendSaveGameSettings: (settings) => ipcRenderer.send('save-game-settings', settings)
});
