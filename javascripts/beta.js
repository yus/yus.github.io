/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var cntnr, rendrr, mg, pg, wW, wH, singulars, halves, anchors, q;

function preload() {
  anchors = new Array([]);

  mg = 5, pg = 20;
  wW = windowWidth - 2*pg - 2*mg;
  wH = windowHeight - 2*pg - 2*mg;
  if( !q ) {
    console.log( "there are " + anchors );
  } else {
    ( !anchors ) ? anchors.append( q ) : console.log( q );
    
    for( var j = 0; j < anchors.length; j++ ) {
      singulars.append( loadImage( anchors[j] ) );
    }
  }
}

function setup() {
  createCanvas( wW, wH );
  rendrr = createGraphics( wW, wH );
  cntnr = createDiv( "thinking up the tints" ).id( "bg" ).class( "bg" )
          .style( "background-color", "rgba(25, 25, 25, .29)" )
          .style( "color", "rgba(255, 129, 29, .29)" )
          .style( "overflow-x", "hidden" )
          .style( "overflow-y", "auto" )
          .style( "font-family", "'Fira Sans', sans-serif" )
          .style( "font-size", "11px" );
  for( var r = 0; r < singulars.length; r++ ){
    push();
    singulars[r].loadPixels();
    halves.append( 4 * width * height/2 );
    for( var f = 0; f < halves.length; f++ ){
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
          entryTitle = $( $( entry ).find( 'title' )[1] ).text();
          themeLink = $( $( entry ).find( 'link' )[0] ).text();
          entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
          quler.html( '<a href="'+themeLink+'"><img src="'+themeImageLink+'"/><span>'+entryTitle+'</span></a>' );
          return q;
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
          //console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
        });
      } else {
        console.log( anchors, q );
      }
    });
  });
})(jQuery);
