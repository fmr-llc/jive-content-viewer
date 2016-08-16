/*
Jive - Content Viewer Widget

Copyright (c) 2015-2016 Fidelity Investments
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

FILE DESCRIPTION
This is the Javascript library that drives the Content Viewer Widget.

WIDGET DESCRIPTION
This Jive HTML widget is driven by a modified Table of Contents widget.  When a TOC entry 
is clicked, the click event is intercepted and the associated hyperlink is loaded and 
formatted for display in the defined viewer area on the Overview page.  This allows a rich 
set of content to be accessed on a single page without having to set up complex navigation 
between pages.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';

// Add parent window jquery reference
var parentDocument = window.parent.document;
var parentIframe = $j("iframe",parentDocument);
var widget_content = '#jive-widget-content';
var content_activity_class = '#jive-body div#streamAndDatablocks';
var content_profile_class = '#jive-body header';
var content_list_class = '#jive-body div.j-column-wrap-l';
var content_list_class2 = '#jive-body div.j-colum-wrap-l';
var content_preview_class = '#jive-body-main section.jive-content-body div#docverse-viewer-holder';
var content_photoalbum_class = '#jive-body-main div#jive-photo-album-content';
var content_area_class = '#jive-body-main section.jive-content-body';
var ContentViewerContainerContainer = null;
var loadRequest = null;

/*
 * Set a resizeMe function to intercept calls from other HTML widgets within overview pages that are displayed.
 * These widgets are a second iframe level deep and each call to the resizeMe function expects the parent window
 * to have a jive.widget.resizeMe function to perform the resizing.  This window level (within an HTML widget iframe
 * does not have that structure.  We need to build this structure into the current level to intercept and service 
 * those resizeMe requests.
 */
window.jive = {};
window.jive.widget = {};
window.jive.widget.resizeMe=function(widgetID){
	var widgetIframe = $j(widgetID, ContentViewerContainerContainer);
	if (widgetIframe) {
		var body = $j(widgetIframe).contents().find("body");
		$j(widgetIframe).css({height:0+"px"});
		if(body.length > 0){
			$j(widgetIframe).css({height:body[0].scrollHeight+"px"});
		}
	}
	resizeMe();
}

//IE8 hack
var isIE =new Boolean(false);
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var IEVersion = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
if(IEVersion <= 8) {
	isIE = true;
}

// Inherit parent CSS
window.onload = function() {
    if (parent) {
        var oHead = document.getElementsByTagName("head")[0];
        var arrStyleSheets = parent.document.getElementsByTagName("link");
        for (var i = 0; i < arrStyleSheets.length; i++) {
            oHead.appendChild(arrStyleSheets[i].cloneNode(true));
        }
    }
}

// This is embedded in an iframe, lets make all $j requests go to the parent
$j(function(){
	$j = parent.$j;
});

function setWidgetIframeHeight() {
    parentIframe.each(function(){
        if($j(this).contents().find('#ContentViewerContainer').length > 0){
   			// subtract one pixel from the container width so the content does not have the right most pixel cut off
   			ContentViewerContainerContainer.style.width = ($j(this).width() - 1)+'px';
            return false;
        }
    });
}

