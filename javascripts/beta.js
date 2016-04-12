/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var utistor;

$.noConflict();
(function( $ ) {
  $(function() {
    var entry, tID, entryTitle, themeLink, themeImageLink, entryID, quartz, tinge, hex, quler, ql;
    // More code using $ as alias to jQuery
    var qc = '?searchQuery=userID:102986', qn = '&itemsPerPage=50', qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
    $.ajax({ 
      url:qu,
      dataType: 'xml',
      namespace: 'kuler'
    }).done( function( response ) {
      if ( !response.error ) {
        var items = $( response ).find( 'item' );

        $.each( items, function( q, u ) {
          entry = items[q];
          console.log( u );

          tID = $( $( entry ).find( 'kuler\\:themeID' )[0] ).text();
          entryTitle = $( $( entry ).find( 'kuler\\:themeTitle' )[0] ).text();
          themeImageLink = $( $( entry ).find( 'kuler\\:themeImage' )[0] ).text();

          themeLink = 'https://color.adobe.com/themeID/' + tID;
          
          quartz = $( entry ).find( 'kuler\\:swatch' ).find( 'kuler\\:swatchHexColor' );

          for (i = 0; i < 4; i++){
            tinge = $( $( quartz )[i] ).text();
            console.log( tinge );
          }

          hex = $( $( entry ).find( 'kuler\\:swatchHexColor' )[0] ).text();

          quler = $( '<div id="qi'+q+'"></div>' ).addClass( 'fentry' );
          $( 'div#kulerfeed' ).append( quler );
          ql = $('<a>').attr( 'href', themeLink ).addClass( 'flink' );
          ql.append( $('<img/>').attr( 'src', themeImageLink ).addClass( 'penta' ) );
          ql.append( $('<span>').text( entryTitle ).addClass( 'thitle' ) );
          quler.append( ql );

          console.log( q + ' ››› ' + entryTitle + ' ››› ' + hex );
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
