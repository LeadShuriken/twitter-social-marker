// HANDLING TRACER_SPLINE AND REGULAR SPLINE DRAWING //

var draw_spline = function (begin_node, end_node, context){

	context.beginPath();

    if(end_node.constructor === Array){

		var posX = end_node[0];
		var posY = end_node[1];

		var x_shift_1 = begin_node.left ? 1 : -1;
		
		var half_width_1 = parseInt(begin_node.holder.style.width)/2;

		var factor_1 = begin_node.left ? (begin_node.position.x - half_width_1)/half_width_1 : (half_width_1 - begin_node.position.x)/half_width_1; 

		var vert_1 = {  x:(parseInt(begin_node.holder.style.left) + begin_node.position.x + 2),
						y:(parseInt(begin_node.holder.style.top) + begin_node.position.y + 2) };

		var vert_2 = {  x:(parseInt(begin_node.holder.style.left) + begin_node.position.x + x_shift_1*(begin_node.size*10)*factor_1),
		                y:(parseInt(begin_node.holder.style.top) + begin_node.position.y) };

		context.beginPath();
		context.arc(vert_1.x - 1, vert_1.y - 1, 2, 0, 2*Math.PI, false);
		context.fill();

		context.bezierCurveTo(vert_1.x, vert_1.y, vert_2.x, vert_2.y, posX, posY);
		context.stroke();

		context.beginPath();
		context.arc(posX, posY, 3, 0, 2 * Math.PI, false);
        context.fillStyle = fill_color;
        context.fill();

	} else {

		var x_shift_1 = begin_node.left ? 1 : -1;
		var x_shift_2 = end_node.left ? 1 : -1;

		var half_width_1 = parseInt(begin_node.holder.style.width)/2;
    	var half_width_2 = parseInt(end_node.holder.style.width)/2;

    	var factor_1 = begin_node.left ? (begin_node.position.x - half_width_1)/half_width_1 : (half_width_1 - begin_node.position.x)/half_width_1; 
    	var factor_2 = end_node.left ? (end_node.position.x - half_width_2)/half_width_2 : (half_width_2 - end_node.position.x)/half_width_2; 

		var vert_1 = {  x:(parseInt(begin_node.holder.style.left) + begin_node.position.x + 2),
						y:(parseInt(begin_node.holder.style.top) + begin_node.position.y + 2) };

		var vert_2 = {  x:(parseInt(begin_node.holder.style.left) + begin_node.position.x + x_shift_1*(begin_node.size*10)*factor_1),
		                y:(parseInt(begin_node.holder.style.top) + begin_node.position.y) };

		var vert_3 = {  x:(parseInt(end_node.holder.style.left) + end_node.position.x + x_shift_2*(end_node.size*10)*factor_2),
		                y:(parseInt(end_node.holder.style.top) + end_node.position.y ) };

		var vert_4 = {  x:(parseInt(end_node.holder.style.left) + end_node.position.x + 2),
						y:(parseInt(end_node.holder.style.top) + end_node.position.y + 2) };

		context.beginPath();
		context.arc(vert_1.x - 1, vert_1.y - 1, 2, 0, 2 * Math.PI, false);
		context.fill();

		context.beginPath();
		context.moveTo(vert_1.x, vert_1.y);
	    context.bezierCurveTo(vert_2.x, vert_2.y, vert_3.x, vert_3.y, vert_4.x, vert_4.y);
	    context.stroke();

	   	context.beginPath();
		context.arc(vert_4.x - 1, vert_4.y - 1, 2, 0, 2 * Math.PI, false);
		context.fill();

	}

    context.stroke();
};

var draw_box = function (begin_node, end_node, context){

    if(begin_node.constructor === Array || end_node.constructor === Array){
		context.beginPath();
		context.rect(begin_node[0],begin_node[1],(end_node[0] - begin_node[0]),(end_node[1] - begin_node[1]));
    	context.stroke();
	} else {
		beign_node = undefined;
		end_node = undefined;
	}
	
};