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
                    $.ajax({
                            async:true,
                            type:'GET',
                            url:"scripts/controllers/tableau.js",
                            cache:false,
                            dataType:'script'
                    });
        		});
        	break;
            case "#classDiagram":
                $("#content").load("views/partials/classDiagram.html",function(){              
                    $.ajax({
                            async:true,
                            type:'GET',
                            url:"scripts/controllers/classDiagram.js",
                            cache:false,
                            dataType:'script'
                    });
                });
            break;
        	case  "#graphe":
				$("#content").load("views/partials/graph.html",true,function(){
                    $.ajax({
                            async:true,
                            type:'GET',
                            url:"scripts/controllers/graph.js",
                            cache:false,
                            dataType:'script'
                    });
				});
        	break;
        	default:
        	    $("#content").load("views/partials/graph.html",true,function(){
					$.ajax({
                            async:true,
                            type:'GET',
                            url:"scripts/controllers/graph.js",
                            cache:false,
                            dataType:'script'
                    });
				});
        }
}

