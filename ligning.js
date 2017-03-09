// Floating points:
// https://docs.python.org/release/2.5.1/tut/node16.html
// console.log('51/1000: ' + 51/1000);
// console.log('51*0.01: ' + 51*0.01);
// console.log('51*0.001: ' + 51*0.001);
// console.log('51*0.0001: ' + 51*0.0001);



// ====================================================================================================================
// 						CONVERT AN EQUATION INTO LATEX
// ==================================================================================================================== 

function posOfChar(formula, Char){
	posArr = [];
	pos = formula.indexOf(Char);
	while (pos!==-1){
		posArr.push(pos);
		pos = formula.indexOf(Char, pos+1);
	}
	return posArr;
}
console.log('posOfChar: ' + posOfChar('012345678901234567890','0'));


function outerParenthesisBound_COPY(formula){
	console.log('\nouterParenthesisBound_COPY - formula: ' + JSON.stringify(formula));

	var fArr = formula.split("");
	// console.log('outerParenthesisBound_COPY - fArr: ' + JSON.stringify(fArr));
	var pL = 0, pL_old = 0, pR = 0, pArr = []; 
	var pLarr = posOfChar(formula, '(');
	var pRarr = posOfChar(formula, ')');
	if (pLarr.length == pRarr.length) {
		for (var n in fArr) {
			pL += (fArr[n] == '(')? 1 : 0;
			pR += (fArr[n] == ')')? 1 : 0;
			if ((pL > pL_old) && (pL == pR)) {
				pArr.push({left:pLarr[pL_old], right:pRarr[pR-1]});
				pL_old = pL;
			}
		}
	} else {
		console.log('outerParenthesisBound_COPY - ALERT - formula: ' + JSON.stringify(formula));
		alert('Parentes fejl: antallet af start- og slut-parenteser stemmer ikke!');
	}

	return pArr;
}
console.log('outerParenthesisBound_COPY("a*b+c"): ' + JSON.stringify( outerParenthesisBound_COPY('a*b+c')) );
console.log('outerParenthesisBound_COPY("(...)"): ' + JSON.stringify( outerParenthesisBound_COPY('(...)')) );
console.log('outerParenthesisBound_COPY("(...)(...)"): ' + JSON.stringify( outerParenthesisBound_COPY('(...)(...)')) );
console.log('outerParenthesisBound_COPY("((...))"): ' + JSON.stringify( outerParenthesisBound_COPY('((...))')) );
console.log('outerParenthesisBound_COPY("((...)(...))"): ' + JSON.stringify( outerParenthesisBound_COPY('((...)(...))')) );
console.log('outerParenthesisBound_COPY("((...)((...)))"): ' + JSON.stringify( outerParenthesisBound_COPY('((...)((...)))')) );
console.log('outerParenthesisBound_COPY("((...)((...)))(...)"): ' + JSON.stringify( outerParenthesisBound_COPY('((...)((...)))(...)')) );
console.log('outerParenthesisBound_COPY("(a+b/c)*(d+(a+b/c))/e"): ' + JSON.stringify( outerParenthesisBound_COPY('(a+b/c)*(d+(a+b/c))/e')) );

function returnParenthesisObj(formula, pArr, delimiter){
	var parenthesis; 
	var formula_mod = formula;
	var delim;
	var delimArr = [];
	var parenthesisArr = [];
	for (var n in pArr) {
		parenthesis = formula.substring(pArr[n].left, pArr[n].right+1);
		delim = delimiter.repeat(parenthesis.length);
		formula_mod = formula_mod.replace(parenthesis, delim);
		parenthesisArr.push(parenthesis);
		delimArr.push(delim);
		
		console.log('returnParenthesisObj - n: ' + n + ', parenthesis: ' + parenthesis + ' , formula_mod: ' + formula_mod + ' , parenthesisArr: ' + JSON.stringify(parenthesisArr) );
	}

	return {formula_mod: formula_mod, parenthesisArr: parenthesisArr, delimArr: delimArr};
}
console.log('STRING: ' + '#'.repeat(10));

// IMPORTANT: All symbols must not contain a space as a char. E.g. "\\Delta E" has to be written as "\\Delta{E}"
// This function can convert an entire equation into LaTex, eg equation = "g + b*x/c = d", AND it can convert one side of an equation into LaTex, eg just "g + b*x/c".
function equationToLatex(equation) {
	console.log('equationToLatex - equation: ' + equation);

	var leftSide, rightSide, latexEq;
	equation = equation.replace(/ /g, '');
	console.log('findNextOperator - equation: ' + equation);

	var equationArr = equation.split('=');

	leftSide = equationSideToLatex(equationArr[0]);

	if (equationArr.length > 1) {
		rightSide = equationSideToLatex(equationArr[1]);
		latexEq = leftSide + '=' + rightSide;
	} else {
		latexEq = leftSide;
	}
	console.log('equationToLatex - latexEq: ' + latexEq);

	return latexEq;
}
equationToLatex('g + b*x/c');
equationToLatex('g + b*x/c = d');
equationToLatex('Delta_E = c*m*Delta_T');
equationToLatex('Delta_E/Delta_T = c*m*Delta_T/Delta_T');



// This function converts one side of an equation into LaTex. It is important that the input does not contain an equal sign "=", since this sign is
// not tolarated. So if the complete equation is "g + b*x/c = d", then use one eg. the left side of the equation as input: equationSide = "g + b*x/c"
function equationSideToLatex(equationSide) {

	console.log('\nequationSideToLatex - equationSide 1: ' + equationSide);

	var ipfObj, innerParenthesisFraction_latex;
	var pos = equationSide.indexOf('/');
	var count = 0;
	while ((pos!==-1) && (count < 10)) {  // Convert to LaTex fractions, starting with the innermost fractions
		console.log('equationSideToLatex - equationSide 1: ' + equationSide);

		pos = positionOfInnerMostParenthesisFraction(equationSide);
		console.log('equationSideToLatex - pos: ' + pos);

		ipfObj =  returnInnerParenthesisFraction(equationSide, pos);
		console.log('equationSideToLatex - ipfObj: ' + JSON.stringify(ipfObj));

		innerParenthesisFraction_latex = makeFraction(ipfObj.innerParenthesisFraction);
		console.log('equationSideToLatex - innerParenthesisFraction_latex: ' + innerParenthesisFraction_latex);

		equationSide = ipfObj.equationSide_mod.replace(ipfObj.delim, innerParenthesisFraction_latex);
		console.log('equationSideToLatex - equationSide 2: ' + equationSide);

		pos = equationSide.indexOf('/');
		++count;
	}
	console.log('equationSideToLatex - equationSide 3: ' + equationSide);

	equationSide = equationSide.replace(/\(/g, '\\left(').replace(/\)/g, '\\right)'); // Convert to LaTex to dynamic sized parenthesis.
	console.log('equationSideToLatex - equationSide 4: ' + equationSide);

	equationSide = equationSide.replace(/\*/g, ' \\cdot ');  // Convert all atserics to LaTex cdot multiplication symbols.
	console.log('equationSideToLatex - equationSide 5: ' + equationSide);

	return equationSide;
}
// equationSideToLatex('a*(b+c)/(d)');
// equationSideToLatex('(a+b/c)/e');
equationSideToLatex('(a+b/c)*(d+(a+b/c))/e');  


function makeFraction(equationSide) {

	console.log('\n\n======================\n\n ' + equationSide);
	console.log('\nmakeFraction - equationSide: ' + equationSide);

	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('makeFraction - pArr: ' + JSON.stringify(pArr));

	var pObj = returnParenthesisObj(equationSide, pArr, '#');  
	console.log('makeFraction - pObj: ' + JSON.stringify(pObj)); 

	var equationSide_mod = pObj.formula_mod;

	// equationSide_mod = (equationSide_mod.indexOf('/')!==-1)? equationSide_mod : equationSide; 

	var posStart, posEnd, posEnd_mult, posEnd_paren, frac, latexFrac;
	var pos = equationSide_mod.indexOf('/');

	posStart = equationSide_mod.lastIndexOf('+', pos);
	if (posStart === -1) {
		posStart = equationSide_mod.lastIndexOf('-', pos);
	}
	
	posEnd = equationSide_mod.indexOf('+', pos);
	if (posEnd === -1) {
		posEnd = equationSide_mod.indexOf('-', pos);
	}

	posEnd_mult = equationSide_mod.indexOf('*', pos);

	if ((posEnd!==-1) && (posEnd_mult!==-1) && (posEnd_mult < posEnd)){
		posEnd = posEnd_mult;
	}

	if ((posEnd===-1) && (posEnd < posEnd_mult)){
		posEnd = posEnd_mult;
	}

	// if ((posEnd_mult===-1) && (posEnd_mult < posEnd)){  // CASE: not needed!
	// 	posEnd = posEnd;
	// }

	// if ((posEnd_mult===-1) && (posEnd===-1)){           // CASE: not needed!
	// 	posEnd = posEnd;
	// }

	console.log('makeFraction - posStart 1: ' + posStart + ', posEnd 1: ' + posEnd);

	posStart = (posStart ===-1)? 0 : posStart+1;
	posEnd = (posEnd ===-1)? equationSide_mod.length : posEnd;
	console.log('makeFraction - posStart 2: ' + posStart + ', posEnd 2: ' + posEnd);

	// frac = equationSide.substring(posStart, posEnd);
	frac = equationSide_mod.substring(posStart, posEnd);
	console.log('makeFraction - frac: ' + frac);

	var fracArr = frac.split('/');
	console.log('makeFraction - fracArr: ' + fracArr);


	var latexFrac = '\\frac{';
	for (var n in fracArr) {
		pArr = outerParenthesisBound_COPY(fracArr[n]);
		if ((pArr.length == 1) && (fracArr[n].charAt(0) == '(') && (fracArr[n].charAt(fracArr[n].length-1) == ')')){
			latexFrac += fracArr[n].substring(1,fracArr[n].length-1);
		} else {
			latexFrac += fracArr[n];
		}
		// latexFrac += fracArr[n];
		latexFrac += (n==0)? '}{' : '}';
	}
	// latexFrac += '}';
	console.log('makeFraction - latexFrac 1: ' + latexFrac);

	for (var n in pObj.parenthesisArr) {
		latexFrac = latexFrac.replace(pObj.delimArr[n], pObj.parenthesisArr[n]);
		frac = frac.replace(pObj.delimArr[n], pObj.parenthesisArr[n]);
	}
	console.log('makeFraction - latexFrac 2: ' + latexFrac);

	latexFrac = removeParenthesisInNominator(latexFrac);
	console.log('makeFraction - latexFrac 3: ' + latexFrac);

	latexFrac = removeParenthesisInDenominator(latexFrac);
	console.log('makeFraction - latexFrac 4: ' + latexFrac);

	equationSide = equationSide.replace(frac, latexFrac);
	console.log('makeFraction - equationSide: ' + equationSide);

	return equationSide;
}
// makeFraction('a*(b+c)/(d)=y');      // <------- FEJL
// makeFraction('a+a*(b+c)/(d)-f=y');  // <------- FEJL
// makeFraction('a/b=y');			   // <------- FEJL
makeFraction('a*(b+c)/(d)');
makeFraction('a+a*(b+c)/(d)-f');
makeFraction('a+a*(b+c)/(d)*e');
makeFraction('a+(b+c)*(b+c)/(d+e)*(d+e)');
makeFraction('2-2*a/b*3');
// makeFraction('(a+b/c)/e');


