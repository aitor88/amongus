// Baraja inicial de cartas (20 cartas)
const deck = [
  // Tripulantes
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Explorador", effect: "draw" },
  { type: "tripulante", name: "Guardián", effect: "defense" },

  // Impostores
  { type: "impostor", name: "Impostor 1", sabotage: "disable-next-turn" },
  { type: "impostor", name: "Impostor 2", sabotage: "lose-card" },
  { type: "impostor", name: "Impostor 3", sabotage: "double-sabotage" },

  // Eventos
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

// Actualizar el contador del mazo
function updateDeckCount() {
  deckCountElem.textContent = deck.length;
}

// Actualizar indicador de turno
function updateTurnIndicator() {
  turnIndicator.textContent = `Turno: ${playerTurn ? "Jugador" : "Máquina"}`;
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

// Robar una carta (Jugador)
function drawCard() {
  if (!playerTurn || cardDrawnThisTurn) return;
  if (deck.length === 0) {
    alert("El mazo está vacío.");
    return;
  }

  // Robar la carta del mazo
  const card = deck.pop();

  // Si es un impostor, mover a la zona de juego y activar efecto
  if (card.type === "impostor") {
    alert(`¡Impostor detectado! ${card.name} ha activado un sabotaje.`);
    activeCards.push(card);
    renderActiveCards();
    applyImpostorEffect(card);
  } else {
    // Si no es un impostor, añadir a la mano del jugador
    playerHand.push(card);
    renderPlayerHand();
  }

  // Actualizar el estado del juego
  cardDrawnThisTurn = true;
  updateDeckCount();
  passTurnButton.style.display = "inline-block";
}

// Aplicar el efecto de un impostor
function applyImpostorEffect(card) {
  switch (card.sabotage) {
    case "disable-next-turn":
      alert("Sabotaje: No podrás jugar en tu próximo turno.");
      break;

    case "lose-card":
      if (playerHand.length > 0) {
        const lostCard = playerHand.pop();
        alert(`Sabotaje: Has perdido la carta ${lostCard.name} de tu mano.`);
        renderPlayerHand();
      } else {
        alert("Sabotaje: No tienes cartas para perder.");
      }
      break;

    case "double-sabotage":
      alert("Sabotaje: ¡Dos sabotajes se activan simultáneamente!");
      activeCards.push({ name: "Sabotaje Adicional" }, { name: "Sabotaje Adicional" });
      renderActiveCards();
      break;

    default:
      alert("Sabotaje desconocido.");
  }
}

// Turno de la máquina
function machineTurn() {
  if (deck.length === 0) {
    alert("El mazo está vacío. Fin del juego.");
    return;
  }

  // Robar una carta del mazo
  const card = deck.pop();
  opponentHand.push(card);
  renderOpponentHand();
  updateDeckCount();

  // La máquina decide qué hacer
  if (card.type === "impostor") {
    alert(`La máquina ha activado un impostor: ${card.name}`);
    activeCards.push(card);
    renderActiveCards();
    applyImpostorEffect(card);
  } else if (card.type === "evento") {
    alert(`La máquina ha activado un evento: ${card.name}`);
    applyEventEffect(card);
  } else {
    alert(`La máquina ha guardado la carta: ${card.name}`);
  }

  // Finalizar el turno de la máquina
  playerTurn = true;
  updateTurnIndicator();
}

// Inicializar el juego
function initializeGame() {
  renderPlayerHand();
  renderOpponentHand();
  renderActiveCards();
  updateDeckCount();
  updateTurnIndicator();
}

// Eventos de botones
drawCardButton.addEventListener("click", drawCard);
passTurnButton.addEventListener("click", passTurn);

// Inicia el juego
initializeGame();
