var apiKey = require('./apiKey');

var config = {
	development: {
		mode: 'development',
		api_key: apiKey,

		query_params_whitelist: [
			'id',
			'everything',
			'title',
			'alternative_title',
			'author',
			'abstract',
			'introduction',
			'materials_and_methods',
			'results_and_discussion',
			'conclusions',
			'supporting_information',
			'reference',
			'publication_date',
			'received_date',
			'accepted_date',
			'journal',
			'issue',
			'subject',
			'eissn',
			'pissn',
			'elocation_id',
			'journal_id_pmc',
			'journal_id_nlm_ta',
			'journal_id_publisher',
			'publisher',
			'pagecount',
			'editor',
			'affiliate',
			'author_notes',
			'competing_interest',
			'counter_total_all',
			'counter_total_month',
			'timestamp',
			'copyright',
			'figure_table_caption',
			'cross_published_journal_name',
			'cross_published_journal_key',
			'cross_published_journal_eissn'
		]
	},

	test: {
		mode: 'test',
		api_key: apiKey,

		query_params_whitelist: [
			'test',
			'id',
			'everything',
			'title',
			'alternative_title',
			'author',
			'abstract',
			'introduction',
			'materials_and_methods',
			'results_and_discussion',
			'conclusions',
			'supporting_information',
			'reference',
			'publication_date',
			'received_date',
			'accepted_date',
			'journal',
			'issue',
			'subject',
			'eissn',
			'pissn',
			'elocation_id',
			'journal_id_pmc',
			'journal_id_nlm_ta',
			'journal_id_publisher',
			'publisher',
			'pagecount',
			'editor',
			'affiliate',
			'author_notes',
			'competing_interest',
			'counter_total_all',
			'counter_total_month',
			'timestamp',
			'copyright',
			'figure_table_caption',
			'cross_published_journal_name',
			'cross_published_journal_key',
			'cross_published_journal_eissn'
		]
	}
};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'development'] || config.development;
};