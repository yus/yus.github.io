/**mod**/

$(document).ready(function(){
    var widgetDonateStyle = {
      background: "none !important",
      backgroundSize: "0px 0%",
      borderRadius: "0px",
      boxShadow: "none"
    };
    
    $("div.yndx > iframe").contents().find("div.b-widget-donate").css( widgetDonateStyle );
}); 