// The purpose of this function is to remove the dafault parenthesis (e.g. (a+b)/c ) in the nominator so that wil not be displayed when shown in LaTex form. 
function removeParenthesisInNominator(latexFrac) {
	console.log('\nremoveParenthesisInNominator - latexFrac 1: ' + latexFrac);

	var posStart = latexFrac.indexOf('{');
	var posEnd = latexFrac.lastIndexOf('}{');
	console.log('removeParenthesisInNominator - posStart : ' + posStart + ', posEnd : ' + posEnd);

	var nominator = latexFrac.substring(posStart+1, posEnd);
	console.log('removeParenthesisInNominator - nominator 1: ' + nominator);

	nominator = removeOuterParenthesisAroundNonSpecialTerms_COPY(nominator);
	console.log('removeParenthesisInNominator - nominator 2: ' + nominator);

	latexFrac = latexFrac.substring(0, posStart+1)+nominator+latexFrac.substring(posEnd);
	console.log('removeParenthesisInNominator - latexFrac 2: ' + latexFrac);

	return latexFrac;
}


// The purpose of this function is to remove the dafault parenthesis (e.g. a/(b+c)) in the denominator so that wil not be displayed when shown in LaTex form. 
function removeParenthesisInDenominator(latexFrac) {
	console.log('\nremoveParenthesisInDenominator - latexFrac 1: ' + latexFrac);

	var posStart = latexFrac.lastIndexOf('}{');
	var posEnd = latexFrac.lastIndexOf('}');
	console.log('removeParenthesisInDenominator - posStart : ' + posStart + ', posEnd : ' + posEnd);

	var denominator = latexFrac.substring(posStart+2, posEnd);
	console.log('removeParenthesisInDenominator - denominator 1: ' + denominator);

	denominator = removeOuterParenthesisAroundNonSpecialTerms_COPY(denominator);
	console.log('removeParenthesisInDenominator - denominator 2: ' + denominator);

	latexFrac = latexFrac.substring(0, posStart+1)+'{'+denominator+'}';
	console.log('removeParenthesisInDenominator - latexFrac 2: ' + latexFrac);

	return latexFrac;
}


function positionOfInnerMostParenthesisFraction(equationSide){
	console.log('positionOfInnerMostParenthesisFraction - equationSide: ' + equationSide);

	var pos_left, pos_right, str_left, str_right, pCount_left, pCount_right, pArr;
	var pos = equationSide.indexOf('/');
	var count = 0;
	var pcArr = [];

	// pArr = outerParenthesisBound_COPY(equationSide);
	// console.log('findInnerMostParenthesisFraction - pArr: ' + JSON.stringify(pArr) );

	var pos = equationSide.indexOf('/');

	while ((pos!==-1) && (count<25)) {
		str_left = equationSide.substring(0, pos);
		str_right = equationSide.substring(pos+1);
		console.log('positionOfInnerMostParenthesisFraction - str_left: ' + str_left + ', str_right: ' + str_right);

		pCount_left = (str_left.match(/\(/g) || []).length - (str_left.match(/\)/g) || []).length;
		pCount_right = (str_right.match(/\(/g) || []).length - (str_right.match(/\)/g) || []).length;
		console.log('positionOfInnerMostParenthesisFraction - pCount_left: ' + pCount_left + ', pCount_right: ' + pCount_right);

		if (Math.abs(pCount_left) == Math.abs(pCount_right)){
			pcArr.push({pos: pos, count: pCount_left});
		}

		pos = equationSide.indexOf('/', pos+1);
	}
	console.log('positionOfInnerMostParenthesisFraction - pcArr: ' + JSON.stringify(pcArr));

	var index = null;
	var countMem = -1;
	for (var n in pcArr) {
		if (pcArr[n].count > countMem) {
			countMem = pcArr[n].count;
			index = n;
		}
	}
	console.log('positionOfInnerMostParenthesisFraction - index: ' + index + ', pcArr[index].pos: ' + pcArr[index].pos);

	return pcArr[index].pos
}
// positionOfInnerMostParenthesisFraction('a+b/c');
// positionOfInnerMostParenthesisFraction('(a+b/c)/e');
// positionOfInnerMostParenthesisFraction('(d+(a+b/c))/e');
// positionOfInnerMostParenthesisFraction('(a+b/c)*(d+(a+b/c))/e');  
// positionOfInnerMostParenthesisFraction('(a+b/c)*(d+(a+(b+z)/c))/e');  
// positionOfInnerMostParenthesisFraction('(a+b/c)*(d+(a+(b+z)/c)/g)/e');
// positionOfInnerMostParenthesisFraction('(a+b/c)*(d+(a+(b+z)/(q+w)*(r+t))/g)/e');  
// positionOfInnerMostParenthesisFraction('((a+b/c)+(d+(a+(b+z))/(q+w)*(r+t))/g)/e');

// ((a+b/c)+(d+(a+(b+z))/(q+w)*(r+t))/g)/e
// a*(b+c)/(d)
// a+\\frac{b}{c})/e
// (a+\frac{b}{c})/e
// 012345678901234567890123456789012345678901234567890
//           |         |         |         |         |


function returnInnerParenthesisFraction(equationSide, pos_fraction) {

	console.log('\nreturnInnerParenthesisFraction - equationSide: ' + equationSide + ', pos_fraction: ' + pos_fraction);

	var left, right, pos_left, pos_right, count, innerParenthesisFraction, delim, equationSide_mod;
	
	count = 0;
	pos_left = equationSide.lastIndexOf('(', pos_fraction);
	pos_right = equationSide.lastIndexOf(')', pos_fraction);
	while ((pos_right!==-1) && (pos_left < pos_right) && (count<25)) {
		pos_left = equationSide.lastIndexOf('(', pos_left-1);
		pos_right = equationSide.lastIndexOf(')', pos_right-1);
		console.log('returnInnerParenthesisFraction - count 1: ' + count + ', pos_left: ' + pos_left + ', pos_right: ' + pos_right);
		++count;
	}
	left = pos_left;

	count = 0;
	pos_left = equationSide.indexOf('(', pos_fraction);
	pos_right = equationSide.indexOf(')', pos_fraction);
	while ((pos_left!==-1) && (pos_left < pos_right) && (count<25)) {
		pos_left = equationSide.indexOf('(', pos_left+1);
		pos_right = equationSide.indexOf(')', pos_right+1);
		console.log('returnInnerParenthesisFraction - count 2: ' + count + ', pos_left: ' + pos_left + ', pos_right: ' + pos_right);
		++count;
	}
	right = pos_right;
	console.log('returnInnerParenthesisFraction - left: ' + left + ', right: ' + right);


	console.log('returnInnerParenthesisFraction - equationSide: ' + equationSide);
	if ((left===-1) || (right===-1)) {
		console.log('returnInnerParenthesisFraction - A1');
		left = 0;
		right = equationSide.length;
		innerParenthesisFraction = equationSide;
		delim = '#'.repeat(right-left);
		equationSide_mod = equationSide.replace(innerParenthesisFraction, delim);
	} else if ((left!==-1) && (right!==-1)) {
		console.log('returnInnerParenthesisFraction - A2');
		innerParenthesisFraction = equationSide.substring(left+1, right);
		delim = '#'.repeat(right-left);
		equationSide_mod = equationSide.replace(innerParenthesisFraction, delim);
	}
	console.log('returnInnerParenthesisFraction - innerParenthesisFraction: ' + innerParenthesisFraction + ', delim: ' + delim + ', equationSide_mod: ' + equationSide_mod);

	return {innerParenthesisFraction: innerParenthesisFraction, delim: delim, equationSide_mod: equationSide_mod};

	
}
// returnInnerParenthesisFraction('(a+b)/c', 5);
// returnInnerParenthesisFraction('a/(c+b)');
// returnInnerParenthesisFraction('a*(b+c)/(d)', 7);
// returnInnerParenthesisFraction('((a+b/c)+(d+(a+(b+z))/(q+w)*(r+t))/g)/e', 21); 


