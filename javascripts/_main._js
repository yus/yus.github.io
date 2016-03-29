/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/

google.load("feeds", "1");

function OnLoad() {
  var query = 'https://color.adobe.com/'
    +'rss/search.cfm?searchQuery=userID:102986'
    +'&itemsPerPage=11'
    +'&key=5F8FD294DC6015C63AEF97E329246996';
  var food = new google.feeds.findFeeds(query, fineone);
  food.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
}

function fineone(result) {
  // Make sure we didn't get an error.
  if (!result.error) {
    var container = document.getElementById('kulerfeed');
    for (var i = 0; i < result.feed.entries.length; i++) {
      var keystr = '&key=5F8FD294DC6015C63AEF97E329246996';
      var entry = result.feed.entries[i];
      var entryID = entry.link.slice(entry.link.lastIndexOf('/')+1);
      var snipp = 'https://color.adobe.com/rss/png/generateThemePng.cfm?themeid='+entryID+keystr;
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
}

google.setOnLoadCallback(OnLoad);
