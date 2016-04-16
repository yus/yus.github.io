/*
 *  Name: Yusdesign Kuler Feed
 *  License: CC-NC-ND 3.0 Unported
 */
var utistor;
jQuery.noConflict();
(function ($) {
  $(function () {
    // “$” jQuery alias
    $('body').addClass('ysdsgn');
    var qc = '?searchQuery=userID:102986',
    qn = '&itemsPerPage=50',
    qk = '&key=5F8FD294DC6015C63AEF97E329246996';
    var qu = 'https://kuler-api.adobe.com/rss/search.cfm' + qc + qn + qk;

    $.ajax({
      type: 'GET',  
      url: qu,
      dataType: 'xml'
    }).done(function( result ){
      if ( !result.error ){
         swatchSheave(result);      }
    });
  });
}) (jQuery);

function swatchSheave(c){c=$(c).find("item");$.each(c,function(c,g){var a=$(this),d=$(a).find("kuler\\:themeID"),e=$(a).find("kuler\\:themeTitle"),a=$(a).find("kuler\\:swatch");$.each(a,function(a,c){var b=$(this),d=$(b).find("kuler\\:swatchChannel1"),e=$(b).find("kuler\\:swatchChannel2"),f=$(b).find("kuler\\:swatchChannel3"),b=$(b).find("kuler\\:swatchChannel4");console.log(" R \u203a\u203a\u203a "+$(d).html());console.log(" G \u203a\u203a\u203a "+$(e).html());console.log(" B \u203a\u203a\u203a "+$(f).html());
console.log(" A \u203a\u203a\u203a "+$(b).html())});console.log($(d).html()+" \u203a\u203a\u203a "+$(e).html())})};
