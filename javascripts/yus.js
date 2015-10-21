/**mod**/

$(document).ready(function(){
    var widgetDonateStyle = {
      background: "none !important",
      backgroundSize: "0px 0%",
      borderRadius: "0px",
      boxShadow: "none"
    };
    
    $("div.yndx > iframe").load(function() {
        var frame = $("div.yndx > iframe").contents();
        /* other code */
        frame.find("div.b-widget-donate").css( widgetDonateStyle );
    });
    
}); 
