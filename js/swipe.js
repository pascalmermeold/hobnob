// Include mustache.js in the html file
// Include jquery.touchSwipe.min.js in the html file
// Add a mustache template with id="swipe_templat" in html file
// Add a div with class="swipes" in html file

// object = data for the template, must contain an id, for example {id: 1, title: 'Titre1', text: 'test'}
// mark_callback = a callback function taking two parameters accepted and id, for example mark(accepted, id)
// 'accepted' is a boolean, true if the user has swiped right, false if user has swiped left
// 'id' is the id of the swipe that has been swiped
function add_swipe(object, mark_callback) {
	var rendered = Mustache.render($('#swipe_template').html(), object);

	var lowest_index = 0;
	$('.swipe').each(function() {
		var current_index = parseInt($(this).css("zIndex"), 10);
	    if(current_index < lowest_index) {
	        lowest_index = current_index;
	    }
	});

	$('.swipes').append(rendered);
	new_swipe = $('.swipes #' + object['id']);
	new_swipe.css('zIndex',lowest_index - 100);
	new_swipe.swipe_profile(mark_callback);
}

(function($)
{
    $.fn.swipe_profile=function(callback)
    {
       $(this).swipe( {
	        swipeStatus:function(event, phase, direction, distance, duration, fingers)
	        {
	        	if ((phase == 'end') || (phase == 'cancel'))  {

	        		if (distance > ($(window).width() * 0.5)) {
	        			if (direction == 'left') {
	        				$(this).animate({
			        			left: $(window).width() * -1
			        		}, 300, function() {
			        			callback(false,$(this).attr('id'));
			        		});
	        			}
	        			else {
	        				$(this).animate({
			        			left: $(window).width()
			        		}, 300, function() {
			        			callback(true,$(this).attr('id'));
			        		});
	        			}
	        		}
	        		else {
	        			$(this).animate({
		        			left: 0
		        		}, 300);
	        		}
	        	}

	        	if (phase == 'move') {
		        	if (direction == 'left') {
		        		distance *= -1.0;
		        	}
		        	$(this).css("left", distance);
		        }
	        },
	        threshold:200,
	        maxTimeThreshold:5000,
	        fingers:'all'
	    });
    };
})(jQuery);