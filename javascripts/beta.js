/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/

$j = jQuery.noConflict();
qu = "https://kuler-api.adobe.com/rss/search.cfm?"+
  "searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996";

$j.ajax({ 
  url:qu,
  dataType: "xml"
}).done( function( response ) {
  if (!response.error) {
    $j( ".bg" ).empty();
    var items = $j( response ).find("item");
    var cntnr = $j( 'kulerfeed' );
    
    $j.each( items, function( index, value ) {
      var keystr = '&key=5F8FD294DC6015C63AEF97E329246996';
      //var entry = items[i];
      var entry = $j(value);
      //var qcapt = $j(value).has('description');
      var entryID = entry.has('link').text();
      entryID = entryID.slice(entry.link.lastIndexOf('/')+1);
      var qttl = entry.has('title').text();
      qttl.slice(entry.title.lastIndexOf(':')+2);
      var snipp = 'https://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid='+entryID+keystr;
      
      var qlink = cntnr.add('div').addClass('qi')
                        .add('a').addClass('ql')
                        .attr('href', entry.link);
      
      qlink.add('img').addClass('q')
            .attr('src', snipp)
            .add('span').addClass('t')
            .html(qttl);
      
      /*
      <div class="qi">
      <a href="" class="ql">
      <img src="" class="q" />
      <span class="t"></span>
      </a>
      </div>
      */
      //qcapt = qcapt.text().split("\n").filter(Boolean);
      console.log( index + '<<<' + value.length + '>>>' );
    });
  }
});
