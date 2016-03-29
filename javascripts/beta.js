/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
$j = jQuery.noConflict();
var qc = '?searchQuery=userID:102986', qn = '&itemsPerPage=50', qk = '&key=5F8FD294DC6015C63AEF97E329246996';
var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
var cntnr = $j( '#kulerfeed' );
$j.ajax({ 
  url:qu,
  dataType: 'xml'
}).done( function( response ) {
  if ( !response.error ) {
    cntnr.empty();
    var items = $j( response ).find( 'item' );
    $j.each( items, function( i, u ) {
      var entry = items[i];
      var entryTitle = $j( $j(entry).find('title')[1] ).text();
      var themeLink = $j( $j(entry).find('link')[0] ).text();
      var themeImageLink = $j( $j(entry).find('link')[1] ).text();
      var entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
      console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryTitle + ' <' );
      var generateTheme = 'https://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid=' + entryID + qeystr;
      var gesso = cntnr.add( 'div' ).addClass( 'qi'+ i );
      var qlink = gesso.add( 'a' ).addClass( 'ql' ).attr( 'href', themeLink );
      qlink.add( 'img' ).addClass( 'q' ).attr( 'src', generateTheme );
      qlink.add( 'span' ).addClass('t').html( entryTitle );
    });
  }
});
