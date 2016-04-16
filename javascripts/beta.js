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
          var $book = $(this)[i];
          var $q = $($book).find('kuler\\:themeID' || 'themeID').text();
          var $l = $($book).find('kuler\\:themeTitle' || 'themeTitle').text();
          var $swatches = $($book).find('kuler\\:swatch' || 'swatch');
          $.each($swatches, function( k,l ){
            var $swtch = $(this)[k];
            var $r = $($swtch).find('kuler\\:swatchChannel1' || 'swatchChannel1').text();
            var $g = $($swtch).find('kuler\\:swatchChannel2' || 'swatchChannel2').text();
            var $b = $($swtch).find('kuler\\:swatchChannel3' || 'swatchChannel3').text();
            var $a = $($swtch).find('kuler\\:swatchChannel4' || 'swatchChannel4').text();
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
