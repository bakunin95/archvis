$(function() {
	gotoHash();
    $(window).on('hashchange', function() {//this part is not working
    	gotoHash();
    });
});


function gotoHash(){
	 var anchor = document.location.hash;
        switch(anchor){
        	case "#tableau":
        		$("#content").load("views/partials/tableau.html",function(){
        			$.getScript( "scripts/controllers/tableau.js", function( data, textStatus, jqxhr ) {

					});
        		});
        	break;
        	case  "#graphe":
				$("#content").load("views/partials/graph.html",true,function(){
                    console.log($("#content"));
					$.getScript( "scripts/controllers/graph.js", function( data, textStatus, jqxhr ) {

					});
				});
        	break;
        	default:
        	    $("#content").load("views/partials/graph.html",true,function(){
					$.getScript( "scripts/controllers/graph.js", function( data, textStatus, jqxhr ) {

					});
				});
        }
}

