document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let gameOver = false;
    let poleGap = 200;
    let poleWidth = 70;
    let score = 0;
    let gameStart = false;

    // Load images
    const playerImage = new Image();
    playerImage.src = '../images/bird.png';

    const pipeImage = new Image();
    pipeImage.src = '../images/pipe.png';

    const backgroundImage = new Image();
    backgroundImage.src = '../images/background.png';

    const roofImage = new Image();
    roofImage.src = '../images/roof.png';

    // Player object
    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 50,
        height: 40,
        speed: 5,
        jumpSpeed: 0,
        isJumping: false,
        gravity: 0.1,
        jumpStrength: 3,
        groundLevel: canvas.height - 40,
        roofLevel: 40
    };

    const poles = [
        createPole(canvas.width),
        createPole(canvas.width + 700)
    ];

    let backgroundX = 0;
    let roofFloorX = 0;
    const backgroundSpeed = 2;
    const roofFloorSpeed = backgroundSpeed * 0.5;

    const keys = {
        space: false,
        canJump: true
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === ' ' && keys.canJump) {
            keys.space = true;
            keys.canJump = false;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === ' ') {
            keys.space = false;
            keys.canJump = true;
        }
    });

    function createPole(x) {
        const topHeight = Math.random() * (canvas.height - poleGap - 100) + 50;
        const bottomHeight = canvas.height - (topHeight + poleGap);
        return {
            top: { x, y: 0, width: poleWidth, height: topHeight },
            bottom: { x, y: topHeight + poleGap, width: poleWidth, height: bottomHeight },
            passed: false
        };
    }

    function update() {
        if (!gameStart) {
            if (keys.space) {
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
                document.getElementById('gameOverScreen').style.display = 'block';
                document.getElementById('scoreDisplay').innerText = 'Score: ' + score;
            }

            poles.forEach(pole => {
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
                    document.getElementById('gameOverScreen').style.display = 'block';
                    document.getElementById('scoreDisplay').innerText = 'Score: ' + score;
                }

                if (pole.top.x + pole.top.width < player.x && !pole.passed) {
                    score++;
                    pole.passed = true;
                }

                if (pole.top.x + pole.top.width < 0) {
                    Object.assign(pole, createPole(canvas.width));
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

        context.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
        context.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

        const roofImageWidth = roofImage.width;
        const roofImageHeight = player.roofLevel;
        for (let x = backgroundX % roofImageWidth; x < canvas.width; x += roofImageWidth) {
            context.drawImage(roofImage, x, 0, roofImageWidth, roofImageHeight);
        }

        for (let x = backgroundX % roofImageWidth; x < canvas.width; x += roofImageWidth) {
            context.drawImage(roofImage, x, player.groundLevel, roofImageWidth, roofImageHeight);
        }

        context.drawImage(playerImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);

        poles.forEach(pole => {
            context.save();
            context.translate(pole.top.x + pole.top.width / 2, pole.top.y + pole.top.height / 2);
            context.rotate(Math.PI);
            context.drawImage(pipeImage, -pole.top.width / 2, -pole.top.height / 2, pole.top.width, pole.top.height);
            context.restore();

            context.drawImage(pipeImage, pole.bottom.x, pole.bottom.y, pole.bottom.width, pole.bottom.height);
        });

        const boxWidth = 150;
        const boxHeight = 50;
        const boxX = canvas.width / 2 - boxWidth / 2;
        const boxY = canvas.height / 2 - boxHeight / 2 - 200; // Center 200px above

        context.fillStyle = 'white';
        context.fillRect(boxX, boxY, boxWidth, boxHeight);

        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.fillText('Score: ' + score, boxX + 10, boxY + boxHeight - 10);
    }

    function resetGame() {
        gameOver = false;
        gameStart = false;
        score = 0;
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        poles.length = 0;
        poles.push(createPole(canvas.width), createPole(canvas.width + 700));
        document.getElementById('gameOverScreen').style.display = 'none';
        update();
    }

    // Debugging: Check if the button exists
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', resetGame);
    } else {
        console.error('Retry button not found');
    }

    playerImage.onload = () => {
        pipeImage.onload = () => {
            backgroundImage.onload = () => {
                roofImage.onload = () => {
                    update();
                };
            };
        };
    };
});
