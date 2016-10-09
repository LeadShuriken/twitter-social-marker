/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.addEventListener("DOMContentLoaded", function (event) {

    //DUMMY CODE TO BE REPLACED BY USER DATA
    var photos_url = new Array('assets/img/Whatever Man.jpg',
            'assets/img/Cookie Monster.jpg',
            'assets/img/Fussy Red.jpg',
            'assets/img/Food In Here.jpg',
            'assets/img/Duno Where.jpg',
            'assets/img/Bored A Lot.jpg');

    ko.bindingHandlers.placeholder = {
        init: function (element, valueAccessor) {
            var placeholderValue = valueAccessor();
            ko.applyBindingsToNode(element, {attr: {placeholder: placeholderValue}});
        }
    };

    ko.bindingHandlers.executeOnEnter = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var callback = valueAccessor();
            $(element).keypress(function (event) {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    callback.call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };

    videoComment = function (comment_messege) {
        var _self = this;

        _self.get_time = function () {
            var date = new Date();
            var month = date.getMonth();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var amORpm = hours > 12 ? "PM" : "AM";
            if (hours > 12)
                hours -= 12;
            var monthname = new Array("January", "February", "March", "Aprill", "May", "June", "July", "August", "September", "October", "November", "December");
            return monthname[month] + " " + day + ", AT " + hours + ":" + minutes + " " + amORpm;
        };

        _self._user_photo = (function () {
            //var xmlHttp = new XMLHttpRequest();
            //xmlHttp.open("POST", theUrl, false); // SINCRONOUS
            //xmlHttp.send(null);
            // TODO SOME FILTERING TO MASSAGE RESPONSE TEXT 
            //var needed_info = xmlHttp.responseText;
            return photos_url[Math.floor(Math.random() * photos_url.length)];
        })();

        _self._user_name = _self._user_photo.match(/([^\/]+)(?=\.\w+$)/)[0];

        _self.comment_replies = ko.observableArray([]);
        _self.tempInput = ko.observable("");
        _self.toWhom = ko.observable("");
        _self.comment_time = ko.observable(_self.get_time());
        _self.comment_id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
        _self.comment_body = ko.observable(comment_messege);
        _self.to_comment = ko.observable("none");
        _self.comment_reply = ko.observable("Reply...");

        _self.change_comment_state = function (data, event) {
            var target;
            if (event.target)
                target = event.target;
            else if (event.srcElement)
                target = event.srcElement;
            if (target.nodeType == 3) // defeat Safari bug
                target = target.parentNode;
            switch (target.innerHTML) {
                case "COMMENT":
                    _self.comment_reply("Reply...");
                    break;
                case "PHOTO":
                    _self.comment_reply("Photo...");
                    break;
                case "FEEDBACK":
                    _self.comment_reply("Feedback...");
                    break;
                default:
                    _self.comment_reply("Reply...");
                    break;
            }
        };

        _self.show_comments = function (data, event) {
            _self.comment_reply("Reply...");
            _self.tempInput("");
            _self.to_comment(_self.to_comment() === "none" ? "inline-block" : "none");
        };

        _self.reply_comment_reply = function (data, event) {
            var target;
            if (event.target)
                target = event.target;
            else if (event.srcElement)
                target = event.srcElement;
            if (target.nodeType == 3) // defeat Safari bug
                target = target.parentNode;
            _self.show_comments();
            _self.comment_reply("Reply...");
            _self.tempInput(target.innerHTML + " ");
            _self.toWhom(target.innerHTML);
        };

        _self.addComment_reply = function (data, event) {
            if (event.keyCode == 13) {
                var temp = _self.tempInput();
                var to_whom = _self.toWhom();
                temp = temp.replace(to_whom, "");
                _self.tempInput("");
                _self.toWhom("");
                _self.to_comment("none");
                _self.comment_replies.unshift(function () {
                    this.user_photo = photos_url[Math.floor(Math.random() * photos_url.length)];
                    this.user_name = this.user_photo.match(/([^\/]+)(?=\.\w+$)/)[0];
                    this.comment_time = _self.get_time();
                    this.comment_id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
                    this._comment_reply_text = temp;
                    this._reply_to_whom = to_whom;
                });
            }
            return true;
        };
    };

});