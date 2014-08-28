function initTags() {
	$$('#' + options['search_type'] + '-search').prop('checked',true);

	$$('input[name=search-type]').on('change',function() {
		database.sql_query("DELETE FROM OPTIONS WHERE key = 'search_type'", function() {});
		database.sql_query("INSERT INTO OPTIONS (key, value) VALUES ('search_type', '" + $(this).val() + "')", function() {});
		options['search_type'] = $(this).val();
	});

	$$('#new-tag-button').on('click', function() {
		tag = $$('#new-tag').val().toLowerCase();
		if( tag != '') {
			database.sql_query("DELETE FROM TAGS WHERE tag = '" + tag + "'", function() {});
			database.sql_query("INSERT INTO TAGS (tag, enabled) VALUES ('" + tag + "', '')", function() {
				$$('#new-tag').val('');
				$$('#new-tag').blur();
				addTag(tag, 'false');
			});
		}
	});

	database.sql_query("SELECT * FROM TAGS", function(tx, res) {
		for(var i=0; i<res.rows.length; i++) {
			addTag(res.rows.item(i).tag);
		}
	}, function() {});
}

function addTag(tag) {
	checked = (tag == options['selected_tag']) ? 'checked' : '';

	var rendered = Mustache.render($('#tag_template').html(), {tag: tag, checked: checked});
	$(rendered).insertBefore('#new-tag-li');

	$$('#tag-' + tag + ' .tag-radio').on('change', function() {
		if($(this)[0].checked) {
			database.sql_query("DELETE FROM OPTIONS WHERE key = 'selected_tag'", function() {});
			database.sql_query("INSERT INTO OPTIONS (key, value) VALUES ('selected_tag', '" + $(this).val() + "')", function() {});
			options['selected_tag'] = $(this).val();
		}
	});

	$$('#tag-' + tag).on('delete',function() {
		tag = $(this).attr('id').substr(4);
		database.sql_query("DELETE FROM TAGS WHERE tag = '" + tag + "'", function() {});
	});
}