var database = {
	db: '',

	init: function() {
		this.db = window.openDatabase("aftrworkDb", "1.0", "AftrWork DB", 1000000);
		this.create_table_if_not_exists('OPTIONS','id unique, key, value');
		// create_table_if_not_exists('CONTACTS','...');
		// create_table_if_not_exists('MESSAGES','...');
	},

	create_table_if_not_exists: function(table_name, table_options) {
		this.db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS " + table_name + "(" + table_options + ")");
		}, function(e) {
			console.log(e);
		});
	},

	sql_query: function(query, success_callback, err_callback) {
		this.db.transaction(function(tx) {
				tx.executeSql(query, [], success_callback, err_callback);
			},
			function (e) {
				alert("Database Error: " + e.code);
				err_callback();
			}
		);
	},

	error_callback: function(e) {
		alert(e);
	}
};
