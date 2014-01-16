var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	config = require('./config')
;

function Search(query) {
	fetch = function() {
		query = _buildQuery(query);

		// request(query, _generateResponse.bind(this));
		request(query, _generateResponse.bind(this));
	};

	_buildQuery = function(q) {
		var query = 'http://api.plos.org/search?';

		query += 'api_key=' + apiKey;
		query += '&wt=json';

		query += '&q=' + q;

		return query;
	};

	_generateResponse = function(err, fullResponse, body) {
		body = _parseJSON(body).response.docs;

		if (_checkForErrors.call(this, err, fullResponse, body)) {
			return false;
		}

		// if (responseFilter) {
		// 	// Filter response
		// }

		_sendResponse.call(this, body);
	};

	_parseJSON = function(input) {
		try {
			return JSON.parse(input);
		}
		catch (e) {
			return false;
		}
	};

	// _filterResponse = function(responses) {
	// 	return _.filter(responses, function(response) {
	// 		return response.author_display !== undefined;
	// 	});
	// };

	_sendResponse = function(response) {
		this.emit('success', response);
	};

	_checkForErrors = function(err, res, body) {
		if (err) {
			this.emit('error', err);
			return true;
		}
		else if (res.statusCode != 200) {
			err = {
				statusCode: res.statusCode,
				statusMessage: 'Error',
				body: body
			};

			this.emit('error', err);
			return true;
		}
		else if (body.length < 1) {
			err = {
				statusCode: 404,
				statusMessage: 'No results found',
			};

			this.emit('failure', err);
			return true;
		}

		return false;
	};

	this.fetch = fetch;
}

util.inherits(Search, EventEmitter);
module.exports = Search;