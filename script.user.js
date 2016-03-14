// ==UserScript==
// @name        MetaFilter User Makeup
// @namespace   https://github.com/roukaour/
// @description Assigns each MetaFilter user a random but consistent color and symbol.
// @include     *://*.metafilter.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @version     1.9
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

function luma(rgb) {
	// sRGB to RGB and RGB to luma formulas from W3C accessibility guidelines
	// https://www.w3.org/TR/WCAG20/#relativeluminancedef
	var c = [(rgb & 0xFF0000) >> 16, (rgb & 0xFF00) >> 8, rgb & 0xFF];
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

function hashToMakeup(hash) {
	var symbols = '●■▲▼◆▰★✪♠♣♥♦◈◉✠✿';
	var i = (hash & 0xF000000) >> 24;
	var symbol = symbols.charAt(i);
	var rgb = hash & 0xFFFFFF;
	var color = rgb.toString(16);
	color = '#' + '00000'.substring(0, 6 - color.length) + color;
	var contrast = luma(rgb) > 0.179 ? 'black' : 'white';
	return {symbol: symbol, color: color, contrast: contrast};
}

function applyMakeup() {
	var userlinks = document.querySelectorAll('.smallcopy a[href*="/user/"], \
		.copy a[href*="/user/"]:not([href$="rss"])');
	for (var i in userlinks) {
		var userlink = userlinks[i];
		var username = userlink.innerHTML;
		if (username.startsWith('<big class="user-makeup">')) continue;
		if (username.endsWith('...') && typeof userlink.title != 'undefined') {
			username = userlink.title;
		}
		var makeup = hashToMakeup(hashCode(username));
		userlink.style.backgroundColor = makeup.color;
		userlink.style.color = makeup.contrast;
		userlink.innerHTML = '<big class="user-makeup">' + makeup.symbol + '&nbsp;</big>' + username;
	}
}

applyMakeup();
$('#newcomments').on('mefi-comments', applyMakeup);
