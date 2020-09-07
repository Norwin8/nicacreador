function B24PortalBuyerRequestWindow(params)
{
	this.isInitialized = false;
	this.window = window;
	this.document = document;
	this.nodes = {
		button: null,
		popup: null,
		content: null,
		authWindow: null,
	};
	this.classes = {
		button: 'js-buy-bitrix',
		initialized: 'js-buy-bitrix-initialized',
		parentPosition: 'js-prices-table-item-pos',
		authWindow: 'js-authorization-user-popup-buy-page',
	};
	this.attributes = {
		windowParams: 'data-window-params',
		sectionHash: 'data-section-hash',
		sectionRequestParams: 'data-request-params',
		needUserAction: 'data-need-user-action',
	};
	this.currentParams = {};
	this.popup = {};
	this.content = {};

	this.windowParams = {
		messages: {},
		serverHost: this.window.location.hostname.replace('www', ''),
		type: '',
		isAuthorized: false,
	};

	// this.windowParams.messages = params.messages || {};
	// this.windowParams.serverHost = params.serverHost || this.window.location.hostname.replace('www', '');
	// this.windowParams.type = params.type || '';
	// this.windowParams.isAuthorized = params.isAuthorized === true;

	this.init();
}

B24PortalBuyerRequestWindow.prototype = {
	getMessage: function(code) {
		return this.windowParams.messages[code];
	},
	getUrlPatterns: function() {
		return {
			'app': '',
			'tariff': 'https://#portal_url#/settings/order/make.php?product=#entity_code#&limit=#entity_code_value#',
		};
	},
	preparePortalLink: function() {
		let url = this.content.inputSectionInput.value;

		url = url.replace('https://', '');
		url = url.replace('http://', '');
		url = url.replace('/', '');

		return url;
	},
	redirectToPortalPage: function() {
		let patterns = this.getUrlPatterns();
		let url = patterns[this.windowParams.type];
		let host = this.preparePortalLink();

		if (host !== this.windowParams.serverHost)
		{
			url = url.replace('#portal_url#', host);
			url = url.replace('#entity_code#', this.currentParams.code);
			url = url.replace('#entity_code_value#', this.currentParams.value);

			window.location = url;
		}
		else
		{
			this.content.inputSectionInput.focus();
		}
	},
	executeElement: function(element) {
		let _this = this;
		let parent = BX.findParent(element, { className: _this.classes.parentPosition });

		_this.currentParams.sectionHash = element.getAttribute('data-section-hash');
		_this.currentParams.code = element.getAttribute('data-code');
		_this.currentParams.value = element.getAttribute('data-code-value') || '';
		_this.currentParams.portals = JSON.parse(element.getAttribute('data-portals')) || {};

		if (BX.type.isElementNode(parent))
		{
			_this.popup.window.setBindElement(parent);
		}
		else
		{
			_this.popup.window.setBindElement(element);
		}

		_this.refreshWindowContent();
		_this.popup.window.show();

		if (!!_this.content.inputSectionInput)
		{
			_this.content.inputSectionInput.setSelectionRange(0, 0);
			_this.content.inputSectionInput.focus();
		}
	},
	initButton: function() {
		let button = this.document.querySelectorAll('.' + this.classes.button);
		if (button)
		{
			if (BX.type.isElementNode(button))
			{
				button = [button];
			}

			let _this = this;
			for (let i = 0; i < button.length; i++)
			{
				if (BX.hasClass(button[i], _this.classes.initialized))
				{
					continue;
				}

				let params = JSON.parse(button[i].getAttribute(_this.attributes.windowParams)) || {};
				if (!BX.type.isNotEmptyObject(params))
				{
					continue;
				}

				_this.windowParams = BX.mergeEx({}, _this.windowParams, params);

				BX.addClass(button[i], _this.classes.initialized);

				BX.bind(button[i], 'click', function() {
					_this.executeElement(this);
				});

				if (button[i].hasAttribute(_this.attributes.needUserAction))
				{
					_this.executeElement(button[i]);

					let position = BX.pos(button[i]);
					setTimeout(function() {
						window.scrollTo(0, position.top - ((window.innerHeight || document.documentElement.clientHeight) / 2));
					}, 100);
				}
			}
		}
	},
	refreshWindowContent: function() {
		if (!this.popup.window)
		{
			this.initWindow();
			return;
		}

		if (!this.windowParams.isAuthorized && !BX.type.isNotEmptyObject(this.nodes.authWindow))
		{
			this.nodes.authWindow = this.document.querySelector('.' + this.classes.authWindow);
		}

		let content = !this.windowParams.isAuthorized ? this.nodes.authWindow : null;

		if (!BX.type.isElementNode(content))
		{
			switch (true)
			{
				case BX.type.isNotEmptyObject(this.currentParams.portals):
					content = this.getTemplateType2();
					break;

				default:
					content = this.getTemplateType1();
					break;
			}
		}

		let findParams = { attrs: {} };
		findParams['attrs'][this.attributes.sectionRequestParams.toString()] = '';

		let requestNode = BX.findChildren(
			content,
			findParams,
			true,
			true
		) || [];

		for (let i = 0; i < requestNode.length; i++)
		{
			if (requestNode[i].hasAttribute(this.attributes.sectionRequestParams))
			{
				let jsonParams = {
					request: {
						'order_progress': 'Y',
						'order_product': this.currentParams.code,
						'order_section_hash': this.currentParams.sectionHash
					},
				};

				requestNode[i].setAttribute(this.attributes.sectionRequestParams, JSON.stringify(jsonParams));
			}
		}

		this.popup.window.setContent(content);
	},
	initWindow: function() {
		this.popup.window = new BX.PopupWindow('portal-buyer-request-window', null, {
			lightShadow: false,
			autoHide: true,
			closeByEsc: true,
			className: 'bx-sb-portal-buy-window-section',
			bindOptions: {
				forceTop: true,
				forceLeft: true,
				forceBindPosition: true,
			},
			angle: {
				offset: 60,
			},
			zIndexAbsolute: 2,
			events: {
				onAfterPopupShow: function() {
					if (BX.type.isNumber(this.bindElementPos.right) && BX.type.isElementNode(this.popupContainer))
					{
						this.popupContainer.style.left = (this.bindElementPos.right - this.popupContainer.offsetWidth) + 'px';

						if (BX.type.isElementNode(this.angle.element))
						{
							this.angle.element.style.left = (this.popupContainer.offsetWidth - this.angle.element.offsetWidth - this.angle.defaultOffset) + 'px';
							this.popupContainer.style.top = this.bindElementPos.bottom + 'px';
						}
					}
				}
			},
		});
	},
	init: function() {
		if (this.isInitialized)
		{
			return;
		}

		this.initWindow();
		this.initButton();

		this.isInitialized = true;
	},
	getTemplateType1: function() {
		this.content.inputSectionTitle = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__title bx-sb-portal-buy-window__title_underline'
			},
			text: this.getMessage('BX_PORTAL_BUYER_WINDOW_TITLE')
		});

		this.content.inputSectionInput = BX.create('input', {
			props: {
				className: 'bx-sb-portal-buy-window__input',
				type: 'text',
				value: this.windowParams.serverHost
			}
		});

		this.content.inputSectionInputInner = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__input-outer'
			},
			children: [this.content.inputSectionInput]
		});

		this.content.inputSection = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__section'
			},
			children: [
				this.content.inputSectionTitle,
				this.content.inputSectionInputInner
			]
		});

		this.content.inputDescriptionSectionTitle = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__title'
			},
			html: this.getMessage('BX_PORTAL_BUYER_WINDOW_DESCRIPTION')
		});

		this.content.inputDescriptionSection = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__section'
			},
			children: [
				this.content.inputDescriptionSectionTitle,
			]
		});

		this.content.inputButtonSectionButton = BX.create('span', {
			props: {
				className: 'bx-ui-button bx-ui-button_success'
			},
			text: this.getMessage('BX_PORTAL_BUYER_WINDOW_BUTTON_TITLE')
		});

		BX.bind(this.content.inputButtonSectionButton, 'click', BX.delegate(this.redirectToPortalPage, this));

		this.content.inputButtonSection = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__section bx-sb-portal-buy-window__button'
			},
			children: [
				this.content.inputButtonSectionButton,
			]
		});

		this.content.window = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window'
			},
			children: [
				this.content.inputSection,
				this.content.inputDescriptionSection,
				this.content.inputButtonSection
			]
		});

		return this.content.window;
	},
	getTemplateType2: function() {
		this.content.inputSectionTitle = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__title bx-sb-portal-buy-window__title_underline'
			},
			text: this.getMessage('BX_PORTAL_BUYER_WINDOW_TITLE')
		});

		this.content.inputSection = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__section bx-sb-portal-buy-window__description'
			},
			children: [this.content.inputSectionTitle]
		});

		let list = [];
		for (let i in this.currentParams.portals)
		{
			if (!this.currentParams.portals.hasOwnProperty(i))
			{
				continue;
			}

			let link = BX.create('a', {
				props: {
					href: this.currentParams.portals[i]['url'],
					className: 'bx-sb-portal-buy-window__link',
					target: '_blank',
				},
				html: this.currentParams.portals[i]['title']
			});

			list.push(link);
		}

		this.content.inputDescriptionSection = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window__section bx-sb-portal-buy-window__list'
			},
			children: list
		});

		this.content.window = BX.create('div', {
			props: {
				className: 'bx-sb-portal-buy-window'
			},
			children: [
				this.content.inputSection,
				this.content.inputDescriptionSection
			]
		});

		return this.content.window;
	},
	getTemplateType3: function() {

	},
};

if (window.frameCacheVars !== undefined)
{
	BX.addCustomEvent('onFrameDataReceived', function() {
		(new B24PortalBuyerRequestWindow());
	});
}
else
{
	BX.ready(function() {
		(new B24PortalBuyerRequestWindow());
	});
}