var async = require( "async" );
var expect = require( "chai" ).expect;
var requirejs = require( "../index.js" );

describe( "requirejs.optimize", function() {
	var files = {
		"a.js": "define([\"./b\"], function( b ) { return b; });",
		"b.js": "define(function() { return \"B\"; });"
	};

	before(function( doneSetup ) {
		requirejs.setFiles( files, function( doneRequirejsMemfiles ) {
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
				doneSetup();
				doneRequirejsMemfiles();
			}, function( error ) {
				doneSetup( error );
				doneRequirejsMemfiles();
			});
		});
	});

	it( "should build dist/output.js", function() {
		expect( files ).to.include.keys( "dist/output.js" );
		expect( files[ "dist/output.js" ] ).to.be.equal( "define(\"b\",[],function(){return\"B\"}),define(\"a\",[\"./b\"],function(e){return e}),define(\"output\",function(){});" );
	});

});

describe( "concurrent requirejs.optimize calls", function() {
	var filesA, filesB;
	
	filesA = {
		"a.js": "define([\"./b\"], function( b ) { return b; });",
		"b.js": "define(function() { return \"B\"; });"
	};
	filesB = {
		"a.js": "define([\"./b\"], function( b ) { return b; });",
		"b.js": "define(function() { return \"B\"; });"
	};

	before(function( doneSetup ) {
		async.parallel([
			function( callback ) {
				requirejs.setFiles( filesA, function( doneRequirejsMemfiles ) {
					requirejs.optimize({
						appDir: ".",
						baseUrl: ".",
						dir: "dist",
						modules: [{
							name: "outputA",
							include: "a",
							create: true
						}]
					}, function() {
						callback();
						doneRequirejsMemfiles();
					}, function( error ) {
						callback( error );
						doneRequirejsMemfiles();
					});
				});
			},
			function( callback ) {
				requirejs.setFiles( filesB, function( doneRequirejsMemfiles ) {
					requirejs.optimize({
						appDir: ".",
						baseUrl: ".",
						dir: "dist",
						modules: [{
							name: "outputB",
							include: "a",
							create: true
						}]
					}, function() {
						callback();
						doneRequirejsMemfiles();
					}, function( error ) {
						callback( error );
						doneRequirejsMemfiles();
					});
				});
			}
		], function( error ) {
			doneSetup( error );
		});
	});

	it( "should build dist/outputA.js", function() {
		expect( filesA ).to.include.keys( "dist/outputA.js" );
		expect( filesA ).to.not.include.keys( "dist/outputB.js" );
		expect( filesA[ "dist/outputA.js" ] ).to.be.equal( "define(\"b\",[],function(){return\"B\"}),define(\"a\",[\"./b\"],function(e){return e}),define(\"outputA\",function(){});" );
	});

	it( "should build dist/outputB.js", function() {
		expect( filesB ).to.include.keys( "dist/outputB.js" );
		expect( filesB ).to.not.include.keys( "dist/outputA.js" );
		expect( filesB[ "dist/outputB.js" ] ).to.be.equal( "define(\"b\",[],function(){return\"B\"}),define(\"a\",[\"./b\"],function(e){return e}),define(\"outputB\",function(){});" );
	});

});
