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
      data: null,
      dataType: 'xml',
      url: qu,
      dataFilter: function('kuler'){ return resp; }
    }).done(function (resp) {
      if (!resp.error) {
        var items = $(resp).find('themeItem').get(),
        ns_items = $(resp).find('kuler\\:themeItem').get();
        var $items = undefined ? items : ns_items;
        console.log( $($items).text() ); // typeof 
        //console.log( $(response, document.item) );
        
        $.each( $items, function(q, r){
          var rr, ettl, tID, thS, ns_thS, swtch, ns_swtch;
          rr = undefined ? rr = $items[q] : rr = $(r)[q];
          console.log(rr);
          
          thS = $(rr).find('themeSwatches');
          ns_thS = $(rr).find('kuler\\:themeSwatches');
          swtch = $(thS).find('swatch');
          ns_swtch = $(ns_thS).find('kuler\\:swatch');
          
          ettl = $(rr).find( 'themeTitle' ).text();
          tID = $(rr).find( 'themeID' ).text();
          ns_ettl = $(rr).find( 'kuler\\:themeTitle' ).text();
          ns_tID = $(rr).find( 'kuler\\:themeID' ).text();
          console.log( q + ' ››› ' + (ettl || ns_ettl) + ' ››› ' + (tID || ns_tID) );

          console.log(typeof thS + ' ››› ' + typeof swtch);

          swtch.each(function(h, sclr){
            var $sclr, $quartz;
            $sclr = $(this);
            $quartz = $($sclr).find('swatchHexColor').text() || $($sclr).find('kuler\\:swatchHexColor').text();
            console.log( $quartz );
          });
          console.log('--------------------------------------------------------------------------------');
        });
      } // if !error
    }); // ajax done
  });
}) (jQuery);
