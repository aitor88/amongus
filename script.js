// Baraja inicial de cartas (20 cartas)
const deck = [
  { type: "tripulante", name: "Detective", effect: "add-points", points: 2 },
  { type: "tripulante", name: "Detective", effect: "add-points", points: 2 },
  { type: "tripulante", name: "Ingeniero", effect: "add-points", points: 3 },
  { type: "tripulante", name: "Ingeniero", effect: "add-points", points: 3 },
  { type: "tripulante", name: "Explorador", effect: "add-points", points: 1 },
  { type: "tripulante", name: "Explorador", effect: "add-points", points: 1 },
  { type: "impostor", name: "Impostor", effect: "steal-points", points: -3 },
  { type: "impostor", name: "Impostor", effect: "steal-points", points: -3 },
  { type: "evento", name: "Reclamar Mesa", effect: "claim-points" },
  { type: "evento", name: "Reclamar Mesa", effect: "claim-points" },
];

// Estado inicial del juego
let playerHand = [];
let opponentHand = [];
let tablePoints = 0;
let playerPoints = 0;
let opponentPoints = 0;
let playerTurn = true;
let cardDrawnThisTurn = false;

// Referencias al DOM
const turnIndicator = document.getElementById("turn-indicator");
const playerHandElem = document.getElementById("player-hand");
const opponentHandElem = document.getElementById("opponent-hand");
const drawCardButton = document.getElementById("draw-card");
const passTurnButton = document.getElementById("pass-turn");
const deckCountElem = document.getElementById("deck-count");
const gameLog = document.getElementById("game-log");
const playerPointsElem = document.getElementById("player-points");
const opponentPointsElem = document.getElementById("opponent-points");
const tablePointsElem = document.getElementById("table-points");

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

// Actualizar puntos
function updatePoints() {
  playerPointsElem.textContent = `Puntos del jugador: ${playerPoints}`;
  opponentPointsElem.textContent = `Puntos de la máquina: ${opponentPoints}`;
  tablePointsElem.textContent = `Puntos en la mesa: ${tablePoints}`;
}

// Actualizar indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = playerTurn ? "Turno: Jugador" : "Turno: Máquina";
}

// Registrar acciones en "Lo que sucede"
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
    cardElem.textContent = `${card.name} (${card.points || "Evento"})`;
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
  cardDrawnThisTurn = true;
  updateDeckCount();
  passTurnButton.style.display = "inline-block";
}

// Jugar una carta
function playCard(index) {
  if (!playerTurn) {
    logAction("No puedes jugar cartas en el turno de la máquina.");
    return;
  }

  const playedCard = playerHand.splice(index, 1)[0];
  logAction(`Has jugado la carta ${playedCard.name}.`);

  if (playedCard.effect === "add-points") {
    tablePoints += playedCard.points;
    logAction(`Añadiste ${playedCard.points} puntos a la mesa.`);
  } else if (playedCard.effect === "claim-points") {
    playerPoints += tablePoints;
    logAction(`Reclamaste ${tablePoints} puntos de la mesa.`);
    tablePoints = 0;
  } else if (playedCard.effect === "steal-points") {
    const stolenPoints = Math.min(tablePoints, Math.abs(playedCard.points));
    opponentPoints = Math.max(opponentPoints - stolenPoints, 0);
    logAction(`El impostor robó ${stolenPoints} puntos de la máquina.`);
  }

  renderPlayerHand();
  updatePoints();
  checkWinCondition();
  nextTurn();
}

// Pasar turno
function passTurn() {
  if (!playerTurn) {
    logAction("No puedes pasar el turno en este momento.");
    return;
  }
  logAction("Has pasado el turno.");
  nextTurn();
}

// Función centralizada para alternar turnos
function nextTurn() {
  playerTurn = !playerTurn;
  updateTurnIndicator();
  if (!playerTurn) {
    setTimeout(machineTurn, 1000);
  } else {
    cardDrawnThisTurn = false;
  }
}

// Turno de la máquina
function machineTurn() {
  if (deck.length === 0) {
    logAction("El mazo está vacío. Fin del juego.");
    return;
  }

  const card = deck.pop();
  opponentHand.push(card);
  renderOpponentHand();

  const playedCard = opponentHand.pop();
  logAction("La máquina jugó una carta.");

  if (playedCard.effect === "add-points") {
    tablePoints += playedCard.points;
    logAction(`La máquina añadió ${playedCard.points} puntos a la mesa.`);
  } else if (playedCard.effect === "claim-points") {
    opponentPoints += tablePoints;
    logAction(`La máquina reclamó ${tablePoints} puntos de la mesa.`);
    tablePoints = 0;
  } else if (playedCard.effect === "steal-points") {
    const stolenPoints = Math.min(tablePoints, Math.abs(playedCard.points));
    playerPoints = Math.max(playerPoints - stolenPoints, 0);
    logAction(`El impostor robó ${stolenPoints} puntos del jugador.`);
  }

  updatePoints();
  checkWinCondition();
  nextTurn();
}

// Verificar condiciones de victoria
function checkWinCondition() {
  if (playerPoints >= 10) {
    logAction("¡Ganaste! Llegaste a 10 puntos.");
    disableGame();
  } else if (opponentPoints >= 10) {
    logAction("La máquina ganó. Llegó a 10 puntos.");
    disableGame();
  }
}

// Deshabilitar el juego
function disableGame() {
  drawCardButton.disabled = true;
  passTurnButton.disabled = true;
}

// Inicializar el juego
function initializeGame() {
  shuffleDeck();
  for (let i = 0; i < 3; i++) {
    if (deck.length > 0) playerHand.push(deck.pop());
    if (deck.length > 0) opponentHand.push(deck.pop());
  }
  renderPlayerHand();
  renderOpponentHand();
  updateDeckCount();
  updateTurnIndicator();
  updatePoints();
}

// Eventos
drawCardButton.addEventListener("click", drawCard);
passTurnButton.addEventListener("click", passTurn);

// Iniciar juego
initializeGame();
