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
			.linkDistance(70)
			.friction(0.9)
			.size([graphClass.width, graphClass.height]);

			var svg = d3.select("#centerPanel").append("svg")
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

			

				var link = svg.selectAll(".link")
				.data(graph.links)
				.enter().append("line")
				.attr("class", "link")
				.style("stroke-width", function(d) { return Math.sqrt(d.value); });

				var node_drag = d3.behavior.drag()
				.on("dragstart", dragstart)
				.on("drag", dragmove)
				.on("dragend", dragend);


				function tick() {
					link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

			        text.attr("dx", function(d) { return d.x+8; })
			        .attr("dy", function(d) { return d.y+8; });

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
			    	graphClass.onMouseOverNode(d,link);
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