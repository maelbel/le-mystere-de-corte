  //////////////////////////////////
///           VARIABLES           ///
  //////////////////////////////////

const music = document.getElementById("music");
const video = document.getElementById("video");

const loading = $("#loading");

// Main-menu
const mainMenu = $("#main-menu");

const newButton = $("#new-button");
const loadButton = $("#load-button");
const settingsButton = $("#settings-button");
const quitButton = $("#quit-button");

const version = $("#version");

// Settings-menu
const settingsMenu = $("#settings-menu");

const musicVolume = $("#music-volume");
const videoVolume = $("#video-volume");
const musicPercent = $("#music-percent");
const videoPercent = $("#video-percent");

const printModeInput = $("#print-mode");
const resolutionInput = $("#resolution");

const lastSave = $("#last-save");

const backMenu = $("#back-menu");

// Game-menu
const gameMenu = $("#game-menu");

const contentControls = $("#content-controls");
const backButton = $("#back-button");
const backSecond = $('#back-second');
const nextChoice = $('#next-choice');

const play = $("#pause-play");
const contentVideo = $("#content-video");
const contentText = $("#content-text");

const contentChoices = $("#content-choices");

const gameSettingsButton = $('#game-settings-button');
const contentGameSettings = $("#content-game-settings");
const closeButton = $("#close-button");
const saveButton = $("#save-button");

let gameState;

let played = false;
let intervalShowChoices;


  //////////////////////////////////
///         INITIALISATION         ///
  //////////////////////////////////

// Lance la musique lors du chargement de l'interface
$(window).on('DOMContentLoaded', async function () {
    // On lance la musique
    music.play();

    // On affiche la version du jeu
    version.html("v" + await window.electronAPI.getAppVersion());

    // On cache les éléments inutiles
    gameMenu.hide();
    settingsMenu.hide();
    contentChoices.hide();
    backButton.hide();
    contentGameSettings.hide();

    // Initialisation des volumes
    setMusicVolume(musicVolume.val());
    setVideoVolume(videoVolume.val());
});

function saveGameState() {
    window.electronAPI.sendSaveGameState(gameState);
}

newButton.on('click', () => {
    window.electronAPI.sendShowLoader();
    switchDisplay(mainMenu, gameMenu);
    setTimeout(() => {
        window.electronAPI.sendNewGameState();
    }, 2000);
});

loadButton.on('click', () => {
    window.electronAPI.sendShowLoader();
    switchDisplay(mainMenu, gameMenu);
    setTimeout(() => {
        window.electronAPI.sendLoadGameState();
    }, 2000);
});

quitButton.on('click', () => {
    window.electronAPI.sendQuitGame();
});

backButton.on('click', () => {
    if (gameState.history.length > 0) {
        gameState.currentNode = gameState.history.pop();
        updateGameUI(gameState);
        saveGameState(); // Save the state after going back
    }
});

saveButton.on('click', () => {
    video.pause();
    window.electronAPI.sendShowLoader();
    music.load();
    music.play();
    closeButton.trigger('click');
    switchDisplay(gameMenu, mainMenu);
    updateLoadUI(gameState);
    setTimeout(() => {
        saveGameState();
    }, 2000);
});

window.electronAPI.loadGameData().then((data) => {
    gameData = data;
    // Initialisation de l'interface du jeu
}).catch((error) => {
    console.error('Erreur lors du chargement des données du jeu:', error);
});

window.electronAPI.checkLoadGameState().then((data) => {
    updateLoadUI(data);
}).catch((error) => {
    console.error('Erreur lors du chargement des données du jeu:', error);
});

function updateLoadUI(data) {
    gameState = data;
    // Modification du bouton charger la partie
    loadButton.removeAttr('disabled');
    lastSave.html(gameState.currentNode.charAt(0).toUpperCase() + gameState.currentNode.slice(1));
}

window.electronAPI.onUpdateGameState((event, state) => {
    updateGameUI(state);
});

