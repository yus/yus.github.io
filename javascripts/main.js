<<<<<<< HEAD
console.log('This would be the main JS file.');

google.load("feeds","1");google.load("webfont","1"); function initialize(){var c=new google.feeds.Feed("http://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996");c.setNumEntries(50);c.load(function(d){if(!d.error)for(var c=document.getElementById("kulerfeed"),e=0;e<d.feed.entries.length;e++){var a=d.feed.entries[e],j="http://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid="+a.link.slice(a.link.lastIndexOf("/")+1)+"&key=5F8FD294DC6015C63AEF97E329246996",f=document.createElement("div"), g=document.createElement("span"),h=document.createElement("img"),b=document.createElement("a");b.setAttribute("href",a.link);h.setAttribute("src",j);b.setAttribute("class","flink");f.setAttribute("class","fentry");h.setAttribute("class","penta");g.setAttribute("class","thitle");g.appendChild(document.createTextNode(a.title.slice(a.title.lastIndexOf(":")+2)));b.appendChild(h);b.appendChild(g);f.appendChild(b);c.appendChild(f)}});WebFont.load({google:{families:["Roboto::cyrillic,latin"]}})}google.setOnLoadCallback(initialize);
=======
/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
google.load('feeds', '1');
google.load('webfont', '1');

function initialize() {
//title: 'Quickmaker Themes', title : 'Quickmaker Color Themes'
  var feed = new google.feeds.Feed('http://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996');
  feed.setNumEntries(50);
  feed.load(function(result) {
    if (!result.error) {
      var container = document.getElementById('kulerfeed');
      for (var i = 0; i < result.feed.entries.length; i++) {
        var keystr = '&key=5F8FD294DC6015C63AEF97E329246996';
        var entry = result.feed.entries[i];
        var entryID = entry.link.slice(entry.link.lastIndexOf('/')+1);
        var snipp = 'http://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid='+entryID+keystr;
        var div = document.createElement('div');
        var span = document.createElement('span');
        var img = document.createElement('img');
        var a = document.createElement('a');
        a.setAttribute('href', entry.link);
        img.setAttribute('src', snipp);
        a.setAttribute('class', 'flink');
        div.setAttribute('class', 'fentry');
        img.setAttribute('class', 'penta');
        span.setAttribute('class', 'thitle');
        span.appendChild(document.createTextNode(entry.title.slice(entry.title.lastIndexOf(':')+2)));
        a.appendChild(img);
        a.appendChild(span);
        div.appendChild(a);
        container.appendChild(div);
      }
    }
  });
  WebFont.load({
    google: { families: [ 'Podkova::latin' ] }
  });
}
google.setOnLoadCallback(initialize);
>>>>>>> origin/gh-pages
