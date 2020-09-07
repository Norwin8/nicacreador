function SocialShareList(params)
{
	this.data = {};
	this.data.post = {
		title: params.data.post.title || document.title,
		host: params.data.post.host ||  window.location.hostname,
		url: params.data.post.url ||  window.location.href,
	};
	this.data.patterns = params.data.patterns || {};
	this.data.replace = {
		title: /#POST_TITLE#/g,
		host: /#HOST_NAME#/g,
		url: /#POST_URL#/g,
	};

	this.nodes = {};
	this.classes = {
		list: params.listClass
	};

	this.prepare();
}

SocialShareList.prototype.share = function(id) {
	if (this.data.patterns[id])
	{
		window.open(
			this.data.patterns[id],
			'',
			'width=620,height=430,resizable=yes,scrollbars=no,status=yes'
		);
	}
};

SocialShareList.prototype.init = function() {
	let list = document.querySelectorAll('.' + this.classes.list);

	for (let id in list)
	{
		if (BX.type.isElementNode(list[id]) && !BX.hasClass(list[id], 'bx-inited'))
		{
			let _this = this,
				item = list[id].querySelectorAll('[data-bx-social-share-item]');

			BX.addClass(list[id], 'bx-inited');

			for (let i = 0; i < item.length; i++)
			{
				BX.bind(item[i], 'click', function() {
					_this.share(this.dataset['socialId']);
				});
			}
		}
	}
};

SocialShareList.prototype.prepare = function() {
	let _this = this;

	if (this.data.patterns)
	{
		for (let pattern in _this.data.patterns)
		{
			for (let replace in _this.data.replace)
			{
				_this.data.patterns[pattern] = _this.data.patterns[pattern].replace(_this.data.replace[replace], _this.data.post[replace]);
			}
		}

		if (_this.classes.list)
		{
			this.init();
		}
	}
};