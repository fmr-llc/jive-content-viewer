/*
Jive - Accordion Widget

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
This is the Javascript library that drives the Accordion Widget Builder app.

WIDGET DESCRIPTION
This Jive HTML widget loads in a Jive setup document with a two column table.
The table content is parsed into a Bootstrap accordion.  This allows users to 
expand and contract the panels to show and hide the contained information.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';
var sourceURL = '';
var URLCheck = '/docs/';
var showTOCIcons = true;
var showTOCHovers = true;

$j(document).ready(function() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	var IEVersion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)));
	if(IEVersion <= 8){
		$j('#docURLInput').attr('onpropertychange', 'toggleNextButton()');
	} else {
		$j('#docURLInput').bind('input', function() {
			toggleNextButton();
		});
	}
});

function toggleNextButton() {
	if($j('#docURLInput').val().length > 0 && $j('#docURLInput').val().indexOf(URLCheck) >= 0) {
		$j('#nextButton').attr('disabled', false);
		$j('#URLStatus').html('');
	} else {
		$j('#nextButton').attr('disabled', true);
	}
}

function finish(){
	$j('#tocDiv').hide();
	sourceURL = $j('#docURLInput').val();
	if ( document.getElementById('tocIcons').checked ) {
		showTOCIcons = true;
	} else {
		showTOCIcons = false;
	}
	if ( document.getElementById('tocHover').checked ) {
		showTOCHovers = true;
	} else {
		showTOCHovers = false;
	}

	$j('#tocCodeBox').text("<div class='toc-menu-container'></div>");

	$j('#viewerCodeBox').text(	"<scr"+"ipt src='/api/core/v3/attachments/file/" + jquery_content_id + "/data'></scr"+"ipt>\n" 
								+ "<scr"+"ipt src='/api/core/v3/attachments/file/" + library_loader_content_id + "/data'></scr"+"ipt>\n"
								+ "<scr"+"ipt>\n"
								+ "$j.load_library('content_viewer_widget.css');\n"
								+ "$j.load_library('content_viewer_widget.js');\n"
								+ "var sourceURL='" + sourceURL + "';\n"
								+ "var showIcons=" + showTOCIcons + ";\n"
								+ "var showHovers=" + showTOCHovers + ";\n"
								+ "</scr"+"ipt>\n"
								+ "<div id='ContentViewerContainer'></div>\n" );
	$j('#generatedCodeDiv').show();
	resize();
}

function startOver(){
	$j('#tocDiv').show();
	$j('#generatedCodeDiv').hide();
	$j('#URLStatus').html('');
	$j('#docURLInput').val('');
	sourceURL = '';
	resize();
}

function resize(){
	setTimeout(resizeMe,100);
}

function init() {
	resize();
}