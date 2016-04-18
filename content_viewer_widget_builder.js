/*
Jive - Accordion Widget

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
This is the Javascript library that drives the Accordion Widget Builder app.

WIDGET DESCRIPTION
This Jive HTML widget loads in a Jive setup document with a two column table.
The table content is parsed into a Bootstrap accordion.  This allows users to 
expand and contract the panels to show and hide the contained information.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';
var sourceURL = '';
var URLCheck = '/docs/';
var showTOCIcons = false;
var showTOCHovers = false;
var toc_layout = 'vertical';
var unselectedTextColor = '#069';
var unselectedBackgroundColor = '#ffffff';
var unselectedBorderColor = '#BDBDBD';
var hoverTextColor = '#069';
var hoverBackgroundColor = '#ffffff';
var hoverBorderColor = '#BDBDBD';
var selectedTextColor = '#069';
var selectedBackgroundColor = '#f0f0f0';
var selectedBorderColor = '#BDBDBD';
var fontSize = 12;
var borderWidth = 1;

function hideAll() {
	$j('#tocDiv').hide();
	$j('#customizationPage').hide();
	$j('#generatedCodeDiv').hide();
}

function toggleNextButton() {
	if($j('#docURLInput').val().length > 0 && $j('#docURLInput').val().indexOf(URLCheck) >= 0) {
		$j('#nextButton').attr('disabled', false);
		$j('#URLStatus').html('');
	} else {
		$j('#nextButton').attr('disabled', true);
	}
}

function customize(){
	hideAll();
	customizeMenu();
	$j('#customizationPage').show();
	resize();
}

function customizeMenu() {
	$j('#selected-item').css({
		'color': selectedTextColor,
		'background-color': selectedBackgroundColor,
		'border': borderWidth + 'px solid ' + selectedBorderColor,
		'font-size': fontSize + 'px'
	});
	$j('#hover-item').css({
		'color': hoverTextColor,
		'background-color': hoverBackgroundColor,
		'border': borderWidth + 'px solid ' + hoverBorderColor,
		'font-size': fontSize + 'px'
	});
	$j('#unselected-item').css({
		'color': unselectedTextColor,
		'background-color': unselectedBackgroundColor,
		'border-color': unselectedBorderColor,
		'border': borderWidth + 'px solid ' + unselectedBorderColor,
		'font-size': fontSize + 'px'
	});
}

function finish(){
	hideAll();
	sourceURL = $j('#docURLInput').val();
	toc_layout = $j('#toc_layout input:radio:checked').val();
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
								+ "var tocLayout='" + toc_layout + "';\n"
								+ "var unselectedTextColor='" + unselectedTextColor +"';\n"
								+ "var unselectedBackgroundColor='" + unselectedBackgroundColor +"';\n"
								+ "var unselectedBorderColor='" + unselectedBorderColor +"';\n"
								+ "var hoverTextColor='" + hoverTextColor +"';\n"
								+ "var hoverBackgroundColor='" + hoverBackgroundColor +"';\n"
								+ "var hoverBorderColor='" + hoverBorderColor +"';\n"
								+ "var selectedTextColor='" + selectedTextColor +"';\n"
								+ "var selectedBackgroundColor='" + selectedBackgroundColor +"';\n"
								+ "var selectedBorderColor='" + selectedBorderColor +"';\n"
								+ "var borderWidth='" + borderWidth + "px';\n"
								+ "var fontSize='" + fontSize + "px';\n"
								+ "</scr"+"ipt>\n"
								+ "<div id='ContentViewerContainer'></div>\n" );
	$j('#generatedCodeDiv').show();
	resize();
}

function startOver(){
	hideAll();
	$j('#tocDiv').show();
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
	
	$j("#unselectedTextColor").spectrum({
		color: unselectedTextColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			unselectedTextColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			unselectedTextColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#unselectedBackgroundColor").spectrum({
		color: unselectedBackgroundColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			unselectedBackgroundColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			unselectedBackgroundColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#unselectedBorderColor").spectrum({
		color: unselectedBorderColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			unselectedBorderColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			unselectedBorderColor = color.toHslString();
			customizeMenu();
		}
	});
		
	$j("#hoverTextColor").spectrum({
		color: hoverTextColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			hoverTextColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			hoverTextColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#hoverBackgroundColor").spectrum({
		color: hoverBackgroundColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			hoverBackgroundColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			hoverBackgroundColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#hoverBorderColor").spectrum({
		color: hoverBorderColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			hoverBorderColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			hoverBorderColor = color.toHslString();
			customizeMenu();
		}
	});
		
	$j("#selectedTextColor").spectrum({
		color: selectedTextColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			selectedTextColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			selectedTextColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#selectedBackgroundColor").spectrum({
		color: selectedBackgroundColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			selectedBackgroundColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			selectedBackgroundColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j("#selectedBorderColor").spectrum({
		color: selectedBorderColor,
	 	showAlpha: true,
	 	showInput: true,
	 	move: function(color) {
			selectedBorderColor = color.toHslString();
			customizeMenu();
		},
	 	hide: function(color) {
			selectedBorderColor = color.toHslString();
			customizeMenu();
		}
	});
	
	$j('#fontSize_slider').on("input change", function() {
		document.getElementById("fontSize").value = $j(this).val();
	});

	$j('#fontSize_slider').change(function () {
		document.getElementById("fontSize").value = $j(this).val();
		fontSize = $j(this).val();
		customizeMenu();
	});

	$j('#borderWidth_slider').on("input change", function() {
		document.getElementById("borderWidth").value = $j(this).val();
	});

	$j('#borderWidth_slider').change(function () {
		document.getElementById("borderWidth").value = $j(this).val();
		borderWidth = $j(this).val();
		customizeMenu();
	});

	$j("#tocCode").click(function() {
		$j("#tocCodeBox").select();
		return false;
	});
	$j("#viewerCode").click(function() {
		$j("#viewerCodeBox").select();
		return false;
	});
	resize();
});
