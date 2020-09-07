;(function() {
	'use strict';

	BX.namespace('BX.SB.Portal');

	if (BX.SB.Portal.Authorization)
	{
		return;
	}

	BX.SB.Portal.Authorization = {
		/** @var {Object} **/
		_window: window,
		/** @var {String} **/
		_path: '/auth/',
		/**
		 * @return {Object}
		 * @api private
		 */
		getWindowSize: function() {
			let width = 1114;
			let height = 830;

			return {
				width: window.innerWidth < width ? window.innerWidth : width,
				height: window.innerHeight < height ? window.innerHeight : height,
			};
		},
		/**
		 * @param {String} url
		 * @param {Object} params
		 * @return {String}
		 * @api private
		 */
		addUrlParams: function(url, params) {
			url = url || this._path;
			params = params || {};

			return BX.util.add_url_param(url, params);
		},
		/**
		 * @param {Object} params
		 * @api public
		 */
		authorize: function(params) {
			params = params || {};

			let url = this._path;
			let size = this.getWindowSize();

			BX.util.popup(this.addUrlParams(url, params), size.width, size.height);
		},
	};
})();