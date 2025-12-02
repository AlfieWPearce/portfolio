let stars = [];
let clouds = [];
let showBackground = true;

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', '-10');
	canvas.style('position', 'fixed');

	noStroke();

	// Toggle button if present
	// const toggleBtn = document.getElementById('toggleBackground');
	// if (toggleBtn) {
	// 	toggleBtn.addEventListener('click', () => {
	// 		showBackground = !showBackground;
	// 	});
	// }

	// Stars
	for (let i = 0; i < 300; i++) {
		stars.push({
			x: random(width),
			y: random(height),
			r: random(0.5, 2),
			alpha: random(150, 255),
			delta: random(0.05, 0.2),
			increasing: random() > 0.5,
		});
	}

	// Nebula clouds
	for (let i = 0; i < 5; i++) {
		const col = color(random(150, 255), random(50, 150), random(150, 255), 50);
		createCloud(random(width), random(height), random(100, 300), col);
	}
}

function createCloud(x, y, size, col) {
	for (let i = 0; i < 100; i++) {
		const ox = random(-size, size);
		const oy = random(-size, size);
		const d = dist(0, 0, ox, oy);
		if (d < size) {
			clouds.push(new CloudParticle(x + ox, y + oy, random(5, 20), col));
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(10, 10, 20, 150); // gentle trails

	if (!showBackground) return;

	// Stars
	for (let s of stars) {
		s.alpha += s.delta;
		if (s.alpha >= 255 || s.alpha <= 50) s.delta *= -1;

		fill(255, 255, 255, s.alpha);
		ellipse(s.x, s.y, s.r);
	}

	// Nebula
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
