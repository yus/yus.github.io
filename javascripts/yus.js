/**mod**/

$(document).ready(function(){
    var widgetDonateStyle = { background: "none !important" };
    
    $("div#yndx > iframe").load(function() {
        var frm = $("div#yndx > iframe").contents();
        frm.find("div.b-widget-donate").css( widgetDonateStyle );
    });
    
}); 