// Load content based on the hyperlink of the object clicked
function loadPage(page, null1, null2){
	var newContent = "<div id='jive-widget-content' class='clearfix'>\n\t<div id='jive-body-layout-l'>\n\t\t<div class='jive-body-layout-l1'>\n\t\t\t<div style='display:block' id='jive-widget-container_1'>";
	var refreshDelay = 150;

	// If the page is internal to this Jive instance
	if ( page == "javascript:void(0)" ||
	     page.substring(0,window.parent._jive_base_absolute_url.length) == window.parent._jive_base_absolute_url ) {
		// If a previous ajax call (search) was made, abort it
	    if(loadRequest) {
	        loadRequest.abort();
	        loadRequest = null
	    }
		//Display loading spinner
		ContentViewerContainerContainer.innerHTML = '<p style="width:99%;text-align:center;"><img alt="" src="/images/jive-image-loading.gif" style="width:100px;height=100px;"></p>';
		resizeMe();
	    //set the search variable so that only its return is used and all previous returns are ignored
	    loadRequest = $j.ajax({
			type: "GET",
			url: page,			
			success: function (data) {
				if(data){
					// Process the loaded content based on type...
					if( $j( data ).find(widget_content).length ) {
						// Container Overview pages
						ContentViewerContainerContainer.innerHTML = $j( data ).find(widget_content).html();
					} else if ( $j( data ).find(content_activity_class).length ) {
						// Activity pages
						ContentViewerContainerContainer.innerHTML = $j( data ).find(content_activity_class).html();
					} else if ( data.search('viewerURL:   \"') > -1 ) {
						// Content that has the document preview will have the preview iframe generated and shown
						var viewerURL = data.substr(data.search('viewerURL:   \"') + 14);
						viewerURL = viewerURL.substr(0, viewerURL.search('"'));
						if ( viewerURL.search("-1") > -1) {
							ContentViewerContainerContainer.innerHTML = '<p><h1>Document has been deleted!</h1></p>';
						} else {
							ContentViewerContainerContainer.innerHTML = '<iframe id="docverse-viewer-frame" width="100%" height="850" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" src="' + viewerURL + '"></iframe>';
						}
					} else if ( $j( data ).find(content_photoalbum_class).length ) {
						// Jive content
						var album = $j( data ).find(content_photoalbum_class).html();
						$j(album).find("[id='jive-viewphotos-form']").remove();
						ContentViewerContainerContainer.innerHTML = album;
					} else if ( $j( data ).find(content_area_class).length ) {
						// Jive content
						ContentViewerContainerContainer.innerHTML = $j( data ).find(content_area_class).html();
					} else if ( $j( data ).find(content_list_class).length ) {
						// Listing pages (like Content, Search, etc.)
						ContentViewerContainerContainer.innerHTML = $j( data ).find(content_list_class).html();
					} else if ( $j( data ).find(content_list_class2).length ) {
						// Alternate spelled listing screens (Tasks, People, etc.)
						ContentViewerContainerContainer.innerHTML = $j( data ).find(content_list_class2).html();
					} else if ( $j( data ).find(content_profile_class).length ) {
						// Jive's profile page has several Ajax driven frames, so we cannot display it as is...the below will format it
						var profile = $j( data ).find(content_profile_class);
						
						// Left pane - Profile Details
						$j(profile).find("[class='j-profile-nav j-rc5']").remove();
						$j(profile).find("[id='jive-profile-photos-slideshow']").remove();
						$j(profile).find("[id='j-profile-header-details']").css({
							'height': '200px',
							'float': 'left',
							'magin-bottom': '30px',
							'background-color': '#404040',
							'padding': '22px 25px 22px 25px'
						});
						$j(profile).find("[id='j-profile-header-details']").find("[class='jive-icon-sml jive-glyph-orgchart']").remove();
						$j(profile).find("[id='j-profile-header-details']").find("h1").css({
							'margin-bottom': '12px'
						});
						$j(profile).find("[id='j-profile-header-details']").find("span").css({
							'display': 'block',
							'font-size': '12px',
							'text-transform': 'uppercase'
						});
						$j(profile).find("[id='j-profile-header-details']").find("li").css({
							'margin-bottom': '8px'
						});
						$j(profile).find("[id='j-profile-header-details']").find("a").removeClass("font-color-normal").css({
							'color': '#FFFFFF'
						});

						// Middle pane - Picture, Points, and Title
						$j(profile).find("[class='j-profile-points-rollover']").remove();
						$j(profile).find("[id='j-profile-header-avatar-stats']").css({
							'float': 'left',
							'height': '200px',
							'margin-bottom': '12px',
							'background-color': '#5A5A5A',
							'text-align': 'center',
							'padding': '22px 25px 22px 25px'
						});
						$j(profile).find("[id='j-profile-header-avatar-stats']").find("[id='j-profile-points']").css({
							'font-size': '12px',
							'text-transform': 'uppercase',
							'margin-bottom': '12px',
							'color': '#FFFFFF'
						});
						$j(profile).find("[id='j-profile-header-avatar-stats']").find("[id='j-profile-points']").find("span").css({
							'display': 'block',
							'font-size': '32px',
							'padding-top': '12px'
						});

						// Right pane - Personal Info
						var details = $j( data ).find("[class='profile-tile j-extended-profile']");
						$j(details).find("[class='j-footer-fade']").remove();
						$j(details).find("[class='j-tile-header clearfix']").remove();
						$j(details).find("span").css({
							'display': 'block',
							'font-size': '12px',
							'text-transform': 'uppercase'
						});
						$j(details).find("li").css({
							'margin-bottom': '8px'
						});

						// Set the Viewer display area
						ContentViewerContainerContainer.innerHTML = 
							profile.html() +
							'<div style="height: 200px; float: left; margin-bottom: 12px; background-color: #FAFAFA; padding: 22px 25px 22px 25px;">' + details.html() + '</div>';
					}
				}
			},
			error: function(){
				setTimeout(resizeMe, refreshDelay);
			},
			complete: function(){
				setTimeout(resizeMe, refreshDelay);
			}
		});
	}  else	if ( page == window.parent._jive_base_absolute_url + '/' ||
		         page == window.parent._jive_base_absolute_url.replace('https:','http:') + '/'){
		return false;
	} else {
		// The pae is external, so iframe it in
		ContentViewerContainerContainer.innerHTML = '<iframe id="externalIframe" src="' + page + '" width="99%" height="800px;" />';
		setTimeout(resizeMe, refreshDelay);
	}
} //loadPage 00BQK50Y55VXE79156B

