

//======================================================================//

$(document).ready(function(){







ajaxSetup()

$.ajax({

type: 'POST',
url: '/',
data: {action:'is_logged_in'},
success: function(data){

data=jQuery.parseJSON(data)
if (data[0]!='not logged in')
{
logout_bind()
}

}
});



$('#login_form').css({"display":"none"})
login_bind()
window_width=$(window).width()
window_height=$(window).height()

$("#background_images").append("<div class='random_image' id='rand_0'></div>")
$("#rand_0").css({height: $("#rand_0").width()});
random_image_width=$("#rand_0").width();
random_image_height=$("#rand_0").height();
number_of_rows=Math.round(window_height/random_image_height)+1;
number_per_row=Math.round(window_width/random_image_width);
number_of_images=number_of_rows*number_per_row;

for (var i=1; i<number_of_images; i++){

$("#background_images").append("<div class='random_image' id='rand_"+i.toString()+"'></div>")
}

for (var i=1; i<number_of_images; i++)
{
$($(".random_image")[i]).css({height: $($(".random_image")[i]).width()});

}
choose_random_background()
});


//======================================================================//


$(window).resize(function(){
for (var i=0; i<number_of_images; i++)
{

$($(".random_image")[i]).css({width: "15%"});
$($(".random_image")[i]).css({height: $($(".random_image")[i]).width()});
}



});

//======================================================================//
function choose_random_background(){

//populates the first slide on the main page with random images.
//Will have to do ajax later, but for now using temp dir.

$.ajax({

type: 'POST',
url: '/',
data: {action:'get_random_image'},
success: function(data){

data=jQuery.parseJSON(data)
for (var i=0; i<$(".random_image").length; i++){

file_path='url(/static/images/temp/'+data[i]+')';

$($(".random_image")[i]).css({'background-image':file_path});
}

}
});



}
//======================================================================//

function login_bind(){

$('#uploader_link').remove()

$("#login").click(function(){
$('#login_confirm_button').unbind()

$('#login_confirm_button').click(function(event){
event.preventDefault();

ajaxLogin($("#username").val(),$("#password").val());});


$('#login_form').css({"display":""})
$("#slide1").animate({"opacity": ".5"}, 1000);
$("#slide2").animate({"opacity": ".5"}, 1000);
$("#slide3").animate({"opacity": ".5"}, 1000);

$("#contribute_here").click(function(){
remove_login();
htmlbody.animate({
            scrollTop: $('.slide[data-slide="3"]').offset().top
        }, 1250, 'easeInOutQuint');

});

$("#x_button").click(function(){

remove_login();


});


});
}


//======================================================================//


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//======================================================================//


function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

//======================================================================//

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//======================================================================//


var csrftoken = getCookie('csrftoken');


//======================================================================//


function ajaxLogin(user,pass){

ajaxSetup()
$.ajax({
type: "POST",
url: '/',
data: {username:user,password:pass},
success: function (data) {
data=jQuery.parseJSON(data)

if (data.length < 2){

$('#login_form').effect('shake', { times:3 }, 500);
$("#username").val('')
$("#password").val('')
}
else{

remove_login()

$("#login")[0].innerHTML="Logout"

$('#database_link').after('\
<li id="uploader_link"><a href="uploader/">Uploader</a></li>')

$("#login").unbind()

ajaxSetup()

$("#login").click(function(){

$.ajax({



type: 'POST',
url: '/',
data: {action:'logout'},
success: function(data){
$("#login")[0].innerHTML="Login"
$("#login").unbind()

login_bind()
}
});


});
//
}



}
});
return false;
}


//======================================================================//



$('#login_confirm_button').click(function(event){

event.preventDefault();

ajaxLogin($("#username").val(),$("#password").val());});


//======================================================================//

function remove_login(){

$("#x_button").unbind()
$("#username").val('')
$("#password").val('')
$("#login_form").effect("fade")
$("#slide1").animate({"opacity": "1"}, 1000);
$("#slide2").animate({"opacity": "1"}, 1000);
$("#slide3").animate({"opacity": "1"}, 1000);

}

//======================================================================//
function ajaxSetup(){
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {

            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var csrftoken = getCookie('csrftoken');

}

//======================================================================//

function logout_bind(){

$('#database_link').after('\
<li id="uploader_link"><a href="uploader/">Uploader</a></li>')

$("#login")[0].innerHTML="Logout"
$("#login").unbind()

ajaxSetup();


$("#login").click(function(){

$.ajax({


type: 'POST',
url: '/',
data: {action:'logout'},
success: function(data){
$("#login")[0].innerHTML="Login"
$("#login").unbind()
login_bind()

}
});


});
}

//======================================================================//
