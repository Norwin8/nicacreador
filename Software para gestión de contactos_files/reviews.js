BX.ready(function() {
	$('.js-reviews-gallery-slider-wrapp').owlCarousel({
		autoplay: true,
		items: 1,
		loop: true,
		lazyLoad: true,
		mouseDrag: false,
		touchDrag: true,
		navText: [],
		navElement: 'a',
		dots: false,
		responsive: {
			0: {
				touchDrag: true,
				nav: false,
				autoplay: true,
				autoplayTimeout: 3000
			},
			768: {
				nav: true,
				autoplay: false
			}
		},
	});
});