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
