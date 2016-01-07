
$(document).ready(function(){


circ_num=0;
results_per_page=10;
grid_length=5;
page_number=0;
setTimeout(function(){
set_up_ui(results_per_page,grid_length)
table_results_per_page=50;
table_results_set=[0,results_per_page]
bind_number_per_page_changer() //really explicit function names..
}, 00);
});

//===================================================================================================//

$(window).resize(function(){
adjust_grid(grid_length);
margin_top=parseInt($(".main_content_grid").css("height"))/2
- parseInt($("#image_viewer").css("height"))/2

$("#image_viewer").css({"margin-top": margin_top-50});


});


//===================================================================================================//

function set_up_ui(number_per_page,grid_length){

$("#left_arrow").css({visibility:"hidden"});
$("#right_arrow").css({visibility:"visible"});

$.ajax({



url: "/database/?initial=True",
success: function(data){

results_count=jQuery.parseJSON(data)

if (parseInt(results_count)<number_per_page){

page_last_number=results_count;
number_of_pages=1;
results_set=[0,results_count]
create_grid(parseInt(results_count),results_set);
grid_length=parseInt(grid_length)
adjust_grid(grid_length)
$("#right_arrow").css({visibility:"hidden"});
}

else{



if (parseInt(results_count)%number_per_page!=0){
number_of_pages=Math.floor((parseInt(results_count)/number_per_page))+1
page_last_number=results_count-Math.floor(parseInt(results_count)/number_per_page)*number_per_page
}
else{
number_of_pages=Math.floor((parseInt(results_count)/number_per_page))
page_last_number=number_per_page

}


results_set=[0,results_per_page]
create_grid(results_per_page,results_set);
adjust_grid(grid_length)
}

$("#right_arrow").unbind()
$("#left_arrow").unbind()

page_number_generator(number_of_pages)
pg_highlighter(number_of_pages)
page_key_binder(number_of_pages);
view_button_binder(results_count)
}

});

}

function grid_transition(results_set){
$('.block_container').empty();

create_grid(results_per_page,results_set);
adjust_grid(grid_length)
}



//===================================================================================================//

function create_grid(results_per_page, results_set){

if (page_number+1==number_of_pages){
results_per_page=page_last_number;
}

im_url='';
for (var i=0; i<results_per_page; i++){

$(".block_container").append('<div class="image_block"></div>')
delay_counter=200;

};

$.ajax({

url: "/database/?get_pk="+results_set.toString(),
success: function(data){

pk_list=jQuery.parseJSON(data)

for (i=0; i< $('.image_block').length; i++)
{
$($('.image_block')[i]).attr("id","im_"+pk_list[i]);
populate_image_bgs(pk_list[i]);

}

},

});

image_binder();
//$('.image_block').transition({ opacity: 1, delay: 1000, duration: 1000});
}

//===================================================================================================//

function populate_image_bgs(i){

$.ajax({

url: "/database/?i="+i.toString(),

success: function(data){
im_url="url("+"'/static/images/temp/"+data.split('.fits')[0]+".jpg"+"')";

$("#im_"+i.toString()).css("background-image",im_url);

},


});

}

//===================================================================================================//


function populate_image_data(im_id){
im_id=im_id.slice(3)

im_data='';
$.ajax({
url:"/database/?info_id="+im_id,

success: function(data){

im_data=jQuery.parseJSON(data)

$('#file_name').text(im_data[0].fields['file_field'].split('/db_temp/')[1]);
$('#object_name').text("Object: "+im_data[0].fields['object_name']);
$('#image_date').text("Date: "+im_data[0].fields['date_time']);

$('#info_mini_header tr')[1].children[0].textContent="Observatory";
$('#info_mini_header tr')[1].children[1].textContent=im_data[0].fields['observatory_name']

$('#info_mini_header tr')[2].children[0].textContent="Telescope";
$('#info_mini_header tr')[2].children[1].textContent=im_data[0].fields['telescope_name']

$('#info_mini_header tr')[3].children[0].textContent="Observer";
$('#info_mini_header tr')[3].children[1].textContent=im_data[0].fields['observer_name']

$('#info_mini_header tr')[4].children[0].textContent="Filter";
$('#info_mini_header tr')[4].children[1].textContent=im_data[0].fields['filter_name_name']

$('#info_mini_header tr')[5].children[0].textContent="RA";
$('#info_mini_header tr')[5].children[1].textContent=im_data[0].fields['RA']

$('#info_mini_header tr')[6].children[0].textContent="DEC";
$('#info_mini_header tr')[6].children[1].textContent=im_data[0].fields['DEC']



full_table='<table id = "info_mini_header"\
class="pure-table">\
<thead>\
<tr>\
<th>Card</th>\
<th>Value</th>\
<th>Comment</th>\
</tr>\
</thead>\
<tbody>'

header_data_list=Object.keys(im_data[0].fields['header_data_other']);

for (var i=0; i<Object.keys(im_data[0].fields['header_data_other']).length; i++){
full_table=full_table+"<tr>\
<td>"+header_data_list[i]+"\
<td>"+im_data[0].fields['header_data_other'][header_data_list[i]]+"</td>\
<td>"+im_data[0].fields['header_comments'][header_data_list[i]+"_comment"]+"</td>\
</tr>"
}
full_table=full_table+"</tbody></table></div>";

}});


}

