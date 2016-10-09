// ELEMENTS/HOLDERS //

var Element = function(posX, posY, width, height, holder) {
    var that = this;

    this.dom_element = document.createElement('div');
    this.dom_element.className = "node_holder";
    this.dom_element.style.borderRadius = "5px";
    this.dom_element.style.position = "absolute";
    this.dom_element.style.border = "1px solid";
    this.dom_element.style.left  = posX + "px";
    this.dom_element.style.top = posY + "px";
    this.dom_element.style.width  = width + "px";
    this.dom_element.style.height = height + "px";
    // this.dom_element.style.overflow = "hidden";
    this.dom_element.style.backgroundColor = "#D3D3D3";

    this.nodes = []; // nodes holder

    holder.appendChild(this.dom_element);

    // ----- JQUERY SET DRAGGABLE ----- //

    $(this.dom_element).mousedown(function(event){ 
        if(event.target !== that.dom_element){ 
            return;
        } else {
            $(builder_ui).removeClass("glow");
            if(button_down){
                that.create_nodes(12, button_down);
            }
        }
    });

    // -------------------------------- //

    this.set_dragability = function(){
        $(that.dom_element).draggable({
            cancel: ".node",
            stack: ".node_holder",
            containment: '.ui_handler',
            cursor: 'move'
        });
    };

    this.set_node_functionality = function(){
        for (var i = 0; i < that.nodes.length; i++) {
            that.nodes[i].set_functionality();
        }
    };

    this.create_nodes = function(nodes_size, ui_button){

        this.nodes_size = nodes_size;

        // ----------------------------------- //
        // AGAIN ADJUSTING FOR THE BORDER SIZE //
        // ----------------------------------- //

        var position = { x: mouseX, y: mouseY };
        var node_type = ui_button.className.split(/\s+/)[0];

        this.nodes.push( new Node( position, this.nodes_size, this.dom_element, node_type) );
        add_node_button.disabled = false; 

        // ----------------------------------------- //
        // DEPRICATED RANDOM PLACEMENT FUNCTIONALITY //
        // ----------------------------------------- //

        // var m = 0;
        // var position;  
        // var positionsFull = Math.floor((height-5)/(this.nodes_size + 3))*2;
        // for (var i = 0; i < positionsFull; i++) {
        //     if( i >= ( positionsFull/2 ) ){
        //         position = { x:( width - (this.nodes_size) - 5), y:( m*(this.nodes_size + 3) + 3 )};
        //         this.nodes.push( new Node( position, this.nodes_size, this.dom_element, undefined , true, width) );
        //         m++;
        //     } else {
        //         position = { x:( 5 ), y:( i*(this.nodes_size + 3) + 3 ) };
        //         this.nodes.push( new Node( position, this.nodes_size, this.dom_element, undefined, false, width) );
        //     }
        // }

        // ----------------------------------------- //

    };
};

// NODES/GRID_CONNECTORS //

var Node = function(position, size, holder, type) {    
    var that = this;

    this.type = type;
    this.id = index++; // global id for faster sorting
    this.size = size;
    this.holder = holder;
    this.position = position;
    this.connection = undefined;
    this.left = position.x > parseInt(holder.style.width)/2 ? false : true;

    this.node = document.createElement('div');
    this.node.style.position = "absolute";
    this.node.className = "node";
    this.node.style.width  = size + "px";
    this.node.style.height = size + "px";
    this.node.style.top = (position.y - size/2) + "px";
    this.node.style.left  = (position.x - size/2) + "px";
    this.node.style.backgroundImage = "url(nodes/" + this.type + ".svg)";

    this.holder.appendChild( this.node );

    this.set_functionality = function(){

        $(that.node).mousedown(function(){
            document.body.style.cursor = "pointer";

            if( that.connection !== undefined ){
                var connection = [that, that.connection].sort( function(a, b) {
                    return (a.id - b.id);
                });
                update_rendering_array(connection, false);
            }

            mouse_down = true;
            begin_node = that;

            // STARTING AN INTERVAL FOR THE TRACE_SPLINE DRAWING //

            trace_drawer = setInterval(function(){
                if(mouse_down === true){

                    ctx_trace.clearRect(0,0,700,500);
                    draw_spline(begin_node, [ mouseX, mouseY ], ctx_trace);
                
                } else {

                    clearInterval(trace_drawer);
                    trace_drawer = undefined;
                    ctx_trace.clearRect(0,0,700,500);
                }
            }, 50);
        });

        $(that.node).mouseover(function(){
            if(begin_node !== undefined && begin_node.holder !== that.holder){
                fill_color = that.type === begin_node.type ? "green" : "red";  
            }
        });

        $(that.node).mouseleave(function(){
            fill_color = "grey";
        });

        $(that.node).mouseup(function(){
            document.body.style.cursor = "auto";
            mouse_down = false;

            // ADDING OR DESTROYING A CONNECTION //

            if ( that.type === begin_node.type && that.holder !== begin_node.holder ){

                if ( (that.connection === undefined && begin_node.connection === undefined) || (that.connection !== begin_node.connection)) {
                    var connection = [begin_node, that].sort( function(a, b){ return (a.id - b.id); });
                    update_rendering_array(connection, true);
                }

                clearInterval(trace_drawer);
                trace_drawer = undefined;
                ctx_trace.clearRect(0,0,700,500);

            } else {

                clearInterval(trace_drawer);
                trace_drawer = undefined;
                ctx_trace.clearRect(0,0,700,500);
                mousedown = false;

            }
        });
    };
};