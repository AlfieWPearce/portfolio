'use strict';

const data = {
	'bird-count': null, // Number of birds in the flock
	'bird-density': 0.00022, // Density of birds per pixel
	debug: false, //Show debug info
	bird: {
		// Visual & Movement Parameters
		size1: 22, // Length of 'nose' of bird
		size2: 10, // Width of 'tail' of bird
		moveSpeed: 0.1, // Base forward speed
		moveSpeedVariety: 0.03, // Variation in forward speed
		rotationSpeed: 0.0012, // How quickly a bird can turn
		viewDist: 140, // Detection radius for neighbours
		FoV: Math.PI * 1.1, //198* field of view
	},
	rules: {
		'sep-weight': 1.2, // Power of seperation in steering birds
		'align-weight': 0.7, // Power of alignment in steering birds
		'cohesion-weight': 1.15, // Power of cohesion in steering birds
	},
	visual: {
		trail: 12, //Distance of trails (1..255) - lower is longer trails
		colourScheme: 'aurora', //Colouring style direction (hue shift on direction) | distance (brightness shift on distance to centre) | time (hue shift with time) | other (a solid colour) | aurora (height based)
		// bgStyle: 'none', //Background colouring style
		// nightMode: false, //Night mode
	},
	mouse: {
		mode: 'pred', //Mouse mode pred (predator, fear factor) | prey (food, goal) | 'off' (no interaction)
		'influence-radius': 200, //Radius of influence of mouse
		strength: 20, //Strength of mouse' influence
	},
	// wind: {
	// 	mode: 'off', //Wind mode
	// 	strength: 0.3, //Strength of wind
	// 	speed: 0.0003,
	// 	xOff: 0,
	// 	yOff: 1000,
	// },
};
