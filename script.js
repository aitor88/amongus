<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego de Cartas - Among Us</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #20232a;
      color: #61dafb;
    }
    .container {
      margin: 20px auto;
      width: 80%;
      max-width: 600px;
    }
    .card {
      display: inline-block;
      padding: 15px;
      margin: 10px;
      border: 2px solid #61dafb;
      border-radius: 10px;
      background-color: #282c34;
      color: white;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: scale(1.1);
    }
    #status {
      margin: 20px 0;
      font-size: 1.2em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Juego de Cartas - Among Us</h1>
    <p>Completa las tareas antes de que el impostor te elimine.</p>
    <div id="status">Tareas completadas: 0/5</div>
    <div id="cards">
      <!-- Las cartas aparecerán aquí -->
    </div>
    <button id="next-turn">Siguiente Turno</button>
  </div>
  <script src="script.js"></script>
</body>
</html>