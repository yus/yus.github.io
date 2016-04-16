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
      beforeSend: function( xhr ) {
        xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
      }
    }).done(function( data ) {
      if ( !data.error ) {
        console.log( 'Sample of data:\n', data.slice( 0, 55 ) );
        console.log( $.isXMLDoc(data) + ' › ' + typeof data );
/**
        var xmlDoc = $.parseXML( data ),
        $xml = $( xmlDoc ),
        $items = $xml.find( 'item' ).get();
        console.log( typeof $items );
*/
        var xml = data;
        var regex = /(<\w+[^<]*?)\s+([\w-]+)="([^"]+)">/;
        while (xml.match(regex)) xml = xml.replace(regex, '<$2>$3</$2>$1>');  
        xml = xml.replace(/\s/g, ' ').  
        replace(/< *\?[^>]*?\? *>/g, '').  
        replace(/< *!--[^>]*?-- *>/g, '').  
        replace(/< *(\/?) *(\w[\w-]+\b):(\w[\w-]+\b)/g, '<$1$2_$3').
        replace(/< *(\w[\w-]+\b)([^>]*?)\/ *>/g, '< $1$2>').
        replace(/(\w[\w-]+\b):(\w[\w-]+\b) *= *"([^>]*?)"/g, '$1_$2="$3"').
        replace(/< *(\w[\w-]+\b)((?: *\w[\w-]+ *= *" *[^"]*?")+ *)>( *[^< ]*?\b.*?)< *\/ *\1 *>/g, '< $1$2 value="$3">').
        replace(/< *(\w[\w-]+\b) *</g, '<$1>< ').
        replace(/> *>/g, '>').
        replace(/"/g, '\\"').
        replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":"$2",').
        replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":[{$2}],').
        replace(/< *(\w[\w-]+\b) *>(?=("\w[\w-]+\b)":\{.*?\},\2)(.*?)< *\/ *\1 *>/, '"$1":{}$3},').
        replace(/],\s*?".*?": *\[/g, ',').
        replace(/< \/(\w[\w-]+\b)\},\{\1>/g, '},{').
        replace(/< *(\w[\w-]+\b)[^>]*?>/g, '"$1":{').
        replace(/< *\/ *\w[\w-]+ *>/g, '},').
        replace(/\} *,(?= *(\}|\]))/g, '}').
        replace(/] *,(?= *(\}|\]))/g, ']').
        replace(/" *,(?= *(\}|\]))/g, '"').
        replace(/ *, *$/g, '');
        xml = '{' + xml + '}';
        console.log( 'Sample of data:\n', xml.slice( 0, 55 ) );

      }
    });  
  });
}) (jQuery);
