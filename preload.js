window.addEventListener('DOMContentLoaded', () => {
  const { contextBridge } = require('electron')

  contextBridge.exposeInMainWorld('myAPI', {
    desktop: true
  })

  window.myAPI = {
    desktop: true
  }
  //console.log(window.myAPI)
  // => { desktop: true }

  //AFFICHER LA VERSION DU JEU
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  const packageText = require('./package.json')

  for (const dependency of ['description', 'version', 'author']){
    if (dependency==='version') replaceText(`${dependency}`, 'v' + packageText[dependency])
    else replaceText(`${dependency}`, packageText[dependency])
  }

  //MENU

  const electron = require('electron')
  const ipc = electron.ipcRenderer

  //Bouton quitter jeu 
  const btnQuit = document.getElementById('quitGame')
  btnQuit.addEventListener("click", () => {
    ipc.send("click-btn-quit")
  })

  //Bouton Mode d'affichage
  const btnApplyModeAffichage = document.getElementById('btnApplyModeAff')

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

  btnApplyModeAffichage.addEventListener("click", () => {
    var selectValue = getSelectValue('ModeAffichage');
    //Selon la valeur de selectValue
    switch(selectValue){
      case "1":
        ipc.send("switch-to-fullscreen");
        break;
      case "2":
        ipc.send("switch-to-maximize");
        break;
      case "3":
        ipc.send("switch-to-unmaximize");
        break;
    }
  })
    //Bouton Résolution
    const btnApplyResolution = document.getElementById('btnApplyResolution')
  
    btnApplyResolution.addEventListener("click", () => {
      var selectValue = getSelectValue('Resolution');
      //Selon la valeur de selectValue
      switch(selectValue){
        case "1":
          ipc.send("switch-to-3840x2160");
          break;
        case "2":
          ipc.send("switch-to-2560x1600");
          break;
        case "3":
          ipc.send("switch-to-1920x1200");
          break;
        case "4":
          ipc.send("switch-to-1920x1080");
          break;
        case "5":
          ipc.send("switch-to-1600x900");
          break;
        case "6":
          ipc.send("switch-to-1280x720");
          break;
        case "7":
          ipc.send("switch-to-800x600");
          break;
      }
    })

  // SAUVEGARDE

  const fs = require('fs');

  // DU JEU

  // DES SETTINGS
  
  const btnSaveSettings = window.document.getElementById('btnSaveSettings')
  
  const music = document.querySelector("#music");
  const vid = document.querySelector("video");

  btnSaveSettings.addEventListener("click", () => {

    ipc.send("save-window-settings");
    
    var settings = {
      "Musique": music.volume,
      "Video": vid.volume,
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
  vid.volume = settingsJSON.Video;

  // On récupère les variables pour modifier le volume des vidéos et de la musique
  var volMusic = document.querySelector("#volumeMusic");
  var volVid = document.querySelector("#volumeVid");
  // On récupère les variables pour modifier la value en pourcentage du volume
  var percentMusic = document.querySelector("#percentMusic");
  var percentVid = document.querySelector("#percentVid");

  // On définit le volume sur 100%
  volMusic.value = music.volume*100;
  volVid.value = vid.volume*100;

  // On affiche le pourcentage du volume
  percentMusic.innerHTML = " "+volMusic.value+"%";
  percentVid.innerHTML = " "+volVid.value+"%";

})