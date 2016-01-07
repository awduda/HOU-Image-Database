
function checkError()
{
	
	header_list=[]
	for (var i=0; i<activeList.length; i++){

		temp_dict=[];
		td_list=$('#header_'+activeList[i].toString()+' tr').find("td")
		j=0;
		for (var k=0; k<td_list.length; k=k+3){
			if (td_list[k].firstChild.value!=undefined){
				temp_card=td_list[k].firstChild.value;
			}
			else{
		
			
			temp_card=td_list[k].innerHTML.replace(':','');}
			temp_value=$('#header_'+activeList[i].toString()
			+' tr').find("td").find("input")[j].value;
			temp_dict[temp_card]=temp_value;
			j++;
	
		}
		header_list.push(temp_dict)
		}


	error_list=[];
	for (var i=0; i<activeList.length; i++)
	{
		error_list[i]='';
	}

	
	
	function create_error(i,alert_string){

	try{error_list[i].push(alert_string);}
	catch(TypeError){error_list[i]=[alert_string]}

	$("#im"+i.toString()).addClass('hasError');
	
	$("#im"+i.toString()).css('border-color', "#ff0000");
	}
	


	$(".imageDescription").removeClass('hasError');

	for (var i=0; i<activeList.length; i++)
	{

	header=Object.keys(header_list[i]);

	
	if ($.inArray("OBJECT",header)==-1){
		

		alert_string="NEED OBJECT KEY";
		create_error(activeList[i],alert_string);
		
	
	}
	if ($.inArray("OBSERVER",header)==-1){

		alert_string="NEED OBSERVER KEY IN IMAGE";
		create_error(activeList[i],alert_string);	
	
	}
	if ($.inArray("OBSERVAT",header)==-1){

		alert_string="NEED OBSERVATORY KEY";
		create_error(activeList[i],alert_string);
	}
	if ($.inArray("TELESCOP",header)==-1){

		alert_string="NEED TELESCOPE KEY";
		create_error(activeList[i],alert_string);
	
	}
	
	if ($.inArray("RA",header)==-1){

		alert_string="NEED RA KEY";
		create_error(activeList[i],alert_string);
	
	}
	if ($.inArray("DEC",header)==-1){

		alert_string="NEED DEC KEY";
		create_error(activeList[i],alert_string);
	
	}
	if ($.inArray("DATE-OBS",header)==-1){

		alert_string="NEED DATE-OBS KEY";
		create_error(activeList[i],alert_string);
	
	}
	if (error_list[i]==""){
		if ($("#im"+i.toString()).hasClass('selected')){

			$("#im"+i.toString()).css('border-color',"#9BDFF6");
		}

		else{$("#im"+i.toString()).css('border-color',"#c0c0c0");}
	}
	}



	
	$('#error_table').remove();

	$('.imageInspect').prepend('<table id="error_table" \
	class="pure-table"><thead><tr><td>ERROR LIST</td></tr></thead>\
	<tbody>')
	for (var i=0; i<$('.imageDescription').length; i++){
	
	if ($($('.imageDescription')[i]).hasClass('selected'))
	{
		
		for (var k=0; k<error_list[activeList[i]].length; k++){
		$("#error_table tbody").append("<tr><td>"+error_list[activeList[i]][k]+"</td></tr>");
		}
	}
	$("#error_table td:last").append("</tbody></table>");
	}
	
	//probably not the greatest way to check this, but project is due in a week
	noError=0;
	for (var i=0; i<error_list.length; i++){
		if (error_list[i]==""){noError++;}
	}
	if (noError==error_list.length){$("#check_header").replaceWith('<input form="file_input_main" type="submit" value="Click here to upload images!" style="color: #fff; background: rgb(28, 184, 65);" class="button-success pure-button" id="main_submit_button" >')
	$('.goButton').css("width","15%")}



}


