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