// Load in the TOC document
function loadTOC() {
	$j.ajax({
		type: "GET",
		url: sourceURL,		
		success: function (data) {
			if(data){
				$j('.toc-menu-container' + contentViewerIndex).html( 
					'<div class="toc-menu">'
					+ $j('.jive-rendered-content', data).html()
					+ '</div>' );
				replaceTextWithLinks();
				applyBrowserBasedCss();
				initMenu();
			}
		}
	});
} //loadTOC

// Process te TOC document bullet list into a list we can make into a button menu
function replaceTextWithLinks(){
	var innerText = '';
	var numberOfLi = $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list > li').length;
	var $currentLIElement = $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list > li');
	
	for (var i = 1; i <= numberOfLi; i++){
		var $temp = $currentLIElement.eq(i-1);
		
		if($temp.children('a').length > 0){
			innerText = '';
		} else {
			innerText = "<a href='javascript:void(0)' _jive_internal='true'>" + $temp.clone().children().remove().end().text() + "</a>";
			var $tempChildren = $temp.children().html();
			$temp.html( innerText + '<ul>' + $tempChildren + '</ul>' );
			innerText = '';
		}
	}
} //replaceTextWithLinks

// Format the TOC button menu based on the user's configuration
function applyBrowserBasedCss(){

	$j('.toc-menu-container' + contentViewerIndex + ' .toc-menu > ul').addClass('toc-menu-list');

	if ( ! showIcons ) {
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-thread-small').removeClass('jive-link-thread-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-wiki-small').removeClass('jive-link-wiki-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-poll-small').removeClass('jive-link-poll-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-blog-small').removeClass('jive-link-blog-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-profile-small').removeClass('jive-link-profile-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-idea').removeClass('jive-link-idea');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-event').removeClass('jive-link-event');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-socialgroup-small').removeClass('jive-link-socialgroup-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-project-small').removeClass('jive-link-project-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-community-small').removeClass('jive-link-community-small');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jive-link-external-small').removeClass('jive-link-external-small');
		$j('.toc-menu-container' + contentViewerIndex + '  ul  li  a').css({ 
			'padding':'5px 5px 5px 5px'
		});
	}else {
		$j('.toc-menu-container' + contentViewerIndex + '  ul  li  a').css({ 
			'padding':'5px 5px 5px 20px'
		});
	}

	if ( ! showHovers ) {
		$j('.toc-menu-container' + contentViewerIndex + ' a.jivecontainerTT-hover-container').removeClass('jivecontainerTT-hover-container');
		$j('.toc-menu-container' + contentViewerIndex + ' a.jiveTT-hover-user').removeClass('jiveTT-hover-user');
	}

	if (tocLayout == "horizontal") {
		$j('.toc-menu-container' + contentViewerIndex + ' .toc-menu ul > li').css({
			'float': 'left'
		});
	}

	// Add caret to all items with a sub-menu
	$j('.toc-menu-container' + contentViewerIndex + '  li:has(ul) > a').each(function() {
		$j(this).html( $j(this).html() + '<b class="caret"></b>');
	});
	$j('.toc-menu-container' + contentViewerIndex + ' .caret').css({
		'display':'inline-block',
		'width': 0,
		'height': 0,
		'margin-left': '2px',
		'vertical-align': 'middle',
		'border-top': '4px solid',
		'border-right': '4px solid transparent',
		'border-left': '4px solid transparent',
		'float': 'right'
	});

	$j('.toc-menu-container' + contentViewerIndex + ' .toc-menu ul > li').css({
		'list-style': 'none',
		'margin-right': '2px'
	});

	$j('.toc-menu-container' + contentViewerIndex + ' .toc-menu ul > li > a').css({
		'border': borderWidth + ' solid ' + unselectedBorderColor,
		'border-radius':'3px',
		'display': 'block',
		'padding': '8px 15px',
		'text-decoration': 'none',
		'font-weight': 'bold',
		'font-size': fontSize,
		'background-color': unselectedBackgroundColor,
		'color': unselectedTextColor
	});

	// Indent all sub-menus
	$j('.toc-menu-container' + contentViewerIndex + '  ul  li > ul').css({
		'margin':'1px 1px 1px 20px'
	});

} //applyBrowserBasedCss

