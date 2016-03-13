// ==UserScript==
// @name        MetaFilter User Makeup
// @namespace   https://github.com/roukaour/
// @description Assigns each MetaFilter user a random but consistent color and symbol.
// @include     *://*.metafilter.com/*
// @version     1.5
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

function luma(r, g, b) {
	// sRGB to RGB and RGB to luma formulas from W3C accessibility guidelines
	// https://www.w3.org/TR/WCAG20/#relativeluminancedef
	var c = [r, g, b];
	for (var i = 0; i < 3; i++) {
		c[i] /= 255;
		if (c[i] <= 0.03928) {
			c[i] /= 12.92;
		} else {
			c[i] = Math.pow((c[i] + 0.055) / 1.055, 2.4);
		}
	}
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function hashToColorSpan(x) {
	// Based on Cristian Sanchez's code:
	// http://stackoverflow.com/a/3426956/70175
	var color = (x & 0xFFFFFF).toString(16).toUpperCase();
	color = '00000'.substring(0, 6 - color.length) + color;
	var r = (x & 0xFF0000) >> 16, g = (x & 0xFF00) >> 8, b = x & 0xFF;
	var contrast = luma(r, g, b) > 0.179 ? '000' : 'FFF';
	return '<span style="background: #' + color + '; color: #' + contrast + ';">';
}

function hashToSymbol(x) {
	var symbols = '●■▲▼◆▰★✪♠♣♥♦◈◉✠✿';
	var i = (x & 0xF000000) / 0x1000000;
	return symbols.substring(i, i + 1);
}

function assignColors() {
	var bylines = document.getElementsByClassName('smallcopy');
	var i = bylines.length;
	while (i--) {
		var byline = bylines[i];
		if (!byline.innerHTML.startsWith('posted by')) continue;
		var userlink = byline.getElementsByTagName('a')[0];
		var username = userlink.innerHTML;
		var hash = hashCode(username);
		userlink.innerHTML = hashToColorSpan(hash) +
			'<big>' + hashToSymbol(hash) + '</big> ' + username + '</span>';
	}
}

document.addEventListener('DOMContentLoaded', assignColors, true);
