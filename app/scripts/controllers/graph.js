'use strict';


archvisControllers.controller('graphCtrl', ['$scope', '$http',
	function ($scope, $http) {
























var graphClass = {
	force: d3.layout.force(),
	width: $("#mainLayout").layout().panes.center.innerWidth()-10,
	height: 700,  
    colorsList: d3.scale.category20(),
    getGraphData: function(){
    	return JSON.stringify(graphClass.graphData);
    },
    onDoubleClickNode: function(selectedNode,allNodes){
    	_.each(allNodes, function (currentNode) {
    		d3.select(currentNode[0]).style('stroke-dasharray',null).style('stroke','black').style('stroke-width','1');
    	});
    	selectedNode.style('stroke-dasharray',("10,3")).style('stroke','red').style('stroke-width','10');
    	console.log(selectedNode);

    	var filePath = selectedNode[0][0]["__data__"].name.substring(2);
				

	},
	onMouseOverNode:function(d,link){
		link.style('stroke', function(l) {
			if (d === l.source || d === l.target){
				return "red";
			}
			else{
				return "grey";
			}
		});
	},
	addNode: function(node){
		console.log("rendu",graphClass.newRelations.nodes.length);


		var foundId =graphClass.newRelations.nodes.indexOf(node);

		if(foundId !== -1){
			return foundId;
		}

		var id =graphClass.newRelations.nodes.length;
		graphClass.newRelations.nodes.push(node);

		return id;
	},
	changeFilter: function(filter){
		
		/*
		graphClass.svg.selectAll('circle.node').transition().each(function(d){
			
				
	    });*/

		graphClass.svg.selectAll('circle.node').transition().duration(1000).attr('r', function(d) {
								console.log(d.complexityNormalyzed);

			var multiplier = 60;

			switch (filter){
			  case "lint": 
			  	if(_.isUndefined(d.complexityNormalyzed.reportCount) == false){
			    	return 10+d.complexityNormalyzed.reportCount*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "cyclomatic":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.cyclomaticDensity*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "vocabulaire":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.vocabulary*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "volume":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.volume*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "effort":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.effort*multiplier;
				}
				else{
					return 10;
				}
			  break;
			   case "difficulte":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.difficulty*multiplier;
				}
				else{
					return 10;
				}
			  break;
			   case "bogues":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.bugs*multiplier;
				}
				else{
					return 10;
				}
			  break;
			   case "temps":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.time*multiplier;
				}
				else{
					return 10;
				}
			  break;
			   case "operators":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operators.distinct*multiplier;
				}
				else{
					return 10;
				}
			  break;
			   case "operands":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.aggregate.halstead.operands.distinct*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "longueur":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.halstead.lngth*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  case "functions":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.functions*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  
			  case "maintenabilite":
				if(d.group == 2 && _.isUndefined(d.complexity) == false){
		        	return 10+d.complexityNormalyzed.maintainability*multiplier;
				}
				else{
					return 10;
				}
			  break;
			  default: 
			  	return 10;
			}		
			tick();

			
	    })
	},
	regenGraph: function(assets){
		//créer un nouveau array d'asset
		
		
		$.ajax({
			type: 'GET',
			contentType: 'application/json',
			url: 'extract/',	
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
		// Create Graph
		d3.json("extract/", function(error, data) {
			console.log(data);
			graphClass.drawGraph(data);
		});

	},
	initializeForce: function(){

	},
	createLegend: function(svg,colors){
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
	},
	drawGraph: function(data){


				// Initialize force
		    	var force = d3.layout.force()
		    	.charge(-390)
		    	.linkDistance(270)
		    	.friction(0.9)
		    	.size([graphClass.width, graphClass.height]);
		    	
		    	d3.select("#d3Placeholder").html("");

		    	var svg = d3.select("#d3Placeholder").append("svg")
		    	.attr("width", graphClass.width)
		    	.attr("height", graphClass.height);


				// cloner si on veux avoir data avant qu'il change.
				graphClass.graphData = data;

				force
				.nodes(data.nodes)
				.links(data.links)
				.start();

				graphClass.data = data;



	
/*
svg.append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("svg:marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("class", "marker")
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");*/

// add the links and the arrows
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
			    }



				var colors = [ ["Html", graphClass.colorsList(1)],
           					 ["Javascript externe", graphClass.colorsList(2)],
           					 ["Javascript interne", graphClass.colorsList(4)],
           					 ["Requête ajax", graphClass.colorsList(9)],
           					 ["Css externe", graphClass.colorsList(3)],
           					 ["Css interne", graphClass.colorsList(8)],
           					 ["Lien externe", graphClass.colorsList(5)],
           					 ["Ancres Html", graphClass.colorsList(6)],
           					 ["Lien courriel", graphClass.colorsList(7)] ];


           		graphClass.createLegend(svg,colors);






			    // Créer les noeuds, textes et liens
			    var gnode = svg.selectAll('g.gnode')
			    .data(data.nodes)
			    .enter()
			    .append('g');

			    var node = gnode.append("circle")
			    .attr("class", "node")
			    .attr("r", function(d){
			    	if(d.group == 1){
			    		return 15;
			    	}
			    	else{
			    		return 9;
			    	}
			    })
			    .style("fill", function(d) { return graphClass.colorsList(d.group); })
			    .call(node_drag);


			   

			    gnode.selectAll("circle.node").on("dblclick", function(){    
			    	graphClass.onDoubleClickNode(d3.select(this),gnode.selectAll("circle.node"));
			    });
			    graphClass.svg = svg;

			    node.on('mouseover', function(d) {
			    	graphClass.onMouseOverNode(d,path);
			    	svg.on("mousedown.zoom", null);
			    	svg.on("mousemove.zoom", null);
			    });


				function tick() {
					/*link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });*/



				    path.attr("d", function(d) {
					    var dx = d.target.x - d.source.x,
					        dy = d.target.y - d.source.y,
					        dr = Math.sqrt(dx * dx + dy * dy),
					        theta = Math.atan2(dy, dx) + Math.PI / 7.85,
					        d90 = Math.PI / 2,
					        dtxs = d.target.x - 10 * Math.cos(theta),
					        dtys = d.target.y - 10 * Math.sin(theta);
					    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y + "M" + dtxs + "," + dtys +  "l" + (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "L" + (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "z";
					  });



					text.attr("dx", function(d) { return d.x+10; })
					.attr("dy", function(d) { return d.y+1; });

					node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				}
			    function zoomHandler(){
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

				// create the zoom listener
			    var zoomListener = d3.behavior.zoom()
			    .scaleExtent([0.1, 3])
			    .on("zoom", zoomHandler);

			    zoomListener(svg);


			    node.on('mouseout', function(d) {
			    	zoomListener(svg);
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



$('button[name="filter"]').click(function(){
	graphClass.changeFilter($(this).val());
});



	//Arbre
	var node = $("#tree").fancytree({
	  source: {
	    url: "tree/",
	    cache: false
	  },
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
	$("#tree").fancytree({
		extensions: ["select"],
		checkbox: true,
		graphClass: graphClass,
		selectMode: 2,
		select: function(event, data) {
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

		}

	});



}]);




