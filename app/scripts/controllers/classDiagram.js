jQuery(function($) {

$("#classDiagram").iviewer({"src":"data/classDiagram.svg","zoom_min":"5","zoom":"80"});


/*
$.get("data/classDiagram.svg", null,
            function(data)
        {
	    var svgNode = $("svg", data);
	    var docNode = document.adoptNode(svgNode[0]);
	    var pageNode = $("#classDiagram");

	    pageNode.html(docNode);

	    $("svg").graphviz();
        },
        'xml');

*/
});