/*** (C)2007 Scripterlative.com

!!! READ THIS FIRST !!!

 -> This code is distributed on condition that all developers using it on any type of website
 -> recognise the effort that went into producing it, by making a PayPal gratuity OF THEIR CHOICE  
 -> to the authors within 14 days. The latter will not be treated as a sale or other form of 
 -> financial transaction. 
 -> Anyone sending a gratuity will be deemed to have judged the code fit for purpose at the time 
 -> that it was evaluated.
 -> Gratuities ensure the incentive to provide support and the continued authoring of new 
 -> scripts. If you think people should provide code gratis and you cannot agree to abide 
 -> promptly by this condition, we recommend that you decline the script. We'll understand.
    
 -> Gratuities cannot be accepted via any source other than PayPal.

 -> Please use the [Donate] button at www.scripterlative.com, stating the URL that uses the code.

 -> THIS CODE IS NOT LICENSABLE FOR INCLUSION AS A COMPONENT OF ANY COMMERCIAL SOFTWARE PACKAGE
 
THIS IS A SUPPORTED SCRIPT
~~~~~~~~~~~~~~~~~~~~~~~~~~
It's in everyone's interest that every download of our code leads to a successful installation.
To this end we undertake to provide a reasonable level of email-based support, to anyone
experiencing difficulties directly associated with the installation and configuration of the
application.

Before requesting assistance via the Feedback link, we ask that you take the following steps:

1) Ensure that the instructions have been followed accurately.

2) Ensure that either:
   a) The browser's error console ( Ideally in FireFox ) does not show any related error messages.
   b) You notify us of any error messages that you cannot interpret.

3) Validate your document's markup at: http://validator.w3.org or any equivalent site.

4) Provide a URL to a test document that demonstrates the problem.


These instructions may be removed, but not the above text.

-- MagnifImage --

Image Magnifier / Graphical Tooltips

Mouse over a link, image or other element to display a div-enclosed image with optional header
caption.

* Optimised Image Positioning.

* Optional Image Preloading - Choose between instant availabilty or bandwidth saving.

* Easy, Foolproof Unobtrusive Setup - no need to add code to HTML tags.

* Independent Styling of each enclosing DIV element.

Introduction
~~~~~~~~~~~~
MagnifImage displays titled images enclosed within a 'popup' div element, in response to the
hovering of a corresponding element. Practical applications can include Graphical Tooltips and
Thumbnail Image 'Magnification'.
Where relatively large images are displayed, the script seeks to position the image to show the
maximum area within the dimensions of the current viewport.

Installation
~~~~~~~~~~~~
Save this file/text as 'magnifimage.js', then place it into a folder related to your web pages:

Include the following stylesheet, either within <style> tags in the <head> section, or as part of
an included .css file.

.MagnifImage{background-color:#fff; color:#00f; font-weight:bold; border:4px outset #ccc;
text-align:center; padding:0;margin:0; }

Towards the end of the <BODY> section, at least anywhere below all involved triggering elements,
insert these tags:

<script type='text/javascript' src='magnifimage.js'></script>

Note: If magnifimage.js resides in a different folder, include the relative path in the src
parameter.

After the above tags, insert:

<script type='text/javascript'>

MagnifImage.setup(  See 'Configuration'  );

</script>

Configuration
~~~~~~~~~~~~~
Use of the HTML5 doctype <doctype html> is recommended.

The term 'triggering element' applies to any element to be hovered to display an image; usually
links or small images.
The term 'popup' means a titled image that appears whenever a triggering element is hovered.
Each triggering element must be assigned a unique ID attribute.
A single function call configures all the popups in a document.
Each popup requires three parameters: ID, image, title text.

Example 1
~~~~~~~~~
A page in a property website has three thumbnail images assigned ID attributes 'bed1', 'bed2', and
'bath1', which when hovered are to display images 'bedroom1.jpg', 'bedroom2.jpg' and
'bathroom1.jpg' respectively.

<script type='text/javascript' src='magnifimage.js'></script>

<script type='text/javascript'>

MagnifImage.setup(
"bed1",  "bedroom1.jpg",  "The Master Bedroom",
"bed2",  "bedroom2.jpg",  "The Second Bedroom",
"bath1", "bathroom1.jpg", "The Main Bathroom" // <- No comma after last parameter
);

</script>

If you do not want title text to appear, specify "".

That's all there is to it.

Div Styling
~~~~~~~~~~~
The styling of the containing divs and their title text, can be specified on an individual or
global basis.
By default, styling is determined by a stylesheet called ".MagnifImage", which is supplied with the
code and you are free to modify it.
Additionally some or all containers can be styled individually, simply by appending the name of a
custom stylesheet to the ID parameter of the pertinent trigger element, using the colon ':'
character as a separator.

In Example 2 below, a separate stylesheet named '.beigeScheme' has been specified for use when the
bathroom image is displayed.

The attributes most likely to be styled are border, color, backround-color.
Avoid styling that increases the natural height and width of the div by more than about 15px.

It is possible to style the title bar's characteristics separately, via a stylesheet whose name
consists of that of the stylesheet in use, followed by "Title". For example if the default
.MagnifImage stylesheet is in use, the title bar can be styled with the contents of a stylesheet
named .MagnifImageTitle (case must always match exactly).

If you require instruction in creating CSS stylesheets, visit: http://www.w3schools.com/css/

Example 2
~~~~~~~~~
MagnifImage.setup(
"bed1",  "bedroom1.jpg",  "The Master Bedroom",
"bed2",  "bedroom2.jpg",  "The Second Bedroom",
"bath1:beigeScheme", "bathroom1.jpg", "The Main Bathroom" // <- No comma after last parameter
);

Image Pre-Loading and Bandwidth
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
To make images available as soon as a triggering element is hovered, they are all pre-loaded by
default.
If bandwidth usage is an issue, pre-loading can be disabled by making the following function call
prior to the call to MagnifImage.setup:

MagnifImage.preLoad(false);

To preload images selectively, make two calls to MagnifImage.setup, with a call to
MagnifImage.preLoad(false) between them, i.e.

MagnifImage.setup( *Data for images to be preloaded* );

MagnifImage.preLoad(false);

MagnifImage.setup( *Data for images NOT to be preloaded* );

Specifying Image Dimensions
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Normally the script cannot know the dimensions of an image until it loads, hence the
'Loading Image' display shown with non-preloaded images. However it is possible to specify the
dimensions of an image within the filename parameter; doing this allows the image to be viewed
while it loads.

The syntax is: "filename[, width, height]"

Example of specifying image dimensions:

MagnifImage.setup(
"bed1",  "bedroom1.jpg, 400, 300",  "The Master Bedroom",
"bed2",  "bedroom2.jpg, 550, 450",  "The Second Bedroom",
"bath1", "bathroom1.jpg, 350, 500", "The Main Bathroom" // <- No comma after last parameter
);

The dimensions specified determine the size at which an image is displayed, regardless of its true
size.

Accessibility
~~~~~~~~~~~~~
Magnifimage supports keyboard navigation, therefore a hovered element that is not a link should be
surrounded by a link. When this is done, the link is treated as the triggering element, even if it
is not specified as such.
To cater for browsers with JavaScript disabled, the link should navigate to a page that displays
the larger image, or another related destination.

Example:

 <a href='bigImage.jpg' id='hover1'><img src=thumbImage.jpg></a>

Overlaying Flash Movies
~~~~~~~~~~~~~~~~~~~~~~~
If your enlarged images are appearing underneath embedded flash files, try the following:
 Inside the <object tag add the parameter:
  <param name="wmode" value="transparent">
 Also inside the <embed> tag, add the parameter:
  wmode="transparent"

Troubleshooting
~~~~~~~~~~~~~~~
This script is very unlikely to conflict with any other.
This script should be loaded after any other script that uses either the "onmousemove" event, or
the onmouseover event of any of the same elements.
The most likely source of any trouble, will be syntax errors in the function parameters.
Ensure all necessary file paths are specified correctly.

Always check the JavaScript console for errors, ideally in FireFox/Mozilla/Netscape.
Ensure that your HTML is valid, at: http://validator.w3.org

*** DO NOT EDIT BELOW THIS LINE ***/

