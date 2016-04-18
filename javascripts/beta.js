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
    var ns = 'http://kuler.adobe.com/kuler/API/rss/',
    qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
    $.ajax({
      type: 'GET',
      url: qu,
      dataType: 'xml'
    }).done(function (result) {
      if (!result.error) {
        var $books = $(result).find('item');
        $.each($books, function (i, jee) {
          var $book = $(this);
          var book = $book[0];
          var $ns_tID,
          $tID,
          $tTtl,
          $swatches;
          !$swatches ? $swatches = $($book).find('swatch') : $swatches = $($book).find('kuler\\:swatch');
          $swatches = book.getElementsByTagNameNS(ns, 'swatch');
          $.each($swatches, function (l, val) {
            var $swatch = $(val);
            swatch = $swatch[0];
            //!$swtch ? $swtch = $(swatch).find('swatchHexColor') : $swtch = $(swatch).find('kuler\\:swatchHexColor');
            !$swtch ? $swtch = swatch.getElementsByTagNameNS(ns, 'swatchHexColor')[0].valueOf(); // .innerHTML.toString()
            console.log( ' SWATCH 🕛 ››› ' + $swtch.html() ); 
          });
          
          $ns_tID = book.getElementsByTagNameNS(ns, 'themeID')[0].valueOf().innerHTML.toString();
          console.log( typeof $ns_tID + ' ››› html ›››  ' + $ns_tID );
          
          !$tID ? $tID = $($book).find('themeID') : $tID = $($book).find('kuler\\:themeID');
          !$tTtl ? $tTtl = $($book).find('themeTitle') : $tTtl = $($book).find('kuler\\:themeTitle');
          console.log($($tID).html() + ' ››› ' + $($tTtl).html());
          
        });
      }
    });
  });
}) (jQuery);
