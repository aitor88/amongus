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
  const turnIndicator = document.getElementById("turn-indicator");
  turnIndicator.textContent = playerTurn ? "Turno: Jugador" : "Turno: Máquina";
}


// Registrar acciones en la ventana de "Lo que sucede"
function logAction(message) {
  const gameLog = document.getElementById("game-log");
  const logEntry = document.createElement("div");
  logEntry.textContent = message;
  gameLog.appendChild(logEntry);

  // Mantener el scroll siempre abajo
  gameLog.scrollTop = gameLog.scrollHeight;
}

// Renderizar la mano del jugador
// Renderizar la mano del jugador
function renderPlayerHand() {
  const playerHandElem = document.getElementById("player-hand");
  playerHandElem.innerHTML = ""; // Limpiar el contenido actual

  playerHand.forEach((card, index) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card");
    cardElem.style.backgroundImage = `url('cartas/${card.name.toLowerCase().replace(/\s+/g, '-')}.png')`;

    // Añadir título en la parte superior
    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = card.name;

    // Añadir descripción en la parte inferior
    const cardDescription = document.createElement("div");
    cardDescription.classList.add("card-description");
    cardDescription.textContent = getCardDescription(card);

    cardElem.appendChild(cardTitle);
    cardElem.appendChild(cardDescription);

    // Añadir evento para jugar la carta
    cardElem.addEventListener("click", () => playCard(index));

    playerHandElem.appendChild(cardElem);
  });
}

// Obtener descripción de la carta
function getCardDescription(card) {
  const descriptions = {
    "Detective": "Revela una carta del mazo.",
    "Ingeniero": "Repara un sabotaje.",
    "Explorador": "Roba 2 cartas.",
    "Guardián": "Bloquea un sabotaje.",
    "Impostor 1": "Desactiva el próximo turno.",
    "Impostor 2": "Desactiva el próximo turno.",
    "Impostor 3": "Pierdes 1 carta.",
    "Impostor 4": "Pierdes 1 carta.",
    "Impostor 5": "Activa 2 sabotajes.",
    "Impostor 6": "Activa 2 sabotajes.",
    "Reparación global": "Elimina todos los sabotajes.",
    "Sabotaje Mayor": "Pierdes tu mano completa."
  };

  return descriptions[card.name] || "Sin descripción.";
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
// Renderizar la zona de juego
function renderActiveCards() {
  activeCardsElem.innerHTML = "";
  activeCards.forEach((card) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card");
    cardElem.style.backgroundImage = `url('cartas/${card.name.toLowerCase().replace(/\s+/g, '-')}.png')`;

    // Añadir título en la parte inferior
    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = card.name;

    cardElem.appendChild(cardTitle);
    activeCardsElem.appendChild(cardElem);
  });
}


// Robar una carta (Jugador)
function drawCard() {
  if (!playerTurn || cardDrawnThisTurn) return;
  if (deck.length === 0) {
    LogAction("El mazo está vacío.");
    return;
  }

  const card = deck.pop();

  if (card.type === "impostor") {
    LogAction(`¡Impostor detectado! ${card.name} ha activado un sabotaje.`);
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
      LogAction("Sabotaje: No podrás jugar en tu próximo turno.");
      break;

    case "lose-card":
      if (playerHand.length > 0) {
        const lostCard = playerHand.pop();
        LogAction(`Sabotaje: Has perdido la carta ${lostCard.name} de tu mano.`);
        renderPlayerHand();
      } else {
        LogAction("Sabotaje: No tienes cartas para perder.");
      }
      break;

    case "double-sabotage":
      LogAction("Sabotaje: ¡Dos sabotajes se activan simultáneamente!");
      activeCards.push({ name: "Sabotaje Adicional" }, { name: "Sabotaje Adicional" });
      renderActiveCards();
      break;

    default:
      LogAction("Sabotaje desconocido.");
  }
}

// Jugar una carta
function playCard(index) {
  if (!playerTurn) {
    LogAction("Es el turno de la máquina. ¡No puedes jugar cartas ahora!");
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
      LogAction("Esta carta no tiene efecto.");
  }
}

// Efectos de las cartas de tripulante
function handleTripulanteEffect(card) {
  if (card.effect === "reveal") {
    if (deck.length > 0) {
      const revealedCard = deck.pop();
      LogAction(`Detective: Has revelado la carta ${revealedCard.name}`);
      activeCards.push(revealedCard);
      renderActiveCards();
    } else {
      LogAction("No hay más cartas en el mazo para revelar.");
    }
  } else if (card.effect === "repair") {
    LogAction("Ingeniero: Reparación activada. Resuelve un sabotaje.");
    // Lógica para resolver sabotajes
  } else if (card.effect === "draw") {
    LogAction("Explorador: Robas dos cartas adicionales.");
    if (deck.length > 0) playerHand.push(deck.pop());
    if (deck.length > 0) playerHand.push(deck.pop());
    renderPlayerHand();
    updateDeckCount();
  } else if (card.effect === "defense") {
    LogAction("Guardián: Bloqueo activado. El próximo sabotaje será bloqueado.");
    // Lógica para bloquear sabotajes
  }
}

// Efectos de las cartas de evento
function handleEventEffect(card) {
  if (card.effect === "remove-sabotage") {
    LogAction("Evento: Todos los sabotajes han sido eliminados.");
    activeCards = activeCards.filter((c) => c.type !== "impostor");
    renderActiveCards();
  } else if (card.effect === "lose-hand") {
    LogAction("Evento: ¡Has perdido todas tus cartas!");
    playerHand = [];
    renderPlayerHand();
  }
}

// Pasar el turno
function passTurn() {
  if (!playerTurn) {
    LogAction("No puedes pasar el turno en este momento.");
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
function machineTurn() {
  // Verificar si el mazo está vacío
  if (deck.length === 0) {
    logAction("El mazo está vacío. Fin del juego.");
    return;
  }

  logAction("La máquina está jugando su turno...");

  // Robar una carta
  const card = deck.pop();
  updateDeckCount();

  if (card.type === "impostor") {
    logAction(`La máquina ha activado un impostor: ${card.name}`);
    activeCards.push(card);
    renderActiveCards();
    applyImpostorEffect(card);
  } else if (card.type === "evento") {
    logAction(`La máquina ha activado un evento: ${card.name}`);
    handleEventEffect(card);
  } else {
    logAction(`La máquina ha guardado la carta: ${card.name}`);
    opponentHand.push(card);
    renderOpponentHand();
  }

  // Verificar condiciones de victoria o derrota
  if (checkWinCondition()) return;

  // Cambiar turno al jugador
  logAction("Es el turno del jugador.");
  playerTurn = true;
  updateTurnIndicator();
  passTurnButton.style.display = "none";
}

// Verificar condiciones de victoria o derrota
function checkWinCondition() {
  const sabotageLimit = 3;
  const activeSabotages = activeCards.filter((card) => card.type === "impostor").length;

  if (activeSabotages >= sabotageLimit) {
    LogAction("¡La máquina gana! Demasiados sabotajes activos.");
    resetGame();
    return;
  }

  if (playerHand.length === 0 && deck.length === 0) {
    LogAction("¡La máquina gana! No tienes cartas y no puedes robar.");
    resetGame();
    return;
  }

  if (deck.length === 0 && activeSabotages === 0) {
    LogAction("¡Felicidades! Has ganado resolviendo todos los sabotajes.");
    resetGame();
    return;
  }
}

// Reiniciar el juego
function resetGame() {
  LogAction("El juego se reiniciará.");
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
