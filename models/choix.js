//CODE POUR CHOIX //SEULEMENT DE LA POO

class Choice {

    static nbChoice = 0;

    constructor(titre, choices = [], reference) {
        this.id = Choice.nbChoice;
        this.titre = titre;
        this.choices = choices;
        this.nbOfChoices = choices.length;
        this.echec = (this.nbOfChoices) ? false : true;
        this.reference = reference;
        Choice.nbChoice += 1;
        this.print();
        this.setupHTMLChoice();
        new Video(this.titre, this.reference);
    }

    setupHTMLChoice() {
        this.buildHTMLChoice();

        $('.choice').off('click');
        $('#back').off('click');
        $('#rMenu').off('click');

        $('.choice').on('click', function() {
            displayNewChoice($('.reference').attr('value').toString()+($('.choice').index(this)+1).toString());
        });

        $('#back').on('click', function() {
            if($('.reference').attr('value').slice(0, -1) != ""){
                displayNewChoice($('.reference').attr('value').slice(0, -1));
            }
        });

          //////////////////////////////////
        ///        OPTIONS IN GAME         ///
          //////////////////////////////////

        $('#rMenu').on('click', function(){
            actionSwitchScene('#jeu','#interface','block');
            document.querySelector('video').pause();
        });
        // Faire le reste
    }

    buildHTMLChoice() {
        

        $('#titre').html("<h1>" + this.titre + "</h1>");

        var html = "";
        // Si le choix effectué possède des choix 
        if(this.choices.length > 0){
            for(let choice in this.choices){
                html += "<a class='choice col-" + 12/this.choices.length + "' id='choice" + choice + "'>" + this.choices[choice] + "</a>";
            }
        } else { // Sinon c'est un echec
            html += "<p>Tu as perdu enculé</p>";
        }

        // Pas de condition : Il y a forcément une référence
        for(let reference in this.reference) {
            html += "<input type='hidden' class='reference' value='" + this.reference[reference] + "'/>"
        }

        $('#choices').html(html);
    }

    // For testing in console
    print() {
        console.log("ID: ", this.id, 
                    "\nTitle: ", this.titre, 
                    "\nChoices: ", this.choices,
                    "\nNumber of choices: ", this.nbOfChoices,
                    "\nEchec: ", this.echec,
                    "\nReference: ", this.reference)
    }
}