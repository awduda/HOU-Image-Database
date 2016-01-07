function previewEditor(evt) {

select_all=true;
explodeGrid()
files= evt.target.files;
varList=new Array();
error_list=[]
activeList=new Array();
checkedList=[];
var x='';
//----------------------------------------------------------------------------------------------------

for (var i=0;i<files.length;i++) //populates left div with image names
{
$('.FITSdescription').append("<div id='op_"+i.toString()+"' class='image_operation'><input class='selected_image' type='checkbox' value='selected_image'> <div class='remove_button'></div><div id=im"+i.toString()+" onclick='selectImage(this)'\
class='imageDescription'>"+files[i].name+"</div></div>");
imData=getImageDatas(files[i]);
varList.push(imData);
activeList.push(i);
}

var d = document.getElementById("im0");
d.className = d.className + " selected";

$('.remove_button').click(function(){
	el=$(this).parent().attr('id').slice(3);
	removeElement(el);});


setTimeout(function(){

for (var i=0; i<files.length; i++)
{

$('.headerAttributes').append('<div class="header_hidden" \
id="header_'+i.toString()+'">'+varList[i].form);
$('#header_0').css("display","block");}
card_binder();
loadImage(0,files);
},2000);


};

function getImageDatas(file)
{

var image=new Object();
var f=file;
if (f)
{
var r = new FileReader(); //gets HDU by reading file as ArrayBuffer
r.onload = function(e) {
var contents = e.target.result;
var fitsIMAGE = new astro.FITS.File(contents);
image.fits=fitsIMAGE;
var header = fitsIMAGE.getHeader();
var form="<input  class='button-small pure-button' id='reset_button' type='submit' value='\
Reset Changes'><input  class='button-small pure-button' type='button' \
id='add_card' value='Add Card'><form method='GET' id='my_form'></form>\
<table style='overflow: auto;' class='pure-table pure-table-bordered' id='table_0'><tbody><thead><tr><th>Card\
</th><th>Value</th><th>Comment</th></tr></thead>";



//----------------------------------------------------------------------------------------------------


for (key in header.cards) {

form+="<tr><td>";
form+=key;
x=header;
form+=":</td><td><input name='"+f.name+"_"+key+"' form='file_input_main' size='10'\
value='"+header.get(key)+"'></input></td><td class='header_comment'><input name='"+f.name+"_"+key+"_comment' form='file_input_main' size='20' value='"+header.cards[key].comment+"'></td></tr>";
}

form+="</tr></table></tbody>";
image.form=form;
}
r.readAsArrayBuffer(f);
var g = new FileReader(); //gets image URL for preview by reading files as DataUrl
g.onloadend = function(e) {
var contents = e.target.result;
image.contents=contents;
}

g.readAsDataURL(f);
}
return image;
}


//----------------------------------------------------------------------------------------------------


function loadImage(imNum,files)
{
document.getElementById("fitsPreview").style.width="40%";
document.getElementById("fitsPreview").style.marginTop="30px";
document.getElementById("fitsPreview").style.marginBottom="30px";
var f=new FITS();
f.load(varList[imNum].contents);

setTimeout(function(){
f.draw("fitsPreview");f.update('cuberoot');
},500);
}


//----------------------------------------------------------------------------------------------------


function removeElement(el){

if ($("#im"+el).hasClass('selected')){
	try{
	index=activeList.indexOf(parseInt(el))-1;
	selectImage(document.getElementById('im'+activeList[index].toString()))
	}
	catch(TypeError){
	index=activeList.indexOf(parseInt(el))+1;
	selectImage(document.getElementById('im'+activeList[index].toString()))
	}
}

$("#op_"+el).remove();
$("#header_"+el).remove();
activeList.splice(activeList.indexOf(parseInt(el)),1);


}


//----------------------------------------------------------------------------------------------------


function selectImage(el)
{

$("#error_table").remove();
div = document.getElementById(el.id);
imNum=Number(el.id.slice(2));

for (var i=0; i<$('.imageDescription').length; i++){

$($('.imageDescription')[i]).removeClass('selected');

if ($($('.imageDescription')[i]).hasClass('hasError')==false)
{
	$($('.imageDescription')[i]).css('border-color', "#c0c0c0")
}

}
$("#im"+imNum).addClass('selected');

if ($("#im"+imNum).hasClass('hasError')){
	$("#im"+imNum).css('border-color', "#ff0000");
}
else{$("#im"+imNum).css('border-color', "#9bdff6");}
$(".header_hidden").css("display","none");
$("#header_"+imNum).css("display","block");



	$("#error_table").remove()
	if (error_list.length!=0){
	$('.imageInspect').prepend('<table id="error_table" \
	class="pure-table"><thead><tr><td>ERROR LIST</td></tr></thead>\
	<tbody>')
	for (var i=0; i<error_list[imNum].length; i++){
	$("#error_table tbody").append("<tr><td>"+error_list[imNum][i]+"</td></tr>");
	}
	$("#error_table td:last").append("</tbody></table>");}




var x=setTimeout(function() {
loadImage(imNum);},100);
}


//----------------------------------------------------------------------------------------------------


