jQuery(function($) {





    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
              lineNumbers: true,
              mode: "css"
            });

	var browserHeight = document.documentElement.clientHeight;
	myCodeMirror.getWrapperElement().style.height = (0.8 * browserHeight)+ 'px';
	myCodeMirror.refresh();



	$('#mainLayout').height($(window).height()).layout({ applyDefaultStyles: true, east: { size: 500}  });







	var graphClass = {
	    width: $("#mainLayout").layout().panes.center.innerWidth()-10,
	    height: 700,
	    myCodeMirror: myCodeMirror,
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


	     	if(filePath.substring(filePath.length-4,filePath.length)==".css"){
	     		graphClass.myCodeMirror.setOption("mode", "css");
	     	}

	     	if(filePath.substring(filePath.length-3,filePath.length)==".js"){
	     		graphClass.myCodeMirror.setOption("mode", "javascript");
	     	}

			$.get( "readFile/"+filePath, function( data ) {
				


				

				graphClass.myCodeMirror.setValue(data);


			});


	    },
	    onMouseOverNode:function(d,link){
	    	link.style('stroke', function(l) {
				if (d === l.source || d === l.target){
				  return "red";
				}
				else{
				  return "black";
				}
			});
	    },
	    generateGraph: function (name){
	    	
	    	// Initialize force
			var force = d3.layout.force()
			.charge(-390)
			.linkDistance(170)
			.friction(0.9)
			.size([graphClass.width, graphClass.height]);

			var svg = d3.select("#d3Placeholder").append("svg")
			.attr("width", graphClass.width)
			.attr("height", graphClass.height);

			// Create Graph
			d3.json("extract/", function(error, graph) {


				// cloner si on veux avoir data avant qu'il change.
				graphClass.graphData = graph;

				force
				.nodes(graph.nodes)
				.links(graph.links)
				.start();

				graphClass.data = graph;

			

				/*var link = svg.selectAll(".link")
				.data(graph.links)
				.enter().append("line")
				.attr("class", "link")			      
				.style("stroke-width", function(d) { return Math.sqrt(d.value); })
				*/



svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");





				var node_drag = d3.behavior.drag()
				.on("dragstart", dragstart)
				.on("drag", dragmove)
				.on("dragend", dragend);







				function tick() {
					/*link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });*/

					path.attr("d", function(d) {
				        var dx = d.target.x - d.source.x,
				            dy = d.target.y - d.source.y,
				            dr = Math.sqrt(dx * dx + dy * dy);
				        return "M" + 
				            d.source.x + "," + 
				            d.source.y + "A" + 
				            dr + "," + dr + " 0 0,1 " + 
				            d.target.x + "," + 
				            d.target.y;
				    });

			        text.attr("dx", function(d) { return d.x+10; })
			        .attr("dy", function(d) { return d.y+1; });

			        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			    };

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



							    // create the zoom listener
				var zoomListener = d3.behavior.zoom()
				  .scaleExtent([0.1, 3])
				  .on("zoom", zoomHandler);

				// function for handling zoom event
				function zoomHandler() {
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




				//console.log(graphClass.colorsList(1));
				function displayLegendBox(elem, objRange){
				  d3.select(elem)
				    .selectAll('div')
				    .data(objRange)
				      .enter()
				      .append("div")
				      .attr("class", function(d){
				        return d.theClass;
				      })
				      .classed({"legends-box":true})
				      .text(function(d){
				        return d.max;
				      });
				}

				var nodeRange = []

				//displayLegendBox("#legend-vertex", nodeRange);

				



				zoomListener(svg);



			    // Créer les noeuds, textes et liens
			    var gnode = svg.selectAll('g.gnode')
			    .data(graph.nodes)
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


			    node.on('mouseover', function(d) {
			    	graphClass.onMouseOverNode(d,path);
			    	svg.on("mousedown.zoom", null);
					svg.on("mousemove.zoom", null);
				});

				 node.on('mouseout', function(d) {
					zoomListener(svg);
				});


				var text = gnode.append("text")
				.text(function(d) {
					return d.name;
				});

				force.on("tick", tick);


			});

	    }
	};



	graphClass.generateGraph();

});