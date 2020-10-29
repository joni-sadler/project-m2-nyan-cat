class Shot {

    constructor(burgerRoot, player) {
        // The x position starts off in the middle of the screen. Since this data is needed every time we move the player, we
        // store the data in a property of the instance. It represents the distance from the left margin of the browsing area to
        // the leftmost x position of the image.
        
        this.x = player.x;
        this.y = player.y;

        this.player = player;

        this.root = burgerRoot;

        this.shots = [];

        this.fired = false;

        this.speed = 1;    
    
        // We create a DOM node. 
        this.domElement = document.createElement('img');
        this.domElement.src = 'images/cheezburger.png';
        this.domElement.style.position = 'absolute';
        this.domElement.style.left = `${this.x}px`;
        this.domElement.style.top = `${this.y}px`;
        this.domElement.style.zIndex = '9';
        this.domElement.style.height = "18px";
        this.domElement.style.width = "25px"
        burgerRoot.appendChild(this.domElement);
      }

      // Reuse code that makes the nyancats fall down, but reverse it so the cheezburger moves up from
      // bottom of the page
      update(timeDiff) {
        this.y = this.y - timeDiff * this.speed;
        this.domElement.style.top = `${this.y}px`;    
      }

      // If the shot hits an enemy, remove the shot from the playing field
      destroy() {
        this.destroyed = true;
        this.root.removeChild(this.domElement);
      }

}

