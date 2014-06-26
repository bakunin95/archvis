var constants = require( './constants' );
var fs = require("graceful-fs");
var    path = require("path");
var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');



exports.start = function (req,res){

	res.header('Content-Type','application/json');








var result = directoryTree(constants.WEBSITE_PATH);





function directoryTree(basepath, extensions) {
	var keyNum = 1;
	
    var _directoryTree = function (name,keyNum, extensions) {
        var stats = fs.statSync(name);

        var item = {
            path: constants.WEBSITE_PATH +"/"+ path.relative(basepath, name),
            title: path.basename(name),
            key: keyNum
        };

        if (stats.isFile()) {
            if (extensions &&
                extensions.length > 0 &&
                extensions.indexOf(path.extname(name).toLowerCase()) == -1) {
                return null;
            }
            item.type = 'file';
        } else {
            item.type = 'directory';
            item.children = fs.readdirSync(name).map(function (child) {
                return _directoryTree(path.join(name, child),keyNum++, extensions);
            }).filter(function (e) {
                return e != null;
            });

            if (item.children.length == 0) {
                return null;
            }else{
            	item.folder = true;
            }
        }

        return item;
    }
    return _directoryTree(basepath,keyNum++, extensions);
}



	res.send(JSON.stringify(result));

	/*

[{"title": "Node 1", "key": "1"},
	 {"title": "Folder 2", "key": "2", "folder": true, "children": [
	    {"title": "Node 2.1", "key": "3"},
	    {"title": "Node 2.2", "key": "4"}
	  ]}
	]
	*/

};