;(function() {
	'use strict'

	function PortalAuthWindowInit()
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
				section: 'round-popup-window portal-auth-bitrix24-window',
				popup: 'round-popup-window__popup portal-auth-bitrix24-window__popup',
				inner: 'round-popup-window__inner portal-auth-bitrix24-window__inner',
				overlay: 'round-popup-window__overlay portal-auth-bitrix24-window__overlay',
				close: 'round-popup-window__close',
			},
		};

		this.classes = {
			button: 'js-bitrix24-auth-popup',
			authorization: 'js-bitrix24-net-auth',
		};

		this.attributes = {
			initialized: 'data-portal-auth-bitrix24-window-initialized',
			section: 'data-portal-auth-bitrix24-window-section',
			button: 'data-portal-auth-bitrix24-window-button',
			content: 'data-portal-auth-bitrix24-window-content',
			popup: 'data-portal-auth-bitrix24-window-popup',
			authorization: 'data-portal-auth-bitrix24-authorization',
		};

		this.init();
	}

	PortalAuthWindowInit.prototype = {
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

					let extended = document.querySelectorAll('.' + this.classes.button);
					for (let i = 0; i < extended.length; i++)
					{
						BX.bind(extended[i], 'click', function() {
							popup.setInitialClickEvent();
							popup.open();
						});
					}

					if (typeof BX.SB.Portal.Authorization !== 'undefined')
					{
						let authorization = this.params.content.querySelectorAll('[' + this.attributes.authorization + ']');
						for (let i = 0; i < authorization.length; i++)
						{
							BX.bind(authorization[i], 'click', function() {
								BX.SB.Portal.Authorization.authorize({});
							});
						}
					}

					section.setAttribute(this.attributes.initialized, '');
				}
			}
		}
	};

	if (window.frameCacheVars !== undefined)
	{
		BX.addCustomEvent('onFrameDataReceived', function() {
			(new PortalAuthWindowInit());
		});
	}
	else
	{
		BX.ready(function() {
			(new PortalAuthWindowInit());
		});
	}
})();