;(function() {
	'use strict'

	function HeaderShareAreaWindowInit()
	{
		this.initialized = {
			share: false,
		};

		this.params = {
			disableOverlay: false,
			showPreloader: false,
			classes: {},
		};

		this.nodes = {
			section: null,
			button: null,
			content: null,
		};

		this.attributes = {
			initialized: 'data-header-share-area-window-initialized',
			section: 'data-header-share-area-window-section',
			button: 'data-header-share-area-window-button',
			content: 'data-header-share-area-window-content',
			popup: 'data-header-share-area-window-popup',
			json: 'data-json',
			social: 'data-social-network',
		};

		this.classes = {
			popup: 'header-share-area-window',
		};

		this.popup = null;

		this.init();
	}

	HeaderShareAreaWindowInit.prototype = {
		copyUri: function() {
			let uri = window.location.href;
			let phantom = document.createElement('input');

			phantom.value = uri;

			document.body.appendChild(phantom);
			phantom.select();
			document.execCommand('copy');
			document.body.removeChild(phantom);
		},
		share: function(uri) {
			if (uri.toString().length > 0)
			{
				window.open(
					uri,
					'',
					'width=620,height=430,resizable=yes,scrollbars=no,status=yes'
				);
			}
		},
		executeShare: function() {
			if (this.initialized.share)
			{
				return;
			}

			if (!this.nodes.section.hasAttribute(this.attributes.json))
			{
				return;
			}

			let json = this.nodes.section.getAttribute(this.attributes.json);

			json = BX.parseJSON(json) || {}

			if (!BX.type.isNotEmptyObject(json))
			{
				return;
			}

			let list = this.popup.getNodes().popup.querySelectorAll('[' + this.attributes.social + ']');

			let _this = this;
			for (let i = 0; i < list.length; i++)
			{
				let item = list[i];
				BX.bind(item, 'click', function() {
					let id = this.getAttribute(_this.attributes.social);
					switch (id)
					{
						case 'lk':
							_this.copyUri();
							break;

						case 'em':
							window.location.href = json[id];
							break;

						default:
							_this.share(json[id]);
							break;
					}
				});
			}

			this.initialized.share = true;
		},
		init: function() {
			let section = document.querySelector('[' + this.attributes.section + ']');

			if (!BX.type.isElementNode(section))
			{
				return;
			}

			this.nodes.section = section;

			if (this.nodes.section.hasAttribute(this.attributes.initialized))
			{
				return;
			}

			let button = this.nodes.section.querySelector('[' + this.attributes.button + ']');
			let content = this.nodes.section.querySelector('[' + this.attributes.content + ']');

			if (!BX.type.isElementNode(button) || !BX.type.isElementNode(content))
			{
				return;
			}

			this.nodes.button = button;
			this.nodes.content = content;

			this.params.content = this.nodes.content;

			if (typeof BX.SB.Popup.Window == 'undefined')
			{
				return;
			}

			this.popup = new BX.SB.Popup.Window(this.params);

			if (!BX.type.isNotEmptyObject(this.popup))
			{
				return;
			}

			this.popup.updateParams({
				classes: {
					popup: this.popup.getParams().classes.popup + ' ' + this.classes.popup,
				},
			});

			let _this = this;
			BX.bind(_this.nodes.button, 'click', function() {
				_this.popup.setInitialClickEvent();
				_this.popup.open();

				_this.executeShare();
			});

			this.nodes.section.setAttribute(this.attributes.initialized, '');
		}
	};

	if (window.frameCacheVars !== undefined)
	{
		BX.addCustomEvent('onFrameDataReceived', function() {
			(new HeaderShareAreaWindowInit());
		});
	}
	else
	{
		BX.ready(function() {
			(new HeaderShareAreaWindowInit());
		});
	}
})();