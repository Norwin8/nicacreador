;(function() {
	function BXSimpleHeaderMenuSlider()
	{
		this.isInited = false;
		this.timeoutId = null;

		this.nodes = {
			section: null,
			list: null,
		};

		this.attributes = {
			section: 'bx-data-stick-outer',
			list: 'data-bx-slide-menu-section-list',
			item: 'data-bx-slide-menu-section-list-item',
			active: 'data-bx-slide-menu-section-list-item-active',
		};

		this.slider = {
			object: null // jquery object
		};

		this.init();
	}

	BXSimpleHeaderMenuSlider.prototype.getActiveItemNumber = function() {
		let number = 0;
		let items = this.getListItems();

		for (let i = 0; i < items.length; i++)
		{
			if (items[i].hasAttribute(this.attributes.active))
			{
				number = i;
			}
		}

		return number;
	};

	BXSimpleHeaderMenuSlider.prototype.getListItems = function() {
		return this.nodes.list.querySelectorAll('[' + this.attributes.item + ']');
	};

	BXSimpleHeaderMenuSlider.prototype.checkMenuSize = function() {
		let item = this.nodes.list.querySelectorAll('[' + this.attributes.item + ']');
		let width = 0;

		for (let i = 0; i < item.length; i++)
		{
			width = width + item[i].offsetWidth;
		}

		return this.nodes.list.offsetWidth < width && window.outerWidth >= 992;
	};

	BXSimpleHeaderMenuSlider.prototype.makeSlider = function() {
		let items = this.getListItems();
		let length = items.length;
		let params = {
			loop: false,
			nav: true,
			dots: false,
			items: length <= 6 ? length : 6,
		};

		this.slider.object = $(this.nodes.list);

		if (this.slider.object instanceof jQuery)
		{
			this.slider.object.addClass('owl-carousel').owlCarousel(params);
			this.slider.object.trigger('to.owl.carousel', this.getActiveItemNumber());
		}
	};

	BXSimpleHeaderMenuSlider.prototype.destroySlider = function() {
		if (this.slider.object instanceof jQuery)
		{
			this.slider.object.removeClass('owl-carousel').trigger('destroy.owl.carousel');
			this.slider.object = null;
		}
	};

	BXSimpleHeaderMenuSlider.prototype.sliderHandler = function() {
		let _this = this;

		clearTimeout(_this.timeoutId);
		_this.timeoutId = setTimeout(function() {
			if (_this.checkMenuSize())
			{
				_this.makeSlider();
			}
			else
			{
				_this.destroySlider();
			}
		}, 400);
	};

	BXSimpleHeaderMenuSlider.prototype.init = function() {
		if (this.isInited)
		{
			return false;
		}

		this.nodes.section = document.querySelector('.js-header-menu-section');

		if (BX.type.isElementNode(this.nodes.section))
		{
			this.nodes.list = this.nodes.section.querySelector('[' + this.attributes.list + ']');

			if (BX.type.isElementNode(this.nodes.list))
			{
				this.isInited = true;

				BX.bind(window, 'resize', BX.proxy(this.sliderHandler, this));

				this.sliderHandler();
			}
		}
	};

	BX.ready(function() {
		(new BXSimpleHeaderMenuSlider());
	});
})();