function suggestReducingTerm(formula){
	formula = formula.replace(/ /g, '');
	console.log('\nsuggestReducingTerm - formula: ' + formula);

	var formulaArr = formula.split('=');
	// var targetSide = (formulaArr[0].indexOf(fObj.target)!==-1)? formulaArr[0] : formulaArr[1];  // select the side of the the formula on which fObj.target is located.
	if (formulaArr[0].indexOf(fObj.target)!==-1) {
		var targetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[0]);
		var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[1]);
		var varSide = 'left';
	} else {
		var targetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[1]);
		var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[0]);
		var varSide = 'right';
	}
	console.log('suggestReducingTerm - targetSide: ' + targetSide + ', nonTargetSide: ' + nonTargetSide);

	var opObj_targetSide = suggestReducingTerm_side(targetSide);
	console.log('suggestReducingTerm - opObj_targetSide: ' + JSON.stringify(opObj_targetSide)); 

	var opObj_nonTargetSide = suggestReducingTerm_side(nonTargetSide);
	console.log('suggestReducingTerm - opObj_nonTargetSide: ' + JSON.stringify(opObj_nonTargetSide)); 

	if (opObj_targetSide !== null) {
		if ((opObj_targetSide.op == '+') || (opObj_targetSide.op == '-')) {
			return '<div class="reduceBtn btn btn-info">Reducer med '+convertTermsToLatexTerms( opObj_targetSide.term )+'</div>';
		}

		if ((opObj_targetSide.op == '*') || (opObj_targetSide.op == '/')) {
			return '<div class="reduceBtn btn btn-info">Forkort med '+convertTermsToLatexTerms( opObj_targetSide.term )+'</div>';
		}
	} else if (opObj_nonTargetSide !== null) {
		if ((opObj_nonTargetSide.op == '+') || (opObj_nonTargetSide.op == '-')) {
			return '<div class="reduceBtn btn btn-info">Reducer med '+convertTermsToLatexTerms( opObj_nonTargetSide.term )+'</div>';
		}

		if ((opObj_nonTargetSide.op == '*') || (opObj_nonTargetSide.op == '/')) {
			// return '<div class="reduceBtn btn btn-info">Forkort med '+opObj_nonTargetSide.term+'</div>';
			return '<div class="reduceBtn btn btn-info">Forkort med \\('+convertTermsToLatexTerms( opObj_nonTargetSide.term )+'\\)</div>';
		}
	} else {
		return '';
	}
}

fObj = {"target":"b"};

// suggestReducingTerm('k=(a+b)/(c+d)*e');        // , {"target":"b"}
// suggestReducingTerm('k=e*(a+b)/e*(c+d)*e');    // , {"target":"b"}
// suggestReducingTerm('k=e+(a+b)/e*(c+d)-e');    // , {"target":"b"}
// // suggestReducingTerm('k=e*a+b/u*c+d-e+e-a');    // , {"target":"b"}
// // suggestReducingTerm('k=err*ad+b/u*c+d-err+err-ad');    // , {"target":"b"}
// // suggestReducingTerm('k=err*r+b/u*c+d-err+err-r');    // , {"target":"b"}
// // suggestReducingTerm('k=err*r+(b/u*c+d)-err+err-r');    // , {"target":"b"}
// // suggestReducingTerm('k=p*err*r+(b/u*c+d)-err+err-r');    // , {"target":"b"}
// // suggestReducingTerm('k=p*err*r+(b/u*c+d)-err+err-r-(b/u*c+d)');    // , {"target":"b"}
// // suggestReducingTerm('k=p*err*r+(b/u*c+d)+(t-w)-err+err-r-(b/u*c+d)-(t-w)');    // , {"target":"b"}
// // suggestReducingTerm('k=p/p*b');    // , {"target":"b"}
// // suggestReducingTerm('k=1/p*p*b');    // , {"target":"b"}
// // suggestReducingTerm('k=1/p+p*b');    // , {"target":"b"}
// suggestReducingTerm('k=e+(a+b)*e+(c+d)-(c+d)-e');    // , {"target":"b"}
// suggestReducingTerm('k=e*(a+b)/e*(c+d)/(c+d)-e');    // , {"target":"b"}
// suggestReducingTerm('k=e+e*(a+b)/e*(c+d)/(c+d)-e');    // , {"target":"b"}
suggestReducingTerm('k=e+f+e*(a+b)/e*(c+d)/(c+d)-e');    // , {"target":"b"}


function suggestReducingTerm_side(equationSide){
	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('suggestReducingTerm > suggestReducingTerm_side - pArr: ' + JSON.stringify(pArr));

	var TtargetSide = removeParenthesis_formula_COPY(equationSide, pArr);   // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
	console.log('suggestReducingTerm > suggestReducingTerm_side - TtargetSide: ' + TtargetSide); 



var pObj = returnParenthesisObj(equationSide, pArr, '@');  
console.log('suggestReducingTerm > suggestReducingTerm_side  - pObj: ' + JSON.stringify(pObj)); 

// TtargetSide = pObj.formula_mod.replace(/#/g, '@');
TtargetSide = pObj.formula_mod;
console.log('suggestReducingTerm > suggestReducingTerm_side  - TtargetSide: ' + TtargetSide);



	var TtargetSide_mod = TtargetSide.replace(/(\*|\/|\+|\-)/g, '#');
	console.log('suggestReducingTerm > suggestReducingTerm_side - TtargetSide_mod 1: ' + TtargetSide_mod); 


for (var n in pObj.parenthesisArr) {
	TtargetSide_mod = TtargetSide_mod.replace(pObj.delimArr[n], pObj.parenthesisArr[n]);
	TtargetSide = TtargetSide.replace(pObj.delimArr[n], pObj.parenthesisArr[n]);
}
console.log('suggestReducingTerm > suggestReducingTerm_side  - TtargetSide_mod 2: ' + TtargetSide_mod);


	var termArr = TtargetSide_mod.split('#');
	console.log('suggestReducingTerm > suggestReducingTerm_side - termArr: ' + termArr);

	var dublicateTerms = [];

	for (var i in termArr){  // Find all the terms that are present two or more times in TtargetSide
		for (var k in termArr){
			if ((i < k) && (termArr[i] == termArr[k])) {
				dublicateTerms.push(termArr[i]);
			}
		}
	}
	console.log('suggestReducingTerm > suggestReducingTerm_side - dublicateTerms: ' + dublicateTerms);

	dublicateTerms = dublicateTerms.filter( onlyUnique );  // Filter dublicateTerms so each term only is present once. 
	console.log('suggestReducingTerm > suggestReducingTerm_side - dublicateTerms: ' + dublicateTerms);

	
	var termOp, pos, count = 0;
	var redTerms = [];
	var redTermsObj = [];
	var l = TtargetSide.length;
	console.log('suggestReducingTerm > suggestReducingTerm_side - l: ' + l); 
	for (var i in dublicateTerms){  // Collect all the terms that have one of the 4 operators both before and behind the term.
		pos = TtargetSide.indexOf(dublicateTerms[i]);
		while ((pos !== -1) && (count < 25)) {
			
			console.log('suggestReducingTerm > suggestReducingTerm_side - A0');
			console.log('suggestReducingTerm > suggestReducingTerm_side - pos: ' + pos);

			var opObj = returnSurroundingOps(dublicateTerms[i], pos, TtargetSide);

			console.log('suggestReducingTerm > suggestReducingTerm_side - opObj: ' + JSON.stringify(opObj));
			if ((opObj.opBegin !== null) && (opObj.opEnd !== null)) { // If the term has one of the 4 operators both before and behind the term, then add ti to redTerms...
				redTerms.push(opObj.opBegin + dublicateTerms[i] + opObj.opEnd);
				redTermsObj.push({opBegin: opObj.opBegin, redTerm: dublicateTerms[i], opEnd: opObj.opEnd, pos: pos}); 
			}

			pos = TtargetSide.indexOf(dublicateTerms[i], pos+1);

			++count;

		}
		console.log('suggestReducingTerm > suggestReducingTerm_side - count: ' + count + ', pos: ' + pos + ', redTerms: ' + redTerms);
	}
	console.log('suggestReducingTerm > suggestReducingTerm_side - FINAL - redTerms: ' + redTerms);
	console.log('suggestReducingTerm > suggestReducingTerm_side - FINAL - redTermsObj: ' + JSON.stringify(redTermsObj));



	var invOp = {'*':'/', '/':'*', '+':'-', '-':'+'};

	var reducingTerms = [];
	var reducingTermsObj = [];
	var opBegin2, opEnd2, term2, term;
	for (var i = 0; i < redTerms.length; i++) {
		opBegin = redTerms[i].substr(0, 1);
		opEnd = redTerms[i].substr(redTerms[i].length-1, 1);
		term = redTerms[i].substr(1, redTerms[i].length-2);
		console.log('suggestReducingTerm > suggestReducingTerm_side - opBegin: ' + opBegin + ', term: ' + term + ', opEnd: ' + opEnd);

		// for (var j = i; j < redTerms.length; j++) {
		for (var j = 0; j < redTerms.length; j++) {
			opBegin2 = redTerms[j].substr(0, 1);
			opEnd2 = redTerms[j].substr(redTerms[j].length-1, 1);
			term2 = redTerms[j].substr(1, redTerms[j].length-2);
			console.log('suggestReducingTerm > suggestReducingTerm_side - opBegin2: ' + opBegin2 + ', term2: ' + term2 + ', opEnd2: ' + opEnd2);

			if (term == term2) { // If the two terms are similar, e.g. "a = a", then...
				console.log('suggestReducingTerm > suggestReducingTerm_side - B0 - redTerms[i]: ' + redTerms[i] + ', redTerms[j]: ' + redTerms[j] + ', opBegin: ' + opBegin + ', opBegin2: ' + opBegin2 + ', opEnd: ' + opEnd + ', opEnd2: ' + opEnd2);

				if (('+-'.indexOf(opBegin)!==-1) && ('*/'.indexOf(opEnd)!==-1) && ('/'.indexOf(opBegin2)!==-1)) {  // CASE:  +-TERM/TERM  , e.g. the beginnig of a fraction.
					console.log('suggestReducingTerm > suggestReducingTerm_side - B1');
					reducingTerms.push({op: opBegin2, term: redTerms[j].substr(1, redTerms[j].length-2)});  // op = opBegin2 since this is the last term, and therefore "tells" if we need to add, subtract, multiply og devide to reduce the equation.
					reducingTermsObj.push(redTermsObj[j]); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!

				}

				if ((opBegin == invOp[opBegin2]) && ('+-'.indexOf(opEnd)!==-1) && ('+-'.indexOf(opEnd2)!==-1)) { // CASE: */+-TERM+- /*-+TERM+-
					console.log('suggestReducingTerm > suggestReducingTerm_side - B2');
					reducingTerms.push({op: opBegin2, term: redTerms[j].substr(1, redTerms[j].length-2)});  // op = opBegin2 since this is the last term, and therefore "tells" if we need to add, subtract, multiply og devide to reduce the equation.
					reducingTermsObj.push(redTermsObj[j]); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!
				}

				if (('*/'.indexOf(opBegin)!==-1) && (opBegin == invOp[opBegin2])) { // CASE: */TERM*/+- /*TERM*/+-
					console.log('suggestReducingTerm > suggestReducingTerm_side - B3');
					reducingTerms.push({op: opBegin2, term: redTerms[j].substr(1, redTerms[j].length-2)});  // op = opBegin2 since this is the last term, and therefore "tells" if we need to add, subtract, multiply og devide to reduce the equation.
					reducingTermsObj.push(redTermsObj[j]); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!
				}
			}
		};
	};
	console.log('suggestReducingTerm > suggestReducingTerm_side - reducingTerms: ' + JSON.stringify(reducingTerms) + ', reducingTerms.length: ' + reducingTerms.length);
	console.log('suggestReducingTerm > suggestReducingTerm_side - reducingTermsObj: ' + JSON.stringify(reducingTermsObj)); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!


	var TreducingTerms = [], reducingTerms_final = [], reducingTermsObj_final = [];
	var termStr, invTermStr;
	// for (var n = reducingTerms.length - 1; n >= 0; n--) {  // This removes parenthesis dublicates with operators and ther inverses! <---- This is a work around that might not be stable - needs to be tested!  
	for (var n = 0; n < reducingTerms.length; n++) {	// This removes dublicate terms and dublicate parenthesis-terms with respect to operators and ther inverses!
		termStr = reducingTerms[n].op+reducingTerms[n].term;
		termStr_inv = invOp[reducingTerms[n].op]+reducingTerms[n].term;
		if ((!elementInArray(TreducingTerms, termStr)) && (!elementInArray(TreducingTerms, termStr_inv))){
			TreducingTerms.push(termStr);
			reducingTerms_final.push(reducingTerms[n]);
			reducingTermsObj_final.push(reducingTermsObj[n]); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!
		}
	}
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - reducingTerms_final: ' + JSON.stringify(reducingTerms_final));
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - reducingTermsObj_final: ' + JSON.stringify(reducingTermsObj_final)); // <------ IMPORTANT: This might not be nessary - just use redTermsObj instead!

	console.log('suggestReducingTerm > suggestReducingTerm_side - END - dublicateTerms 2: ' + dublicateTerms);
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - FINAL - redTerms 2: ' + redTerms);
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - FINAL - redTermsObj 2: ' + JSON.stringify(redTermsObj));

	var reducingTermMem = null;
	for (var n = reducingTerms_final.length - 1; n >= 0; n--) { // Return the last "+" or "-" term if exist, else return the last "*" or "/" term if exist, else return "null".
		if ((reducingTerms_final[n].op == '+') || (reducingTerms_final[n].op == '-')) {
			reducingTermMem = reducingTerms_final[n];
			break;
		} 

		if (reducingTerms_final[n].op == '/') {
			reducingTermMem = reducingTerms_final[n];
		}

		if ((reducingTermMem === null) && (reducingTerms_final[n].op == '*')) {
			reducingTermMem = reducingTerms_final[n];
		}
	}
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - reducingTermMem: ' + JSON.stringify(reducingTermMem));

	return reducingTermMem;
}


