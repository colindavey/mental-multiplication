$( document ).ready(function() {
	startMult();
});

var arithStates = [];
// !!!This should be a const, and should be calculatable from the number of columns in the answer. 
// !!!There will be one of these for each item that can be cleared. 
var numAnswerDigits = 6;

function getDigits(num, numDigits) {
	var digits = [];
	for (var i = 0; i < numDigits; i++) {
		digits[i] = "";
	}
	var tmpVal = num;
	for (var i = 0; i < num.length; i++) {
		digit = tmpVal % 10;
		digits[i] = digit;
		tmpVal = (tmpVal - digit) / 10;
	}
	return digits;
}

// Assumption: the number of digits of the number fits into the row. 
// Assumption: Divs have numbers represented by rows going from top to bottom
// 	r0 r1 r2...
// and columns going from right to left
// 	c0 c1 c2...
// !!!Some redundancy with clearNumber. 
function renderNumber(divID, row, num, numDigits) {
	var digits = getDigits(num, numDigits);
// 	'#' indicates it's an id. 
// 	'.' indicates it's a class. 
// 	Two classes concatenated, with no space between, finds intersection. 
// 	e.g. "#workspace .r0.c0"
// 	space between div (#workspace) and two classes finds children of workspace
	var selectorBase = "#" + divID + " .r" + row + ".c";
	var selector;
	for (var i = 0; i < numDigits; i++) {
		selector = selectorBase + i;
		$(selector).text(digits[i]);
	}
}

// !!!Some redundancy with renderNumber. 
function clearNumber(divID, row, numDigits) {
	var selectorBase = "#" + divID + " .r" + row + ".c";
	var selector;
	for (var i = 0; i < numDigits; i++) {
		selector = selectorBase + i;
		$(selector).text("");
	}
}

// Calculate all the states associated with an answer digit. 
// First version just has the answer, so only has one state per answer, with answer field. 
function calcStatesDigit(m1, m2, a, ind, bLast) {
	var state = {};
	state.answer = "";
	if (bLast) {
		state.answer = a;
	} else if (ind > 0) {
		state.answer = a % Math.pow(10,ind);
		state.answer = state.answer.toString();
// 		Pad with leading zeros. 
		var neededZeros = ind - state.answer.length;
		for (var i = 0; i < neededZeros; i++) {
			state.answer = "0" + state.answer;
		}
	}
	arithStates[ind] = state;
}

function calcStates(m1, m2) {
	arithStates = [];
	var a = (m1 * m2).toString();
// 	Number of digits to calculate. 
// 	Last calculation results in multiple digits of the answer being calculated. 
// 	!!!Clarify the mathematical reasoning here. 
	numDigitState = (m1.length - 1) + (m2.length - 1) + 1;
	var bLast;
	for (var i = 0; i <= numDigitState; i++) {
		bLast = false;
		if (i === numDigitState) {
			bLast = true;
		}
		calcStatesDigit(m1, m2, a, i, bLast);
	}
}

function clearAnswer () {
	clearNumber("workspace", 2, numAnswerDigits);
}

function renderState(i) {
	clearAnswer();
	renderNumber("workspace", 2, arithStates[i].answer, arithStates[i].answer.length);
}

function updateState (stateNum) {
	$("#stateNum").text(stateNum)
// 	If it's the last state, disable the increment button. 
	$("#incrButton").prop("disabled", false);
	if (stateNum === arithStates.length-1) {
		$("#incrButton").prop("disabled", true);
	}
// 	If it's the first state (0), disable the decrement button. 
	$("#decrButton").prop("disabled", false);
	if (stateNum === 0) {
		$("#decrButton").prop("disabled", true);
	}
	renderState(stateNum);
}

function incrState () {
	// 	'#' indicates it's an id. 
	var stateNum = $("#stateNum").text();
	stateNum++;
	updateState(stateNum);
}

function decrState () {
	// 	'#' indicates it's an id. 
	var stateNum = $("#stateNum").text();
	stateNum--;
	updateState(stateNum);
}

function startMult() {
//*** Update the workspace
// 	'#' indicates it's an id. 
	var m1 = $("#m1").val();
	var m2 = $("#m2").val();
// 	Strip off leading 0's by converting from a string to a number and back to a string. 
	m1 = Number(m1).toString()
	m2 = Number(m2).toString()
// 	swap so fewest num digits is m2
	if (m1.length < m2.length) {
		$("#m1").val(m2);
		$("#m2").val(m1);
		var tmp = m1;
		m1 = m2;
		m2 = tmp;
	}

// 	Render the first multiplicand. 
	renderNumber("workspace", 0, m1, 3);
// 	Render the second multiplicand. 
	renderNumber("workspace", 1, m2, 3);
// 	Setup all the states of the multiplication. 	
	calcStates(m1, m2);
	updateState(0);
}
