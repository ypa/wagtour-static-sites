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
