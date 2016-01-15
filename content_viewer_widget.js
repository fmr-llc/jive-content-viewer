/*
Jive - Content Viewer Widget

Copyright (c) 2015 Fidelity Investments
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
var jive_body = '#jive-body';
var widget_container = '#jive-widget-container';
var widget_content = '#jive-widget-content';
var content_activity_class = '#jive-body div#streamAndDatablocks';
var content_profile_class = '#jive-body header';
var content_list_class = '#jive-body div.j-column-wrap-l';
var content_list_class2 = '#jive-body div.j-colum-wrap-l';
var content_preview_class = '#jive-body-main section.jive-content-body div#docverse-viewer-holder';
var content_photoalbum_class = '#jive-body-main div#jive-photo-album-content';
var content_area_class = '#jive-body-main section.jive-content-body';
var newContentEndTags = "</div>\n</div>\n</div>"

/*
 * Set a resizeMe function to intercept calls from other HTML widgets within overview pages that are displayed.
 * These widgets are a second iframe level deep and each call to the resizeMe function expects the parent window
 * to have a jive.widget.resizeMe function to perform the resizing.  This window level (within an HTML widget iframe
 * does not have that structure.  We need to build this structure into the current level to intercept and service 
 * those resizeMe requests.
 */
window.jive = {};
window.jive.widget = {};
window.jive.widget.resizeMe=function(c){
	$j(c, $j('#mainContent', parentIframe[0].contentDocument)).each(function(){
		var e=$j(this).contents().find("body");
		$j(this).css({height:0+"px"});
		if(e.length>0){
			var d=e[0].scrollHeight;
			$j(this).css({height:d+"px"});
		}
	});
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

/*
 * .active-item refers to the link that is clicked.
 * .open-menu refers to the menu that is opened.
 */
$j(function(){
	// This is embedded in an iframe, lets make all $j requests go to the parent
	$j = parent.$j;
}); //$j function end

function loadPage(page, null1, null2){
	var newContent = "<div id='jive-widget-content' class='clearfix'>\n\t<div id='jive-body-layout-l'>\n\t\t<div class='jive-body-layout-l1'>\n\t\t\t<div style='display:block' id='jive-widget-container_1'>";
	//Display loading spinner
	$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = '<p style="width:99%;text-align:center;"><img alt="" src="/images/jive-image-loading.gif" style="width:100px;height=100px;"></p>';
	// If the page is internal to this Jive instance
	if (page == "javascript:void(0)" || page.substring(0,window.parent._jive_base_absolute_url.length) == window.parent._jive_base_absolute_url){
		$j.ajax({
			type: "GET",
			url: page,			
			success: function (data) {
				if(data){
					//console.log('found: ' + $j( data ).find(widget_content).length + ' : ' + $j( data ).find(content_activity_class).length + ' : ' + $j( data ).find(content_area_class).length + ' : ' + $j( data ).find(content_list_class).length + ' : ' + $j( data ).find(content_list_class2).length);
					if( $j( data ).find(widget_content).length ) {
						// Container Overview pages
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = $j( data ).find(widget_content).html();
					} else if ( $j( data ).find(content_activity_class).length ) {
						// Activity pages
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = $j( data ).find(content_activity_class).html();
					} else if ( data.search('viewerURL:   \"') > -1 ) {
						// Content that has the document preview will have the preview iframe generated and shown
						var viewerURL = data.substr(data.search('viewerURL:   \"') + 14);
						viewerURL = viewerURL.substr(0, viewerURL.search('"'));
						if ( viewerURL.search("-1") > -1) {
							$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = '<p><h1>Document has been deleted!</h1></p>';
						} else {
							$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = '<iframe id="docverse-viewer-frame" width="100%" height="850" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" src="' + viewerURL + '"></iframe>';
						}
					} else if ( $j( data ).find(content_photoalbum_class).length ) {
						// Jive content
						var album = $j( data ).find(content_photoalbum_class).html();
						$j(album).find("[id='jive-viewphotos-form']").remove();
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = album;
					} else if ( $j( data ).find(content_area_class).length ) {
						// Jive content
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = $j( data ).find(content_area_class).html();
					} else if ( $j( data ).find(content_list_class).length ) {
						// Listing pages (like Content, Search, etc.)
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = $j( data ).find(content_list_class).html();
					} else if ( $j( data ).find(content_list_class2).length ) {
						// Alternate spelled listing screens (Tasks, People, etc.)
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = $j( data ).find(content_list_class2).html();
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
						$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = 
							profile.html() +
							'<div style="height: 200px; float: left; margin-bottom: 12px; background-color: #FAFAFA; padding: 22px 25px 22px 25px;">' + details.html() + '</div>';
					}
					setTimeout(resizeMe, 250);
				}
			},
			complete: function(){
			}
		});
	} else {
		// The pae is external, so iframe it in
		$j('#mainContent', parentIframe[0].contentDocument)[0].innerHTML = '<iframe src="' + page + '" width="99%" height="500px;" />';
	}
} //loadPage

function loadTOC() {
	$j.ajax({
		type: "GET",
		url: sourceURL,		
		success: function (data) {
			if(data){
				$j('.toc-menu-container').html( 
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

function applyBrowserBasedCss(){

	$j('.toc-menu > ul').addClass('toc-menu-list');

	if ( ! showIcons ) {
		$j("a.jive-link-thread-small").removeClass('jive-link-thread-small');
		$j("a.jive-link-wiki-small").removeClass('jive-link-wiki-small');
		$j("a.jive-link-poll-small").removeClass('jive-link-poll-small');
		$j("a.jive-link-blog-small").removeClass('jive-link-blog-small');
		$j("a.jive-link-profile-small").removeClass('jive-link-profile-small');
		$j("a.jive-link-idea").removeClass('jive-link-idea');
		$j("a.jive-link-event").removeClass('jive-link-event');
		$j("a.jive-link-socialgroup-small").removeClass('jive-link-socialgroup-small');
		$j("a.jive-link-project-small").removeClass('jive-link-project-small');
		$j("a.jive-link-community-small").removeClass('jive-link-community-small');
		$j("a.jive-link-external-small").removeClass('jive-link-external-small');
		$j("a.jivecontainerTT-hover-container").removeClass('jivecontainerTT-hover-container');
		$j("a.jiveTT-hover-user").removeClass('jiveTT-hover-user');
	}

	// Add caret to all items with a sub-menu
	$j(".toc-menu-container li:has(ul) > a").each(function() {
		$j(this).html( $j(this).html() + '<b class="caret"></b>');
	});
	$j(".caret").css({
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

	$j(".toc-menu").css({
		'padding':'3px'
	});

	//The Unordered list tags in the container
	$j(".toc-menu-container ul").css({
		'list-style':'none', 
		'margin':'0', 'padding':'0', 
		'text-decoration':'none', 
		'style':'block',
	});

	$j(".toc-menu-container li > ul ul").css({  
		'border-left':'1px solid #E0E0E0'
	});

	$j(".toc-menu-container ul:last-child").css({
		'list-style':'none', 
		'margin':'0',
		'padding':'0', 
		'text-decoration':'none', 
		'style':'block',
	});


	$j(".toc-menu-list  li").css({
		'list-style':'none'
	});

	//First Level
	$j(".toc-menu-list > li:first-child").css({
		'list-style':'none', 
		'margin-right':'3px',
		'margin-left':'3px',
		'border':'0.5 solid #E0E0E0'
	});

	$j(".toc-menu-list > li").css({
		'list-style':'none', 
		'margin-right':'3px',
		'margin-left':'3px',
		'margin-bottom':'0',
		'border':'0.5 solid #E0E0E0',
		'style':'block'
	});

	$j(".toc-menu-list > li > a").css({ 
		'border-bottom':'1px solid #E0E0E0', 
		'color':'#999', 
		'display':'block', 
	});
								
	//Second Level List Items
	$j(".toc-menu-list > li > ul ").css({
		'list-style':'none',
		'border-bottom':'1px solid #E0E0E0'
	});

	$j(".toc-menu-list > li > ul > li:last-child").css({
		'list-style':'none',
		'margin-bottom':'5px'
	});

	//All links
	$j(".toc-menu-container  ul  li  a").css({ 
		'border-bottom':'1px solid #E0E0E0', 
		'color':'#999', 
		'display':'block'
	});
	if ( ! showIcons ) {
		$j(".toc-menu-container  ul  li  a").css({ 
			'padding':'5px 5px 5px 5px',
		});
	}else {
		$j(".toc-menu-container  ul  li  a").css({ 
			'padding':'5px 5px 5px 20px',
		});
	}

	$j(".toc-menu-container  ul  li > ul").css({
		'margin':'1px 1px 1px 20px'
	});

	$j(".toc-menu-container  ul  li  a:active").css({
		'background':'##CEF0FF'
	});

	if(isIE == true) {
		$j(".toc-menu-list").css({
			'background':'#fff',
			'color':'#999',
			'border': '1px solid #E0E0E0',
			'padding':'2px'
		});
						
		//All children links
		$j(".toc-menu-list > li > ul > li  a").css({
			'border': '0.5px solid  #BDBDBD'
		}); 
	} else {
		//Entire Container
		$j(".toc-menu-list").css({
			'background':'#fff',
			'color':'#999',
			'-webkit-box-shadow':'  0px 0px 1px 1px #BDBDBD', 
			'-moz-box-shadow':'  0px 0px 1px 1px #BDBDBD', 
			'box-shadow':' 0px 0px 1px 1px #BDBDBD', 
			'-webkit-border-radius':'5px',
			'-moz-border-radius':'5px', 
			'border-radius':'5px',
			'padding':'2px'
		});

		//All children links
		$j(".toc-menu-list > li > ul > li  a").css({
			'-webkit-box-shadow':' inset  0px 0px 4px #BDBDBD', 
			'-moz-box-shadow':' inset 0px 0px 4px #BDBDBD', 
			'box-shadow':' inset 0px 0px 4px #BDBDBD',
			'-webkit-border-radius':'5px',
			'-moz-border-radius':'5px', 
			'border-radius':'5px',
			'background-position':'4%'
		}); 
	}
} //applyBrowserBasedCss

function replaceTextWithLinks(){
	var innerText = '';
	var numberOfLi = $j(".toc-menu-list > li").length;
	var $currentLIElement = $j(".toc-menu-list > li");
	
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

function initMenu() {
	//Handles first tier parents
    $j('.toc-menu-list > li > a').click(function(e){ 		//When a parent link is clicked
		e.preventDefault();
        if ($j(this).hasClass('open-menu')) {
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			 $j('.open-menu').next().slideUp('normal')
			 $j('.open-menu').removeClass('open-menu');
			 $j('.sub-open-menu').next().slideUp('normal');
			$j('.sub-open-menu').removeClass('sub-open-menu');
			return false;	// if we are trying to open what is already open, end, If this link has open-menu. Do nothing
		}
		
        $j(".active-item").css({
    		'background-color': '#FFFFFF !important'
		}).removeClass('active-item'); 	// clear active sub menu items
        $j('.open-menu').next().slideUp('normal')
        $j('.open-menu').removeClass('open-menu'); 	// if there is a reference to the previous item, close it
		$j('.sub-open-menu').next().slideUp('normal');
		$j('.sub-open-menu').removeClass('sub-open-menu');
        $j(this).addClass('open-menu'); 		// add tracking class
		$j(this).addClass('active-item'); 		//Tracking clicked item
		$j(this).css({
    		'background-color': '#F0F0F0 !important'
		}).addClass('active-item');
        $j(this).next().slideDown('normal'); 		//slides down the a tag
		loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
        return false;
    });

    // handle submenu item clicks
    $j(".toc-menu-list ul  li  a").click (function(e){
		e.preventDefault();
		if ($j(this).hasClass('sub-open-menu')) {
			$j('.sub-open-menu').next().slideUp('normal');
			$j('.sub-open-menu').removeClass('sub-open-menu');
			$j(".active-item").css({
	    		'background-color': '#FFFFFF !important'
			}).removeClass('active-item'); 	// clear active sub menu items
			$j(this).css({
	    		'background-color': '#F0F0F0 !important'
			}).addClass('active-item');
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			return false;
		} else if($j(this).hasClass('g-open-menu')) {
			$j(".active-item").css({
	    		'background-color': '#FFFFFF !important'
			}).removeClass('active-item'); 	// clear active sub menu items
			$j(this).css({
	    		'background-color': '#F0F0F0 !important'
			}).addClass('active-item');
			loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
			return false
		}
		
		$j(".active-item").css({
    		'background-color': '#FFFFFF !important'
		}).removeClass('active-item'); 	// clear active sub menu items
        $j('.sub-open-menu').next().slideUp('normal');
        $j('.sub-open-menu').removeClass('sub-open-menu');
		$j(this).addClass('sub-open-menu');
		$j(this).parent().find('li a').addClass('g-open-menu');
		$j(this)
		$j(this).css({
    		'background-color': '#F0F0F0 !important'
		}).addClass('active-item');
		$j(this).next().slideDown('normal');
		loadPage($j(this).attr('href'), $j(this).attr('alt'), $j(this));
        return false;
    }); 

	$j('.toc-menu-list ul, div#pageLoader').hide();
    $j('.toc-menu-list > li:first > a').click(); // click first item 
} //initMenu

$j(document).ready(function() {
	loadTOC();
	//Give 1 second for everything to load in, then trigger a resize
	setTimeout(resizeMe,1000);
}); // $j(document).ready function end