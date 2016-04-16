/*
 *  Name: Yusdesign Kuler Feed
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor;
jQuery.noConflict();
(function ($) {
  $(function () {
    // “$” jQuery alias
    $('body').addClass('ysdsgn');
    var qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;

    $.ajax({
      type: 'GET',  
      url: qu,
      dataType: 'xml'
    }).done(function( result ){
      if ( !result.error ){
        var $books = $( result ).find( 'item' );
        $.each($books, function( i,j ){
          var $book = $(this);
          var $q = $($book).find('kuler\\:themeID' || 'themeID');
          var $l = $($book).find('kuler\\:themeTitle' || 'themeTitle');
          var $swatches = $($book).find('kuler\\:swatch' || 'swatch');
          $.each($swatches, function( k,l ){
            var $swtch = $(this);
            var $a = $($swtch).find('kuler\\:swatchHexColor' || 'swatchHexColor');
            console.log( ' A ››› ' + $($a).html() );
          });
          console.log( $($q).html() + ' ››› ' + $($l).html() );
        });
      }
    });
  });
}) (jQuery);
