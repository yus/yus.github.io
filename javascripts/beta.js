/*
 *  Name: Yusdesign Kuler jQuery Feed
 *  License: CC-NC-ND 3.0 Unported
 */
// Yusdesign jQuery Kuler Feed
jQuery.noConflict();
(function ($) {
  $(function () {
    $('body').addClass('yusdesign');
    $('div#gesso').append( $('<div>').attr('id', 'cntnr') );
    $('div#gesso').parent('section').addClass('kuler');
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
        });
      }
    });
    var rvr, hght, alt, rv = 0, $scaler = $('.scalar');
    $( document ).on( 'mousemove', function( e ) {
      
    });
    $(window).scroll(function(e) {
      hght = $(window).scrollTop();
      $rvr = $('.kuler');
      rvr = $rvr.scrollTop();
      if (rvr > rv) {
        $rvr.scrollTop( -rvr );
      }
      if(hght  > rvr) {
        $rvr.scrollTop( -rvr );
      }
    });
    $.each($scaler, function( ae, ea ) {
      console.log( ae + ': ‹ƒ› ' + $(this).css('background-color') );
      $( this ).on( 'mouseover', function( e ) {
        $( this ).text( e.pageX + '‹›' + e.pageY )
        .css({'transform':'translateZ('+(2)+'px)'})
        .animate({'transform':'scale('+ 2 +')'});
      }).on( 'mouseout', function( e ) {
        $( this ).text( e.pageX + '‹›' + e.pageY )
        .css({'transform':'translateZ('+(0)+'px)'})
        .animate({'transform':'scale('+ 1 +')'});
      });
    });
    
    $('div#cntnr').scroll(function(){
        alt = e.originalEvent.wheelDelta;
        !!alt > 0 ? console.log(alt) : alt;
    });
  });
})(jQuery);
