$( document ).ready(function() {
// 		alert("ready");
// 	$("#r1c1").text("9");
});

function getDigits(num, numDigits) {
	var digits = [];
	for (i = 0; i < numDigits; i++) {
		digits[i] = "";
	}
	var tmpVal = num;
	for (i = 0; i < num.length; i++) {
		digit = tmpVal % 10;
		digits[i] = digit;
		tmpVal = (tmpVal - digit) / 10;
	}
	return digits;
}

function startMult() {
// 	'#' indicates it's an id. 
	var m1 = $("#m1").val();
	var digitsM1 = getDigits(m1, 3);
	var m2 = $("#m2").val();
	var digitsM2 = getDigits(m2, 3);
	var a = (m1 * m2).toString();
	var digitsA = getDigits(a, 6);
	
//*** Update the workspace
// 	'.' indicates it's a class. 
// 	Two classes concatenated, with no space between, finds intersection. 
	$(".r1.c1").text(digitsM1[0]);
	$(".r1.c2").text(digitsM1[1]);
	$(".r1.c3").text(digitsM1[2]);

	$(".r2.c1").text(digitsM2[0]);
	$(".r2.c2").text(digitsM2[1]);
	$(".r2.c3").text(digitsM2[2]);

	$(".r3.c1").text(digitsA[0]);
	$(".r3.c2").text(digitsA[1]);
	$(".r3.c3").text(digitsA[2]);
	$(".r3.c4").text(digitsA[3]);
	$(".r3.c5").text(digitsA[4]);
	$(".r3.c6").text(digitsA[5]);
// 	Return false to prevent form's action from occurring, ie page refresh. 
	return false;
}
