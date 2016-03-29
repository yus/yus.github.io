/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/

$j = jQuery.noConflict();
qu = '//kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996';

$j.ajax({ 
  url:qu,
  dataType: 'xml'
}).done( function( response ) {
  if ( !response.error ) {
    var cntnr = $j( '#kulerfeed' );
    cntnr.empty();
    var items = $j( response ).find( 'item' );

    $j.each( items, function( index, value ) {
      var entry = $j( value ), qeystr = '&key=5F8FD294DC6015C63AEF97E329246996'; 
      var qrf = entry.has( 'link' ).text(), qttl = entry.has( 'title' ).text(), qcapt = $j( value ).has( 'description' );
      var lslcr = qrf.lastIndexOf('/')+1, tslcr = qttl.lastIndexOf(':')+2;
      var entryID = qrf.slice( lslcr ), entryTitle = qttl.slice( tslcr );
      var snipp = '//kuler-api.adobe.com/rss/png/generateThemePng.cfm?themeid=' + entryID + qeystr;
      
      var qlink = cntnr.add( 'div' ).addClass( 'qi'+ index ).add( 'a' ).addClass( 'ql' ).attr( 'href', qrf );
      qlink.add( 'img' ).addClass( 'q' ).attr( 'src', snipp );
      qlink.add( 'span' ).addClass('t').html( qttl );

      console.log( index + '<<<' + value.length + '>>>' );
    });
  }
});