// e+e*(a+b)/e*(c+d)/(c+d)-e
// 012345678901234567890123456789012345678901234567890
//           |         |         |         |         |


function returnSurroundingOps(term, termPos, equationSide) {
	console.log('suggestReducingTerm > returnSurroundingOps - term: ' + term + ', termPos: ' + termPos + ', equationSide: ' + equationSide);

	var opBegin = null, opEnd = null;

	var opObj = {opBegin: opBegin, opEnd: opEnd};

	var l = equationSide.length;
	console.log('suggestReducingTerm > returnSurroundingOps - l: ' + l); 

	if (term == equationSide) {
		console.log('suggestReducingTerm > returnSurroundingOps - A0');
		opObj = {opBegin: '+', opEnd: '+'};
	} else {

		if (termPos == 0) {
			console.log('suggestReducingTerm > returnSurroundingOps - A1');
			opEnd = equationSide.substr(term.length, 1);
			opObj.opBegin = '+';
			console.log('suggestReducingTerm > returnSurroundingOps - opBegin: ' + opBegin + ', opEnd: ' + opEnd + ', equationSide: ' + equationSide);
			if ("*/+-".indexOf(opEnd)!==-1){
				opObj.opEnd = opEnd;
			} 
		}

		if ((0 < termPos) && (termPos < l - term.length)) {
			console.log('suggestReducingTerm > returnSurroundingOps - A2');
			opBegin = equationSide.substr(termPos-1, 1);
			opEnd = equationSide.substr(termPos+term.length, 1);
			console.log('suggestReducingTerm > returnSurroundingOps - opBegin: ' + opBegin + ', opEnd: ' + opEnd + ', equationSide: ' + equationSide);
			if ("*/+-".indexOf(opBegin)!==-1){
				opObj.opBegin = opBegin;
			} 
			if ("*/+-".indexOf(opEnd)!==-1){
				opObj.opEnd = opEnd;
			} 
		}

		if (termPos == l - term.length) {
			console.log('suggestReducingTerm > returnSurroundingOps - A3');
			opBegin = equationSide.substr(termPos-1, 1);
			opObj.opEnd = '+';
			console.log('suggestReducingTerm > returnSurroundingOps - opBegin: ' + opBegin + ', opEnd: ' + opEnd + ', equationSide: ' + equationSide);
			if ("*/+-".indexOf(opBegin)!==-1){
				opObj.opBegin = opBegin;
			} 
		}
	}
	console.log('suggestReducingTerm > returnSurroundingOps - opObj: ' + JSON.stringify(opObj)); 

	return opObj;
}

// convertTermsToLatexTerms

// err*ad+b/u*c+d-err+err-ad
// 0123456789012345678901234567890
//           |         |         |


function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}



// ====================================================================================================================
// 						E-LEARNING OBJECT INTERFACE
// ====================================================================================================================


var memObj = {currentQuestionNo: 0};

function template() {

	var HTML = '';

	console.log('template - jsonData: ' + JSON.stringify(jsonData)); 

	HTML += '<h1>'+jsonData.header+'</h1>';
	
	HTML += instruction(jsonData.instruction);
	HTML += explanation(jsonData.explanation);

	HTML += '<div class="Clear"></div>';
	HTML += '<div id="interface">';
	HTML += 	'<div id="rightColumn" class="col-xs-12 col-md-6">';
	HTML += 		'<div id="questionContainer"></div>';
	HTML += 		'<div id="equationContainer"></div>';
	HTML += 		'<div id="equationContainer_hidden"></div>';
	HTML += 	'</div>';
	HTML += 	'<div id="leftColumn" class="col-xs-12 col-md-6">'; 
	// HTML += 		((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered');
	HTML += 		'<div class="autoLeftSpacer"></div>';
	HTML += 		'<div id="btnContainer"></div>';
	// HTML += 		'<div class="Clear"></div> <div id="next" class="btn btn-primary">Næste</div>';
	HTML += 		'<div id="reduceBtnContainer"></div>'
	HTML += 	'</div>';
	HTML += 	'<div id="micro_hint" class="hidden">Isoler størrelsen \\(b\\) i udtrykket </div>';
	// HTML += 	'<div id="micro_hint" class="hidden">Isoler størrelsen \\(b\\) i udtrykket \\(a = b \\cdot c\\) </div>';
	HTML += '</div>';

	$('#interfaceContainer').html(HTML);
}


function initQuiz() {
	// setEventListeners();
	template();
	main();
	setEventListeners();
}


function main() {
	memObj.numOfquestions = jsonData.qObj.length;
	giveQuestion();

}


function giveQuestion() {
	console.log('giveQuestion - CALLED');

	window.fObj = make_fObj(memObj.currentQuestionNo);
	console.log('giveQuestion - x - fObj: ' + JSON.stringify(fObj));

	if (memObj.currentQuestionNo < memObj.numOfquestions){

		// $('#questionContainer').html(poseQuestion());
		
		$('#equationContainer').html(poseEquation());

		// microhint('#equationContainer', poseQuestion(), "red");
		microhint('.explanationText', "TEST HINT", "red");
		$( "#equationContainer" ).trigger( "click" );

		// $('#equationContainer').html('$$ \\frac{Q}{C} = \\frac{ C \\cdot m \\cdot \\Delta T }{C} $$');   // <--------- VERY IMPORTANT: All "\" has to be "\\"
		// $('#equationContainer').html('\\( \\frac{Q}{C} = \\frac{ C \\cdot m \\cdot \\Delta T }{C} \\)'); // <--------- VERY IMPORTANT: All "\" has to be "\\"

		var jd = jsonData.qObj[memObj.currentQuestionNo];
		$('#btnContainer').html(makeBtnOperatorChoises(jd.equation, jd.operators));
		// ++memObj.currentQuestionNo;
	} else {
		UserMsgBox("body", '<h4>OBS</h4> Tillykke - du er færdig med alle opgaverne!');
	}
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);
	
	// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.container-fluid')[0]]);
}


