$( document ).ready(function() {
	initMult();
});

var arithStates = [];
// !!!This should be a const, and should be calculatable from the number of columns in the answer. 
// !!!There will be one of these for each item that can be cleared. 
// or - can be done by leaving out column selector? 
// var numAnswerDigits = 6;

// /////////////////////////////////////////////

function initState () {
	var state = {};
	state.answer = "";
	state.buff = "";
	state.mult = "";
	state.sum = "";
	state.input = "";
	state.inputQ = "";
	state.inputA = "";
	state.pair = [];
	return state;
}

function calcStatesDigitPair(bFirst, bLast) {
//	*** Multiply the two digits. 
// 	This copy doesn't work because modifying copy also modifies the original
// 	var state = arithStates[arithStates.length-1];
// 	There are all sorts of variations of extend. This one does shallow copy, which
// 	suffices because it's a simple shallow object. 
	var state = jQuery.extend({}, arithStates[arithStates.length-1]);

	// !!!redundancy alert
	stateMult = jQuery.extend({}, state);
	var m1dig = $("#m1.c" + state.pair[0]).text();
	var m2dig = $("#m2.c" + state.pair[1]).text();
	var mult = m1dig * m2dig;
	stateMult.mult = mult.toString();

	stateMult.input = "";
	stateMult.inputQ = "";
	stateMult.inputA = "";
	if (!bFirst) {
		// !!!redundancy alert
		stateMult.input = "add";
		stateMult.inputQ = stateMult.mult + "+" + stateMult.buff;
		var sum = mult + Number(stateMult.buff);
		stateMult.inputA = sum.toString();;
	}
	arithStates[arithStates.length] = stateMult;

	if (!bFirst) {
	//	*** Add to the Carry. 
		var stateSum = jQuery.extend({}, stateMult);
		stateSum.input = "";
		stateSum.inputQ = "";
		stateSum.inputA = "";
		var sum = Number(mult) + Number(stateSum.buff);
		stateSum.sum = sum.toString();
		arithStates[arithStates.length] = stateSum;

		if (!bLast) {
	//		*** Reset w new Carry. 
			var stateReset = jQuery.extend({}, stateSum);
			stateReset.buff = stateReset.sum;
			stateReset.mult = "";
			stateReset.sum = "";
			arithStates[arithStates.length] = stateReset;
		}
	}		
}

function calcStatesDigit(m1, m2, ind, bFirst, bLast) {
	var state;
	var answer;

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
//  The pairs assume we're multiplying three digits x three digits. 
// 	We narrow them down for smaller multiplications. 
	for (var j = 0; j < pairs.length/2; j++) {
		item1 = pairs[2*j];
		item2 = pairs[(2*j)+1];
		if ((item1 < m1.length) && (item2 < m2.length)) {
			narrowPairs[tmpInd++] = item1;
			narrowPairs[tmpInd++] = item2;
		}
	}
	for (var j = 0; j < narrowPairs.length/2; j++) {
		state = initState();
// 		state.buff = "0";
		if (arithStates.length > 1) {
			state.buff = arithStates[arithStates.length-1].buff;
		}
		state.answer = answer;
		state.pair = [narrowPairs[2*j], narrowPairs[(2*j)+1]];

		// !!!redundancy alert
		var m1dig = $("#m1.c" + state.pair[0]).text();
		var m2dig = $("#m2.c" + state.pair[1]).text();
		var mult = m1dig * m2dig;
		state.input = "mult";
		state.inputQ = m1dig + "*" + m2dig;
		state.inputA = mult.toString();

		arithStates[arithStates.length] = state;
		var bLastDigit = false;
		if (j === (narrowPairs.length/2) - 1) {
			bLastDigit = true;
		}
		calcStatesDigitPair(bFirst, bLastDigit);
	}

	state = initState();
	var newAnswerPiece;
	var newBuff;
	var oldBuff = arithStates[arithStates.length-1].sum;
	if (bFirst) {
		oldBuff = arithStates[arithStates.length-1].mult;
	}
	if (bLast) {
		newAnswerPiece = oldBuff;
		newBuff = "";
	} else {
// 		keep the buffer for the next calc
		newAnswerPiece = Number(oldBuff) % 10;
		newBuff = (Number(oldBuff) - newAnswerPiece)/10;
		newAnswerPiece = newAnswerPiece.toString();
		newBuff = newBuff.toString();
	}
	state.buff = newBuff;
	
// 	answer = arithStates[arithStates.length-1].answer;
	state.answer = newAnswerPiece + answer;
	arithStates[arithStates.length] = state;
}

function calcStates(m1, m2) {
	arithStates = [];
// 	initial state
	arithStates[0] = initState();
// 	Number of digits to calculate. 
// 	Last calculation results in multiple digits of the answer being calculated. 
// 	!!!Clarify the mathematical reasoning here. 
	numDigitState = (m1.length - 1) + (m2.length - 1) + 1;
	var bLast = false;
	var bFirst = true;
	for (var i = 1; i <= numDigitState; i++) {
		if (i === numDigitState) bLast = true;
		if (i != 1) bFirst = false;
		calcStatesDigit(m1, m2, i, bFirst, bLast);
	}
}

// /////////////////////////////////////////////

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
function renderNumberID(numID, num, numDigits, pwd) {
// default parameter not supported by some browsers (e.g. safari)
// so can't use. 
// function renderNumberID(numID, num, numDigits, pwd=false) {
	clearNumberID(numID);
	var selectorBase = "#" + numID + ".c";
	if (pwd) {
		for (var i = 0; i < numDigits; i++) {
			$(selectorBase + i).text("*");
		}
	} else {
		var digits = getDigits(num, numDigits);
		for (var i = 0; i < numDigits; i++) {
			$(selectorBase + i).text(digits[i]);
		}
	}
}

