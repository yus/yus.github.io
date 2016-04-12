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
          qex = $( $( entry ).find( 'kuler\\:swatchHexColor' )[0] ).text();
          console.log( i + ' ››› ' + entryTitle + ' ››› ' + qex );
          
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
var cW, r, g, b, a, rc, bg, d, isum;
var distances = [];
var maxDistance;
var spacer;

function preload() {
  gesso = select('#gesso');
  utistor();
}

function setup() {
  createDiv('').id('cntnr').parent( gesso );
  cntnr = select('#cntnr');
  cntnr.class('cntnr').class( 'gesso' );
  cW = cntnr.width - 10;
  cnv = createCanvas( cW, 580 );
  cnv.style( 'visibility', 'visible' )
      .class( 'cnv' ).id( 'cnv' )
      .parent( cntnr );
  
  maxDistance = dist(width/2, height/2, width, height);
  for (var x = 0; x < width; x++) {
    distances[x] = []; // create nested array
    for (var y = 0; y < height; y++) {
      var distance = dist(width/2, height/2, x, y);
      distances[x][y] = distance/maxDistance * 255;
    }
  }
  spacer = 29;
  
  noLoop();
}

function draw() {
  rc = color( utistor() );
  bg = color( utistor() );
  img = createImage( 9, 9 );
  img.loadPixels();
  d = pixelDensity();
  isum = 4 * (d ^ 2) * img.width * img.height;
  print(isum);
  for (var i = 0; i < isum; i += 4) {
    img.pixels[i] = red(rc);
    img.pixels[i + 1] = green(rc);
    img.pixels[i + 2] = blue(rc);
    img.pixels[i + 3] = alpha(rc);
  }
  /**
  for (i = 0; i < img.width; i++) {
    for (j = 0; j < img.height; j++) {
      img.set(i, j, rc);
    }
  }
  */
  img.updatePixels();
  //tint(255, 126);
  image( img, 0, 0 );
  background( bg );
  
  for (var x = 0; x < width; x += spacer) {
    for (var y = 0; y < height; y += spacer) {
      stroke(distances[x][y]);
      image( img, x + spacer/2, y + spacer/2 );
      //point( x + spacer/2, y + spacer/2 );
    }
  }
}

function mousePressed() {
  redraw();
}

function windowResized() {
  resizeCanvas( cW, 580 );
}

function utistor() {
  r = randomGaussian(5, 255);
  g = randomGaussian(55, 255);
  b = randomGaussian(155, 255);
  a = randomGaussian(1,1);
  return color( r,g,b,a );
}
