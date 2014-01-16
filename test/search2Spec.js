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

		// Can't seem to get a error response from the API - always responds with 200
		// Will keep error handling for this in there though - it's just a bit difficult to test, until I put in mocking
	});

	// describe('Author Search', function() {
		// it('should allow a filter response option to be set on the module', function(done) {
		// 	var search = new Search('altmetrics');

		// 	search.filterResponse = true;

		// 	search.on('success', function(data) {
		// 		done();
		// 	});

		// 	search.fetch();
		// });

		// it('should take an author name as the first argument', function(done) {
			// var search = new Search({
			// 	author: 'neylon'
			// });

			// var search = new Search('skdh');

			// search.on('success', function(data) {
			// 	expect(result).to.exist;

			// 	done();
			// });

			// search.fetch();
		// });


		// it('should return an array of article objects', function(done) {
		// 	search.authorSearch('neylon', function(err, result) {
		// 		expect(result).to.be.a('array');

		// 		done();
		// 	});
		// });

		// it('should return article objects with article metadata written by the author', function(done) {
		// 	search.authorSearch('neylon', function(err, result) {
		// 		result.forEach(function(r) {
		// 			expect(r).to.have.property('id');
		// 			expect(r).to.have.property('publication_date');
		// 			expect(r).to.have.property('article_type');
		// 			expect(r).to.have.property('author_display');
		// 			expect(r).to.have.property('abstract');
		// 			expect(r).to.have.property('title_display');
		// 		});

		// 		done();
		// 	});
		// });
	// });

	// describe('#titleSearch()', function() {

	// });

	// describe('#subjectSearch()', function() {

	// });

	// describe('#abstractSearch()', function() {

	// });

	// describe('#rawSearch()', function() {

	// });
});