module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'assets/css/main.css' : 'assets/sass/main.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'assets/sass/**/*.scss',
				tasks: ['sass'],
				options: {
			      livereload: true,
			    }
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default',['watch']);
}