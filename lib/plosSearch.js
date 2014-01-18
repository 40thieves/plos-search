var util         = require('util')
,	EventEmitter = require('events').EventEmitter

,	request = require('request')
,	_       = require('underscore')

,	config = require('./config')()
;

function Search(query, options) {
	this.query = {};

	init = function() {
		this.query = query;

		if (options && options.mode) {
			config = require('./config')(options.mode);
		}

		this.queryWhitelist = config.query_params_whitelist;
	};

	fetch = function() {
		try {
			queryString = buildQuery();
		}
		catch (e) {
			var err = {
				statusCode: 400,
				statusMessage: e.message,
				body: e
			};

			this.emit('error', err);
			return false;
		}

		request(queryString, generateResponse.bind(this));
	};

	buildQuery = function() {
		var query = 'http://api.plos.org/search?';

		query += 'apikey=' + apiKey;
		query += '&wt=json';
		query += '&fq=doc_type:full';

		if (_.isEmpty(this.query))
			throw new Error('No query provided');

		var string;
		if (_.isString(this.query)) {
			string = this.query;
		}
		else if (_.isObject(this.query)) {
			var arr = [];
			for (var key in this.query) {
				if (this.queryWhitelist.indexOf(key) === -1)
					throw new Error('Query param not recognised');

				arr.push(key + ':"' + this.query[key] + '"');
			}
			string = arr.join('%20');
		}

		query += '&q=' + string;

		return query;
	};

	generateResponse = function(err, fullResponse, body) {
		if (checkForErrors.call(this, err, fullResponse, body)) {
			return false;
		}

		body = parseJSON(body).response.docs;

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

		body = parseJSON(body).response.docs;

		if (body.length < 1) {
			err = {
				statusCode: 404,
				statusMessage: 'No results found',
			};

			this.emit('failure', err);
			return true;
		}

		return false;
	};

	init();
	this.fetch = fetch;
}

util.inherits(Search, EventEmitter);
module.exports = Search;