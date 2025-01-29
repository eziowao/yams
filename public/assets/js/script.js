// ############################################################# Déclaration des constantes #############################################################
// TABLEAU DES OPERATIONS
const operations = ['As', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'TOTAL', 'Bonus', 'TOTAL 1', 'Brelan', 'Carré', 'Full', 'Petite Suite', 'Grande Suite', 'Yams', 'Chance', 'TOTAL 2', 'SCORE'];

// TABLEAU DES VALEURS POSSIBLES
const values = [1, 2, 3, 4, 5, 6];

// CORPS DU TABLEAU
const tbody = document.getElementById('tbody');

// SELECTEUR DES OPERATIONS
const operationsList = document.getElementById('operationsList');

// BOUCLE POUR INJECTER OPTIONS DANS SELECTEUR ET LIGNE DANS TABLEAU SCORE
let tableCount = 1;
operations.forEach(operation => {
    let tableRow = '';
    if (operation === 'TOTAL' || operation === 'TOTAL 1' || operation === 'TOTAL 2' || operation === 'SCORE') {
        tableRow = `
        <tr>
            <td class="text-center border-3 border-white">${operation}</td>
            <td class="text-center border-3 border-white text-center" id="${operation}"></td>
        </tr>    
        `;
    } else if (operation === 'As' || operation === 'Deux' || operation === 'Trois' || operation === 'Quatre' || operation === 'Cinq' || operation === 'Six') {
        tableRow = `
        <tr>
            <td class="border border-white px-2"><div class="d-flex justify-content-between align-items-center">${operation}<img class="img-table" src="./public/assets/img/${tableCount}.png" alt="Image de la face ${tableCount++} dé"></div></td>
            <td class="border border-white text-center" id="${operation}"></td>
        </tr>    
        `;        
    } else {
        tableRow = `
        <tr>
            <td class="border border-white px-2">${operation}</td>
            <td class="border border-white text-center" id="${operation}"></td>
        </tr>    
        `;
    }
    tbody.innerHTML += tableRow;
    if (operation != 'TOTAL' && operation != 'Bonus' && operation != 'TOTAL 1' && operation != 'TOTAL 2' && operation != 'SCORE') {
        let option = `<option value="${operation}">${operation}</option>`;
        operationsList.innerHTML += option;
    }
});

// BOUTON LANCER
const start = document.getElementById('start');

// BOUTON GARDER
const save = document.getElementById('save');
save.classList.add('d-none');

// BOUTON ENREGISTRER
const saveScore = document.getElementById('saveScore');

// BOUTON FERMER MODAL
const closeModal = document.getElementById('closeModal');

// PHRASE SCORE MODAL
const scoreResum = document.getElementById('scoreResum');

// PLATEAU DE DES
const board = document.getElementById('board');

// SCORE FINAL AFFICHE
const finalScore = document.getElementById('finalScore');

// BOUTON NOUVELLE PARTIE
const newGame = document.getElementById('newGame');

// DIV SCORE FINAL
const finalScoreDiv = document.getElementById('finalScoreDiv');
finalScoreDiv.classList.add('d-none');

// IMAGE EN ROTATION
const rotatingImage = document.querySelector('.rotatingImage');

// ############################################################# Déclaration des variables #############################################################
// TABLEAU DES DES
let dicesResult = [];

// POINTS A ENREGISTRER
let points = 0;

// OBJET STOCKAGE TEMPORAIRE DES TOTAUX DE POINTS
let totalPoints = {};

// OBJET STOCKAGE DES TOTAUX DE POINTS
let totalPointsStorage = {};
operations.forEach(operation => {
    totalPoints[operation] = null;
    totalPointsStorage[operation] = null;
});

// OBJET COMPTEUR OCCURENCE ==> UTILISE POUR BRELAN ET CARRE
let countOccurence = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

// COMPTEUR LANCER DE DES
let rollCount = 0;

// COMPTEUR DE DES GARDES
let diceLockedCount = 5;


