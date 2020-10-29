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

    // Add empty array to keep track of score
    this.score = [];

   // We add the background image to the game
    addBackground(this.root);

    // Add top bar with instructions
    let instructions = document.createElement("div");
    instructions.style.backgroundColor = "black";
    instructions.style.color = "white";
    instructions.style.display = "flex";
    instructions.style.alignItems = "center";
    instructions.style.justifyContent = "center";
    instructions.style.textAlign = "center";
    instructions.style.height = "75px";
    instructions.style.width = "525px";
    instructions.style.top = "50px";
    instructions.style.position = "absolute";
    instructions.style.fontSize = "18px";
    instructions.style.lineHeight = "25px";
    instructions.style.zIndex = "150";
    instructions.innerText = "Dodge the Nyancats by pressing the left and right arrow keys. Shoot by pressing the up arrow. Get one point for every Nyancat you hit!"
    theRoot.appendChild(instructions);
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

    // Update shots each time enemy positions are updated.
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

    // Add sound effect when game ends
    let gameOverFX = document.getElementById("gameOver");

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead()) {
      gameOverFX.loop = false;
      gameOverFX.play();
      window.alert('Game over');
      return;
    }

    // Add sound effect for when you hit a nyancat
    let explosionSoundEffect = document.getElementById("explosionSound");

    function explodeSound() {
      explosionSoundEffect.loop = false;
      explosionSoundEffect.play();
    }
    
    // Remove any shots that have been destroyed
    this.shots = this.shots.filter((shot) => {
      return !shot.destroyed;
    });

    // Display the score at the top of the screen
    let scoreText = document.querySelector("h2");

    // Increase the score by adding one to the score array each time an enemy is hit
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

  // Determine whether your shot has hit an enemy by measuring the distance between the two. 
  // By looping through both arrays, you compare the distance between all instances of enemy and shot.
  // If you hit a target, both the enemy and shot are destroyed so they disappear from the playing field.
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

  // If the distance between player and an enemy is less than 75px (the width of the player), then you have been struck!
  // If the player isDead then the game ends.
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
