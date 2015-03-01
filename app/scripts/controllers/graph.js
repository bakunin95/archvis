'use strict';


jQuery(function($) {

	$('#content').delegate( ".filter", "click", function() {
		graphClass.changeFilter($(this).val());
	});


	var graphClass = {
		force: d3.layout.force(),
		width: $("#mainLayout").layout().panes.center.innerWidth()-30,
		height: $("#mainLayout").layout().panes.center.innerHeight()-50,  
		pause: false,
		chargeDistance: -1000,
		foci: 0.002,
		fociGroup:{	topLeft:{x: 150, y: 150},
				 	topCenter:{x: 150, y: 425},
				 	topRight: {x: 150, y: 850},
				 	centerLeft: {x: 425, y: 150},
				 	center: {x: 425, y: 425},
				 	centerRight: {x: 425, y: 850},
				 	bottomLeft: {x: 850, y: 150},
				 	bottomCenter: {x: 850, y: 425},
				 	bottomRight: {x: 850, y: 850}
		},
		fociCount: 50,
		zoomFactor:1,
		zoom: d3.behavior.zoom,
		liensDetails: false,
		pathColor: "#666666",
		translateFactor: [0,0],
	    getGraphData: function(){
	    	return JSON.stringify(graphClass.graphData);
	    },
	    onDoubleClickNode: function(selectedNode,allNodes){
	    	/*_.each(allNodes, function (currentNode) {
	    		d3.select(currentNode[0]).style('stroke-dasharray',null).style('stroke','black').style('stroke-width','1');
	    	});
	    	selectedNode.style('stroke-dasharray',("10,3")).style('stroke','red').style('stroke-width','10');

	    	var filePath = selectedNode[0][0]["__data__"].name.substring(2);*/
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
					    		cbnode();
				    		});	


			        	}
			        	else{
			        		cbnode();
			        	}
						
			    											    		
			    	},function(err,result){
			    		graphClass.drawGraph(graphClass.newRelations);
			    	});	    

				}
			});
		},
		filterNoRelations: function(){

			var links = graphClass.graphData.links;
			var nodes = graphClass.graphData.nodes;
			var groups = graphClass.graphData.groups;

			var Relatedids = _.pluck(_.union(_.uniq(_.pluck(links,"source")),_.uniq(_.pluck(links,"target"))),"id");	
			async.filter(nodes,function(node,cbFilter){
				cbFilter(_.contains(Relatedids,node.id));
			}, 
			function(newNodes){
				var newData = {"nodes":newNodes,"links":links,"groups":groups};
				graphClass.newDataBackup = newData;
		    	graphClass.drawGraph(newData);
			});		

		},
		filter: function(filter){
			var dbNodes = new Nedb();
			var dbLinks = new Nedb();
			
			d3.json("data/graphe.json", function(error, data) {


				dbNodes.insert(data.nodes);
				dbLinks.insert(data.links);
				 				
				dbNodes.find({group: { $in: filter}},{"data":0}).sort({ "id": 1 }).exec(function (err, nodes) {

					var ids = _.uniq(_.pluck(nodes,"id"));					
				    dbLinks.find({source: { $in: ids},target: { $in: ids}}, function (err, links) {
				    	async.each(nodes, function(node,cbnode){
				    		var newKey = nodes.indexOf(node);
				    		console.log(newKey);
				    		async.map(links, function(link,cblink){
				    			if(link.source == node.id){
				        			link.source = newKey;
				        		}
				        		if(link.target == node.id){
				        			link.target = newKey;
				        		}
				        		cblink(link);
				    		});
				    		cbnode();
				    	},function(err,res){
						var newData = {"nodes":nodes,"links":links,"groups":data.groups};
						graphClass.newDataBackup = newData;
				    	graphClass.drawGraph(newData);
				    	});
				    });
				});
			});
			
		},
		generateGraph: function (name){

			// Create Graph
			d3.json("data/graphe.json", function(error, data) {
				graphClass.graphDataBackup = data;
				graphClass.drawGraph(data);

				$.each(graphClass.graphData.groups, function (i, item) {
				    $('#groupFilter').append($('<option>', { 
				        value: item.keyword,
				        text : item.label,
				        selected : "selected"
				    }));
			    });
				
				graphClass.filterGroups = $('#groupFilter').val();


			});

		},
		createLegend: function(svg){




			if(_.isUndefined(graphClass.graphData.groups) == false){

				$('#buttonFilter').click(function(){
					graphClass.filter($('#groupFilter').val());
				});

				$('#buttonFilterNoRel').click(function(){
					graphClass.filterNoRelations();
				});

				

				var colors = [];
				var colorsList = [];
				_.each(graphClass.graphData.groups, function (currentGroup,key) {
					if(currentGroup.count > 0){
						colors.push([currentGroup.label+ "["+currentGroup.count+"]",currentGroup.color]);
						colorsList.push(currentGroup.color);
					}
		    	});
				graphClass.colorsList = d3.scale.ordinal().range(colorsList);


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
		graphCharge: function(d){
			
			if(d.group == "html"){
				return -1400;
			}
			else{
				return -1200;
			}  
		},
		graphLinkDistance: function(d){

			if(d.source.group == "html" && d.target.group == "html"){
				return 175;
			}
			else{
				return 150;
			}
		},
		graphNodeSize: function(d){
			if(d.group == "html" || d.group == "js"){
	    		return 25;
	    	}
	    	else{
	    		return 20;
	    	}
		},
		graphNodeFill: function(d) { 
		    return d.groupColor; 
		},
		drawGraph: function(data){

			// Clean content
			d3.select("#d3Placeholder").html("");

			// Initialize force
	    	var force = d3.layout.force()
	    	.charge(graphClass.graphCharge)
	    	.linkDistance(graphClass.graphLinkDistance)
	    	.friction(0.9)
	    	.gravity(0.05)
	    	.size([graphClass.width, graphClass.height]);   	

	    	var svg = d3.select("#d3Placeholder").append("svg")
	    	.attr("width", graphClass.width)
	    	.attr("height", graphClass.height);

			// cloner si on veux avoir data avant qu'il change.
			graphClass.graphData = data;


			
			force
			.nodes(data.nodes)
			.links(data.links)
			.chargeDistance(graphClass.chargeDistance)
			.start();
			graphClass.data = data;


			var hullg = svg.selectAll("path");

			var path = svg.append("svg:g").selectAll("path")
			.data(force.links())
			.enter().append("svg:path")
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
					force.stop();
				}

		    }

		    function convexHulls(nodes, index, offset) {
				var hulls = {};
				gnode.each(function(n,i){    
					var i = index(n),
					l = hulls[i] || (hulls[i] = []);
					l.push([n.x-offset, n.y-offset]);
					l.push([n.x-offset, n.y+offset]);
					l.push([n.x+offset, n.y-offset]);
					l.push([n.x+offset, n.y+offset]);
				});
				// create point sets
				for (var k=0; k<nodes.length; ++k) {
					var n = nodes[k];
					if (n.size) continue;
					var i = index(n),
					    l = hulls[i] || (hulls[i] = []);
					l.push([n.x-offset, n.y-offset]);
					l.push([n.x-offset, n.y+offset]);
					l.push([n.x+offset, n.y-offset]);
					l.push([n.x+offset, n.y+offset]);
				}
				// create convex hulls
				var hullset = [];
				for (i in hulls) {
				hullset.push({group: i, path: d3.geom.hull(hulls[i])});
				}
				return hullset;
			}

			// Create Legend
	   		graphClass.createLegend(svg);

		    // Create node, text, link
		    var gnode = svg.selectAll('g.gnode')
		    .data(data.nodes)
		    .enter()
		    .append('g');

		    var node = gnode.append("circle")
		    .attr("class", "node")
		    .attr("id", function(d){return "circle-node-"+ d.name})
		    .attr("r", graphClass.graphNodeSize)
		    .style("fill", graphClass.graphNodeFill)
		    .call(node_drag);

		    // Events
		    gnode.selectAll("circle.node").on("dblclick", graphClass.onDoubleClickNode);

		    graphClass.svg = svg;

		    node.on('mouseover', function(d) {
		    	graphClass.onMouseOverNode(d,path,node);
		    	svg.on("mousedown.zoom", null);
		    	svg.on("mousemove.zoom", null);
		    	svg.on("touchstart.zoom", null);

		    });

		
		    // Cursor
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


			var tickCount = 0;

			//Graph Tick Handler
			function tick(e) {

				// Hull Handler
				var groupsOne = [];
				var groupsTwo = [];
				gnode.each(function(n,i){    
				 if(n.cluster == 2){
				 	groupsOne.push([n.x,n.y]);
				 }
				  if(n.cluster == 3){
				 	groupsTwo.push([n.x,n.y]);
				 }
				});

				var groupPathOne = "M" +d3.geom.hull(groupsOne).join("L") + "Z";
				var groupPathTwo = "M" +d3.geom.hull(groupsTwo).join("L") + "Z";
				svg.selectAll(".hull").remove();
				var hullRed = svg.insert("path", "g")
				        .style("fill", "#F5A9BC")
				        .style("stroke", "#F5A9BC")
				        .style("stroke-width", 40)
				        .style("stroke-linejoin", "round")
				        .style("opacity", .2)
				        .attr("d", groupPathOne)
				        .attr("class","hull");
				var hullBlue = svg.insert("path", "g")
				        .style("fill", "#A9D0F5")
				        .style("stroke", "#A9D0F5")
				        .style("stroke-width", 40)
				        .style("stroke-linejoin", "round")
				        .style("opacity", .2)
				        .attr("d", groupPathTwo)
				        .attr("class","hull");

				hullRed.attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");
				hullBlue.attr("transform", "translate(" + graphClass.translateFactor + ")scale(" + graphClass.zoomFactor + ")");

				// Path position Handler
				path.attr("d", function(d) {
				    var dx = d.target.x - d.source.x,
				        dy = d.target.y - d.source.y,
				        dr = Math.sqrt(dx * dx + dy * dy),
				        theta = Math.atan2(dy, dx) + Math.PI / 7.85,
				        d90 = Math.PI / 2,
				        dtxs = d.target.x - 20 * Math.cos(theta),
				        dtys = d.target.y - 20 * Math.sin(theta);
				    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y + "M" + dtxs + "," + dtys +  "l" + (3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (-3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "L" + (dtxs - 3.5 * Math.cos(d90 - theta) - 10 * Math.cos(theta)) + "," + (dtys + 3.5 * Math.sin(d90 - theta) - 10 * Math.sin(theta)) + "z";
				});

				text.attr("dx", function(d) { return d.x+15; })
				.attr("dy", function(d) { return d.y+1; });

				icon.attr("dx", function(d) { return d.x; })
				.attr("dy", function(d) { return d.y; });

				// Foci Handler
				graphClass.fociCount = graphClass.fociCount + 1;	
				if(graphClass.fociCount < 50){
					gnode.each(function(o,i){ 
			    		o.y += (graphClass.fociGroup[o.groupFoci].y - o.y) * graphClass.foci;
					    o.x += (graphClass.fociGroup[o.groupFoci].x - o.x) * graphClass.foci;
			    	});
				}

				//Node Position Handler
				node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			}

			function moveHandler(coord){
				svg.selectAll(".hull").transition().attr("transform", "translate(" + coord + ")scale(" + graphClass.zoomFactor + ")");
				gnode.transition().attr("transform", "translate(" + coord + ")scale(" + graphClass.zoomFactor + ")");
				path.transition().attr("transform", "translate(" + coord + ")scale(" + graphClass.zoomFactor + ")");
				graphClass.translateFactor = coord;
				d3.event.translate = coord;
				svg.on("dblclick.zoom", null);
			}

		    function zoomHandler(){
		    	graphClass.zoomFactor = d3.event.scale;
		    	graphClass.translateFactor = d3.event.translate;
				// function for handling zoom event
				gnode.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				path.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				svg.selectAll(".hull").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

				svg.on("dblclick.zoom", null);
				//svg.on("touchstart.zoom", null);
			}

			// create the zoom listener
		    var zoomListener = d3.behavior.zoom()
		    .scaleExtent([0.05, 10])
		    .on("zoom", zoomHandler);


		    d3.behavior.zoom().scale(0.2);
		    //zoomHandler();

		    zoomListener(svg);
		    node.on('mouseout', function(d) {
		    	zoomListener(svg);
		    });

		    var  allFiles = _.pluck(data.nodes, 'name');
		    allFiles = allFiles.filter(Boolean);
						    
			$(document).ready(function(){
	  
				$("#btn-pause").removeAttr("disabled"); 
				$("#btn-play").attr("disabled", "disabled");

	            $("#sliderGravity").slider({ max: 0 , min: 2, value: 0.05, change: function( event, ui ) {
					force.gravity(ui.value).start();
					if(graphClass.pause == true){
						setTimeout(function(){force.stop()},1000);
					}
				}});

				$("#sliderFoci").slider({ max: 0.05 , min: 0.00005, value: 0.002, step:0.001, change: function( event, ui ) {
					graphClass.fociCount = 0;
					graphClass.foci = ui.value;
					if(graphClass.pause == true){
						setTimeout(function(){force.stop()},1000);
					}
				}});

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
					text.style("font-size", ui.value + "px");
				}});		

				$("#btn-pause").click(function(event,ui){
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
			        			var currentSize = $(this).attr("r");
								$(this).effect("pulsate", {}, 900);
								moveHandler([((graphClass.width/2)-graphClass.zoomFactor*d.x-graphClass.translateFactor[0]),((graphClass.height/2)-graphClass.zoomFactor*d.y-graphClass.translateFactor[1])]);        			
			        		}
			        		return d.r;
			        	});
			        }
			    });

			}); // ???

		    var text = gnode.append("text")
		    .attr('font-family', 'sans-serif')
		    .attr('font-size','13px')
		    .style('text-shadow','0 2px 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, -2px 0 0 #fff')
		    .text(function(d) {
		    	return d.name;
		    });

			var icon = gnode.append('text')
		    .attr('text-anchor', 'middle')
		    .attr('dominant-baseline', 'central')
		    .attr('font-family', 'Oswald')
		    .attr('font-weight', '7px')
		    .style('fill', '#ffffff')
			.text(function(d) { 
				var code = "";
				return d.groupText;
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

	$("#download-svg").on("click", function(){
	                var serializer = new XMLSerializer();
	                var xmlString = serializer.serializeToString(d3.select('svg').node());
	                var imgData = 'data:image/svg+xml;base64,' + btoa(xmlString);             
	                $("#download-svg").attr("href",imgData);
	                    
	});

	



	$("#testfilter").click(function() {
		graphClass.filter();
	});


});  //???

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}