// ############################################################# Déclaration des fonctions #############################################################
// AFFICHAGE DES DES
const displayDice = () => {
    // COMPTEUR POUR ID DE LA DIV CONTENANT IMAGE
    let count = 1;
    // BOUCLE SUR LE TABLEAU DES DES POUR AFFICHER IMAGE SELON VALEUR
    dicesResult.forEach(dice => {
        img = document.createElement('img');
        if (rollCount === 1) {
            img.setAttribute('src', `./public/assets/img/${dice}.gif`);
        } else {
            img.setAttribute('src', `./public/assets/img/${dice}.png`);            
        }
        img.classList.add('img-fluid');
        img.classList.add('diceImg');
        img.setAttribute('id', `dice${count}`);
        let target = document.getElementById(`diceDiv${count}`);
        target.appendChild(img);
        count++;
    });
    // SELECTION DES IMAGES DES DES
    let diceImgs = document.querySelectorAll('.diceImg');
    // BOUCLE SUR LE TABLEAU DES IMAGES DES DES POUR AJOUTER UN ECOUTEUR D'EVENEMENT AU CLIQUE
    diceImgs.forEach(diceImg => {
        diceImg.addEventListener('click', () => {
            if (diceImg.classList.contains('border')) {
                diceImg.classList.remove('border');
                diceImg.classList.remove('border-3');
                diceImg.classList.remove('border-primary');
                diceLockedCount++;
                if (diceLockedCount === 1 && rollCount < 3) {
                    start.classList.remove('d-none');
                    start.textContent = `RELANCER ${diceLockedCount} DÉ`;
                } else {
                    start.textContent = `RELANCER ${diceLockedCount} DÉS`;
                }
            } else {
                diceImg.classList.add('border');
                diceImg.classList.add('border-3');
                diceImg.classList.add('border-primary');
                diceLockedCount--;
                if (diceLockedCount === 0) {
                    start.classList.add('d-none');
                } else if (diceLockedCount === 1) {
                    start.textContent = `RELANCER ${diceLockedCount} DÉ`;
                } else {
                    start.textContent = `RELANCER ${diceLockedCount} DÉS`;
                }
            }
        })
    });
}

// JET DE DES
const rollTheDice = () => {
    // CONDITION SI TABLEAU DE DES DEJA REMPLI, GARDER LES DES SELECTIONNES
    if (dicesResult.length == 5) {
        // INDEX POUR LE TABLEAU DES DES
        let index = 0;
        // SELECTION DES IMAGES DE DES
        let diceImgs = document.querySelectorAll('.diceImg');
        // BOUCLE SUR LE TABLEAU D'IMAGE DE DES
        diceImgs.forEach(diceImg => {
            // CONDITION SI L'IMAGE N'EST PAS SELECTIONNEE, REMPLACER LA VALEUR DANS LE TABLEAU DES DES
            if (!diceImg.classList.contains('border')) {
                dicesResult[index] = Math.ceil(Math.random() * 6);
            }
            diceImg.remove();
            index++;
        });
    } else {
        while (dicesResult.length < 5) {
            let diceResult = Math.ceil(Math.random() * 6);
            dicesResult.push(diceResult);
        }
    }
    rollCount++;
    // CONDITION SI PREMIER JET DE DES
    if (rollCount === 1) {
        rotatingImage.classList.add('d-none');
    }
    // CONDITION SI TROIS JETS DE DES EFFECTUES
    if (rollCount == 3) {
        start.classList.add('d-none');
    }
    // CHANGEMENT TEXTE BOUTON LANCER
    diceLockedCount = 5;
    start.textContent = 'RELANCER 5 DÉS';
    // AFFICHER BOUTON GARDER
    save.classList.remove('d-none');
    operationsList.value = 'none';
    scoreResum.textContent = '';
    // APPEL FONCTION AFFICHAGE DES DES
    displayDice();
}

