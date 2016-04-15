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
      data: null,
      url: qu,
      dataType: 'xml',
      namespace: 'kuler'
    }).done(function (response) {
      if (!response.error) {
        var items = $(response).find('themeItem'), ns_items = $(response).find('kuler\\:themeItem');
        var $items = (undefined) ? items : ns_items;
        console.log( $items );
        //console.log( $(response, document.item) );
        $.each( $items, function(q, r){
          var $r = $items[q]; //$(r)
          //console.log($r);
          var entryTitle = (undefined) ? $($r).find( 'themeTitle' ).text() : $($r).find( 'kuler\\:themeTitle' ).text();
          var tID = (undefined) ? $($r).find( 'themeID' ).text() : $($r).find( 'kuler\\:themeID' ).text();
          var $themeSwatches = (undefined) ? $($r).find('themeSwatches') : $($r).find('kuler\\:themeSwatches');
          var $swtchs = (undefined) ? $($themeSwatches).find('swatch') : $($themeSwatches).find('kuler\\:swatch');
          console.log($themeSwatches);
          console.log($swtchs);
          $.each($swtchs, function(m, sclr){
            var $sclr = $swtchs[m];
            var $quartz = (undefined) ? $($sclr).find('swatchHexColor') : $($sclr).find('kuler\\:swatchHexColor');
            console.log($($quartz).text());
          });
          console.log(q + '›››' + entryTitle + '›››' + tID);
        });
      } // if !error
    }); // ajax done
  });
}) (jQuery);
