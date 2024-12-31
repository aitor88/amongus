// script.js

// Baraja inicial de cartas
const deck = [
  { type: "tripulante", name: "Detective" },
  { type: "tripulante", name: "Ingeniero" },
  { type: "impostor", name: "Impostor 1" },
  { type: "impostor", name: "Impostor 2" },
  { type: "evento", name: "Sabotaje: Luces" },
  { type: "evento", name: "Reparación" },
  // Añadir más cartas aquí
];

// Estado inicial del juego
let playerHand = [];
let activeCards = [];
let deckCount = deck.length;

// Referencias a elementos HTML
const deckCountElem = document.getElementById("deck-count");
const playerHandElem = document.getElementById("player-hand");
const activeCardsElem = document.getElementById("active-cards");
const drawCardButton = document.getElementById("draw-card");

// Función para actualizar el contador del mazo
function updateDeckCount() {
  deckCountElem.textContent = deckCount;
}

// Función para robar una carta
function drawCard() {
  if (deckCount > 0) {
    // Robar una carta al azar
    const cardIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(cardIndex, 1)[0];
    playerHand.push(card);
    deckCount--;
    updateDeckCount();
    renderPlayerHand();
  } else {
    alert("El mazo está vacío.");
  }
}

// Renderizar la mano del jugador
function renderPlayerHand() {
  playerHandElem.innerHTML = "";
  playerHand.forEach((card, index) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", card.type);
    cardElem.textContent = card.name;
    cardElem.addEventListener("click", () => playCard(index));
    playerHandElem.appendChild(cardElem);
  });
}

// Función para jugar una carta
function playCard(index) {
  const card = playerHand.splice(index, 1)[0];
  activeCards.push(card);
  renderPlayerHand();
  renderActiveCards();
}

// Renderizar la zona de juego
function renderActiveCards() {
  activeCardsElem.innerHTML = "";
  activeCards.forEach((card) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", card.type);
    cardElem.textContent = card.name;
    activeCardsElem.appendChild(cardElem);
  });
}

// Evento para robar cartas
drawCardButton.addEventListener("click", drawCard);

// Actualizar el contador inicial del mazo
updateDeckCount();
