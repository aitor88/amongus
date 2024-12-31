// Baraja inicial de cartas (20 cartas)
const deck = [
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "impostor", name: "Impostor", sabotage: "disable-next-turn" },
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
const drawCardButton = document.getElementById("draw-card");
const passTurnButton = document.getElementById("pass-turn");

// Actualizar indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = `Turno: ${playerTurn ? "Jugador" : "Máquina"}`;
}

// Renderizar mano del jugador
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

// Renderizar mano del oponente
function renderOpponentHand() {
  opponentHandElem.innerHTML = "";
  opponentHand.forEach(() => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", "hidden");
    cardElem.textContent = "🂠";
    opponentHandElem.appendChild(cardElem);
  });
}

// Robar una carta (Jugador)
function drawCard() {
  if (!playerTurn || cardDrawnThisTurn) return;
  if (deck.length === 0) {
    alert("El mazo está vacío.");
    return;
  }
  const card = deck.pop();
  playerHand.push(card);
  cardDrawnThisTurn = true;
  renderPlayerHand();
  passTurnButton.style.display = "inline-block";
}

// Pasar el turno
function passTurn() {
  if (!playerTurn) return;
  cardDrawnThisTurn = false;
  playerTurn = false;
  updateTurnIndicator();
  passTurnButton.style.display = "none";
  setTimeout(machineTurn, 1000);
}

// Turno de la máquina
function machineTurn() {
  if (deck.length === 0) {
    alert("El mazo está vacío. Fin del juego.");
    return;
  }

  const card = deck.pop();
  opponentHand.push(card);
  renderOpponentHand();

  playerTurn = true;
  updateTurnIndicator();
}

// Jugar una carta
function playCard(index) {
  if (!playerTurn) return;
  const card = playerHand.splice(index, 1)[0];
  activeCards.push(card);
  renderPlayerHand();
}

// Eventos de botones
drawCardButton.addEventListener("click", drawCard);
passTurnButton.addEventListener("click", passTurn);

// Inicializar juego
function initializeGame() {
  renderPlayerHand();
  renderOpponentHand();
  updateTurnIndicator();
}
initializeGame();
