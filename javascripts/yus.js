/**mod**/

jQuery.noConflict();
(function( $ ) {
  $(function() {
    var widgetDonateStyle = {
      background: "none !important",
      backgroundSize: "0px 0%",
      borderRadius: "0px",
      boxShadow: "none"
    };
    $("div[class|='b-widget-donate']").css( widgetDonateStyle );
  });
})(jQuery);
