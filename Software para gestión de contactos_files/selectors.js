/*
* version 0.1.1
* */

function SelectorManagerList(params)
{
	this.manager = params.manager;
	this.select = params.select;

	this.init();
}

SelectorManagerList.prototype = {
	appendCurrentItem: function()
	{
		//пока нет мультисписка
		this.select.phantom.selected.innerText = this.select.data.current[0].text;
	},
	buildSelectList: function()
	{
		//пока нет фильтрации и поиска
		BX.append(this.select.data.tree.node, this.select.phantom.list);
	},
	init: function()
	{
		this.manager.appendCurrentItem = BX.proxy(this.appendCurrentItem, this);

		this.buildSelectList();
		this.manager.appendCurrentItem();
	}
};

function SelectorManager(params)
{
	let defaultParams = {
		closeOnSelect: true,
		containerListCssClass: '',
		containerSelectCssClass: '',
		data: {},
		disabled: false,
		dropdownCssClass: '',
		dropdownParent: null,
		multiple: false,
		placeholder: null,
		selectOnClose: false
	};

	this.params = BX.mergeEx({}, defaultParams, params) || {};

	this.manager = {};
	this.select = {
		phantom: {}
	};

	this.select.isOpen = false;

	this.init();
}

SelectorManager.prototype = {
	cleanString: function(str, charlist)
	{
		charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
		var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
		return str.replace(re, '');
	},
	isObjEmpty: function(obj)
	{
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}

		return JSON.stringify(obj) === JSON.stringify({});
	},
	isItem: function(node)
	{
		return (node.tagName === 'OPTION' || node.getAttribute('type') === 'item');
	},
	isGroup: function(node)
	{
		return (node.tagName === 'OPTGROUP' || node.getAttribute('type') === 'group');
	},
	isRootNode: function(node)
	{
		return node === this.params.node;
	},
	getUniqueId: function()
	{
		return '_' + Math.random().toString(36).substr(2, 9);
	},
	onSelect: function()
	{
		this.manager.appendCurrentItem();

		if (this.params.closeOnSelect)
		{
			this.closeSelectList();
		}
	},
	onOpen: function()
	{

	},
	onResize: function()
	{

	},
	getSelectMinWidth:function()
	{
		let minWidth = BX.width(this.select.data.items[0].node);
		for (let i = 0; i < this.select.data.items.length; i++)
		{
			minWidth = minWidth < BX.width(this.select.data.items[i].node) ?
				BX.width(this.select.data.items[i].node) : minWidth;
		}

		return minWidth;
	},
	getSelectPosition: function()
	{
		return BX.pos(this.select.phantom.node);
	},
	recalcSelectList: function()
	{
		let selectPosition = this.getSelectPosition();
		BX.style(this.select.phantom.listOuter, 'width', this.select.phantom.node.offsetWidth + 'px');
		BX.style(this.select.phantom.listOuter, 'top', this.select.phantom.node.offsetHeight + selectPosition.top + 'px');
		BX.style(this.select.phantom.listOuter, 'left', selectPosition.left + 'px');
	},
	recalcSelectVision: function()
	{
		let minWidth = this.getSelectMinWidth();
		BX.style(this.select.phantom.selected, 'width', minWidth + 'px' || BX.width(this.select.phantom.node.parentNode) + 'px');
	},
	chooseSelectItem: function()
	{
		this.SelectorManager.select.data.current = [this];
		BX.onCustomEvent(this.SelectorManager, 'onSelect');
	},
	closeSelectListHandler: function(e)
	{
		e = e || window.event;
		if (!this.select.phantom.node.contains(e.target))
		{
			this.closeSelectList(e);
		}
	},
	closeSelectList: function(e)
	{
		e = e || window.event;
		if(!this.select.phantom.listOuter.contains(e.target) || this.params.closeOnSelect)
		{
			BX.removeClass(this.select.phantom.node, 'is-open');
			BX.removeClass(this.select.phantom.listOuter, 'is-open');
			this.select.phantom.listOuter.style.height = 0;
			this.select.isOpen = false;
			BX.unbind(document, 'click', BX.delegate(this.closeSelectListHandler, this));
			BX.unbind(document, 'scroll', BX.delegate(this.recalcSelectList, this));
		}
	},
	openSelectList: function()
	{
		this.recalcSelectList();
		BX.bind(document, 'scroll', BX.delegate(this.recalcSelectList, this));

		BX.addClass(this.select.phantom.node, 'is-open');
		BX.addClass(this.select.phantom.listOuter, 'is-open');

		this.select.phantom.listOuter.style.height = this.select.phantom.listInner.offsetHeight + 'px';
		this.select.isOpen = true;

		BX.bind(document, 'click', BX.delegate(this.closeSelectListHandler, this));
	},
	toggleSelectList: function()
	{
		if (!this.select.isOpen)
		{
			this.openSelectList();
		}
		else
		{
			this.closeSelectList();
		}
	},
	getOptionContent: function(node)
	{
		if (this.isRootNode(node))
			return '';
		else
			return this.cleanString(this.isGroup(node) ? node.getAttribute('label') || '' : node.innerHTML || '');
	},
	initNode: function()
	{
		this.getSelectData();
		BX.removeClass(this.params.node, 'initialization');

		this.select.phantom.list = BX.create('div', {
			props: {
				className: 'bxst-select-phantom-list'
			},
		});

		this.select.phantom.listInner = BX.create('div', {
			props: {
				className: 'bxst-select-phantom-list-inner'
			},
			children: [this.select.phantom.list]
		});

		this.select.phantom.listOuter = BX.create('div', {
			props: {
				className: 'bxst-select-phantom-list-outer' +
				(this.params.containerListCssClass ? ' ' + this.params.containerListCssClass : '') +
				(this.params.dropdownCssClass ? ' ' + this.params.dropdownCssClass : '')
			},
			children: [this.select.phantom.listInner]
		});

		this.select.phantom.selected = BX.create('div', {
			props: {
				className: 'bxst-select-phantom-choosed'
			},
		});

		this.select.phantom.body = BX.create('div', {
			props: {
				className: 'bxst-select-phantom-body'
			},
			children: [this.select.phantom.selected]
		});

		this.select.phantom.node = BX.create('div', {
			props: {
				className: this.params.node.className + ' bxst-select-phantom' +
				(this.params.containerSelectCssClass ? ' ' + this.params.containerSelectCssClass : '')
			},
			children: [this.select.phantom.body]
		});

		this.params.node.style.display = 'none';
		BX.insertAfter(this.select.phantom.node, this.params.node);
		BX.append(this.params.node, this.select.phantom.node);
		BX.append(this.select.phantom.listOuter, document.body);

		if (
			this.params.dropdownParent !== null &&
			BX.type.isElementNode(this.params.dropdownParent) &&
			BX.isParentForNode(this.params.dropdownParent, this.params.node)
		)
		{
			BX.append(this.select.phantom.node, this.params.dropdownParent);
		}

		BX.addClass(this.select.phantom.node, 'initialized');

		this.manager.list = new SelectorManagerList(this);

		this.recalcSelectVision();
		BX.bind(document.body, 'resize', BX.delegate(this.recalcSelectVision, this));
		BX.bind(this.select.phantom.node, 'click', BX.delegate(this.toggleSelectList, this));
	},
	getSelectNodeData: function(node)
	{
		if (this.isRootNode(node) || this.isGroup(node) || this.isItem(node))
		{
			let children = [];
			for (let i = 0; i < node.children.length; i++)
			{
				if (this.isGroup(node.children[i]) || this.isItem(node.children[i]))
				{
					children.push(this.getSelectNodeData(node.children[i]));
				}
			}

			let obj = {
				selected: node.getAttribute('selected') || node.selected ? true : false,
				content: this.getOptionContent(node),
				type: this.isItem(node) ? 'item' : 'group',
				children: children,
				parent: {},
				dataset: node.dataset,
				SelectorManager: this
			};

			if (this.isItem(node))
			{
				obj.text = this.cleanString(node.textContent || node.innerText);
			}

			return obj;
		}

		return false;
	},
	rebuildSelectData: function(obj, parent)
	{
		let children = [];
		for (let i = 0; i < obj.children.length; i++)
		{
			children.push(this.rebuildSelectData(obj.children[i], obj));
		}

		if (typeof parent !== 'undefined')
		{
			obj.parent = parent;
		}

		if (BX.type.isNotEmptyString(obj.content))
		{
			children.unshift(BX.create('div', {
				props: {
					className: 'bxst-select-phantom-' + obj.type + '-title'
				},
				html: obj.content
			}));
		}

		let nodeClassName = obj.type == 'item' ? 'bxst-select-phantom-item' : 'bxst-select-phantom-group';
		obj.node = BX.create('div', {
			props: {
				className: obj.selected ? nodeClassName + ' selected' : nodeClassName
			},
			html: obj.type == 'item' ? obj.content : null,
			children: children
		});

		if (obj.type == 'item')
			this.select.data.items.push(obj);
		else if (obj.type == 'group')
			this.select.data.groups.push(obj);

		if (obj.selected)
			this.select.data.current.push(obj);

		if (obj.type == 'item')
			BX.bind(obj.node, 'click', BX.delegate(this.chooseSelectItem, obj));

		return obj.node;
	},
	getSelectData: function()
	{
		this.select.data = {
			tree: [],
			items: [],
			groups: [],
			current: [],
		};

		this.select.data.tree = this.params.data.length > 0 ? []/*this.getObjListData(this.params.node)*/ : this.getSelectNodeData(this.params.node);

		if (!this.isObjEmpty(this.select.data.tree))
		{
			this.rebuildSelectData(this.select.data.tree);

			if (this.select.data.current.length === 0)
			{
				this.select.data.current.push(this.select.data.items[0]);
			}
		}
	},
	init: function()
	{
		if (BX.type.isElementNode(this.params.node) && !BX.hasClass(this.params.node, 'initialized') && !BX.hasClass(this.params.node, 'initialization'))
		{
			BX.addClass(this.params.node, 'initialization');

			this.manager.isObjEmpty = BX.proxy(this.isObjEmpty, this);
			this.manager.isItem = BX.proxy(this.isItem, this);
			this.manager.isGroup = BX.proxy(this.isGroup, this);
			this.manager.isRootNode = BX.proxy(this.isRootNode, this);

			this.initNode();

			if (this.params.events)
			{
				for (let eventName in this.params.events)
				{
					BX.addCustomEvent(this, eventName, this.params.events[eventName]);
				}
			}

			BX.addCustomEvent(this, 'onSelect', this.onSelect);
		}
	}
};

BX.ready(function()
{
	// BX.onCustomEvent(window, 'onSelectorManagerLibraryLoaded');
	/*let selectors = document.querySelectorAll('.js-select-init');

	for (let i = 0; selectors.length > i; i++)
	{
		let params = BX.mergeEx({}, selectors[i].dataset);
		params.node = selectors[i];
		(new SelectorManager(params));
	}*/
});