function clearNumberID(numID) {
// 	This (e.g. $(#a)) only gets the first item with the ID. 
// 	$("#" + numID).text("");
// 	e.g. ([id=a])
	$("[id=" + numID + "]").text("");
}

function renderHighlight(ind) {
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

function clearHighlight() {
	selector = makeRSelector("workspace", 0);
	$(selector).css("color", "black");
	selector = makeRSelector("workspace", 1);
	$(selector).css("color", "black");
}

function getInput(inputQ, inputA) {
	var done = false
	var inputQMsg = inputQ;
	while (!done) {
		var a = prompt(inputQMsg);
		if ((a == null) || (a == inputA)) {
			done = true;
			if (a == null) {
				$("#chkInput").prop("checked", false);
			}
		}
		inputQMsg = inputQ + " Please try again, or cancel.";
	}
}

function renderState(ind) {
	var state = arithStates[ind];
	renderNumberID("a", state.answer, state.answer.length, false);
	if ($("#chkPwd").prop("checked")) {
// 		if item isn't empty, force it to have maximum length to not give a tell
		var len;
		len = 0;
		if ((state.buff.length) > 0) {
			len = 3;
		}
		renderNumberID("buff", state.buff, len, true);
		len = 0;
		if ((state.mult.length) > 0) {
			len = 2;
		}
		renderNumberID("mult", state.mult, len, true);
		len = 0;
		if ((state.sum.length) > 0) {
			len = 3;
		}
		renderNumberID("sum", state.sum, len, true);
	} else {
		renderNumberID("buff", state.buff, state.buff.length, false);
		renderNumberID("mult", state.mult, state.mult.length, false);
		renderNumberID("sum", state.sum, state.sum.length, false);
	}
	clearHighlight();
	renderHighlight(ind);
	if ($("#chkInput").prop("checked")) {
		if (state.input != "") {
			msg = state.inputQ;
			if ($("#chkPwd").prop("checked")) {
				msg = "Calculate, please.";
			}
			getInput(msg, state.inputA);
			// !!!This could probably be tightened up. 
			if (ind < arithStates.length - 1) {
				incrState();
			}
			var stateNum = ind+1;
			while ((stateNum < arithStates.length - 1) && (arithStates[stateNum].input == "")) {
				incrState();
				stateNum++;
			}
		}
	}
}

// /////////////////////////////////////////////

function updateState(stateNum) {
	$("#stateNum").text(stateNum)
// 	If it's the last state, disable the increment button. 
	$("#incrButton").prop("disabled", false);
	$("#toFirstButton").prop("disabled", false);
	if (stateNum === arithStates.length-1) {
		$("#incrButton").prop("disabled", true);
		$("#toFirstButton").prop("disabled", true);
	}
// 	If it's the first state (0), disable the decrement button. 
	$("#decrButton").prop("disabled", false);
	$("#toLastButton").prop("disabled", false);
	if (stateNum === 0) {
		$("#decrButton").prop("disabled", true);
		$("#toLastButton").prop("disabled", true);
	}
	renderState(stateNum);
}

function toFirstState() {
	// 	'#' indicates it's an id. 
// 	var stateNum = $("#stateNum").text();
	stateNum = 0;
	updateState(stateNum);
}

function toLastState() {
	// 	'#' indicates it's an id. 
// 	var stateNum = $("#stateNum").text();
	stateNum = arithStates.length-1;
	updateState(stateNum);
}

function incrState() {
	// 	'#' indicates it's an id. 
	var stateNum = $("#stateNum").text();
	stateNum++;
	updateState(stateNum);
}

function decrState() {
	// 	'#' indicates it's an id. 
	var stateNum = $("#stateNum").text();
	stateNum--;
	updateState(stateNum);
}

function reRenderState() {
	// 	'#' indicates it's an id. 
	var stateNum = $("#stateNum").text();
	updateState(stateNum);
}

function randomMultiplicand(len, maxDigit) {
// 	For each digit, generate random number between 0 and maxDigit
	var num = 0;
	var newDigit;
	for (var i = 1; i <= len; i++) {
		// Math.random() generates number between 0 and .999...
		// Generate a random number between 0 and maxDigit. 
		if (i == 1) {
			// Leading digit can't be 0
			newDigit = Math.floor(Math.random() * maxDigit) + 1;
		} else {
			newDigit = Math.floor(Math.random() * maxDigit - 1) + 1;
		}
		num = 10 * num + newDigit;
	}
	num = num.toString();
	return num;
}

function setupMult() {
// 	Read the values out of the fields. 
// 	'#' indicates it's an id. 
	var m1len = $("#m1len").val();
	var m2len = $("#m2len").val();
	var maxDig = $("#maxDig").val();
// 	if m1len < m2len, swap them
	if (m1len < m2len) {
		$("#m1len").val(m2len);
		$("#m2len").val(m1len);
		var tmp = m1len;
		m1len = m2len;
		m2len = tmp;
	}
	var m1 = randomMultiplicand(m1len, maxDig);
	var m2 = randomMultiplicand(m2len, maxDig);
//	Put the values into M1 and M2. 
	$("#m1").val(m1);
	$("#m2").val(m2);
	initMult();
}

function initMult() {
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
	renderNumberID("m1", m1, 3, false);
// 	Render the second multiplicand. 
	renderNumberID("m2", m2, 3, false);
	clearNumberID("buff");
	clearNumberID("mult");
	clearNumberID("sum");
// 	Setup all the states of the multiplication. 	
	calcStates(m1, m2);
	updateState(0);
}
