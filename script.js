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
let activeCards = [];
let sabotages = [];
let discoveredImpostors = 0;
let maxSabotages = 3;
let deckCount = deck.length;
let playerTurn = true; // Comienza con el jugador

// Referencias a elementos HTML
const deckCountElem = document.getElementById("deck-count");
const playerHandElem = document.getElementById("player-hand");
const activeCardsElem = document.getElementById("active-cards");
const drawCardButton = document.getElementById("draw-card");
const turnIndicator = document.createElement("div");
turnIndicator.id = "turn-indicator";
document.body.appendChild(turnIndicator);

// Función para actualizar el contador del mazo
function updateDeckCount() {
  deckCountElem.textContent = deckCount;
}

// Función para alternar turnos
function switchTurn() {
  playerTurn = !playerTurn;
  if (!playerTurn) {
    turnIndicator.textContent = "Turno de la Máquina...";
    turnIndicator.style.backgroundColor = "red";
    setTimeout(machineTurn, 1000); // Espera 1 segundo para el turno de la máquina
  } else {
    turnIndicator.textContent = "Tu Turno";
    turnIndicator.style.backgroundColor = "green";
  }
}

// Función para el turno del jugador
function playerTurnHandler() {
  if (!playerTurn) {
    alert("Es el turno de la máquina. ¡Espera!");
    return;
  }
  drawCard();
  checkGameOver();
}

// Función para el turno de la máquina
function machineTurn() {
  if (deckCount === 0) {
    alert("El mazo está vacío. ¡El juego ha terminado!");
    return;
  }

  // Priorizar sabotajes si hay pocos en juego
  if (sabotages.length < maxSabotages) {
    const sabotageCard = deck.find((card) => card.type === "impostor");
    if (sabotageCard) {
      activateSabotage(sabotageCard);
      deck.splice(deck.indexOf(sabotageCard), 1);
      deckCount--;
      updateDeckCount();
      renderActiveCards();
      checkGameOver();
      switchTurn();
      return;
    }
  }

  // Si no hay impostores, robar una carta aleatoria
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(cardIndex, 1)[0];
  activeCards.push(card);
  deckCount--;

  if (card.type === "impostor") {
    activateSabotage(card);
  } else if (card.type === "evento") {
    handleEventEffect(card);
  } else {
    alert(`La máquina ha jugado: ${card.name}`);
  }

  updateDeckCount();
  renderActiveCards();

  // Cambiar de turno al jugador
  checkGameOver();
  switchTurn();
}

// Función para robar una carta
function drawCard() {
  if (deckCount > 0) {
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
  if (!playerTurn) {
    alert("Es el turno de la máquina. ¡Espera!");
    return;
  }

  const card = playerHand.splice(index, 1)[0];
  activeCards.push(card);
  applyCardEffect(card);
  renderPlayerHand();
  renderActiveCards();

  checkGameOver();
  switchTurn();
}

// Aplicar efecto de una carta
function applyCardEffect(card) {
  switch (card.type) {
    case "tripulante":
      handleTripulanteEffect(card);
      break;
    case "impostor":
      activateSabotage(card);
      break;
    case "evento":
      handleEventEffect(card);
      break;
  }
}

// Efectos de cartas tripulantes
function handleTripulanteEffect(card) {
  if (card.effect === "reveal") {
    alert("Detective: Revela una carta del mazo.");
    if (deckCount > 0) {
      const revealedCard = deck.shift();
      alert(`Has revelado: ${revealedCard.name}`);
      activeCards.push(revealedCard);
      deckCount--;
      updateDeckCount();
      renderActiveCards();
    }
  } else if (card.effect === "repair") {
    alert("Ingeniero: Reparación activada.");
    if (sabotages.length > 0) {
      const resolved = sabotages.pop();
      alert(`Sabotaje resuelto: ${resolved.name}`);
      renderActiveCards();
    } else {
      alert("No hay sabotajes activos.");
    }
  }
}

// Activar un sabotaje (lógica de impostores)
function activateSabotage(card) {
  alert(`¡Un impostor ha activado un sabotaje: ${card.sabotage}!`);
  sabotages.push(card);

  switch (card.sabotage) {
    case "disable-next-turn":
      alert("Sabotaje: ¡Tu próximo turno está deshabilitado!");
      break;
    case "lose-card":
      if (playerHand.length > 0) {
        const lostCard = playerHand.pop();
        alert(`Has perdido la carta: ${lostCard.name}`);
        renderPlayerHand();
      } else {
        alert("No tienes cartas para perder.");
      }
      break;
    case "double-sabotage":
      alert("Sabotaje: ¡Se han activado dos sabotajes simultáneamente!");
      sabotages.push({ name: "Sabotaje adicional" });
      sabotages.push({ name: "Sabotaje adicional" });
      renderActiveCards();
      break;
  }
}

// Efectos de cartas de eventos
function handleEventEffect(card) {
  if (card.effect === "sabotage-lights") {
    alert("Evento: Sabotaje de luces activado. El próximo turno es más difícil.");
  } else if (card.effect === "remove-sabotage") {
    alert("Evento: Todos los sabotajes han sido eliminados.");
    sabotages = [];
    renderActiveCards();
  } else if (card.effect === "lose-hand") {
    alert("Evento: ¡Has perdido todas tus cartas!");
    playerHand = [];
    renderPlayerHand();
  }
}

// Renderizar la zona de juego
function renderActiveCards() {
  activeCardsElem.innerHTML = "";
  sabotages.forEach((card) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", card.type || "sabotage");
    cardElem.textContent = `${card.name || "Sabotaje"} (Sabotaje)`;
    activeCardsElem.appendChild(cardElem);
  });

  activeCards.forEach((card) => {
    if (card.type !== "impostor") {
      const cardElem = document.createElement("div");
      cardElem.classList.add("card", card.type);
      cardElem.textContent = card.name;
      activeCardsElem.appendChild(cardElem);
    }
  });
}

// Verificar condiciones de victoria o derrota
function checkGameOver() {
  if (discoveredImpostors >= 6) {
    alert("¡Has ganado! Descubriste a todos los impostores.");
    return;
  }
  if (sabotages.length >= maxSabotages) {
    alert("¡La máquina ha ganado! Se acumularon demasiados sabotajes.");
    return;
  }
}

// Evento para robar cartas
drawCardButton.addEventListener("click", playerTurnHandler);

// Actualizar el contador inicial del mazo
updateDeckCount();
