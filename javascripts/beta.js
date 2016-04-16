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
          var $q = $(q).find('kuler\\:themeID' || 'themeID').text();
          var $l = $(q).find('kuler\\:themeTitle' || 'themeTitle').text();
          var $r = $(q).find('kuler\\:swatchChannel1' || 'swatchChannel1');
          var $g = $(q).find('kuler\\:swatchChannel2' || 'swatchChannel2');
          var $b = $(q).find('kuler\\:swatchChannel3' || 'swatchChannel3');
          var $a = $(q).find('kuler\\:swatchChannel4' || 'swatchChannel4');
          var $ri = $r[Symbol.iterator]();
          var $gi = $g[Symbol.iterator]();
          var $bi = $b[Symbol.iterator]();
          var $ai = $a[Symbol.iterator]();

          console.log( typeof $q + ' ››› ' + typeof $l );
          console.log( ' R ››› ' + $ri.next().value.text() );
          console.log( ' G ››› ' + $gi.next().value.text() );
          console.log( ' B ››› ' + $bi.next().value.text() );
          console.log( ' A ››› ' + $ai.next().value.text() );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
