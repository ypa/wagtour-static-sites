$(document).ready(function() {
	console.log("Hello!");

	$("#thumbs img").first().addClass("thumb-active");
	$("#thumbs img").first().removeClass("grayscale");

	$("#thumbs img").click(function() {
		$("#thumbs img").addClass("grayscale");
		$("#thumbs img").removeClass("thumb-active");
		$(this).removeClass("grayscale");
		$(this).addClass("thumb-active");
		$('#main-img img').attr('src',$(this).attr('src'));
	});
});


$("#submit").click(function(event){

    var $form = $("#contactform");
    var $inputs = $form.find("input, select, button, textarea");
    var serializedData = {};
    $form.serializeArray().map(function(x){serializedData[x.name] = x.value;}); 
    serializedData['domain'] = location.host

    // disable the inputs for the duration of the ajax request
    $inputs.prop("disabled", true);

    // fire off the request to /form.php
    request = $.ajax({
        url: "http://www.vizitmyanmar.com/api/email/",
        type: "POST",
        dataType: "json", 
        data: JSON.stringify(serializedData),
        contentType: "application/json",

    });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // log a message to the console
        console.log("Response: " + response);
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        console.error(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });

    // callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // reenable the inputs
        $inputs.prop("disabled", false);
    });

    // prevent default posting of form
    event.preventDefault();
});
