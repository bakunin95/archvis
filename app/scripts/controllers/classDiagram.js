jQuery(function($) {

var viewer = $("#classDiagram").iviewer({"src":"data/classDiagram.svg","zoom_min":"5","zoom":"75","zoom_delta":1.1});

//$("#classDiagram").html("<img src='data/classDiagram.svg'>");




//$("#classDiagram").html('<img src:"data/classDiagram.svg"');
//wheelzoom(document.querySelectorAll('img'));

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