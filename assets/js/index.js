<<<<<<< HEAD
const music = document.querySelector("#music");
const vid = document.querySelector("video");

var choix;
// Lance la musique lors du chargement de l'interface
window.addEventListener('load', function () {
    music.play();
});

  //////////////////////////////////
///             JOUER              ///
  //////////////////////////////////

// Click sur le bouton "jouer"
$('#new').on("click", start);

function start(){
    //displayCreateLoading();
    //actionSwitchScene('#interface', '#loadingScreen', 'flex');
    //setTimeout(function (){
        music.pause();
        console.log("Jeu lancé !");
    //    actionSwitchScene('#loadingScreen', '#jeu', 'block');
    //    displayDestroyLoading();
    //}, 1000);
    
    displayNewChoice("1");

    actionSwitchScene('#interface', '#jeu', 'block');
}

// Lance l'écran de chargement
function displayCreateLoading() {
    html = "";

    html += "<div id='loadingScreen'>Chargement</div>";

    $('body').prepend(html);
}

function displayDestroyLoading(){
    $('#loadingScreen').remove();
}

/*      LES CONTROLES      */
var timeout;
controls();
var played =true;
var isHidden = false;
var overlay = document.querySelector("#overlay");
// Quand la souris bouge sur la div play, on lance la fonction magicMouse
overlay.addEventListener("mousemove", controls);

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
            overlay.style.cursor = "none";
            // On cache les controles
            overlay.classList.remove('is-visible');
            isHidden = true;
        }else{
            // Sinon on affiche le curseur
            overlay.style.cursor = "auto";
            // On affiche les controles
            overlay.classList.add('is-visible');
            isHidden = false;
        }
    }, 2000); // Après un compteur de 2s
    // Si les controles sont cachés
    if (isHidden) {
        // On affiche le curseur 
        overlay.style.cursor = "auto";
        // On affiche les controles
        overlay.classList.add('is-visible');
        isHidden = false;
    }
};

function displayNewChoice(reference){
    for(let choice in Choices) {
        for(let ref in Choices[choice]["references"]){
            if(Choices[choice]["references"][ref] == reference){
                choix = new Choice(choice, Choices[choice]["choices"], Choices[choice]["references"]);
            }
        }
    }
}

