;(function() {
	BX.namespace('SB.B24Manager.Cookie');

	if (BX.SB.B24Manager.Cookie.Manager)
	{
		return;
	}

	BX.SB.B24Manager.Cookie.Manager = {
		isInitialized: false,
		events: {
			manager: {
				isInitialized: 'onB24ManagerCookieManagerInitialized',
				onUserSettingsChanged: 'onB24ManagerUserSettingsChanged',
			},
			popup: {
				isInitialized: 'onB24ManagerPopupManagerInitialized',
			},
		},
		attributes: {
			script: 'data-bx-cookie-manager-settings-template',
			cookieSettingsData: 'data-bx-cookie-manager-settings-data',
		},
		isExpiresAllowed: true,
		expiresTime: 360 * 24 * 60 * 60,
		path: '/',
		domain: '',
		cookieNameList: {},
		cookieTypeList: {},

		updateCookiesExpires: function() {
			let list = this.cookieNameList;
			for (let i in list)
			{
				if (list.hasOwnProperty(i))
				{
					let name = list[i];
					let value = BX.getCookie(name);
					if (BX.type.isNotEmptyString(value))
					{
						BX.setCookie(
							name,
							value,
							{
								expires: this.isExpiresAllowed ? this.expiresTime : 0,
								path: this.path,
								domain: this.domain,
							}
						);
					}
				}
			}
		},

		updateExpiresAllowed: function() {
			let cookie = BX.getCookie(this.cookieNameList['gdpr']);

			if (BX.type.isNotEmptyString(cookie))
			{
				cookie = BX.parseJSON(cookie);
				if (BX.type.isNotEmptyObject(cookie))
				{
					let type = this.cookieTypeList['gdpr']['persistent'];
					if (cookie.hasOwnProperty(type))
					{
						this.isExpiresAllowed = cookie[type]['enabled'] !== 'N';
						return;
					}
				}
			}

			this.isExpiresAllowed = true;
		},

		onUserSettingsChanged: function() {
			this.updateExpiresAllowed();
			this.updateCookiesExpires();
		},

		setEvents: function() {
			BX.addCustomEvent(this.events.manager.onUserSettingsChanged, BX.proxy(this.onUserSettingsChanged, this));
		},

		init: function() {
			if (this.isInitialized)
			{
				return false;
			}

			let script = document.querySelector('[' + this.attributes.script + ']');

			if (!script || !script.hasAttribute(this.attributes.cookieSettingsData))
			{
				return false;
			}

			let settingsData = BX.parseJSON(script.getAttribute(this.attributes.cookieSettingsData)) || {};

			if (!BX.type.isNotEmptyObject(settingsData))
			{
				return false;
			}

			this.isExpiresAllowed = settingsData.isExpiresAllowed !== false;

			if (settingsData.hasOwnProperty('cookieTypeList'))
			{
				this.cookieTypeList = settingsData.cookieTypeList;
			}

			if (settingsData.hasOwnProperty('cookieNameList'))
			{
				this.cookieNameList = settingsData.cookieNameList;
			}

			if (settingsData.hasOwnProperty('cookieDomain'))
			{
				this.domain = settingsData.cookieDomain;
			}

			for (let type in this.cookieNameList)
			{
				if (!this.cookieNameList.hasOwnProperty(type))
				{
					continue;
				}

				switch (type)
				{
					case 'popup':
						this.Popup.cookieName = this.cookieNameList[type];
						this.Popup.events = this.events[type];
						this.Popup.manager = this;
						this.Popup.init();
						break;
				}
			}

			BX.remove(script);

			this.setEvents();

			this.isInitialized = true;
			BX.onCustomEvent(this.events.manager.isInitialized);
		}
	};

	BX.SB.B24Manager.Cookie.Manager.Popup = {
		isInitialized: false,
		manager: null,
		cookieName: null,
		isExpiresAllowed: true,
		events: {},
		list: {},
		setEvents: function() {

		},
		getSettingsCookie: function() {
			return BX.getCookie(this.cookieName);
		},
		isParameterExpired: function(name) {
			if (this.list.hasOwnProperty(name))
			{
				let cookie = this.list[name];

				if (cookie.hasOwnProperty('options'))
				{
					if (cookie.options.hasOwnProperty('expires'))
					{
						if (Date.now() < parseInt(cookie.options.expires))
						{
							return false;
						}
					}
				}
			}

			return true;
		},
		getParameter: function(name) {
			let cookie = BX.parseJSON(BX.getCookie(this.cookieName)) || {};

			if (cookie.hasOwnProperty(name))
			{
				if (cookie[name].hasOwnProperty('value'))
				{
					return cookie[name]['value'];
				}
			}

			return null;
		},
		setParameter: function(name, value, options) {
			if (options.hasOwnProperty('expires'))
			{
				options.expires = this.manager.isExpiresAllowed ? options.expires : 0;
			}

			this.list[name.toString()] = {
				name: name,
				value: value,
				options: options,
			};

			return BX.setCookie(
				this.cookieName,
				JSON.stringify(this.list),
				{
					expires: this.manager.isExpiresAllowed ? this.manager.expiresTime : 0,
					path: this.manager.path,
					domain: this.manager.domain,
				}
			);
		},
		removeParameter: function(name) {
			if (!BX.type.isNotEmptyString(name))
			{
				return false;
			}

			delete this.list[name];

			return BX.setCookie(
				this.cookieName,
				JSON.stringify(this.list),
				{
					expires: this.manager.isExpiresAllowed ? this.manager.expiresTime : 0,
					path: this.manager.path,
					domain: this.manager.domain,
				}
			);
		},
		cleanupSettingsCookie: function() {
			for (let name in this.list)
			{
				if (this.list.hasOwnProperty(name))
				{
					if (this.isParameterExpired(name))
					{
						this.removeParameter(name);
					}
				}
			}
		},
		init: function() {
			if (this.isInitialized)
			{
				return;
			}

			if (!this.cookieName)
			{
				return;
			}

			this.list = BX.parseJSON(this.getSettingsCookie()) || {};

			if (!BX.type.isNotEmptyObject(this.manager))
			{
				return;
			}

			this.cleanupSettingsCookie();

			this.isInitialized = true;
			BX.onCustomEvent(this.events.isInitialized);
		}
	};

	if (window.frameCacheVars !== undefined)
	{
		BX.addCustomEvent('onFrameDataReceived', function() {
			BX.SB.B24Manager.Cookie.Manager.init();
		});
	}
	else
	{
		BX.ready(function() {
			BX.SB.B24Manager.Cookie.Manager.init();
		});
	}
})();