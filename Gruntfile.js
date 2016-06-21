module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			options: { livereload: true },
			files: ['public/**'],
			tasks: []
		},
		express: {
			all: {
				options: {
					port: 3000,
					hostname: 'localhost',
					bases: ['./public'],
					livereload: true
				}
			}
		},
		sass: {
			dev: {
				options: {
					sourceMap: true,
					dist: {
						files: {
							'public/css/bootstrap-stagemarkt.css': 'public/sass/bootstrap-stagemarkt.scss'
						}
					}
				},
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['express', 'watch']);

};