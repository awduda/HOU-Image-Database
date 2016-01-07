$(".centered").delay(2000).animate({"opacity": "1"}, 500);
$(".menu").delay(1000).animate({"top": "0px"}, 500);

if($('.navigation li[data-slide="2"]').hasClass("active")===true)
{
	$(".to_left").delay(3000).animate({"margin-right": "0px"}, 500);
}

if (($('.navigation li[data-slide="3"]').hasClass("active"))==true)
{
	$(".to_right").delay(500).animate({"margin-left": "0px"}, 500);
}

jQuery(document).ready(function ($) {

	
	$(window).stellar();
	var links = $('.navigation').find('li');
	slide = $('.slide');
	button = $('.button');
	mywindow = $(window);
	htmlbody = $('html,body');
	slide = $('.slide');
	slide.waypoint(function (event, direction) {


		if (direction === 'down' & dataslide==='2') {
		    	$(".to_left").delay(500).animate({"margin-right": "0px"}, 500);
		}
		else if (direction==='down' & dataslide==='3')
		{
			$(".to_right").delay(500).animate({"margin-left": "0px"}, 500);
		}

	});
});
