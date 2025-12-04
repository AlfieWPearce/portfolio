'use strict';

let birds = [];
let selectedBird = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	if (data['bird-density'] != null)
		data['bird-count'] = floor(data['bird-density'] * width * height);
	createBirds(data['bird-count']);
	ellipseMode(CENTER);
}

const createBirds = (n) => {
	for (let i = 0; i < n; i++) birds.push(new Bird());
};
const updateBirds = (birds, dt) => birds.forEach((b) => b.update(dt));
const drawBirds = (birds) => birds.forEach((b, idx) => drawBird(b, idx));

function draw() {
	updateBirds(birds, deltaTime);

	// clear();
	//Trails
	background(0, data.debug ? 255 : data.visual.trail);
	drawBirds(birds);
}
function drawBird(bird, idx) {
	const [x, y] = [...bird.pos];
	const rot = isNaN(bird.rot) ? 0 : bird.rot;
	const siz1 = data.bird.size1;
	const siz2 = data.bird.size2;

	//Draw debug info around one bird
	if (idx == selectedBird) drawSelectedBird(bird);

	//Bird body - simple triangle

	let hue = 0;
	//Change colour
	switch (data.visual.colourScheme) {
		case 'time':
			const t = (sin(frameCount * 0.02) + 1) * 0.5;
			fill(lerpColor(color('#ffcc33'), color('#ff3366'), t));
			break;
		case 'direction':
			hue = (rot * 50 + frameCount) % 360;
			fill(color(`hsl(${hue}, 80%, 80%)`));
			break;
		case 'distance':
			const d = dist(bird.pos[0], bird.pos[1], width / 2, height / 2);
			const fade = map(d, 0, max(width / 2, height / 2), 255, 80);
			fill(200, 200, 255, fade);
			break;
		case 'aurora':
			//Map y position to hue (green - teal - violet)
			const y = bird.pos[1] / height; // 0..1
			hue = lerp(120, 270, y);
			const speed = isNaN(bird.speed) ? 0.1 : bird.speed;
			const bright = floor(map(speed, 0, 0.5, 65, 85, true));
			fill(color(`hsl(${hue}, 70%, ${bright}%)`));
			break;
		default:
			fill(200, 0, 0);
	}

	noStroke();
	//Fuzzy edges
	// stroke(200, 120);
	// strokeWeight(2);
	//Draw triangle birds
	const tip = [x + siz1 * cos(rot), y + siz1 * sin(rot)];
	const left = [x - siz2 * cos(rot + PI / 3), y - siz2 * sin(rot + PI / 3)];
	const right = [x - siz2 * cos(rot - PI / 3), y - siz2 * sin(rot - PI / 3)];
	// triangle(tip[0], tip[1], left[0], left[1], right[0], right[1]);
	//Traingle using vertices
	beginShape();
	vertex(tip[0], tip[1]);
	vertex(left[0], left[1]);
	vertex(right[0], right[1]);
	endShape(CLOSE);
	//Draw vertex groups
	// push();
	// translate(x, y);
	// rotate(rot);
	// beginShape();
	// vertex(siz1, 0);
	// vertex(-siz2, siz2 / 2);
	// vertex(-siz2, -siz2 / 2);
	// endShape(CLOSE);
	// pop();
}
function drawSelectedBird(bird) {
	if (!data.debug) return;
	const [x, y] = [...bird.pos];
	const view = data.bird.viewDist;

	//Draw view radius
	push();

	stroke(255, 50);
	noFill();

	translate(bird.pos[0], bird.pos[1]);
	rotate(bird.rot);

	const half = data.bird.FoV / 2;
	const d = view;

	// Cone edges
	line(0, 0, d * Math.cos(half), d * Math.sin(half));
	line(0, 0, d * Math.cos(-half), d * Math.sin(-half));

	// Arc
	beginShape();
	for (let a = -half; a <= half; a += 0.05) {
		vertex(d * Math.cos(a), d * Math.sin(a));
	}
	endShape();

	pop();

	//Get nearby birds
	const nearby = getNearbyBirds(bird);

	if (nearby.length === 0) return;

	strokeWeight(1);
	//GREEN LINE: all neighbours
	stroke(0, 200, 0);
	for (let other of nearby) line(x, y, other.pos[0], other.pos[1]);

	//YELLOW LINE: seperation target
	stroke(200, 200, 0);
	let dir = bird.seperationTarget;
	let dist = view / 2;
	line(x, y, x + dist * cos(dir), y + dist * sin(dir));

	//BLUE LINE: target direction
	stroke(0, 0, 220);
	dir = bird.targetAngle;
	line(x, y, x + dist * cos(dir), y + dist * sin(dir));
}
