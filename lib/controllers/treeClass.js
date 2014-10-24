var constants = require( './constants' );
var fs = require("graceful-fs");
var    path = require("path");
var relationsClass = require('./relationsClass');
var analyseReportClass = require('./analyseReportClass');



var treeClass = module.exports = {
    generateTreeData: function (callback){



        function directoryTree(basepath, extensions) {
             var keyNum = 1;
            
            var _directoryTree = function (name,keyNum, extensions) {
                try{
                    var stats = fs.statSync(name);
                }
                catch(err){  
                    console.log("Ce dossier n'existe pas :"+name);
                    process.exit();
                }
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


        var result = directoryTree(constants.WEBSITE_PATH);
      

        callback(null,JSON.stringify(result));


    }
};