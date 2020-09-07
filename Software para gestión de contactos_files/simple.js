function BXSlideMenu(params)
{
	this.isInit = false;
	this.isOpen = false;
	this.nodes = {
		section: null,
		header: null,
		list: null,
	};

	this.init(params);
}

// data-bx-slide-menu-section-list

BXSlideMenu.prototype.init = function(params) {
	if (this.isInit)
	{
		return;
	}

	if (BX.type.isElementNode(params.menuNode))
	{
		let section = params.menuNode.querySelectorAll('[data-bx-slide-menu-section]');

		for (let i = 0; i < section.length; i++)
		{
			let item = section[i],
				header = item.querySelector('[data-bx-slide-menu-header]');

			BX.bind(header, 'click', function() {
				BX.toggleClass(item, 'active');
			})
		}
	}
};

BX.ready(function() {
	let section = document.querySelectorAll('.js-slide-menu-section');
	
	for (let i = 0; i < section.length; i++)
	{
		(new BXSlideMenu({
			menuNode: section[i]
		}));
	}
});