function updateGameUI(state) {
    gameState = state;

    const nodeData = gameData[gameState.currentNode];
    if(!nodeData) return;

    updateBackButton();
    contentChoices.html("");
    contentChoices.hide();
    contentText.hide();
    contentVideo.hide();

    if(intervalShowChoices) clearInterval(intervalShowChoices);
    
    if(nodeData.video) {
        switchDisplay(contentText, contentVideo);
        video.src = nodeData.video;
        // On crée un moteur qui lance showChoices toutes les centièmes de seconde
        intervalShowChoices = setInterval(showChoices, 100);
    } else {
        video.src = "";
        contentText.html(`<h2>${gameState.currentNode.charAt(0).toUpperCase() + gameState.currentNode.slice(1)}</h2><br/><p id="text-replace">${nodeData.text}</p>`);
        switchDisplay(contentVideo, contentText);
        contentChoices.show();
    }

    if (nodeData.choices){
        for (const [key, value] of Object.entries(nodeData.choices)) {
            let optionText = value;
            let conditionMet = true;

            if (typeof value === 'object') {
                optionText = value.text;
                conditionMet = gameState.history.includes(value.condition);
            }

            if(conditionMet){
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = optionText;
                button.onclick = () => {
                    gameState.history.push(gameState.currentNode);
                    gameState.currentNode = key;
                    updateGameUI(gameState);
                    saveGameState();
                };
                contentChoices.append(button);
            }
        }
    }
}

function showChoices() {
    if (video.currentTime + 3 > video.duration) {
        contentChoices.fadeIn('slow');
    } else {
        contentChoices.hide();
    }
}

function switchDisplay(from, to) {
    from.hide();
    to.fadeIn('slow');
}

function updateBackButton() {
    if (gameState.history.length > 0) {
        backButton.show();
    } else {
        backButton.hide();
    }
}

video.addEventListener('canplay', function () {
    music.pause();
    video.play();
    played = true;
});

  //////////////////////////////////
///            OPTIONS             ///
  //////////////////////////////////

settingsButton.on("click", () => {
    switchDisplay(mainMenu, settingsMenu);
})

backMenu.on("click", () => {
    switchDisplay(settingsMenu, mainMenu);
});

// NAV-BAR
const btnOptionsList = ["audio","window","shortcuts","save"];
let btnList = [];
let contentList = [];

for(let button of btnOptionsList){
    let btn = document.getElementById(button);
    let content = document.getElementById(button + "-settings");
    btnList.push(btn);
    contentList.push(content);
    if(btn && contentList){
        btn.addEventListener("click", onAir, false);
    }else{console.error("Button or content doesn't exist!");}
}

function onAir(evt){
    let nbBtn = btnList.length;
    let id = evt.target.id;
    let content = document.getElementById(id + "-settings");
    for(let i=0;i<nbBtn;i++){
        btnList[i].classList.remove("active");
        contentList[i].style.display = "none";
    }
    evt.target.classList.add("active");
    content.style.display = "block";
}

window.electronAPI.getGameSettings().then((data) => {
    musicVolume.val(Math.round(data.music*100));
    videoVolume.val(Math.round(data.video*100));
    setMusicVolume(Math.round(data.music*100));
    setVideoVolume(Math.round(data.video*100));
}).catch((error) => {
    console.error('Erreur lors du chargement des paramètres du jeu:', error);
});

// AUDIO
function setMusicVolume(value) {
    // On définit le volume sur 100%
    music.volume = value/100;
    // On affiche le pourcentage du volume
    musicPercent.html(" " + value + "%");
}

function setVideoVolume(value) {
    // On définit le volume sur 100%
    video.volume = value/100;
    // On affiche le pourcentage du volume
    videoPercent.html(" " + value + "%");
}

function saveGameSettings() {
    let settings = {
        "music": music.volume,
        "video": video.volume
    }
    window.electronAPI.sendSaveGameSettings(settings);
}

