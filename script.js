// Estado inicial del juego
let tareasCompletadas = 0;
let sabotajesActivos = 0;
let turnosRestantes = 10;
const maxTareas = 5;
const maxSabotajes = 5;

// Referencias al DOM
const status = document.getElementById("status");
const saboteos = document.getElementById("saboteos");
const cardsContainer = document.getElementById("cards");
const nextTurnButton = document.getElementById("next-turn");

// Cartas disponibles
const cartas = [
  { tipo: "tarea", texto: "Reparar cables", puntos: 1 },
  { tipo: "tarea", texto: "Calibrar motores", puntos: 1 },
  { tipo: "tarea", texto: "Limpiar filtro", puntos: 1 },
  { tipo: "especial", texto: "Reparar sabotaje", efecto: "Eliminar sabotaje activo" }
];

// Función para actualizar el estado del juego
function actualizarEstado() {
  status.textContent = `Tareas completadas: ${tareasCompletadas}/${maxTareas}`;
  saboteos.textContent = `Sabotajes activos: ${sabotajesActivos}/${maxSabotajes}`;
  if (tareasCompletadas >= maxTareas) {
    alert("¡Victoria! Has completado todas las tareas.");
    reiniciarJuego();
  } else if (saboteosActivos >= maxSabotajes) {
    alert("¡Derrota! El impostor ha saboteado demasiado.");
    reiniciarJuego();
  } else if (turnosRestantes <= 0) {
    alert("¡Derrota! Te has quedado sin turnos.");
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
  } else if (carta.tipo === "especial" && sabotajesActivos > 0) {
    sabotajesActivos--;
    alert(`Has reparado un sabotaje usando: ${carta.texto}`);
  } else if (carta.tipo === "especial") {
    alert("No hay sabotajes activos para reparar.");
  }
  turnosRestantes--;
  actualizarEstado();
  generarCartas();
}

// Función para la acción del impostor
function accionImpostor() {
  if (Math.random() > 0.5 && sabotajesActivos < maxSabotajes) {
    sabotajesActivos++;
    alert("¡El impostor ha activado un sabotaje!");
  }
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
  accionImpostor();
  turnosRestantes--;
  actualizarEstado();
  generarCartas();
};

// Iniciar el juego
reiniciarJuego();