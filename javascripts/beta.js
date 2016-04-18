/*
 *  Name: Yusdesign Kuler Feed Javascript Processing
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor;
jQuery.noConflict();
(function(a){a(function(){a("body").addClass("ysdsgn");a.ajax({type:"GET",url:"https://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996",dataType:"xml"}).done(function(b){b.error||(b=a(b).find("item"),a.each(b,function(b,h){var e=a(this)[0],c,g,f,d;c=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeID")[0].valueOf().innerHTML.toString();g=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeTitle")[0].valueOf().innerHTML.toString();
d=d="//color.adobe.com/themeID/"+c;themeImageLink="//color.adobe.com/kuler/themeImages/theme_"+c+".png";f=a('<div id="quartz'+b+'"></div>').addClass("tinge");c=a('<div id="title'+b+'"></div>').addClass("fentry");d=a("<a>").attr("href",d).addClass("flink");d.append(a("<span>").text(g).addClass("thitle"));c.append(d);e=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatch");a.each(e,function(b,c){var d=a(this)[0].getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatchHexColor")[0].valueOf().innerHTML.toString();
f.append(a("<div>").css({"background-color":"#"+d,width:"25px",height:"25px",display:"flex","flex-grow":"1"}).addClass("scalar"))});c.append(f);a("div#kulerfeed").append(c)}))})})})(jQuery);
