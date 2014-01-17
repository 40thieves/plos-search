var expect = require('chai').expect
,	Search = require('../lib/plosSearch2')
;

describe('Search', function() {
	describe('General Search', function() {
		this.timeout(10000);

		it('should take a query as the first argument', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				expect(data).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return an array of article objects', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				expect(data).to.be.a('array');

				done();
			});

			search.fetch();
		});

		it('should return article objects containing article metadata', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result).to.have.property('id');
					expect(result).to.have.property('publication_date');
					expect(result).to.have.property('article_type');
					expect(result).to.have.property('author_display');
					expect(result).to.have.property('abstract');
					expect(result).to.have.property('title_display');
				});

				done();
			});

			search.fetch();
		});

		it('should return article objects containing an array of authors', function(done) {
			var search = new Search('altmetrics');

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result.author_display).to.be.a('array');
				});

				done();
			});

			search.fetch();
		});
	});

	describe('Error handling', function() {
		this.timeout(10000);

		it('should return error query not provided', function(done) {
			var search = new Search('');

			search.on('success', function(data) {
				expect(data).to.not.exist;

				done();
			});

			search.on('failure', function(err) {
				expect(err).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return a useful error response if query not provided', function(done) {
			var search = new Search('');

			search.on('failure', function(err) {
				var expected = {
					statusCode: 404,
					statusMessage: 'No results found'
				};

				expect(err).to.deep.equal(expected);

				done();
			});

			search.fetch();
		});

		it('should only accept query params from the whitelist of possible params', function(done) {
			var search = new Search({
				foo: 'bar'
			});

			search.on('error', function(err) {
				expect(err).to.exist;
				expect(err).to.have.property('statusCode').that.equals(400);
				expect(err).to.have.property('statusMessage').that.equals('Query param not recognised');

				done();
			});

			search.fetch();
		});

		// Can't seem to get a error response from the API - always responds with 200
		// Will keep error handling for this in there though - it's just a bit difficult to test, until I put in mocking
	});

	describe('Advanced Search', function() {
		it('should take an object as the search parameter', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				expect(data).to.exist;

				done();
			});

			search.fetch();
		});

		it('should return an array of article objects', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				expect(data).to.be.a('array');

				done();
			});

			search.fetch();
		});

		it('should return article objects with article metadata written by the author', function(done) {
			var search = new Search({
				author: 'neylon'
			});

			search.on('success', function(data) {
				data.forEach(function(result) {
					expect(result).to.have.property('id');
					expect(result).to.have.property('publication_date');
					expect(result).to.have.property('article_type');
					expect(result).to.have.property('author_display');
					expect(result).to.have.property('abstract');
					expect(result).to.have.property('title_display');
				});

				done();
			});

			search.fetch();
		});
	});

	// describe('#titleSearch()', function() {

	// });

	// describe('#subjectSearch()', function() {

	// });

	// describe('#abstractSearch()', function() {

	// });

	// describe('#rawSearch()', function() {

	// });
});