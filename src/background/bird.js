'use strict';

class Bird {
	constructor() {
		this.pos = [random(width), random(height)];
		this.rot = random(2 * PI);
		this.speed = data.bird.moveSpeed + Math.random() * data.bird.moveSpeedVariety;
		//Debug info
		this.seperationTarget = null;
		this.targetAngle = null;
	}
	update(dt) {
		rotateBird(this, data.bird.rotationSpeed * 30 /* * dt*/);
		moveBird(this, this.speed * 30 /** dt*/);
	}
}

function rotateBird(bird, rotateAmount) {
	const nearby = getNearbyBirds(bird);

	//No neighbours? Don't steer
	if (nearby.length == 0) {
		bird.seperationTarget = null;
		bird.targetAngle = null;
		return;
	}

	// const directions = nearby.map((b) => atan2(b.pos[1] - bird.pos[1], b.pos[0] - bird.pos[0]));
	// bird.average.dir = directions.reduce((partial, acc) => partial + acc, 0) / nearby.length;
	// Originally computed directions via average angle then invers by adding pi
	// Instead now moves towards vector sum

	//Compute seperation, alignment and cohesion vectors
	const s = seperation(bird, nearby);
	const a = alignment(nearby);
	const c = cohesion(bird, nearby);
	const m = mouseTurn(bird);
	// const w = windVec();

	if (data.debug) bird.seperationTarget = atan2(s.y, s.x); //Debug direction

	const steerX =
		s.x * data.rules['sep-weight'] +
		a.x * data.rules['align-weight'] +
		c.x * data.rules['cohesion-weight'] +
		m.x * data.mouse.strength; // +
	// w.x;
	const steerY =
		s.y * data.rules['sep-weight'] +
		a.y * data.rules['align-weight'] +
		c.y * data.rules['cohesion-weight'] +
		m.y * data.mouse.strength; // +
	// w.y;
	bird.targetAngle = atan2(steerY, steerX);

	// bird.seperationTarget = bird.average.dir + PI;

	//Turn toward the seperation direciton
	let angleDiff = bird.targetAngle - bird.rot;

	//Wrap agle to [-Pi..Pi] for smoother turning
	if (angleDiff > PI) angleDiff -= TWO_PI;
	if (angleDiff < -PI) angleDiff += TWO_PI;

	const turn = min(abs(angleDiff), rotateAmount);
	bird.rot += turn * Math.sign(angleDiff);
}
function seperation(bird, nearby) {
	let x = 0;
	let y = 0;
	for (let other of nearby) {
		const dx = bird.pos[0] - other.pos[0];
		const dy = bird.pos[1] - other.pos[1];
		const d = sqrt(dx ** 2 + dy ** 2);

		//Stronger push when very close
		let w = 1 / (d + 0.001);

		x += dx * w;
		y += dy * w;
	}
	return { x, y };
}
function alignment(nearby) {
	let x = 0;
	let y = 0;
	for (let other of nearby) {
		//Use their heading as a unit vector
		x += cos(other.rot);
		y += sin(other.rot);
	}
	//Normalise
	const mag = Math.hypot(x, y);
	if (mag != 0) {
		x /= mag;
		y /= mag;
	}
	return { x, y };
}
function cohesion(bird, nearby) {
	let centroidX = 0;
	let centroidY = 0;
	for (let other of nearby) {
		//Sum positions
		centroidX += other.pos[0];
		centroidY += other.pos[1];
	}
	//Averages - to find centroid location
	centroidX /= nearby.length;
	centroidY /= nearby.length;

	//Normalises difference in positions
	let x = centroidX - bird.pos[0];
	let y = centroidY - bird.pos[1];

	const mag = Math.hypot(x, y);
	if (mag != 0) {
		x /= mag;
		y /= mag;
	}
	return { x, y };
}
function mouseTurn(bird) {
	if (data.mouse.mode == 'ignore') return { x: 0, y: 0 };
	let x = 0;
	let y = 0;
	const dx = mouseX - bird.pos[0];
	const dy = mouseY - bird.pos[1];
	const dsq = dx ** 2 + dy ** 2;
	if (dsq < data.mouse['influence-radius'] ** 2) {
		const d = sqrt(dsq);
		x = dx / d;
		y = dy / d;

		if (data.mouse.mode == 'pred') {
			//Flett - invert vector
			x *= -1;
			y *= -1;
		}
	}
	return { x, y };
}
// function windVec() {
// 	if (data.wind.mode == 'off') return { x: 0, y: 0 };

// 	const x = noise(data.wind.xoff) - 0.5;
// 	const y = noise(data.wind.yoff) - 0.5;

// 	data.wind.xoff += data.wind.speed;
// 	data.wind.yoff += data.wind.speed;

// 	// Normalize
// 	let mag = Math.hypot(x, y);
// 	return {
// 		x: (x / mag) * data.wind.strength,
// 		y: (y / mag) * data.wind.strength,
// 	};
// }
function moveBird(bird, moveAmount) {
	const dx = moveAmount * cos(bird.rot);
	const dy = moveAmount * sin(bird.rot);

	bird.pos[0] += dx;
	bird.pos[1] += dy;

	//Wrap around edges
	if (bird.pos[0] < 0) bird.pos[0] = width;
	if (bird.pos[0] > width) bird.pos[0] = 0;
	if (bird.pos[1] < 0) bird.pos[1] = height;
	if (bird.pos[1] > height) bird.pos[1] = 0;
}

const getNearbyBirds = (bird) => {
	const nearby = [];
	for (let other of birds) {
		if (other == bird) continue;
		let dx = bird.pos[0] - other.pos[0];
		let dy = bird.pos[1] - other.pos[1];

		//Wrap
		// if (dx > width / 2) dx -= width;
		// if (dx < -width / 2) dx += width;
		// if (dx > height / 2) dy -= height;
		// if (dx < -height / 2) dy += height;

		const distsq = dx ** 2 + dy ** 2;
		if (distsq <= data.bird.viewDist ** 2) {
			const angleToOther = atan2(dy, dx) + PI;
			let angleDiff = angleToOther - bird.rot;

			// wrap to [-pi..pi]
			if (angleDiff > PI) angleDiff -= TWO_PI;
			if (angleDiff < -PI) angleDiff += TWO_PI;

			// only include if in front arc
			if (Math.abs(angleDiff) < data.bird.FoV * 0.5) {
				nearby.push(other);
			}
		}
	}
	return nearby;
};
