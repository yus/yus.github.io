/*
 *  Name: Yusdesign Kuler Feed
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor;

jQuery.noConflict();
(function(a){a(function(){a("body").addClass("ysdsgn");a.ajax({type:"GET",url:"https://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996",dataType:"xml"}).done(function(d){d.error||(d=a(d).find("item"),a.each(d,function(d,h){var e=a(this)[0],b,f,g,c;b=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeID")[0].valueOf().innerHTML.toString();f=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeTitle")[0].valueOf().innerHTML.toString();
console.log(b+" \u203a\u203a\u203a "+f);c=c="//color.adobe.com/themeID/"+b;themeImageLink="//color.adobe.com/kuler/themeImages/theme_"+b+".png";g=a('<div id="quartz'+d+'"></div>').addClass("tinge");b=a('<div id="title'+d+'"></div>').addClass("fentry");c=a("<a>").attr("href",c).addClass("flink");c.append(a("<span>").text(f).addClass("thitle"));b.append(c);e=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatch");a.each(e,function(b,d){var c=a(this)[0].getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/",
"swatchHexColor")[0].valueOf().innerHTML.toString();console.log(" SWATCH \ud83d\udd5b \u203a\u203a\u203a "+c);g.append(a("<div>").css({"background-color":"#"+c,width:"25px",height:"25px",display:"flex","flex-grow":"1"}).addClass("scalar"))});b.append(g);a("div#kulerfeed").append(b)}))})})})(jQuery);
