var database = {
	db: '',

	init: function() {
		this.db = window.openDatabase("hobnob", "1.0", "HobNob", 1000000);
		this.create_table_if_not_exists('OPTIONS','id unique, key, value');
		this.create_table_if_not_exists('TAGS','id unique, tag, enabled');
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
				err_callback();
			}
		);
	},

	fetch_option: function(option_name, default_value) {
		this.sql_query("SELECT value FROM OPTIONS WHERE key = '" + option_name + "'", function(tx, res) {
			options[option_name] = res.rows.item(0).value;
		}, function() {
			options[option_name] = default_value;
		});
	},

	save_option: function(option_name, value) {
		database.sql_query("DELETE FROM OPTIONS WHERE key = '" + option_name + "'", function() {});
		database.sql_query("INSERT INTO OPTIONS (key, value) VALUES ('" + option_name + "', '" + value + "')", function() {});	
	},

	error_callback: function(e) {
		alert(e);
	}
};
