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


	// Google map
	$('#map_canvas').gmap().bind('init', function(ev, map) {
		$('#map_canvas').gmap('addMarker', {'position': '16.818497, 96.159586', 'bounds': true}).mouseover(function() {
			$('#map_canvas').gmap('openInfoWindow', {'content': '38 Pyi-daung-su Road, Bahan, Yangon'}, this);
		});
		$('#map_canvas').gmap('option', 'zoom', 15);
	});


	if (!!$('.sticky').offset()) { 
		var stickyTop = $('.sticky').offset().top; // returns number 
		$(window).scroll(function(){ // scroll event
			var windowTop = $(window).scrollTop(); // returns number 
			if (stickyTop < windowTop){
				$('.sticky').css({ top: 0 });
			}
		});
	}

});


var updateContactStatus = function(status) {
	var $form = $("#contactform");
	if (status == "success") {
		var $inputs = $form.find("input, select, button, textarea");
		$inputs.each(function() {
			if (this.value != 'Submit') {
				$(this).val('');				
			}
		});
		$form.prepend('<div class="success"><span class="success">Your message was successfully submitted.</span></div>');
	} else {
		errorStatus();
	} 
}

var errorStatus = function() {
		$("#contactform").prepend('<div class="status"><span class="status">Something went wrong, please contact us at the e-mail listed on top of this website.</span></div>');
}


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
        updateContactStatus(textStatus);
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        errorStatus();
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
