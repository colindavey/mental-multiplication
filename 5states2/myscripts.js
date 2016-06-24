$( document ).ready(function() {
	startMult();
});

var arithStates = [];
// !!!This should be a const, and should be calculatable from the number of columns in the answer. 
// !!!There will be one of these for each item that can be cleared. 
// or - can be done by leaving out column selector? 
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

// 	'#' indicates it's an id. 
// 	'.' indicates it's a class. 
// 	Two classes concatenated, with no space between, finds intersection. 
// 	e.g. "#workspace .r0.c0"
// 	space between div (#workspace) and two classes finds children of workspace
function makeRSelector(divID, row) {
	return "#" + divID + " .r" + row;
}

function makeRCSelector(divID, row, col) {
	return makeRSelector(divID, row) + ".c" + col;
}

// Assumption: the number of digits of the number fits into the row. 
// Assumption: Divs have numbers represented by rows going from top to bottom
// 	r0 r1 r2...
// and columns going from right to left
// 	c0 c1 c2...
function renderNumber(divID, row, num, numDigits) {
	var digits = getDigits(num, numDigits);
	var selector;
	for (var i = 0; i < numDigits; i++) {
		selector = makeRCSelector(divID, row, i);
		$(selector).text(digits[i]);
	}
}

function clearNumber(divID, row, numDigits) {
	var selector;
	for (var i = 0; i < numDigits; i++) {
		selector = makeRCSelector(divID, row, i);
		$(selector).text("");
	}
}

function calcStatesDigitAnswer(m1, m2, a, ind, bLast) {
	answer = "";
	if (bLast) {
		answer = a;
	} else if (ind > 0) {
		answer = a % Math.pow(10,ind);
		answer = answer.toString();
// 		Pad with leading zeros. 
		var neededZeros = ind - answer.length;
		for (var i = 0; i < neededZeros; i++) {
			answer = "0" + answer;
		}
	}
	return answer;
}

function calcStatesDigit(m1, m2, a, ind, bLast) {
	var state;
// 
	state = {};

// 	i == 0 is the initial state
	if (arithStates.length === 0) {
		state.answer = "";
		state.pair = [];
		arithStates[arithStates.length] = state;
	} else {
		answer = arithStates[arithStates.length-1].answer;
		// 	!!!Clarify the mathematical reasoning here. 
		switch(ind) {
			case 1:
				pairs = [0, 0];
				break;
			case 2:
				pairs = [1, 0, 0, 1];
				break;
			case 3:
				pairs = [2, 0, 1, 1, 0, 2];
				break;
			case 4:
				pairs = [2, 1, 1, 2];
				break;
			case 5:
				pairs = [2, 2];
				break;
		}
		var narrowPairs = [];
		var tmpInd = 0;
		var item1;
		var item2;
		for (var j = 0; j < pairs.length/2; j++) {
			item1 = pairs[2*j];
			item2 = pairs[(2*j)+1];
// 			!!!
			if ((item1 < m1.length) && (item2 < m2.length)) {
				narrowPairs[tmpInd++] = item1;
				narrowPairs[tmpInd++] = item2;
			}
		}
		for (var j = 0; j < narrowPairs.length/2; j++) {
			state = {};
			state.answer = answer;
			state.pair = [narrowPairs[2*j], narrowPairs[(2*j)+1]];
			arithStates[arithStates.length] = state;
		}
	
		state = {};
		state.answer = calcStatesDigitAnswer(m1, m2, a, ind, bLast);
		state.pair = [];
		arithStates[arithStates.length] = state;
	}
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

function renderHighlight (ind) {
	for (var i = 0; i < arithStates[ind].pair.length; i++) {
		col = arithStates[ind].pair[i];
		row = 0;
		if (i % 2) {
			row = 1;
		}
		selector = makeRCSelector("workspace", row, col);
		$(selector).css("color", "red");
	}
}


function clearHighlight () {
	selector = makeRSelector("workspace", 0);
	$(selector).css("color", "black");
	selector = makeRSelector("workspace", 1);
	$(selector).css("color", "black");
}

function renderState(ind) {
	clearAnswer();
	renderNumber("workspace", 2, arithStates[ind].answer, arithStates[ind].answer.length);
	clearHighlight();
	renderHighlight(ind);
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
