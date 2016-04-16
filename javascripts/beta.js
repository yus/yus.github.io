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
    }).done(function( responseXML ){
      if ( !responseXML.error ){
        var $book = $( responseXML ).find( 'item' );
        $.each($book, function( j,q ){
          var $q = $(q).find('kuler\\:themeID' || 'themeID').unwrap();
          var $l = $(q).find('kuler\\:themeTitle' || 'themeTitle').unwrap();
          var $swatches = $(q).find('kuler\\:swatch' || 'swatch');
          $.each($swatches, function( g,h ){
            var $r = $(h).find('kuler\\:swatchChannel1' || 'swatchChannel1').unwrap();
            var $g = $(h).find('kuler\\:swatchChannel2' || 'swatchChannel2').unwrap();
            var $b = $(h).find('kuler\\:swatchChannel3' || 'swatchChannel3').unwrap();
            var $a = $(h).find('kuler\\:swatchChannel4' || 'swatchChannel4').unwrap();
            console.log( ' R ››› ' + $r );
            console.log( ' G ››› ' + $g );
            console.log( ' B ››› ' + $b );
            console.log( ' A ››› ' + $a );
          });
          console.log( $($q).html() + ' ››› ' + $($l).html() );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