function actionSwitchScene(from, to, display = "block"){
    $(from).css("display", "none");
    $(to).css("display", display);
=======
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

// Settings-menu
const settingsMenu = $("#settings-menu");
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

const content = $("#content-choice");

const gameSettingsButton = $('#game-settings-button');
const contentSettings = $("#content-settings");
const closeButton = $("#close-button");
const saveButton = $("#save-button");

let played = false;

  //////////////////////////////////
///         INITIALISATION         ///
  //////////////////////////////////

// Lance la musique lors du chargement de l'interface
$(window).on('DOMContentLoaded', function () {
    // Lance l'écran de chargement
    loading.fadeIn();
    music.play();
    // On cache les menus
    mainMenu.hide();
    gameMenu.hide();
    settingsMenu.hide();

    content.hide(); 
    backButton.hide();
    contentSettings.hide();
});

$(window).on('load', function () {
    switchDisplay(loading, mainMenu);
});

video.addEventListener('canplay', function (){
    console.log("Data loaded!");
    switchDisplay(loading, gameMenu);
});


  //////////////////////////////////
///             CHOIX             ///
  //////////////////////////////////


// fetch('choices.encrypted.json')
//     .then(response => response.text())
//     .then(ciphertext => {
//         const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
//         const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//         const data = JSON.parse(decryptedData);
fetch('./assets/data/choices.json')
    .then(response => response.json())
    .then(data => {    

        let currentState = 'intro';
        const stateHistory = [];

        let intervalShowChoices;

        function renderState(state) {
            const stateData = data[state];
            if (!stateData) return;

            content.html("");
            content.hide();
            contentText.hide();
            contentVideo.hide();

            if(intervalShowChoices) clearInterval(intervalShowChoices);

            if (stateData.video) {
                switchDisplay(contentText, contentVideo);
                video.src = stateData.video;
                video.play();
                // On crée un moteur qui lance showChoices toutes les centièmes de seconde
                intervalShowChoices = setInterval(showChoices, 100);
            } else {
                video.src = "";
                contentText.html(`<h2>${currentState.charAt(0).toUpperCase() + currentState.slice(1)}</h2><br/><p id="text-replace">${stateData.text}</p>`);
                switchDisplay(contentVideo, contentText);
                content.show();
            }

            if (stateData.options) {
                for (const [key, value] of Object.entries(stateData.options)) {
                    let optionText = value;
                    let conditionMet = true;

                    if (typeof value === 'object') {
                        optionText = value.text;
                        conditionMet = stateHistory.includes(value.condition);
                    }

                    if(conditionMet){
                        const button = document.createElement('button');
                        button.className = 'choice-button';
                        button.textContent = optionText;
                        button.onclick = () => {
                            stateHistory.push(currentState);
                            currentState = key;
                            renderState(currentState);
                            updateBackButton();
                        };
                        content.append(button);
                    }
                }
            }
        }

        function updateBackButton() {
            if (stateHistory.length > 0) {
                backButton.show();
            } else {
                backButton.hide();
            }
        }

        function saveState() {
            const saveData = {
                currentState: currentState,
                stateHistory: stateHistory
            };
            localStorage.setItem('gameState', JSON.stringify(saveData));
        }

        function newState() {
            switchDisplay(mainMenu, loading);
            currentState = 'intro';
            stateHistory.splice(0, stateHistory.length);
            saveState();
            renderState(currentState);
            updateBackButton();
            start();
            // switchDisplay(loading, gameMenu);
        }

        function loadState(e) {
            const savedData = localStorage.getItem('gameState');
            if (savedData) {
                loadButton.removeAttr('disabled');
                if(e){
                    switchDisplay(mainMenu, loading);
                    const { currentState: loadedState, stateHistory: loadedHistory } = JSON.parse(savedData);
                    currentState = loadedState;
                    stateHistory.splice(0, stateHistory.length, ...loadedHistory);
                    renderState(currentState);
                    updateBackButton();
                    start();
                    // switchDisplay(loading, gameMenu);
                }
            }
        }

        backButton.on('click', () => {
            if (stateHistory.length > 0) {
                currentState = stateHistory.pop();
                renderState(currentState);
                updateBackButton();
                saveState(); // Save the state after going back
            }
        });

        saveButton.on('click', () => {
            switchDisplay(gameMenu, loading);
            video.pause();
            saveState();
            closeButton.trigger('click');
            music.load();
            music.play();
            switchDisplay(loading, mainMenu);
        });

        newButton.on('click', newState);
        loadButton.on('click', loadState);

        loadState(); // Load the state when the page loads
    })
    .catch(error => console.error('Error loading choices:', error));


  //////////////////////////////////
///             JOUER              ///
  //////////////////////////////////

function switchDisplay(from, to) {
    from.hide();
    to.fadeIn('slow');
}

// On lance le jeu
function start() {
    music.pause();
    video.play();
    play.css("cursor", "none");
    played = true;
    console.log("Jeu lancé !");
>>>>>>> 7141aa8 (restart game)
}

  //////////////////////////////////
///            OPTIONS             ///
  //////////////////////////////////

<<<<<<< HEAD
const btnOptions = $("#options");
const mainMenu = $('#mainMenu');
const optionsMenu = $('#optionsMenu');

btnOptions.on("click", () => {
    optionsMenu.show();
    mainMenu.hide();
})

const btnQuitOptions = $("#quitOptions")

btnQuitOptions.on("click", () => {
    mainMenu.show();
    optionsMenu.hide();
})

// NAV-BAR
const btnOptionsList = ["audio","window","shortcuts","save"];
var btnList = [];
var contentList = [];
=======
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
>>>>>>> 7141aa8 (restart game)

for(let button of btnOptionsList){
    let btn = document.getElementById(button);
    let content = document.getElementById(button + "-options");
    btnList.push(btn);
    contentList.push(content);
    if(btn && contentList){
        btn.addEventListener("click", onAir, false);
<<<<<<< HEAD
    } else {
        console.error("Button or content doesn't exist!");
    }
}

function onAir(evt){
    var nbBtn = btnList.length;
    let id = evt.target.id;
    let content = document.getElementById(id + "-options");
    for(var i=0;i<nbBtn;i++){
=======
    }else{console.error("Button or content doesn't exist!");}
}

function onAir(evt){
    let nbBtn = btnList.length;
    let id = evt.target.id;
    let content = document.getElementById(id + "-options");
    for(let i=0;i<nbBtn;i++){
>>>>>>> 7141aa8 (restart game)
        btnList[i].classList.remove("active");
        contentList[i].style.display = "none";
    }
    evt.target.classList.add("active");
    content.style.display = "block";
}

// AUDIO
// On récupère les variables pour modifier le volume des vidéos et de la musique
<<<<<<< HEAD
var volMusic = document.querySelector("#volumeMusic");
var volVid = document.querySelector("#volumeVid");
// On récupère les variables pour modifier la value en pourcentage du volume
var percentMusic = document.querySelector("#percentMusic");
var percentVid = document.querySelector("#percentVid");

// On définit le volume sur 100%
music.volume = (volMusic.value)/100;
vid.volume = (volVid.value)/100;
=======
let volMusic = document.querySelector("#volumeMusic");
let volVid = document.querySelector("#volumeVid");
// On récupère les variables pour modifier la value en pourcentage du volume
let percentMusic = document.querySelector("#percentMusic");
let percentVid = document.querySelector("#percentVid");

// On définit le volume sur 100%
music.volume = (volMusic.value)/100;
video.volume = (volVid.value)/100;
>>>>>>> 7141aa8 (restart game)

// On affiche le pourcentage du volume
percentMusic.innerHTML = " "+volMusic.value+"%";
percentVid.innerHTML = " "+volVid.value+"%";

// Au clique sur le volMusic
volMusic.addEventListener('mousemove', function(){
    // Le volume de la musique prend la valeur de l'emplacement du curseur
    music.volume = (volMusic.value)/100;
    // On met cette valeur en pourcentage
    percentMusic.innerHTML = " "+volMusic.value+"%";
});

// Au clique sur le volVid
volVid.addEventListener('mousemove', function(){
    //Le volume de la vidéo prend la valeur de l'emplacement du curseur
<<<<<<< HEAD
    vid.volume = (volVid.value)/100;
    // On met cette valeur en pourcentage
    percentVid.innerHTML = " "+volVid.value+"%";
=======
    video.volume = (volVid.value)/100;
    // On met cette valeur en pourcentage
    percentVid.innerHTML = " "+volVid.value+"%";
});

  //////////////////////////////////
///         OPTIONS EN JEU         ///
  //////////////////////////////////

function showChoices() {
    if (video.currentTime + 3 > video.duration) {
        content.fadeIn('slow');
    } else {
        content.hide();
    }
}

  //////////////////////////////////
///   LANCER OU STOPPER LA VIDEO   ///
  //////////////////////////////////

// Si on click = lance ou stop la vidéo
play.on("click", toggleStateVideo);

// Si la touche espace est appuyée
$(document).on("keydown", function (e) {
    if (e.keyCode == 32) {
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
content.on("mouseover", function(){
    // On cache les controles
    contentControls.removeClass('is-visible');
    isHidden = true;
});



// Au clic sur option en jeu
gameSettingsButton.on("click", function(){
    // On affiche les options du jeu
    contentSettings.show();
});


// Au clic sur option en jeu
closeButton.on("click", function(){
    // On affiche les options du jeu
    contentSettings.hide();
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
>>>>>>> 7141aa8 (restart game)
});