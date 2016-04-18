/*
 *  Name: Yusdesign Kuler Feed Javascript Processing
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor, cnv, img, cntnr, gesso;
var cW, cH, rc, bg, d, sclr, tinge;
var bugs = [], distances = [], maxDistance, spacer;

// Yusdesign jQuery Kuler Feed
jQuery.noConflict();
(function(a){a(function(){a("body").addClass("yusdesign");var g,d,h,k,l,e,m,c,f;a.ajax({type:"GET",url:"https://kuler-api.adobe.com/rss/search.cfm?searchQuery=userID:102986&itemsPerPage=50&key=5F8FD294DC6015C63AEF97E329246996",dataType:"xml"}).done(function(b){b.error||(b=a(b).find("item"),a.each(b,function(b,n){g=a(this);d=g[0];h=d.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeID")[0].valueOf().innerHTML.toString();k=d.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","themeTitle")[0].valueOf().innerHTML.toString();
m="http://color.adobe.com/themeID/"+h;e=a('<div id="quartz'+b+'"></div>').addClass("tinge");c=a('<div id="title'+b+'"></div>').addClass("tetra");f=a("<a>").attr("href",m).addClass("tange");f.append(a("<span>").text(k).addClass("titre"));c.append(f);l=d.getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatch");a.each(l,function(b,d){var c=a(this)[0].getElementsByTagNameNS("http://kuler.adobe.com/kuler/API/rss/","swatchHexColor")[0].valueOf().innerHTML.toString();e.append(a("<div>").css("background-color",
"#"+c).addClass("scalar"))});c.append(e);a("div#kulerfeed").append(c)}))})})})(jQuery);

// Processing
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
  for (var i=0; i<50; i++) {
    bugs.push(new Jitter());
  }
  spacer = 9;
  noLoop();
}
function draw() {
  rc = color(utistor());
  bg = color(utistor());
  img = createImage(8, 8);
  img.loadPixels();
  d = pixelDensity();
  sclr = 4 * (d ^ 2) * img.width * img.height;
  //print(sclr);
  for (var i = 0; i < sclr; i += 4) {
    img.pixels[i] = red(rc);
    img.pixels[i + 1] = green(rc);
    img.pixels[i + 2] = blue(rc);
    img.pixels[i + 3] = alpha(rc);
  }
  img.updatePixels();
  for (var x = 0; x < cnv.width; x += spacer) {
    for (var y = 0; y < cnv.height; y += spacer) {
      //stroke(distances[x][y]);
      image(img, x + spacer / 2, y + spacer / 2);
      //point( x + spacer/2, y + spacer/2 );
    }
  }  //background( bg );
  for (var i=0; i<bugs.length; i++) {
    bugs[i].veloz = 8;
    bugs[i].move();
    bugs[i].display();
  }
}
function mousePressed() {
  redraw();
}
function windowResized() {
  resizeCanvas(cW, cH);
}
function utistor() {
  var r, g, b, a;
  r = randomGaussian(255);
  g = randomGaussian(255);
  b = randomGaussian(255);
  a = 1; // randomGaussian(0);
  return color(r, g, b, a);
}
function cntnrSize() {
  cH = cntnr.height;
  cW = cntnr.width;
  return cH, cW;
}
function mouseWheel(event) {
  print(event.delta);
  bv = bugs.veloz;
  print(bv);
  bv += event.delta;
  print(bv);
  redraw();
  //return false;
}
// Jitter class
function Jitter() {
  this.x = random(width);
  this.y = random(height);
  this.dia = random(10, 30);
  this.veloz = 2;

  this.move = function() {
    this.x += random(-this.veloz, this.veloz);
    this.y += random(-this.veloz, this.veloz);
  };

  this.display = function() {
    ellipse(this.x, this.y, this.dia, this.dia);
  };
}
