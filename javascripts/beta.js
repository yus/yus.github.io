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
    }).done(function( responseXML){
      if ( !responseXML.error ){
        var $book = $( responseXML.item(0) ).find( 'themeItem' );
        $.each($book, function(j,q){
          var $$ = q[j];
          console.log( $$ );
          //$('.gesso').html( jsn );
        });  
      }
    });
  });
}) (jQuery);
