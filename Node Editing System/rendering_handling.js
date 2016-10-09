// REQUEST ANIMATION BINDING //

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// RENDER LOOP //

var render = function(){

    ctx.clearRect(0,0,700,500);

    for (var i = 0; i < node_grids.length; i++) {  

        var first_node = node_grids[i][0];
        var second_node = node_grids[i][1];

        draw_spline( first_node , second_node , ctx);   
    }

    requestAnimationFrame(render);
};

var update_rendering_array = function (connection_array, add_array){

    for (var i = 0; i < node_grids.length; i++) {
        for (var n = 0; n < 2; n++) {
            if(node_grids[i][n].id === connection_array[0].id || node_grids[i][n].id === connection_array[1].id ){
                node_grids[i][0].connection = undefined;
                node_grids[i][1].connection = undefined;
                node_grids.splice(i, 1);
                break;
            }
        }
    }

    if(add_array){
        connection_array[0].connection = connection_array[1];
        connection_array[1].connection = connection_array[0];
        node_grids.push(connection_array);
    }
};