// ==UserScript==
// @name        MetaFilter User Makeup
// @namespace   https://github.com/roukaour/
// @description Assigns each MetaFilter user a random but consistent color and symbol.
// @include     *://*.metafilter.com/*
// @version     1.0
// @grant       none
// @run-at      document-end
// ==/UserScript==

// Inspired by valrus' Colorful Comments
// https://metatalk.metafilter.com/24039/Color-Comments-By-User
// https://github.com/valrus/mefi-comment-colors/

function hashCode(s) {
	// String#hashCode from Java
	var hash = 0;
	for (var i = 0; i < s.length; i++) {
		hash = s.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
} 

function hashToColorSpan(x) {
	// Based on Cristian Sanchez's code:
	// http://stackoverflow.com/a/3426956/70175
	var fore = (x & 0xFFFFFF).toString(16).toUpperCase();
	fore = "00000".substring(0, 6 - fore.length) + fore;
	var r = (x & 0xFF0000) >> 16, g = (x & 0xFF00) >> 8, b = x & 0xFF;
	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	var back = luma >= 165 ? "000" : "FFF";
	return "<span style='color: #" + fore + "; background: #" + back + ";'>";
}

function hashToSymbol(x) {
	var symbols = "●■▲▼◆▰★✪♠♣♥♦◈◉✠✿";
	var i = (x & 0xF000000) / 0x1000000;
	return symbols.substring(i, i + 1);
}

function assignColors() {
	var bylines = document.getElementsByClassName('smallcopy');
	var i = bylines.length;
	while (i--) {
		var byline = bylines[i];
		if (!byline.innerHTML.startsWith("posted by")) continue;
		var userlink = byline.getElementsByTagName('a')[0];
		var username = userlink.innerHTML;
		var hash = hashCode(username);
		var colorSpan = hashToColorSpan(hash);
		var symbol = hashToSymbol(hash);
		userlink.innerHTML = hashToColorSpan(hash) +
			"<big>" + symbol + "</big> " + username + "</span>";
	}
}

document.addEventListener('DOMContentLoaded', assignColors, true);
