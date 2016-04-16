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
          $q = $(q).find('kuler\\:themeID' || 'themeID').text();
          $l = $(q).find('kuler\\:themeTitle' || 'themeTitle').text();
          $r = $(q).find('kuler\\:swatchChannel1' || 'swatchChannel1');
          $g = $(q).find('kuler\\:swatchChannel2' || 'swatchChannel2');
          $b = $(q).find('kuler\\:swatchChannel3' || 'swatchChannel3');
          $a = $(q).find('kuler\\:swatchChannel4' || 'swatchChannel4');
          
          console.log( typeof $q + ' ››› ' + typeof $l );
          console.log( ' R ››› ' + $r.text() );
          console.log( ' G ››› ' + $g.text() );
          console.log( ' B ››› ' + $b.text() );
          console.log( ' A ››› ' + $a.text() );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
