var container = document.getElementById('container');
var result = {
    ai: document.getElementById("ai"),
    human: document.getElementById("human")
};
var ai = 0, human = 0;

var game = new Phaser.Game(500, 600, Phaser.AUTO, 'container', {
        preload: preload,
        create: create,
        update: update
    }),
    playerRocket,
    playerRocketInitPosY = 560,
    computerRocket,
    computerRocketInitPosY = 40,
    computerRocketSpeed = 240,
    ball,
    ballSpeed = 300,
    ballReleased = false;

function releaseBall() {
    if (!ballReleased) {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = ballSpeed;

        ballReleased = true;
    }
}

function createRocket(x, y) {
    var rocket = game.add.sprite(x, y, 'rocket');
    rocket.anchor.setTo(0.5, 0.5);
    rocket.body.collideWorldBounds = true;
    rocket.body.bounce.setTo(1, 1);
    rocket.body.immovable = true;

    return rocket;
}

function ballHitsRocket(_ball, _rocket) {
    var diff = 0;

    if (_ball.x < _rocket.x) {
        //  ball on the left side of rocket
        diff = _rocket.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _rocket.x) {
        //  ball on the right side of rocket
        diff = _ball.x - _rocket.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        //  ball on the center of rocket. Adding some random velocity
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function checkGoal() {
    if (ball.y < computerRocketInitPosY - 15) {
        human += 1;
        setBall();
    } else if (ball.y > playerRocketInitPosY + 15) {
        ai += 1;
        setBall();
    }
}

function setBall() {
    if (ballReleased) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;

        ballReleased = false;
        
        result.ai.innerText = ai;
        result.human.innerText = human;
    }

}

function preload() {
    game.load.image('rocket', './static/img/bet.png');
    game.load.image('ball', './static/img/ball.png');
    game.load.image('background', './static/img/background.png');
    result.ai.innerText = ai;
    result.human.innerText = human;
}

function create() {
    game.add.tileSprite(0, 0, 500, 600, 'background');

    playerRocket = createRocket(game.world.centerX, playerRocketInitPosY);
    computerRocket = createRocket(game.world.centerX, computerRocketInitPosY);

    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    game.input.onDown.add(releaseBall, this);
}

function update() {
    //Manage player rocket
    playerRocket.x = game.input.x;

    var playerRocketHalfWidth = playerRocket.width / 2;

    if (playerRocket.x < playerRocketHalfWidth) {
        playerRocket.x = playerRocketHalfWidth;

    } else if (playerRocket.x > game.width - playerRocketHalfWidth) {
        playerRocket.x = game.width - playerRocketHalfWidth;
    }

    //Manahe computer rocket
    if (computerRocket.x - ball.x < -15) {
        computerRocket.body.velocity.x = computerRocketSpeed;
    } else if (computerRocket.x - ball.x > 15) {
        computerRocket.body.velocity.x = -computerRocketSpeed;
    } else {
        computerRocket.body.velocity.x = 0;
    }

    //Check collide ball and rockets
    game.physics.collide(ball, playerRocket, ballHitsRocket, null, this);
    game.physics.collide(ball, computerRocket, ballHitsRocket, null, this);

    checkGoal();
}