// Initialize the menu and set up the various click intercept functions
function initMenu() {
	//Handles first tier parents
    $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list > li > a').click(function(e){ 		//When a parent link is clicked
		e.preventDefault();
        if ($j(this).hasClass('open-menu')) {
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			$j('.toc-menu-container' + contentViewerIndex + ' .open-menu').next().slideUp('normal')
			$j('.toc-menu-container' + contentViewerIndex + ' .open-menu').removeClass('open-menu');
			$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').next().slideUp('normal');
			$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').removeClass('sub-open-menu');
			return false;	// if we are trying to open what is already open, end, If this link has open-menu. Do nothing
		}
		
        $j('.toc-menu-container' + contentViewerIndex + ' .active-item').css({
			'border': borderWidth + ' solid ' + unselectedBorderColor,
			'background-color': unselectedBackgroundColor,
			'color': unselectedTextColor
		}).removeClass('active-item'); 	// clear active sub menu items
        $j('.toc-menu-container' + contentViewerIndex + ' .open-menu').next().slideUp('normal')
        $j('.toc-menu-container' + contentViewerIndex + ' .open-menu').removeClass('open-menu'); 	// if there is a reference to the previous item, close it
		$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').next().slideUp('normal');
		$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').removeClass('sub-open-menu');
        $j(this).addClass('open-menu'); 		// add tracking class
		$j(this).addClass('active-item'); 		//Tracking clicked item
		$j(this).css({
			'border': borderWidth + ' solid ' +selectedBorderColor,
			'background-color': selectedBackgroundColor,
			'color': selectedTextColor
		}).addClass('active-item');
        $j(this).next().slideDown('normal'); 		//slides down the a tag
		loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
        return false;
    });

     // handle submenu item clicks
    $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list a').hover (
    	function(e){
			e.preventDefault();
			if ( ! $j(this).hasClass('active-item') ) {
				$j(this).css({
					'border': borderWidth + ' solid ' + hoverBorderColor,
					'background-color': hoverBackgroundColor,
					'color': hoverTextColor
				}).addClass('hover-item'); 	// clear active sub menu items
			}
	        return true;
	    },
	    function(e){
			e.preventDefault();
			if ( ! $j(this).hasClass('active-item') && $j(this).hasClass('hover-item') ) {
				$j(this).css({
					'border': borderWidth + ' solid ' + unselectedBorderColor,
					'background-color': unselectedBackgroundColor,
					'color': unselectedTextColor
				}).removeClass('hover-item'); 	// clear active sub menu items
			}
	        return true;
	    }
	); 

   // handle submenu item clicks
    $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list ul > li > a').click (function(e){
		e.preventDefault();
		if ($j(this).hasClass('sub-open-menu')) {
			$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').next().slideUp('normal');
			$j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').removeClass('sub-open-menu');
			$j('.toc-menu-container' + contentViewerIndex + ' .active-item').css({
				'border': borderWidth + ' solid ' + unselectedBorderColor,
				'background-color': unselectedBackgroundColor,
				'color': unselectedTextColor
			}).removeClass('active-item'); 	// clear active sub menu items
			$j(this).css({
				'border': borderWidth + ' solid ' +selectedBorderColor,
				'background-color': selectedBackgroundColor,
				'color': selectedTextColor
			}).addClass('active-item');
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			return false;
		} else if($j(this).hasClass('g-open-menu')) {
			$j('.toc-menu-container' + contentViewerIndex + ' .active-item').css({
				'border': borderWidth + ' solid ' + unselectedBorderColor,
				'background-color': unselectedBackgroundColor,
				'color': unselectedTextColor
			}).removeClass('active-item'); 	// clear active sub menu items
			$j(this).css({
				'border': borderWidth + ' solid ' +selectedBorderColor,
				'background-color': selectedBackgroundColor,
				'color': selectedTextColor
			}).addClass('active-item');
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			return false
		}
		
		$j('.toc-menu-container' + contentViewerIndex + ' .active-item').css({
			'border': borderWidth + ' solid ' + unselectedBorderColor,
			'background-color': unselectedBackgroundColor,
			'color': unselectedTextColor
		}).removeClass('active-item'); 	// clear active sub menu items
        $j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').next().slideUp('normal');
        $j('.toc-menu-container' + contentViewerIndex + ' .sub-open-menu').removeClass('sub-open-menu');
		$j(this).addClass('sub-open-menu');
		$j(this).parent().find('li a').addClass('g-open-menu');
		$j(this)
		$j(this).css({
			'border': borderWidth + ' solid ' +selectedBorderColor,
			'background-color': selectedBackgroundColor,
			'color': selectedTextColor
		}).addClass('active-item');
		$j(this).next().slideDown('normal');
		loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
        return false;
    }); 

	$j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list ul, div#pageLoader').hide();
    $j('.toc-menu-container' + contentViewerIndex + ' .toc-menu-list > li:first > a').click(); // click first item 
} //initMenu

