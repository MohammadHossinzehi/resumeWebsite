document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let gameOver = false;
  let poleGap = 150;
  let poleWidth = 70;
  let score = 0;
  let gameStart = false;
  let poleSpacing = 600;

  // Load images
  const playerImage = new Image();
  playerImage.src = "../images/bird.png";
  const pipeImage = new Image();
  pipeImage.src = "../images/pipe.png";
  const backgroundImage = new Image();
  backgroundImage.src = "../images/background.png";
  const roofImage = new Image();
  roofImage.src = "../images/roof.png";

  // Handle image loading errors
  playerImage.onerror = () => {
    console.error("Player image failed to load.");
  };
  pipeImage.onerror = () => {
    console.error("Pipe image failed to load.");
  };
  backgroundImage.onerror = () => {
    console.error("Background image failed to load.");
  };
  roofImage.onerror = () => {
    console.error("Roof image failed to load.");
  };

  // Ensure all images are loaded before starting the game
  const images = [playerImage, pipeImage, backgroundImage, roofImage];
  let loadedImages = 0;

  images.forEach((image) => {
    image.onload = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        displayScores();
        update();
      }
    };
  });

  // Player object
  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 60,
    height: 40,
    speed: 5,
    jumpSpeed: 0,
    isJumping: false,
    gravity: 0.13,
    jumpStrength: 4,
    groundLevel: canvas.height - 40,
    roofLevel: 40,
  };

  const poles = [
    createPole(canvas.width),
    createPole(canvas.width + poleSpacing),
    createPole(canvas.width + poleSpacing * 2),
  ];

  let backgroundX = 0;
  let roofFloorX = 0;
  const backgroundSpeed = 2;
  const roofFloorSpeed = backgroundSpeed * 0.5;

  const keys = {
    space: false,
    canJump: true,
  };

  window.addEventListener("keydown", (e) => {
    if (e.key === " " && keys.canJump) {
      keys.space = true;
      keys.canJump = false;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === " ") {
      keys.space = false;
      keys.canJump = true;
    }
  });

  function createPole(x) {
    const topHeight = Math.random() * (canvas.height - poleGap - 100) + 50;
    const bottomHeight = canvas.height - (topHeight + poleGap);
    return {
      top: { x, y: 0, width: poleWidth, height: topHeight },
      bottom: {
        x,
        y: topHeight + poleGap,
        width: poleWidth,
        height: bottomHeight,
      },
      passed: false,
    };
  }

  function update() {
    if (!gameStart) {
      if (keys.space) {
        player.isJumping = true;
        player.jumpSpeed = -player.jumpStrength;
        gameStart = true;
        keys.space = false;
      }
      backgroundX -= backgroundSpeed;
      if (backgroundX <= -canvas.width) {
        backgroundX = 0;
      }

      roofFloorX -= roofFloorSpeed;
      if (roofFloorX <= -roofImage.width) {
        roofFloorX = 0;
      }
      draw();
      requestAnimationFrame(update);
    } else if (!gameOver) {
      if (keys.space) {
        player.isJumping = true;
        player.jumpSpeed = -player.jumpStrength;
        keys.space = false;
      }

      if (player.isJumping) {
        player.y += player.jumpSpeed;
        player.jumpSpeed += player.gravity;
      }

      if (player.y - player.height / 2 < player.roofLevel) {
        player.y = player.roofLevel + player.height / 2;
        player.jumpSpeed = 0;
      }

      if (player.y >= player.groundLevel) {
        player.y = player.groundLevel;
        player.jumpSpeed = 0;
        player.isJumping = false;
        gameOver = true;
        document.getElementById("gameOverScreen").style.display = "block";
        document.getElementById("scoreDisplay").innerText = "Score: " + score;
      }

      poles.forEach((pole) => {
        pole.top.x -= backgroundSpeed;
        pole.bottom.x -= backgroundSpeed;

        if (
          (player.x + player.width / 2 > pole.top.x &&
            player.x - player.width / 2 < pole.top.x + pole.top.width &&
            player.y + player.height / 2 > pole.top.y &&
            player.y - player.height / 2 < pole.top.y + pole.top.height) ||
          (player.x + player.width / 2 > pole.bottom.x &&
            player.x - player.width / 2 < pole.bottom.x + pole.bottom.width &&
            player.y + player.height / 2 > pole.bottom.y &&
            player.y - player.height / 2 < pole.bottom.y + pole.bottom.height)
        ) {
          gameOver = true;
          document.getElementById("gameOverScreen").style.display = "block";
          document.getElementById("scoreDisplay").innerText = "Score: " + score;
        }

        if (pole.top.x + pole.top.width < player.x && !pole.passed) {
          score++;
          pole.passed = true;
        }

        if (pole.top.x + pole.top.width < 0) {
          poles.shift();
          poles.push(createPole(poles[poles.length - 1].top.x + poleSpacing));
        }
      });

      backgroundX -= backgroundSpeed;
      if (backgroundX <= -canvas.width) {
        backgroundX = 0;
      }

      roofFloorX -= roofFloorSpeed;
      if (roofFloorX <= -roofImage.width) {
        roofFloorX = 0;
      }

      draw();
      requestAnimationFrame(update);
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      backgroundImage,
      backgroundX,
      0,
      canvas.width,
      canvas.height
    );
    context.drawImage(
      backgroundImage,
      backgroundX + canvas.width,
      0,
      canvas.width,
      canvas.height
    );

    const roofImageWidth = roofImage.width;
    const roofImageHeight = player.roofLevel;
    for (
      let x = backgroundX % roofImageWidth;
      x < canvas.width;
      x += roofImageWidth
    ) {
      context.drawImage(roofImage, x, 0, roofImageWidth, roofImageHeight);
    }

    for (
      let x = backgroundX % roofImageWidth;
      x < canvas.width;
      x += roofImageWidth
    ) {
      context.drawImage(
        roofImage,
        x,
        player.groundLevel,
        roofImageWidth,
        roofImageHeight
      );
    }

    context.drawImage(
      playerImage,
      player.x - player.width / 2,
      player.y - player.height / 2,
      player.width,
      player.height
    );

    poles.forEach((pole) => {
      context.save();
      context.translate(
        pole.top.x + pole.top.width / 2,
        pole.top.y + pole.top.height / 2
      );
      context.rotate(Math.PI);
      context.drawImage(
        pipeImage,
        -pole.top.width / 2,
        -pole.top.height / 2,
        pole.top.width,
        pole.top.height
      );
      context.restore();

      context.drawImage(
        pipeImage,
        pole.bottom.x,
        pole.bottom.y,
        pole.bottom.width,
        pole.bottom.height
      );
    });

    const boxWidth = 150;
    const boxHeight = 50;
    const boxX = canvas.width / 2 - boxWidth / 2;
    const boxY = canvas.height / 2 - boxHeight / 2 - 200;

    context.fillStyle = "white";
    context.font = "50px Arial";
    context.fillText("Score: " + score, boxX, boxY + boxHeight - 10);
  }

  function resetGame() {
    gameOver = false;
    gameStart = false;
    score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    poles.length = 0;
    poles.push(
      createPole(canvas.width),
      createPole(canvas.width + poleSpacing),
      createPole(canvas.width + poleSpacing * 2)
    );
    document.getElementById("gameOverScreen").style.display = "none";
    update();
  }

  function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("scores", JSON.stringify(scores.slice(0, 10)));
    displayScores();
  }

  function displayScores() {
    const scoreList = document.getElementById("scoreList");
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scoreList.innerHTML = "";
    scores.forEach(({ name, score }) => {
      const li = document.createElement("li");
      li.textContent = `${name}: ${score}`;
      scoreList.appendChild(li);
    });
  }

  document.getElementById("retryButton").addEventListener("click", resetGame);

  document.getElementById("submitScore").addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value;
    if (playerName) {
      saveScore(playerName, score);
      resetGame();
    }
  });
});