//===================================================================================================//

function bind_number_per_page_changer(){
$( "#number-per-page" ).change(function() {

results_per_page=parseInt($("#number-per-page").val())

$('.block_container').empty()
set_up_ui(results_per_page,grid_length)
});
}



//===================================================================================================//




function adjust_grid(col_num){

content_grid_width=$(".main_content_grid").width()
content_grid_height=$(".main_content_grid").height()
image_width=$(".image_block").width()

if (results_per_page>col_num){

number_of_rows=results_per_page/col_num;

if (number_of_rows%1!=0){
number_of_rows=Math.floor(number_of_rows)+1;
}

}

else{number_of_rows=1}

image_block_width=col_num*image_width;
image_block_height=number_of_rows*image_width; //image width/height are same.
is_biggest=false;

while (is_biggest==false){

image_block_width=col_num*image_width;
image_block_height=number_of_rows*image_width;
if (image_block_width<content_grid_width-200 && image_block_height<content_grid_height-300){
image_width=image_width+20;
$(".image_block").css({width:image_width});
$(".image_block").css({height:image_width});


}

else if (image_block_width>content_grid_width-20 || image_block_height>content_grid_height-200){

image_width=image_width-20;
$(".image_block").css({width:image_width});
$(".image_block").css({height:image_width});


}
else{is_biggest=true

$(".image_block").hover(function()
{
$(this).css({width:image_width-6});
$(this).css({height:image_width-6});
},

function(){
$(this).css({width:image_width});
$(this).css({height:image_width});

});

}



}



$('.block_container').css({width: 'auto'});

    $('.block_container').css({width: col_num*(image_width+26)});
    $('.block_container').css({

        left: ($(".main_content_grid").width() - $('.block_container').outerWidth())/2-3,
        top: ($('.main_content_grid').height() - $('.block_container').outerHeight())/2 ,

    });
}


//===================================================================================================//

function page_number_generator(num_pages){
$('.page_numbers').empty()
for (var i=0; i<num_pages; i++){
$('.page_numbers').append("<div id='pg_"+i.toString()+"' class='select_circle'></div>");
}

$('#pg_0').removeClass("select_circle").addClass("selected_circle");
}

//===================================================================================================//

function page_key_binder(page_count){

$("#left_arrow").hover(
function(){
$("#left_arrow").css({opacity:".7"});
},
function(){
$("#left_arrow").css({opacity:"1"});
});



$("#right_arrow").hover(
function(){
$("#right_arrow").css({opacity:".7"});
},
function(){
$("#right_arrow").css({opacity:"1"});
});

//----

$("#right_arrow").click(function(){
page_number=page_number+1;
$("#left_arrow").css({visibility:"visible"});

$(".select_circle").css("opacity","");
circ_num=parseInt($('.selected_circle').attr('id').slice(3));
results_set=[results_set[0]+results_per_page,results_set[1]+results_per_page]
grid_transition(results_set)
$("#pg_"+circ_num.toString()).removeClass("selected_circle").addClass("select_circle").css({opacity:"1"});
$("#pg_"+(circ_num+1).toString()).removeClass("select_circle").addClass("selected_circle");
pg_highlighter();
circ_num=circ_num+1;
if ((circ_num+1)==page_count)
{
$("#right_arrow").css({visibility:"hidden"});
}
});

//----

$("#left_arrow").click(function(){
page_number=page_number-1;

$("#right_arrow").css({visibility:"visible"});
$(".select_circle").css("opacity","");
results_set=[results_set[0]-results_per_page,results_set[1]-results_per_page]
grid_transition(results_set);
circ_num=parseInt($('.selected_circle').attr('id').slice(3));
;
$("#pg_"+circ_num.toString()).removeClass("selected_circle").addClass("select_circle").css({opacity:"1"});
$("#pg_"+(circ_num-1).toString()).removeClass("select_circle").addClass("selected_circle");
circ_num=circ_num-1
pg_highlighter();
if ((page_number)==0)
{
$("#left_arrow").css({visibility:"hidden"});
}
}
);

}

