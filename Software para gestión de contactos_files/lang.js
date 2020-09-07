;(function() {
	'use strict'

	function LangSelectorGlobeWindowInit()
	{
		this.params = {
			parent: null,
			content: null,
			classPrefix: '',
			disableDefaultTemplate: true,
			disableOverlay: false,
			showPreloader: false,
			fixedContentPos: false,
			fixedBgPos: false,
			classes: {
				ready: '',
				active: '',
				section: 'round-popup-window lang-selector-globe-window',
				popup: 'round-popup-window__popup lang-selector-globe-window__popup',
				inner: 'round-popup-window__inner lang-selector-globe-window__inner',
				overlay: 'round-popup-window__overlay lang-selector-globe-window__overlay',
				close: 'round-popup-window__close',
			},
		};

		this.attributes = {
			initialized: 'data-lang-selector-globe-window-initialized',
			section: 'data-lang-selector-globe-window-section',
			button: 'data-lang-selector-globe-window-button',
			content: 'data-lang-selector-globe-window-content',
			popup: 'data-lang-selector-globe-window-popup',
		};

		this.init();
	}

	LangSelectorGlobeWindowInit.prototype = {
		init: function() {
			let section = document.querySelector('[' + this.attributes.section + ']');

			if (
				BX.type.isElementNode(section) &&
				!section.hasAttribute(this.attributes.button)
			)
			{
				let button = section.querySelector('[' + this.attributes.button + ']');
				let parent = section.querySelector('[' + this.attributes.content + ']');
				let content = section.querySelector('[' + this.attributes.popup + ']');

				this.params.parent = parent;
				this.params.content = content;

				let popup = new BX.SB.Popup.Window(this.params);

				if (BX.type.isNotEmptyObject(popup))
				{
					BX.bind(button, 'click', function() {
						popup.setInitialClickEvent();
						popup.open();
					});
					section.setAttribute(this.attributes.initialized, '');
				}
			}
		}
	};

	if (window.frameCacheVars !== undefined)
	{
		BX.addCustomEvent('onFrameDataReceived', function() {
			(new LangSelectorGlobeWindowInit());
		});
	}
	else
	{
		BX.ready(function() {
			(new LangSelectorGlobeWindowInit());
		});
	}
})();