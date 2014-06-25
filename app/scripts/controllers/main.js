jQuery(function($) {


/*
    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
              lineNumbers: true,
              mode: "css"
            });

	var browserHeight = document.documentElement.clientHeight;
	myCodeMirror.getWrapperElement().style.height = (0.8 * browserHeight)+ 'px';
	myCodeMirror.refresh();*/



	$('#mainLayout').height($(window).height()).layout({ applyDefaultStyles: true, east: { size: 10}  });

var sorting = function(a, b) {
	var x = (a.isFolder() ? "0" : "1") + a.title.toLowerCase(), y = (b.isFolder() ? "0" : "1") + b.title.toLowerCase(); 
	return x === y ? 0 : x > y ? 1 : -1; 
};
	var node = $("#tree").fancytree({
	  source: {
	    url: "tree/",
	    cache: false
	  },
	});

	$("#tree").fancytree("getRoot").sortChildren(sorting,true).reload(); 




	



});