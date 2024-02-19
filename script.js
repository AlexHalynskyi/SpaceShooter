const { Application, Sprite, Texture, Graphics, Text, TextStyle } = PIXI;

const app = new Application({
    width: 1280,
    height: 720,
});

document.getElementById('appContainer').appendChild(app.view);

document.getElementById('reloadButton').addEventListener('click', () => {
    location.reload();
});

const textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 30,
    fill: 'red',
});

const resultTextStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 50,
    fill: 'red',
});

const background = Sprite.from('assets/background.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

const spaceship = Sprite.from('assets/spaceship.png');
spaceship.anchor.set(0.5);
spaceship.x = app.screen.width / 2;
spaceship.y = app.screen.height - 100;
spaceship.scale.set(0.2);
app.stage.addChild(spaceship);

const asteroidTexture = Texture.from('assets/asteroid.png');

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let leftKeyDown = false;
let rightKeyDown = false;
const bullets = [];
const asteroids = [];
let bulletsLeft = 10;
let timeLeft = 60;

for (let i = 0; i < 7; i++) {
    const asteroid = new Sprite(asteroidTexture);
    asteroid.anchor.set(0.5);
    asteroid.x = Math.random() * app.screen.width;
    asteroid.y = Math.random() * 200 + 100;
    asteroid.scale.set(0.15);
    asteroid.rotation = Math.random() * Math.PI * 2;
    app.stage.addChild(asteroid);
    asteroids.push(asteroid);
}

const bulletCounter = new Text(`bullets: ${bulletsLeft}/10`, textStyle);
bulletCounter.position.set(10, 10);
app.stage.addChild(bulletCounter);

const timerText = new Text(`${timeLeft}`, textStyle);
timerText.position.set(app.screen.width - 50, 10);
app.stage.addChild(timerText);

const loseText = new Text("YOU LOSE", resultTextStyle);
loseText.position.set(app.screen.width / 2 - loseText.width / 2, app.screen.height / 2 - loseText.height / 2);

const winText = new Text("YOU WIN", resultTextStyle);
winText.position.set(app.screen.width / 2 - winText.width / 2, app.screen.height / 2 - winText.height / 2);

function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
        leftKeyDown = true;
    } else if (event.key === "ArrowRight") {
        rightKeyDown = true;
    }
}

function onKeyUp(event) {
    if (event.key === "ArrowLeft") {
        leftKeyDown = false;
    } else if (event.key === "ArrowRight") {
        rightKeyDown = false;
    } else if (event.code === "Space") {
        if (bulletsLeft > 0) {
            shootBullet();
        }
    }
}

function shootBullet() {
    const bullet = new Graphics();
    bullet.beginFill(0xFF0000);
    bullet.drawRect(0, 0, 5, 10);
    bullet.endFill();
    bullet.x = spaceship.x;
    bullet.y = spaceship.y - spaceship.height / 2;
    app.stage.addChild(bullet);
    bullets.push(bullet);
    bulletsLeft--;
    bulletCounter.text = `bullets: ${bulletsLeft}/10`;
}

const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft >= 0) {
        timerText.text = `${timeLeft}`;
    } else {
        clearInterval(timerInterval);
    }
}, 1000);

app.ticker.add(() => {
    const speed = 10;
    if (leftKeyDown) {
        spaceship.x -= speed;
        if (spaceship.x < spaceship.width / 2) {
            spaceship.x = spaceship.width / 2;
        }
    }
    if (rightKeyDown) {
        spaceship.x += speed;
        if (spaceship.x > app.screen.width - spaceship.width / 2) {
            spaceship.x = app.screen.width - spaceship.width / 2;
        }
    }

    bullets.forEach(bullet => {
        bullet.y -= 10;
        if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });

    bullets.forEach(bullet => {
        asteroids.forEach(asteroid => {
            if (testHitAsteroid(bullet, asteroid)) {
                app.stage.removeChild(bullet);
                app.stage.removeChild(asteroid);
                bullets.splice(bullets.indexOf(bullet), 1);
                asteroids.splice(asteroids.indexOf(asteroid), 1);
            }
        });
    });

    if ((bulletsLeft === 0 || timeLeft === 0) && asteroids.length > 0 && bullets.length === 0) {
        handleEndGame(loseText);
    }

    if (asteroids.length === 0) {
        handleEndGame(winText);
    }
});

function testHitAsteroid(bullet, asteroid) {
    const circle = asteroid.getBounds();

    const circleX = circle.x + circle.width / 2;
    const circleY = circle.y + circle.height / 2;
    const circleRadius = Math.max(circle.width, circle.height) / 2 - 25;

    const distanceX = bullet.x - circleX;
    const distanceY = bullet.y - circleY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared < (circleRadius * circleRadius);
}

function handleEndGame(endText) {
    app.stage.addChild(endText);
    timeLeft = 0;
    bulletsLeft = 0;
} 