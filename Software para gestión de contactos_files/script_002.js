;(function() {
	function UserGDPRCookieSettings()
	{
		this.isInitialized = false;
		this.manager = null;
		this.cookieName = null;
		this.isAjaxBusy = false;
		this.attributes = {
			section: 'data-bx-user-cookie-setings',
			list: 'data-bx-user-cookie-setings-list',
			item: 'data-bx-user-cookie-setings-list-item',
			type: 'data-bx-user-cookie-setings-list-item-type',
		};
		this.nodes = {
			section: null,
			list: null,
			controller: {},
		};
		this.init();
	}

	UserGDPRCookieSettings.prototype.blockController = function() {
		let item = this.nodes.controller;
		for (let type in item)
		{
			if (item.hasOwnProperty(type))
			{
				item[type]['input'].setAttribute('disabled', '');
			}
		}
	};

	UserGDPRCookieSettings.prototype.unblockController = function() {
		let item = this.nodes.controller;
		for (let type in item)
		{
			if (item.hasOwnProperty(type))
			{
				item[type]['input'].removeAttribute('disabled');
			}
		}
	};

	UserGDPRCookieSettings.prototype.updateSettings = function(type) {
		let _this = this;

		if (_this.isAjaxBusy)
		{
			return;
		}

		_this.isAjaxBusy = true;

		_this.blockController();

		BX.ajax({
			url: window.location.href,
			method: 'POST',
			dataType: 'html',
			timeout: 30,
			scriptsRunFirst: false,
			emulateOnload: false,
			data: {
				'change_gdpr_cookie_mode': 'Y',
				'change_gdpr_cookie_mode_type': type,
				'sessid': BX.bitrix_sessid()
			},
			onsuccess: function() {
				BX.onCustomEvent(_this.manager.events.manager.onUserSettingsChanged);
				_this.isAjaxBusy = false;
				_this.unblockController();
			}
		});
	};

	UserGDPRCookieSettings.prototype.getItemTypeAttribute = function(node) {
		return node.getAttribute(this.attributes.type.toString());
	};

	UserGDPRCookieSettings.prototype.bind = function() {
		let _this = this;

		if (BX.type.isNotEmptyObject(_this.nodes.controller))
		{
			let item = _this.nodes.controller;
			for (let type in item)
			{
				if (item.hasOwnProperty(type))
				{
					BX.bind(item[type]['input'], 'bxchange', function() {
						_this.updateSettings(type);
					});
				}
			}
		}
	};

	UserGDPRCookieSettings.prototype.init = function() {
		if (this.isInitialized)
		{
			return true;
		}

		if (!BX.type.isNotEmptyObject(BX.SB.B24Manager.Cookie.Manager))
		{
			return;
		}

		this.manager = BX.SB.B24Manager.Cookie.Manager;
		this.cookieName = this.manager.cookieNameList['gdpr'];

		let section = document.querySelector('[' + this.attributes.section + ']');

		if (!BX.type.isElementNode(section))
		{
			return;
		}

		this.nodes.section = section;
		this.nodes.list = this.nodes.section.querySelector('[' + this.attributes.list + ']');

		let item = this.nodes.list.querySelectorAll('[' + this.attributes.item + ']');
		for (let i = 0; i < item.length; i++)
		{
			let type = this.getItemTypeAttribute(item[i]);
			let id = item[i].getAttribute('for');
			let input = this.nodes.list.querySelector('#' + id);

			this.nodes.controller[type.toString()] = {
				'input': input,
				'label': item[i],
			};
		}

		this.bind();
	};

	BX.ready(function() {
		if (!BX.SB.B24Manager.Cookie.Manager.isInitialized)
		{
			BX.addCustomEvent('onB24ManagerCookieManagerInitialized', function() {
				(new UserGDPRCookieSettings());
			});
		}
		else
		{
			(new UserGDPRCookieSettings());
		}
	});
})();
