/*
* version 0.1.0
* */

//YouTube Video Controller
var youtubeScriptTag = document.createElement('script'),
	youtubeFindFirstScriptTag = document.getElementsByTagName('script')[0],
	youtubePlayers;

youtubeScriptTag.src = 'https://www.youtube.com/iframe_api';
youtubeFindFirstScriptTag.parentNode.insertBefore(youtubeScriptTag, youtubeFindFirstScriptTag);
//#YouTube Video Controller


window.YoutubeGlobalVideoManager = {
	isYTAPIInit: false,
	videoList: {},
	autoInit: [],
	defaultVideoParams: {
		autoplay: 0,
		cc_load_policy: 0,
		color: 'white',
		controls: 1,
		disablekb: 1,
		fs: 1,
		iv_load_policy: 3,
		loop: 0,
		modestbranding: 1,
		rel: 0,
		showinfo: 0,
		mute: 0,
		enablejsapi: 1,
	},
	videoInlineParamsMap: {
		'youtubeVideoAutoplay': {'key': 'autoplay', 'type': 'int'},
		'youtubeVideoCcLoadPolicy': {'key': 'cc_load_policy', 'type': 'int'},
		'youtubeVideoColor': {'key': 'color', 'type': 'string'},
		'youtubeVideoControls': {'key': 'controls', 'type': 'int'},
		'youtubeVideoDisableKb': {'key': 'disablekb', 'type': 'int'},
		'youtubeVideoEnableJsApi': {'key': 'enablejsapi', 'type': 'int'},
		'youtubeVideoEnd': {'key': 'end', 'type': 'int'},
		'youtubeVideoFs': {'key': 'fs', 'type': 'int'},
		'youtubeVideoHl': {'key': 'hl', 'type': 'string'},
		'youtubeVideoIvLoadPolicy': {'key': 'iv_load_policy', 'type': 'int'},
		'youtubeVideoList': {'key': 'list', 'type': 'string'},
		'youtubeVideoListType': {'key': 'listType', 'type': 'string'},
		'youtubeVideoLoop': {'key': 'loop', 'type': 'int'},
		'youtubeVideoModestbranding': {'key': 'modestbranding', 'type': 'int'},
		'youtubeVideoOrigin': {'key': 'origin', 'type': 'string'},
		'youtubeVideoPlaylist': {'key': 'playlist', 'type': 'string'},
		'youtubeVideoPlaysinline': {'key': 'playsinline', 'type': 'string'},
		'youtubeVideoRel': {'key': 'rel', 'type': 'int'},
		'youtubeVideoShowinfo': {'key': 'showinfo', 'type': 'int'},
		'youtubeVideoStart': {'key': 'start', 'type': 'int'},
		'youtubeVideoMute': {'key': 'mute', 'type': 'int'},
	},
	init: function()
	{
		this.isYTAPIInit = true;

		for (let i = 0; i < this.autoInit.length; i++)
		{
			this.autoInit[i].manager.initManager();
		}
	}
};

function onYouTubeIframeAPIReady()
{
	window.YoutubeGlobalVideoManager.init();
}

window.YoutubePopupManager = function(params)
{
	this.manager = params;
	this.initManager();
}

window.YoutubePopupManager.prototype = {
	onPopupShow: function()
	{
		if (!this.manager.isYTInit)
		{
			this.manager.initVideoPlayer(this.manager.params.popup.content);
		}
		else
		{
			this.manager.video.player.playVideo();
		}
	},
	onPopupClose: function()
	{
		if (this.manager.isYTInit)
		{
			this.manager.video.player.pauseVideo();
		}
	},
	initPopup: function()
	{
		if (!this.manager.popup)
		{
			this.manager.popup = {};
			this.manager.params.popup.content = BX.create('div');
			this.manager.popup.window = BX.PopupWindowManager.create(this.manager.uniqueId, null, this.manager.params.popup);
			BX.addCustomEvent(this.manager.popup.window, 'onPopupShow', BX.delegate(this.onPopupShow, this));
			BX.addCustomEvent(this.manager.popup.window, 'onPopupClose', BX.delegate(this.onPopupClose, this));
		}

		this.manager.popup.window.show();
	},
	initManager: function()
	{
		BX.bind(this.manager.params.node, 'click', BX.delegate(this.initPopup, this));
	}
};