// VERIFIER LES OCCURENCES ### PARAMETRES (TABLEAU DES DES, NOMBRE D'OCCURENCE A VERIFIER) ###
const checkOccurence = (array, nb) => {
    // BOUCLE SUR LE TABLEAU DES DES POUR INCREMENTER PARAMETRE D'OBJET COMPTEUR OCCURENCE
    array.forEach(dice => {
        countOccurence[dice]++;
    });
    // BOUCLE SUR OBJET COMPTEUR OCCURENCE POUR VERIFIER LE NOMBRE D'OCCURENCE
    for (let index = 1; index < 7; index++) {
        // CONDITION SI LE NOMBRE D'OCCURENCE CORRESPOND AU NOMBRE ENTRE EN PARAMATRE? COMPTER LES POINTS
        if (countOccurence[index] >= nb) {
            points = index * nb;
        }
        countOccurence[index] = 0;
    }
}

// CALCULER LES POINTS ### PARAMETRES (OPERATION A CALCULER, TABLEAU DES DES) ###
const calculatePoints = (operation, array) => {
    switch (operation) {
        case 'As':
            array.forEach(dice => {
                if (dice == 1) {
                    points = points + 1;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Deux':
            array.forEach(dice => {
                if (dice == 2) {
                    points = points + 2;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Trois':
            array.forEach(dice => {
                if (dice == 3) {
                    points = points + 3;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Quatre':
            array.forEach(dice => {
                if (dice == 4) {
                    points = points + 4;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Cinq':
            array.forEach(dice => {
                if (dice == 5) {
                    points = points + 5;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Six':
            array.forEach(dice => {
                if (dice == 6) {
                    points = points + 6;
                }
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Brelan':
            checkOccurence(array, 3);
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Carré':
            checkOccurence(array, 4);
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Full':
            let brelan = false;
            let pair = false;

            values.forEach(value => {
                array.forEach(dice => {
                    if (value == dice) {
                        countOccurence[value]++;
                    }
                });
            });

            for (let index = 1; index < 7; index++) {
                if (countOccurence[index] === 3) {
                    brelan = true;
                } else if (countOccurence[index] === 2) {
                    pair = true;
                }
                countOccurence[index] = 0;
            }

            if (brelan === true && pair === true) {
                points = 25;
            }

            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Petite Suite':
            if (array.includes(1) && array.includes(2) && array.includes(3) && array.includes(4) && array.includes(5)) {
                points = 30;
            }
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Grande Suite':
            if (array.includes(2) && array.includes(3) && array.includes(4) && array.includes(5) && array.includes(6)) {
                points = 40;
            }
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Yams':
            if (array[0] === array[1] && array[0] === array[2] && array[0] === array[3] && array[0] === array[4]) {
                points = 50;
            }
            totalPoints[operation] = points;
            points = 0;
            break;

        case 'Chance':
            array.forEach(dice => {
                points += dice;
            });
            totalPoints[operation] = points;
            points = 0;
            break;

        default:
            break;
    }
}

// AFFICHER IMAGES DES DES DANS MODAL DE CONFIRMATION DE SCORE
const modalScore = () => {
    // CONDITION SI LES IMAGES SONT PRESENTES, LES SUPPRIMER
    if (document.querySelectorAll('.img-modal')) {
        let imgs = document.querySelectorAll('.img-modal');
        imgs.forEach(img => {
            img.remove();
        });
    }
    // BOUCLE SUR LE TABLEAU DES DES POUR AFFICHER IMAGE CORRESPONDANTE
    dicesResult.forEach(dice => {
        let target = document.querySelector('.modal-body');
        let img = document.createElement('img');
        img.setAttribute('src', `./public/assets/img/${dice}.png`);
        img.classList.add('img-fluid');
        img.classList.add('img-modal');
        target.appendChild(img);
    });
}

// MONTRER SCORE DANS MODAL
const showScoreModal = () => {
    if (operationsList.value != 'none') {
        calculatePoints(operationsList.value, dicesResult);
        let pts = totalPoints[operationsList.value];
        scoreResum.textContent = `Vous allez enregistrer ${pts} pts dans "${operationsList.value}"`;
    }
}

// FIN DE PARTIE
const endGame = () => {
    let score = document.getElementById('SCORE');
    totalPointsStorage["SCORE"] = totalPointsStorage["TOTAL 1"] + totalPointsStorage["TOTAL 2"];
    score.textContent = totalPointsStorage["SCORE"];
    start.classList.add('d-none');
    save.classList.add('d-none');
    board.classList.add('d-none');
    finalScoreDiv.classList.remove('d-none');
    finalScore.textContent = `SCORE : ${totalPointsStorage["SCORE"]}`;
    newGame.addEventListener('click', () => {
        location.reload();
    })
}

// SAUVEGARDER LE SCORE
const saveScoreSelected = () => {
    // RECUPERATION DE L'OPERATION SELECTIONNEE
    let operation = operationsList.value;
    // SELECTION DE LA CASE DU TABLEAU OU METTRE LES POINTS
    let target = document.getElementById(`${operation}`);
    // APPEL DE LA FONCTION POUR CALCULER LES POINTS
    calculatePoints(operation, dicesResult);
    // STOCKER POINT DANS OBJET DESTINE AU STORAGE
    totalPointsStorage[operation] = totalPoints[operation];
    // INSERTION DU SCORE DANS LA CASE DU TABLEAU CORRESPONDANTE
    target.textContent = totalPointsStorage[operation];
    // REMISE A ZERO COMPTEUR LANCER DE DES
    rollCount = 0;
    // AFFICHER IMAGE EN ROTATION
    rotatingImage.classList.remove('d-none');
    // CONDITION SI TOTAL DE 1 A 6 REMPLI, COMPTER LE TOTAL DES POINTS
    if (totalPointsStorage["As"] != null && totalPointsStorage["Deux"] != null && totalPointsStorage["Trois"] != null && totalPointsStorage["Quatre"] != null && totalPointsStorage["Cinq"] != null && totalPointsStorage["Six"] != null) {
        let bonus = document.getElementById('Bonus');
        let total = document.getElementById('TOTAL');
        let totalOne = document.getElementById('TOTAL 1');
        totalPointsStorage['TOTAL'] = totalPointsStorage["As"] + totalPointsStorage["Deux"] + totalPointsStorage["Trois"] + totalPointsStorage["Quatre"] + totalPointsStorage["Cinq"] + totalPointsStorage["Six"];
        // CONDITION SI LE TOTAL DES POINTS ADDITIONNE VAUT AU MOINS 63
        if (totalPointsStorage['TOTAL'] >= 63) {
            totalPointsStorage.Bonus = 35;
            bonus.textContent = 35;
        } else {
            totalPointsStorage.Bonus = 0;
            bonus.textContent = 0;
        }
        totalPointsStorage['TOTAL 1'] = totalPointsStorage['TOTAL'] + totalPointsStorage.Bonus;
        total.textContent = totalPointsStorage['TOTAL'];
        totalOne.textContent = totalPointsStorage['TOTAL 1'];
    }
    // CONDITION SI BRELAN A CHANCE REMPLI, COMPTER LE TOTAL DES POINTS
    if (totalPointsStorage["Brelan"] != null && totalPointsStorage["Carré"] != null && totalPointsStorage["Full"] != null && totalPointsStorage["Petite Suite"] != null && totalPointsStorage["Grande Suite"] != null && totalPointsStorage["Yams"] != null && totalPointsStorage["Chance"] != null) {
        let totalTwo = document.getElementById('TOTAL 2');
        totalPointsStorage['TOTAL 2'] = totalPointsStorage["Brelan"] + totalPointsStorage["Carré"] + totalPointsStorage["Full"] + totalPointsStorage["Petite Suite"] + totalPointsStorage["Grande Suite"] + totalPointsStorage["Yams"] + totalPointsStorage["Chance"];
        totalTwo.textContent = totalPointsStorage['TOTAL 2'];
    }
    // CONDITION SI TOTAL 1 ET TOTAL 2 REMPLI, COMPTER LE TOTAL DES POINTS
    if (totalPointsStorage["TOTAL 1"] != null && totalPointsStorage["TOTAL 2"] != null) {
        endGame();
    } else {
        start.classList.remove('d-none');
        start.textContent = 'LANCER';
        save.classList.add('d-none');
    }
    // SELECTIONS DES IMAGES DES DES POUR LES SUPPRIMER
    let diceImgs = document.querySelectorAll('.diceImg');
    diceImgs.forEach(diceImg => {
        diceImg.remove();
    });
    // REMISE A ZERO DES CHOIX DANS LE SELECTEUR D'OPERATION
    operationsList.innerHTML = '<option value="none" disabled selected>-- Sélectionnez votre opération --</option>';
    // BOUCLE SUR LE TABLEAU DES OPERATION POUR AFFICHER DANS LE SELECTEUR D'OPERATIONS LES OPERATIONS QUI N'ONT PAS ENCORE DE SCORE ENREGISTRES 
    operations.forEach(operation => {
        if (totalPointsStorage[operation] == null && operation != 'TOTAL' && operation != 'Bonus' && operation != 'TOTAL 1' && operation != 'TOTAL 2' && operation != 'SCORE') {
            let option = `<option value="${operation}">${operation}</option>`;
            operationsList.innerHTML += option;
        }
        dicesResult = [];
    });
    scoreResum.textContent = '';
    closeModal.click();
}


// ############################################################# Écouteurs d'évènements #############################################################
start.addEventListener('click', rollTheDice);
save.addEventListener('click', modalScore);
saveScore.addEventListener('click', saveScoreSelected);
operationsList.addEventListener('click', showScoreModal);


// footer 

let btnShare = document.querySelector('.btn-share');
let menu = document.querySelector('.share-menu');
let qrModal = document.getElementById('qrModal');
let qrImage = document.getElementById('qrImage');

btnShare.addEventListener('click', () => {
    menu.classList.toggle('active');
    btnShare.classList.toggle('fa-share');
    btnShare.classList.toggle('fa-angle-right');
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('qr-code').addEventListener('click', function (e) {
        e.preventDefault();
        qrModal.style.display = "block";
        qrImage.src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(window.location.href);
    });

    document.getElementsByClassName("close")[0].addEventListener('click', function () {
        qrModal.style.display = "none";
    });

    window.onclick = function (event) {
        if (event.target == qrModal) {
            qrModal.style.display = "none";
        }
    };
    var tweetText = "Voici un super jeu de Yams codé par 4 supers devs :";
    var currentPageUrl = window.location.href;
    var copySuccessMessage = document.getElementById('copy-success');

    document.getElementById('twitter-share').href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(currentPageUrl) + '&text=' + encodeURIComponent(tweetText);
    document.getElementById('facebook-share').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(currentPageUrl) + '&text=' + encodeURIComponent(tweetText);
    document.getElementById('telegram-share').href = 'https://t.me/share/url?url=' + encodeURIComponent(currentPageUrl) + '&text=' + encodeURIComponent(tweetText);
    document.getElementById('qr-code').href = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(currentPageUrl);

    document.getElementById('copy-link').addEventListener('click', function () {
        navigator.clipboard.writeText(currentPageUrl).then(function () {
            copySuccessMessage.classList.add('show');
            setTimeout(function () {
                copySuccessMessage.classList.remove('show');
            }, 2000);
        });
    });
});

let shakeThreshold = 30; // Seuil de secousse, ajustez selon votre besoin
let lastShakeTime = 0;

function deviceMotionHandler(event) {
  let acceleration = event.accelerationIncludingGravity;
  let currentTime = new Date().getTime();

  if ((currentTime - lastShakeTime) > 100) {
    let deltaX = Math.abs(acceleration.x);
    let deltaY = Math.abs(acceleration.y);
    let deltaZ = Math.abs(acceleration.z);

    if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
      // Secousse détectée
      start.click();
      lastShakeTime = currentTime;
    }
  }
}

if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', deviceMotionHandler, false);
} else {
  document.getElementById("shake").textContent = "Device motion not supported.";
}