//===================================================================================================//

function pg_highlighter(page_count){
$(".select_circle").click(function(){

	$("#right_arrow").css({visibility:"visible"});
	$("#left_arrow").css({visibility:"visible"});
	$(".selected_circle").each(function(){
	$(this).removeClass("selected_circle").addClass("select_circle").css({opacity:"1"})});
	$(this).removeClass("select_circle").addClass("selected_circle").css({opacity:"0.3"});
	circ_num_new=parseInt($('.selected_circle').attr('id').slice(3));

	page_number=circ_num_new;

	mult_count=circ_num_new-circ_num

	if (circ_num_new>circ_num){

	results_set=[results_set[0]+mult_count*results_per_page,results_set[1]+mult_count*results_per_page]
	grid_transition(results_set);

	}
	else{

	results_set=[results_set[0]-(Math.abs(mult_count)*results_per_page),results_set[1]-(Math.abs(mult_count)*results_per_page)]

	grid_transition(results_set);
	}
	circ_num=circ_num_new;
	if ((circ_num)==0)
	{
	$("#left_arrow").css({visibility:"hidden"});
	}
	if ((circ_num+1)==page_count)
	{

	$("#right_arrow").css({visibility:"hidden"});
	}
});
$(".select_circle").hover(

function(){

if ($(this).css("opacity")!="0.3")
{
	$(this).css({opacity:".7"});
}
},
function(){
if ($(this).css("opacity")!="0.3")
{
	$(this).css({opacity:"1"});
}
});
}

//===================================================================================================//

function view_button_binder(results_per_page){

$("#grid_button").click(function(){
$("#table_manager").remove();

$("#table_button").on("click", view_button_binder(results_per_page));
$("#grid_button").off();
$(".bottom_menu").show()
$(".block_container").show()
$("#table_button").css({"opacity":"1"});
$("#grid_button").css({"opacity":".3"});

});

$("#table_button").click(function(){
$("#table_manager").remove()
$(".block_container").hide()
$("#grid_button").on("click", view_button_binder(results_per_page));
$("#table_button").off();
$("#grid_button").css({"opacity":"1"});
$("#table_button").css({"opacity":".5"});
$(".bottom_menu").hide()
table_generator(results_count);

});

}

//===================================================================================================//

function table_generator(table_results_per_page){
$(".main_content_grid").append('<div id="table_manager"><table id = "info_table" class="pure-table">\
<thead>\
<tr>\
    <th>Name</th>\
    <th>Observatory</th>\
    <th>Telescope</th>\
    <th>Object</th>\
    <th>Observer</th>\
    <th>Date</th>\
    <th>RA</th>\
    <th>DEC</th>\
</tr>\
</thead>\
<tbody>\
');

get_table_data(table_results_set)

for (var i=0; i<table_results_per_page; i++){
$("#info_table tbody:last").append("<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>\
</td><td>1</td><td>1</td></tr>");
}
$(".main_content_grid").append("</div>");}

//===================================================================================================//

function image_binder(){

$('.image_block').click(function(){
//$('.image_block').transition({"opacity":.1,duration: 1000});
//$('.bottom_menu').transition({"opacity":.1,duration: 1000});
create_image_viewer($(this).attr("id"))
});

}

//===================================================================================================//

function get_table_data(table_results_set){

$.ajax({

url: "/database/?table_data=["+table_results_set.toString()+"]",

success: function(data){

table_data=jQuery.parseJSON(data);




},
});
}

//===================================================================================================//



function destroy_image_viewer(){
$('#image_viewer').remove()
//$('.image_block').animate({"opacity":1},500);
//$('.bottom_menu').animate({"opacity":1},500);
}

