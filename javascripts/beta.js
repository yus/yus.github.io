/*
 *  Name: Yusdesign Kuler jQuery Feed
 *  License: CC-NC-ND 3.0 Unported
 */
// Yusdesign jQuery Kuler Feed
jQuery.noConflict();
// Rival Squirrel can scroll
(function($){
  $.fn.squirrel = function(loot){
    var $sqrrl = $(this);
    $offset = $sqrrl.offset();
    var sqrrls = {
      'rival': 0.72,
      'start': 0,
      'stop': $offset.top + $sqrrl.height(),
    };
    var upto = $.extend(sqrrls, loot);
    return this.each(function(){
      $(window).bind('scroll', function() {
        wTop = $(window).scrollTop();
        if((wTop >= upto.start) && (wTop <= upto.stop)) {
          nRival = wTop * upto.rival;
          $sqrrl.css({
              'top': nRival + 'px'
          }).siblings().fadeOut(444).stop(111).fadeIn(444);
        }
      });
    });
  };
})(jQuery);
(function ($) {
  $(function () {
    $('body').addClass('yusdesign');
    $('div#gesso').append( $('<div>').attr('id', 'cntnr') );
    var ns = 'http://kuler.adobe.com/kuler/API/rss/',
    qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk,
    $book, book, $skalar, $ns_themeID, $ns_themeTitle, $ns_swatches,
    quler, themeLink, qlrtitle, qlr;
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
          qlr = $('<a>').attr('href', themeLink).addClass('tange');
          qlrtitle.append( qlr.append($('<span>').text($ns_themeTitle).addClass('titre')));
          $ns_swatches = book.getElementsByTagNameNS(ns, 'swatch');
          $.each($ns_swatches, function (q, r) {
            var $swatch = $(this);
            var swatch = $swatch[0];
            var $swtch = swatch.getElementsByTagNameNS(ns, 'swatchHexColor')[0].valueOf().innerHTML.toString();
            $skalar = $('<div>').css('background-color', '#' + $swtch).addClass('scalar');
            quler.append( $skalar );
            $('div#cntnr').addClass('gesso').append($skalar.clone());
          });
          qlrtitle.append( quler );
          $('div#kulerfeed').append( qlrtitle );
          $('div#cntnr').squirrel({ 'rival':1.25 });
          $('div#kulerfeed').squirrel({ 'rival':.55 });
        });
      }
    });
  });
})(jQuery);
