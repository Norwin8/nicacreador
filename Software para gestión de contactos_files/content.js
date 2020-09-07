BX.ready(function()
{
	let headerStickSection = document.querySelector('.js-header-stick-section');

	/*------[1]------*/
	//Animation Init
	AOSAA.init();

	/*------[2]------*/
	//Price Table Slider
	$('.js-prices-table').each(function()
	{
		var $table = $(this).children(),
			$tableBody = $($table).find('.js-prices-table-body'),
			$tableBodyChildren = $tableBody.children('.bxst-prices-table-item'),
			$tableBodyChildrenCount = $tableBodyChildren.length,
			$hover = $('<span class="i-hover"></span>').appendTo($(this)),
			$elementNum = -1;

		$firstPosition = $tableBodyChildren.first().position();
		$($hover).css({ 'left': $firstPosition.left });

		$tableBodyChildren.on({
			mouseenter: function()
			{
				$elementNum = $(this).index() + 1;
				$elementInnerWidth = $(this).innerWidth();
				$elementOuterWidth = $(this).outerWidth(true);
				$elementPosition = $(this).position();

				$($hover).css({ 'width': $elementOuterWidth, 'left': $elementPosition.left });
				$($hover).css({ 'opacity': 1 });
			},
			mouseleave: function(e)
			{
				$($hover).css({ 'opacity': 0 });
			}
		});
	});

	$('.js-prices-table-section').each(function()
	{
		var $this = $(this),
			$left = $($this).find('.js-prices-table-next'),
			$right = $($this).find('.js-prices-table-prew'),
			$table = $this.children(),
			$tableBody = $($table).find('.js-prices-table-body'),
			$tableBodyChildren = $($tableBody[0]).children('[data-prices-table-section-item]'),
			$tableBodyChildrenCount = $tableBodyChildren.length;

		$left.on({
			click: function() {
				let width = $tableBodyChildren[0].offsetWidth,
					scrollLeft = $this.scrollLeft(),
					scrollTo = (scrollLeft - width) < 0 ? 0 : (scrollLeft - width);

				$this.animate({scrollLeft:scrollTo}, 160);
			}
		});

		$right.on({
			click: function() {
				let width = $tableBodyChildren[0].offsetWidth,
					scrollLeft = $this.scrollLeft(),
					scrollTo = (scrollLeft + width) > (width * $tableBodyChildrenCount) ? (width * $tableBodyChildrenCount) : (scrollLeft + width);

				$this.animate({scrollLeft:scrollTo}, 160);
			}
		});
	});

	/*------[3]------*/
	//youtube popup video
	youtubePopupVideoInitNode = document.querySelectorAll('.js-youtube-popup-video-init');
	for (let i = 0; i < youtubePopupVideoInitNode.length; i++)
	{
		video = new YoutubeVideoManager({
			node: youtubePopupVideoInitNode[i],
			playerType: 'popup',
			videoStartEvent: 'onYTPlayerLoad',
			popup: {
				autoHide : true,
				className: 'bxst-youtube-popup-default',
				closeIcon: true,
				closeByEsc : true,
				overlay: {
					backgroundColor: 'rgb(0, 0, 0)',
					opacity: 60
				},
			}
		});
	}

	/*------[4]------*/
	//youtube on view area video
	youtubePopupVideoInitNode = document.querySelectorAll('.js-youtube-on-view-video-init');
	for (let i = 0; i < youtubePopupVideoInitNode.length; i++)
	{
		video = new YoutubeVideoManager({
			node: youtubePopupVideoInitNode[i],
			videoStartEvent: 'onYTPlayerView',
			video: {
				mute: 1,
				loop: 1,
			}
		});
	}

	/*------[5]------*/
	//youtube on view area video
	let imageBannerYoutubeVideoInitNode = document.querySelectorAll('.js-image-banner-youtube-video-init');
	for (let i = 0; i < imageBannerYoutubeVideoInitNode.length; i++)
	{
		video = new YoutubeVideoManager({
			node: imageBannerYoutubeVideoInitNode[i],
			videoStartEvent: 'onYTPlayerView',
			video: {
				autoplay: 1,
				mute: 1,
				loop: 1,
				controls: 0,
				iv_load_policy: 3,
				rel: 0,
				modestbranding: 1,
				showinfo: 0,
				ecver: 2,
				version: 3,
			},
			events: {
				'onYTPlayerVideoEnd': function() {
					this.manager.video.player.playVideo();
				}
			}
		});
	}

	/*------[6]------*/
	//anchor links
	anchorLinks = document.querySelectorAll('.js-anchor-link');
	for (let i = 0; i < anchorLinks.length; i++)
	{
		BX.bind(anchorLinks[i], 'click', function(e) {
			e = e || document.event;
			e.preventDefault();

			marker = null;
			if (this.tagName == 'A')
			{
				if (this.getAttribute('name'))
				{
					marker = this.getAttribute('name');
				}
				else if (this.getAttribute('href'))
				{
					marker = this.getAttribute('href');
					marker = marker.replace('#','');
				}
			}

			if (!marker)
			{
				marker = this.dataset.anchorLinkMarker;
			}

			if (marker)
			{
				let element = document.getElementById(marker);

				if (element && !BX.isNodeHidden(element))
				{
					obNode = document.getElementById(marker);
					arNodePos = BX.pos(obNode);
					window.scrollTo(arNodePos.left, arNodePos.top - (headerStickSection.offsetHeight * 2));
				}
			}
		});
	}
});
