jQuery(function($) {


/*
    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
              lineNumbers: true,
              mode: "css"
            });

	var browserHeight = document.documentElement.clientHeight;
	myCodeMirror.getWrapperElement().style.height = (0.8 * browserHeight)+ 'px';
	myCodeMirror.refresh();*/


	if(window.location.hash == "#tableau"){
		$("#leftPanel").remove();
	}

	$('#mainLayout').height($(window).height()).layout({ applyDefaultStyles: true, east: { size: 10}  });

	
	$(".analyse-menu a").click(function(){
console.log(this);
console.log($(this));


		window.location.hash = $(this)[0].hash;
		window.location.reload(true);
	});

	


	



});