// ======================
// 		NOT IN USE:       // Denne funktion laver alle variable om til a, b, c, ... , z - hvilket ikke er noedvendigt
// ======================
function make_fObj_OLD(currentQuestionNo) {
	var jq = jsonData.qObj[currentQuestionNo];
	console.log('make_fObj - jq: ' + JSON.stringify(jq));

	var fObj = {};
	var fObj_equation, termArr, asciiNum;
	var terms_lookup = {}

	if (jq.hasOwnProperty('equation')){
		fObj_equation = jq.equation;
		termArr = makeTermArr(jq.equation);
		console.log('make_fObj - fObj_equation: ' + fObj_equation + ', termArr: ' + termArr);
		for (var n in termArr) {
			if (n <= 25){
				asciiNum = String.fromCharCode(parseInt(n)+97);  // a, b, c, ... , z.
			} else {
				alert('Der er mere end 25 variable i funktionen!');
			}
			console.log('make_fObj - asciiNum: ' + asciiNum);

			terms_lookup[termArr[n]] = asciiNum;
			fObj_equation = fObj_equation.replace(new RegExp(termArr[n], 'g'), asciiNum);
		}
		fObj.equation = fObj_equation;
		console.log('make_fObj - terms_lookup: ' + JSON.stringify(terms_lookup));
	}

	if (jq.fObj_translate.hasOwnProperty('target')){
		fObj.target = jq.fObj_translate.target;
	} 

	for (var n in jq.fObj_translate){
		console.log('make_fObj - n: ' + n);
		if (jq.fObj_translate[n].hasOwnProperty('sym')){
			// fObj[n] = jq.fObj_translate[n].sym;
			fObj[terms_lookup[n]] = jq.fObj_translate[n].sym;
		} 
	}
	console.log('make_fObj - fObj: ' + JSON.stringify(fObj));

	return fObj;
}


function make_fObj(currentQuestionNo) {
	var jq = jsonData.qObj[currentQuestionNo];
	console.log('make_fObj - jq: ' + JSON.stringify(jq));

	var fObj = {};
	var fObj_equation, termArr, asciiNum;

	if (jq.hasOwnProperty('equation')){
		fObj.equation = jq.equation;
	}

	if (jq.fObj_translate.hasOwnProperty('target')){
		fObj.target = jq.fObj_translate.target;
	} 

	for (var n in jq.fObj_translate){
		console.log('make_fObj - n: ' + n);
		if (jq.fObj_translate[n].hasOwnProperty('sym')){
			fObj[n] = jq.fObj_translate[n].sym;
		} 
	}
	console.log('make_fObj - fObj: ' + JSON.stringify(fObj));

	return fObj;
}


function poseQuestion() {
	var prop;
	var jq = jsonData.qObj[memObj.currentQuestionNo];
	console.log('poseQuestion - jq: ' + JSON.stringify(jq));


	var question = (jq.hasOwnProperty('question'))? jq.question : jsonData.genericQuestion;
	console.log('poseQuestion - question 1: ' + question);
	
	// var CoeffArray = LatexStr.match(new RegExp("((^"+Delimiter+"[A-Z])|(\ "+Delimiter+"[A-Z])|("+Delimiter+"\\+)|("+Delimiter+"-))", 'g'));

	// question = 'Isoler størrelsen latex{term} i udtrykket latex{equation} for text{phrase}';
	var latexArr = question.match(/ latex{\w*}/g);
	var strArr = question.match(/ text{\w*}/g);
	console.log('poseQuestion - latexArr: ' + latexArr + ', strArr: ' + strArr);

	console.log('poseQuestion - fObj: ' + JSON.stringify(fObj));

	for (var n in latexArr) {
		prop = latexArr[n].substring(7,latexArr[n].length-1);
		console.log('poseQuestion - prop: ' + prop);
		if (jq.hasOwnProperty(prop)) {  // If the latex property exist in the jsonData...
			console.log('poseQuestion - jq['+prop+']: ' + jq[prop]);
			if (fObj.hasOwnProperty(prop)) {   // If the latex property exist in the fObj...
				console.log('poseQuestion - fObj['+prop+']: ' + fObj[prop] + ', latexArr['+n+']: ' + latexArr[n]);

				if (prop == 'equation') {  // If the latex property is the equation-property, then replace all the vars with the corrosponding latex vars from fObj...

					var equation = fObj[prop];
					console.log('poseQuestion - equation 1: ' + equation);

					equation = convertTermsToLatexTerms(equation);
					console.log('poseQuestion - equation 2: ' + equation);

					equation = equationToLatex(equation);
					console.log('poseQuestion - equation 3: ' + equation);

					question = question.replace(/latex{equation}/g, ' \\('+equation+'\\)');
				} 
			} else if (fObj.hasOwnProperty(jq[prop])){  // This is e.g. latex{term}, which typically has a symbol in fObj
				question = question.replace(new RegExp(latexArr[n], 'g'), ' \\('+fObj[jq[prop]]+'\\)');
			} else {   // else jq[prop] does not have a symbol in fObj, in which case one might just write a latex symbol directly in the jsonData
				question = question.replace(new RegExp(latexArr[n], 'g'), ' \\('+jq[prop]+'\\)');
			}
		} else {
			question = question.replace(new RegExp(latexArr[n], 'g'), ' - laTex UNDEFINED - ');
		}
	}
	console.log('poseQuestion - question 2: ' + question);

	for (var n in strArr) {
		prop = strArr[n].substring(6,strArr[n].length-1);
		console.log('poseQuestion - prop: ' + prop);
		if (jq.hasOwnProperty(prop)) {
			console.log('poseQuestion - jq[prop]: ' + jq[prop]);
			question = question.replace(new RegExp(strArr[n], 'g'), jq[prop]);
		} else {
			question = question.replace(new RegExp(strArr[n], 'g'), ' - text UNDEFINED - ');
		}
	}
	console.log('poseQuestion - question 3: ' + question);

	// question = 'Isoler størrelsen \(C\) i udtrykket ';
	// question = 'Isoler størrelsen $$ \require{cancel} \frac{Q}{C} = \frac{ \cancel{C} \cdot m \cdot \Delta T }{\cancel{C}} $$ i udtrykket ';

	return question;
}


function convertTermsToLatexTerms(equation){
	equation = equation.replace(/ /g, '');
	console.log('\nconvertTermsToLatexTerms - equation: ' + equation);

	var termArr = makeTermArr(equation);
	console.log('convertTermsToLatexTerms - termArr: ' + termArr);

	// var termStr = '#'+equation.replace(/(\+|\-|\*|\/|=|\(|\))/g, '#')+'#';
	var termStr = '#'+equation.replace(/(\+|\-|\*|\/|=|\(|\))/g, '##')+'#';
	console.log('convertTermsToLatexTerms - termStr: ' + termStr);

	var termStr_mod = termStr;
	for (var n in termArr) {
		if (fObj.hasOwnProperty(termArr[n])) {
			console.log('convertTermsToLatexTerms - n: ' + n + ', termArr[n]: ' + termArr[n] + ', fObj[termArr[n]]: ' + JSON.stringify(fObj[termArr[n]]));
			termStr_mod = termStr_mod.replace(new RegExp('#'+termArr[n]+'#', 'g'), '#'+fObj[termArr[n]]+'#');
		}
	}
	console.log('convertTermsToLatexTerms - termStr_mod 1: ' + termStr_mod);

	termStr_mod = termStr_mod.replace(/##/g, '#');
	console.log('convertTermsToLatexTerms - termStr_mod 2: ' + termStr_mod);

	termStr_mod = termStr_mod.substring(1, termStr_mod.length-1);
	console.log('convertTermsToLatexTerms - termStr_mod 3: ' + termStr_mod);

	var opArr = equation.match(new RegExp(/\W+/, 'g'));
	console.log('convertTermsToLatexTerms - opArr: ' + opArr);

	for (var n in opArr) {
		var delims = '#'.repeat(opArr[n].length);
		termStr_mod = termStr_mod.replace(delims, opArr[n]);
	}
	console.log('convertTermsToLatexTerms - termStr_mod: ' + JSON.stringify(termStr_mod));

	return termStr_mod;
}



function poseEquation() {
	// var jq = jsonData.qObj[memObj.currentQuestionNo];
	// console.log('poseEquation - jq: ' + JSON.stringify(jq));

	// var equation = convertTermsToLatexTerms(jq.equation);
	// console.log('poseEquation - equation 2: ' + JSON.stringify(equation));

	var equation = convertTermsToLatexTerms(fObj.equation);
	console.log('poseEquation - equation 2: ' + JSON.stringify(equation));

	equation = '$$'+equationToLatex(equation)+'$$';
	console.log('poseEquation - equation 3: ' + JSON.stringify(equation));

	return equation;
}


// see: http://stackoverflow.com/questions/1960473/unique-values-in-an-array
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
// usage example:
var a = ['a', 1, 'a', 2, '1'];
console.log('onlyUnique: ' + a.filter( onlyUnique )); // returns ['a', 1, 2, '1']



function makeTermArr(equation){
	console.log('makeTermArr - equation: ' + equation);

	var termArr = equation.replace(/( |\(|\))/g, '').replace(/(\+|\-|\*|\/|=)/g, '#').split('#');
	console.log('makeTermArr - termArr 1: ' + termArr);
	termArr = termArr.filter( onlyUnique );
	console.log('makeTermArr - termArr 2: ' + termArr);

	return termArr;
}


function makeBtnOperatorChoises(equation, operatorArr) {
	console.log('makeBtnOperatorChoises - equation: ' + equation);

	var jq = jsonData.qObj[memObj.currentQuestionNo];

	var termArr = equation.replace(/( |\(|\))/g, '').replace(/(\+|\-|\*|\/|=)/g, '#').split('#');
	console.log('makeBtnOperatorChoises - termArr 1: ' + termArr);
	termArr = termArr.filter( onlyUnique );
	console.log('makeBtnOperatorChoises - termArr 2: ' + termArr);
	var operatorLookup = {'*':'Multiplicer', '/':'Divider', '+':'Adder', '-':'Subtraher'};
	var latexLookup = {'*': '\\cdot', '/': '/', '+': '+', '-': '-'}
	var HTML = '';
	for (var m in operatorArr) {
		// HTML += '<div class="operatorGroup">';
		// for (var n in termArr) {
		// 	HTML += '<div class="operator btn btn-info" data-operator='+operatorArr[m]+' data-term='+termArr[n]+'>'+operatorLookup[operatorArr[m]]+' med '+((jq.fObj_translate.hasOwnProperty(termArr[n]))? '\\('+jq.fObj_translate[termArr[n]].sym+'\\)' : termArr[n])+'</div>';
		// }
		// HTML += '</div>';

		HTML += '<div class="operatorGroup">';
		HTML += '<h4 class="subHeader">'+operatorLookup[operatorArr[m]]+' med:' + '</h4>';
		for (var n in termArr) {
			HTML += '<div class="operator operator_small_1 btn btn-lg btn-info" data-operator='+operatorArr[m]+' data-term='+termArr[n]+'>'+((jq.fObj_translate.hasOwnProperty(termArr[n]))? '\\('+jq.fObj_translate[termArr[n]].sym+'\\)' : termArr[n])+'</div>';
		}
		HTML += '</div>';
	}
	console.log('makeBtnOperatorChoises - HTML: ' + HTML);

	return HTML;
}
makeBtnOperatorChoises('a+b+c-d-e-g*H_0*h/f', ['+','-']);


// NOTE: Most of this function is copied from "findNextOperator(formula)" from solver.js. Here "formula" and "equation" is synonymous: they both 
function performOperation(formula, inverseOperator, reducingTerm){

	// formula = formula.replace(/ /g, '').replace(/\*/g, '');
	formula = formula.replace(/ /g, '');
	console.log('\nperformOperation - formula: ' + formula);

	var formulaArr = formula.split('=');
	// var targetSide = (formulaArr[0].indexOf(fObj.target)!==-1)? formulaArr[0] : formulaArr[1];  // select the side of the the formula on which fObj.target is located.
	if (formulaArr[0].indexOf(fObj.target)!==-1) {
		var targetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[0]);
		var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[1]);
		var varSide = 'left';
	} else {
		var targetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[1]);
		var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms_COPY(formulaArr[0]);
		var varSide = 'right';
	}
	console.log('performOperation - targetSide: ' + targetSide + ', nonTargetSide: ' + nonTargetSide + ', varSide: ' + varSide);

	var pArr = outerParenthesisBound_COPY(targetSide);
	console.log('performOperation - pArr: ' + JSON.stringify(pArr));

	var TtargetSide = removeParenthesis_formula_COPY(targetSide, pArr);   // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
	console.log('performOperation - TtargetSide: ' + TtargetSide); 

	// var iObj = create_iObj_COPY(targetSide);
	// console.log('findNextOperator - iObj: ' + JSON.stringify(iObj));

	// var iObj_red = removeParenthesis_iObj_COPY(iObj, pArr);					// <-------- (#-2-#) IMPORTANT : iObj needs to be similar to targetSide - see (#-1-#) above.
	// console.log('findNextOperator - iObj_red: ' + JSON.stringify(iObj_red));

	// var iObj_ops = removeNumAndCharsAndOperators_iObj_COPY(iObj_red);				// Array of operators "+" and "-", which might be empty if "*" and "/" are the only operators used.
	// console.log('findNextOperator - iObj_ops: ' + JSON.stringify(iObj_ops) + ', fObj: ' + JSON.stringify(fObj));

	var targetSide_red = reduceSide_COPY(targetSide, inverseOperator, reducingTerm, TtargetSide);
	console.log('performOperation - targetSide_red: ' + targetSide_red);

	nonTargetSide_red = addReducingTermOnNonTargetSide_COPY(nonTargetSide, inverseOperator, reducingTerm);  // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
	console.log('performOperation - nonTargetSide_red: ' + nonTargetSide_red);

	var reducableFormula = (varSide == 'left')? targetSide_red+'='+nonTargetSide_red : nonTargetSide_red+'='+targetSide_red;
	console.log('performOperation - reducableFormula: ' + reducableFormula);

	return reducableFormula;
}


