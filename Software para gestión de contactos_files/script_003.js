window.Bitrix24NetAuthWindowManager = {
	popupWindow: {
		isInited: false,
		isOpen: false,
		popup: null,
		outerSection: null,
		innerSection: null
	},
	popupWindowButtons: {
		buttons: []
	},
	authWindow: {},
	getBitrix24NetAuthWindowSize: function() {
		let defaultWidth = 1114;
		let defaultHeight = 830;

		let width = window.innerWidth < defaultWidth ? window.innerWidth : defaultWidth;
		let height = window.innerHeight < defaultHeight ? window.innerHeight : defaultHeight;

		return { width: width, height: height };
	},
	Bitrix24NetAuthWindow: function(element) {
		element = element || {};
		let url = '/auth/';
		let request = '';
		if (BX.type.isElementNode(element))
		{
			let requestParams = element.hasAttribute('data-request-params') ?
				element.getAttribute('data-request-params') : '';

			requestParams = BX.type.isNotEmptyString(requestParams) ?
				JSON.parse(requestParams) : {};

			if (BX.type.isNotEmptyObject(requestParams) && requestParams.hasOwnProperty('request'))
			{
				requestParams = requestParams.request;

				request = '?';

				for (let id in requestParams)
				{
					if (requestParams.hasOwnProperty(id))
					{
						request += id + '=' + requestParams[id] + '&';
					}
				}
			}
		}

		let size = this.getBitrix24NetAuthWindowSize();
		BX.util.popup(url + request, size.width, size.height);
	},
	popupWindowOpen: function() {
		BX.addClass(this.popupWindow.popup, 'active');
		this.popupWindow.isOpen = true;
		BX.bind(window, 'click', BX.delegate(this.popupWindowCloseHandler, this));
	},
	popupWindowClose: function() {
		BX.removeClass(this.popupWindow.popup, 'active');
		this.popupWindow.isOpen = false;
		BX.unbind(window, 'click', BX.delegate(this.popupWindowCloseHandler, this));
	},
	popupWindowCloseHandler: function(e) {
		e = e || document.event;
		if (!this.popupWindow.outerSection.contains(e.target))
		{
			let close = true;
			for (let i = 0; i < this.popupWindowButtons.buttons.length; i++)
			{
				let button = this.popupWindowButtons.buttons[i];

				if (button.contains(e.target))
				{
					close = false;
				}
			}

			if (close)
			{
				this.popupWindowClose();
			}
		}
	},
	popupWindowToggle: function() {
		if (!this.popupWindow.isOpen)
		{
			this.popupWindowOpen();
		}
		else
		{
			this.popupWindowClose();
		}
	}
};

function Bitrix24NetAuthWindow(params)
{
	this.params = params || {};
	this.manager = window.Bitrix24NetAuthWindowManager;

	this.classes = {
		initialized: 'js-bitrix24-auth-initialized',
	};

	this.init();
}

Bitrix24NetAuthWindow.prototype = {
	init: function() {
		if (!this.manager.popupWindow.isInited)
		{
			this.manager.popupWindow.popup = document.querySelector('.' + this.params.popupClass);

			if (BX.type.isElementNode(this.manager.popupWindow.popup))
			{
				this.manager.popupWindow.outerSection = this.manager.popupWindow.popup.querySelector('[data-bx-auth-popup-outer]');
			}

			if (BX.type.isElementNode(this.manager.popupWindow.popup))
			{
				this.manager.popupWindow.isInited = true;
			}
		}

		let button = document.querySelectorAll('.' + this.params.buttonClass);

		for (let i = 0; i < button.length; i++)
		{
			if (!BX.hasClass(button[i], this.classes.initialized))
			{
				BX.addClass(button[i], this.classes.initialized);
				this.manager.popupWindowButtons.buttons.push(button[i]);
				BX.bind(button[i], 'click', BX.delegate(this.manager.popupWindowToggle, this.manager));
			}
		}

		let buttonAuth = document.querySelectorAll('.' + this.params.netAuthWindowClass);

		for (let i = 0; i < buttonAuth.length; i++)
		{
			if (!BX.hasClass(buttonAuth[i], this.classes.initialized))
			{
				BX.addClass(buttonAuth[i], this.classes.initialized);
				BX.bind(buttonAuth[i], 'click', BX.proxy(this.manager.Bitrix24NetAuthWindow, this.manager));
			}
		}
	}
};

if (window.frameCacheVars !== undefined)
{
	BX.addCustomEvent('onFrameDataReceived', function() {
		(new Bitrix24NetAuthWindow({
			popupClass: 'js-bitrix24-auth-popup-section',
			buttonClass: 'js-bitrix24-auth-popup',
			netAuthWindowClass: 'js-bitrix24-net-auth',
		}));
	});
}
else
{
	BX.ready(function() {
		(new Bitrix24NetAuthWindow({
			popupClass: 'js-bitrix24-auth-popup-section',
			buttonClass: 'js-bitrix24-auth-popup',
			netAuthWindowClass: 'js-bitrix24-net-auth',
		}));
	});
}
