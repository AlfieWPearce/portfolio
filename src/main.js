let scrollTimer;
let scrollFactor = 0;
window.addEventListener('scroll', () => {
	document.body.classList.add('scrolling');
	clearTimeout(scrollTimer);
	scrollTimer = setTimeout(() => {
		document.body.classList.remove('scrolling');
	}, 200);

	const maxScroll = document.body.scrollHeight - window.innerHeight;
	scrollFactor = window.scrollY / maxScroll;
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
