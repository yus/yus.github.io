console.log('This is main JS file.');

google.load("feeds","1");
google.load("webfont","1");
WebFont.load({google:{families:["Roboto::cyrillic,latin"]}})
function initialize(){var c=new google.feeds.Feed("http://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996");
c.setNumEntries(50);
c.load(function(d){
  if(!d.error)
  for(var c=document.getElementById("kulerfeed"),e=0;e<d.feed.entries.length;e++){var a=d.feed.entries[e],j="http://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid="+a.link.slice(a.link.lastIndexOf("/")+1)+"&key=5F8FD294DC6015C63AEF97E329246996",f=document.createElement("div"), g=document.createElement("span"),h=document.createElement("img"),b=document.createElement("a");b.setAttribute("href",a.link);h.setAttribute("src",j);b.setAttribute("class","flink");f.setAttribute("class","fentry");h.setAttribute("class","penta");g.setAttribute("class","thitle");g.appendChild(document.createTextNode(a.title.slice(a.title.lastIndexOf(":")+2)));b.appendChild(h);b.appendChild(g);f.appendChild(b);c.appendChild(f)}});}

google.setOnLoadCallback(initialize);
