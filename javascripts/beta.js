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
          var $q = $($book).find('kuler\\:themeID' || 'themeID')[0];
          var $l = $($book).find('kuler\\:themeTitle' || 'themeTitle')[0];
          var $swatches = $($book).find('kuler\\:swatch' || 'swatch');
          $.each($swatches, function( k,l ){
            var $swtch = $(this);
            var $r = $($swtch).find('kuler\\:swatchChannel1' || 'swatchChannel1')[0];
            var $g = $($swtch).find('kuler\\:swatchChannel2' || 'swatchChannel2')[0];
            var $b = $($swtch).find('kuler\\:swatchChannel3' || 'swatchChannel3')[0];
            var $a = $($swtch).find('kuler\\:swatchChannel4' || 'swatchChannel4')[0];
            console.log( ' R ››› ' + $($r).html() );
            console.log( ' G ››› ' + $($g).html() );
            console.log( ' B ››› ' + $($b).html() );
            console.log( ' A ››› ' + $($a).html() );
          });
          console.log( $($q).html() + ' ››› ' + $($l).html() );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
