// Baraja inicial de cartas (20 cartas)
const deck = [
  // Tripulantes
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Guardián", effect: "defense" },
  { type: "tripulante", name: "Guardián", effect: "defense" },
  { type: "tripulante", name: "Explorador", effect: "draw" },
  { type: "tripulante", name: "Explorador", effect: "draw" },

  // Impostores
  { type: "impostor", name: "Impostor 1", sabotage: "disable-next-turn" },
  { type: "impostor", name: "Impostor 2", sabotage: "disable-next-turn" },
  { type: "impostor", name: "Impostor 3", sabotage: "lose-card" },
  { type: "impostor", name: "Impostor 4", sabotage: "lose-card" },
  { type: "impostor", name: "Impostor 5", sabotage: "double-sabotage" },
  { type: "impostor", name: "Impostor 6", sabotage: "double-sabotage" },

  // Eventos
  { type: "evento", name: "Reparación global", effect: "remove-sabotage" },
  { type: "evento", name: "Reparación global", effect: "remove-sabotage" },
  { type: "evento", name: "Sabotaje mayor", effect: "lose-hand" },
  { type: "evento", name: "Sabotaje mayor", effect: "lose-hand" },
];

// Estado inicial del juego
let playerHand = [];
let opponentHand = Array(5).fill("hidden"); // La máquina comienza con 5 cartas "ocultas"
let activeCards = [];
let sabotages = [];
let discoveredImpostors = 0;
let maxSabotages = 3;
let deckCount = deck.length;
let playerTurn = true; // Comienza con el jugador
let cardDrawnThisTurn = false; // Limita el robo de cartas

// Referencias a elementos HTML
const deckCountElem = document.getElementById("deck-count");
const playerHandElem = document.getElementById("player-hand");
const opponentHandElem = document.getElementById("opponent-hand");
const activeCardsElem = document.getElementById("active-cards");
const drawCardButton = document.getElementById("draw-card");
const passTurnButton = document.getElementById("pass-turn");
const turnIndicator = document.getElementById("turn-indicator");

// Actualizar indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = `Turno: ${playerTurn ? "Jugador" : "Máquina"}`;
}

// Mostrar la mano del oponente (cartas ocultas)
function renderOpponentHand() {
  opponentHandElem.innerHTML = "";
  opponentHand.forEach(() => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", "hidden");
    cardElem.textContent = "🂠"; // Representación de una carta oculta
    opponentHandElem.appendChild(cardElem);
  });
}

// Mostrar la mano del jugador
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

// Función para alternar turnos
function switchTurn() {
  playerTurn = !playerTurn;
  cardDrawnThisTurn = false; // Resetea el estado de robo
  updateTurnIndicator();
  if (!playerTurn) {
    setTimeout(machineTurn, 1000); // Espera 1 segundo para el turno de la máquina
  }
}

// Función para el turno de la máquina
function machineTurn() {
  if (deckCount === 0) {
    alert("El mazo está vacío. ¡El juego ha terminado!");
    return;
  }

  // La máquina roba una carta
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(cardIndex, 1)[0];
  opponentHand.push(card);
  deckCount--;

  // Procesa la carta si es un impostor o evento
  if (card.type === "impostor") {
    activateSabotage(card);
  } else if (card.type === "evento") {
    handleEventEffect(card);
  }

  updateDeckCount();
  renderOpponentHand();
  switchTurn();
}

// Función para robar una carta (limitada a una por turno)
function drawCard() {
  if (!playerTurn) {
    alert("Es el turno de la máquina. ¡Espera!");
    return;
  }
  if (cardDrawnThisTurn) {
    alert("Ya has robado una carta este turno.");
    return;
  }

  if (deckCount > 0) {
    const cardIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(cardIndex, 1)[0];
    playerHand.push(card);
    deckCount--;
    cardDrawnThisTurn = true; // Marca que ya se robó en este turno
    updateDeckCount();
    renderPlayerHand();
    passTurnButton.style.display = "inline-block"; // Habilita el botón de "Pasar"
  } else {
    alert("El mazo está vacío.");
  }
}

// Función para pasar el turno
function passTurn() {
  if (!playerTurn) {
    alert("Es el turno de la máquina. ¡No puedes pasar!");
    return;
  }
  alert("Has pasado el turno.");
  passTurnButton.style.display = "none"; // Oculta el botón de "Pasar"
  switchTurn();
}

// Eventos para botones
drawCardButton.addEventListener("click", drawCard);
passTurnButton.addEventListener("click", passTurn);

// Actualizar el contador inicial del mazo
function updateDeckCount() {
  deckCountElem.textContent = deckCount;
}

// Inicializar el juego
function initializeGame() {
  updateDeckCount();
  updateTurnIndicator();
  renderPlayerHand();
  renderOpponentHand();
}

// Inicia el juego
initializeGame();
