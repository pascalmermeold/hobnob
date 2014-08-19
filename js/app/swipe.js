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
	new_swipe = $('.swipes #' + object.id);
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
		        		$(this).css("left", (distance * -1.0));
		        	}
		        	if (direction == 'right') {
		        		$(this).css("left", distance);
			        }
		        }
	        },
	        threshold:200,
	        maxTimeThreshold:5000,
	        fingers:'all',
	        allowPageScroll: 'auto'
	    });
    };
})(jQuery);
