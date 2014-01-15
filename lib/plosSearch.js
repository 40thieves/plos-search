var config = require('./config')
,	request = require('request')
,	_ = require('underscore')
;

exports = module.exports = {};

exports.apiKey = config.api_key;

exports.search = function(q, callback) {
	var query = buildQuery(q);

	request(query, function(err, res, body) {
		body = JSON.parse(body);
		result = body.response.docs;

		if (err) {
			return callback(err, null);
		}
		else if (res.statusCode != 200) {
			err = {
				statusCode: res.statusCode,
				statusResponse: body.error,
				body: body
			};

			return callback(err, null);
		}
		else if (result.length < 1) {
			err = {
				statusCode: 404,
				statusResponse: 'No results found',
				body: body
			};

			return callback(err, null);
		}

		return callback(null, result);
	});

};

exports.authorSearch = function(q, callback) {
	var query = buildQuery('author:"' + q + '"');

	request(query, function(err, res, body) {
		body = JSON.parse(body);
		result = body.response.docs;

		if (err) {
			return callback(err, null);
		}
		else if (res.statusCode != 200) {
			err = {
				statusCode: res.statusCode,
				statusResponse: body.error,
				body: body
			};

			return callback(err, null);
		}
		else if (result.length < 1) {
			err = {
				statusCode: 404,
				statusResponse: 'No results found',
				body: body
			};

			return callback(err, null);
		}

		result = _.filter(result, function(r) {
			return r.author_display !== undefined;
		});

		return callback(null, result);
	});
};

buildQuery = function(query) {
	var q = 'http://api.plos.org/search?';

	q += 'api_key=' + apiKey;
	q += '&wt=json';

	q += '&q=' + query;

	return q;
};