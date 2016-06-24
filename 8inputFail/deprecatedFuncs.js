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

