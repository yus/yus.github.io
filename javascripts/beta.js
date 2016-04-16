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
      dataType: 'jsonp',
      dataFilter: function(data, type){
        if(type == 'xml') console.log('returned xml!');
        var newdata = data.replace(/kuler:/g, '');
        //newdata = newdata.replace(/>/g, '>');
        return newdata;
      },
      jsonp: 'callback',
      jsonpCallback: 'jsonpcallback'
    });  
    function jsonpcallback(returndata) {
      console.log( 'data returned: ' + returndata );
    };

  });
}) (jQuery);
