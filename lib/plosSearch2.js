var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	config = require('./config')
;

function Search(query) {
	fetch = function() {
		query = buildQuery(query);

		request(query, generateResponse.bind(this));
	};

	buildQuery = function(q) {
		var query = 'http://api.plos.org/search?';

		query += 'apikey=' + apiKey;
		query += '&wt=json';

		query += '&q=' + q;

		return query;
	};

	generateResponse = function(err, fullResponse, body) {
		body = parseJSON(body).response.docs;

		if (checkForErrors.call(this, err, fullResponse, body)) {
			return false;
		}

		if (this.filterResponse) {
			// Filter response
		}

		sendResponse.call(this, body);
	};

	parseJSON = function(input) {
		try {
			return JSON.parse(input);
		}
		catch (e) {
			return false;
		}
	};

	filterResponse = function(responses) {
		return _.filter(responses, function(response) {
			return response.authordisplay !== undefined;
		});
	};

	sendResponse = function(response) {
		this.emit('success', response);
	};

	checkForErrors = function(err, res, body) {
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