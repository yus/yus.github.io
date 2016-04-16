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
          var $q, $l, $r, $g, $b, $a;
          $q ? $q = $(q).find('themeID').text() || $(q).find('kuler\\:themeID').text();
          $l ? $l = $(q).find('themeTitle').text() || $(q).find('kuler\\:themeTitle').text();
          $r ? $r = $(q).find('swatchChannel1') || $(q).find('kuler\\:swatchChannel1');
          $g ? $g = $(q).find('swatchChannel2') || $(q).find('kuler\\:swatchChannel2');
          $b ? $b = $(q).find('swatchChannel3') || $(q).find('kuler\\:swatchChannel3');
          $a ? $a = $(q).find('swatchChannel4') || $(q).find('kuler\\:swatchChannel4');
          
          console.log( $q + ' › ' + $l );
          console.log( ' R ›››' + typeof $r );
          console.log( ' G ›››' + typeof $g );
          console.log( ' B ›››' + typeof $b );
          console.log( ' A ›››' + typeof $a );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
