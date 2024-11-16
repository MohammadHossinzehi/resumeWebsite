document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let gameOver = false;

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

  function update() {
    draw();
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      playerImage,
      player.x - player.width / 2,
      player.y - player.height / 2,
      player.width,
      player.height
    );
  }
});
