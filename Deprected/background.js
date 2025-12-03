let stars = [];
let clouds = [];
let showBackground = true;

function setup() {
  //Startup P5
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-10');
  canvas.style('position', 'fixed');
  noStroke();

  //Button
  const toggleBtn = document.getElementById('toggleBackground');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showBackground = !showBackground;
    });
  }

  //Generate stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      r: random(0.5, 2),
      alpha: random(150, 255),
      delta: random(0.05, 0.2),
      increasing: random() > 0.5
    });
  }

  //Generate Nebula
  for (let i = 0; i < 5; i++) {
    const col = color(random(150, 255), random(50, 150), random(150, 255), 50);
    createCloud(random(width), random(height), random(100, 300), col);
  }
}
function createCloud(x, y, size, col) {
  //Create animateable particles for the cloud
  for (let i = 0; i < 100; i++) {
    let offsetX = random(-size, size);
    let offsetY = random(-size, size);
    let d = dist(0, 0, offsetX, offsetY);
    if (d < size) {
      clouds.push(new CloudParticle(x + offsetX, y + offsetY, random(5, 20), col));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10, 10, 20, 150); //slight alpha for motion trails

    if (!showBackground) return; //after background too fade it out

  // Twinkling stars
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha >= 255 || star.alpha <= 50) {
      star.delta *= -1;
    }
  
    fill(255, 255, 255, star.alpha);
    ellipse(star.x, star.y, star.r);
  }

  // Moving nebula clouds
  for (let cloud of clouds) {
    cloud.update();
    cloud.display();
  }
}

class CloudParticle {
  constructor(x, y, size, col) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
    this.xSpeed = random(-0.2, 0.2);
    this.ySpeed = random(-0.2, 0.2);
  }
  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  display() {
    fill(this.col);
    ellipse(this.x, this.y, this.size);
  }
}
