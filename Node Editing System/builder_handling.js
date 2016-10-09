
var set_builder = function(){

    base_button = document.getElementsByClassName("base")[0];
    nexa_button = document.getElementsByClassName("nexa")[0];
    circle_button = document.getElementsByClassName("circle")[0];
    square_button = document.getElementsByClassName("square")[0];

    builder_ui = document.getElementsByClassName("builder_ui")[0];

    var ui_elements = [nexa_button, circle_button, square_button];
    for (var i = 0; i < ui_elements.length; i++) {
        ui_elements[i].style.pointerEvents = "none";
    }

    // MOUSEDOWN EVENTS //

    $(element_builder).mousedown(function(){

        if(!button_down && !($(builder_element_holder).children().length) ){
            
            $(builder_ui).addClass("glow");
            document.body.style.cursor = "pointer";
            begin_node = [mouseX, mouseY];
            mouse_down = true;
            build_element(undefined, ui_elements);

        }
    });

    for (var i = 0; i < ui_elements.length; i++) {
        $(ui_elements[i]).mousedown(function(){
            button_down = this;

            $(builder_ui).addClass("glow");
            var ui_sender = ui_elements.slice(0);
            ui_sender[ui_elements.indexOf(this)] = base_button;

            set_button(this, true, ui_sender);
        });
    }

    // MOUSELEAVE EVENTS //

    $(element_builder).mouseleave(function(){
        bld_ctx_trace.clearRect(0,0,200,300);
        $(builder_ui).removeClass("glow");
        document.body.style.cursor = "auto";
        
        clearInterval(trace_drawer);
        trace_drawer = undefined;
        mouse_down = false;
        
        begin_node = undefined;
    });

    // MOUSEUP EVENTS //

    $(element_builder).mouseup(function(){
        bld_ctx_trace.clearRect(0,0,200,300);
        document.body.style.cursor = "auto";
        $(builder_ui).removeClass("glow");        
        
        clearInterval(trace_drawer);
        trace_drawer = undefined;
        mouse_down = false;

        build_element([mouseX, mouseY], ui_elements);
    });

    // MOUSEENTER EVENTS //

    $(element_builder).mouseenter(function(){
        bld_ctx_trace.clearRect(0,0,200,300);
        $(builder_ui).removeClass("glow");

        clearInterval(trace_drawer);
        trace_drawer = undefined;
        mouse_down = false;

        trace_drawer = begin_node = end_node = undefined;
    });

    // MOUSEMOVE EVENTS //

    $(element_builder).add(builder_element_holder).mousemove(function(event){
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });

    // ------------------------------------------- //

    set_button(base_button, true, [nexa_button, circle_button, square_button]);
};

var build_element = function(end_node, ui_elements){

    if( end_node === undefined ){

        set_button(base_button, true, [nexa_button, circle_button, square_button]);

        trace_drawer = setInterval(function(){
                if(mouse_down === true){
                    bld_ctx_trace.clearRect(0,0,200,300);
                    draw_box(begin_node, [ mouseX, mouseY ], bld_ctx_trace);
                } else {
                    clearInterval(trace_drawer);
                    trace_drawer = undefined;
                    bld_ctx_trace.clearRect(0,0,200,300);
                }
        }, 50);

    } else {

        if( begin_node !== undefined && end_node !== undefined ){

            bld_ctx_trace.clearRect(0,0,200,300);

            var width = Math.floor(end_node[0] - begin_node[0]);
            var height = Math.floor(end_node[1] - begin_node[1]);

            if( width > 20 || height > 20 ){ 
                element_array.push( new Element(begin_node[0], begin_node[1], width, height, builder_element_holder) );

                set_button(base_button, false, [nexa_button, circle_button, square_button]);

                set_button(base_button, true, [base_button]);

                begin_node = undefined;
                end_node = undefined;

                for(var i = 0; i < ui_elements.length; i++) {
                    ui_elements[i].style.pointerEvents = "auto";
                }

                builder_element_holder.style.display = "block";
            } else {
                alert("Base too Small !");
            }
        }
    }
};

var add_element_to_playpen = function() {

    var node_el = element_array[element_array.length - 1];

    node_el.dom_element.style.left = "10px";
    node_el.dom_element.style.top = "10px";
    
    $(node_el.dom_element).appendTo(".node_element_holder");

    node_el.set_dragability();
    node_el.set_node_functionality();

    var ui_elements = [nexa_button, circle_button, square_button];
    for (var i = 0; i < ui_elements.length; i++) {
        ui_elements[i].style.pointerEvents = "none";
    }

    builder_element_holder.style.display = "none";

    button_down = undefined;

    add_node_button.disabled = true; 

    set_button(base_button, true, [nexa_button, circle_button, square_button]);
};

var set_button = function ( dom_button, pressed, lock_bt_array){

    if ( pressed ) {

        dom_button.style.borderStyle = "inset";
        dom_button.style.backgroundColor = "#D3D3D3";

        for (var i = 0; i < lock_bt_array.length; i++) {
            lock_bt_array[i].style.borderStyle = "outset";
            lock_bt_array[i].style.backgroundColor = "grey";
        }

    } else {

        dom_button.style.borderStyle = "outset";            
    
        for (var i = 0; i < lock_bt_array.length; i++) {
            lock_bt_array[i].style.borderStyle = "outset";
            lock_bt_array[i].style.backgroundColor = "#D3D3D3";
        }
    }
};