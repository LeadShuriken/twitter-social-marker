// -------------------- //
// SCROLLER PACKAGE 1.1 //
// -------------------- //
// 
// Changes/Additions : 
//
//      version 1.1: added posibility to choose the amount of lines to scroll on mousewheel and arrow press.
//      version 1.2: TODO...
//    
// Properties:
// 1. elem:
//     - the scrollbar element containing an the required html structure:
//         
//          <div class="elem" id="unique_id">
//             <div class="scroller" id="unique_id">
//                  < === > Place the srollable content (text, images) here. < === >
//             </div>
//             <div class="bar" id="unique_id">
//                 <div class="scrollbar" id="unique_id"></div>
//             </div>
//             <div class="arrow up" id="unique_id"></div>
//             <div class="arrow down" id="unique_id"></div>
//          </div>
//
// 2. adjustable:
//     - choose whether to scale the slider of the scroller to be proportionate
//       to the size of the scrollable content. If "false" the style values for
//       scrollbar class will be chosen.
//
// 3. lines - to scroll on arrow press and mousewheel:     
//     - the number of lines to scrool for the scroller on mousewheel scrool and arrow press.
//
// 4. banner_element (unique ID):     
//     - the banner container element. This is needed so that the mouse wheel
//       scrolls only the scrollbar of the banner while the mouse is over it.
//
// TODO: Test the fucnctionality in more projects:

