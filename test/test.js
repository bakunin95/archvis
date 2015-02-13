var chai = require("chai"),
	expect = require("chai").expect,
	supertest = require("supertest"),
	fs = require("fs");


var _ = require('underscore')._;


chai.use(require('chai-things'));
var should = chai.should();



var data = fs.readFileSync('./app/data/graphe.json', "utf8");

data = JSON.parse(data);


describe('ALL', function() {


	it('Graph exist', function() {
			should.exist(data);
	});
	it('Node exist', function() {
			should.exist(data.nodes);
			expect(data.nodes.length).gt(4);
	});
	it('Link exist', function() {
			should.exist(data.links);
			expect(data.links.length).gt(4);
	});
	it('Group exist', function() {
			should.exist(data.groups);
			expect(data.groups.length).gt(4);
	});

	it('Nodes all have essential property', function() {
		data.nodes.should.all.have.property('_id');
		data.nodes.should.all.have.property('id');
		data.nodes.should.all.have.property('group');	
		data.nodes.should.all.have.property('name');
		data.nodes.should.all.have.property('time');

	});

	it('Links all have essential property', function() {
		data.links.should.all.have.property('_id');
		data.links.should.all.have.property('source');
		data.links.should.all.have.property('target');	
	});


/*
	it('Links source does not equal target', function(done) {
		var errorAt = 0;
		_.each(data.links,function(link){
			if(link.source == link.target){
				throw "There is a link problem at: "+errorAt+ " for node.id: "+link.target;
			}
			errorAt++;
		});
		done();
	});*/

});




describe('JSTEST', function() {
	describe('Js files exist', function() {
		nodeTest('Js files exist','website/jstest/array.js');	
		nodeTest('Js files exist','website/jstest/class.js');	
		nodeTest('Js files exist','website/jstest/function.js');	
		nodeTest('Js files exist','website/jstest/object.js');	
		nodeTest('Js files exist','website/jstest/function.js');	
	});

	describe('array.js element', function() {
		nodeTest('Array exist','website/jstest/array.js::arrayA');	
		nodeTest('Array exist','website/jstest/array.js::arrayB');	
		nodeTest('Array exist','website/jstest/array.js::arrayC');
		nodeTest('Array exist','website/jstest/array.js::arrayD');
		nodeTest('Array exist','website/jstest/array.js::arrayE');
	});

	describe('function.js element', function() {
		nodeTest('Function exist','website/jstest/function.js::funcA()');	
		nodeTest('Function exist','website/jstest/function.js::funcB()');	
		nodeTest('Function exist','website/jstest/function.js::funcC()');	
		nodeTest('Function exist','website/jstest/function.js::funcD()');	
		nodeTest('Function exist','website/jstest/function.js::funcD()::funcE()');	
	});

	describe('variables.js element', function() {
		nodeTest('Variable exist','website/jstest/variables.js::stringA');	
		nodeTest('Variable exist','website/jstest/variables.js::stringB');	
		nodeTest('Variable exist','website/jstest/variables.js::stringC');	
	});

	describe('object.js element', function() {




		nodeTest('Object exist','website/jstest/object.js::objectA');	
		nodeTest('Object exist','website/jstest/object.js::objectB');	
		nodeTest('Object exist','website/jstest/object.js::objectC');	
		nodeTest('Object exist','website/jstest/object.js::objectD');	
		nodeTest('Object exist','website/jstest/object.js::objectE');	
		nodeTest('Object exist','website/jstest/object.js::objectF');	
		nodeTest('Object exist','website/jstest/object.js::objectG');	
		nodeTest('Object exist','website/jstest/object.js::objectH');	
		nodeTest('Object exist','website/jstest/object.js::person');	

		nodeTest('Object exist','website/jstest/object.js::objectC::methodA()');	
		nodeTest('Object exist','website/jstest/object.js::objectB::methodB()');	
		nodeTest('Object exist','website/jstest/object.js::objectD::methodC()');	
		nodeTest('Object exist','website/jstest/object.js::person::getName()');	

	});

	describe('class.js element', function() {
		nodeTest('Function exist','website/jstest/class.js::Apple()');
		nodeTest('Function exist','website/jstest/class.js::getAppleInfo()');
		nodeTest('Function exist','website/jstest/class.js::Apple2()');
		nodeTest('Function exist','website/jstest/class.js::Apple3()');
		nodeTest('Function exist','website/jstest/class.js::Apple4');
		nodeTest('Function exist','website/jstest/class.js::Apple5()');
	});
});




describe('JSTEST', function() {
	describe('Js files exist', function() {
		nodeTest('Js files exist','website/jstest/array.js');	
		nodeTest('Js files exist','website/jstest/class.js');	
		nodeTest('Js files exist','website/jstest/function.js');	
		nodeTest('Js files exist','website/jstest/object.js');	
		nodeTest('Js files exist','website/jstest/function.js');	
	});

	describe('array.js element', function() {
		nodeTest('Array exist','website/jstest/array.js::arrayA');	
		nodeTest('Array exist','website/jstest/array.js::arrayB');	
		nodeTest('Array exist','website/jstest/array.js::arrayC');
		nodeTest('Array exist','website/jstest/array.js::arrayD');
		nodeTest('Array exist','website/jstest/array.js::arrayE');
	});

	describe('function.js element', function() {
		nodeTest('Function exist','website/jstest/function.js::funcA()');	
		nodeTest('Function exist','website/jstest/function.js::funcB()');	
		nodeTest('Function exist','website/jstest/function.js::funcC()');	
		nodeTest('Function exist','website/jstest/function.js::funcD()');	
		nodeTest('Function exist','website/jstest/function.js::funcD()::funcE()');	
	});

	describe('variables.js element', function() {
		nodeTest('Variable exist','website/jstest/variables.js::stringA');	
		nodeTest('Variable exist','website/jstest/variables.js::stringB');	
		nodeTest('Variable exist','website/jstest/variables.js::stringC');	
	});

	describe('object.js element', function() {




		nodeTest('Object exist','website/jstest/object.js::objectA');	
		nodeTest('Object exist','website/jstest/object.js::objectB');	
		nodeTest('Object exist','website/jstest/object.js::objectC');	
		nodeTest('Object exist','website/jstest/object.js::objectD');	
		nodeTest('Object exist','website/jstest/object.js::objectE');	
		nodeTest('Object exist','website/jstest/object.js::objectF');	
		nodeTest('Object exist','website/jstest/object.js::objectG');	
		nodeTest('Object exist','website/jstest/object.js::objectH');	
		nodeTest('Object exist','website/jstest/object.js::person');	

		nodeTest('Object exist','website/jstest/object.js::objectC::methodA()');	
		nodeTest('Object exist','website/jstest/object.js::objectB::methodB()');	
		nodeTest('Object exist','website/jstest/object.js::objectD::methodC()');	
		nodeTest('Object exist','website/jstest/object.js::person::getName()');	

	});

	describe('class.js element', function() {
		nodeTest('Function exist','website/jstest/class.js::Apple()');
		nodeTest('Function exist','website/jstest/class.js::getAppleInfo()');
		nodeTest('Function exist','website/jstest/class.js::Apple2()');
		nodeTest('Function exist','website/jstest/class.js::Apple3()');
		nodeTest('Function exist','website/jstest/class.js::Apple4');
		nodeTest('Function exist','website/jstest/class.js::Apple5()');
	});
});




function nodeTest(info,name){
	return it(info+': '+name, function() { data.nodes.should.contain.an.item.with.property('name', name); });		
}


