/*
 *  Name: Yusdesign Kuler Feed Javascript Processing
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor, cnv, img, cntnr, gesso;
var cW, cH, rc, bg, d, scalar;
var distances = [], maxDistance, spacer;

//* Yusdesign jQuery Kuler Feed *// 
jQuery.noConflict();(function(a){a(function(){a("body").addClass("ysdsgn");a.ajax({type:"GET",url:"https://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996",dataType:"xml"}).done(function(b){b.error||(b=a(b).find("item"),a.each(b,function(b,h){var e=a(this)[0],c,g,f,d;c=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeID")[0].valueOf().innerHTML.toString();g=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeTitle")[0].valueOf().innerHTML.toString();
d=d="//color.adobe.com/themeID/"+c;themeImageLink="//color.adobe.com/kuler/themeImages/theme_"+c+".png";f=a('<div id="quartz'+b+'"></div>').addClass("tinge");c=a('<div id="title'+b+'"></div>').addClass("fentry");d=a("<a>").attr("href",d).addClass("flink");d.append(a("<span>").text(g).addClass("thitle"));c.append(d);e=e.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatch");a.each(e,function(b,c){var d=a(this)[0].getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatchHexColor")[0].valueOf().innerHTML.toString();
f.append(a("<div>").css({"background-color":"#"+d}).addClass("scalar"))});c.append(f);a("div#kulerfeed").append(c)}))})})})(jQuery);

function preload() {
  gesso = select('#gesso');
  createDiv('').id('cntnr').parent(gesso);
  cntnr = select('#cntnr');
  cntnr.class('cntnr').class('gesso');
  cntnrSize();
}
function setup() {
  cnv = createCanvas(cW, cH);
  cnv.style('visibility', 'visible').class('cnv').id('cnv').parent(cntnr);
  maxDistance = dist(cnv.width / 2, cnv.height / 2, cnv.width, cnv.height);
  for (var x = 0; x < cnv.width; x++) {
    distances[x] = [];
    for (var y = 0; y < cnv.height; y++) {
      var distance = dist(cnv.width / 2, cnv.height / 2, x, y);
      distances[x][y] = distance / maxDistance * 255;
    }
  }
  spacer = 41;
  noLoop();
}
function draw() {
  rc = color(utistor());
  bg = color(utistor());
  img = createImage(29, 29);
  img.loadPixels();
  d = pixelDensity();
  scalar = 4 * (d ^ 2) * img.width * img.height;
  print(scalar);
  for (var i = 0; i < scalar; i += 4) {
    img.pixels[i] = red(rc);
    img.pixels[i + 1] = green(rc);
    img.pixels[i + 2] = blue(rc);
    img.pixels[i + 3] = alpha(rc);
  }  /**
  for (i = 0; i < img.width; i++) {
    for (j = 0; j < img.height; j++) {
      img.set(i, j, rc);
    }
  }
  */
  img.updatePixels();
  for (var x = 0; x < cnv.width; x += spacer) {
    for (var y = 0; y < cnv.height; y += spacer) {
      stroke(distances[x][y]);
      image(img, x + spacer / 2, y + spacer / 2);
      //point( x + spacer/2, y + spacer/2 );
    }
  }  //background( bg );
}
function mousePressed() {
  redraw();
}
function windowResized() {
  resizeCanvas(cW, cH);
}
function utistor() {
  var r, g, b, a;
  r = randomGaussian(5, 0.29);
  g = randomGaussian(55, 0.29);
  b = randomGaussian(155, 0.29);
  a = randomGaussian(1, 0.29);
  return color(r, g, b, a);
}
function cntnrSize() {
  cH = cntnr.height;
  cW = cntnr.width;
  return cH,
  cW;
}
