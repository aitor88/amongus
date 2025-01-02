// Estado inicial del juego
let tareasCompletadas = 0;
let sabotajesActivos = 0;
let turnosRestantes = 10;
const maxTareas = 5;

// Referencias a elementos del DOM
const status = document.getElementById("status");
const cardsContainer = document.getElementById("cards");
const nextTurnButton = document.getElementById("next-turn");

// Cartas disponibles
const cartas = [
  { tipo: "tarea", texto: "Reparar cables", puntos: 1 },
  { tipo: "tarea", texto: "Calibrar motores", puntos: 1 },
  { tipo: "tarea", texto: "Limpiar filtro", puntos: 1 },
  { tipo: "sabotaje", texto: "Apagar luces", efecto: "Perder turno" },
  { tipo: "especial", texto: "Escanear en medbay", efecto: "Eliminar sabotaje" }
];

// Función para actualizar el estado del juego
function actualizarEstado() {
  status.textContent = `Tareas completadas: ${tareasCompletadas}/${maxTareas} | Turnos restantes: ${turnosRestantes}`;
  if (tareasCompletadas >= maxTareas) {
    alert("¡Has ganado! Todas las tareas están completas.");
    reiniciarJuego();
  } else if (turnosRestantes <= 0) {
    alert("¡Perdiste! El impostor ha ganado.");
    reiniciarJuego();
  }
}

// Función para generar cartas
function generarCartas() {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const carta = cartas[Math.floor(Math.random() * cartas.length)];
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.textContent = carta.texto;
    cardElement.onclick = () => usarCarta(carta);
    cardsContainer.appendChild(cardElement);
  }
}

// Función para usar una carta
function usarCarta(carta) {
  if (carta.tipo === "tarea") {
    tareasCompletadas += carta.puntos;
  } else if (carta.tipo === "sabotaje") {
    sabotajesActivos++;
    alert(`¡Sabotaje activado! Efecto: ${carta.efecto}`);
  } else if (carta.tipo === "especial" && sabotajesActivos > 0) {
    sabotajesActivos--;
    alert(`Has eliminado un sabotaje usando: ${carta.texto}`);
  } else if (carta.tipo === "especial") {
    alert("No hay sabotajes activos para eliminar.");
  }
  turnosRestantes--;
  actualizarEstado();
  generarCartas();
}

// Función para reiniciar el juego
function reiniciarJuego() {
  tareasCompletadas = 0;
  sabotajesActivos = 0;
  turnosRestantes = 10;
  actualizarEstado();
  generarCartas();
}

// Botón de siguiente turno
nextTurnButton.onclick = () => {
  turnosRestantes--;
  if (Math.random() > 0.7) {
    alert("El impostor ha jugado un sabotaje.");
    sabotajesActivos++;
  }
  actualizarEstado();
  generarCartas();
};

// Iniciar el juego
reiniciarJuego();