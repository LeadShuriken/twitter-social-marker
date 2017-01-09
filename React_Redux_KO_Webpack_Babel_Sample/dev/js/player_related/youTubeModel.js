/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 Created on : Sep 29, 2015, 9:33:15 PM
 Author     : Deian
 */

var ko = require("knockout");
document.addEventListener("DOMContentLoaded", function(event) {
    ko.bindingHandlers.hoverVisible = {
        init: function(element, valueAccessor, allBindingsAccessor) {

            function showOrHideElement(show) {
                var canShow = ko.utils.unwrapObservable(valueAccessor());
                element.style.display = (element.style.display == 'none') ? 'block' : 'none';
            }

            var hideElement = showOrHideElement.bind(null, false);
            var showElement = showOrHideElement.bind(null, true);
            var hoverTarget = document.getElementById(ko.utils.unwrapObservable(allBindingsAccessor().hoverTargetId));
            ko.utils.registerEventHandler(hoverTarget, "mouseover", showElement);
            ko.utils.registerEventHandler(hoverTarget, "mouseout", hideElement);
            hideElement();
        }
    };
    ko.bindingHandlers.hoverTargetId = {};

    ko.bindingHandlers.stopBubble = {
        init: function(element) {
            ko.utils.registerEventHandler(element, "click", function(event) {
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            });
        }
    };

    var youTubeApiObject = function(url) {
        var _self = this;

        _self.showVolume = ko.observable(true);
        _self.showPlayerControllers = ko.observable(false);
        _self.elapsed = ko.observable("");
        _self.palying = ko.observable(false);
        _self.baseURL = ko.observable(url);
        _self.done = ko.observable(false);

        _self.youtubeController = ko.observable("");

        _self.seekValue = ko.observable("");
        _self.volumeValue = ko.observable(2);

        _self.initialiseYoutubePlayer = ko.computed(function(data, event) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function() {
                var player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: _self.baseURL(),
                    playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': url },
                    events: {
                        'onReady': _self.onPlayerReady,
                        'onStateChange': _self.onPlayerStateChange
                    }
                });
                _self.youtubeController(player);
            };
        }, _self);

        _self.onPlayerReady = function(event) {
            _self.palying(true);
            if (!event.target.isMuted() && event.target.mute())
                event.target.playVideo();
        };

        _self.seekTo = function() {
            var seek_seconds = _self.youtubeController().getDuration() * (_self.seekValue() / 100);
            _self.youtubeController().seekTo(seek_seconds);
            return true;
        };

        _self.pause = function() {
            _self.update.stop();
            return true;
        };

        _self.play = function() {
            _self.update.start();
            return true;
        };

        var previousState;
        _self.muteToggle = function() {
            if (!_self.youtubeController().isMuted()) {
                previousState = _self.volumeValue();
                _self.youtubeController().mute();
                _self.showVolume(false);
                _self.volumeValue(0);
            } else {
                _self.volumeValue(previousState);
                _self.youtubeController().unMute();
                _self.showVolume(true);
            }
        };

        _self.volumeValue.subscribe(function(newVolume) {
            _self.youtubeController().setVolume(parseInt(newVolume) * 10);
        }.bind(_self));

        _self.volumeImage = ko.pureComputed(function() {
            var volume = parseInt(_self.volumeValue());
            if (volume === 0) {
                return "assets/glyphs/glyphicons-183-mute.png";
            } else if (volume > 0 && volume <= 7) {
                return "assets/glyphs/glyphicons-184-volume-down.png";
            } else if (volume > 7) {
                return "assets/glyphs/glyphicons-185-volume-up.png";
            } else {
                return "assets/glyphs/glyphicons-184-volume-down.png"
            }
        }, _self);;

        _self.playPause = function(data, event) {
            if (!_self.palying()) {
                _self.youtubeController().playVideo(),
                    _self.palying(true),
                    event.target.style.backgroundImage = 'url("assets/glyphs/glyphicons-175-pause.png")';
            } else {
                _self.youtubeController().pauseVideo(),
                    _self.palying(false),
                    event.target.style.backgroundImage = 'url("assets/glyphs/glyphicons-174-play.png")';
            }
        };

        _self.initVideo = function(url) {
            try { _self.update.stop() } catch (err) {};
            _self.youtubeController().loadVideoById(url);
            _self.palying(true);
            _self.youtubeController().unMute();
            _self.youtubeController().setVolume(_self.volumeValue() * 10);
            _self.update = setVariableInterval(function() {
                var time_left = _self.youtubeController().getDuration() - _self.youtubeController().getCurrentTime();
                var min = zero_base(((time_left / 60) << 0).toFixed(0));
                var sec = zero_base(((time_left) % 60).toFixed(0));
                _self.elapsed('-' + min + ':' + sec);
                _self.seekValue((_self.youtubeController().getCurrentTime() / _self.youtubeController().getDuration()) * 100);
            }, 500);
            _self.update.start();
            _self.showPlayerControllers(true);
        };

        _self.editVideo = function() {
            _self.palying(false);
            _self.showPlayerControllers(false);
            _self.youtubeController().mute();
        };

        _self.delete_video = function() {
            _self.youtubeController().clearVideo();
            _self.youtubeController().mute();
            _self.youtubeController().loadVideoById("TFKdsaflLlw");
            _self.showPlayerControllers(false);
        };

        _self.onPlayerStateChange = function(event) {
            if (event.data == YT.PlayerState.PLAYING && !_self.done()) {
                document.getElementById('fader').disabled = false;
            } else if (event.data == YT.PlayerState.PAUSED) {

            } else if (event.data == YT.PlayerState.ENDED) {
                _self.palying(false);
                var play_button = document.getElementById('play_pause');
                document.getElementById('fader').disabled = true;
                play_button.style.backgroundImage = 'url("assets/glyphs/glyphicons-82-refresh.png")';
            };
        };
    };
});
