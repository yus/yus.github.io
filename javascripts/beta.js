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
      dataType: 'json'
    }).done(function( result ){
      if ( !result.error ){
        var $books = $( result ).find( 'item' );
        $.each($books, function( j,q ){
          var $book = $(this)[j];
          var $q = $($book).find('kuler\\:themeID' || 'themeID').text();
          var $l = $($book).find('kuler\\:themeTitle' || 'themeTitle').text();
          var $swatches = $($book).find('kuler\\:swatch' || 'swatch');
          $.each($swatches, function( g,h ){
            var $swtch = $(this)[g];
            var $r = $($swtch).find('kuler\\:swatchChannel1' || 'swatchChannel1').unwrap();
            var $g = $($swtch).find('kuler\\:swatchChannel2' || 'swatchChannel2').unwrap();
            var $b = $($swtch).find('kuler\\:swatchChannel3' || 'swatchChannel3').unwrap();
            var $a = $($swtch).find('kuler\\:swatchChannel4' || 'swatchChannel4').unwrap();
            console.log( ' R ››› ' + $r );
            console.log( ' G ››› ' + $g );
            console.log( ' B ››› ' + $b );
            console.log( ' A ››› ' + $a );
          });
          console.log( $q + ' ››› ' + $l );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
