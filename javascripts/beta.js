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
      url: qu,
      dataType: 'xml'
    }).done(function (responseXML) {
      if (!responseXML.error) {
        var items = $(responseXML).find('themeItem').get(),
        ns_items = $(responseXML).find('kuler\\:themeItem').get();
        var $items = undefined ? items : ns_items;
        console.log( $($items).text() ); // typeof 
        //console.log( $(response, document.item) );
        
        $.each( $items, function(q, r){
          var rr, ettl, tID, $thS, $sws;
          rr = undefined ? rr = $items[q] : rr = $(r)[q];
          console.log(rr);
          
          ettl = undefined ? ettl = $(rr).find( 'themeTitle' ).text() : ettl = $(rr).find( 'kuler\\:themeTitle' ).text();
          tID = undefined ? tID = $(rr).find( 'themeID' ).text() : tID = $(rr).find( 'kuler\\:themeID' ).text();
          console.log( q + '›››' + entryTitle + '›››' + tID );
          
          $thS = undefined ? $thS = $(rr).find('themeSwatches') : $thS = $(rr).find('kuler\\:themeSwatches');
          $sws = undefined ? $sws = $($thS).find('swatch') : $sws = $($thS).find('kuler\\:swatch');
          console.log(typeof $thS + 'brings' + typeof $sws);
          console.log('--------------------------------------------------------------------------------');
          
          $.each($sws, function(h, sclr){
            var $sclr, $q, $quartz;
            $sclr = undefined ? $sclr = $sws[h] : $sclr = $(sclr)[h];
            $q = undefined ? $q = $($sclr).find('swatchHexColor') : $q = $($sclr).find('kuler\\:swatchHexColor');
            console.log( $($q).text() );
          });
          
        });
      } // if !error
    }); // ajax done
  });
}) (jQuery);