$j(document).ready(function() {
	// Set any variables not initialized to a default value...
	if (typeof tocLayout === 'undefined') {
		tocLayout = 'vertical';
	}
	if (typeof unselectedTextColor === 'undefined') {
		unselectedTextColor = '#069';
	}
	if (typeof unselectedBackgroundColor === 'undefined') {
		unselectedBackgroundColor = '#ffffff';
	}
	if (typeof unselectedBorderColor === 'undefined') {
		unselectedBorderColor = '#BDBDBD';
	}
	if (typeof hoverTextColor === 'undefined') {
		hoverTextColor = '#069';
	}
	if (typeof hoverBackgroundColor === 'undefined') {
		hoverBackgroundColor = '#ffffff';
	}
	if (typeof hoverBorderColor === 'undefined') {
		hoverBorderColor = '#BDBDBD';
	}
	if (typeof selectedTextColor === 'undefined') {
		selectedTextColor = '#069';
	}
	if (typeof selectedBackgroundColor === 'undefined') {
		selectedBackgroundColor = '#f0f0f0';
	}
	if (typeof selectedBorderColor === 'undefined') {
		selectedBorderColor = '#BDBDBD';
	}
	if (typeof fontSize === 'undefined') {
		fontSize = '12px';
	}
	if (typeof borderWidth === 'undefined') {
		borderWidth = '1px';
	}
	if (typeof contentViewerIndex === 'undefined') {
		contentViewerIndex = '';
	}

	// The page can have many iFrames on it.  We need to loop through them iframes on the page and find the one that contains this Content Viewer...
	ContentViewerContainerContainer = null;
	for (i=0; i < parentIframe.length; i++) {
		if ( $j('#ContentViewerContainer' + contentViewerIndex, parentIframe[i].contentDocument)[0] != undefined) {
			ContentViewerContainerContainer = $j('#ContentViewerContainer' + contentViewerIndex, parentIframe[i].contentDocument)[0];
		}
	}
	if (ContentViewerContainerContainer == null) {
		alert('The Content Viewer is not set up correctly.  Please validate that both the ToC and Viewer HTML widgets are set up correctly.');
	} else {
		loadTOC();
	}

	var window_resize_debounce = function(fn, timeout)
	{
		return function() {
			if (windowResizeTimeoutID > -1) {
				window.clearTimeout(windowResizeTimeoutID);
			}
			windowResizeTimeoutID = window.setTimeout(fn, timeout);
		}
	};

	// Debounce the user resizing the window so that the resize only happens once the user has stopped resizing for 250ms
	var window_resize = window_resize_debounce(function() { setWidgetIframeHeight(); }, 250);

	// Capture the window resize event and call the debounce function.
	$j(window).resize(setWidgetIframeHeight);}); // $j(document).ready function end
