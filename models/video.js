class Video {

    static nbVideo = 0;

    path = "./assets/videos/";
    isPlayed = false;
    controlIsHidden = true;

    constructor(titre, reference) {
        this.id = Video.nbVideo;
        this.titre = titre;
        this.link = this.path + this.titre + ".mp4";
        this.reference = reference;
        Video.nbVideo += 1;
        this.print();
        this.setupHTMLVideo();
    }

    setupHTMLVideo() {
        this.buildHTMLVideo();

        this.actionVideo();

        $('#overlay').off('click');
        $('#overlay').off('mousemove');

        let video = this;

        var timeout;

        $('#overlay').on('click', function(){
            video.actionVideo();
        });
        /*$('#overlay').on("mousemove", function(){
            video.displayControls(timeout);
        });*/

        // Faire le reste
    }

    buildHTMLVideo() {
        var video = document.querySelector('video');

            if(this.fileExists(this.link)) {
                video.src = this.link;
            } else {
                alert("Ta grand-mère cette vidéo n'existe pas");
            }

    }

    fileExists(url) {
        let status = 0;
        try {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            status = 1;
        } catch(e) {
            alert(e);
        } finally {
            return status;
        }
    }

    displayControls(timeout) {
        console.log("Tu bouges mon reuf");
        var video = document.querySelector('video');
        var overlay = document.querySelector('#overlay');

        // Si timeout existe
        if (timeout) {
            // On clear
            clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
            // Si les controles sont visibles et que la vidéo est jouée
            if (!this.controlIsHidden && this.isPlayed) {
                // On cache le curseur
                video.style.cursor = "none";
                // On cache les controles
                overlay.classList.remove('is-visible');
                this.controlIsHidden = true;
            } else {
                // Sinon on affiche le curseur
                video.style.cursor = "auto";
                // On affiche les controles
                overlay.classList.add('is-visible');
                this.controlIsHidden = false;
            }
        }, 2000); // Après un compteur de 2s
        // Si les controles sont cachés
        if (this.controlIsHidden) {
            // On affiche le curseur 
            video.style.cursor = "auto";
            // On affiche les controles
            overlay.classList.add('is-visible');
            this.controlIsHidden = false;
        }
    }

    actionVideo(){
        if(this.isPlayed){
            document.querySelector('video').pause();
            this.isPlayed = false;
        } else {
            document.querySelector('video').play();
            this.isPlayed = true;
        }
    }

    // For testing in console
    print() {
        console.log("ID: ", this.id, 
                    "\nTitle: ", this.titre, 
                    "\nReference: ", this.reference)
    }
}