var Scroller = function(elem, adjustable, scroll_lines, banner_element){

    // PROPERTIES //
    var that = this;
    that.autoScroll,
    that.initialScroll,
    that.moveIt,
    that.scrollSlider,
    that.scrollTrack,
    that.scroll_lines,
    that.holder,
    that.legal = undefined;

    that.scroller_package = elem;

    that.arrow = [];

    // CREATE DIV FUNCTION //
    this.create_div = function(c, cont) {
        var o = document.createElement('div');
        o.cont = cont;
        o.className = c;
        cont.appendChild(o);
        return o;
    };

    //CLEARING AUTOSCROLLING FUNCTIONALITY//
    this.cancelAutoScroll = function(event) {
        clearInterval(that.autoScroll);
        clearTimeout(that.initialScroll);
    };

    //HANDLING CLICK ON THE BAR FUNCTIONALITY//
    this.clickTrack = function(event) {
        var classes = event.target.className.split(" ");
        if ( classes.indexOf("bar") != -1 ){
            var scroll_offest = event.offsetY;

            // CLOSING TO THE EDGES FUNCTIONALITY //
            if ( scroll_offest <= that.scrollSlider.offsetHeight / 1.5 ) { scroll_factor = 0; }
                else if ( scroll_offest >= ( that.scrollTrack.offsetHeight - that.scrollSlider.offsetHeight ) ) { scroll_factor = 1; }
                    else scroll_factor = ( scroll_offest ) / ( that.scrollTrack.offsetHeight );

            clearInterval( that.autoScroll );
            clearTimeout( that.initialScroll );

            that.legal.scrollTop = ( that.legal.scrollHeight - that.scrollTrack.offsetHeight - ( that.legal.offsetHeight - that.scrollTrack.offsetHeight )) * ( scroll_factor ) - ( Math.cos( 3.14 * scroll_factor ) * that.scrollSlider.offsetHeight * 2 );
        }
    };

    // WATCHSCROLLING //
    this.watchScrolling = function(event) {
        var value_offset = Math.round( that.scrollTrack.offsetHeight / ( that.legal.scrollHeight/that.legal.offsetHeight ) );            // CREATING THE SIZE AS COMPARED TO THE SCROLLTRACK
        var modulator = ( Math.round( that.legal.scrollTop ) ) / ( that.legal.scrollHeight - that.legal.offsetHeight );                  // CREATING THE VALUE OFFSET FROM THE MODULATED VALUE
        var pixell_offset = Math.round( ( value_offset - that.scrollSlider.offsetHeight ) * ( modulator ) );                             // THE PIXEL OFFSET BETWEEN THE TWO VALUES
        var scroll_pixels = ( ( Math.round( this.scrollTop ) ) /  this.scrollHeight ) * ( that.scrollTrack.offsetHeight );
        
        that.scrollSlider.style.top = ( scroll_pixels + pixell_offset ) + "px";
    };

    // HANDLING CLICK ON THE BAR FUNCTIONALITY //
    this.dragIt = function(event) {
        if ( event.which != 2 ) {
            that.moveIt = true;
            clearInterval(that.autoScroll);
            clearTimeout(that.initialScroll);
            that.scrollSlider.style.transition = that.scrollSlider.style.webkitTransition = "auto";
        }
    };

    this.releaseIt = function(event) {
        if ( event.which != 2 ) {
            that.moveIt = false;
            event.stopPropagation();
            that.scrollSlider.style.transition = that.scrollSlider.style.webkitTransition = "top 0.3s";
        }
    };

    this.watchMove = function(event) {
        if (that.moveIt === true) {
            var scroll_offest = ( event.clientY ) - ( that.scroller_package.offsetTop + that.scrollTrack.offsetTop );
            var scroll_factor = ( scroll_offest / that.scrollTrack.offsetHeight );
            that.legal.scrollTop = ( that.legal.scrollHeight - that.scrollTrack.offsetHeight ) * ( scroll_factor ) - ( Math.cos( 3.14 * scroll_factor ) );
            // that.legal.scrollTop = ( that.legal.scrollHeight - that.scrollTrack.offsetHeight ) * ( scroll_factor ) - ( Math.cos( 3.14 * scroll_factor ) * that.scrollSlider.offsetHeight * 2);
        }
    };

    this.MouseWheelHandler = function(e) {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        that.legal.scrollTop -= delta*(that.legal.scrollHeight * ( ( parseFloat( that.legal.style.lineHeight ) / that.legal.scrollHeight ) * scroll_lines ) );
        return false;
    };

    this.MiddleMouseDown = function(e) {
        if( e.which === 2 ) {
            that.moveIt = true;
            that.scroller_package.style.cursor = "ns-resize";
            that.scrollSlider.style.transition = that.scrollSlider.style.webkitTransition = "top 0.3s";
            clearInterval(that.autoScroll);
            clearTimeout(that.initialScroll);
        }
    };
    
    this.MiddleMouseUp = function(e) {
        if( e.which === 2 ) {
            that.moveIt = false;
            that.scroller_package.style.cursor = "default";
            that.scrollSlider.style.transition = that.scrollSlider.style.webkitTransition = "auto";
        }
    };

    this.clickMove = function(event) {
        clearInterval(that.autoScroll);
        var target = event.target || event.srcElement;
        if(target.classList.contains("up")){
            that.legal.scrollTop -= that.legal.scrollHeight * ( ( parseFloat( that.legal.style.lineHeight ) / that.legal.scrollHeight ) * scroll_lines );
        } else if (target.classList.contains("down")){
            that.legal.scrollTop +=  that.legal.scrollHeight * ( ( parseFloat( that.legal.style.lineHeight ) / that.legal.scrollHeight ) * scroll_lines );
        }
    };

    this.doAutoScroll = function(div) {
        that.autoScroll = setInterval(that.doScroll, 60, div);
    };

    this.doScroll = function(div) {
        div.scrollTop += 1;
        if (div.scrollTop >= div.scrollHeight - div.offsetHeight) {
            clearInterval(that.autoScroll);
        }
    };

    // CONSTRUCTOR //
    this._constructor = function() {
        cont = document.getElementsByClassName(cont_id)[0];

        // adding new container into array
        ssb.aConts[ssb.N++] = cont;
        cont.sg = false;

        //creating scrollbar child elements
        cont.st = this.create_div('ssb_st', cont);

        // on mouse down processing
        cont.sb.onmousedown = function(e) {
            if (!this.cont.sg) {
                if (!e) e = window.event;

                ssb.asd = this.cont;

                this.cont.yZ = e.screenY;
                this.cont.sZ = cont.scrollTop;
                this.cont.sg = true;

                // new class name
                this.className = 'ssb_sb ssb_sb_down';
            }
            return false;
        };
    };

    // ADDING HANDLING //
    this.addHandling = function() {
        var a = that.legal.scrollHeight;
        var b = that.legal.offsetHeight;

        if ( adjustable ) { that.scrollSlider.style.height = 100/(a/b) + "%"; }
        
        that.initialScroll = setTimeout(function() { that.doAutoScroll(that.legal); }, 1000 );

        that.scrollTrack.addEventListener("click", that.clickTrack, false);

        that.legal.addEventListener("scroll", that.watchScrolling, false);
        
        document.addEventListener("mousemove", that.watchMove, false);
        document.addEventListener("mouseup", that.releaseIt, false);
        
        that.scrollSlider.addEventListener("mousedown", that.dragIt, false);
        that.scrollSlider.addEventListener("mouseup", that.releaseIt, false);

        if (that.holder.addEventListener) {
            // IE9, Chrome, Safari, Opera
            that.holder.addEventListener("mousewheel", that.cancelAutoScroll, false);
            that.holder.addEventListener("mousewheel", that.MouseWheelHandler, false);
            // Firefox
            that.holder.addEventListener("DOMMouseScroll", that.cancelAutoScroll, false);
            that.holder.addEventListener("DOMMouseScroll", that.MouseWheelHandler, false);
        } else { 
            that.holder.attachEvent("onmousewheel", that.MouseWheelHandler, false);
            that.holder.attachEvent("onmousewheel", that.cancelAutoScroll, false);
        }
        
        that.scroller_package.addEventListener("mousedown", that.MiddleMouseDown, false);
        document.addEventListener("mouseup", that.MiddleMouseUp, false);

        for (i = 0; i < that.arrow.length; i++) {
            that.arrow[i].addEventListener("click", that.clickMove, false);
        }
    };

    // INITIALIZATION // 
    (function() {

        that.holder = (banner_element !== "" && document.getElementById(banner_element)) ? document.getElementById(banner_element) : that.scroller_package;

        for (i = 0; i < that.scroller_package.childNodes.length; i++) {

            if( that.scroller_package.childNodes[i].classList !== undefined ){

                if ( that.scroller_package.childNodes[i].classList.contains("bar") ) 
                {   
                    that.scrollTrack = that.scroller_package.childNodes[i];
                    if( that.scroller_package.childNodes[i].classList !== undefined ){
                        for(m = 0; m < that.scroller_package.childNodes[i].childNodes.length; m++)
                        {
                            if ( that.scroller_package.childNodes[i].childNodes[m].classList !== undefined ) {
                                if ( that.scroller_package.childNodes[i].childNodes[m].classList.contains("scrollbar") ) 
                                {                   
                                    that.scrollSlider = that.scroller_package.childNodes[i].childNodes[m];
                                }
                            }
                        }
                    }
                }
                else if ( that.scroller_package.childNodes[i].classList.contains("scroller") )
                {
                    that.legal = that.scroller_package.childNodes[i];
                }
                else if ( that.scroller_package.childNodes[i].classList.contains("arrow") ){
                    that.arrow.push(that.scroller_package.childNodes[i]);
                } 
                else
                {
                    console.log("Undefined Style Element");
                }          
            }
        }

        if ( that.legal.style.fontSize === "" ) { that.legal.style.fontSize = "16px"; }
        if ( that.legal.style.lineHeight === "" ) { that.legal.style.lineHeight = ( ( parseFloat(that.legal.style.fontSize) * 1.1 ) + "px" ); }

        that.addHandling();
    })();
};