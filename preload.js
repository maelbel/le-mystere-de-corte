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
    sendQuitGame: () => ipcRenderer.send("quit-game")
});

window.addEventListener('DOMContentLoaded', () => {

  //AFFICHER LA VERSION DU JEU
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  const packageText = require('./package.json');

  for (const dependency of ['description', 'version', 'author']){
    if (dependency==='version') replaceText(`${dependency}`, 'v' + packageText[dependency])
    else replaceText(`${dependency}`, packageText[dependency])
  }

  //Bouton Mode d'affichage
  const applyPrintModeButton = document.getElementById('apply-print-mode-button');

  function getSelectValue(selectId)
  {
    /**On récupère l'élement html <select>*/
    var selectElmt = document.getElementById(selectId);
    /**
    selectElmt.options correspond au tableau des balises <option> du select
    selectElmt.selectedIndex correspond à l'index du tableau options qui est actuellement sélectionné
    */
    return selectElmt.options[selectElmt.selectedIndex].value;
  }

  applyPrintModeButton.addEventListener("click", () => {
    var selectValue = getSelectValue('print-mode');
    //Selon la valeur de selectValue
    switch(selectValue){
      case "1":
        ipcRenderer.send("switch-to-fullscreen");
        break;
      case "2":
        ipcRenderer.send("switch-to-maximize");
        break;
      case "3":
        ipcRenderer.send("switch-to-unmaximize");
        break;
    }
  })
    //Bouton Résolution
    const btnApplyResolution = document.getElementById('apply-resolution-button');
  
    btnApplyResolution.addEventListener("click", () => {
      var selectValue = getSelectValue('resolution');
      //Selon la valeur de selectValue
      switch(selectValue){
        case "1":
          ipcRenderer.send("switch-to-3840x2160");
          break;
        case "2":
          ipcRenderer.send("switch-to-2560x1600");
          break;
        case "3":
          ipcRenderer.send("switch-to-1920x1200");
          break;
        case "4":
          ipcRenderer.send("switch-to-1920x1080");
          break;
        case "5":
          ipcRenderer.send("switch-to-1600x900");
          break;
        case "6":
          ipcRenderer.send("switch-to-1280x720");
          break;
        case "7":
          ipcRenderer.send("switch-to-800x600");
          break;
      }
    })

  // SAUVEGARDE

  const fs = require('fs');

  // DU JEU

  // DES SETTINGS
  
  const saveSettingsButton = window.document.getElementById('save-settings-button')
  
  saveSettingsButton.addEventListener("click", () => {
    const music = document.querySelector("#music");
    const video = document.querySelector("#video");

    ipcRenderer.send("save-window-settings");
    
    var settings = {
      "Musique": music.volume,
      "Video": video.volume,
    };

    try { 
      let data = JSON.stringify(settings, null, 2);

      fs.writeFile('./settings.json', data, "utf-8", (err) => {
          if (err) throw err;
          console.log('Data written to file');
      });
    }
    catch(e) { alert('Failed to save the file !'); }
  })

  //Récupérer les settings
  // On récupère la valeur dans le json
  const settingsJSON = require("./settings.json");

  music.volume = settingsJSON.Musique;
  video.volume = settingsJSON.Video;

  // On récupère les variables pour modifier le volume des vidéos et de la musique
  var musicVolume = document.querySelector("#music-volume");
  var videoVolume = document.querySelector("#video-volume");
  // On récupère les variables pour modifier la value en pourcentage du volume
  var musicPercent = document.querySelector("#music-percent");
  var videoPercent = document.querySelector("#video-percent");

  // On définit le volume sur 100%
  musicVolume.value = music.volume*100;
  videoVolume.value = video.volume*100;

  // On affiche le pourcentage du volume
  musicPercent.innerHTML = " " + musicVolume.value + "%";
  videoPercent.innerHTML = " " + videoVolume.value + "%";

});
