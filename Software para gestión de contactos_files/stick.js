function BXStickSection(params)
{
	this.headerManager = BX.SB.B24Manager.Template.Header || {};
	this.isStick = false;
	this.stickId = null;
	this.timeoutId = null;
	this.useCustomTop = params.useCustomTop === true;
	this.useCustomHeight = params.useCustomHeight === true;
	this.nodes = {
		section: null,
		outer: null,
		close: null
	};

	if (!BX.type.isNotEmptyObject(this.headerManager))
	{
		return;
	}

	if (!BX.type.isElementNode(params.section))
	{
		return;
	}

	this.nodes.section = params.section;
	this.nodes.outer = this.nodes.section.querySelector('[bx-data-stick-outer]') || this.nodes.section;
	this.nodes.close = this.nodes.section.querySelector('[bx-data-stick-close]') || null;

	this.init();
}

BXStickSection.prototype.initEvent = function() {
	BX.bind(window, 'scroll', BX.proxy(this.scrollHandler, this));
	BX.bind(window, 'resize', BX.proxy(this.resizeHandler, this));

	BX.addCustomEvent(this.headerManager, this.headerManager.events.refresh.name, BX.proxy(this.lockSection, this));

	if (this.nodes.close)
	{
		BX.bind(this.nodes.close, 'click', BX.proxy(this.destroy, this));
	}
};

BXStickSection.prototype.destroy = function() {
	this.unstick();
	BX.unbind(window, 'scroll', BX.proxy(this.scrollHandler, this));
	BX.unbind(window, 'resize', BX.proxy(this.resizeHandler, this));
	BX.removeCustomEvent(this.headerManager, this.headerManager.events.refresh.name, BX.proxy(this.lockSection, this));
};

BXStickSection.prototype.lockSection = function() {
	if (!this.useCustomTop)
	{
		BX.adjust(this.nodes.outer, {
			style: {
				top: this.headerManager.getStackHeight(this.stickId) + 'px'
			}
		});
	}
};

BXStickSection.prototype.unlockSection = function() {
	if (!this.useCustomTop)
	{
		this.nodes.outer.style.removeProperty('top');
	}
};

BXStickSection.prototype.stick = function() {
	if (!this.isStick)
	{
		if (!this.useCustomHeight)
		{
			let sectionHeight = this.nodes.section.offsetHeight;

			BX.adjust(this.nodes.section, {
				style: {
					height: sectionHeight + 'px'
				}
			});
		}

		this.lockSection();

		BX.addClass(this.nodes.section, 'bxst-sticked');

		this.stickId = this.headerManager.addNodeToStack(this.nodes.outer);
		this.isStick = true;
	}
};

BXStickSection.prototype.unstick = function() {
	BX.removeClass(this.nodes.section, 'bxst-sticked');

	this.unlockSection();

	this.nodes.section.style.removeProperty('height');
	this.headerManager.removeNodeFromStackById(this.stickId);
	this.isStick = false;
};

BXStickSection.prototype.needStick = function() {
	let sectionPosition = BX.pos(this.nodes.section),
		windowScrollPosition = BX.GetWindowScrollPos(),
		actualTopPosition = this.headerManager.getStackHeight() || 0;

	return (this.isStick ? sectionPosition.bottom : sectionPosition.top) <= (windowScrollPosition.scrollTop + actualTopPosition);
};

BXStickSection.prototype.scrollHandler = function() {
	if (this.needStick())
	{
		this.stick();
	}
	else if (this.isStick)
	{
		this.unstick();
	}
};

BXStickSection.prototype.resizeHandler = function() {
	let _this = this;

	if (!!_this.timeoutId)
	{
		clearTimeout(_this.timeoutId);
	}

	_this.timeoutId = setTimeout(function() {
		BX.onCustomEvent(_this.headerManager, _this.headerManager.events.refresh.name);
		_this.scrollHandler();
	}, 200);
};

BXStickSection.prototype.init = function() {
	this.initEvent();
};

BX.ready(function() {
	let section = document.querySelectorAll('.js-stick-section');

	for (let i = 0; i < section.length; i++)
	{
		(new BXStickSection({
			section: section[i]
		}));
	}
});