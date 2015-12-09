module.exports = {
	dist: {
		files: [{
			expand: true,
			dot: true,
			cwd: 'src/',
			src: [
				'*.js'
			],
			dest: 'dist/'
		}]
	},
	bower: {
		files: [{
			expand: true,
			dot: true,
			cwd: 'src/',
			src: [
				'*.js'
			],
			dest: 'build/'
		}, {
			expand: true,
			dot: true,
			cwd: 'assets/',
			src: [
				'**'
			],
			dest: 'build/'
		}]
	}
};
