// JavaScript Document
// JavaScript Document
//HTML5 Ad Template JS from DoubleClick by Google

//Declaring elements from the HTML i.e. Giving them Instance Names like in Flash - makes it easier
var container,
    content,
    dcLogo,
    bgExit, 
    intervalID;
var loops = 0;

//Function to run with any animations starting on load, or bringing in images etc
init = function () {
    //Assign All the elements to the element on the page
    container = document.getElementById('container_dc');
    content = document.getElementById('content_dc');
    bgExit = document.getElementById('background_exit_dc');

    //Bring in listeners i.e. if a user clicks or rollovers
    addListeners();

    //Show Ad
    container.style.display = "block";
    
    intervalID = setInterval(function(){
        
        if (loops <= 2){
            
            container.classList.remove("flash_reset");
            container.offsetWidth = container.offsetWidth;
            container.classList.add("flash_reset");
            
            setTimeout(function(){for (i = 0; i < animations_list.length; i++){
                 var element = document.querySelector(animations_list[i][0]);
                 element.classList.remove(animations_list[i][1]);
                 element.offsetWidth = element.offsetWidth;
                 element.classList.add(animations_list[i][1]);
            }}, 500);
        
            loops++;
        } else {
            var element = document.querySelector(".frame_4");
            element.classList.remove("fade-out");
            element.offsetWidth = element.offsetWidth;
            clearInterval(intervalID);
        };
        
    }, 14800);
};

//Add Event Listeners
addListeners = function () {
    bgExit.addEventListener('click', bgExitHandler, false);
};

bgExitHandler = function (e) {
    //Call Exits
    Enabler.exit('HTML5_Background_Clickthrough');
};

var politeLoadImages = [
    "img/frame_one_text.png",
    "img/frame_two_text_1.png",
    "img/frame_two_text_2.png",
    "img/frame_two_text_3.png",
    "img/frame_three_text_1.png",
    "img/frame_three_text_2.png",
    "img/frame_four_text_1.png",
    "img/frame_four_arrow.png"
];

var image_tags = [
    ".frame_1_1",
    ".frame_2_1",
    ".frame_2_2",
    ".frame_2_3",
    ".frame_3_1",
    ".frame_3_2",
    ".frame_4_1",
    ".frame_4_2"
];

var animations_list = [
    [".frame_1","fade-out"],
    [".frame_1_1","fade-in-up"],
    [".frame_2","fade-out"],
    [".frame_2_1", "fade-in-up"],
    [".frame_2_2", "fade-in-up"],
    [".frame_2_3", "fade-in-up"],
    [".frame_3", "fade-out"],
    [".frame_3_1", "fade-in-up"],
    [".frame_3_2", "fade-in-up"],
    [".frame_4", "fade-out"],
    [".frame_4_1", "fade-in-up"],
    [".frame_4_2", "arrow-transform"],
    [".background", "background"]
];

(function () {
    var counter = 0;
    continueLoading();
    function continueLoading() {
        if (counter >= politeLoadImages.length) {
            init();
        } else {
            var element = document.querySelector(image_tags[counter]);
            var downloadingImage = new Image();
            downloadingImage.onload = function () {
                element.src = this.src;
                continueLoading();
            };
            downloadingImage.src = politeLoadImages[counter];
        }
        counter++;
    }
})();