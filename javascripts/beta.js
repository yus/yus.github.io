/*
 *  Name: Yusdesign Kuler Feed
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor;
jQuery.noConflict();
(function ($) {
  $(function () {
    // “$” jQuery alias
    var qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;
    $.ajax({
      url: qu,
      dataType: 'xml',
      namespace: 'kuler'
    }).done(function (response) {
      if (!response.error) {
        var xmlDoc = $.parseXML(response);
        var $xml = $(xmlDoc);
        var $items = $(response).find('item');
        console.log($xml);
        $.each($items, function (q, u) {
          var entry = $items[q];
          console.log(entry);
          var quartz = $($(entry).find('kuler\\:swatch').find('kuler\\:swatchHexColor'));
          var entryTitle = $($(entry).find('kuler\\:themeTitle') [0]).text();
          var tID = $($(entry).find('kuler\\:themeID') [0]).text();

          var themeLink = 'https://color.adobe.com/themeID/' + tID;
          var quler = $('<div id="quartz' + q + '"></div>').addClass('tinge');
          var qlrtitle = $('<div id="title' + q + '"></div>').addClass('fentry');
          var ql = $('<a>').attr('href', themeLink).addClass('flink');
          ql.append($('<span>').text(entryTitle).addClass('thitle'));
          qlrtitle.append(ql);

          $.each(quartz, function (t, hclr) {
            sclr = hclr[t];
            console.log(t + ' ››› ' + sclr);
            // tell me what you say layout
            quler.append($('<div>').css({
              'background-color': '#' + 'abc',
              'width': '25px',
              'height': '25px',
              'display': 'flex',
              'flex-grow': '1'
            }).addClass('sclr'));
          });
          $('div#kulerfeed').append( quler );
          $('div#kulerfeed').append( qlrtitle );
          console.log('Title ››› ' + q + ' ››› ' + entryTitle + ' ››› ');
        });
      }
    });
  });
}) (jQuery);
var cnv,
img,
cntnr,
gesso;
var cW,
cH,
rc,
bg,
d,
isum;
var distances = [
];
var maxDistance;
var spacer;
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
    distances[x] = [
    ];
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
  isum = 4 * (d ^ 2) * img.width * img.height;
  print(isum);
  for (var i = 0; i < isum; i += 4) {
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
  var r,
  g,
  b,
  a;
  r = randomGaussian(5, 0.29);
  g = randomGaussian(55, 0.29);
  b = randomGaussian(155, 0.29);
  a = randomGaussian(1, 0.29);
  return color(r, g, b, a);
}
function cntnrSize() {
  cH = cntnr.height - 10;
  cW = cntnr.width - 10;
  return cH,
  cW;
}
