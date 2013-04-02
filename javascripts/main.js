/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
google.load('feeds', '1');
google.load('webfont', '1');

function initialize() {
  WebFontConfig = {
    google: { families: [ 'Podkova::latin' ] }
  };
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
}
google.setOnLoadCallback(initialize);
