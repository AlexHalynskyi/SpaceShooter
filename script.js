const { Application, Sprite, Texture } = PIXI;

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
    }
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
});