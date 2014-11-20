oldcode


   		//function(callbackFirst){
	    			/*scan(website_folder, ['js','css'], function(err, fileList) {
			    		async.map(fileList, function(filePath,callbackfileList){
			    			var group = 2;
			    			if(filePath.substring(filePath.length-3,filePath.length).toLowerCase() == ".js"){
			    				group = 2;
		    					var target = relationsClass.addNodes({"name":filePath,"group":group, "exist":true});

		    					relationsClass.findAjaxRelations(filePath,target,function(){
				    				fs.readFile(filePath,function(err,data){
										
										

										var dependances = null;
										try{
											var dep = detective(data);
											var depAmd = detectiveAmd(data);
											dependances = dep.concat(depAmd);
										}
										catch(e){
											
										}


										if(dependances !== null){
											async.map(dependances, function(dependance,cbDetective){
												if(typeof dependance == "string"){
													relationsClass.correctPath(dependance,filePath,function(err,correctedPath){
													
													
														if(correctedPath.substring(correctedPath.length-3,correctedPath.length).toLowerCase() !== ".js"){
															correctedPath = correctedPath+".js";
														}


														var sourceFound = relationsClass.findNode(correctedPath);




														if (sourceFound !== null){
															relationsClass.addLinks({"source":sourceFound,"target":target });								
														}
														else{
															var nodeId = relationsClass.addNodes({"name":correctedPath,"group":group});
															relationsClass.addLinks({"source":nodeId,"target":target });
														}
												

														cbDetective();
													});
												}
												else{
													cbDetective();
												}
											},function(err,result){
												callbackfileList();
											});	
										}
										else{
											callbackfileList();
										}

											

										//relationsClass.addNodes({"name":filePath,"group":group, "exist":true});

										

									});
								});
			    				


			    			}
			    			else if(filePath.substring(filePath.length-4,filePath.length).toLowerCase() == ".css"){
			    				group = 3;
			    				relationsClass.addNodes({"name":filePath,"group":group, "exist":true});
			    				callbackfileList();
			    			}
				    		//relationsClass.addNodes({"name":filePath,"group":group, "exist":true});
				    		
						},function(err,result){
				    		callbackFirst(err,"");
				    	});
				    }); */
//callbackFirst(null,"");
	    		//},
	    		//function(first,callbackHTML){
			    	// Trouver les fichiers de type html (doit être en lower case)
				    //	scan(website_folder, ['html','php','erb','htm','tpl','jade','ejs','hbs'], function(err, htmlFileList) {
							//callbackHTML(null,htmlFileList);
						//	callbackHTML(null,"");
				    //	});   
			    //},