// ======================
// 		NOT IN USE:       
// ======================
function removeNumAndCharsAndOperators_iObj_COPY(iObj){
	var TiObj = iObj.slice();
	for (var i = iObj.length - 1; i >= 0; i--) { 
		if ('1234567890.,abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ_[]'.indexOf(iObj[i].val)!==-1) {
			TiObj.splice(i, 1);
		}
	}
	console.log('removeNumAndCharsAndOperators_iObj_COPY - TiObj: ' + JSON.stringify(TiObj)); 

	return TiObj;
}


// ======================
// 		NOT IN USE:       
// ======================
function removeParenthesis_iObj_COPY(iObj, pArr){
	var TiObj = iObj.slice();
	var iObj_mod = [];

	for (var i = pArr.length - 1; i >= 0; i--) {  // The key is to work our way backwards in pArr in order not to destroy the sequence/order in iObj:
		TiObj.splice(pArr[i].left, pArr[i].right - pArr[i].left + 1);
		console.log('removeParenthesis_iObj_COPY - i: '+i+', TiObj: ' + JSON.stringify(TiObj));
	};

	return TiObj;
}


// ======================
// 		NOT IN USE:       
// ======================
function create_iObj_COPY(formula){
	var fArr = formula.split("");
	var iObj = [];
	for (var n in fArr) {
		iObj.push({index:n, val:fArr[n]});
		
		if (fArr[n] == fObj.target) {  // This finds the position of fObj.target and stores it:
			fObj.index = n;
		}
	}
	// console.log('create_iObj_COPY - iObj: ' + JSON.stringify(iObj));

	return iObj;
}


