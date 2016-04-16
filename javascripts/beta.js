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

    function jeesonify(result){
      var xml = result;
      var rgx = /(<\w+[^<]*?)\s+([\w-]+)="([^"]+)">/;
      while (xml.match(rgx)) xml = xml.replace(rgx, '<$2>$3</$2>$1>');  
      xml = xml.replace(/\s/g, ' ')
        .replace(/< *\?[^>]*?\? *>/g, '')
        .replace(/< *!--[^>]*?-- *>/g, '')
        .replace(/< *(\/?) *(\w[\w-]+\b):(\w[\w-]+\b)/g, '<$1$2_$3')
        .replace(/< *(\w[\w-]+\b)([^>]*?)\/ *>/g, '< $1$2>')
        .replace(/(\w[\w-]+\b):(\w[\w-]+\b) *= *"([^>]*?)"/g, '$1_$2="$3"')
        .replace(/< *(\w[\w-]+\b)((?: *\w[\w-]+ *= *" *[^"]*?")+ *)>( *[^< ]*?\b.*?)< *\/ *\1 *>/g, '< $1$2 value="$3">')
        .replace(/< *(\w[\w-]+\b) *</g, '<$1>< ').replace(/> *>/g, '>')
        .replace(/"/g, '\\"')
        .replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":"$2",')
        .replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":[{$2}],')
        .replace(/< *(\w[\w-]+\b) *>(?=("\w[\w-]+\b)":\{.*?\},\2)(.*?)< *\/ *\1 *>/, '"$1":{}$3},')
        .replace(/],\s*?".*?": *\[/g, ',')
        .replace(/< \/(\w[\w-]+\b)\},\{\1>/g, '},{')
        .replace(/< *(\w[\w-]+\b)[^>]*?>/g, '"$1":{')
        .replace(/< *\/ *\w[\w-]+ *>/g, '},')
        .replace(/\} *,(?= *(\}|\]))/g, '}')
        .replace(/] *,(?= *(\}|\]))/g, ']')
        .replace(/" *,(?= *(\}|\]))/g, '"')
        .replace(/ *, *$/g, '');
      var json = '{' + xml + '}';
      return json;
    }
    
    $.ajax({
      type: 'GET',  
      url: qu
    }).done(function( xhr.responseText ){
      if ( !xhr.responseText.error ){
        var jsn = jeesonify( xhr.responseText );
        console.log( typeof jsn );
        //$('.gesso').html( jsn );
      }
    });
  });
}) (jQuery);