//===================================================================================================//
function create_image_viewer(clicked_image){

$(".main_content_grid").append("<div id='image_viewer'></div>");
$("#image_viewer").append("<div id='main_image_preview'></div>");
$("#main_image_preview").css({"background-image":$("#"+clicked_image).css("background-image")});
$("#image_viewer").append("<div id='info_area'></div>");
$("#info_area").append("<div id='info_name_object_date'></div>");
$("#info_area").append("<div id='info_filter_scaling_menu'></div>");
$("#info_area").append("<div id='info_header_sample_menu'><div id='table_length'></div><div id='\
info_header_expand'><p>View Full Header</p></div></div>");
margin_top=parseInt($(".main_content_grid").css("height"))/2 - parseInt($("#image_viewer").css("height"))/2;

$("#image_viewer").css({"margin-top": margin_top-50});
mini_table_generator();

$("#info_name_object_date").append('<div id="x_button"></div>');
$("#info_name_object_date").append('<h2 id="file_name">image_longimage_name.fits</h2>');
$("#info_name_object_date").append('<div id="info_sub"><h5 id="object_name">Object: M24</h5>\
<h5 id="image_date" style="float: right">Date: 12/25/96</h5></div>');

populate_image_data(clicked_image)
//onclick events for main image view
image_manipulation_table_generator()


$('#info_header_expand').click(function(im_data){
header_view_extender(full_table)

});
$('#x_button').click(function(){
destroy_image_viewer();
});
}

//===================================================================================================//

function header_view_extender(full_table){

$('#image_viewer').animate({"width":"71vw"},500);
$('#info_area').animate({"width":"46vw"},500);
$('#info_header_sample_menu').animate({"width":"27.5vw"},500);
$('#info_header_sample_menu').animate({"height":"25vw"},500);
$('#info_name_object_date').animate({"width":"43vw"},500);
$('#table_length').animate({"height":"23vw"},500);
$('#table_length').empty();
$('#table_length').append(full_table)
$('#info_header_expand').unbind("click").click(function(){header_view_collapser()});
$('#info_header_sample_menu').css("box-shadow", "10px 10px 5px #888");

}

//===================================================================================================//

function header_view_collapser(){


$('#info_header_sample_menu').animate({"height":"17vw"},{"queue":true,"duration":500});
$('#table_length').animate({"height":"15vw"},{"queue":true,"duration":1000});
$('#info_name_object_date').animate({"width":"35vw"},500);
$('#table_length').empty();
mini_table_generator()
$('#info_header_sample_menu').animate({"width":"17.65vw"},{"queue":false,"duration":500});

$('#info_area').animate({"width":"36vw"},{"queue":false,"duration":500});
$('#image_viewer').animate({"width":"61vw"},{"queue":false,"duration":500});

$('#info_header_expand').unbind("click").click(function(){header_view_extender()});
$('#info_header_sample_menu').css("box-shadow", "10px 10px 5px #888");
$('#info_header_expand p').text("View Full Header");
}

//===================================================================================================//

function mini_table_generator(){

$("#table_length").append('<table id = "info_mini_header"\
class="pure-table">\
<thead>\
<tr>\
<th>Card</th>\
<th>Value</th>\
</tr>\
</thead>\
<tbody>');

for (var i=0; i<6; i++){
$("#info_mini_header tbody:last").append("<tr>\
<td>Observatory</td>\
<td>Yerkesatory</td>\
</tr>");

}
$("#info_header_sample_menu").append("</tbody></table>");

}

//===================================================================================================//

function image_manipulation_table_generator(){
$("#info_filter_scaling_menu").append("<table id='manipulation_table' class='pure-table'>\
<thead><tr><th>Preview Scaling</th></tr></thead><tbody><tr><td>\
<input id='scale_range' type='range' name='scale_value' \
min='85' max='100'></td></tr>\
<tr><thead><th>Scale Type</th></thead><tr><td>\
<input class='info_input' value='sqrt' type='button'>\
<input class='info_input' value='linear' type='button'>\
<input class='info_input' value='CubeRoot' type='button'>\
<input class='info_input' value='log' type='button'>\
<input class='info_input' value='sqrtlog' type='button'>\
<input class='info_input' value='loglog' type='button'>\
</td></tr>\
<tr><thead><th>Preview Color</th></thead>\
<tr><td><input class='info_input' type='button'><p class='scalar'>Inverted</p></input>\
<input class='info_input' type='button'><p class='scalar'>Heat</p></input></td></tr>");
}

//===================================================================================================//