function removeOuterParenthesisAroundNonSpecialTerms_COPY(equationSide) {
	console.log('\nremoveOuterParenthesisAroundNonSpecialTerms_COPY - equationSide: ' + equationSide);

	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY - pArr: ' + JSON.stringify(pArr));

	var TequationSide = removeParenthesis_formula_COPY(equationSide, pArr);    
	console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY - TtargetSide: ' + TequationSide); 

	// if ((equationSide.indexOf('(-')!==0) && (TequationSide.length==0)) {
	if (TequationSide.length==0) {
		return equationSide.substring(1, equationSide.length-1);
	} else {
		return equationSide;
	}
}
console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY("a*(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms_COPY("a*(b+x)"));
console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY("c(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms_COPY("c(b+x)"));
console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms_COPY("(b+x)"));
console.log('removeOuterParenthesisAroundNonSpecialTerms_COPY("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms_COPY("(-b+x)"));  // <------ MEGET VIGIGT: Her er et hul i strategien om at negative størrelser angivet med (-a). OK nu, idet (-b+x) --> -b+x --> (-b)+x senere i programmet.



// This function perform the action: 
//		ax + b = y  <==>  ax + b - b = y - b
function addReducingTermOnNonTargetSide_COPY(nonTargetSide, inverseOperator, reducingTerm){
	var pArr = outerParenthesisBound_COPY(nonTargetSide);
	console.log('addReducingTermOnNonTargetSide - pArr: ' + JSON.stringify(pArr));

	var TtargetSide = removeParenthesis_formula_COPY(nonTargetSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
	console.log('addReducingTermOnNonTargetSide - TtargetSide: ' + TtargetSide); 

	equationSide = reduceSide_COPY(nonTargetSide, inverseOperator, reducingTerm, TtargetSide);
	console.log('addReducingTermOnNonTargetSide - equationSide: ' + equationSide); 

	return equationSide;
}


function removeParenthesis_formula_COPY(formula, pArr){   // <------------ 28/2: Modificer denne saaledes at "/" kan identificeres i funktion? - SE: returnModifiedFraction()
	var parenthesis; 
	var formula_mod = formula;
	for (var n in pArr) {
		parenthesis = formula.substring(pArr[n].left, pArr[n].right+1);
		formula_mod = formula_mod.replace(parenthesis, '');
		console.log('removeParenthesis_formula_COPY - n: '+n+', formula_mod: ' + formula_mod);
	}

	return formula_mod;
}


function returnEquationSideFraction_nominator(equationSide, reducingTerm){   
	console.log('\nreturnEquationSideFraction_nominator - equationSide: ' + equationSide);

	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('returnEquationSideFraction_nominator - pArr: ' + JSON.stringify(pArr));

	// FROM: create_iObj(equationSide)
	var fArr = equationSide.split("");
	var iObj = [];
	for (var n in fArr) {
		iObj.push({index:n, val:fArr[n]});
	}
	console.log('returnEquationSideFraction_nominator - iObj: ' + JSON.stringify(iObj));

	var iObj_copy = iObj.slice();

	// FROM: removeParenthesis_formula(equationSide, pArr)
	var parenthesis; 
	var equationSide_mod = equationSide;
	// for (var n in pArr) {
	for (var n = pArr.length - 1; n >= 0; n--) {
		parenthesis = equationSide.substring(pArr[n].left, pArr[n].right+1);
		equationSide_mod = equationSide_mod.replace(parenthesis, '');
		console.log('returnEquationSideFraction_nominator - n: '+n+', equationSide_mod: ' + equationSide_mod);

		iObj.splice(pArr[n].left, pArr[n].right+1 - pArr[n].left);
		console.log('returnEquationSideFraction_nominator - n: '+n+', iObj: ' + JSON.stringify(iObj));
	}

	var residue = '';
	var nominator = '';
	var denominator = '';
	var index = equationSide_mod.indexOf('/');
	console.log('returnEquationSideFraction_nominator - index: ' + index);
	if ((equationSide_mod.indexOf('+')===-1) && (equationSide_mod.indexOf('-')===-1)){
		if (index!==-1) {
			console.log('returnEquationSideFraction_nominator - A0');
			// var str = iObj_copy[parseInt(iObj[index].index)-1].val;
			// console.log('returnEquationSideFraction_nominator - str: ' + str);
			// if (str == ')') {
			// 	console.log('returnEquationSideFraction_nominator - A1');
			// 	var parenthesisObj;
			// 	for (var n in pArr) {
			// 		if (pArr[n].right == parseInt(iObj[index].index)-1) {
			// 			console.log('returnEquationSideFraction_nominator - A2');
			// 			parenthesisObj = pArr[n];
			// 			break;
			// 		}
			// 	}
			// 	// nominator = equationSide.substring(0, pArr[n].left-1);
			// 	nominator = equationSide.substring(parenthesisObj.left, parseInt(parenthesisObj.right)+1);
			// 	denominator = equationSide.substring(parseInt(parenthesisObj.right+1));
			// } else {
			// 	console.log('returnEquationSideFraction_nominator - A3');
			// 	// nominator = equationSide.substring(0, iObj_copy[parseInt(iObj[index].index)+1].index-1);
			// 	var Tindex = iObj_copy[parseInt(iObj[index].index)+1].index-1;
			// 	nominator = equationSide.substring(0, Tindex); 
			// 	residue = equationSide.substring(Tindex+2);
			// 	denominator = str;
			// }

			nominator = equationSide.substring(0, parseInt(iObj[index].index));
			denominator = equationSide.substring(parseInt(iObj[index].index));

			console.log('returnEquationSideFraction_nominator - nominator: ' + nominator + ', denominator: ' + denominator);
		} else {
			console.log('returnEquationSideFraction_nominator - A4');
			equationSide = equationSide+'*'+reducingTerm
		}
	} else {
		alert('returnEquationSideFraction_nominator kan har "+" eller "-" operator!');
	}

	// if (typeof(hasOnlyMultAndDivOperators)!=='undefined') {
	// 	console.log('returnEquationSideFraction_nominator - A5');
	// 	if (hasOnlyMultAndDivOperators(nominator)) { // Check to se if denominator is like (a+b) or like (a*b)
	// 		console.log('returnEquationSideFraction_nominator - A6');
	// 		nominator = nominator.substring(1, nominator.length-1);
	// 	}

	// 	equationSide = nominator+'*'+reducingTerm+denominator;
	// 	console.log('returnEquationSideFraction_nominator - equationSide: ' + equationSide);
	// }

	equationSide = nominator+'*'+reducingTerm+denominator;
	console.log('returnEquationSideFraction_nominator - equationSide: ' + equationSide);


	return equationSide;
}
// console.log(returnEquationSideFraction_nominator('(d+(a+b/c))/e', 'u'));
// console.log(returnEquationSideFraction_nominator('(a+b/c)*(d+(a+b/c))/e/h', 'u'));
// console.log(returnEquationSideFraction_nominator('(d+(a+b/c))/(g+y)', 'u'));
// console.log(returnEquationSideFraction_nominator('a/b*p', 'u'));
// console.log(returnEquationSideFraction_nominator('(d+(a+b/c))/(g+y)*p', 'u'));


function returnEquationSideFraction_denominator(equationSide, reducingTerm){   
	console.log('\nreturnEquationSideFraction_denominator - equationSide: ' + equationSide);

	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('returnEquationSideFraction_denominator - pArr: ' + JSON.stringify(pArr));

	// FROM: create_iObj(equationSide)
	var fArr = equationSide.split("");
	var iObj = [];
	for (var n in fArr) {
		iObj.push({index:n, val:fArr[n]});
	}
	console.log('returnEquationSideFraction_denominator - iObj: ' + JSON.stringify(iObj));

	var iObj_copy = iObj.slice();

	// FROM: removeParenthesis_formula(equationSide, pArr)
	var parenthesis; 
	var equationSide_mod = equationSide;
	// for (var n in pArr) {
	for (var n = pArr.length - 1; n >= 0; n--) {
		parenthesis = equationSide.substring(pArr[n].left, pArr[n].right+1);
		equationSide_mod = equationSide_mod.replace(parenthesis, '');
		console.log('returnEquationSideFraction_denominator - n: '+n+', equationSide_mod: ' + equationSide_mod);

		iObj.splice(pArr[n].left, pArr[n].right+1 - pArr[n].left);
		console.log('returnEquationSideFraction_denominator - n: '+n+', iObj: ' + JSON.stringify(iObj));
	}

	var residue = '';
	var nominator = '';
	var denominator = '';
	if ((equationSide_mod.indexOf('+')===-1) && (equationSide_mod.indexOf('-')===-1)){
		var index = equationSide_mod.lastIndexOf('/');
		if (index!==-1) {
			console.log('returnEquationSideFraction_denominator - A0');
			var str = iObj_copy[parseInt(iObj[index].index)+1].val;
			console.log('returnEquationSideFraction_denominator - str: ' + str);
			if (str == '(') {
				console.log('returnEquationSideFraction_denominator - A1');
				var parenthesisObj;
				for (var n in pArr) {
					if (pArr[n].left == index+1) {
						console.log('returnEquationSideFraction_denominator - A2');
						parenthesisObj = pArr[n];
						break;
					}
				}
				// nominator = equationSide.substring(0, pArr[n].left-1);
				nominator = equationSide.substring(0, pArr[n].left-1);
				residue = equationSide.substring(pArr[n].right+1);
				denominator = equationSide.substring(pArr[n].left, pArr[n].right+1);
				console.log('returnEquationSideFraction_denominator - nominator: ' + nominator + ', denominator: ' + denominator + ', residue: ' + residue);

				if (hasOnlyMultAndDivOperators(denominator)) { // Check to se if denominator is like (a+b) or like (a*b)
					console.log('returnEquationSideFraction_denominator - A6');
					denominator = denominator.substring(1, denominator.length-1);
				}

				equationSide = nominator+'/('+denominator+'*'+reducingTerm+')'+residue;
			} else {
				console.log('returnEquationSideFraction_denominator - A3');
				// nominator = equationSide.substring(0, iObj_copy[parseInt(iObj[index].index)+1].index-1);
				var Tindex = iObj_copy[parseInt(iObj[index].index)+1].index-1;
				nominator = equationSide.substring(0, Tindex); 
				residue = equationSide.substring(parseInt(Tindex)+1);
				
				var type = typeOfNearestOperator_left(residue);
				console.log('returnEquationSideFraction_denominator - residue: ' + residue + ', type: ' + type);

				if (type !== null) {
					console.log('returnEquationSideFraction_denominator - A4');
					var index = residue.indexOf(type);
					denominator = residue.substring(0, index);
					residue = residue.substring(index);

					equationSide = nominator+'/('+denominator+'*'+reducingTerm+')'+residue;
				} else {
					console.log('returnEquationSideFraction_denominator - A5');
					denominator = residue;

					equationSide = nominator+'/('+denominator+'*'+reducingTerm+')';
				}

				// denominator = str;
				// denominator = str;
			}
			console.log('returnEquationSideFraction_denominator - nominator: ' + nominator + ', denominator: ' + denominator + ', residue: ' + residue);
		} else {
			alert('returnEquationSideFraction_denominator kan ikke finde en "/" operator!');
		}
	} else {
		alert('returnEquationSideFraction_denominator kan har "+" eller "-" operator!');
	}

	
	console.log('returnEquationSideFraction_denominator - equationSide: ' + equationSide);


	return equationSide;
}
console.log(returnEquationSideFraction_denominator('(d+(a+b/c))/e', 'u'));
console.log(returnEquationSideFraction_denominator('(a+b/c)*(d+(a+b/c))/e/h', 'u'));
console.log(returnEquationSideFraction_denominator('(d+(a+b/c))/(g+y)', 'u'));
console.log(returnEquationSideFraction_denominator('a/b*p', 'u'));
console.log(returnEquationSideFraction_denominator('(d+(a+b/c))/(g+y)*p', 'u'));


function typeOfNearestOperator_left(equationSide) {
	console.log('\ntypeOfNearestOperator_left - equationSide: ' + equationSide);

	var opArr = [];
	opArr.push({index: equationSide.indexOf('*'), op: '*'});
	opArr.push({index: equationSide.indexOf('/'), op: '/'});
	opArr.push({index: equationSide.indexOf('+'), op: '+'});
	opArr.push({index: equationSide.indexOf('-'), op: '-'});
	var mem = 1000000;
	var index;
	for (var n in opArr) {
		if ((-1 < opArr[n].index) && (opArr[n].index < mem)){
			mem = opArr[n].index;
			index = n;
		}
	}
	var type = (mem == 1000000)? null : opArr[index].op;
	console.log('typeOfNearestOperator_left - type: ' + type);

	return type;
}
typeOfNearestOperator_left('\\Delts{T}*a+b');
typeOfNearestOperator_left('test');


function hasOnlyMultAndDivOperators(equationSide) {
	// pArr = outerParenthesisBound_COPY(equationSide);
	// console.log('hasOnlyMultAndDivOperators - pArr: ' + JSON.stringify(pArr));

	// var equationSide_mod = removeParenthesis_formula_COPY(equationSide, pArr);
	// console.log('hasOnlyMultAndDivOperators - equationSide_mod: ' + JSON.stringify(equationSide_mod));

	if ((equationSide.indexOf('+')===-1) && (equationSide.indexOf('-')===-1)) { // Check to se if denominator is like (a+b) or like (a*b)
		return true;
	} else {
		return false;
	}
}
console.log('hasOnlyMultAndDivOperators("a+b"): ' + hasOnlyMultAndDivOperators('a+b'));
console.log('hasOnlyMultAndDivOperators("a*b"): ' + hasOnlyMultAndDivOperators('a*b'));
console.log('hasOnlyMultAndDivOperators("a/b"): ' + hasOnlyMultAndDivOperators('a/b'));


// NOTE: This function is a copy of: "reduceSide(equationSide, inverseOperator, reducingTerm, TtargetSide)" from solver.js
// This function perform the action on ONE of the equation sides (right or left, determined by the string "equationSide"): 
//		ax + b = y  <==>  ax + b - b = y - b
function reduceSide_COPY(equationSide, inverseOperator, reducingTerm, TtargetSide){
	console.log('reduceSide_COPY - CALLED - equationSide: ' + equationSide + ', inverseOperator: ' + inverseOperator + ', reducingTerm: ' + reducingTerm + ', TtargetSide: ' + TtargetSide);
	
	if ((TtargetSide.indexOf('+')!==-1) || (TtargetSide.indexOf('-')!==-1)) {
		console.log('reduceSide_COPY - A1');

		if ((inverseOperator == '*') || (inverseOperator == '/')) {
			console.log('reduceSide_COPY - A2');

			equationSide = '('+equationSide+')'+inverseOperator+reducingTerm;
		} else {
			console.log('reduceSide_COPY - A3');

			equationSide = equationSide+inverseOperator+reducingTerm;
		}
	} else {
		console.log('reduceSide_COPY - A4');

		// if ((TtargetSide.indexOf('*')!==-1) || (TtargetSide.indexOf('/')!==-1)) {
		// 	console.log('reduceSide_COPY - A5');

		// 	equationSide = equationSide+inverseOperator+reducingTerm;


		// If there is only a char (eg. no '*' AND no '/') OR only to or more char multiplied with each other (eg. no '/'), then...
		if (((TtargetSide.indexOf('*')===-1) && (TtargetSide.indexOf('/')===-1)) || ((TtargetSide.indexOf('*')!==-1) && (TtargetSide.indexOf('/')===-1))) {  // <------ ONLY '*' 
			console.log('reduceSide_COPY - A5a');

			equationSide = equationSide+inverseOperator+reducingTerm;

		} else if (inverseOperator == '/'){
			console.log('reduceSide_COPY - A5b');

			equationSide = returnEquationSideFraction_denominator(equationSide, reducingTerm);

		} else if (inverseOperator == '*'){
			console.log('reduceSide_COPY - A5b');

			// equationSide = equationSide+inverseOperator+reducingTerm;
			equationSide = returnEquationSideFraction_nominator(equationSide, reducingTerm);

		} else {
			console.log('reduceSide_COPY - A6');

			if (equationSide == '0') {
				console.log('reduceSide_COPY - A7');

				if ((inverseOperator == '*') || (inverseOperator == '/')) {
					console.log('reduceSide_COPY - A8');

					equationSide = '0';
				} else {
					console.log('reduceSide_COPY - A9');

					equationSide = (inverseOperator == '-')? inverseOperator+reducingTerm : reducingTerm;
				}
			} else if (equationSide == '1') {
				console.log('reduceSide_COPY - A10');

				if (inverseOperator == '*') {
					console.log('reduceSide_COPY - A11');

					equationSide = reducingTerm;
				} else {
					console.log('reduceSide_COPY - A12');

					equationSide = equationSide+inverseOperator+reducingTerm;
				}
			} else {
				console.log('reduceSide_COPY - A13');

				equationSide = equationSide+inverseOperator+reducingTerm;
			}
		}
	}
	console.log('reduceSide_COPY - equationSide: ' + equationSide);

	return equationSide;
}


function returnTermsFromEquation(equation){
	var termArr = equation.replace(/(\+|\-|\*|\/)/g, '#').split('#');
	console.log('returnTermsFromEquation: ' + JSON.stringify(termArr));
}
returnTermsFromEquation('a+b+c-d-e-g*H_0*h/f/y');


function setEventListeners() {
	$( document ).on('click', "#next", function(event){ 
		// giveQuestion();
		++memObj.currentQuestionNo;
		giveQuestion();

		// Dynamisk genereret LaTex:
		// =========================
        microhint($("#equationContainer"), poseQuestion(), "red");   // #micro_hint
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.microhint')[0]]);
        // MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#btnContainer')[0]]);


        MathJax.Hub.Queue(function () {
			console.log('mathJaxQueue - MJXc-display: ' + $('.MJXc-display').length);
		});


		mathJaxEquationAjuster('#equationContainer');
	});

	$( document ).on('click', ".operator", function(event){ 

		$('.microhint').remove();

		console.log('\n======================================  CLICK: .operator  ==========================================\n ');

		var dataOperator = $(this).attr('data-operator');
		console.log('setEventListeners - dataOperator: ' + dataOperator);

		var dataTerm = $(this).attr('data-term');
		console.log('setEventListeners - dataTerm: ' + dataTerm);

		var equation = fObj.equation;
		console.log('setEventListeners - equation: ' + equation);

		fObj.equation = performOperation(equation, dataOperator, dataTerm);
		console.log('setEventListeners - fObj.equation: ' + fObj.equation);

		// $('#equationContainer_hidden').html(poseEquation());  // Add the equation to the hidden container

		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);

		// MathJax.Hub.Queue(function (){
		// 	$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
		// });

		// mathJaxEquationAjuster('#equationContainer');

		var redTermStr = suggestReducingTerm(fObj.equation);
		if (redTermStr != '') {
			$('#reduceBtnContainer').html(redTermStr);
			$('.operator').addClass('operator_inactive').removeClass('operator');
			$('.subHeader').addClass('subHeader_inactive').removeClass('subHeader');
			// MathJax.Hub.Queue(function (){
			// 	MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#reduceBtn')[0]]);
			// });
		}

		$('#equationContainer_hidden').html(poseEquation());  // Add the equation to the hidden container

		MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);

		MathJax.Hub.Queue(function (){
			$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
			mathJaxEquationAjuster('#equationContainer');
		});

		
	});

	$( document ).on('click', ".reduceBtn", function(event){
		
	});

	$( document ).on('click', ".microhint", function(event){
		$('.microhint').remove();
	});

	$( document ).on('click', "#equationContainer", function(event){

		if ($('.microhint').length > 0){
			$('.microhint').remove();
		} else {
	        
			// Dynamisk genereret LaTex:
			// =========================
	        microhint($(this), poseQuestion(), "red");   // #micro_hint
	        MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.microhint')[0]]);

	        // Pre-formateret LaTex fra hidden field:
			// ======================================
	        // microhint($(this), String($('#micro_hint').html()), "red");
	    }

        console.log("microhint - CALLED");
    });

}


function detectBootstrapBreakpoints(){
    if (typeof(bootstrapBreakpointSize) === 'undefined') {
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize defined.');
        window.bootstrapBreakpointSize = null;
        window.bootstrapcolObj = {xs:0,sm:1,md:2,lg:3};
    }

    $(document).ready(function() {
        console.log('detectBootstrapBreakpoints - document.ready.');
        $('body').append('<div id="bootstrapBreakpointWrapper"> <span class="visible-xs-block"> </span> <span class="visible-sm-block"></span> <span class="visible-md-block"> </span> <span class="visible-lg-block"> </span> </div>');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize);
    });

    $(window).on('resize', function () {
        console.log('detectBootstrapBreakpoints - window.resize.');
        bootstrapBreakpointSize = $( "#bootstrapBreakpointWrapper>span:visible" ).prop('class').split('-')[1];
        console.log('detectBootstrapBreakpoints - bootstrapBreakpointSize: ' + bootstrapBreakpointSize + ', typeof(bootstrapBreakpointSize): ' + typeof(bootstrapBreakpointSize));
    });
}


