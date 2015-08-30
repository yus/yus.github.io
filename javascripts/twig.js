// ==UserScript==
// @name        twig
// @namespace   twig
// @description twig script a little style your Google Translate page
// @downloadURL https://yus.github.io/javascripts/twig.js
// @updateURL   https://yus.github.io/javascripts/twig.js
// @include     http://translate.google.com/*
// @include     https://translate.google.com/*
// @run-at      document-end
// @version     4.4.4
// @grant       GM_addStyle
// ==/UserScript==

var twig =
    "table.gt-baf-table tbody > tr{height:auto !important;}" +
    "table.gt-baf-table td{border-top:1px dotted silver !important}" +
    "div.gt-baf-translations{white-space:normal !important; height: auto !important}" +
    ".gt-baf-back {white-space: nowrap !important}";

GM_addStyle(twig);
