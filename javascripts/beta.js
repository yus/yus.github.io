/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/
var $q = $.Deffered();
var $j = {}, $d, $q; 
$d = $j.query(document);
$j.query = jQuery.noConflict(true);



var cntnr, rendrr, mg, pg, wW, wH, singulars, halves, ilinks;
var entry, entryTitle, themeLink, themeImageLink, entryID, quler;

function preload( ilinks ) {
  for(var j = 0; j < $j.query( ilinks ).length; j++){
    $j.query(singulars).push(loadImage($j.query(ilinks)[j]));
  }
}

function setup( singulars ) {
  mg = 5, pg = 20;
  wW = windowWidth - 2*pg - 2*mg;
  wH = windowHeight - 2*pg - 2*mg;
  createCanvas(wW, wH);
  rendrr = createGraphics(wW, wH);
  cntnr = createDiv("thinking up the tints").id("bg").class("bg")
          .style("background-color", "rgba(25, 25, 25, .29)")
          .style("color", "rgba(255, 129, 29, .29)")
          .style("overflow-x", "hidden")
          .style("overflow-y", "auto")
          .style("font-family", "'Fira', sans-serif")
          .style("font-size", "11px");

  for(var r = 0; r < $j.query(singulars).length; r++){
    $j.query(singulars)[r].loadPixels();
    $j.query(halves).push(4 * width * height/2);
    for(var f = 0; f < $j(halves).length; f++){
      $j.query(singulars)[r].pixels[f+$j.query(halves)[f]] = $j.query(singulars)[r].pixels[f];
    }
    $j.query(singulars)[r].updatePixels();
  }
}

function draw( singulars, wW, wH, mg, pg ) {
  cntnr.size(wW, wH)
        .style("padding", pg+"px")
        .style("margin", mg+"px");
  //rendrr.beginDraw();
  for(var s = 0; s < $j.query(singulars).length; s++){
    rendrr.image($j.query(singulars)[s], 0*s, 0*s);
  }
}

function windowResized(wW, wH) {
  resizeCanvas(wW, wH);
}

//$q.done( preload, setup, draw, windowResized, $j );
$q.done( preload, setup, draw, windowResized );
$d.ready( function( $ ) {
var qc = '?searchQuery=userID:102986', qn = '&itemsPerPage=50', qk = '&key=5F8FD294DC6015C63AEF97E329246996';
var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
$j.query.ajax({ 
  url:qu,
  dataType: 'xml'
}).done( function( response ) {
  if ( !response.error ) {
    var items = $j.query( response ).find( 'item' );
    $j.query.each( items, function( i, u ) {
      quler = $j.query('<div id="qi'+i+'"></div>');
      quler.appendTo('.gesso');
      entry = items[i];
      themeImageLink = $j.query( $j.query(entry).find('link')[1] ).text();
      $j.query( ilinks ).push(themeImageLink);
      entryTitle = $j.query( $j.query(entry).find('title')[1] ).text();
      themeLink = $j.query( $j.query(entry).find('link')[0] ).text();
      entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
      quler.html('<a href="'+themeLink+'"><img src="'+themeImageLink+'"/><span>'+entryTitle+'</span></a>');
      console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
      console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
    });
  }
});
$q.resolve( ilinks );
  console.log( ilinks );
});
