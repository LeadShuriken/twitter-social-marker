// INITIALISING GLOBALS //

var ctx,
    ctx_trace,
    begin_node,
    trace_drawer,
    mouseX,
    mouseY,
    mouse_down,
    button_down;

// INITIALISING BUILDER ELEMENTS //

var base_button,
    nexa_button,
    circle_button,
    square_button,
    element_builder,
    builder_element_holder,
    add_node_button;

// INTIALISE RENDERING VARS //

var index = 0;           // id index of the element               
var node_grids = [];     // array of grid connections
var element_array = [];  // array of elements inside the scene
var fill_color = "grey"; // point info collor

// MAIN FUNCTION //

var main = function(){

    // CANVAS SET UP //

    canvas = document.getElementsByClassName('node_wires_holder')[0];
    canvas_trace = document.getElementsByClassName('wire_traces')[0];
    element_builder = document.getElementsByClassName('element_builder')[0];
    builder_element_holder = document.getElementsByClassName('builder_element_holder')[0];

    canvas.width = canvas_trace.width = 700;
    canvas.height = canvas_trace.height = 500;

    element_builder.height = 300;
    element_builder.width = 200;

    ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.lineCap= "round";

    ctx_trace = canvas_trace.getContext('2d');
    ctx_trace.setLineDash([15, 3]);
    ctx_trace.strokeStyle = 'black';
    ctx_trace.lineCap= "round";
    ctx_trace.lineWidth = 1;

    bld_ctx_trace = element_builder.getContext('2d');
    bld_ctx_trace.setLineDash([15, 3]);
    bld_ctx_trace.strokeStyle = 'black';
    bld_ctx_trace.lineCap= "round";
    bld_ctx_trace.lineWidth = 1;

    // TOP LEVEL UI HANDLING //

    var ui_handler = document.getElementsByClassName("ui_handler")[0];
   
    $(ui_handler).mouseleave(function(){
        fill_color = "grey";
        document.body.style.cursor = "auto";
        clearInterval(trace_drawer);
        trace_drawer = undefined;
        ctx_trace.clearRect(0,0,700,500);
        mouse_down = false;
    });
    
    $(ui_handler).mouseup(function(){
        fill_color = "grey";
        clearInterval(trace_drawer);
        trace_drawer = undefined;
        ctx_trace.clearRect(0,0,700,500);
        mouse_down = false;
    });

    $(ui_handler).mousemove(function(event){
        // Adjusting for offset and border width //
        mouseX = event.clientX - ui_handler.offsetLeft - 20;
        mouseY = event.clientY - ui_handler.offsetTop - 20;
     });

    add_node_button = document.getElementsByClassName("add_node_button")[0];

    set_builder();
    render();
};