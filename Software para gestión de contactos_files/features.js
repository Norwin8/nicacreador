function OwlFeaturesSlider(params)
{
	_params = {
		autoplayScroll: params.autoplayScroll === true,
		autoplayStopByDots: params.autoplayStopByDots === true,
		currentSlideIndex: 0,
		dotsArrowAnimationTime: 500
	};

	this.params = BX.mergeEx({}, params, _params);
	this.params.previousSlideIndex = this.params.currentSlideIndex;
	this.params.sliderParams.autoplaySpeed = this.params.sliderParams.autoplayTimeout = parseInt(this.params.sliderParams.autoplayTimeout) - this.params.dotsArrowAnimationTime;

	this.init();
}

OwlFeaturesSlider.prototype = {
	onViewArea: function() {
		if (this.params.autoplayScroll === true)
		{
			let el = $(this.params.slider),
				pos = el.position();

			if (
				(pos.top - (window.innerHeight || document.documentElement.clientHeight)) <= (window.pageYOffset || document.documentElement.scrollTop) &&
				(pos.top + el.outerHeight()) >= (window.pageYOffset || document.documentElement.scrollTop)
			)
			{
				$(this.params.sliderParams.dotsContainer).removeClass('on-scroll-pause');
				BX.onCustomEvent(this.params.slider, 'OwlFeaturesSliderPlay');
			}
			else
			{
				BX.onCustomEvent(this.params.slider, 'OwlFeaturesSliderPause');
				$(this.params.sliderParams.dotsContainer).addClass('on-scroll-pause');
			}
		}
	},
	onMouseEnter: function() {
		let _this = this;
		_this.params.slider.on('mouseenter', function() {
			$(this).addClass('on-hover-pause');
			$(_this.params.sliderParams.dotsContainer).addClass('on-hover-pause');
		});
	},
	onMouseLeave: function() {
		let _this = this;
		_this.params.slider.on('mouseleave', function() {
			$(this).removeClass('on-hover-pause');
			$(_this.params.sliderParams.dotsContainer).removeClass('on-hover-pause');
		});
	},
	onMoveNext: function() {

	},
	onMovePrevious: function() {

	},
	onChangeInit: function() {
		let _this = this;
		_this.params.slider.on('change.owl.carousel', function(event) {
			/*let index = event.page.index;

			*/
		});
	},
	onChangedInit: function() {
		let _this = this;
		_this.params.slider.on('changed.owl.carousel', function(event) {
			let index = event.page.index,
					children = $(_this.params.sliderParams.dotsContainer).children(),
					animationClass = '',
					animationIndex = index;

			if (Math.abs(_this.params.currentSlideIndex - index) <= 1)
			{
				if (_this.params.currentSlideIndex <= index)
				{
					animationClass = 'on-animation-next';
					animationIndex = index - 1;
				}
				else if (_this.params.currentSlideIndex > index)
				{
					animationClass = 'on-animation-prev';
				}

				if (animationClass.length > 0)
				{
					$(children[animationIndex]).addClass(animationClass);

					setTimeout(function() {
						$(children[animationIndex]).removeClass(animationClass);
					}, 500);
				}
			}

			_this.params.currentSlideIndex = index;
		});
	},
	onInitialized: function() {
		let _this = this,
				children = _this.getDotsList();

		children.each(function() {
			let animationDuration = _this.params.sliderParams.autoplayTimeout / 1000,
					animationDelay = _this.params.dotsArrowAnimationTime / 1000;

			$(this).css({'animation-duration': animationDuration + 's', 'animation-delay': animationDelay + 's'});
			$(this).children(_this.params.dotsArrowAnimatorContainer).css({'animation-duration': animationDelay + 's'});
		});

		BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderChangeInit');
		BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderChangedInit');
		BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderMouseEnter');
		BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderMouseLeave');

		if (_this.params.sliderParams.autoplay === true || _this.params.autoplayScroll === true)
			$(_this.params.sliderParams.dotsContainer).addClass('autoplay');

		BX.bind(window, 'scroll', BX.delegate(_this.scrollTimeout, this));
		BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderViewArea');

		if (_this.params.autoplayStopByDots === true)
			_this.autoplayStopByDotsHandler();

		_this.params.slider.removeClass('bxst-features-slider-not-loaded');
	},
	refreshAnimation: function() {

	},
	play: function() {
		this.params.slider.trigger('play.owl.autoplay', [this.params.sliderParams.autoplayTimeout]);
	},
	pause: function() {
		this.params.slider.trigger('pause.owl.autoplay');
	},
	getDotsList: function() {
		return $(this.params.sliderParams.dotsContainer).children();
	},
	scrollTimeout: function() {
		let _this = this;
		if (_this.params.autoplayScroll === true)
		{
			if (_this.scrollTimeoutId)
				clearTimeout(_this.scrollTimeoutId);

			_this.scrollTimeoutId = setTimeout(function() {
				BX.onCustomEvent(_this.params.slider, 'onOwlFeaturesSliderViewArea');
			}, 500);
		}
	},
	autoplayStopByDotsHandler: function() {
		let _this = this,
				children = $(_this.params.sliderParams.dotsContainer).children();

		children.each(function() {
			BX.bind(this, 'click', BX.delegate(_this.deactivateAutoplay, _this));
		});
	},
	deactivateAutoplay: function() {
		if (this.params.sliderParams.autoplay === true || this.params.autoplayScroll === true)
		{
			this.params.autoplayScroll = false;
			this.params.slider.trigger('stop.owl.autoplay');
			BX.removeCustomEvent(this.params.slider, 'onOwlFeaturesSliderViewArea', BX.delegate(this.onViewArea, this));
			$(this.params.sliderParams.dotsContainer).removeClass('autoplay');
		}
	},
	initRedirectEvents: function() {
		let _this = this,
			children = $(_this.params.sliderParams.dotsContainer).children();

		children.each(function() {
			BX.bind(this, 'click', function() {
				let url = this.getAttribute('data-bx-redirect-link');

				if (BX.type.isNotEmptyString(url.replace('#', '')))
				{
					window.location = url;
				}
			});
		});
	},
	init: function() {
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderInitialized', BX.delegate(this.onInitialized, this));
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderChangeInit', BX.delegate(this.onChangeInit, this));
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderChangedInit', BX.delegate(this.onChangedInit, this));
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderMouseEnter', BX.delegate(this.onMouseEnter, this));
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderMouseLeave', BX.delegate(this.onMouseLeave, this));
		BX.addCustomEvent(this.params.slider, 'onOwlFeaturesSliderViewArea', BX.delegate(this.onViewArea, this));
		BX.addCustomEvent(this.params.slider, 'OwlFeaturesSliderPlay', BX.delegate(this.play, this));
		BX.addCustomEvent(this.params.slider, 'OwlFeaturesSliderPause', BX.delegate(this.pause, this));

		this.initRedirectEvents();

		this.params.slider.owlCarousel(this.params.sliderParams);
	}
};

BX.ready(function () {
	let slider = $('.js-slider-wrapp');

	if (slider.length)
	{
		(new OwlFeaturesSlider({
			slider: slider,
			autoplayScroll: true,
			autoplayStopByDots: true,
			dotsArrowAnimatorContainer: '.js-dots-arrow-animator',
			sliderParams: {
				animateIn: 'fadeInFeaturesSlide',
				animateOut: 'fadeOutFeaturesSlide',
				autoplay: false,
				// autoplay: true,
				autoplayTimeout: 10000,
				autoplayHoverPause: true,
				dotsContainer: '.js-slider-wrapp-dots',
				items: 1,
				loop: true,
				lazyLoad: true,
				mouseDrag: false,
				touchDrag: false,
				onInitialized: function(event) {
					BX.onCustomEvent(slider, 'onOwlFeaturesSliderInitialized');
				}
			},
		}));
	}
});