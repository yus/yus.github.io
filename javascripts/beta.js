/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var utistor, q;

$.noConflict();
(function( $ ) {
  $(function() {
    var entry, entryTitle, themeLink, themeImageLink, entryID, quler;
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
          quler = $( '<div id="qi'+i+'"></div>' );
          quler.css( 'font-family', '"Fira Sans", sans-serif' ).appendTo( '.gesso' );
          entry = items[i];
          themeImageLink = $( $( entry ).find( 'link' )[1] ).text();
          q = themeImageLink;
          console.log( q );
          entryTitle = $( $( entry ).find( 'title' )[1] ).text();
          themeLink = $( $( entry ).find( 'link' )[0] ).text();
          entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
          quler.html( '<a href="'+themeLink+'"><img src="'+themeImageLink+'"/><span>'+entryTitle+'</span></a>' );
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
        });
      }
    });
  });
})(jQuery);

var cnv, img, cntnr, gesso;
var cW, cH, wW, wH, r, g, b, a, rc, d, halfImage;
gesso = document.getElementById('gesso');

function preload() {
  utistor();
}

function setup() {
  print( wW + " ¤ " + wH );
  console.log( wW + " ¤ " + wH );
  
  cnv = createCanvas( cW, cH );
  cntnr = createDiv('').class('cntnr')
          .style('background-color', 'rgb(25, 25, 25)')
          .style('color', 'rgb(255, 129, 29)')
          .style('overflow-x', 'hidden')
          .style('overflow-y', 'auto')
          .style('font-family', '"Fira Sans", sans-serif')
          .style('font-size', '29px');
  cnv.class('cnv').parent( cntnr );
  cnv.style('visibility', 'visible');
  cntnr.parent( gesso );
  
  noLoop();
}

function draw() {
  utistor();
  cntnr.size( wW, wH );
  img = createImage( cW, cH );
  rc = color(r, g, b, a);
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
  image( img, 5, 5 );
}

function mousePressed() {
  redraw();
}

function windowResized() {
  utistor();
  resizeCanvas( cW, cH );
}

function utistor() {
  r = randomGaussian( 255,5 );
  g = randomGaussian( 255,50 );
  b = randomGaussian( 255,100 );
  a = randomGaussian( 255 );
  // windowWidth, windowHeight
  wW =  gesso.width - 5;
  wH =  gesso.height - 5;
  cW = wW - 5;
  cH = wH - 5;
}
