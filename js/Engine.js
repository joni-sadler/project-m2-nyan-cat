// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
 
    // Adding an empty array of shots, since none have been fired at the outset
    this.shots = [];

    this.score = [];

   // We add the background image to the game

    addBackground(this.root);

    // const tealDiv = document.createElement("div");
    // tealDiv.style.width = "475px";
    // tealDiv.style.height = "150px";
    // tealDiv.style.position = "absolute";
    // tealDiv.style.padding = "20px";
    // tealDiv.style.borderRadius = "5px";
    // tealDiv.style.backgroundColor = "aquamarine";
    // tealDiv.style.display = "flex";
    // tealDiv.style.flexDirection = "column";
    // tealDiv.style.justifyContent = "center";
    // tealDiv.style.alignItems = "center";
    // tealDiv.style.textAlign = "center";
    // tealDiv.style.lineHeight = "30px";
    // tealDiv.style.zIndex = "150";
    // tealDiv.innerHTML = "<h3>Press the left and right arrow keys to avoid the Nyancats. Press the up arrow to shoot the Nyancats. Score one point for each Nyancat you hit!</h3>"
    // theRoot.appendChild(tealDiv);

    // const startButton = document.createElement("div");
    // startButton.style.width = "150px";
    // startButton.style.height = "50px";
    // startButton.style.borderRadius = "5px";
    // startButton.style.padding = "10px";
    // startButton.style.marginBottom = "10px";
    // startButton.style.display = "flex";
    // startButton.style.justifyContent = "center";
    // startButton.style.alignItems = "center";
    // startButton.style.backgroundColor = "black";
    // startButton.style.color = "white";
    // startButton.style.fontSize = "18px";
    // startButton.innerText = "CLICK TO PLAY";
    // // startButton.addEventListener('click', gameLoop());
    // // startButton.addEventListener('click', function(startGame))
    // tealDiv.append(startButton);

    let playAgain = document.createElement("button");
    playAgain.style.backgroundColor = "aquamarine";
    playAgain.style.display = "none";
    playAgain.style.height = "150px";
    playAgain.style.width = "300px";
    playAgain.style.position = "absolute";
    playAgain.style.fontSize = "24px";
    playAgain.style.borderRadius = "5px";
    playAgain.style.top = "300px";
    playAgain.style.left = "120px";
    playAgain.style.zIndex = "150";
    playAgain.innerText = "The cats got you! Click to play again."
    // playAgain.addEventListener(click, function(startGame));
    theRoot.appendChild(playAgain);

  }

  


  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
 

  gameLoop = () => {

    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    this.shots.forEach((shot) => {
      shot.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    let gameOverFX = document.getElementById("gameOver");

    function gameOverSound() {
      gameOverFX.loop = false;
      gameOverFX.play();
    }

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      gameOverSound();
      window.alert('Game over');
      // playAgain.style.display = "block";

      return;
    }
    

    this.shots = this.shots.filter((shot) => {
      return !shot.destroyed;
    });

    let explosionSoundEffect = document.getElementById("explosionSound");

    function explodeSound() {
      explosionSoundEffect.loop = false;
      explosionSoundEffect.play();
    }

    let introText = document.querySelector("h3");

    let scoreText = document.querySelector("h4");

    if (this.isEnemyDead()) {
      explodeSound();
      this.score.push(1);
      scoreText.innerText = `Score: ${this.score.length}`;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

        // This method will be called when the user presses the up arrow key. See in Engine.js
  // how we relate the key presses to this method
  shoot() {
    let shootSoundEffect = document.getElementById("shootSound");
    function shootingSound() {
      shootSoundEffect.loop = false;
      shootSoundEffect.play();
    }
    shootingSound();
    this.shots.push(new Shot(this.root, this.player));
  }

  isEnemyDead = () => {
    let enemyDead = false;
    this.enemies.forEach((enemy) => {
      this.shots.forEach((shot) => {
        
        let dist = Math.sqrt( Math.pow((enemy.x - shot.x), 2) + Math.pow((enemy.y - shot.y), 2) );
        if (dist < 40) {
          enemyDead = true;
          enemy.destroy();
          shot.destroy();
         }
      });
    });
    return enemyDead;
  }

  isPlayerDead = () => {
    let isDead = false;
    this.enemies.forEach((enemy) => {
      if (enemy.x === this.player.x && enemy.y > (this.player.y - 75)) {
        isDead = true;
      }
    });
    return isDead;
  };

}
