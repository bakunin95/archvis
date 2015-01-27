graphBackup.js



changeFilter: function(filter){

		graphClass.svg.selectAll('circle.node').transition().duration(1000).attr('r', function(d) {

			var multiplier = 60;

			switch (filter){
			  case "lint": 
			  	if(_.isUndefined(d.complexityNormalyzed.reportCount) == false){
			    	return 10+d.complexityNormalyzed.reportCount*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "cyclomatic":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.cyclomaticDensity*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "vocabulaire":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.vocabulary*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "volume":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.volume*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "effort":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.effort*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "difficulte":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.difficulty*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "bogues":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.bugs*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "temps":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.time*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "operators":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operators.distinct*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "operands":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operands.distinct*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "longueur":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.halstead.lngth*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "functions":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.functions*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  
			  case "maintenabilite":
				if(d.group == "js" && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.maintainability*multiplier;
				}
				else{
					if(d.group == "html"){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  default: 
			  	if(d.group == "html"){
		    		return 20;
		    	}
		    	else{
		    		return 15;
		    	}
			}		
			tick();

			
	    })
	},










	//#######################################


	var padding = 50, // separation between circles
    	radius=20;

		function collideDetect(alpha) {
		  var quadtree = d3.geom.quadtree(gnode);
		  return function(d) {
		    var rb = 2*radius + padding,
		        nx1 = d.x - rb,
		        nx2 = d.x + rb,
		        ny1 = d.y - rb,
		        ny2 = d.y + rb;
		    
		    quadtree.visit(function(quad, x1, y1, x2, y2) {
		      if (quad.point && (quad.point !== d)) {
		        var x = d.x - quad.point.x,
		            y = d.y - quad.point.y,
		            l = Math.sqrt(x * x + y * y);
		          if (l < rb) {
		          l = (l - rb) / l * alpha;
		          d.x -= x *= l;
		          d.y -= y *= l;
		          quad.point.x += x;
		          quad.point.y += y;
		        }
		      }
		      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		    });
		  };
		}


		//###################################


		function collide(node) {
		 // change radius to count
		 // node.count + 16
		  var r = node.count + 16,
		      nx1 = node.x - r,
		      nx2 = node.x + r,
		      ny1 = node.y - r,
		      ny2 = node.y + r;
		  return function(quad, x1, y1, x2, y2) {
		    if (quad.point && (quad.point !== node)) {
		      var x = node.x - quad.point.x,
		          y = node.y - quad.point.y,
		          l = Math.sqrt(x * x + y * y),
		          r = node.radius + quad.point.radius;
		      if (l < r) {
		        l = (l - r) / l * .5;
		        node.x -= x *= l;
		        node.y -= y *= l;
		        quad.point.x += x;
		        quad.point.y += y;
		      }
		    }
		    return x1 > nx2
		        || x2 < nx1
		        || y1 > ny2
		        || y2 < ny1;
		  };
		}


		//###################################

		/*
			var icon = gnode.append('text')
		    .attr('text-anchor', 'middle')
		    .attr('dominant-baseline', 'central')
		    .attr('font-family', 'FontAwesome')
		  //  .attr('font-weight','bold')
		   // .style("text-shadow", '1px 1px #fff')
		    		    //.style("fill-opacity", 0.8)

			.text(function(d) { 
				var code = "";
				switch(d.group){
					case 1:
						code =  '\uf0f6';
					break;
					case 2:
						code = '\uf1c9';
					break;
					case 3:
						code = '\uf1fc';
					break;
					case 5:
					 	code = '\uf0c1';
					break;
					case 6:
						code = '\uf13d';
					break;
					case 10:
					case 12:
						code = '\uf127';
					break
					case 15:
						code = '\uf08e';
					break;
				}
				return code;

			}); */