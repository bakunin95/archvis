'use strict';


jQuery(function($) {


$('#content').delegate( ".filter", "click", function() {
	console.log($(this).val());
	graphClass.changeFilter($(this).val());
});

console.log(d3.scale.category20());
var graphClass = {
	force: d3.layout.force(),
	width: $("#mainLayout").layout().panes.center.innerWidth()-30,
	height: $("#mainLayout").layout().panes.center.innerHeight()-122,  
	pause: false,
	zoomFactor:1,
	zoom: d3.behavior.zoom,
	liensDetails: false,
	pathColor: "#808080",
	translateFactor: [0,0],
   // colorsList: d3.scale.category20(),
   	colorsList: d3.scale.ordinal().range(["#FF0000","#0000FF","#B2B2FF","#D9D9FF","#6699FF",
   			    "#FF9900","#009933","#99D6AD","#E6F5EB","#66D966",
   			    "#CCCC00","#CC00FF","#F2BFFF","#0099CC","#CCEBF5",
   			    "#333","#fff","#000","#333","#333"]),
    getGraphData: function(){
    	return JSON.stringify(graphClass.graphData);
    },
    onDoubleClickNode: function(selectedNode,allNodes){
    	_.each(allNodes, function (currentNode) {
    		d3.select(currentNode[0]).style('stroke-dasharray',null).style('stroke','black').style('stroke-width','1');
    	});
    	selectedNode.style('stroke-dasharray',("10,3")).style('stroke','red').style('stroke-width','10');

    	var filePath = selectedNode[0][0]["__data__"].name.substring(2);
				

	},
	onMouseOverNode:function(d,path,node){




		if(graphClass.liensDetails == true){
			path.style('stroke', function(l) {
				if (d === l.source || d === l.target){
					return "red";
				}
				else{
					return graphClass.pathColor;
				}
			});
			path.style("opacity", function(l) {
			 	if (d === l.source || d === l.target){
				return 1;
				}
				else{
					return 0;
				}
			});
		}
	},
	addNode: function(node){
		var foundId =graphClass.newRelations.nodes.indexOf(node);
		if(foundId !== -1){
			return foundId;
		}
		var id =graphClass.newRelations.nodes.length;
		graphClass.newRelations.nodes.push(node);
		return id;
	},
	changeFilter: function(filter){

		graphClass.svg.selectAll('circle.node').transition().duration(1000).attr('r', function(d) {

			var multiplier = 60;

			switch (filter){
			  case "lint": 
			  	if(_.isUndefined(d.complexityNormalyzed.reportCount) == false){
			    	return 10+d.complexityNormalyzed.reportCount*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "cyclomatic":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.cyclomaticDensity*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "vocabulaire":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.vocabulary*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "volume":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.volume*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "effort":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.effort*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "difficulte":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.difficulty*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "bogues":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.bugs*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "temps":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.time*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "operators":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operators.distinct*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			   case "operands":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operands.distinct*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "longueur":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.halstead.lngth*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  case "functions":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.functions*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  
			  case "maintenabilite":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.maintainability*multiplier;
				}
				else{
					if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 10;
			    	}
				}
			  break;
			  default: 
			  	if(d.group == 1){
		    		return 15;
		    	}
		    	else{
		    		return 10;
		    	}
			}		
			tick();

			
	    })
	},
	regenGraph: function(assets){
		//créer un nouveau array d'asset
		
		
		$.ajax({
			type: 'GET',
			contentType: 'application/json',
			url: 'data/graphe.json',	
			success: function(data) {
			
				graphClass.newRelations = new Array();
				graphClass.newRelations.nodes = new Array();
				graphClass.newRelations.links = new Array();


		        async.map(data.nodes, function(node,cbnode){	
					var key = data.nodes.indexOf(node);

		        	if(_.contains(assets, node.name)){
		        		//copier les assets demandé
		        		var newKey = graphClass.addNode(node);

		        		//find or add
		        		async.map(data.links, function(link,cblink){
		        		
			        		if(link.source == key){
			        			var targetKey = graphClass.addNode(data.nodes[link.target]);
			        			graphClass.newRelations.links.push({source:newKey,target:targetKey,value:1});
			        		}
			        		if(link.target == key){
			        			var sourceKey = graphClass.addNode(data.nodes[link.source]);
			        			graphClass.newRelations.links.push({source:sourceKey,target:newKey,value:1});
			        		}

			        		
						cblink();
			        	},function(err,result){
				    		console.log("donelink");
				    		cbnode();
			    		});	


		        	}
		        	else{
		        		cbnode();
		        	}
					
		    											    		
		    	},function(err,result){
		    		console.log("done");
		    		console.log(graphClass.newRelations);


		    		graphClass.drawGraph(graphClass.newRelations);
		    	});	    

			}
		});
	},
	generateGraph: function (name){

		console.log("test");
		// Create Graph
		d3.json("data/graphe.json", function(error, data) {
			graphClass.drawGraph(data);
		});

	},
	initializeForce: function(){

	},
	createLegend: function(svg){
		if(_.isUndefined(graphClass.graphData.info) == false){
			var colors = [  ["Html"+" ["+graphClass.graphData.info.groupCount[1]+"]", graphClass.colorsList(1)],
							["JavaScript externe"+" ["+graphClass.graphData.info.groupCount[2]+"]", graphClass.colorsList(2)],
							["JavaScript externe (hors serveur)"+" ["+graphClass.graphData.info.groupCount[11]+"]", graphClass.colorsList(11)],
							["JavaScript interne"+" ["+graphClass.graphData.info.groupCount[4]+"]", graphClass.colorsList(4)],
							["JavaScript externe (liens mort)"+" ["+graphClass.graphData.info.groupCount[10]+"]", graphClass.colorsList(10)],
							["Requête ajax"+" ["+graphClass.graphData.info.groupCount[9]+"]", graphClass.colorsList(9)],
							["Css externe"+" ["+graphClass.graphData.info.groupCount[3]+"]", graphClass.colorsList(3)],
							["Css externe (hors serveurs)"+" ["+graphClass.graphData.info.groupCount[13]+"]", graphClass.colorsList(13)],
							["Css interne"+" ["+graphClass.graphData.info.groupCount[8]+"]", graphClass.colorsList(8)],
							["Css externe (liens mort)"+" ["+graphClass.graphData.info.groupCount[12]+"]", graphClass.colorsList(12)],

							["Lien externe"+" ["+graphClass.graphData.info.groupCount[5]+"]", graphClass.colorsList(5)],
							["Ancres Html"+" ["+graphClass.graphData.info.groupCount[6]+"]", graphClass.colorsList(6)],
							["Lien courriel"+" ["+graphClass.graphData.info.groupCount[7]+"]", graphClass.colorsList(7)],
							["Php"+" ["+graphClass.graphData.info.groupCount[14]+"]", graphClass.colorsList(14)],
							["Lien divers"+" ["+graphClass.graphData.info.groupCount[15]+"]", graphClass.colorsList(15)]
						];






			var legend = svg.append("svg:g")
			.attr("class", "legend")
			.attr("height", 100)
			.attr("width", 100)
			.attr('transform', 'translate(-20,30)');

			var legendRect = legend.selectAll('rect').data(colors);
			var w =100;
			legendRect.enter()
			    .append("rect")
			    .attr("x", w - 65)
			    .attr("width", 10)
			    .attr("height", 10);

			legendRect
			    .attr("y", function(d, i) {
			        return i * 20;
			    })
			    .style("fill", function(d) {
			        return d[1];
			    });

			var legendText = legend.selectAll('text').data(colors);

			legendText.enter()
			    .append("text")
			    .attr("x", w - 52);

			legendText
			    .attr("y", function(d, i) {
			        return i * 20 + 9;
			    })
			    .text(function(d) {
			        return d[0];
			    });

			    graphClass.legend = legend;
		}
	},
	drawGraph: function(data){




//force charge -1050
	
		// Initialize force
    	var force = d3.layout.force()
    	.charge(function(d) {
    		if(d.group == 1){
    			return -1000;
    		}
    		else{
    			return -1000;
    		}
    		//console.log("charge",d);
    		
    	})
		//.charge(-1050)
    	.linkDistance(function(d) {

    		if(d.source.group == 1 && d.target.group == 1){
    			return 175;
    		}
    		else{
    			return 150;
    		}
    		
    	})
    	.friction(0.9)

    	.size([graphClass.width, graphClass.height]);
    	
    	d3.select("#d3Placeholder").html("");

    	var svg = d3.select("#d3Placeholder").append("svg")
    	.attr("width", graphClass.width)
    	.attr("height", graphClass.height);


		// cloner si on veux avoir data avant qu'il change.
		graphClass.graphData = data;
		force
		//.gravity(0.05)
		.nodes(data.nodes)
		.links(data.links)
		//.linkStrength(0.01)
		.chargeDistance(-1000)
		.start();
		graphClass.data = data;

		// add the links and the arrows
		//var path = svg.append("svg:g").selectAll("path")
				//var path = svg.append("svg:g").selectAll("path")



//LINK CODE
/*		

		var path = svg.selectAll("line.link")
       .data(data.links)
     .enter().append("svg:line")
       .attr("class", "link")
       .style("stroke-width", function(d) { return Math.sqrt(d.value); })
       .attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });	


*/
//PATH CODE





		var path = svg.append("svg:g").selectAll("path")
		.data(force.links())
		.enter().append("svg:path")
		// .attr("class", function(d) { return "link " + d.type; })
		.attr("class", "link")
		.attr("marker-mid", "url(#end)");







		






		var node_drag = d3.behavior.drag()
		.on("dragstart", dragstart)
		.on("drag", dragmove)
		.on("dragend", dragend);

		function dragstart(d, i) {
	        force.stop() // stops the force auto positioning before you start dragging
	    }

	    function dragmove(d, i) {
	    	d.px += d3.event.dx;
	    	d.py += d3.event.dy;
	    	d.x += d3.event.dx;
	    	d.y += d3.event.dy; 
	        tick(); // this is the key to make it work together with updating both px,py,x,y on d !
	    }

	    function dragend(d, i) {
	        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
	        tick();
	        force.resume();

	        if(graphClass.pause == true){
				//setTimeout(function(){force.stop()},1000);
				force.stop();
			}

	    }


   		graphClass.createLegend(svg);

	    // Créer les noeuds, textes et liens
	    var gnode = svg.selectAll('g.gnode')
	    .data(data.nodes)
	    .enter()
	    .append('g');

	    var node = gnode.append("circle")
	    .attr("class", "node")
	    .attr("id", function(d){return "circle-node-"+ d.name})

	    .attr("r", function(d){
	    	if(d.group == 1){
	    		return 15;
	    	}
	    	else{
	    		return 10;
	    	}
	    })
	    .style("fill", function(d) { return graphClass.colorsList(d.group); })
	    .call(node_drag);

	    /*gnode.selectAll("circle.node").on("dblclick", function(){    
	    	graphClass.onDoubleClickNode(d3.select(this),gnode.selectAll("circle.node"));
	    });*/

	    graphClass.svg = svg;

	    node.on('mouseover', function(d) {
	    	graphClass.onMouseOverNode(d,path,node);
	    	svg.on("mousedown.zoom", null);
	    	svg.on("mousemove.zoom", null);

	    });


	   // node.style.css( 'cursor', 'pointer' );


		gnode.style('cursor', function(l) {
			return 'move';
		});



	    gnode.on("mouseout", function(d) {
    		path.style("stroke", function(l) {
			 	return graphClass.pathColor;
			});
	        path.style("opacity", function(l) {
			 	return 1;
			});
		});

		path.style('stroke', function(l) {
			return graphClass.pathColor;
		});


		function tick() {
		   path.attr("d", function(d) {
			    var dx = d.target.x - d.source.x,
			        dy = d.target.y - d.source.y,
			        dr = Math.sqrt(dx * dx + dy * dy),
			        theta = Math.atan2(dy, dx) + Math.PI / 7.85,
			        d90 = Math.PI / 2,
			        dtxs = d.target.x - 10  * Math.cos(theta),
			        dtys = d.target.y - 10 * Math.sin(theta);
			    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y + "M" + dtxs + "," + dtys +  "l" + (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "L" + (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "z";
			  });

				
/*

			  path.attr("x1", function(d) { return d.source.x; })
				  .attr("y1", function(d) { return d.source.y; })
				  .attr("x2", function(d) { return d.target.x; })
				  .attr("y2", function(d) { return d.target.y; });
*/
			text.attr("dx", function(d) { return d.x+10; })
			.attr("dy", function(d) { return d.y+1; });

			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}

		function tickold() {
		    gnode.each(gravityFunction) 
		       //adjust each node according to the custom force
		        .attr("cx", function (d) {
		            return d.x;
		        })
		        .attr("cy", function (d) {
		            return d.y;
		        });
		    
		    path.attr("x1", function (d) {
		            return d.source.x;
		        })
		        .attr("y1", function (d) {
		            return d.source.y;
		        })
		        .attr("x2", function (d) {
		            return d.target.x;
		        })
		        .attr("y2", function (d) {
		            return d.target.y;
		        });

		}

		function moveHandler(coord){
			gnode.transition().duration(1000).attr("transform", "translate(" + coord + ")scale(" + graphClass.zoomFactor + ")");
			path.transition().duration(1000).attr("transform", "translate(" + coord + ")scale(" + graphClass.zoomFactor + ")");
			svg.on("dblclick.zoom", null);
		}


	    function zoomHandler(){
	    	//console.log("translated",graphClass.translated);
	    	graphClass.zoomFactor = d3.event.scale;
	    	graphClass.translateFactor = d3.event.translate;
			// function for handling zoom event
			gnode.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			path.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		  	//svg.on("mousedown.zoom", null);
			//svg.on("mousemove.zoom", null);
			svg.on("dblclick.zoom", null);
			//svg.on("touchstart.zoom", null);
			//svg.on("wheel.zoom", null);
			//svg.on("mousewheel.zoom", null);
			//svg.on("MozMousePixelScroll.zoom", null);
		}

		function collide(node) {
			var r = node.radius + 16,
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

		// create the zoom listener
	    var zoomListener = d3.behavior.zoom()
	    .scaleExtent([0.1, 4])
	    .on("zoom", zoomHandler);

	    zoomListener(svg);
	    node.on('mouseout', function(d) {
	    	zoomListener(svg);
	    });

	    var  allFiles = _.pluck(data.nodes, 'name');
	    allFiles = allFiles.filter(Boolean);
//8888888888888




      /*d3.selectAll("#panLeft, #panRight, #panUp, #panDown")
        .on("click", function () {
          d3.event.preventDefault();
          var id = d3.select(this).attr("id");
          panZoom.pan(id);
        });*/








//*888888888888888888888888888
					    
		$(document).ready(function(){


			$("#panLeft").on("click", function () {
				console.log("d3",d3);
				graphClass.zoomFactor = graphClass.zoomFactor+0.1;				
				gnode.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");
				path.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");		
        	});

			$("#zoomIn").on("click", function () {
				console.log("d3",d3);
				graphClass.zoomFactor = graphClass.zoomFactor+0.1;				
				gnode.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");
				path.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");		
        	});

        	$("#zoomOut").on("click", function () {
				console.log("d3",d3);
				graphClass.zoomFactor = graphClass.zoomFactor-0.1;				
				gnode.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");
				path.transition().duration(100).attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");		
        	});
					    
			$("#btn-pause").removeAttr("disabled"); 
			$("#btn-play").attr("disabled", "disabled");

			$("#sliderCharge").slider({ max: 0 , min: -1000, value: -390, change: function( event, ui ) {
				force.charge(ui.value).start();
				if(graphClass.pause == true){
					setTimeout(function(){force.stop()},1000);
				}
			}});

			$("#sliderDistance").slider({ max: 700 , min: 150, value: 270, change: function( event, ui ) {
				force.linkDistance(ui.value).start();
				if(graphClass.pause == true){
					setTimeout(function(){force.stop()},1000);
				}
			}});

			$("#sliderFriction").slider({ max: 0.9 , min: 0, value: 0.7, step:0.05, change: function( event, ui ) {
				force.friction(ui.value).start();
				if(graphClass.pause == true){
					setTimeout(function(){force.stop()},1000);
				}
			}});

			$("#sliderLiens").slider({ max: 255 , min: 0, value: 128, step:1, change: function( event, ui ) {
				var val = 255-ui.value;
				graphClass.pathColor = rgbToHex(val, val, val);
				path.style('stroke', function(l) {
					return graphClass.pathColor;
				});
				
				
			}});


			$("#sliderText").slider({ max: 120 , min: 8, value: 11, step:1, change: function( event, ui ) {
				//d3.select("body").transition().style("font-size", ui.value + "px");
				text.style("font-size", ui.value + "px");
				//$('.text').css("font-size", ui.value + "px");

			}});
			

			

			$("#btn-pause").click(function(event,ui){

			console.log("paused");
			graphClass.pause = true;
			force.stop();

			$("#btn-pause").attr("disabled", "disabled");
			$("#btn-play").removeAttr("disabled");   
			});


			$("#btn-play").click(function(event,ui){
				graphClass.pause = false;
				force.start();

				$("#btn-play").attr("disabled", "disabled");
				$("#btn-pause").removeAttr("disabled"); 
			});

		    $("#srch-term").autocomplete({
		        source: allFiles,
		        d3:d3,
		        graphClass:graphClass,
		        svg:svg,
		        select: function( event, ui){
		        	graphClass.svg.selectAll("circle.node").each(function(d) {
		        		if(d.name == ui.item.value){
		        			console.log(d);
		        			var currentSize = $(this).attr("r");
							$(this).effect("pulsate", {}, 900);
							moveHandler([((graphClass.width/2)-graphClass.zoomFactor*d.x-graphClass.translateFactor[0]),((graphClass.height/2)-graphClass.zoomFactor*d.y-graphClass.translateFactor[1])]);
		        			
		        		}
		        		return d.r;
		        	});
		        }
		    });

		});

		    var text = gnode.append("text")
		    .text(function(d) {
		    	return d.name;
		    });

		    force.on("tick", tick);
	}
};



graphClass.generateGraph();










	var sorting = function(a, b) {
		var x = (a.isFolder() ? "0" : "1") + a.title.toLowerCase(), y = (b.isFolder() ? "0" : "1") + b.title.toLowerCase(); 
		return x === y ? 0 : x > y ? 1 : -1; 
	};






	$('button[rel="popover"]').tooltip({
        placement : 'bottom'
    });

	//Arbre
	var node = $("#tree").fancytree({
	  source: {
	    url: "data/arbre.json",
	    cache: false
	  }
	});

	$("#btnDeselectAll").click(function(){
		$("#tree").fancytree("getTree").visit(function(node){
			node.setSelected(false);
		});
		return false;
	});
	$("#btnSelectAll").click(function(){
		$("#tree").fancytree("getTree").visit(function(node){
			node.setSelected(true);
		});
		return false;
	});





	$("#checkboxLiensDetails").change(function () {
	    graphClass.liensDetails = $(this).is(":checked"); 
	});





/*
	$("#tree").fancytree({
		//checkbox: true,
		//graphClass: graphClass,
		selectMode: 3,
		select: function(event, data) {
			
/*
				// We should not toggle, if target was "checkbox", because this
				// would result in double-toggle (i.e. no toggle)
				if( $.ui.fancytree.getEventTargetType(event) === "title" ){
					data.node.toggleSelected();
				}
				

				//each title

				async.map(data.tree.getSelectedNodes(), function(currentNode,callback){
					//console.log(currentNode);
					callback(null,currentNode.data.path);
				}, function(err, results){
				    // results is now an array of stats for each file

				 

				    graphClass.regenGraph(results);

				});
*/
	//	}

	//});

	
	



});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}




