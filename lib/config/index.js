var apiKey = require('./apiKey');

var config = {
	development: {
		mode: 'development',
		api_key: apiKey
	}
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};