detectBootstrapBreakpoints();  // This function call has to be here, due to the use of $(document).ready() and $(window).resize() inside the function.


function autoLeftSpacer(){
	console.log('autoLeftSpacer - CALLED');
	
	$( ".autoLeftSpacer" ).each(function( index, element ) {
		MathJax.Hub.Queue(function () {
			if (bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md']) {
				var parentWidth = $(element).parent().width();
				var nextElemWidth = $(element).next().width();
				console.log('autoLeftSpacer - parentWidth: ' + parentWidth + ', nextElemWidth: ' + nextElemWidth);
				$(element).width((parentWidth - nextElemWidth)/2);
			} else {
				$(element).width(0);
			}
		});
	});
	 
}


function mathJaxEquationAjuster(equationSelector) {
	if (typeof(fontEquationSize)==='undefined') {
		window.fontEquationSize = parseInt($(equationSelector).css('font-size').replace('px', ''));
	}
	MathJax.Hub.Queue(function (){
		var fontSize, count, ajust = false;
		
		fontSize = parseInt($(equationSelector).css('font-size').replace('px', ''));
		console.log('mathJaxEquationAjuster - A0 - fontSize: ' + fontSize + ', fontEquationSize: ' + fontEquationSize);
		console.log('mathJaxEquationAjuster - MJXc-display: ' + $('.MJXc-display').length + ', mjx-char: ' + $('.mjx-char').length);  // mjx-char
		var parentWidth = $(equationSelector).width(); // The width of #equationContainer
		var childWidth = $(equationSelector + '> .MJXc-display > span').width();
		console.log('mathJaxEquationAjuster - parentWidth: ' + parentWidth + ', childWidth: ' + childWidth);

		if ((childWidth >= parentWidth) || (fontEquationSize < fontSize)) {
			console.log('mathJaxEquationAjuster - A1');
			count = 0;
			while ((childWidth > parentWidth) && (count < 50)) {
				
				fontSize = parseInt($(equationSelector).css('font-size').replace('px', ''));
				console.log('mathJaxEquationAjuster - fontSize: ' + fontSize);

				$(equationSelector).css('font-size', String(fontSize-1)+'px');

				parentWidth = $(equationSelector).width(); // The width of #equationContainer
				childWidth = $(equationSelector + '> .MJXc-display > span').width();
				console.log('mathJaxEquationAjuster - parentWidth: ' + parentWidth + ', childWidth: ' + childWidth);

				++count;
			}
			ajust = true;
		} else {
			console.log('mathJaxEquationAjuster - A2');
			count = 0;
			while ((childWidth < parentWidth) && (fontEquationSize > fontSize) && (count < 50)) {
				
				fontSize = parseInt($(equationSelector).css('font-size').replace('px', ''));	
				console.log('mathJaxEquationAjuster - fontSize: ' + fontSize + ', fontEquationSize: ' + fontEquationSize);

				$(equationSelector).css('font-size', String(fontSize+1)+'px');

				parentWidth = $(equationSelector).width(); // The width of #equationContainer
				childWidth = $(equationSelector + '> .MJXc-display > span').width();
				console.log('mathJaxEquationAjuster - parentWidth: ' + parentWidth + ', childWidth: ' + childWidth);

				++count;
			}
		}
	});
}


$(window).resize(function() {
	// $('#leftColumn').attr('class', ((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered'));
	// $('#btnContainer').attr('class', ((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered'));

	autoLeftSpacer();

	mathJaxEquationAjuster('#equationContainer');
});

$(document).ready(function() {
	initQuiz();
	autoLeftSpacer();


	MathJax.Hub.Queue(function () {
		console.log('mathJaxEquationAjuster - MJXc-display: ' + $('.MJXc-display').length + ', mjx-char: ' + $('#equationContainer .mjx-char').length);  // mjx-char
	});

});
