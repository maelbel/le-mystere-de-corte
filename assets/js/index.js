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
}

  //////////////////////////////////
///            OPTIONS             ///
  //////////////////////////////////

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

for(let button of btnOptionsList){
    let btn = document.getElementById(button);
    let content = document.getElementById(button + "-options");
    btnList.push(btn);
    contentList.push(content);
    if(btn && contentList){
        btn.addEventListener("click", onAir, false);
    } else {
        console.error("Button or content doesn't exist!");
    }
}

function onAir(evt){
    var nbBtn = btnList.length;
    let id = evt.target.id;
    let content = document.getElementById(id + "-options");
    for(var i=0;i<nbBtn;i++){
        btnList[i].classList.remove("active");
        contentList[i].style.display = "none";
    }
    evt.target.classList.add("active");
    content.style.display = "block";
}

// AUDIO
// On récupère les variables pour modifier le volume des vidéos et de la musique
var volMusic = document.querySelector("#volumeMusic");
var volVid = document.querySelector("#volumeVid");
// On récupère les variables pour modifier la value en pourcentage du volume
var percentMusic = document.querySelector("#percentMusic");
var percentVid = document.querySelector("#percentVid");

// On définit le volume sur 100%
music.volume = (volMusic.value)/100;
vid.volume = (volVid.value)/100;

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
    vid.volume = (volVid.value)/100;
    // On met cette valeur en pourcentage
    percentVid.innerHTML = " "+volVid.value+"%";
});