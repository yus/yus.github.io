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
      data: null,
      url: qu,
      dataType: 'xml',
      namespace: 'kuler'
    }).done(function (response) {
      if (!response.error) {
        
        var $items = $(response).find('themeItem'), $ns_items = $(response).find('kuler\\:themeItem');
        var $f = (undefined) ? $items : $ns_items;
        console.log( $f );
        //console.log( $(response, document.item) );
        $f.each(function(q, u){
          var item = $(u);
          console.log(item);
        });
      } // if !error
    }); // ajax done
  });
}) (jQuery);
