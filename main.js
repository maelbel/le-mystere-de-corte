const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// On récupère la valeur dans le json
const settingsJSON = require("./assets/data/settings.json");
const savePath = path.join(app.getPath('userData'), 'savegame.json');
const appVersion = require('./package.json').version;

let mainWindow;
let loaderWindow;
let screenWidth;
let screenHeight;
let gameState;

function createLoaderWindow() {
  loaderWindow = new BrowserWindow({
    width: settingsJSON.size[0],
    height: settingsJSON.size[1],
    icon: path.join(__dirname, "./assets/images/icon.ico"),
    fullscreen: settingsJSON.fullscreen,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  loaderWindow.loadFile('./views/loader.html');
}


function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: settingsJSON.size[0],
    height: settingsJSON.size[1],
    icon: path.join(__dirname, "./assets/images/icon.ico"),
    fullscreen: settingsJSON.fullscreen,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    },
    show: false,
  });

  mainWindow.loadFile('index.html');

  if(settingsJSON.maximize){
    mainWindow.maximize();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      closeLoader();
      mainWindow.show();
    }, 2000); // 2 secondes de délai
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Définir l'AppUserModelID pour les fonctionnalités Windows
  app.setAppUserModelId(process.execPath);
  
  createLoaderWindow();
  createMainWindow();
});

//MENU
ipcMain.on('show-loader', () => {
  if (!loaderWindow) {
    createLoaderWindow();
  }
});

ipcMain.on('new-game-state', () => {
  closeLoader();

  // Initialise l'état du jeu avec le premier noeud du JSON
  gameState = {
    currentNode: 'intro',
    history: []
  };
  console.log('Nouvelle partie commencée !');
  // Met à jour l'interface utilisateur pour refléter la nouvelle partie
  mainWindow.webContents.send('update-game-state', gameState);
});

ipcMain.on('load-game-state', () => {
  closeLoader();

  if (fs.existsSync(savePath)) {
    const savedState = fs.readFileSync(savePath, 'utf-8');
    if(savedState){
      gameState = JSON.parse(savedState);
      // Mettre à jour l'interface utilisateur pour refléter la partie chargée
      mainWindow.webContents.send('update-game-state', gameState);
    } else {
      console.log('Aucune sauvegarde trouvée.');
    }
  }
});

ipcMain.on('save-game-state', (event, state) => {
  closeLoader();

  fs.writeFileSync(savePath, JSON.stringify(state), 'utf-8');
  console.log('Partie sauvegardée dans le fichier:', savePath);
});

ipcMain.on('quit-game', () => {
  app.quit();
});

function closeLoader(){
  if (loaderWindow) {
    loaderWindow.close();
    loaderWindow = null;
  }
}

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

// Configure un écouteur IPC pour fournir la version
ipcMain.handle('get-app-version', () => {
  return appVersion;
});

//Modification du mode d'affiche de la fenêtre
ipcMain.on("set-print-mode", (event, printMode) => {
  switch(printMode){
    case "fullscreen":
      mainWindow.setFullScreen(true);
      break;
    case "fullscreen-windowed":
      mainWindow.setFullScreen(false);
      mainWindow.maximize();
      break;
    case "windowed":
      mainWindow.setFullScreen(false);
      mainWindow.unmaximize();
      break;
  };
  console.log("set-to-" + printMode);
});

//Modification de la taille d'affiche de la fenêtre
ipcMain.on("set-resolution", (event, resolution) => {
  console.log("set-to-" + resolution);
  value = resolution.split('x');
  mainWindow.setContentSize(parseInt(value[0]), parseInt(value[1]));
  mainWindow.center();
});

// Sauvegarde des paramètres de la fenêtre 
ipcMain.on("save-game-settings", (event, gameSettings) => {
  let settings = {
    "music": gameSettings.music,
    "video": gameSettings.video,
    "size": mainWindow.getSize(),
    "fullscreen": mainWindow.isFullScreen(),
    "maximize": mainWindow.isMaximized()
  }
  fs.writeFileSync('./assets/data/settings.json', JSON.stringify(settings), 'utf-8');
});


// fermeture de l'application lorsqu'aucune fenêtre n'est ouverte et ce sur les plateformes non-macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
});






const menu = Menu.buildFromTemplate([
  {
    label: "Window",
    submenu: [
      {
        role: "reload",
      },
      {
        role: "forceReload"
      },
      {
        role: 'toggleDevTools'
      },
      {
        type: "separator"
      },
      {
        label: "FullScreen",
        click: () => {
          const fullscreen = mainWindow.isFullScreen()
          fullscreen?mainWindow.setFullScreen(false):mainWindow.setFullScreen(true)
        },
        accelerator: "f11"
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        click: () => {
          app.quit()
        },
      }
    ]
  }
])

Menu.setApplicationMenu(menu);
