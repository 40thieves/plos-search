var expect = require('chai').expect
,	Search = require('../lib/foo')
;

describe('PLOS Search', function() {
	describe('#search()', function() {
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

	describe('#search() error handling', function() {
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
	});

	// describe('#authorSearch()', function() {
	// 	it('should take an author name as the first argument', function(done) {
	// 		search.authorSearch('neylon', function(err, result) {
	// 			expect(result).to.exist;

	// 			done();
	// 		});
	// 	});

	// 	it('should return an array of article objects', function(done) {
	// 		search.authorSearch('neylon', function(err, result) {
	// 			expect(result).to.be.a('array');

	// 			done();
	// 		});
	// 	});

	// 	it('should return article objects with article metadata written by the author', function(done) {
	// 		search.authorSearch('neylon', function(err, result) {
	// 			result.forEach(function(r) {
	// 				expect(r).to.have.property('id');
	// 				expect(r).to.have.property('publication_date');
	// 				expect(r).to.have.property('article_type');
	// 				expect(r).to.have.property('author_display');
	// 				expect(r).to.have.property('abstract');
	// 				expect(r).to.have.property('title_display');
	// 			});

	// 			done();
	// 		});
	// 	});
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