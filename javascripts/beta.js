/*
 *  Name: Yusdesign Kuler Feed Javascript Processing
 *  License: CC-NC-ND 3.0 Unported
 */

// Yusdesign jQuery Kuler Feed
var ut = [];
jQuery.noConflict();
(function ($) {
  $(function () {
    $('body').addClass('yusdesign');
    var ns = 'http://kuler.adobe.com/kuler/API/rss/',
    qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk,
    $book, book, $ns_themeID, $ns_themeTitle, $ns_swatches, quler, themeLink, qlrtitle, qlr;
    $.ajax({
      type: 'GET',
      url: qu,
      dataType: 'xml'
    }).done(function (result) {
      if (!result.error) {
        var $books = $(result).find('item');
        $.each($books, function (i, j) {
          $book = $(this);
          book = $book[0];
          $ns_themeID = book.getElementsByTagNameNS(ns, 'themeID')[0].valueOf().innerHTML.toString();
          $ns_themeTitle = book.getElementsByTagNameNS(ns, 'themeTitle')[0].valueOf().innerHTML.toString();
          themeLink = '//color.adobe.com/themeID/' + $ns_themeID;
          quler = $('<div id="quartz' + i + '"></div>').addClass('tinge');
          qlrtitle = $('<div id="title' + i + '"></div>').addClass('tetra');
          qlr = $('<a>').attr( 'href', themeLink ).addClass('tange');
          qlr.append( $('<span>').text( $ns_themeTitle ).addClass('titre') );
          qlrtitle.append(qlr);
          $ns_swatches = book.getElementsByTagNameNS(ns, 'swatch');
          $.each($ns_swatches, function (q, r) {
            var $swatch = $(this);
            var swatch = $swatch[0];
            var $swtch = swatch.getElementsByTagNameNS(ns, 'swatchHexColor')[0].valueOf().innerHTML.toString();
            quler.append($('<div>').css('background-color', '#' + $swtch).addClass('scalar'));
            ut.push( $swtch );
          });
          qlrtitle.append(quler);
          $('div#kulerfeed').append( qlrtitle );
        });
      }
    });
    $.each( ut, function( index, value ) {
      console.log( "index", index, "value", value );
    });
  });
})(jQuery);
