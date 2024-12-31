// Baraja inicial de cartas (20 cartas)
const deck = [
  // Tripulantes
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "tripulante", name: "Explorador", effect: "draw" },
  { type: "tripulante", name: "Explorador", effect: "draw" },
  { type: "tripulante", name: "Guardián", effect: "defense" },
  { type: "tripulante", name: "Guardián", effect: "defense" },

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
  { type: "evento", name: "Sabotaje Mayor", effect: "lose-hand" },
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

  const card = deck.pop();

  if (card.type === "impostor") {
    alert(`¡Impostor detectado! ${card.name} ha activado un sabotaje.`);
    activeCards.push(card);
    renderActiveCards();
    applyImpostorEffect(card);
  } else {
    playerHand.push(card);
    renderPlayerHand();
  }

  cardDrawnThisTurn = true;
  updateDeckCount();

  // Mostrar el botón "Pasar"
  passTurnButton.style.display = "inline-block";

  checkWinCondition();
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

// Jugar una carta
function playCard(index) {
  if (!playerTurn) {
    alert("Es el turno de la máquina. ¡No puedes jugar cartas ahora!");
    return;
  }

  const playedCard = playerHand.splice(index, 1)[0];
  activeCards.push(playedCard);

  renderPlayerHand();
  renderActiveCards();

  applyCardEffect(playedCard);
  checkWinCondition();
}

// Aplicar el efecto de una carta jugada
function applyCardEffect(card) {
  switch (card.type) {
    case "tripulante":
      handleTripulanteEffect(card);
      break;

    case "evento":
      handleEventEffect(card);
      break;

    default:
      alert("Esta carta no tiene efecto.");
  }
}

// Efectos de las cartas de tripulante
function handleTripulanteEffect(card) {
  if (card.effect === "reveal") {
    if (deck.length > 0) {
      const revealedCard = deck.pop();
      alert(`Detective: Has revelado la carta ${revealedCard.name}`);
      activeCards.push(revealedCard);
      renderActiveCards();
    } else {
      alert("No hay más cartas en el mazo para revelar.");
    }
  } else if (card.effect === "repair") {
    alert("Ingeniero: Reparación activada. Resuelve un sabotaje.");
    // Lógica para resolver sabotajes
  } else if (card.effect === "draw") {
    alert("Explorador: Robas dos cartas adicionales.");
    if (deck.length > 0) playerHand.push(deck.pop());
    if (deck.length > 0) playerHand.push(deck.pop());
    renderPlayerHand();
    updateDeckCount();
  } else if (card.effect === "defense") {
    alert("Guardián: Bloqueo activado. El próximo sabotaje será bloqueado.");
    // Lógica para bloquear sabotajes
  }
}

// Efectos de las cartas de evento
function handleEventEffect(card) {
  if (card.effect === "remove-sabotage") {
    alert("Evento: Todos los sabotajes han sido eliminados.");
    activeCards = activeCards.filter((c) => c.type !== "impostor");
    renderActiveCards();
  } else if (card.effect === "lose-hand") {
    alert("Evento: ¡Has perdido todas tus cartas!");
    playerHand = [];
    renderPlayerHand();
  }
}

// Pasar el turno
function passTurn() {
  if (!playerTurn) {
    alert("No puedes pasar el turno en este momento.");
    return;
  }

  // Finalizar el turno del jugador
  cardDrawnThisTurn = false;
  playerTurn = false;
  updateTurnIndicator();
  passTurnButton.style.display = "none";

  // Esperar un momento antes de que la máquina actúe
  setTimeout(machineTurn, 1000);
}


// Turno de la máquina
// Turno de la máquina
function machineTurn() {
  if (deck.length === 0) {
    alert("El mazo está vacío. Fin del juego.");
    return;
  }

  // Robar una carta
  const card = deck.pop();
  updateDeckCount();

  // Si la carta es un impostor, activarlo automáticamente
  if (card.type === "impostor") {
    alert(`La máquina ha activado un impostor: ${card.name}`);
    activeCards.push(card);
    renderActiveCards();
    applyImpostorEffect(card);
  } 
  // Si es un evento, activarlo automáticamente
  else if (card.type === "evento") {
    alert(`La máquina ha activado un evento: ${card.name}`);
    handleEventEffect(card);
  } 
  // Si es una carta de tripulante, guardarla en la mano de la máquina
  else if (card.type === "tripulante") {
    opponentHand.push(card);
    renderOpponentHand();
    alert(`La máquina ha guardado la carta: ${card.name}`);
  }

  // Finalizar el turno de la máquina
  playerTurn = true;
  updateTurnIndicator();
  passTurnButton.style.display = "none";
  checkWinCondition();
}


// Verificar condiciones de victoria o derrota
function checkWinCondition() {
  const sabotageLimit = 3;
  const activeSabotages = activeCards.filter((card) => card.type === "impostor").length;

  if (activeSabotages >= sabotageLimit) {
    alert("¡La máquina gana! Demasiados sabotajes activos.");
    resetGame();
    return;
  }

  if (playerHand.length === 0 && deck.length === 0) {
    alert("¡La máquina gana! No tienes cartas y no puedes robar.");
    resetGame();
    return;
  }

  if (deck.length === 0 && activeSabotages === 0) {
    alert("¡Felicidades! Has ganado resolviendo todos los sabotajes.");
    resetGame();
    return;
  }
}

// Reiniciar el juego
function resetGame() {
  alert("El juego se reiniciará.");
  location.reload();
}

// Inicializar el juego
function initializeGame() {
  shuffleDeck(); // Mezclar el mazo antes de iniciar
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
