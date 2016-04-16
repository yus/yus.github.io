/*
 *  Name: Yusdesign Kuler Feed
 *  License: CC-NC-ND 3.0 Unported
 */

var jsonify = function(m,p){var f=1,o=2,d=3,n=4,j=7,c=8,h=9,l,b,a,k={},g=[];if(!p){p={}}if(typeof p=="string"){p={find:p}}p.xmlns=p.xmlns||"*";if(p.parse!="function"){p.parse=e}function e(i){return i.split(":").pop().replace(/^ows_/,"").replace(/[^a-z,A-Z,0-9]/g,"")}switch(m.nodeType){case h:a=(!p.find)?m.childNodes:(m.getElementsByTagNameNS)?m.getElementsByTagNameNS(p.xmlns,p.find.split(":").pop()):m.getElementsByTagName(p.find);for(l=0;l<a.length;l++){k=xml2js(a[l]);if(k){g.push(k)}}k=(g.length&&g.length==1)?g[0]:g;break;case f:if(m.attributes.length==0&&m.childNodes.length==1&&m.childNodes.item(0).nodeValue){k=m.childNodes.item(0).nodeValue}for(l=0;l<m.attributes.length;l++){b=p.parse(m.attributes.item(l).nodeName);k[b]=m.attributes.item(l).nodeValue}for(l=0;l<m.childNodes.length;l++){if(m.childNodes.item(l).nodeType!=d){b=p.parse(m.childNodes.item(l).nodeName);if(typeof k[b]=="undefined"){k[b]=xml2js(m.childNodes.item(l))}else{if(typeof k[b].push=="undefined"){k[b]=[k[b]]}k[b].push(xml2js(m.childNodes.item(l)))}}}break;case n:k="<![CDATA["+m.nodeValue+"]]>";break;case d:k=m.nodeValue;break;case c:k="";break;default:k=null}return k};

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
        // xhr.responseXML
        var nodeName = 'themeTitle'
        var jsn = jsonify( data , nodeName );
        console.log(JSON.stringify( jsn, null, '\t'));
      }
    });
  });
}) (jQuery);
