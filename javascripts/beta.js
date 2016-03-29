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
      //console.log( typeof u );
      var entry = $j(items[i]);
      var qttl = $j( entry.find('title')[1] ).text(), qrf = $j( entry.find('link')[1] ).text();

      console.log( i + ' > ' + typeof entry + ' >> ' + qrf.text() + ' >> ' + qttl.text() + ' <' );
      //var qcapt = entry.has( 'description' ).text();
      /*
      var lslcr = qrf.lastIndexOf('/')+1;
      var tslcr = qttl.lastIndexOf(':')+2;
      var entryID = qrf.slice( lslcr );
      var entryTitle = qttl.slice( tslcr );
      var snipp = 'https://kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid=' + entryID + qeystr;
      var gesso = cntnr.add( 'div' ).addClass( 'qi'+ i );
      var qlink = gesso.add( 'a' ).addClass( 'ql' ).attr( 'href', qrf );
      qlink.add( 'img' ).addClass( 'q' ).attr( 'src', snipp );
      qlink.add( 'span' ).addClass('t').html( qttl );
      */
    });
  }
});