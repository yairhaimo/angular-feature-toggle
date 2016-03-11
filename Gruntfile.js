/*jshint camelcase: false */

'use strict';

module.exports = function (grunt) {

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // load all grunt configuration
    require('load-grunt-config')(grunt);

    // Register Tasks
    grunt.registerTask('default', 'Start working on this project.', [
        'jshint'
	]);

	// Bower
	grunt.registerTask('bower', 'Build production ready assets and views.', [
		'clean',
		'copy:bower'
	]);

    // Build
    grunt.registerTask('build', 'Build production ready assets and views.', [
        'clean',
		'copy:dist',
		'uglify'
    ]);
};
