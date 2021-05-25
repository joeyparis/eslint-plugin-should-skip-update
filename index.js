module.exports = {
	rules: {
		'dependencies': require('./lib/rules/should-skip-update'),
	},
	configs: {
		recommended: {
			plugins: ['should-skip-update'],
			rules: {
				'dependencies': 1,
			},
		}
	}
}