window.YoutubeVideoManager = function(params)
{
	this.manager = {
		global: window.YoutubeGlobalVideoManager,
		params: params || {},
		isYTInit: false,
		video: {}
	};

	this.manager.initManager = BX.proxy(this.initManager, this);
	this.initParams();
}

YoutubeVideoManager.prototype = {
	getInlineNodeParams: function() {
		let global = this.manager.global;
		let videoInlineParamsMap = global.videoInlineParamsMap;
		let nodeDataSet = this.manager.params.node.dataset;
		let nodeDataSetKeys = Object.keys(nodeDataSet);
		let defaultParams = global.defaultVideoParams;
		let params = {};

		for (let i = 0; i < nodeDataSetKeys.length; i++)
		{
			if (videoInlineParamsMap.hasOwnProperty(nodeDataSetKeys[i]))
			{
				params[videoInlineParamsMap[nodeDataSetKeys[i]].key] = videoInlineParamsMap[nodeDataSetKeys[i]].type === 'int' ?
					parseInt(nodeDataSet[nodeDataSetKeys[i]]) : nodeDataSet[nodeDataSetKeys[i]];
			}
		}

		this.manager.params.video = BX.mergeEx({}, defaultParams, this.manager.params.video, params);
	},
	prepareVideoParams: function() {
		this.getInlineNodeParams();
	},
	prepareParams: function() {
		// get video id
		this.manager.params.videoId = BX.type.isNotEmptyString(this.manager.params.videoId) ?
			this.manager.params.videoId : this.manager.params.node.dataset.youtubeVideoId;

		// prapare video params
		this.prepareVideoParams();
	},
	getUniqueRandId: function(str)
	{
		if (str)
			return str + '_' + Math.random().toString(36).substr(2, 9);
		else
			return Math.random().toString(36).substr(2, 9);
	},
	isInViewport: function(el)
	{
		if (BX.type.isElementNode(el) && !BX.isNodeHidden(el))
		{
			let pos = BX.pos(el);

			return (
				(pos.top - (window.innerHeight || document.documentElement.clientHeight)) <= (window.pageYOffset || document.documentElement.scrollTop) &&
				(pos.top + el.offsetHeight) >= (window.pageYOffset || document.documentElement.scrollTop)
			);
		}

		return false;
	},
	checkViewArea: function()
	{
		if (this.manager.timeoutId)
			clearTimeout(this.manager.timeoutId);

		let _this = this;
		this.manager.timeoutId = setTimeout(function()
		{
			if (_this.isInViewport(_this.manager.video.player.f))
			{
				BX.onCustomEvent(_this, 'playYTVideo');
				// _this.manager.video.player.playVideo();
			}
			else
			{
				BX.onCustomEvent(_this, 'pauseYTVideo');
				// _this.manager.video.player.pauseVideo();
			}

		}, 200);
	},
	onInited: function()
	{

	},
	onLoad: function()
	{

	},
	onScroll: function()
	{

	},
	onPlayerView: function()
	{

	},
	onPlayerLoad: function()
	{

	},
	onYTPlayerVideoEnd: function()
	{

	},
	onYTPlayerVideoChange: function(event)
	{
		switch (event.data)
		{
			case -1:
				//video not started (first plaing)
				BX.onCustomEvent(this, 'onYTPlayerVideoFirstPlay');
				break;
			case 0:
				//video ended
				BX.onCustomEvent(this, 'onYTPlayerVideoEnd');
				break;
			case 1:
				//video started
				BX.onCustomEvent(this, 'onYTPlayerVideoPlay');
				break;
			case 2:
				//pause
				BX.onCustomEvent(this, 'onYTPlayerVideoPause');
				break;
			case 3:
				//buffering
				BX.onCustomEvent(this, 'onYTPlayerVideoBuffering');
				break;
			case 5:
				//replics
				BX.onCustomEvent(this, 'onYTPlayerVideoReplics');
				break;
		}
	},
	pauseVideo: function()
	{
		this.manager.video.player.pauseVideo();
	},
	playVideo: function()
	{
		this.manager.video.player.playVideo();
		/*if (!BX.isNodeHidden(this.manager.video.player.f))
		{

		}*/
	},
	stopVideo: function()
	{
		this.manager.video.player.stopVideo();
	},
	onPlayerReady: function()
	{
		this.manager.isYTInit = true;

		BX.addCustomEvent(this, 'playYTVideo', BX.delegate(this.playVideo, this));
		BX.addCustomEvent(this, 'pauseYTVideo', BX.delegate(this.pauseVideo, this));
		BX.addCustomEvent(this, 'stopYTVideo', BX.delegate(this.stopVideo, this));
		BX.addCustomEvent(this, 'onYTPlayerInited', BX.delegate(this.onInited, this));

		if (this.manager.params.events)
		{
			for (let eventName in this.manager.params.events)
			{
				BX.addCustomEvent(this, eventName, this.manager.params.events[eventName]);
			}
		}

//events
		switch (this.manager.params.videoStartEvent)
		{
			case 'onYTPlayerView':
				this.manager.timeoutId = null;
				BX.bind(window, 'scroll', BX.delegate(this.checkViewArea, this));
				this.checkViewArea();
				break;

			case 'onYTPlayerLoad':
				BX.onCustomEvent(this, 'playYTVideo');
				break;

			default:
				if (this.manager.params.videoStartEvent)
				{
					BX.addCustomEvent(this, this.manager.params.videoStartEvent, function()
					{
						BX.onCustomEvent(this, 'playYTVideo');
					});
				}
				break;
		}

		BX.onCustomEvent(this, 'onYTPlayerInited');
	},
	initVideoPlayer: function(node)
	{
		if (!this.manager.isYTInit)
		{
			let video = {
				id: this.manager.params.videoId
			};

			if (BX.type.isNotEmptyString(video.id))
			{
				video.node = BX.create('div', {props: {id: video.id + '_' + this.manager.uniqueId, className: 'bxst-youtube-video-player'}});
				video.parentNode = BX.create('div', {props: {className: 'bxst-youtube-video-player-body'}, children: [video.node]});
				BX.append(video.parentNode, node || this.manager.params.node);
				video.player = new YT.Player(video.node, {
					height: false,
					width: false,
					videoId: video.id,
					playerVars: this.manager.params.video,
					events: {
						'onReady': BX.delegate(this.onPlayerReady, this),
						'onStateChange': BX.delegate(this.onYTPlayerVideoChange, this),
					}
				});
				video.self = this;

				this.manager.global.videoList[this.manager.uniqueId] = this.manager.video = video;
			}
		}
	},
	initManager: function()
	{
		if (this.manager.global.isYTAPIInit)
		{
			this.manager.initVideoPlayer = BX.proxy(this.initVideoPlayer, this);

			switch (this.manager.params.playerType)
			{
				case 'popup':
					this.manager.video.YoutubePopupManager = new YoutubePopupManager(this.manager);
					break;

				default:
					this.manager.initVideoPlayer();
					break;
			}
		}
		else
		{
			this.manager.global.autoInit.push(this);
		}
	},
	initParams: function()
	{
		if (BX.type.isElementNode(this.manager.params.node))
		{
			this.prepareParams();
			this.manager.uniqueId = 'video_' + this.getUniqueRandId();
			this.manager.initManager();
		}
	}
};