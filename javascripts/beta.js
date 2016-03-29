/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
$j = jQuery.noConflict();
var qc = '?searchQuery=userID:102986', qn = '&itemsPerPage=50', qk = '&key=5F8FD294DC6015C63AEF97E329246996';
var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
var entry, entryTitle, themeLink, themeImageLink, entryID;
$j.ajax({ 
  url:qu,
  dataType: 'xml'
}).done( function( response ) {
  if ( !response.error ) {
    var items = $j( response ).find( 'item' );
    $j.each( items, function( i, u ) {
      entry = items[i];
      entryTitle = $j( $j(entry).find('title')[1] ).text();
      themeLink = $j( $j(entry).find('link')[0] ).text();
      themeImageLink = $j( $j(entry).find('link')[1] ).text();
      entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
      $j('.gesso').html( '<div id="qi'+i+'"></div>' );
      $j('div[id=^qi]'[i]).html( '<a class="ql'+i+'"></a>' );
      $j('div[id=^qi]'[i]).has('a[class=^ql]').attr( 'href', themeLink )
                          .html( '<img class="q"/><span class="t"></span>' );
      $j('div[id=^qi]'[i]).has('img.q').attr( 'src', themeImageLink );
      $j('div[id=^qi]'[i]).has('span.t').html( entryTitle );
      console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
      console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
    });
  }
});
