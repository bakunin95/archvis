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



	it('Links source does not equal target', function(done) {
		var errorAt = 0;
		_.each(data.links,function(link){
			if(link.source == link.target){
				throw "There is a link problem at: "+errorAt+ " for node.id: "+link.target;
			}
			errorAt++;
		});
		done();
	});

});



describe('DOMTEST', function() {
	describe('files exist', function() {
		nodeTest('files exist','website/domtest/forms.html');	
		nodeTest('files exist','website/domtest/angular.html');	
		nodeTest('files exist','website/domtest/markup.html');	
		nodeTest('files exist','website/domtest/link.html');	
		nodeTest('files exist','website/domtest/htmfile.htm');	
		nodeTest('files exist','website/domtest/jspfile.jsp');	
		nodeTest('files exist','website/domtest/phpfile.php');	
	});


	describe('forms',function(){
		nodeTest('form element','website/domtest/forms.html::form1');
		nodeTest('form element','website/domtest/forms.html::form1::firstname');	
		nodeTest('form element','website/domtest/forms.html::form1::lastname');	
		nodeTest('form element','website/domtest/forms.html::form1::send');	
		nodeTest('form element','website/domtest/forms.html');	

		nodeTest('form element','website/domtest/forms.html::form>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::legend>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::select>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::textarea>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::label>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::select>2');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::select>2::optgroup>1');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::select>2::optgroup>2');	
	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::browser');	
		nodeTest('form element','website/domtest/forms.html::form>1::fieldset>1::browsers');	

		nodeTest('form element','website/domtest/forms.html::form>2::security');	

		nodeTest('form element','website/domtest/forms.html::form>3');	
		nodeTest('form element','website/domtest/forms.html::form>3::x');	

		nodeTest('form element','website/domtest/forms.html::button>1');	

	});

	describe('link',function(){
		nodeTest('a element','http://www.w3schools.com');
		nodeTest('script element','website/domtest/myscripts.js');	
		nodeTest('frame element','website/domtest/frame_a.html');	
		nodeTest('frame element','website/domtest/frame_b.html');	
		nodeTest('frame element','website/domtest/frame_c.html');	
		nodeTest('iframe element','http://www.outsidelink.com');	
		nodeTest('video element','website/domtest/link.html::video>1');
		nodeTest('audio element','website/domtest/link.html::audio>1');	
		nodeTest('applet element','Bubbles.class');	
		nodeTest('anchor element','#anchorTest');	
	});


	describe('markup',function(){
		nodeTest('script markup','website/domtest/markup.html::script>1');
		nodeTest('script markup','website/domtest/markup.html::script>1::ObjectA');

		nodeTest('script markup','website/domtest/markup.html::script>2');	
		nodeTest('script markup','website/domtest/markup.html::script>2::varA');	

		nodeTest('css markup','website/domtest/markup.html::style>1');	
		nodeTest('css markup','website/domtest/markup.html::style>1::.test');	

		
	});
});




function nodeTest(info,name){
	return it(info+': '+name, function() { data.nodes.should.contain.an.item.with.property('name', name); });		
}


