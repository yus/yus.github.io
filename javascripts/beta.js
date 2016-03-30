/*
*  Name: Yusdesign Kuler Feed
*  License: CC-NC-ND 3.0 Unported
*/

var cntnr, rendrr, mg, pg, wW, wH, singulars, halves, ilinks;
var entry, entryTitle, themeLink, themeImageLink, entryID, quler;

$.noConflict();
(function( $ ) {
  $(function() {
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
          quler = $('<div id="qi'+i+'"></div>');
          quler.appendTo('.gesso');
          entry = items[i];
          themeImageLink = $( $(entry).find('link')[1] ).text();
          $.query( ilinks ).push(themeImageLink);
          entryTitle = $( $(entry).find('title')[1] ).text();
          themeLink = $( $(entry).find('link')[0] ).text();
          entryID = themeLink.slice( themeLink.lastIndexOf('/')+1 );
          quler.html('<a href="'+themeLink+'"><img src="'+themeImageLink+'"/><span>'+entryTitle+'</span></a>');
          console.log( i + ' > ' + typeof entry + ' >> ' + themeLink + ' >> ' + entryTitle + ' <' );
          console.log( i + ' > ' + typeof entry + ' >> ' + themeImageLink + ' >> ' + entryID + ' <' );
        });
      }
    });
    
    var $q = $.Deffered();
    //$q.done( preload, setup, draw, windowResized, $j );
    $q.done( preload, setup, draw, windowResized );
    $q.resolve( ilinks );
    console.log( ilinks );
  });
})($);

var $j = jQuery.noConflict();

function preload(ilinks) {
  for(var j = 0, j < $j(ilinks).length, j++){
    $j(singulars).push(loadImage($j(ilinks)[j]));
  }
}

function setup(singulars) {
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

  for(var r = 0, r < $j(singulars).length, r++){
    $j(singulars)[r].loadPixels();
    $j(halves).push(4 * width * height/2);
    for(var f = 0, f < $j(halves).length, f++){
      $j(singulars)[r].pixels[f+$j(halves)[f]] = $j(singulars)[r].pixels[f];
    }
    $j(singulars)[r].updatePixels();
  }
}

function draw( singulars, wW, wH, mg, pg ) {
  cntnr.size(wW, wH)
        .style("padding", pg+"px")
        .style("margin", mg+"px");
  //rendrr.beginDraw();
  for(var s = 0, s < $j(singulars).length, s++){
    $j(rendrr).image($j(singulars)[s], 0*s, 0*s);
  }
}

function windowResized(wW, wH) {
  resizeCanvas(wW, wH);
}
