const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

// Récupérer les données de cartes depuis un fichier JSON
fetch("./data/cards.json")
  .then((res) => res.json()) // Convertir la réponse en format JSON
  .then((data) => {
    cards = [...data, ...data]; // Doubler les cartes pour créer les paires
    shuffleCards(); // Mélanger les cartes
    generateCards(); // Générer les éléments de cartes
  });

// Fonction pour mélanger les cartes dans un ordre aléatoire
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Échanger les cartes pour les mélanger
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Fonction pour générer les éléments de cartes
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement); // Ajouter la carte à la grille
    cardElement.addEventListener("click", flipCard); // Ajouter un gestionnaire d'événements de clic
  }
}

// Fonction pour retourner une carte lorsqu'elle est cliquée
function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped"); // Appliquer la classe 'flipped' pour retourner la carte

  if (!firstCard) {
    // Si c'est la première carte retournée
    firstCard = this;
  } else {
    // Si c'est la deuxième carte retournée
    secondCard = this;
    lockBoard = true; // Bloquer les clics pendant l'évaluation des cartes
    checkForMatch(); // Vérifier si les cartes retournées sont identiques
  }
}

// Fonction pour vérifier si les deux cartes retournées correspondent
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    // Si les cartes sont identiques
    disableCards(); // Désactiver les cartes (les garder retournées)
    score++; // Incrémenter le score pour une paire correspondante
    document.querySelector(".score").textContent = score;
    if (score === cards.length / 2) {
      // Si toutes les paires sont trouvées
      alert("Vous avez gagné !");
    }
  } else {
    // Si les cartes ne sont pas identiques
    unflipCards(); // Retourner les cartes (les cacher à nouveau)
  }
}

// Fonction pour désactiver les cartes identiques (les garder retournées)
function disableCards() {
  firstCard.removeEventListener("click", flipCard); // Désactiver le clic sur la première carte
  secondCard.removeEventListener("click", flipCard); // Désactiver le clic sur la deuxième carte
  resetBoard(); // Réinitialiser le tableau pour le prochain tour
}

// Fonction pour retourner les cartes si elles ne correspondent pas
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped"); // Cacher la première carte retournée
    secondCard.classList.remove("flipped"); // Cacher la deuxième carte retournée
    resetBoard(); // Réinitialiser le tableau pour le prochain tour
  }, 1000); // Retourner les cartes après une courte pause
}

// Fonction pour réinitialiser le tableau pour le prochain tour
function resetBoard() {
  [firstCard, secondCard] = [null, null]; // Réinitialiser les variables des cartes
  lockBoard = false; // Débloquer le tableau pour les clics
}

// Fonction pour redémarrer le jeu
function restart() {
  resetBoard(); // Réinitialiser le tableau
  shuffleCards(); // Mélanger les cartes
  score = 0; // Réinitialiser le score
  document.querySelector(".score").textContent = score; // Mettre à jour l'affichage du score
  gridContainer.innerHTML = ""; // Effacer toutes les cartes du jeu actuel
  generateCards(); // Générer un nouveau jeu de cartes
}
