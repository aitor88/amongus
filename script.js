<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Salta y Brilla</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }

        canvas {
            display: block;
            background: linear-gradient(to bottom, #000428, #004e92);
        }

        .score {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="score">Score: <span id="score">0</span></div>
    <canvas id="gameCanvas"></canvas>

    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const gravity = 0.5;
        const jumpStrength = -10;
        const platformWidth = 100;
        const platformHeight = 10;
        let score = 0;

        const player = {
            x: canvas.width / 2 - 15,
            y: canvas.height - 50,
            width: 30,
            height: 30,
            color: "yellow",
            dx: 0,
            dy: 0,
        };

        const platforms = [];

        function createPlatform(x, y) {
            return { x, y, width: platformWidth, height: platformHeight, color: "white" };
        }

        function initPlatforms() {
            for (let i = 0; i < 5; i++) {
                platforms.push(createPlatform(
                    Math.random() * (canvas.width - platformWidth),
                    canvas.height - i * 150
                ));
            }
        }

        function drawPlayer() {
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        function drawPlatforms() {
            platforms.forEach(platform => {
                ctx.fillStyle = platform.color;
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });
        }

        function updatePlayer() {
            player.dy += gravity;
            player.y += player.dy;
            player.x += player.dx;

            // Prevent player from going off-screen
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

            // Check collision with platforms
            platforms.forEach(platform => {
                if (
                    player.dy > 0 &&
                    player.x + player.width > platform.x &&
                    player.x < platform.x + platform.width &&
                    player.y + player.height > platform.y &&
                    player.y + player.height < platform.y + platform.height
                ) {
                    player.dy = jumpStrength;
                    score++;
                    document.getElementById("score").innerText = score;
                }
            });

            // Reset if the player falls off the screen
            if (player.y > canvas.height) {
                alert("Game Over! Your score: " + score);
                document.location.reload();
            }
        }

        function updatePlatforms() {
            platforms.forEach(platform => {
                platform.y += 2; // Move platforms down

                // Recycle platforms that move off-screen
                if (platform.y > canvas.height) {
                    platform.x = Math.random() * (canvas.width - platformWidth);
                    platform.y = 0;
                }
            });
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawPlatforms();
            updatePlayer();
            updatePlatforms();
            requestAnimationFrame(gameLoop);
        }

        // Touch controls
        canvas.addEventListener("touchstart", e => {
            const touchX = e.touches[0].clientX;
            if (touchX < canvas.width / 2) {
                player.dx = -5; // Move left
            } else {
                player.dx = 5; // Move right
            }
        });

        canvas.addEventListener("touchend", () => {
            player.dx = 0; // Stop movement
        });

        // Initialize game
        initPlatforms();
        gameLoop();
    </script>
</body>
</html>