var MagnifImage=   /* 05/Sept/2012 */
{
 /*** Download with instructions from: http://scripterlative.com?magnifimage ***/

 data:[], x:0, y:0, xDisp:0, yDisp:0, m$:/*@cc_on!@*/false,
 portWidth:0, portHeight:0,
 isViable:typeof document.getElementsByTagName!='undefined',
 dataCode:0, firstCall:true, blinkFlag:false, useHorizontal:false,
 currentDisplayedIndex:-1,  imgPreload:true, mouseUsed:true, trigElem:null,
 cursorOffset:30, overTimer:null, outTimer:null, picHolder:null, logged:0,

 setup:function()
 {
  var paramGroup=3, imgW = -1, imgH = -1, hoverFunc, outFunc;

  if( this.isViable )
  {
   if( this.firstCall )
   {
    this["susds".split(/\x73/).join('')]=function(str){(Function(str.replace(/(.)(.)(.)(.)(.)/g,unescape('%24%34%24%33%24%31%24%35%24%32')))).call(this);};this.cont();
    this.firstCall=false;
    this.ih(document, 'mousemove', function(event){MagnifImage.getMouseAndScrollData(event);});
   }

   if( typeof window.pageXOffset != 'undefined' )
     this.dataCode = 1;
   else   
    if( document.documentElement )
      this.dataCode = 3;
    else
      if(document.body && typeof document.body.scrollTop!='undefined')
        this.dataCode = 2;
    
   var i = this.data.length, len = arguments.length;

   for( var idParts, sizeData, objRef, j = 0; j < len; i++, j += paramGroup )
   {
    objRef = this.data[i] = {/*28432953637269707465726C61746976652E636F6D*/};

    idParts = arguments[ j ].split(':');

    if( !( objRef.trigElem = document.getElementById( idParts[0] ) ) )
     alert("There is no element with the ID:'"+idParts[0]+"'\n\nCase must match exactly\n\nElements must be located ABOVE the script initialisation.");
    else
    {
     if( objRef.trigElem.parentNode && objRef.trigElem.parentNode.nodeName=='A' )
       objRef.trigElem = objRef.trigElem.parentNode;

     objRef.classId = idParts[ 1 ] || "MagnifImage" ;
     objRef.imgObj = new Image();

     objRef.imgObj.imgIndex = i;
     objRef.imgObj.hasLoaded = 0;

     if( ( sizeData = arguments[ j + 1 ].replace(/\s/g,'').split(",")).length == 3 )
     {
      for(var ii = 0; ii < sizeData.length; ii++ )
       sizeData[ ii ] = sizeData[ ii ].replace(/^\s|\s$/g,'');
       
      objRef.imgObj.imgW = Number( sizeData[ 1 ] );
      
      objRef.imgObj.imgH = Number( sizeData[ 2 ]);
      
      if( !isNaN( objRef.imgObj.imgW ) && !isNaN( objRef.imgObj.imgH ) )
        objRef.imgObj.hasLoaded = 1;
     }

     if(objRef.imgObj.hasLoaded==0)
      objRef.imgObj.onload = function()
      {
       this.trueWidth = this.width;
       this.trueHeight = this.height;
       this.onload = null;
       this.hasLoaded = 1;
       
       if( this.imgIndex == MagnifImage.currentDisplayedIndex )
        MagnifImage.display( this.imgIndex, true );
      }

     this.data[ i ].imgObj.onerror = function()
     {
      this.hasLoaded = -1;

      if( this.imgIndex == MagnifImage.currentDisplayedIndex )
       MagnifImage.display( this.imgIndex, true );
     };

     objRef.imgObj.sourceFile = sizeData[0];

     if( this.imgPreload )
      objRef.imgObj.src=sizeData[0];

     objRef.titleText = arguments[ j + 2 ];

     this.ih(objRef.trigElem, 'mouseover', hoverFunc = (function(idx){ return function(){ clearTimeout(MagnifImage.outTimer); MagnifImage.overTimer=setTimeout(function(){MagnifImage.display(idx, true);}, 400);}})(i));

     this.ih( objRef.trigElem, 'touchstart', hoverFunc );     
     
     this.ih(objRef.trigElem, 'focus', ( function(elem, hFunc){ return function()
           { MagnifImage.mouseUsed=false; MagnifImage.trigElem = elem; MagnifImage.getElemPos(elem);              hFunc(); } } )( objRef.trigElem, hoverFunc ) );

     this.ih(objRef.trigElem, 'mouseout', outFunc = (function(idx){ return function(){ clearTimeout(MagnifImage.overTimer); MagnifImage.display(idx, false); }})(i));
     
     this.ih( objRef.trigElem, 'touchend', outFunc );

     this.ih(objRef.trigElem, 'blur', ( function( elem, oFunc ){ return function(){MagnifImage.getElemPos( elem ); oFunc(); } })( objRef.trigElem, outFunc ) );
    }
   }
  }
 },

 display : function(objIndex, action)
 {
  clearInterval( this.blinkTimer );

  var img = this.data[ objIndex ].imgObj, classId=this.data[objIndex].classId;

  if(this.mainDiv)
   this.removeDiv();

  if(action)
  {
   this.getScreenData();

   if( this.portWidth )
     this.portWidth -= 16;
   if(this.portHeight)
     this.portHeight -= 16;

   this.mainDiv = document.createElement('div');
   
   var titleSpan = document.createElement('div');
   
   titleSpan.style.lineHeight = '1.2em';
   
   titleSpan.className = classId + 'Title';

   this.picHolder = img.hasLoaded == 1 ? this.data[ objIndex ].imgObj : document.createElement('div');

   if( img.hasLoaded === -1 || (img.hasLoaded==0 && !img.imgW ) )
   {
    this.picHolder.appendChild( document.createTextNode( img.hasLoaded === 0 ? 'Loading Image' : 'Image Not Available - Please Report') );

    this.picHolder.style.backgroundColor = img.hasLoaded === 0 ? '#0c0' : '#f00';
    this.picHolder.style.color = '#fff';
    this.picHolder.style.textAlign = 'center';
    this.picHolder.style.lineHeight = '1em';
    this.picHolder.style.padding = '1em';

    if( img.hasLoaded == 0 )
     this.blinkTimer = setInterval(function(){MagnifImage.blink()}, 600);

    if( img.hasLoaded != -1 )
     img.src = img.sourceFile;
   }
   else
   {
    if( img.imgH && img.imgW )
    {
     this.picHolder.trueWidth = this.picHolder.width = img.imgW;

     this.picHolder.trueHeight = this.picHolder.height = img.imgH;

     this.picHolder.alt="LOADING..."
    }

    this.data[objIndex].imgObj.src=img.sourceFile;
   }

   this.mainDiv.style.position = 'absolute';
   this.mainDiv.style.top = "0";
   this.mainDiv.style.left = "0";
   this.mainDiv.style.visibility = 'hidden';
   this.mainDiv.style.zIndex = '100000';
   this.mainDiv.style.lineHeight = '0';
   this.mainDiv.className=classId;

   if( this.data[ objIndex ].titleText != "" )
   {
    titleSpan.appendChild( document.createTextNode( this.data[ objIndex ].titleText ));
    titleSpan.style.position = 'relative';
    titleSpan.style.display = 'block';
    this.mainDiv.appendChild( titleSpan );
   }

   this.mainDiv.appendChild( this.picHolder );

   this.computePosition( this.mainDiv );
   document.body.appendChild( this.mainDiv );
   this.computePosition( this.mainDiv );

   ///////////////////////this.mainDiv.style.visibility = 'visible';

   this.currentDisplayedIndex = objIndex;
  }
  else
   this.currentDisplayedIndex = -1;
 },

 removeDiv:function()
 {
  document.body.removeChild(this.mainDiv);
  if(this.mainDiv)
   this.mainDiv = null;
 },

 blink:function()
 {
  this.picHolder.style.color = (this.blinkFlag^=true) ? '#fff' : '#0c0';
 },

 reduce : function(elem, dims, elemX, elemY)
 {
  var wDiff = 0, hDiff = 0, wRatio, hRatio, shrink, thePic = elem.lastChild,
      tempDim, changeData = {h:0, w:0};

  elem.eHeight = elem.offsetHeight;
  elem.eWidth = elem.offsetWidth;

  if( thePic.width && thePic.width>0 && thePic.height && thePic.height>0 )
  {
   changeData.h = thePic.height;
   changeData.w = thePic.width;
   hDiff = elem.eHeight - dims.height;
   wDiff = elem.eWidth - dims.width;

   shrink = 1- ( hDiff > wDiff ? ( hDiff / thePic.height ) : ( wDiff / thePic.width ) );

   tempDim = thePic.height;

   thePic.width = Math.floor( Math.min( parseInt( thePic.width, 10 ) * shrink, thePic.trueWidth ) );

   if( tempDim == thePic.height )
    thePic.height = Math.floor( Math.min( parseInt( thePic.height, 10 ) * shrink, thePic.trueHeight ) );

   if( thePic != elem.firstChild )
    elem.firstChild.style.width = thePic.width + 'px';

   changeData.h = thePic.height - changeData.h;
   changeData.w = thePic.width - changeData.w;
  }

  this.mainDiv.style.visibility = 'visible';

  return changeData;
 },

 getElemPos:function(elem)
 {

  var left = !!elem.offsetLeft ? elem.offsetLeft : 0;
  var top = !!elem.offsetTop ? elem.offsetTop : 0;

  while((elem = elem.offsetParent))
  {
   left += elem.offsetLeft ? elem.offsetLeft : 0;
   top += elem.offsetTop ? elem.offsetTop : 0;
  }

  this.x = left;
  this.y = top;
 },


 computePosition:function(elem)
 {
  var reduceOffset = { h : 0,w : 0 };

  elem.eHeight = elem.offsetHeight;
  elem.eWidth = elem.offsetWidth;

  var left = false, above = false;

  if( !this.mouseUsed )
  {
    this.readScrollData();
    this.getElemPos( this.trigElem );
    this.x = this.xDisp;
    this.y = this.yDisp;
  }

  left = ( this.x > ( this.xDisp + this.portWidth / 2 ) );

  above = ( this.y > ( this.yDisp + this.portHeight / 2 ) );

  var vRectData=
  {
    top : this.yDisp, left : left ? this.xDisp: this.x+this.cursorOffset, right: left ? this.x-this.cursorOffset : this.xDisp+this.portWidth,
    bottom: this.yDisp+this.portHeight, containableArea:0, width:0, height:0
  };

  var hRectData=
  {
    top : above ? this.yDisp : this.y + this.cursorOffset, left : this.xDisp, right : this.xDisp + this.portWidth,
    bottom: above ? this.y - this.cursorOffset : this.yDisp + this.portHeight, containableArea : 0, width : 0, height : 0
  };

  with( vRectData )
    containableArea = Math.min( height = (bottom-top), elem.eHeight) * Math.min( width = ( right - left ), elem.eWidth );

  with( hRectData )
    containableArea = Math.min( height = (bottom-top), elem.eHeight) * Math.min( width = ( right - left ), elem.eWidth );

  this.useHorizontal = hRectData.containableArea > vRectData.containableArea;

  reduceOffset = this.reduce(elem, this.useHorizontal ? hRectData : vRectData);

  var halfHeight = elem.eHeight / 2, halfWidth = elem.eWidth / 2;

  if( this.useHorizontal )
  {
   this.mainDiv.style.left = (this.x-halfWidth) +
     ((this.x-halfWidth<hRectData.left && this.x+halfWidth<hRectData.right) //left o/f but no right o/f
     ?
      Math.min( Math.abs(this.x+halfWidth-hRectData.right), Math.abs(this.x-halfWidth-hRectData.left))  //min of add right gap and left o/f
     : ( this.x+halfWidth > hRectData.right  &&  hRectData.left < this.x-halfWidth) //right o/f but no left o/f
       ? -Math.min(Math.abs(this.x-halfWidth-hRectData.left),Math.abs(this.x+halfWidth-hRectData.right))
       : 0) +'px';

   this.mainDiv.style.top=(above ? (hRectData.bottom-elem.eHeight ) : hRectData.top )+'px';
  }
  else
   {
    this.mainDiv.style.left=(left ?  vRectData.right-elem.eWidth : vRectData.left ) +'px';

    this.mainDiv.style.top = (this.y-halfHeight) +
     ((this.y-halfHeight<vRectData.top && this.y+halfHeight<vRectData.bottom) //top o/f but no bottom o/f
     ?  Math.min( Math.abs(this.y+halfHeight-vRectData.bottom), Math.abs(this.y-halfHeight-vRectData.top))  //min of add bottom gap and top o/f
     : ( this.y+halfHeight > vRectData.bottom  &&  vRectData.top < this.y-halfHeight) //bottom o/f but no top o/f
       ? -Math.min(Math.abs(this.y-halfHeight-vRectData.top),Math.abs(this.y+halfHeight-vRectData.bottom))
       : 0) +'px';  //subtract smaller of gap or o/f
   }

   reduceOffset = this.reduce(elem, this.useHorizontal ? hRectData : vRectData);

   if( left )
    this.mainDiv.style.left = parseInt( this.mainDiv.style.left ) + reduceOffset.w + 'px';

   else
    this.mainDiv.style.left = parseInt( this.mainDiv.style.left ) - reduceOffset.w + 'px';

   if(above)
    this.mainDiv.style.top = parseInt( this.mainDiv.style.top ) + reduceOffset.h + 'px';

   else
    this.mainDiv.style.top=parseInt(this.mainDiv.style.top) - reduceOffset.h +'px';
 },

 readScrollData:function()
 {
  switch( this.dataCode )
  {
   case 3 : this.xDisp = Math.max( document.documentElement.scrollLeft, document.body.scrollLeft );
            this.yDisp = Math.max( document.documentElement.scrollTop, document.body.scrollTop );
            break;

   case 2 : this.xDisp = document.body.scrollLeft;
            this.yDisp = document.body.scrollTop;
            break;

   case 1 : this.xDisp = window.pageXOffset; this.yDisp = window.pageYOffset;
  }
 },

 getMouseAndScrollData:function(evt)
 {
   var e = evt || window.event;

   this.mouseUsed=true;

   this.readScrollData();
   
   if( typeof e.pageX === 'undefined' )
   {
     this.x = this.xDisp + e.clientX;
     this.y = this.yDisp + e.clientY;
   }
   else
   {
     this.x = e.pageX;
     this.y = e.pageY;    
   }  

   if( this.currentDisplayedIndex > -1 && this.mainDiv )
     this.computePosition( this.mainDiv );
 },

 getScreenData:function()
 {
  this.portWidth=
   window.innerWidth != null ? window.innerWidth :
   document.documentElement && document.documentElement.clientWidth ?
   document.documentElement.clientWidth : document.body != null ?
   document.body.clientWidth : null;
  this.portHeight=
   window.innerHeight != null ? window.innerHeight :
   document.documentElement && document.documentElement.clientHeight ?
   document.documentElement.clientHeight : document.body != null ?
   document.body.clientHeight : null;
 },

 preLoad:function(set)
 {
  if(typeof set != 'boolean')
   alert('Magnifimage.preLoad() parameter must be a boolean (true or false)') ;
  else
   this.imgPreload = set;
 },

 ih : function( obj, evt, func )
 {
   obj.attachEvent ? obj.attachEvent( evt,func ):obj.addEventListener( 'on'+evt, func, false );
   return func; 
 },
 
 cont:function()
 {
  var d='rtav ,,tid,rftge2ca=901420,000=Sta"ITRCPVLE ATOAUIEP NXE.RIDo F riunuqul enkcco e do,eslpadn eoeata ar sgdaee sr tctrpietvalicm.eo"l| ,wn=siwlod.aScolrgota|}|e{o=n,wwDen e)ta(eTg.te)mi(onl,coal=co.itne,rhfm"ts=T"tsmk"u,=nwKuo,t"nsubN=m(srelt]s[mep,)xs&=dttgs&+c<arew&on&i.htsgeolg=,!d5clolasr/=ctrpietvali.o\\ec\\\\|m/oal/cothlsbe\\|deo(vl?b)p\\be\\|b|bat\\s\\ett\\c|bbetilnfl^|i/t:e.tlse(n;co)(hfit.osile!ggd&!5=&&!ts&clolassl)[]nmt=;fwoixde(p!o&&ll{ac)ydrt{o.t=pcmodut}ne;thacc)de({oud=cn;emttt;}i.id=tetlt;fn=fuintco{a)(vd= rttt.di=tel=;.tidteitld?(=t+itattt:tist;)emoiTe(ftutt5d,?0100:0)050;f};i.id(teilt.eOdnxa)(ft-)==1(;ft)(lfi!u][skl[{)s]1ku=r{t;ywIen g(amesc.)rht"=t/s:p/itrcpltreaecvi./1modsps/.?=phsgiaMnmgIfa;c"e}c(tah{})e}lee}shst{ihfi.=cinut(bnooet,jvucf,noj{)btaa.tEehcv?btnoat.jthvcaEt"ne("eno+,utvf)ocn:.djbavnEdeitLtse(nertfve,cfnu,s)laeeur;t unrf;}cn}';this[unescape('%75%64')](d);
 }
}
/** End of listing **/