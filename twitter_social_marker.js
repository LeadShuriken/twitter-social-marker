//THIS METHOD IS BORROWED FROM A GUY WHO IS CALLED: THE CHAMP!!
function myPluginLoadEvent(func) {
    // assign any pre-defined functions on 'window.onload' to a variable
    var oldOnLoad = window.onload;
    // if there is not any function hooked to it
    if (typeof window.onload != 'function') {
        // you can hook your function with it
        window.onload = func
    } else { // someone already hooked a function
        window.onload = function() {
            // call the function hooked already
            oldOnLoad();
            // call your awesome function
            func();
        }
    }
}

myPluginLoadEvent(function() {

    //A METHOD GUARDING THE MARKER FROM BEING CREATED
    //FOR ELEMENTS CHILDREN OF A PARENT WITH SOME CLASS
    // AKA "EXCLUDED_CLASS_TAG"
    function guardedElement(el, tag) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.classList && el.classList.contains(tag))
                return true;
        }
        return false;
    }

    //A SIMPLE METHOD HIDING THE MARKER
    //AND RESETTING THE TWEET VALUE
    function hideButton(){
        var a = document.getElementById('twitterPack');
        var b = document.getElementById('twitterButton');
        if (a) {
            a.style.display = 'none';
        }
        if (b) {
            b.href = WEB_INTENT_URL;
        }
    }

    //A SIMPLE METHOD HIDING THE MARKER
    //AND RESETTING THE TWEET VALUE
    function updateTweetText(value){
        var b = document.getElementById('twitterButton');
        if (b) {
            b.href = WEB_INTENT_URL + "?text=" + value;
        }
    }

    var TWEET_VALUE; //LOCAL SCOPE TWEET VALUE
    var TWEETBUTTON_SIZE = 30; //USED FOR ADJUSTING POSITION
    var EXCLUDED_CLASS_TAG = 'not-this-text'; //LOOK AT 'guardedElement'

    var WEB_INTENT_URL = 'https://twitter.com/intent/tweet'; //TWITTER SHARING URL

    // THE TWITTER SDK
    window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));

    //INVISIBLE SPANS ID'S (SPANS USED TO MARK START AND END OF SELECTION)
    var markerId_1 = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);
    var markerId_2 = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

    var markerEl_1, markerEl_2, selectionEl, stop_update;

    //THIS METHOD IS BORROWED FROM: TIM DOWN
    //UPDATED TO FEATURE BOTH SIDES OF THE RANGE
    //UPDATED TO HANDLE TWEET VALUE
    var setTwitterButton = function(){
        if(stop_update){
            stop_update = false;
            return;
        }

        var sel, start_range, end_range;
        if (document.selection && document.selection.createRange) {
             //THIS IS IE: ONLY!!
             if (document.selection.type == "Text") {
                 //I'VE NO MEANS TO IMPLEMENT THE GUARD HERE (THANKFULLY)
                 //JUST KIDDING :: TOO LAZY
                 TWEET_VALUE = document.selection.createRange().htmlText;
             }

             if (TEMP_TWEET_VALUE.length > 0 && TEMP_TWEET_VALUE !== TWEET_VALUE) {

                 TWEET_VALUE = TEMP_TWEET_VALUE;

                 start_range = document.selection.createRange().duplicate();
                 end_range = start_range.cloneRange();

                 start_range.collapse(true);
                 end_range.collapse(false);

                 start_range.pasteHTML('<span id="' + markerId_1 + '" style="position: relative;">&#xfeff;</span>');
                 end_range.pasteHTML('<span id="' + markerId_2 + '" style="position: relative;">&#xfeff;</span>');

                 markerEl_1 = document.getElementById(markerId_1);
                 markerEl_2 = document.getElementById(markerId_2);
             } else {
                 selectionEl.style.display = 'none';
                 return;
             }
        } else if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {

                //CREATING THE TEXT ARRAY
                var tweetArray = [];
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    var tempRange = sel.getRangeAt(i);
                    if(!guardedElement(tempRange.commonAncestorContainer.parentNode, EXCLUDED_CLASS_TAG)){
                        tweetArray.push(tempRange.cloneContents().textContent);
                    } else {
                       hideButton();
                       return;
                    }
                }

                //SOME MAGIC TO MAKE IT TOKENIZABLE
                TEMP_TWEET_VALUE = tweetArray.join('').replace(/[\r?\n|\r]\s+/gm, '%20');

                //SO IF YOU HAPPEN TO CLICK AGAIN OVER A SELECTION
                //WHICH WAS ALREADY MADE YOU ARE NOT PASSING THROUGH
                if (TEMP_TWEET_VALUE.length > 0 && TEMP_TWEET_VALUE !== TWEET_VALUE) {

                    TWEET_VALUE = TEMP_TWEET_VALUE;

                    if (sel.getRangeAt) {
                        start_range = sel.getRangeAt(0).cloneRange();
                    } else {
                        //SETTING RANGE AND ACCOUNTING FOR BACKWARDS SELECTION
                        start_range = document.createRange();
                        start_range.setStart(sel.anchorNode, sel.anchorOffset);
                        start_range.setEnd(sel.focusNode, sel.focusOffset);

                        if (start_range.collapsed !== sel.isCollapsed) {
                            start_range.setStart(sel.focusNode, sel.focusOffset);
                            start_range.setEnd(sel.anchorNode, sel.anchorOffset);
                        }
                    }

                    var end_range = start_range.cloneRange();
                    //COLLAPSE TO THE START = YOU ARE AT THE START
                    //COLLAPSE TO THE END = YOU ARE AT THE END
                    start_range.collapse(true);
                    end_range.collapse(false);

                    markerEl_1 = document.createElement("span");
                    markerEl_2 = document.createElement("span");

                    markerEl_1.id = markerId_1;
                    markerEl_2.id = markerId_2;

                    //THE INVISIBLE SPANS
                    markerEl_1.appendChild(document.createTextNode('\ufeff'));
                    markerEl_2.appendChild(document.createTextNode('\ufeff'));

                    start_range.insertNode(markerEl_1);
                    end_range.insertNode(markerEl_2);
                } else {
                    hideButton();
                    return;
                }
            }
        }

        if (markerEl_1 && markerEl_2) {
            // LAZY CREATING THE ELEMENTS
            if (!selectionEl) {
                selectionEl = document.createElement("div");
                selectionEl.id = 'twitterPack';
                selectionEl.style = 'position: absolute;' +
                            'z-index: 400;' +
                            'visibility: visible;' +
                            'transition: top 75ms ease-out,left 75ms ease-out;'+
                            'animation: pop-upwards 180ms forwards linear;';

                // THIS ENTIRE PART IS CRAZY BUT IT KEEPS IT ALL IN THE SAME FILE(PACKAGE)
                // DO MIND THAT "SOME" NPM/ETC DEV SERVERS WILL NOT HANDLE SVG SYNTAX IN A JS FILE
                // THAT'S COS MOST TIMES THEY ATTEMPT TO HANDLE IT ADHOCK FOR LIVE-RELOAD
                var live_server_svg = '<svg class="svgIcon-use" width="25" height="25" viewBox="0 0 25 25">' +
                    '<path d="M21.725 5.338c-.744.47-1.605.804-2.513 1.006a3.978 3.978 0 0 0-2.942-1.293c-2.22 ' +
                    '0-4.02 1.81-4.02 4.02 0 .32.034.63.07.94-3.31-.18-6.27-1.78-8.255-4.23a4.544 4.544 0 0 0-.574 ' +
                    '2.01c.04 1.43.74 2.66 1.8 3.38-.63-.01-1.25-.19-1.79-.5v.08c0 1.93 1.38 3.56 3.23 ' +
                    '3.95-.34.07-.7.12-1.07.14-.25-.02-.5-.04-.72-.07.49 1.58 1.97 2.74 3.74 2.8a8.49 8.49 ' +
                    '0 0 1-5.02 1.72c-.3-.03-.62-.04-.93-.07A11.447 11.447 0 0 0 8.88 21c7.386 0 11.43-6.13 ' +
                    '11.414-11.414.015-.21.01-.38 0-.578a7.604 7.604 0 0 0 2.01-2.08 7.27 7.27 0 0 1-2.297.645 ' +
                    '3.856 3.856 0 0 0 1.72-2.23"></path></svg>';

                var button_style = 'padding-right:4px;' +
                    'padding-left:6px;' +
                    'line-height:32px;' +
                    'border-width:0;' +
                    'background: rgba(0,0,0,0);' +
                    'border: 1px solid rgba(0,0,0,.15);';

                var arrow_clip_style = 'position: absolute;' +
                                       'bottom:-10px;' +
                                       'left:25%;' +
                                       'clip: rect(10px 20px 20px 0);';

                var highlightMenu_inner = 'position: relative;' +
                                        'background-image: linear-gradient(to bottom,rgba(49,49,47,.99),#262625);' +
                                        'background-repeat: repeat-x;' +
                                        'border-radius: 5px;';

                var highlightMenu_style = 'display: block;' +
                                        'width: 20px;' +
                                        'height: 20px;' +
                                        'background: #262625;' +
                                        'left:0px;' +
                                        'transform: rotate(45deg) scale(.5);';

                selectionEl.innerHTML = '<div style="' + highlightMenu_inner + '">' +
                    '<a id="twitterButton" class="twitter-share-button" ' +
                    'href="' + WEB_INTENT_URL + '" ' +
                    'style="' + button_style + '">' +
                    '<span style="fill:#55acee;position:relative;top:3px">' +
                    live_server_svg +
                    '</span>' +
                    '</a>' +
                    '<div style="' + arrow_clip_style + '">' +
                    '<span style="' + highlightMenu_style + '"></span>' +
                    '</div></div>';

                document.body.appendChild(selectionEl);

                // THIS HERE SAYS THAT: IF YOU PRESS THE TWITTER BUTTON DO NOT AKT ON FIRST MOUSE UP
                document.getElementById('twitterButton').addEventListener('mousedown', function(){
                    stop_update = true;
                });
            }

            var obj = markerEl_1;
            var left = 0, top = 0;
            do {
                left += obj.offsetLeft;
                top += obj.offsetTop;
            } while (obj = obj.offsetParent);

            // PUTTING THE BUTTON IN IT'S PLACE
            selectionEl.style.display = 'block';
            selectionEl.style.left = left + (markerEl_2.offsetLeft - markerEl_1.offsetLeft) / 2 - TWEETBUTTON_SIZE/2 + "px";
            selectionEl.style.top = top - TWEETBUTTON_SIZE * 1.5 + "px";

            updateTweetText(TWEET_VALUE);

            // CLEAN UP
            if (markerEl_1.parentNode) {
                markerEl_1.parentNode.removeChild(markerEl_1);
            }

            if (markerEl_2.parentNode) {
                markerEl_2.parentNode.removeChild(markerEl_2);
            }
        }
    }

    // CASES WHERE YOU DON"T WANT THE BUTTON SHOWN
    document.getElementsByTagName('BODY')[0].addEventListener('mouseup', setTwitterButton);
    document.getElementsByTagName('BODY')[0].addEventListener('mousedown', function(event){
        if (event.button === 1 || event.button === 2)
            hideButton();
    });

    // ATTEMPT TO ADJUST POSITION ON RESIZE : THIS IS HEAVY BUT LOOKS NICE
    window.addEventListener('resize', setTwitterButton);
});
