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
          var $ns_themeID,
          $ns_themeTitle,
          $ns_swatches,
          quler,
          themeLink,
          qlrtitle,
          qlr;
          $ns_themeID = book.getElementsByTagNameNS(ns, 'themeID')[0].valueOf().innerHTML.toString();
          $ns_themeTitle = book.getElementsByTagNameNS(ns, 'themeTitle')[0].valueOf().innerHTML.toString();
          console.log( $ns_themeID +' ››› '+$ns_themeTitle );
          
          themeLink = themeLink = '//color.adobe.com/themeID/' + $ns_themeID;
          themeImageLink = '//color.adobe.com/kuler/themeImages/theme_' + $ns_themeID + '.png';
          quler = $('<div id="quartz' + i + '"></div>').addClass('tinge');
          qlrtitle = $('<div id="title' + i + '"></div>').addClass('fentry');
          qlr = $('<a>').attr( 'href', themeLink ).addClass('flink');
          qlr.append( $('<span>').text( $ns_themeTitle ).addClass('thitle') );
          qlrtitle.append(qlr);
          
          $ns_swatches = book.getElementsByTagNameNS(ns, 'swatch');
          $.each($ns_swatches, function (l, val) {
            var $swatch = $(this);
            var swatch = $swatch[0];
            var $swtch = swatch.getElementsByTagNameNS(ns, 'swatchHexColor')[0].valueOf().innerHTML.toString(); 
            console.log( ' SWATCH 🕛 ››› ' + $swtch );
            
            quler.append($('<div>').css({
              'background-color': '#' + $swtch,
              'width': '25px',
              'height': '25px',
              'display': 'flex',
              'flex-grow': '1'
            }).addClass('scalar'));
          });
          qlrtitle.append(quler);
          $('div#kulerfeed').append( qlrtitle );
        });
      }
    });
  });
}) (jQuery);
