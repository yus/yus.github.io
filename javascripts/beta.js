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
          //var $book = $(this);
          var $tID, $tTtl, $swatches;
          if (!$tID) {
            $tID = $(this).find('kuler\\:themeID');
          } else {
            $tID = $(this).find('themeID');
          }
          if (!$tTtl) {
            $tTtl = $(this).find('kuler\\:themeTitle');
          } else {
            $tTtl = $(this).find('themeTitle');
          }
          if (!$swatches) {
            $swatches = $(this).find('kuler\\:swatch');
          } else {
            $swatches = $(this).find('swatch');
          }
          $.each($swatches, function( l,val ){
            var $swtch;
            if (!$swtch) {
              $swtch = $(val).find('kuler\\:swatchHexColor');
            } else {
              $swtch = $(val).find('swatchHexColor');
            }
            console.log( ' SWATCH 🕛 ››› ' + $($swtch).html() );
          });
          console.log( $($tID).html() + ' ››› ' + $($tTtl).html() );
        });
      }
    });
  });
}) (jQuery);
