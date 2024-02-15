const { Application, Sprite, Texture, Graphics } = PIXI;

const app = new Application({
    width: 1280,
    height: 720,
});

document.body.appendChild(app.view);

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

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let leftKeyDown = false;
let rightKeyDown = false;
const bullets = [];

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
        shootBullet();
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
}

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
});