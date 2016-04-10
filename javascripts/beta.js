/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var utistor;

$.noConflict();
(function( $ ) {
  $(function() {
    var entry, entryTitle, themeLink, themeImageLink, entryID, quler, ql;
    // More code using $ as alias to jQuery
    var qc = '?searchQuery=userID:102986', qn = '&itemsPerPage=50', qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
    $.ajax({ 
      url:qu,
      dataType: 'xml'
    }).done( function( response ) {
      if ( !response.error ) {
        var items = $( response ).find( 'item' );
        $.each( items, function( i, u ) {
          entry = items[i];
          themeImageLink = $( $( entry ).find( 'link' )[1] ).text();
          entryTitle = $( $( entry ).find( 'title' )[1] ).text();
          themeLink = $( $( entry ).find( 'link' )[0] ).text();
          entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
          
          quler = $( '<div id="qi'+i+'"></div>' ).addClass( 'fentry' );
          $( 'div#kulerfeed' ).append( quler );
          ql = $('<a>').attr( 'href', themeLink ).addClass( 'flink' );
          ql.append( $('<img/>').attr( 'src', themeImageLink ).addClass( 'penta' ) );
          ql.append( $('<span>').text( entryTitle ).addClass( 'thitle' ) );
          quler.append( ql );
          
          //quler.html( '<a href="'+themeLink+'"><img src="'+themeImageLink+'"/><span>'+entryTitle+'</span></a>' );
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
        });
      }
    });
  });
})(jQuery);

var cnv, img, cntnr, gesso;
var cW, cH, wW, wH, wG, hG, r, g, b, a, rc, d, halfImage;

function preload() {
  gesso = select('#gesso');
  wG = gesso.width;
  hG = gesso.height;
  utistor();
}

function setup() {
  createDiv('').id('cntnr').parent( gesso );
  cntnr = select('#cntnr');
  cntnr.class('cntnr').class( 'gesso' );
  cW = cntnr.width;
  cnv = createCanvas( cW, 580 );
  cnv.style( 'visibility', 'visible' )
      .class( 'cnv' ).id( 'cnv' )
      .parent( cntnr );
  noLoop();
}

function draw() {
  utistor();
  rc = color(r, g, b, a);
  utistor();
  bg = color(r, g, b, a);
  img = createImage( 11, 11 );
  img.loadPixels();
  d = pixelDensity();
  halfImage = 2 * d ^ 2 * img.width * img.height;
  for (var i = 0; i < halfImage; i += 4) {
    img.pixels[i] = red(rc);
    img.pixels[i + 1] = green(rc);
    img.pixels[i + 2] = blue(rc);
    img.pixels[i + 3] = alpha(rc);
  }
  img.updatePixels();
  //tint(255, 126);
  image( img, 0, 0 );
  background( bg, .29 );
}

function mousePressed() {
  redraw();
}

function windowResized() {
  //utistor();
  resizeCanvas( cW, 580 );
}

function utistor() {
  
  r = randomGaussian(255);
  g = randomGaussian(255);
  b = randomGaussian(255);
  a = randomGaussian(0,1);
}
