;(function() {
	function B24ManagerCookiePolicy()
	{
		this.isInitialized = false;
		this.manager = null;
		this.attributes = {
			script: 'data-bx-cookie-policy-template',
			section: 'data-bx-cookie-policy-section',
			sectionType: 'data-bx-cookie-policy-section-type',
		};
		this.events = {
			isCookieManagerInitialized: 'onB24ManagerCookieManagerInitialized',
			isPopupManagerInitialized: 'onB24ManagerPopupManagerInitialized',
		};
		this.nodes = {};
		this.init();
	}

	B24ManagerCookiePolicy.prototype.waitingForCookieManager = function() {
		BX.addCustomEvent(window, this.events.isCookieManagerInitialized, BX.proxy(this.init, this));
	};

	B24ManagerCookiePolicy.prototype.init = function() {
		if (this.isInitialized)
		{
			return true;
		}

		if (!BX.SB.B24Manager.Cookie.Manager.isInitialized)
		{
			this.waitingForCookieManager();
			return false;
		}

		this.manager = BX.SB.B24Manager.Cookie.Manager;

		if (!BX.type.isNotEmptyObject(this.manager))
		{
			return false;
		}

		let script = document.querySelectorAll('[' + this.attributes.script + ']');

		for (let i = 0; i < script.length; i++)
		{
			if (!script[i])
			{
				continue;
			}

			let section = document.createElement('DIV');
			section.innerHTML = script[i].innerHTML;
			section = section.children[0];

			if (section)
			{
				if (!section.hasAttribute(this.attributes.sectionType))
				{
					continue;
				}

				document.body.insertBefore(section, document.body.children[0]);

				let type = section.getAttribute(this.attributes.sectionType);

				switch (type)
				{
					case 'popup':
						(new B24ManagerCookiePolicyPopup({
							node: section,
							cookieName: 'cookie_policy_site_redirect',
							_this: this,
						}));
						break;

					case 'slidebar':
						(new B24ManagerCookiePolicyPopup({
							node: section,
							cookieName: 'cookie_policy_slidebar',
							_this: this,
						}));
						break;

					case 'popupsettings':
						(new B24ManagerCookiePolicyPopup({
							node: section,
							cookieName: 'cookie_policy_popupsettings',
							_this: this,
							disableCookies: true,
							autoHide: true,
							autoLoad: false,
							eventParams: {
								loadClass: 'js-show-gdpr-settings'
							},
						}));
						break;
				}
			}

			BX.remove(script[i]);
		}

		this.isInitialized = true;
	};

	function B24ManagerCookiePolicyPopup(params)
	{
		this.isInitialized = false;
		this.manager = null;
		this.cookieName = null;
		this.attributes = {
			shown: 'shown',
			close: 'data-bx-cookie-policy-section-close',
		};
		this.nodes = {
			section: null,
		};
		this.params = {
			node: null,
			cookieName: null,
			_this: null,
			disableCookies: false,
			autoHide: false,
			autoLoad: true,
			eventParams: {
				loadClass: '',
			},
		};

		if (!BX.type.isNotEmptyObject(params))
		{
			return;
		}

		this.params = BX.mergeEx({}, this.params, params);

		if (!BX.type.isNotEmptyObject(this.params._this.manager.Popup))
		{
			return;
		}

		this.manager = this.params._this.manager.Popup;

		if (!this.params.disableCookies)
		{
			if (!BX.type.isNotEmptyString(this.params.cookieName))
			{
				return;
			}

			this.cookieName = this.params.cookieName.toString();
		}

		if (!BX.type.isElementNode(this.params.node))
		{
			return;
		}

		this.nodes.section = this.params.node;
		this.init();
	}

	B24ManagerCookiePolicyPopup.prototype.hide = function() {
		if (!this.params.disableCookies)
		{
			let currentDate = new Date();
			let expires = this.manager.isExpiresAllowed ? 30 * 24 * 60 * 60 : 0;

			currentDate.setTime(currentDate.getTime() + expires * 1000);

			this.manager.setParameter(
				this.cookieName,
				'Y',
				{
					path: '/',
					expires: currentDate.setHours(0, 0, 0, 0)
				}
			);
		}

		let attributes = { attrs: {} };
		attributes['attrs'][this.attributes.shown.toString()] = 'false';

		BX.adjust(this.nodes.section, attributes);
	};

	B24ManagerCookiePolicyPopup.prototype.show = function() {
		let attributes = { attrs: {} };
		attributes['attrs'][this.attributes.shown.toString()] = 'true';

		BX.adjust(this.nodes.section, attributes);
	};

	B24ManagerCookiePolicyPopup.prototype.bind = function() {
		let _this = this;
		let close = _this.nodes.section.querySelectorAll('[' + _this.attributes.close + ']');

		for (let i in close)
		{
			if (!BX.type.isElementNode(close[i]))
			{
				continue;
			}

			BX.bind(close[i], 'click', BX.proxy(_this.hide, _this));
		}

		if (BX.type.isNotEmptyString(_this.params.eventParams.loadClass))
		{
			let node = document.querySelectorAll('.' + _this.params.eventParams.loadClass);

			for (let i = 0; i < node.length; i++)
			{
				BX.bind(node[i], 'click', function(e) {
					e = e || document.event;
					e.preventDefault();
					_this.show();
				});
			}
		}
	};

	B24ManagerCookiePolicyPopup.prototype.init = function() {
		if (this.isInitialized)
		{
			return;
		}

		if (!this.params.disableCookies)
		{
			if (!this.manager.isParameterExpired(this.cookieName))
			{
				return;
			}

			let cookie = this.manager.getParameter(this.cookieName);

			if (cookie && cookie.length > 0)
			{
				return;
			}
		}

		this.bind();

		if (this.params.autoLoad)
		{
			this.show();
		}

		this.isInitialized = true;
	};

	BX.ready(function() {
		if (!BX.SB.B24Manager.Cookie.Manager.isInitialized)
		{
			BX.addCustomEvent('onB24ManagerCookieManagerInitialized', function() {
				(new B24ManagerCookiePolicy());
			});
		}
		else
		{
			(new B24ManagerCookiePolicy());
		}
	});
})();