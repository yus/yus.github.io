/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var cntnr, rendrr, mg, pg, wW, wH, art, singulars, halves, anchors, q;

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

function preload() {
  anchors = new Array([]);
  if( q ) {
    ( !anchors ) ? anchors.append( q ) : print( q );
  } else {
    print( "there are " + anchors );
  }
  mg = 5, pg = 20;
  wW = windowWidth - 2*pg - 2*mg;
  wH = windowHeight - 2*pg - 2*mg;
}

function setup() {
  createCanvas( 222, 222 );
  rendrr = createGraphics( 222, 222 );
  cntnr = createDiv( "thinking up the tints" ).id( "bg" ).class( "bg" )
          .style( "background-color", "rgba(25, 25, 25, .29)" )
          .style( "color", "rgba(255, 129, 29, .29)" )
          .style( "overflow-x", "hidden" )
          .style( "overflow-y", "auto" )
          .style( "font-family", "'Fira Sans', sans-serif" )
          .style( "font-size", "11px" );
  for( var r = 0; r < singulars; r++ ){
    createImage( 144, 144 );
    for( var j = 0; j < anchors; j++ ) {
      art = loadImage( anchors[j], function( singulars[r] ) {
        image( singulars[r], 0, 0 );
      }, function( q ) {
        if( q ) {
          ( !anchors ) ? anchors.append( q ) : print( q );
        } else {
          print( "there are " + anchors );
        }
      });
    }
    singulars[r].loadPixels();
    halves.append( 4 * width * height/2 );
    for( var f = 0; f < halves; f++ ){
      singulars[r].pixels[f+halves[f]] = singulars[r].pixels[f];
    }
    singulars[r].updatePixels();
  }
}

function draw() {
  cntnr.size( wW, wH )
        .style( "padding", pg+"px" )
        .style( "margin", mg+"px" );
  //rendrr.beginDraw();
  for( var s = 0; s < singulars.length; s++ ){
    rendrr.image( singulars[s], 0*s, 0*s );
  }
}

function windowResized() {
  resizeCanvas( wW, wH );
}