function explodeGrid()
{
	document.getElementsByClassName('loadGrid')[0].style.width="90%";
	document.getElementsByClassName('loadGrid')[0].style.top="10%";
	document.getElementsByClassName('loadGrid')[0].style.bottom="30%";
	document.getElementsByClassName('loadGrid')[0].style.height="75%";
	//document.getElementsByClassName('menu')[0].style.opacity='0';
	//document.getElementsByClassName('menu')[0].style.visibility='hidden';
	//document.getElementsByClassName('bottomnav')[0].style.visibility='hidden';
	document.getElementById('welcome').style.opacity='0';
	document.getElementById('welcome').style.display='none';
	$('.loadGrid').append("<div class='imageContainer'></div>"); //HERE'S WHERE I DISCOVERED JQUERY.
	$("#main_submit_button").delay(2000).animate({"opacity": "1"}, 1000);
	$("#main_submit_button").css("display","block");
	$('.imageContainer').append("<div class='FITSdescription'></div>");
	$('.loadGrid').append("<div class='imageInspect'></div>");
	$('.imageInspect').append("<canvas id='fitsPreview' width='250px' height='250px'></canvas>");
	$('.imageInspect').append("<div class='headerAttributes'></div>");
	$('.imageContainer').css("overflow","auto");
	$(".fitsDescription").delay(2500).animate({"opacity": "1"}, 1000);
	$(".imageInspect").delay(2500).animate({"opacity": "1"}, 1000);
	$(".menu").append("<img id='add_all_image' src='/static/images/ui/add_to_all.png'>")

	$('.uploadgrid').after('<div class="goButton"><input id="check_header" class="button-small pure-button" type="submit" value="Validate Images"></div>');
}

//----------------------------------------------------------------------------------------------------


function card_binder(){

$(document).on('click',"#reset_button",function()
{
	 $(this).parent().children('table').empty();
	 selected_div=$(this).parent().attr('id').slice(7);
	 $(this).parent().children('table').append(varList[Number(selected_div)].form);
	 $(this).parent().children('table').children('input').remove();
});

$(document).on('click','#add_card',function()
{
	x=$(this);
	$(this).parent().children('table').append('<tr><td><input form="file_input_main" maxlength="8"\
	size="8" value="NAME"></input></td><td><input form="file_input_main" maxlength="50" size="10" va\
	lue="Value"></input></td><td><input form="file_input_main" maxlength="50" size="20" va\
	lue="COMMENT"></input></td>');
});

}

function get_selected(){
checkedList=[];
for (var i=0; i<activeList.length; i++){

if ($('.selected_image')[i].checked==true){
checkedList.push(parseInt($($('.selected_image')[i]).parent().attr('id').slice(3)))
}


}
}

function add_to_all(){


	$('.uploadgrid').append('<div id="add_to_all"><div id="upper_all">\
	<input id="select_all" class="button-small pure-button" type="submit" value="Select All"><input id="add_card_to_all" class="button-small pure-button" type="submit" value="Add Card"><div id="close_window_all" class="remove_button" style="float: right; position: relative;"></div></div><div id="table_all">\
	<table id="add_to_all_table" style="width: 100%" class="pure-table"><thead><th>Card</th><th>Value</th><th>Comment</th>\
	</thead><tbody></table></div><div id="lower_all"><input id="add_to_all_confirm" class="button-small pure-button" type="submit" value="Apply to All"><input id="add_to_selected_confirm" class="button-small pure-button" type="submit" value="Apply to Selected"></div></div>');
	$('.loadGrid').animate({"opacity":.3},500)




	$('#add_card_to_all').click(function(){

	$("#table_all tbody").append('<tr><td><input form="file_input_main" maxlength="8"\
	size="8" value="NAME"></input></td><td><input form="file_input_main" maxlength="50" size="20" va\
	lue="Value"></input></td><td><input form="file_input_main" maxlength="50" size="15" va\
	lue="COMMENT"></input></td>');

	});

	$('#select_all').click(function(){
	if (select_all==true){
		$(".selected_image").each(function(){$(this).prop("checked",true);});
		$('#select_all')[0].value='Select None';
		select_all=false;
	}else{
		$(".selected_image").each(function(){$(this).prop("checked",false);});
		$('#select_all')[0].value='Select All';
		select_all=true;
	}
	});


	$('#close_window_all').click(function(){
	$('#add_to_all').remove()
	$('.loadGrid').animate({"opacity":1},500)
	});

	$('#add_to_all_confirm').click(function(){


		for (var i=0; i<(activeList.length); i++)
		{
			for (var k=1; k<=$('#add_to_all_table tr').length; k++)
			{
				apply_string='#header_'+activeList[i].toString()+' tbody:first';
				row_clone=$('#add_to_all_table tr').clone()[k];
				$(apply_string).after(row_clone)
			}
		}



	});
	$('#add_to_selected_confirm').click(function(){


		get_selected();
		for (var i=0; i<checkedList.length; i++)
		{

			for (var k=1; k<=$('#add_to_all_table tr').length; k++)
			{
				apply_string='#header_'+checkedList[i].toString()+' tbody:first';
				row_clone=$('#add_to_all_table tr').clone()[k];
				$(apply_string).after(row_clone)
			}
		}


	});




}


//----------------------------------------------------------------------------------------------------

$(document).on('click', '#check_header', function() {checkError()});
document.getElementById('id_files').addEventListener('change', previewEditor, false);

$(document).on('click','#add_all_image',function(){add_to_all()});

$(".loadGrid").animate({"opacity": "1"}, 1000);
