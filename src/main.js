let scrollTimer;
window.addEventListener('scroll', () => {
	document.body.classList.add('scrolling');
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(() => {
		document.body.classList.remove('scrolling');
	}, 200);
});

// Quote reveal animation
const quotes = document.querySelectorAll('.quote');

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	},
	{
		threshold: 0.4, // triggers when 40% in view
	}
);

quotes.forEach((q) => observer.observe(q));
