<<<<<<< HEAD
const {app, BrowserWindow, Menu } = require('electron');
const electron = require('electron');
// inclus le module 'path' tout en haut du fichier
const path = require('path');
const ipc = electron.ipcMain;
const fs = require('fs');

app.setAppUserModelId(process.execPath)

// On récupère la valeur dans le json
const windowJSON = require("./window.json");

let splash;
let mainWindow;
let screenWidth;
let screenHeight;

// modifier votre fonction createWindow()
function createWindow () {
=======
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// On récupère la valeur dans le json
const windowJSON = require("./window.json");

let mainWindow;
let loaderWindow;
let screenWidth;
let screenHeight;
let gameState;

function createLoaderWindow() {
  loaderWindow = new BrowserWindow({
    width: windowJSON.size[0],
    height: windowJSON.size[1],
    icon: path.join(__dirname, "./assets/images/icon.ico"),
    fullscreen: windowJSON.fullscreen,
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
>>>>>>> 7141aa8 (restart game)
  mainWindow = new BrowserWindow({
    width: windowJSON.size[0],
    height: windowJSON.size[1],
    icon: path.join(__dirname, "./assets/images/icon.ico"),
    fullscreen: windowJSON.fullscreen,
<<<<<<< HEAD
    maximizable: windowJSON.maximize,
    resizable: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
  })
  // We cannot require the screen module until the app is ready.
  const { screen } = require('electron')

  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  screenWidth = primaryDisplay.workAreaSize.width;
  screenHeight = primaryDisplay.workAreaSize.height;

  // create a new `splash`-Window 
  splash = new BrowserWindow({width: screenWidth, height: screenHeight, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(`file://${__dirname}/views/splash.html`);
  splash.center();
  
  //Ouvrir les web tools
  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(path.join("file://", __dirname, '/index.html'))

  if(windowJSON.maximize){
    mainWindow.maximize()
  }

  mainWindow.on("closed", function() {
    mainWindow = null
  })

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    splash.destroy();
    mainWindow.show();
  });
}
//MENU

//Bouton quitGame
ipc.on("click-btn-quit", function(event){
  mainWindow.close()
})

//Modification de la taille d'affiche de la fenêtre
//Plein écran
ipc.on("switch-to-fullscreen", function(event){
  console.log("switch-to-fullscreen");
  mainWindow.setContentSize(screenWidth, screenHeight);
  mainWindow.setFullScreen(true);
})
//Plein écran fenêtré
ipc.on("switch-to-maximize", function(event){
=======
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

  if(windowJSON.maximize){
    mainWindow.maximize();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      if (loaderWindow) {
          loaderWindow.close();
          loaderWindow = null;
      }
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
  if (loaderWindow) {
      loaderWindow.close();
      loaderWindow = null;
  }
  newGameState();
});

ipcMain.on('load-game-state', () => {
  if (loaderWindow) {
      loaderWindow.close();
      loaderWindow = null;
  }
  loadGameState();
});

ipcMain.on('save-game-state', (event, state) => {
  saveGameState(state);
});

ipcMain.on('quit-game', () => {
  app.quit();
});

function newGameState() {
  // Initialise l'état du jeu avec le premier noeud du JSON
  gameState = {
      currentNode: 'intro',
      history: []
  };
  console.log('Nouvelle partie commencée !');
  // Met à jour l'interface utilisateur pour refléter la nouvelle partie
  mainWindow.webContents.send('update-game-state', gameState);
}

function saveGameState(state) {
  const savePath = path.join(app.getPath('userData'), 'savegame.json');
  fs.writeFileSync(savePath, JSON.stringify(state), 'utf-8');
  console.log('Partie sauvegardée dans le fichier:', savePath);
}

function loadGameState() {
  const savePath = path.join(app.getPath('userData'), 'savegame.json');
  if (fs.existsSync(savePath)) {
    const savedState = fs.readFileSync(savePath, 'utf-8');
    if(savedState){
      const gameState = JSON.parse(savedState);
      // Mettre à jour l'interface utilisateur pour refléter la partie chargée
      mainWindow.webContents.send('update-game-state', gameState);
    } else {
      console.log('Aucune sauvegarde trouvée.');
    }
  }
}

//Modification de la taille d'affiche de la fenêtre
//Plein écran
ipcMain.on("switch-to-fullscreen", function(event){
  console.log("switch-to-fullscreen");
  mainWindow.setContentSize(screenWidth, screenHeight);
  mainWindow.setFullScreen(true);
});
//Plein écran fenêtré
ipcMain.on("switch-to-maximize", function(event){
>>>>>>> 7141aa8 (restart game)
  console.log("switch-to-maximize");
  mainWindow.setFullScreen(false);
  mainWindow.maximize();
  mainWindow.setContentSize(screenWidth, screenHeight);
<<<<<<< HEAD
})
//Fenêtré
ipc.on("switch-to-unmaximize", function(event){
=======
});
//Fenêtré
ipcMain.on("switch-to-unmaximize", function(event){
>>>>>>> 7141aa8 (restart game)
  console.log("switch-to-unmaximize");
  mainWindow.setFullScreen(false);
  mainWindow.unmaximize();
  mainWindow.center();
<<<<<<< HEAD
})

//3840x2160
ipc.on("switch-to-3840x2160", function(event){
  console.log("switch-to-3840x2160");
  mainWindow.setContentSize(3840, 2160);
  mainWindow.center();
})
//2560x1600
ipc.on("switch-to-2560x1600", function(event){
  console.log("switch-to-2560x1600");
  mainWindow.setContentSize(2560, 1600);
  mainWindow.center();
})
//1920x1200
ipc.on("switch-to-1920x1200", function(event){
  console.log("switch-to-1920x1200");
  mainWindow.setContentSize(1920, 1200);
  mainWindow.center();
})
//1920x1080
ipc.on("switch-to-1920x1080", function(event){
  console.log("switch-to-1920x1080");
  mainWindow.setContentSize(1920, 1080);
  mainWindow.center();
})
//1600x900
ipc.on("switch-to-1600x900", function(event){
  console.log("switch-to-1600x900");
  mainWindow.setContentSize(1600, 900);
  mainWindow.center();
})
//1280x720
ipc.on("switch-to-1280x720", function(event){
  console.log("switch-to-1280x720");
  mainWindow.setContentSize(1280, 720);
  mainWindow.center();
})
//800x600
ipc.on("switch-to-800x600", function(event){
  console.log("switch-to-800x600");
  mainWindow.setContentSize(800, 600);
  mainWindow.center();
})

// sauvegarde des paramètres de la fenêtre 
ipc.on("save-window-settings", function(event){  
=======
});

//3840x2160
ipcMain.on("switch-to-3840x2160", function(event){
  console.log("switch-to-3840x2160");
  mainWindow.setContentSize(3840, 2160);
  mainWindow.center();
});
//2560x1600
ipcMain.on("switch-to-2560x1600", function(event){
  console.log("switch-to-2560x1600");
  mainWindow.setContentSize(2560, 1600);
  mainWindow.center();
});
//1920x1200
ipcMain.on("switch-to-1920x1200", function(event){
  console.log("switch-to-1920x1200");
  mainWindow.setContentSize(1920, 1200);
  mainWindow.center();
});
//1920x1080
ipcMain.on("switch-to-1920x1080", function(event){
  console.log("switch-to-1920x1080");
  mainWindow.setContentSize(1920, 1080);
  mainWindow.center();
});
//1600x900
ipcMain.on("switch-to-1600x900", function(event){
  console.log("switch-to-1600x900");
  mainWindow.setContentSize(1600, 900);
  mainWindow.center();
});
//1280x720
ipcMain.on("switch-to-1280x720", function(event){
  console.log("switch-to-1280x720");
  mainWindow.setContentSize(1280, 720);
  mainWindow.center();
});
//800x600
ipcMain.on("switch-to-800x600", function(event){
  console.log("switch-to-800x600");
  mainWindow.setContentSize(800, 600);
  mainWindow.center();
});

// sauvegarde des paramètres de la fenêtre 
ipcMain.on("save-window-settings", function(event){  
>>>>>>> 7141aa8 (restart game)
  let window = {
    "size": mainWindow.getSize(),
    "fullscreen": mainWindow.isFullScreen(),
    "maximize": mainWindow.isMaximized()
  }

  try { 
    let data = JSON.stringify(window, null, 2);

    fs.writeFile('./window.json', data, "utf-8", (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
  }
  catch(e) { alert('Failed to save the file !'); }
<<<<<<< HEAD
})

app.whenReady().then(createWindow);
=======
});


>>>>>>> 7141aa8 (restart game)

// fermeture de l'application lorsqu'aucune fenêtre n'est ouverte et ce sur les plateformes non-macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
<<<<<<< HEAD
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
=======
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
});





>>>>>>> 7141aa8 (restart game)

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

<<<<<<< HEAD
Menu.setApplicationMenu(menu)
=======
Menu.setApplicationMenu(menu);
>>>>>>> 7141aa8 (restart game)
