// Baraja inicial de cartas
const deck = [
  { type: "tripulante", name: "Detective", effect: "reveal" },
  { type: "tripulante", name: "Ingeniero", effect: "repair" },
  { type: "impostor", name: "Impostor 1", sabotage: "disable-next-turn" },
  { type: "impostor", name: "Impostor 2", sabotage: "lose-card" },
  { type: "evento", name: "Sabotaje: Luces", effect: "sabotage-lights" },
  { type: "evento", name: "Reparación", effect: "remove-sabotage" },
];

// Estado inicial del juego
let playerHand = [];
let activeCards = [];
let sabotages = [];
let deckCount = deck.length;
let playerTurnDisabled = false;

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
  if (playerTurnDisabled) {
    alert("¡Tu turno está deshabilitado por un sabotaje!");
    playerTurnDisabled = false; // Restablece el estado para el próximo turno
    return;
  }

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
  applyCardEffect(card);
  renderPlayerHand();
  renderActiveCards();
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
      playerTurnDisabled = true;
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
  }
}

// Efectos de cartas de eventos
function handleEventEffect(card) {
  if (card.effect === "sabotage-lights") {
    alert("Evento: Sabotaje de luces activado. El próximo turno es más difícil.");
    playerTurnDisabled = true; // Simula un efecto negativo
  } else if (card.effect === "remove-sabotage") {
    alert("Evento: Todos los sabotajes han sido eliminados.");
    sabotages = [];
    renderActiveCards();
  }
}

// Renderizar la zona de juego
function renderActiveCards() {
  activeCardsElem.innerHTML = "";
  sabotages.forEach((card) => {
    const cardElem = document.createElement("div");
    cardElem.classList.add("card", card.type);
    cardElem.textContent = `${card.name} (Sabotaje)`;
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

// Evento para robar cartas
drawCardButton.addEventListener("click", drawCard);

// Actualizar el contador inicial del mazo
updateDeckCount();
