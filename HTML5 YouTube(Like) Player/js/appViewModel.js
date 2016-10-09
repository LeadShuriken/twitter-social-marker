/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.addEventListener("DOMContentLoaded", function (event) {
  
    function AppViewModel() {
        var self = this;

        self.tempInput = ko.observable("");
        self.youtubeURL = ko.observable("");

        self.youTubeApiObject = ko.observable(new youTubeApiObject("TFKdsaflLlw"));
        self.comments = ko.observableArray([]);
        
        self.deleteVideo = function() {
            self.youtubeURL("");
            self.tempInput("");
            self.youTubeApiObject().youtubeController().clearVideo();
            self.youTubeApiObject().youtubeController().stopVideo();
            self.youTubeApiObject().youtubeController().mute();
            self.youTubeApiObject().youtubeController().loadVideoById(self.youTubeApiObject().baseURL());
            self.youTubeApiObject().showPlayerControllers(false);
        };
        
        self.addComment = function (data, event) {
            if (event.keyCode == 13) {
                var temp = self.tempInput();
                self.tempInput("");
                self.comments.unshift(new videoComment(temp));
            }
            return true;
        };

        self.initVideo = function (data, event) {
            if (event.keyCode == 13) {
                var temp_url = self.youtubeURL();
                if (temp_url !== undefined && temp_url.split("=")[1].length === 11) {
                    temp_url = temp_url.split("=")[1];
                    self.youTubeApiObject().initVideo(temp_url);
                    
             }};
             return true;
        };
    };
    ko.applyBindings(new AppViewModel());
});