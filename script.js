// Baraja inicial de cartas simplificada
const deck = [
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Explorador", effect: "draw" },
  { type: "impostor", name: "Impostor 1", sabotage: "disable-next-turn" },
  { type: "impostor", name: "Impostor 2", sabotage: "lose-card" },
  { type: "evento", name: "Reparación global", effect: "remove-sabotage" },
  { type: "evento", name: "Sabotaje Mayor", effect: "lose-hand" },
];

// Estado inicial del juego
let playerHand = [];
let opponentHand = [];
let activeCards = [];
let playerTurn = true;
let cardDrawnThisTurn = false;

// Referencias al DOM
const turnIndicator = document.getElementById("turn-indicator");
const playerHandElem = document.getElementById("player-hand");
const opponentHandElem = document.getElementById("opponent-hand");
const activeCardsElem = document.getElementById("active-cards");
const drawCardButton = document.getElementById("draw-card");
const passTurnButton = document.getElementById("pass-turn");
const deckCountElem = document.getElementById("deck-count");
const gameLog = document.getElementById("game-log");

// Mezclar el mazo inicial
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Actualizar el contador del mazo
function updateDeckCount() {
  deckCountElem.textContent = deck.length;
}

// Actualizar indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = playerTurn ? "Turno: Jugador" : "Turno: Máquina";
}

// Registrar acciones en "Lo que sucede" (últimos eventos arriba)
function logAction(message) {
  const logEntry = document.createElement("div");
  logEntry.textContent = message;
  gameLog.prepend(logEntry);
}

// Renderizar la mano del jugador
function renderPlayerHand() {
  playerHandElem.innerHTML = "";
  playerHand.forEach((card, index) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card");
    cardElem.textContent = card.name;
    cardElem.addEventListener("click", () => playCard(index));
    playerHandElem.appendChild(cardElem);
  });
}

// Renderizar la mano del oponente
function renderOpponentHand() {
  opponentHandElem.innerHTML = "";
  opponentHand.forEach(() => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", "hidden");
    cardElem.textContent = "🂠";
    opponentHandElem.appendChild(cardElem);
  });
}

// Robar una carta
function drawCard() {
  if (!playerTurn || cardDrawnThisTurn) return;
  if (deck.length === 0) {
    logAction("El mazo está vacío.");
    return;
  }
  const card = deck.pop();
  playerHand.push(card);
  renderPlayerHand();
  updateDeckCount();
  cardDrawnThisTurn = true;
  passTurnButton.style.display = "inline-block";
  logAction(`Has robado una carta: ${card.name}`);
}

// Pasar turno
function passTurn() {
  if (!playerTurn) {
    logAction("No puedes pasar el turno en este momento.");
    return;
  }
  logAction("Has pasado el turno.");
  cardDrawnThisTurn = false;
  playerTurn = false;
  updateTurnIndicator();
  setTimeout(machineTurn, 1000);
}

// Turno de la máquina
function machineTurn() {
  logAction("Es el turno de la máquina.");
  if (deck.length === 0) {
    logAction("El mazo está vacío. Fin del juego.");
    return;
  }
  const card = deck.pop();
  opponentHand.push(card);
  renderOpponentHand();
  logAction("La máquina ha robado una carta.");
  if (card.type === "impostor") {
    applyImpostorEffect(card);
  } else if (card.type === "evento") {
    handleEventEffect(card);
  }
  playerTurn = true;
  updateTurnIndicator();
}

// Aplicar el efecto de un impostor
function applyImpostorEffect(card) {
  if (card.sabotage === "disable-next-turn") {
    logAction("Sabotaje: Pierdes tu próximo turno.");
    playerTurn = false;
    setTimeout(machineTurn, 1000);
  } else if (card.sabotage === "lose-card") {
    if (playerHand.length > 0) {
      playerHand.pop();
      renderPlayerHand();
      logAction("Sabotaje: Has perdido una carta.");
    } else {
      logAction("Sabotaje: No tienes cartas para perder.");
    }
  }
}

// Aplicar efecto de cartas de evento
function handleEventEffect(card) {
  if (card.effect === "remove-sabotage") {
    logAction("Evento: Todos los sabotajes han sido eliminados.");
    activeCards = [];
  } else if (card.effect === "lose-hand") {
    logAction("Evento: ¡Has perdido todas tus cartas!");
    playerHand = [];
    renderPlayerHand();
  }
}

// Jugar una carta
function playCard(index) {
  if (!playerTurn) {
    logAction("No puedes jugar cartas en el turno de la máquina.");
    return;
  }
  const playedCard = playerHand.splice(index, 1)[0];
  logAction(`Has jugado la carta: ${playedCard.name}`);
  renderPlayerHand();
  if (playedCard.type === "tripulante") {
    logAction(`Efecto activado: ${playedCard.effect}`);
    handleTripulanteEffect(playedCard);
  } else if (playedCard.type === "evento") {
    handleEventEffect(playedCard);
  }
  cardDrawnThisTurn = false;
  passTurnButton.style.display = "none";
  playerTurn = false;
  updateTurnIndicator();
  setTimeout(machineTurn, 1000);
}

// Efectos de cartas de tripulante
function handleTripulanteEffect(card) {
  if (card.effect === "reveal") {
    if (deck.length > 0) {
      const revealedCard = deck.pop();
      logAction(`Detective: Has revelado la carta ${revealedCard.name}`);
      playerHand.push(revealedCard);
      renderPlayerHand();
      updateDeckCount();
    } else {
      logAction("No hay más cartas para revelar.");
    }
  } else if (card.effect === "repair") {
    logAction("Ingeniero: Has reparado un sabotaje.");
  } else if (card.effect === "draw") {
    logAction("Explorador: Robas dos cartas.");
    if (deck.length > 0) playerHand.push(deck.pop());
    if (deck.length > 0) playerHand.push(deck.pop());
    renderPlayerHand();
    updateDeckCount();
  }
}

// Inicializar el juego
function initializeGame() {
  shuffleDeck();
  renderPlayerHand();
  renderOpponentHand();
  updateDeckCount();
  updateTurnIndicator();
}

// Eventos
drawCardButton.addEventListener("click", drawCard);
passTurnButton.addEventListener("click", passTurn);

// Iniciar juego
initializeGame();
