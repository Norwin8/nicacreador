;(function() {
	BX.namespace('BX.SB.B24Manager.Template');

	BX.SB.B24Manager.Template.Header = {
		isInitialized: false,
		nodes: {
			header: null,
		},
		attributes: {
			stackId: 'data-header-stack-id',
		},
		events: {
			refresh: {
				name: 'onB24ManagerHeaderStackRefresh',
				timeout: null,
			},
		},
		stack: {},
		refreshEvent: function() {
			let _this = this;

			if (!!_this.events.refresh.timeout)
			{
				clearTimeout(_this.events.refresh.timeout);
			}

			_this.events.refresh.timeout = setTimeout(BX.onCustomEvent(_this, _this.events.refresh.name), 200);
		},
		bindEvents: function() {
			BX.bind(window, 'resize', BX.proxy(this.refreshEvent, this));
		},
		getRandomString: function() {
			return BX.util.getRandomString(4);
		},
		getStackHeight: function(key) {
			let height = 0;

			for (let id in this.stack)
			{
				if (!!key)
				{
					if (id === key)
					{
						break;
					}
				}

				if (this.stack.hasOwnProperty(id))
				{
					height = height + this.stack[id].offsetHeight;
				}
			}

			return height;
		},
		addNodeToStack: function(node) {
			let element = node;
			let attributes = {};
			let rand = this.getRandomString();

			attributes[this.attributes.stackId.toString()] = rand;

			this.stack[attributes[this.attributes.stackId.toString()]] = element;

			BX.adjust(node, { attrs: attributes });

			return rand;
		},
		removeNodeFromStackById: function(id) {
			if (this.stack.hasOwnProperty(id))
			{
				this.stack[id].removeAttribute(this.attributes.stackId);
				delete this.stack[id];
				return true;
			}

			return false;
		},
		init: function(params) {
			if (this.isInitialized)
			{
				return false;
			}

			if (BX.type.isElementNode(params.nodes.header))
			{
				this.isInitialized = true;
				this.nodes.header = params.nodes.header;

				this.addNodeToStack(this.nodes.header);
				this.bindEvents();

				BX.SB.B24Manager.Template.Header.Menu.init({
					manager: this,
				});
			}
		}
	};

	BX.SB.B24Manager.Template.Header.Menu = {
		isInitialized: false,
		isOpened: false,
		timeoutId: null,
		animation: {
			duration: 160,
		},
		nodes: {
			header: null,
			switch: null,
			section: null,
			ruler: null,
		},
		attributes: {
			switch: 'data-bx-header-switch',
			section: 'data-bx-header-slide-section',
			ruler: 'data-bx-header-slide-section-ruler',
		},
		manager: null,
		getElementHeight: function(node) {
			return BX.height(node);
		},
		setElementHeight: function(node, value) {
			BX.height(node, value);
		},
		onAnimatorFinish: function() {
			let _this = this;

			if (!!_this.timeoutId)
			{
				clearTimeout(_this.timeoutId);
			}

			_this.timeoutId = setTimeout(_this.manager.refreshEvent(), 200);
		},
		animator: function(start, finish) {
			(new BX.easing({
				duration: this.animation.duration,
				start: { height: start },
				finish: { height: finish },
				transition: BX.easing.makeEaseInOut(BX.easing.transitions.quart),
				step: BX.delegate(function(state) {
					this.nodes.section.style.height = state.height + 'px';
				}, this),
				complete: BX.delegate(function() {
					this.onAnimatorFinish();
				}, this)
			})).animate();
		},
		addClass: function(node, value) {
			if (!BX.type.isArray(node))
			{
				node = [node];
			}

			node.forEach(function(element, i, node) {
				BX.addClass(element, value);
			});
		},
		removeClass: function(node, value) {
			if (!BX.type.isArray(node))
			{
				node = [node];
			}

			node.forEach(function(element, i, node) {
				BX.removeClass(element, value);
			});
		},
		open: function() {
			this.isOpened = true;

			this.addClass([this.nodes.switch, this.nodes.section], 'active');
			this.animator(0, this.getElementHeight(this.nodes.ruler));

			BX.bind(window, 'click', BX.proxy(this.closeHandler, this));
			BX.bind(window, 'resize', BX.proxy(this.resizeHandler, this));
		},
		close: function() {
			this.isOpened = false;

			this.removeClass([this.nodes.switch, this.nodes.section], 'active');
			this.animator(this.getElementHeight(this.nodes.ruler), 0);

			BX.unbind(window, 'click', BX.proxy(this.closeHandler, this));
			BX.unbind(window, 'resize', BX.proxy(this.resizeHandler, this));
		},
		resizeHandler: function() {
			this.setElementHeight(this.nodes.section, this.getElementHeight(this.nodes.ruler));
		},
		closeHandler: function(e) {
			e = e || document.event;

			if (!this.nodes.header.contains(e.target))
			{
				this.close();
			}
		},
		toggleHandler: function() {
			if (this.isOpened)
			{
				this.close();
			}
			else
			{
				this.open();
			}
		},
		init: function(params) {
			if (this.isInitialized)
			{
				return;
			}

			this.manager = params.manager;

			if (!BX.type.isElementNode(this.manager.nodes.header))
			{
				return;
			}

			this.nodes.header = this.manager.nodes.header;
			this.nodes.switch = this.nodes.header.querySelector('[' + this.attributes.switch + ']');
			this.nodes.section = this.nodes.header.querySelector('[' + this.attributes.section + ']');
			this.nodes.ruler = this.nodes.header.querySelector('[' + this.attributes.ruler + ']');

			BX.bind(this.nodes.switch, 'click', BX.proxy(this.toggleHandler, this));
		}
	};

	BX.ready(function() {
		BX.SB.B24Manager.Template.Header.init({
			nodes: {
				header: document.querySelector('.js-header-stick-section')
			}
		});
	});
})();