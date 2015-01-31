var expect = require( "chai" ).expect;
var requirejs = require( "../index.js" );

describe( "requirejs.optimize", function() {

	it( "should build dist/output.js", function( done ) {
		var files = {
			"a.js": "define([\"./b\"], function( b ) { return b; });",
			"b.js": "define(function() { return \"B\"; });"
		};
		requirejs.setFiles( files );
		requirejs.optimize({
			appDir: ".",
			baseUrl: ".",
			dir: "dist",
			modules: [{
				name: "output",
				include: "a",
				create: true
			}]
		}, function() {
			expect( files ).to.include.keys( "dist/output.js" );
			expect( files[ "dist/output.js" ] ).to.be.equal( "define(\"b\",[],function(){return\"B\"}),define(\"a\",[\"./b\"],function(e){return e}),define(\"output\",function(){});" );
			done();
		}, function( error ) {
			expect( error ).to.be.null;
		});
	});

});