// Au mouvement sur le musicVolume
musicVolume.on('mousemove', () => {
    setMusicVolume(musicVolume.val());
});

// Au mouvement sur le videoVolume
videoVolume.on('mousemove', () => {
    setVideoVolume(videoVolume.val());
});


printModeInput.on("change", () => {
    window.electronAPI.setPrintMode(printModeInput.val());
    saveGameSettings();
});

resolutionInput.on("change", () => {
    window.electronAPI.setResolution(resolutionInput.val());
    saveGameSettings();
});

musicVolume.on('mouseup', () => {
    saveGameSettings();
});

videoVolume.on('mouseup', () => {
    saveGameSettings();
});


  //////////////////////////////////
///   LANCER OU STOPPER LA VIDEO   ///
  //////////////////////////////////

// Si on click = lance ou stop la vidéo
play.on("click", toggleStateVideo);

// Si la touche espace est appuyée
$(document).on("keydown", function (e) {
    if (e.code == 'Space') {
        //lancer/stopper la vidéo
        toggleStateVideo();
    }
});

let isHidden = true;
// Fonction pour lancer/arreter la vidéo
function toggleStateVideo() {
    // Si la vidéo est jouée
    if (played) {
        // On la pause
        video.pause();
        // On affiche le curseur 
        play.css("cursor", "auto");

        // On affiche les controles
        contentControls.addClass('is-visible');
        isHidden = false;
        // On change par faux et renvoie la variable pour dire qu'elle n'est plus jouée
        played = false;
        return played;
    } else {
        // On joue la vidéo
        video.play();
        // On met un delai avant de
        setTimeout(function() {
                // Cacher le curseur
                play.css("cursor", "none");
                // Cacher les controles
                contentControls.removeClass('is-visible');
                isHidden = true;
        }, 2000);
        // On change par vrai et renvoie la variable pour dire qu'elle est jouée
        played = true;
        return played;
    }
}

/*      LES CONTROLES      */
let timeout;

// Quand la souris bouge sur la div play, on lance la fonction magicMouse
play.on("mousemove", controls);

// La fameuse fonction controls
function controls() {
    // Si timeout existe
    if (timeout) {
        // On clear
        clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
        // Si les controles sont visibles et que la vidéo est jouée
        if (!isHidden && played) {
            // On cache le curseur
            play.css("cursor", "none");
            // On cache les controles
            contentControls.removeClass('is-visible');
            isHidden = true;
        }else{
            // Sinon on affiche le curseur
            play.css("cursor", "auto");
            // On affiche les controles
            contentControls.addClass('is-visible');
            isHidden = false;
        }
    }, 2000); // Après un compteur de 2s
    // Si les controles sont cachés
    if (isHidden) {
        // On affiche le curseur 
        play.css("cursor", "auto");
        // On affiche les controles
        contentControls.addClass('is-visible');
        isHidden = false;
    }
};

// Quand la souris passe sur les controles
contentControls.on("mouseover", function(){
    // On affiche le curseur
    play.css("cursor", "auto");
    // On affiche les controles
    contentControls.addClass('is-visible');
    isHidden = false;
});

// Quand la souris passe sur les choix 
contentChoices.on("mouseover", function(){
    // On cache les controles
    contentControls.removeClass('is-visible');
    isHidden = true;
});



// Au clic sur option en jeu
gameSettingsButton.on("click", function(){
    // On affiche les options du jeu
    contentGameSettings.show();
});


// Au clic sur retour en jeu
closeButton.on("click", function(){
    // On affiche les options du jeu
    contentGameSettings.hide();
});


// Au clic sur previousSec
backSecond.on('click', function(){
    // On enlève 5s à la vidéo
    video.currentTime = (video.currentTime)-5;
});

// Pour nous les développeurs 
/*      VIDEO SUIVANTE      */

// Au clic sur la sVid
nextChoice.on("click", function(){
    // On passe directement au choix
    video.currentTime = (video.duration)-5;
});