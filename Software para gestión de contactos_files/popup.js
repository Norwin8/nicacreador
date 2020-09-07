;(function() {
	'use strict';

	BX.namespace('BX.SB.Popup');

	if (BX.SB.Popup.Manager)
	{
		return;
	}

	/**
	 * @class
	 * @property {Object} entities
	 * @property {Object} currentEntities
	 * @property {Object} events
	 * @property {Object} classes
	 * @property {Object} defaults
	 * @property {Object} attributes
	 * @property {Object} documentEvents
	 */
	BX.SB.Popup.Manager = {
		entities: {},
		currentEntities: {},
		events: {
			onBeforeInitialized: 'BX.SB.Popup.Manager:beforeInitialized',
			onInitialized: 'BX.SB.Popup.Manager:afterInitialized',
		},
		classes: {
			section: 'popup-window',
			ready: 'popup-window_ready',
			active: 'popup-window_active',
			popup: 'popup-window__popup',
			popupFixedPos: 'popup-window__popup_fixed',
			inner: 'popup-window__inner',
			overlay: 'popup-window__overlay',
			overlayFixedPos: 'popup-window__overlay_fixed',
			close: 'popup-window__close',
			preloader: 'popup-window__preloader',
			defaultTemplate: 'popup-window_default',
		},
		defaults: {
			template: null,
			parent: null,
			content: null,
			classPrefix: 'bx-sb',
			disableDefaultTemplate: false,
			disableOverflow: true,
			disableOverlay: true,
			disableOn: 0,
			calcContentPos: false,
			calcBgPos: false,
			stickToNode: null,
			stickToNodePosition: null,
			fixedContentPos: true,
			fixedBgPos: true,
			closeOnExternalClick: true,
			closeOnBgClick: true,
			closeOnContentClick: false,
			closeOnEscapeKey: true,
			showPreloader: true,
			showCloseBtn: true,
			events: {},
			classes: {},
			attributes: {},
			ajax: {
				url: null,
				data: {},
				method: 'POST',
				dataType: 'html',
				timeout: 30,
				async: true,
				processData: true,
				scriptsRunFirst: false,
				emulateOnload: true,
				start: true,
				cache: true,
				onsuccess: null,
				onfailure: null,
			},
		},
		attributes: {
			section: 'data-sb-popup-window',
			overlay: 'data-sb-popup-overlay',
			popup: 'data-sb-popup-popup',
			inner: 'data-sb-popup-inner',
			close: 'data-sb-popup-window-close',
			preloader: 'data-sb-popup-window-preloader',
			ready: 'data-sb-popup-window-ready',
		},
		documentEvents: {
			initialClick: 'sbPopupManagerInitialClick'
		},
	};

	/**
	 * @param {Object} [params.parent]
	 * @param {Object} [params.content]
	 * @param {String} [params.classPrefix]
	 * @param {Number} [params.disableDefaultTemplate]
	 * @param {Number} [params.disableOn]
	 * @param {Boolean} [params.disableOverflow]
	 * @param {Boolean} [params.disableOverlay]
	 * @param {Boolean} [params.calcContentPos]
	 * @param {Boolean} [params.calcBgPos]
	 * @param {Object} [params.stickToNode]
	 * @param {String} [params.stickToNodePosition]
	 * @param {Boolean} [params.fixedContentPos]
	 * @param {Boolean} [params.fixedBgPos]
	 * @param {Boolean} [params.closeOnExternalClick]
	 * @param {Boolean} [params.closeOnBgClick]
	 * @param {Boolean} [params.closeOnContentClick]
	 * @param {Boolean} [params.closeOnEscapeKey]
	 * @param {Boolean} [params.showPreloader]
	 * @param {Boolean} [params.showCloseBtn]
	 * @param {Object} [params.events]
	 * @param {Object} [params.classes]
	 * @param {Object} [params.attributes]
	 * @param {Object} [params.ajax]
	 * @constructor
	 */
	BX.SB.Popup.Window = function(params) {
		if (!(this instanceof BX.SB.Popup.Window))
		{
			return new BX.SB.Popup.Window(params);
		}

		/** @var {String} **/
		this._id = null;
		/** @var {Object} **/
		this._window = window;
		/** @var {Object} **/
		this._document = document;
		/** @var {Object} **/
		this._body = this._document.body;
		/** @var {BX.SB.Popup.Manager} **/
		this._manager = null;
		/** @var {Boolean} **/
		this._isOpened = false;
		/** @var {Object} **/
		this._events = {
			onBeforeInitialized: 'BX.SB.Popup.Window:beforeInitialized',
			onInitialized: 'BX.SB.Popup.Window:afterInitialized',

			onBeforeDestroyed: 'BX.SB.Popup.Window:beforeDestroyed',
			onDestroyed: 'BX.SB.Popup.Window:afterDestroyed',

			onBeforeCreated: 'BX.SB.Popup.Window:beforeCreated',
			onCreated: 'BX.SB.Popup.Window:afterCreated',

			onBeforeContentUpdated: 'BX.SB.Popup.Window:beforeContentUpdated',
			onContentUpdated: 'BX.SB.Popup.Window:afterContentUpdated',

			onBeforeContentUpdatedAjax: 'BX.SB.Popup.Window:beforeContentUpdatedAjax',
			onContentUpdatedAjax: 'BX.SB.Popup.Window:afterContentUpdatedAjax',

			onContentUpdatedAjaxSuccess: 'BX.SB.Popup.Window:afterContentUpdatedAjaxSuccess',
			onContentUpdatedAjaxFailure: 'BX.SB.Popup.Window:afterContentUpdatedAjaxFailure',

			onBeforeClosed: 'BX.SB.Popup.Window:beforeClosed',
			onClosed: 'BX.SB.Popup.Window:afterClosed',

			onBeforeOpened: 'BX.SB.Popup.Window:beforeOpened',
			onOpened: 'BX.SB.Popup.Window:afterOpened',
		};
		/** @var {Object} **/
		this._params = params || {};
		/** @var {Object} **/
		this._nodes = {
			section: null,
			overlay: null,
			popup: null,
			inner: null,
			close: null,
			preloader: null,
		};

		if (!BX.type.isNotEmptyObject(BX.SB.Popup.Manager))
		{
			return;
		}

		this._manager = BX.SB.Popup.Manager;

		BX.onCustomEvent(this, this._events.onBeforeInitialized);

		this._init();

		BX.onCustomEvent(this, this._events.onInitialized);
	};

	BX.SB.Popup.Window.prototype = {
		constructor: BX.SB.Popup.Window,

		/**
		 * @api private
		 */
		_init: function() {
			this._params = BX.mergeEx({}, this._manager.defaults, this._params);
			this._params.ajax = BX.mergeEx({}, this._manager.defaults.ajax, this._params.ajax || {});
			this._params.classes = BX.mergeEx({}, this._manager.classes, this._params.classes);
			this._params.attributes = BX.mergeEx({}, this._manager.attributes, this._params.attributes);

			this._setEntityId(this._getRandomString());
			this._saveEntity();
		},

		/**
		 * @param {Number} [windowHeight=null]
		 * @return {Number}
		 * @api private
		 */
		_hasScrollBar: function(windowHeight) {
			windowHeight = windowHeight || null;
			return this._document.body.scrollHeight > (windowHeight || this._window.innerHeight);
		},

		/**
		 * @return {Number}
		 * @api private
		 */
		_getScrollbarSize: function() {
			let scroll = this._document.createElement('DIV');
			scroll.style.cssText = 'position: absolute; width: 99px; height: 99px; top: -9999px; overflow: scroll;';

			this._document.body.appendChild(scroll);
			let size = scroll.offsetWidth - scroll.clientWidth;
			this._document.body.removeChild(scroll);

			return size;
		},

		/**
		 * @api private
		 */
		_checkOpening: function() {
			return this._isOpened === true && this._manager.currentEntities.hasOwnProperty(this._getEntityId());
		},

		/**
		 * @api private
		 */
		_checkInitialClickEvent: function(event) {
			event = event || this._window.event;
			let isInitialClick = false;

			if (typeof event !== 'undefined' && event.hasOwnProperty(this._manager.documentEvents.initialClick))
			{
				isInitialClick = event.type === 'click' && event[this._manager.documentEvents.initialClick] === this._getEntityId();
			}

			return isInitialClick;
		},

		_setInitialClickEvent: function(event) {
			event = event || this._window.event;

			if (typeof event !== 'undefined' && event.type === 'click' && !this._checkOpening())
			{
				this._window.event[this._manager.documentEvents.initialClick] = this._getEntityId();
			}
		},

		/**
		 * @api private
		 */
		_removeCurrentEntity: function() {
			delete this._manager.currentEntities[this._getEntityId()];
		},

		/**
		 * @api private
		 */
		_setCurrentEntity: function() {
			this._manager.currentEntities[this._getEntityId()] = this._manager.entities[this._getEntityId()];
		},

		/**
		 * @api private
		 */
		_saveEntity: function() {
			this._manager.entities[this._getEntityId()] = this;
		},

		/**
		 * @param {String} id
		 * @api private
		 */
		_setEntityId: function(id) {
			this._id = id;
		},

		/**
		 * @return {String}
		 * @api private
		 */
		_getEntityId: function() {
			return this._id;
		},

		/**
		 * @param {Number} [length=5]
		 * @return {String}
		 * @api private
		 */
		_getRandomString: function(length) {
			length = length ? length : 5;
			return BX.util.getRandomString(length);
		},

		/**
		 * @param {Object} element
		 * @param {String} attribute
		 * @param {String=} value
		 * @api private
		 */
		_setDataAttribute: function(element, attribute, value) {
			value = value ? value : '';
			if (BX.type.isElementNode(element) && attribute.toString().length > 0)
			{
				element.setAttribute(attribute.toString(), value);
			}
		},

		/**
		 * @return {Object}
		 * @api private
		 */
		_getNodes: function() {
			return this._nodes;
		},

		/**
		 * @return {Object}
		 * @api private
		 */
		_getParams: function() {
			return this._params;
		},

		/**
		 * @param {Object} params
		 * @api private
		 */
		_updateParams: function(params) {
			params = params || {};
			this._params = BX.mergeEx({}, this._params, params);
		},

		/**
		 * @param {String=} html
		 * @return {Object}
		 * @api private
		 */
		_createElementNodeFromHtml: function(html) {
			return BX.type.isElementNode(html) ? html : (new DOMParser().parseFromString(html, 'text/html').body.firstChild);
		},

		/**
		 * @api private
		 */
		_disablePageScrollbar: function() {
			this._document.body.style.paddingRight = this._getScrollbarSize() + 'px';
			this._document.body.style.overflow = 'hidden';
		},

		/**
		 * @api private
		 */
		_enablePageScrollbar: function() {
			this._document.body.style.removeProperty('padding-right');
			this._document.body.style.removeProperty('overflow');
		},

		/**
		 * @api private
		 */
		_unbindParamsEvents: function() {
			for (let event in this._params.events)
			{
				if (this._params.events.hasOwnProperty(event))
				{
					if (this._events.hasOwnProperty(event))
					{
						BX.removeCustomEvent(this, event, this._params.events[event]);
					}
				}
			}
		},

		/**
		 * @api private
		 */
		_bindParamsEvents: function() {
			for (let event in this._params.events)
			{
				if (this._params.events.hasOwnProperty(event))
				{
					if (this._events.hasOwnProperty(event))
					{
						BX.addCustomEvent(this, this._events[event], this._params.events[event]);
					}
				}
			}
		},

		/**
		 * @api private
		 */
		_unbindEvents: function() {
			BX.unbind(window, 'resize', BX.proxy(this._updateWindow, this));

			BX.unbind(this._nodes.close, 'click', BX.proxy(this.close, this));
			BX.unbind(this._document.body, 'click', BX.proxy(this._closeClickHandler, this));
			BX.unbind(this._document.body, 'keyup', BX.proxy(this._closeKeyUpHandler, this));

			this._unbindParamsEvents();
		},

		/**
		 * @api private
		 */
		_bindEvents: function() {
			BX.bind(window, 'resize', BX.proxy(this._updateWindow, this));

			BX.bind(this._nodes.close, 'click', BX.proxy(this.close, this));
			BX.bind(this._document.body, 'click', BX.proxy(this._closeClickHandler, this));
			BX.bind(this._document.body, 'keyup', BX.proxy(this._closeKeyUpHandler, this));

			this._bindParamsEvents();
		},

		/**
		 * @param {Object|String} content
		 * @api private
		 */
		_updateContent: function(content) {
			BX.onCustomEvent(this, this._events.onBeforeContentUpdated);

			this._params.content = content;

			if (this._nodes.inner !== null)
			{
				if (BX.type.isElementNode(content))
				{
					BX.cleanNode(this._nodes.inner);
					this._nodes.inner.appendChild(content);
				}
				else if (BX.type.isString(content))
				{
					this._nodes.inner.innerHTML = content;
				}
			}

			BX.onCustomEvent(this, this._events.onContentUpdated);
		},

		/**
		 * @param {Object} params
		 * @api private
		 */
		_updateContentAjax: function(params) {
			let _this = this;
			params = params || this._params.ajax;

			BX.onCustomEvent(this, this._events.onBeforeContentUpdatedAjax);

			if (BX.type.isNotEmptyObject(params))
			{
				if (BX.type.isFunction(params.onsuccess))
				{
					let callOnSuccess = params.onsuccess;
					params.onsuccess = function(data) {
						callOnSuccess(data, this, _this);

						BX.onCustomEvent(this, _this._events.onContentUpdatedAjaxSuccess);
					};
				}

				if (BX.type.isFunction(params.onfailure))
				{
					let callOnFailure = params.onfailure;
					params.onfailure = function(data) {
						callOnFailure(data, this, _this);

						BX.onCustomEvent(this, _this._events.onContentUpdatedAjaxFailure);
					}
				}

				BX.ajax(params);
			}

			BX.onCustomEvent(this, this._events.onContentUpdatedAjax);
		},

		/**
		 * @api private
		 */
		_updateWindow: function() {
			if (BX.type.isElementNode(this._nodes.overlay))
			{
				BX.adjust(this._nodes.overlay, {
					style: {
						height: this._params.calcBgPos ? false : this._document.body.clientHeight + 'px',
					},
				});
			}
		},

		/**
		 * @api private
		 */
		_destroy: function() {
			BX.onCustomEvent(this, this._events.onBeforeDestroyed);

			BX.remove(this._nodes.section);

			BX.onCustomEvent(this, this._events.onDestroyed);
		},

		/**
		 * @api private
		 */
		_updatePosition: function() {
			if (this._params.calcContentPos && BX.type.isElementNode(this._nodes.popup))
			{
				BX.adjust(this._nodes.popup, {
					style: {
						top: this._window.scrollY + (this._window.innerHeight / 2) + 'px',
					},
				});
			}

			if (this._params.calcBgPos && !this._params.disableOverlay)
			{
				BX.adjust(this._nodes.popup, {
					style: {
						height: this._document.body.clientHeight + 'px',
					},
				});
			}
		},

		/**
		 * @api private
		 */
		_create: function() {
			BX.onCustomEvent(this, this._events.onBeforeCreated);

			if (this._params.template)
			{
				if (!BX.type.isElementNode(this._params.template))
				{
					this._params.template = this._createElementNodeFromHtml(this._params.template);
				}

				let template = this._document.createElement('DIV');
				template.appendChild(this._params.template);

				for (let key in this._nodes)
				{
					if (this._nodes.hasOwnProperty(key) && this._params.attributes.hasOwnProperty(key))
					{
						let element = template.querySelector('[' + this._params.attributes[key] + ']');
						if (BX.type.isElementNode(element))
						{
							this._nodes[key] = element;
						}
					}
				}
			}
			else
			{
				if (this._params.showCloseBtn)
				{
					this._nodes.close = BX.create('DIV', {
						attrs: {
							className: this.getPrefixedClassName(this._params.classes.close, this._params.classPrefix),
						},
					});
					this._setDataAttribute(this._nodes.close, this._params.attributes.close);
				}

				if (this._params.showPreloader)
				{
					this._nodes.preloader = BX.create('DIV', {
						attrs: {
							className: this.getPrefixedClassName(this._params.classes.preloader, this._params.classPrefix),
						},
					});
					this._setDataAttribute(this._nodes.preloader, this._params.attributes.preloader);
				}

				this._nodes.inner = BX.create('DIV', {
					attrs: {
						className: this.getPrefixedClassName(this._params.classes.inner, this._params.classPrefix),
					},
				});

				this._nodes.popup = BX.create('DIV', {
					attrs: {
						className: this.getPrefixedClassName(this._params.classes.popup, this._params.classPrefix) +
							(this._params.fixedContentPos ? ' ' + this.getPrefixedClassName(this._params.classes.popupFixedPos, this._params.classPrefix) : ''),
					},
					children: [this._nodes.close, this._nodes.inner, this._nodes.preloader],
				});

				if (this._params.disableOverlay === false)
				{
					this._nodes.overlay = BX.create('DIV', {
						attrs: {
							className: this.getPrefixedClassName(this._params.classes.overlay, this._params.classPrefix) +
								(this._params.fixedBgPos ? ' ' + this.getPrefixedClassName(this._params.classes.overlayFixedPos, this._params.classPrefix) : ''),
						},
					});
				}

				this._nodes.section = BX.create('DIV', {
					attrs: {
						className: this.getPrefixedClassName(this._params.classes.section, this._params.classPrefix) +
							(this._params.disableDefaultTemplate ? '' : ' ' + this.getPrefixedClassName(this._params.classes.defaultTemplate, this._params.classPrefix)),
					},
					children: [this._nodes.popup, this._nodes.overlay],
				});
			}

			BX.addClass(this._nodes.section, this._params.classes.ready);

			this._updatePosition();

			let parent = BX.type.isElementNode(this._params.parent) ? this._params.parent : this._body;
			parent.appendChild(this._nodes.section);

			if (BX.type.isNotEmptyObject(this._params.ajax))
			{
				this._updateContentAjax(this._params.ajax);
			}
			if (this._params.content !== null)
			{
				this._updateContent(this._params.content);
			}

			BX.onCustomEvent(this, this._events.onCreated);
		},

		/**
		 * @param {Object} event
		 * @api private
		 */
		_closeClickHandler: function(event) {
			event = event || this._window.event;

			if (this._checkInitialClickEvent())
			{
				return;
			}

			if (this._params.closeOnExternalClick && !this._nodes.section.contains(event.target))
			{
				this.close();
			}

			if (this._params.closeOnBgClick && this._nodes.section.contains(event.target) && !this._nodes.popup.contains(event.target))
			{
				this.close();
			}

			if (this._params.closeOnContentClick && this._nodes.section.contains(event.target) && this._nodes.inner.contains(event.target))
			{
				this.close();
			}
		},

		/**
		 * @param {Object} event
		 * @api private
		 */
		_closeKeyUpHandler: function(event) {
			event = event || this._window.event;

			if (this._params.closeOnEscapeKey && event.keyCode === 27)
			{
				this.close();
			}
		},

		/**
		 * @api private
		 */
		_close: function() {
			if (!this._checkOpening())
			{
				return;
			}

			BX.onCustomEvent(this, this._events.onBeforeClosed);

			BX.removeClass(this._nodes.section, this._params.classes.active);

			this._removeCurrentEntity();
			this._isOpened = false;

			this._unbindEvents();

			this._destroy();

			this._enablePageScrollbar();

			BX.onCustomEvent(this, this._events.onClosed);
		},

		/**
		 * @api private
		 */
		_open: function() {
			if (this._checkOpening())
			{
				return;
			}

			if (this._window.innerWidth < this._params.disableOn)
			{
				return;
			}

			BX.onCustomEvent(this, this._events.onBeforeOpened);

			if (!this._checkInitialClickEvent())
			{
				if (typeof this._window.event !== 'undefined')
				{
					if (this._window.event.stopPropagation)
					{
						this._window.event.stopPropagation();
					}
					else
					{
						this._window.event.cancelBubble = true;
					}
				}
			}

			if (!this._params.disableOverflow)
			{
				this._disablePageScrollbar();
			}

			this._create();

			this._bindEvents();

			BX.addClass(this._nodes.section, this._params.classes.active);

			this._isOpened = true;
			this._setCurrentEntity();

			BX.onCustomEvent(this, this._events.onOpened);
		},

		/**
		 * @param {String} name
		 * @param {String} prefix
		 * @return {String}
		 * @api private
		 */
		_getPrefixedClassName: function(name, prefix) {
			prefix = this._params.classPrefix.toString().length > 0 ? this._params.classPrefix : '';
			return prefix.toString().length > 0 ? prefix + '-' + name : name;
		},

		/**
		 * @param {String} name
		 * @param {String} prefix
		 * @return {String}
		 * @api public
		 */
		getPrefixedClassName: function(name, prefix) {
			return this._getPrefixedClassName(name, prefix);
		},

		/**
		 * @return {Object}
		 * @api public
		 */
		getNodes: function() {
			return this._getNodes();
		},

		/**
		 * @return {Object}
		 * @api public
		 */
		getParams: function() {
			return this._getParams();
		},

		/**
		 * @param {Object} params
		 * @api public
		 */
		updateParams: function(params) {
			this._updateParams(params);
		},

		/**
		 * @param {Object|String} content
		 * @api public
		 */
		updateContent: function(content) {
			this._updateContent(content);
		},

		/**
		 * @param {Object} params
		 * @api public
		 */
		updateContentAjax: function(params) {
			this._updateContentAjax(params);
		},

		/**
		 * @api public
		 */
		close: function() {
			this._close();
		},

		/**
		 * @api public
		 */
		open: function() {
			this._open();
		},

		/**
		 * @api public
		 */
		setInitialClickEvent: function() {
			this._setInitialClickEvent();
		},

		/**
		 * @api public
		 */
		onBeforeInitialized: function() {
		},

		/**
		 * @api public
		 */
		onInitialized: function() {
		},

		/**
		 * @api public
		 */
		onBeforeDestroyed: function() {
		},

		/**
		 * @api public
		 */
		onDestroyed: function() {
		},

		/**
		 * @api public
		 */
		onBeforeCreated: function() {
		},

		/**
		 * @api public
		 */
		onCreated: function() {
		},

		/**
		 * @api public
		 */
		onBeforeContentUpdated: function() {
		},

		/**
		 * @api public
		 */
		onContentUpdated: function() {
		},

		/**
		 * @api public
		 */
		onBeforeContentUpdatedAjax: function() {
		},

		/**
		 * @api public
		 */
		onContentUpdatedAjax: function() {
		},

		/**
		 * @api public
		 */
		onContentUpdatedAjaxSuccess: function() {
		},

		/**
		 * @api public
		 */
		onContentUpdatedAjaxFailure: function() {
		},

		/**
		 * @api public
		 */
		onBeforeClosed: function() {
		},

		/**
		 * @api public
		 */
		onClosed: function() {
		},

		/**
		 * @api public
		 */
		onBeforeOpened: function() {
		},

		/**
		 * @api public
		 */
		onOpened: function() {
		},
	};


})();