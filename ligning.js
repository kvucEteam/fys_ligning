// Floating points:
// https://docs.python.org/release/2.5.1/tut/node16.html
// console.log('51/1000: ' + 51/1000);
// console.log('51*0.01: ' + 51*0.01);
// console.log('51*0.001: ' + 51*0.001);
// console.log('51*0.0001: ' + 51*0.0001);

// Floating point - sikring i jackpot:
// http://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript

// ====================================================================================================================
// 						PROGRAM PROBLEMS
// ==================================================================================================================== 

// ==================
// 		8/5-2017:
// ==================
// INPUT: 	equationToLatex('a/b=\\cancel{b}*c/\\cancel{b}');    
// OUTPUT:  equationToLatex - latexEq: \frac{a}{b}=\frac{\cancel{b} \cdot c}{\cancel{b}}

// INPUT: 	equationSideToLatex('\\cancel{b}*c/\\cancel{b}');
// OUTPUT: 	equationSideToLatex - equationSide 5: \frac{\cancel{b} \cdot c}{\cancel{b}}

// ==================
// 		9/5-2017:
// ==================
// poseEquation - equation 1: \require{cancel} a/b=\cancel{b}*c/\cancel{b}
// poseEquation - equation 2: "\\require{cancel}a\\b{\\cancel{b}}c/\\cancel{b}"					<----- FEJL: lighedstegnet forsvinder!
// poseEquation - equation 3: "$$\\frac{\\require{cancel}a\\b{\\cancel{b}}c}{\\cancel{b}}$$"	<----- FEJL: \\require{cancel} flyttes ind i \\frac{}

// ==================
// 		23/5-2017:
// ==================
// suggestReducingTerm  >  suggestReducingTerm_side   <----- Her kan jeg måske indsætte funktion til at foreslå "a" når a*b/(a*c) 
// Måske kan en funktion laves der ken anvendes i både suggestReducingTerm_side OG 


// INPUT: 	
// OUTPUT: 	

// INPUT: 	
// OUTPUT: 	

// INPUT: 	
// OUTPUT: 	

// INPUT: 	
// OUTPUT: 	

// INPUT: 	
// OUTPUT: 	

// ====================================================================================================================
// 						PROGRAM STRUCTURE AS OF 10-03-2017
// ==================================================================================================================== 

// initQuiz();
// 		template();
// 		main();
// 			giveQuestion();
//				make_fObj();
// 				poseQuestion();
// 					convertTermsToLatexTerms();
// 						makeTermArr();
// 					equationToLatex();
// 						equationSideToLatex();
// 							positionOfInnerMostParenthesisFraction();
// 							returnInnerParenthesisFraction();
// 							makeFraction();
// 								outerParenthesisBound_COPY();
// 								returnParenthesisObj();
// 								removeParenthesisInNominator();
// 									removeOuterParenthesisAroundNonSpecialTerms_COPY();
// 										outerParenthesisBound_COPY();
// 										removeParenthesis_formula_COPY();
// 								removeParenthesisInDenominator();
// 									removeOuterParenthesisAroundNonSpecialTerms_COPY();
// 										---- look above ----
// 				poseEquation();
// 					convertTermsToLatexTerms();
// 						---- look above ----
// 					equationToLatex();
// 						---- look above ----
// 				makeBtnOperatorChoises();
// 		setEventListeners();
// 			$( document ).on('click', "#next", function(event){
// 				giveQuestion();
// 					---- look above ----
// 				microhint();
// 					poseQuestion();
// 						---- look above ----
// 				mathJaxEquationAjuster();
//
// 			});
//
// 			$( document ).on('click', ".operator", function(event){
// 				performOperation();
// 					removeOuterParenthesisAroundNonSpecialTerms_COPY();
// 						---- look above ----
// 					outerParenthesisBound_COPY();
// 					removeParenthesis_formula_COPY();
// 					reduceSide_COPY();
// 					addReducingTermOnNonTargetSide_COPY()
// 				suggestReducingTerm();
// 					removeOuterParenthesisAroundNonSpecialTerms_COPY();
// 						---- look above ----
// 					suggestReducingTerm_side();
// 					convertTermsToLatexTerms();
// 						---- look above ----
//				poseEquation();
// 					---- look above ----
// 			});
//
// 			$( document ).on('click', ".reduceBtn", function(event){
// 			});
//
// 			$( document ).on('click', ".microhint", function(event){
// 			});
//
// 			$( document ).on('click', "#equationContainer", function(event){
// 				microhint();
// 					poseQuestion();
// 						---- look above ----
// 			});


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
	console.log('\nequationToLatex - equation: ' + equation);

	var leftSide, rightSide, latexEq;
	equation = equation.replace(/ /g, '');
	console.log('equationToLatex - equation: ' + equation);

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
equationToLatex('Delta_E/Delta_T = c*m*Delta_T/Delta_T');
equationToLatex('a/b=\\cancel{b}*c/\\cancel{b}');



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
equationSideToLatex('\\cancel{b}*c/\\cancel{b}');


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


// MARK: 13-03-2017

//####################################
//
// MEGET VIGTIGT: 
// --------------
// reduceTargetSide_2() i solver.js har fejl, som kan rettes hvis reduceTargetSide_2 laves med performStrikeThrough som skabelon
//
//####################################
// This function is a copy of reduceTargetSide_2 from solver.js - all bugs has been solved, w
// The purpose of this function is to add "_strikeThrough" on all therms that needs to be reduced. 
function performStrikeThrough(equationSide, inverseOperator, reducingTerm) {  // strikethrough


	console.log('\nperformStrikeThrough - equationSide: _' + equationSide + '_, inverseOperator: ' + inverseOperator + ', reducingTerm: ' + reducingTerm);

	var st = '_strikeThrough';
	// var st = '@';   // Added 1/5-2017


	var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

	console.log('performStrikeThrough - equationSide 1: ' + equationSide + ', inverseOperator 1: ' + inverseOperator + ', reducingTerm 1: ' + reducingTerm);

	var pArr = outerParenthesisBound_COPY(equationSide);
	console.log('performStrikeThrough - pArr: ' + JSON.stringify(pArr));

	var pObj = sc.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
	console.log('performStrikeThrough - pObj: ' + JSON.stringify(pObj)); 

	var TequationSide = pObj.formula_mod;
	var parenthesisArr = pObj.parenthesisArr;

	console.log('performStrikeThrough - TequationSide 1: ' + TequationSide + ', inverseOperator 2: ' + inverseOperator + ', reducingTerm 2: ' + reducingTerm);

	var numOfreducingTerms = TequationSide.split(reducingTerm).length - 1;     // Added 1/5-2017
	console.log('performStrikeThrough - numOfreducingTerms: ' + numOfreducingTerms); 

	// if (numOfreducingTerms > 1) {  // Added 1/5-2017
	if (numOfreducingTerms == 2) {    // Added 9/5-2017
		var count = 0;
		// var pos = TequationSide.indexOf(reducingTerm);  				 // ERROR: find all, but only the operator and its inverse is nedded // COMMENTED OUT 9/5-2017
		var pos = TequationSide.indexOf(inverseOperator + reducingTerm) + 1;  // ADDED 9/5-2017
		while ((pos!==-1) && (count < 2)) {

			// pos += 1;  // ADDED 9/5-2017 - it compemnsates for the addition of the inverseOperator

			console.log('performStrikeThrough - WHILE ---------------------------- count: ' + count + ', pos: ' + pos + ', TequationSide: ' + TequationSide );

			var pos_begin = null, pos_end = null;
			var opBefore = null, opEnd = null;

			// var pos = equationSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm);
			
			if (pos !== -1) {
				console.log('performStrikeThrough - A0');

				if (pos == 0) {
					console.log('performStrikeThrough - A1');

					pos_begin = pos;
					pos_end = reducingTerm.length-1;

					if (TequationSide.length >= pos_end+1) {
						console.log('performStrikeThrough - A2');

						opEnd = TequationSide.substring(pos_end+1, pos_end+2);

					}
				}

				if ((pos > 0) && (pos < TequationSide.length - reducingTerm.length)) {
					console.log('performStrikeThrough - A3');

					pos_begin = pos;
					pos_end = pos + reducingTerm.length-1;

					opEnd = TequationSide.substring(pos_end+1, pos_end+2);
					opBefore = TequationSide.substring(pos_begin-1, pos_begin);
				}

				if ((pos > 0) && (pos == TequationSide.length - reducingTerm.length)) {
					console.log('performStrikeThrough - A4');

					pos_begin = pos;
					pos_end = TequationSide.length-1;

					opBefore = TequationSide.substring(pos_begin-1, pos_begin);
				}

				console.log('performStrikeThrough - opBefore: _' + opBefore + '_ , opEnd: _' + opEnd + '_');

				// ==================================

				if (inverseOperator == '+') { 
					console.log('performStrikeThrough - A5');
					if (opBefore == '-')  {
						console.log('performStrikeThrough - A6');

						if ((opEnd == '+') || (opEnd == '-')) {
							console.log('performStrikeThrough - A7');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
							TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opBefore+reducingTerm+st+opEnd);
						}
						if (opEnd == null) {
							console.log('performStrikeThrough - A8');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
							TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
						}
					}
				}

				if (inverseOperator == '-') { 
					console.log('performStrikeThrough - A9');

					if (opBefore == null)  {
						console.log('performStrikeThrough - A10');

						if (opEnd == '-') {
							console.log('performStrikeThrough - A11');

							// TequationSide = TequationSide.replace(reducingTerm+opEnd, opEnd);
							TequationSide = TequationSide.replace(reducingTerm+opEnd, reducingTerm+st+opEnd);
						}

						if (opEnd == '+') {
							console.log('performStrikeThrough - A11b');

							// TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
							TequationSide = TequationSide.replace(reducingTerm+opEnd, reducingTerm+st+opEnd);
						}
					}
					if (opBefore == '+')  {
						console.log('performStrikeThrough - A12');

						if ((opEnd == '+') || (opEnd == '-')) {
							console.log('performStrikeThrough - A13');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
							TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opBefore+reducingTerm+st+opEnd);
						}
						if (opEnd == null) {
							console.log('performStrikeThrough - A14');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
							TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
						}
					}
				}

				if ((inverseOperator == '*') || (inverseOperator == '/')) {

					if (inverseOperator == '*') { 
						console.log('performStrikeThrough - A15');

						// if ((opBefore == '/') && ((opEnd == '*') || (opEnd == '/'))) {
						if (((opBefore == null) || (opBefore == '*') || (opBefore == '/')) && ((opEnd == '*') || (opEnd == '/'))){  // Added 1/5-2017
							console.log('performStrikeThrough - A16');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
							TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opBefore+reducingTerm+st+opEnd);
						}

						// if ((opEnd == null) && (opBefore == '/')){
						if ((opEnd == null) && ((opBefore == '*') || (opBefore == '/'))){  // Added 1/5-2017
							console.log('performStrikeThrough - A17');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
							TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
						}
					}

					if (inverseOperator == '/') { 
						console.log('performStrikeThrough - A18');

						// if (((opBefore == null) || (opBefore == '*')) && ((opEnd == '*') || (opEnd == '/'))){ 
						if (((opBefore == null) || (opBefore == '*') || (opBefore == '/')) && ((opEnd == '*') || (opEnd == '/'))){  // Added 1/5-2017
							console.log('performStrikeThrough - A19');

							// TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
							TequationSide = TequationSide.replace(reducingTerm+opEnd, reducingTerm+st+opEnd);
						}

						// if ((opEnd == null) && (opBefore == '*')){
						if ((opEnd == null) && ((opBefore == '*') || (opBefore == '/'))){  // Added 1/5-2017
							console.log('performStrikeThrough - A20');

							// TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
							TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
						}
					}
				}

			} else {
				console.log('performStrikeThrough - A21');
			}

			// TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);  // <----- CODE ADDED 6/4-2017:


			// var mArr = TequationSide.match(new RegExp(/\w+_strikeThrough/, 'g'));
			var mArr = TequationSide.match(new RegExp(/\w+(_strikeThrough)/, 'g'));
			// var mArr = TequationSide.match(new RegExp(/\w+@/, 'g'));
			console.log('performStrikeThrough - TequationSide 4: '+TequationSide+', mArr: ' + mArr);

			if (mArr !== null){
				console.log('performStrikeThrough - A22');

				// THIS CODEBLOCK WORKS BUT MIGHT NOT BE NECESSARY:
				console.log('performStrikeThrough - mArr: ' + mArr + ', pos: ' + pos + ', TequationSide: ' + TequationSide);
				var opObj = returnSurroundingOps(mArr[0], pos, TequationSide);
				console.log('performStrikeThrough - opObj: ' + JSON.stringify(opObj));
				// if ((opObj.opBegin !== null) || (opObj.opEnd !== null)) {  // E.g the case that should NOT occur: "k = ...."
					console.log('performStrikeThrough - A23');

					var Tbegin = (opObj.opBegin !== null)? opObj.opBegin : '';
					var Tend = (opObj.opEnd !== null)? opObj.opEnd : '';
					// console.log('performStrikeThrough - Tbegin+mArr[0]+Tend: '+Tbegin+mArr[0]+Tend);
					// TequationSide = TequationSide.replace(Tbegin+mArr[0]+Tend, Tbegin+'\\cancel{'+reducingTerm+'}'+Tend);
					console.log('performStrikeThrough - Tbegin+mArr[0]+Tend: '+Tbegin+mArr[0]+Tend);

					// TequationSide = TequationSide.replace(mArr[0], '\\cancel{'+reducingTerm+'}');	// COMMENTED OUT 1/5-2017
				//}

				// var TequationSide = TequationSide.replace(new RegExp(mArr[0], 'g'), '\\cancel{'+reducingTerm+'}');

				console.log('performStrikeThrough - TequationSide 5: '+TequationSide+', mArr[0]: ' + mArr[0]);
			}
		
			console.log('performStrikeThrough - count: ' + count + ', pos: ' + pos);

			var dimL = String('\\cancel{'+reducingTerm+'}').length;
			// pos = TequationSide.indexOf(reducingTerm, pos+dimL);
			// pos = TequationSide.indexOf(reducingTerm, pos+1);  								  // COMMENTED OUT 9/5-2017
			pos = TequationSide.indexOf(inversOpsLookup[inverseOperator] + reducingTerm, 0) + 1;  // ADDED 9/5-2017
			if (pos === -1) {
				console.log('performStrikeThrough - A24');
				pos = TequationSide.indexOf(reducingTerm, 0);    // ADDED 9/5-2017
			}
			++count;

			console.log('performStrikeThrough - count: ' + count + ', TequationSide: ' + TequationSide + ', pos: ' + pos + ' ,dimL: ' + dimL + ', pos+dimL: ' + String(pos+dimL));
		
		} // END WHILE

	} // END IF

	console.log('performStrikeThrough - TequationSide 2: ' + TequationSide + ', inverseOperator 3: ' + inverseOperator + ', reducingTerm 3: ' + reducingTerm);

	for (var n in parenthesisArr) {
		TequationSide = TequationSide.replace('#'+n+'#', parenthesisArr[n]);
	}
	console.log('performStrikeThrough - TequationSide 3: ' + TequationSide + ', inverseOperator 4: ' + inverseOperator + ', reducingTerm 4: ' + reducingTerm);


	// // var mArr = TequationSide.match(new RegExp(/\w+_strikeThrough/, 'g'));
	// var mArr = TequationSide.match(new RegExp(/\w+(_strikeThrough)/, 'g'));
	// console.log('performStrikeThrough - TequationSide 4: '+TequationSide+', mArr: ' + mArr);

	// if (mArr !== null){
	// 	console.log('performStrikeThrough - A20');

	// 	// THIS CODEBLOCK WORKS BUT MIGHT NOT BE NECESSARY:
	// 	var opObj = returnSurroundingOps(mArr[0], pos, TequationSide);
	// 	if ((opObj.opBegin !== null) || (opObj.opEnd !== null)) {  // E.g the case that should NOT occur: "k = ...."
	// 		console.log('performStrikeThrough - A21');

	// 		var Tbegin = (opObj.opBegin !== null)? opObj.opBegin : '';
	// 		var Tend = (opObj.opEnd !== null)? opObj.opEnd : '';
	// 		console.log('performStrikeThrough - Tbegin+mArr[0]+Tend: '+Tbegin+mArr[0]+Tend);
	// 		TequationSide = TequationSide.replace(Tbegin+mArr[0]+Tend, '\\cancel{'+mArr[0]+'}');
	// 	}

	// 	// var TequationSide = TequationSide.replace(new RegExp(mArr[0], 'g'), '\\cancel{'+reducingTerm+'}');
	// }
	// console.log('performStrikeThrough - TequationSide 5: '+TequationSide+', mArr[0]: ' + mArr[0]);

	return TequationSide;
	

	// }
}
//================
//		OLD 		// AFTER 1/5-2017
//================
// console.log("performStrikeThrough('a+b', '-', 'a'): " + performStrikeThrough('a+b', '-', 'a'));
// console.log("performStrikeThrough('a-b', '-', 'a'): " + performStrikeThrough('a-b', '-', 'a'));
// console.log("performStrikeThrough('b+a', '-', 'a'): " + performStrikeThrough('b+a', '-', 'a'));
// console.log("performStrikeThrough('b-a', '-', 'a'): " + performStrikeThrough('b-a', '-', 'a'));

// console.log("performStrikeThrough('a+b', '+', 'a'): " + performStrikeThrough('a+b', '+', 'a'));
// console.log("performStrikeThrough('a-b', '+', 'a'): " + performStrikeThrough('a-b', '+', 'a'));
// console.log("performStrikeThrough('b+a', '+', 'a'): " + performStrikeThrough('b+a', '+', 'a'));
// console.log("performStrikeThrough('b-a', '+', 'a'): " + performStrikeThrough('b-a', '+', 'a'));

// console.log("performStrikeThrough('c+a+b', '+', 'a'): " + performStrikeThrough('c+a+b', '+', 'a'));
// console.log("performStrikeThrough('c+a-b', '+', 'a'): " + performStrikeThrough('c+a-b', '+', 'a'));
// console.log("performStrikeThrough('c+b+a', '+', 'a'): " + performStrikeThrough('c+b+a', '+', 'a'));
// console.log("performStrikeThrough('c+b-a', '+', 'a'): " + performStrikeThrough('c+b-a', '+', 'a'));
// console.log("performStrikeThrough('c+a+b', '-', 'a'): " + performStrikeThrough('c+a+b', '-', 'a'));
// console.log("performStrikeThrough('c+a-b', '-', 'a'): " + performStrikeThrough('c+a-b', '-', 'a'));
// console.log("performStrikeThrough('c+b+a', '-', 'a'): " + performStrikeThrough('c+b+a', '-', 'a'));
// console.log("performStrikeThrough('c+b-a', '-', 'a'): " + performStrikeThrough('c+b-a', '-', 'a'));

// console.log("performStrikeThrough('a*b', '/', 'a'): " + performStrikeThrough('a*b', '/', 'a'));
// console.log("performStrikeThrough('a/b', '/', 'a'): " + performStrikeThrough('a/b', '/', 'a'));
// console.log("performStrikeThrough('b*a', '/', 'a'): " + performStrikeThrough('b*a', '/', 'a'));
// console.log("performStrikeThrough('b/a', '/', 'a'): " + performStrikeThrough('b/a', '/', 'a')); // <---- FEJL - 10-03-2017  <--- OK - 10-03-2017

// console.log("performStrikeThrough('a*b', '*', 'a'): " + performStrikeThrough('a*b', '*', 'a')); // <---- FEJL - 10-03-2017  <--- OK - 10-03-2017
// console.log("performStrikeThrough('a/b', '*', 'a'): " + performStrikeThrough('a/b', '*', 'a')); // <---- FEJL - 10-03-2017  <--- OK - 10-03-2017
// console.log("performStrikeThrough('b*a', '*', 'a'): " + performStrikeThrough('b*a', '*', 'a')); // <---- FEJL - 10-03-2017  <--- OK - 10-03-2017
// console.log("performStrikeThrough('b/a', '*', 'a'): " + performStrikeThrough('b/a', '*', 'a')); 

//================
//		NEW 		// AFTER 1/5-2017
//================
// console.log("performStrikeThrough('b/a*a', '*', 'a'): " + performStrikeThrough('b/a*a', '*', 'a')); 

// console.log("performStrikeThrough('(c-b)/a*a', '*', 'a'): " + performStrikeThrough('(c-b)/a*a', '*', 'a')); 

// console.log("performStrikeThrough('a*b/a', '/', 'a'): " + performStrikeThrough('a*b/a', '/', 'a'));


// console.log("performStrikeThrough('b*c/b', '/', 'b'): " + performStrikeThrough('b*c/b', '/', 'b')); 
// console.log("performStrikeThrough('b/b*c', '/', 'b'): " + performStrikeThrough('b/b*c', '/', 'b'));

// 01234567890123456789012345678901234567890
//           |         |         |         |
// b_strikeThrough*c/b
// \cancel{b}*c/b


// ADDED 15/6-2017
// VIGTIGT: Denne funktion tager ikke højde for operatorene "+" og "-"
function performStrikeThrough_onlyMultAndDiv(equationSide, inverseOperator, reducingTerm) {
	console.log('\nperformStrikeThrough_onlyMultAndDiv - equationSide: ' + equationSide + ', inverseOperator: ' + inverseOperator + ', reducingTerm: ' + reducingTerm);

	var pArr = sc.outerParenthesisBound(equationSide);
	console.log('performStrikeThrough_onlyMultAndDiv - pArr: ' + JSON.stringify(pArr));

	var pObj = sc.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
	console.log('performStrikeThrough_onlyMultAndDiv - pObj: ' + JSON.stringify(pObj)); 

	leftSide = pObj.formula_mod;
	parenthesisArr = pObj.parenthesisArr;

	var pos;

	// If TequationSide = a*x/(x*b)  OR  x*a/(x*b) , then -----> a*x/b  OR  x*a/b
	if ((inverseOperator = '/') || (inverseOperator = '*')) {
		console.log('performStrikeThrough_onlyMultAndDiv - A1');

		if (parenthesisArr.length == 0) { 

			pos = equationSide.indexOf(reducingTerm);

			var opObj = returnSurroundingOps(reducingTerm, pos, equationSide);
			console.log('performStrikeThrough - opObj: ' + JSON.stringify(opObj));

			var TreducingTerm = opObj.opBegin+reducingTerm+opObj.opEnd;
			TreducingTerm = TreducingTerm.replace('+', '').replace('-', '');

			if (('/'+reducingTerm != TreducingTerm) && (equationSide.indexOf(TreducingTerm)!==-1) && (equationSide.indexOf('/'+reducingTerm)!==-1)) {
				
				var TreducingTerm_strikeThrough = opObj.opBegin+reducingTerm+'_strikeThrough'+opObj.opEnd;
				TreducingTerm_strikeThrough = TreducingTerm_strikeThrough.replace('+', '').replace('-', '');

				equationSide = equationSide.replace(TreducingTerm, TreducingTerm_strikeThrough);
				equationSide = equationSide.replace('/'+reducingTerm, '/'+reducingTerm+'_strikeThrough');
			}
		}

		if (parenthesisArr.length == 1) { // If there is only one parenthesis...
			console.log('performStrikeThrough_onlyMultAndDiv - A2');

			if (parenthesisArr[0].match(/(\+|\-|\/)/g) === null) { // If "+", "-" og "/" is NOT present... (NOTE: .match() returns "null" if nothing i matched).
				console.log('performStrikeThrough_onlyMultAndDiv - A3');

				pos = equationSide.indexOf('/(');
				if (pos !== -1) { // If "/(" is found...  NOTE: equationSide is the original leftSide WITH parenthesis...
					console.log('performStrikeThrough_onlyMultAndDiv - A4');

					nominator = equationSide.substring(0, pos);
					denominator = equationSide.substring(pos+1);
					console.log('performStrikeThrough_onlyMultAndDiv - nominator: ' + nominator + ', denominator: ' + denominator + ', reducingTerm: _' + reducingTerm + '_');

					if ((nominator.match(/(\+|\-|\/)/g) === null) && (nominator.indexOf(reducingTerm)!==-1) && // If +,-,/ is NOT present in nominator AND reducingTerm is present...
						(denominator.match(/(\+|\-|\/)/g) === null) && (denominator.indexOf(reducingTerm))!==-1) {  // If +,-,/ is NOT present in denominator AND reducingTerm is present...
							console.log('performStrikeThrough_onlyMultAndDiv - A5');

							nominator = nominator.replace(reducingTerm, reducingTerm+'_strikeThrough');

							denominator = denominator.replace(reducingTerm, reducingTerm+'_strikeThrough');

							if (denominator.match(/(\+|\-|\/|\*)/g) === null) {	// If no other operators are present, e.g. if we have the case a*x/(b), then ----> a*x/b
								console.log('performStrikeThrough_onlyMultAndDiv - A6');
								denominator = sc.removeOuterParenthesisAroundNonSpecialTerms(denominator);
							}
					}

					equationSide = nominator+'/'+denominator; 
					console.log('performStrikeThrough_onlyMultAndDiv - equationSide: ' + equationSide);
				}
			}
		}
	}

	return equationSide;
}
console.log("performStrikeThrough_onlyMultAndDiv('a*b/a', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*b/a', '/', 'a'));
console.log("performStrikeThrough_onlyMultAndDiv('a*a*b/a', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*a*b/a', '/', 'a'));
console.log("performStrikeThrough_onlyMultAndDiv('a*b/(a)', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*b/(a)', '/', 'a'));
console.log("performStrikeThrough_onlyMultAndDiv('a*a*b/(a)', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*a*b/(a)', '/', 'a'));
console.log("performStrikeThrough_onlyMultAndDiv('a*b/(a*c)', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*b/(a*c)', '/', 'a'));
console.log("performStrikeThrough_onlyMultAndDiv('a*a*b/(a*c)', '/', 'a'): " + performStrikeThrough_onlyMultAndDiv('a*a*b/(a*c)', '/', 'a'));



function replaceStrikeThroughDelimiter(equation) {
	console.log('\nreplaceStrikeThroughDelimiter - equation 1: ' + equation);

	var mArr = equation.match(new RegExp(/\w+(_strikeThrough)/, 'g'));

	if (mArr !== null){
		for (var n in mArr) {
			equation = equation.replace(mArr[n], '\\cancel{'+mArr[n].replace('_strikeThrough', '')+'}');
		}
	}

	console.log('replaceStrikeThroughDelimiter - equation 2: ' + equation);

	return equation;
}
replaceStrikeThroughDelimiter('a/b=b_strikeThrough*c/b_strikeThrough');


function replaceStrikeThroughDelimiter_2(equation) {
	console.log('\nreplaceStrikeThroughDelimiter_2 - equation 1: ' + equation);

	var mArr = equation.match(new RegExp(/\w+(_strikeThrough)/, 'g'));

	var term;

	if (mArr !== null){
		for (var n in mArr) {
			term = mArr[n].replace('_strikeThrough', ''); // Remove '_strikeThrough'
			term = poseEquation(term);
			equation = equation.replace(mArr[n], '\\cancel{'+term+'}');
		}
	}

	console.log('replaceStrikeThroughDelimiter_2 - equation 2: ' + equation);

	return equation;
}


// ADDED 14/6-2017:
// When the MathJax \cancel{} command is used, the following bug appears: the cancel-linje is very small and does not fit the term it is supposed to cancel out.
// This function corrects the bug by making the slanted line in the SVG picture larger anf ajust the start and end points of the line.
function bugfix_strikeThrough() {
	console.log('\nbugfix_strikeThrough - CALLED');

	var width, height, html, pos, pos_begin, pos_end, str_begin, str_end; 
	$('.mjx-menclose').each(function(index, element) { 
		width = $(element ).width();
		height = $(element ).height();
		console.log('bugfix_strikeThrough - width: ' + width + ', height: ' + height + ', index: ' + index);

		// IMPORTANT: 
		// we can NOT refrence the line-tag by $(element + ' line' ).attr('x1'), so we 
		// need to do string manipulation to alter attributes x2 and y1 of the line-tag.
		if ((width != 0) || (height != 0)) {
			html = $(element).html();
			console.log('bugfix_strikeThrough - html 1: ' + html + ', typeof(): ' + typeof(html));
			
			pos = html.indexOf('<line ');
			pos_begin = html.indexOf('y1="', pos)+4;
			pos_end = html.indexOf('"', pos_begin);

			str_begin = html.substring(0, pos_begin);
			str_end = html.substring(pos_end);

			html = str_begin+height+'px'+str_end;  // <----- 'y1' = height + 'px'
			console.log('bugfix_strikeThrough - html 2: ' + html );

			pos = html.indexOf('<line ');
			pos_begin = html.indexOf('x2="', pos)+4;
			pos_end = html.indexOf('"', pos_begin);

			str_begin = html.substring(0, pos_begin);
			str_end = html.substring(pos_end);

			html = str_begin+width+'px'+str_end;  // <----- 'x2' = width + 'px'
			console.log('bugfix_strikeThrough - html 3: ' + html );

			$(element).html(html);
		}
	});
}


// var Tre = new RegExp(RegExp.quote(str1), "g");


// DESCRIPTION:
// This function returns the position of "operator + reducingTerm". If none is found "-1" is returned (just like the ".indexOf()" operator)
// This function is similar to the first part of performStrikeThrough().
function posOfOperatorAndreducingTerm(equationSide, operator, reducingTerm) {
	console.log('\nposOfOperatorAndreducingTerm - equationSide: ' + equationSide + ', operator: ' + operator + ', reducingTerm: ' + reducingTerm);
	var pos_begin = null, pos_end = null;
	var opBefore = null, opEnd = null;

	// var pos = equationSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm);

	// var pos = equationSide.indexOf(reducingTerm);
	
	var opArr = equationSide.match(/(\+|\-|\*|\/)/g);
	console.log('posOfOperatorAndreducingTerm - opArr: ' + opArr);

	var delimEquationSide = equationSide;
	for (var n in opArr) {
		delimEquationSide = delimEquationSide.replace(opArr[n], '#');
	}
	console.log('posOfOperatorAndreducingTerm - delimEquationSide: ' + delimEquationSide);

	var varArr = delimEquationSide.split('#');

	var len = opArr.length-1;

	var pos = -1;
	for (var n in opArr) {  // Loop over opArr, since opArr.length = varArr.length - 1    opArr[n]  varArr[n]  reducingTerm
		var startOp = (0<n)? opArr[parseInt(n)-1] : '';
		var endOp = (n<len)? opArr[parseInt(n)+1] : '';
		console.log('posOfOperatorAndreducingTerm - startOp: ' + startOp + ', endOp: ' + endOp);

		if (n == 0) {
			console.log('posOfOperatorAndreducingTerm - A0');

			if (((operator == '+') || (operator == '-') || (operator == '*')) && (varArr[n] == reducingTerm) ) {
				console.log('posOfOperatorAndreducingTerm - A1');
				return 0;
			}
		}

		if ((0<n) && (n<len)){
			if (startOp+varArr[n] == operator+reducingTerm) {
				console.log('posOfOperatorAndreducingTerm - A3');
				pos = equationSide.indexOf(startOp+reducingTerm+endOp) + 1;
			}
		}

		if (n == len) { 
			if ((operator == opArr[n]) && (varArr[n+1] == reducingTerm)) {
				return lastIndexOf(reducingTerm);
			}
		}
	}
	console.log('posOfOperatorAndreducingTerm - pos: ' + pos);

	return pos;
}
posOfOperatorAndreducingTerm('b*c/b', '/', 'b');
posOfOperatorAndreducingTerm('b*c/b', '*', 'b');
posOfOperatorAndreducingTerm('b/b*c', '*', 'b');
posOfOperatorAndreducingTerm('c*b/b', '*', 'b');


// The purpose of this function is to perform the operation: a/b = b*c/b  --->  a/b = c
// The over-all strategy is:
// 		if 	a/b = b*c/b  ---->  a/b = b*c,   via removeInverseOperatorAndReducingTermFromEquationSide (on each equationSide)
// 		then	a/b = b*c  ---->  a/b = c , via reduceTargetSide_3 (on each equationSide)
function reduceEquation(equation, inverseOperator, reducingTerm) {  // Added 19/5-2017
	console.log('\nreduceEquation - equation: ' + equation);

	var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

	var leftSide, rightSide, parenthesisArr, pos, nominator, denominator, mem;
	equation = equation.replace(/ /g, '');
	console.log('reduceEquation - equation: ' + equation);

	var equationArr = equation.split('=');
	leftSide = equationArr[0];
	rightSide = equationArr[1];

	// ==================
	// 		leftSide:
	// ==================
	var pArr = sc.outerParenthesisBound(leftSide);
	console.log('reduceEquation - pArr: ' + JSON.stringify(pArr));

	var pObj = sc.returnParenthesisObj_formula(leftSide, pArr, reducingTerm);   
	console.log('reduceEquation - pObj: ' + JSON.stringify(pObj)); 

	leftSide = pObj.formula_mod;
	parenthesisArr = pObj.parenthesisArr;

	// If TequationSide = a#x@x  OR  x#a@x , where # = +,-,*,/  AND  @ = -,+,/,*  (# an @ being inverse operations) then -----> a#x  OR  x#a
	if ((leftSide.indexOf(inverseOperator+reducingTerm) !== -1) && 
		((leftSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm) !== -1) || (leftSide.indexOf(reducingTerm) == 0)) ) {
			console.log('reduceEquation - A0');

			console.log('reduceEquation - leftSide 0: ' + leftSide);

			leftSide = removeInverseOperatorAndReducingTermFromEquationSide(leftSide, inverseOperator, reducingTerm);
			console.log('reduceEquation - leftSide 1: ' + leftSide);

			leftSide = sc.reduceTargetSide_3(leftSide, inverseOperator, reducingTerm);
			console.log('reduceEquation - leftSide 2: ' + leftSide);
	}

	for (var n in parenthesisArr) {
		leftSide = leftSide.replace('#'+n+'#', parenthesisArr[n]);
	}

	// If TequationSide = a*x/(x*b)  OR  x*a/(x*b) , then -----> a*x/b  OR  x*a/b
	if ((inverseOperator = '/') || (inverseOperator = '*')) {
		console.log('reduceEquation - A1');

		if (parenthesisArr.length == 1) { // If there is only one parenthesis...
			console.log('reduceEquation - A2');

			if (parenthesisArr[0].match(/(\+|\-|\/)/g) === null) { // If "+", "-" og "/" is NOT present... (NOTE: .match() returns "null" if nothing i matched).
				console.log('reduceEquation - A3');

				pos = equationArr[0].indexOf('/(');
				if (pos !== -1) { // If "/(" is found...  NOTE: equationArr[0] is the original leftSide WITH parenthesis...
					console.log('reduceEquation - A4');

					nominator = equationArr[0].substring(0, pos);
					denominator = equationArr[0].substring(pos+1);
					console.log('reduceEquation - nominator: ' + nominator + ', denominator: ' + denominator + ', reducingTerm: _' + reducingTerm + '_');

					if ((nominator.match(/(\+|\-|\/)/g) === null) && (nominator.indexOf(reducingTerm)!==-1) && // If +,-,/ is NOT present in nominator AND reducingTerm is present...
						(denominator.match(/(\+|\-|\/)/g) === null) && (denominator.indexOf(reducingTerm))!==-1) {  // If +,-,/ is NOT present in denominator AND reducingTerm is present...
							console.log('reduceEquation - A5');

							mem = nominator;  // This performs removal of one reducingTerm AND one operator once...
							nominator = nominator.replace('*'+reducingTerm+'*', '*');
							nominator = (mem == nominator)? nominator.replace('*'+reducingTerm, '') : nominator;
							nominator = (mem == nominator)? nominator.replace(reducingTerm+'*', '') : nominator;  // Remove reducingTerm and replace any '**' with '*'...
							nominator = (mem == nominator)? nominator.replace(reducingTerm, '1') : nominator;  // If no other operators are present, then replace with 1...
							
							mem = denominator;  // This performs removal of one reducingTerm AND one operator once...
							denominator = denominator.replace('*'+reducingTerm+'*', '*');
							denominator = (mem == denominator)? denominator.replace('*'+reducingTerm, '') : denominator;
							denominator = (mem == denominator)? denominator.replace(reducingTerm+'*', '') : denominator;

							if (denominator.match(/(\+|\-|\/|\*)/g) === null) {	// If no other operators are present, e.g. if we have the case a*x/(b), then ----> a*x/b
								console.log('reduceEquation - A6');
								denominator = sc.removeOuterParenthesisAroundNonSpecialTerms(denominator);
							}
					}

					leftSide = nominator+'/'+denominator; 
					console.log('reduceEquation - leftSide 1: ' + leftSide);
				}
			}
		}
	}
	console.log('reduceEquation - leftSide 2: ' + leftSide);
	

	// ==================
	// 		rightSide:
	// ==================
	var pArr = sc.outerParenthesisBound(rightSide);
	console.log('reduceEquation - pArr: ' + JSON.stringify(pArr));

	var pObj = sc.returnParenthesisObj_formula(rightSide, pArr, reducingTerm);   
	console.log('reduceEquation - pObj: ' + JSON.stringify(pObj)); 

	rightSide = pObj.formula_mod;
	parenthesisArr = pObj.parenthesisArr;

	// If TequationSide = a#x@x  OR  x#a@x , where # = +,-,*,/  AND  @ = -,+,/,*  (# an @ being inverse operations) then -----> a#x  OR  x#a
	if ((rightSide.indexOf(inverseOperator+reducingTerm) !== -1) && 
		((rightSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm) !== -1) || (rightSide.indexOf(reducingTerm) == 0)) ) {
			console.log('reduceEquation - A7');

			console.log('reduceEquation - rightSide 0: ' + rightSide);

			rightSide = removeInverseOperatorAndReducingTermFromEquationSide(rightSide, inverseOperator, reducingTerm);
			console.log('reduceEquation - rightSide 1: ' + rightSide);

			rightSide = sc.reduceTargetSide_3(rightSide, inverseOperator, reducingTerm);
			console.log('reduceEquation - rightSide 2: ' + rightSide);
	}

	for (var n in parenthesisArr) {
		rightSide = rightSide.replace('#'+n+'#', parenthesisArr[n]);
	}

	// If TequationSide = a*x/(x*b)  OR  x*a/(x*b) , then -----> a*x/b  OR  x*a/b
	if ((inverseOperator = '/') || (inverseOperator = '*')) {
		console.log('reduceEquation - A8');

		if (parenthesisArr.length == 1) { // If there is only one parenthesis...
			console.log('reduceEquation - A9');

			console.log('reduceEquation - parenthesisArr: ' + JSON.stringify(parenthesisArr[0]));

			if (parenthesisArr[0].match(/(\+|\-|\/)/g) === null) { // If "+", "-" og "/" is NOT present... (NOTE: .match() returns "null" if nothing i matched).
				console.log('reduceEquation - A10');

				pos = equationArr[1].indexOf('/(');
				if (pos !== -1) { // If "/(" is found...  NOTE: equationArr[1] is the original rightSide WITH parenthesis...
					console.log('reduceEquation - A11');

					nominator = equationArr[1].substring(0, pos);
					denominator = equationArr[1].substring(pos+1);
					console.log('reduceEquation - nominator: ' + nominator + ', denominator: ' + denominator + ', reducingTerm: ' + reducingTerm);

					if ((nominator.match(/(\+|\-|\/)/g) === null) && (nominator.indexOf(reducingTerm)!==-1) && // If +,-,/ is NOT present in nominator AND reducingTerm is present...
						(denominator.match(/(\+|\-|\/)/g) === null) && (denominator.indexOf(reducingTerm)!==-1)) {  // If +,-,/ is NOT present in denominator AND reducingTerm is present...
							console.log('reduceEquation - A12');

							mem = nominator;  // This performs removal of one reducingTerm AND one operator once...
							nominator = nominator.replace('*'+reducingTerm+'*', '*');
							nominator = (mem == nominator)? nominator.replace('*'+reducingTerm, '') : nominator;
							nominator = (mem == nominator)? nominator.replace(reducingTerm+'*', '') : nominator;  // Remove reducingTerm and replace any '**' with '*'...
							nominator = (mem == nominator)? nominator.replace(reducingTerm, '1') : nominator;  // If no other operators are present, then replace with 1...
							
							mem = denominator; // This performs removal of one reducingTerm AND one operator once...
							denominator = denominator.replace('*'+reducingTerm+'*', '*');
							denominator = (mem == denominator)? denominator.replace('*'+reducingTerm, '') : denominator;
							denominator = (mem == denominator)? denominator.replace(reducingTerm+'*', '') : denominator;

							if (denominator.match(/(\+|\-|\/|\*)/g) === null) {	// If no other operators are present, e.g. if we have the case a*x/(b), then ----> a*x/b
								console.log('reduceEquation - A13');
								denominator = sc.removeOuterParenthesisAroundNonSpecialTerms(denominator);
							}
					}

					rightSide = nominator+'/'+denominator; 
					console.log('reduceEquation - rightSide 1: ' + rightSide);
				}
			}
		}
	}
	console.log('reduceEquation - rightSide 2: ' + rightSide);


	// rightSide = removeInverseOperatorAndReducingTermFromEquationSide(equationArr[1], inverseOperator, reducingTerm);
	// console.log('reduceEquation - leftSide 1: ' + leftSide + ', rightSide1 : ' + rightSide);

	// rightSide = sc.reduceTargetSide_3(rightSide, inverseOperator, reducingTerm);
	// console.log('reduceEquation - leftSide 2: ' + leftSide + ', rightSide2 : ' + rightSide);


	// equation:
	// =========
	equation = leftSide + '=' + rightSide;
	console.log('reduceEquation - equation: ' + equation);

	equation = sc.removeOnesAndZeros(equation);
	console.log('reduceEquation - equation 2: ' + equation);

	return equation;
}
// console.log("reduceEquation('a/b=b*c/b', '/', 'b'): " + reduceEquation('a/b=b*c/b', '/', 'b'));
// console.log("reduceEquation('a/b=(b+c)/b', '/', 'b'): " + reduceEquation('a/b=(b+c)/b', '/', 'b'));
// console.log("reduceEquation('a*b/b=c*b', '/', 'b'): " + reduceEquation('a*b/b=c*b', '/', 'b'));  // <-----  22/5-2017.  FEJL: returnere a = b, KORREKT: a = c*b , OK 30/5-2017
// console.log("reduceEquation('b/b=b*c', '/', 'b'): " + reduceEquation('b/b=b*c', '/', 'b'));
// console.log("reduceEquation('1*a/a=c*b*a/(a*a)', '/', 'a'): " + reduceEquation('1*a/a=c*b*a/(a*a)', '/', 'a'));  // <-----  22/5-2017.  FEJL: returnere a = c*b*a/(a*a), KORREKT: a = c*b*a/a , OK 30/5-2017

console.log('Match-test 2: ' + 'a*b*c'.match(/(\+|\-|\/)/g));
console.log('Match-test 4: ' + 'a'.match(/(\+|\-|\/)/g));
console.log('Index-test 1: ' + 'a'.indexOf('a'));


// VIGTIGT:
// ========
// 29/5-2017: Denne funktion behøver ikke at returnere reducedEquation! - men blot suggestedReducingTerm!
//
// This function only acts on equations in the form of a fraction, eg. a*b*c/(a*d), where "a" is the therm (suggestedReducingTerm) that can be reduced from both nominator and denominator.
// This function returns both the suggestedReducingTerm and the reduced equation. For example:
// 		equation: "a*b*c/(a*d*e)"  ---->   {reducedEquation: "b*c/(d*e)", suggestedReducingTerm: "a"}
// 		equation: "a*b*c/(a*d)"  ---->   {reducedEquation: "b*c/d", suggestedReducingTerm: "a"}  <----  NOTE: the removed parenthesis!
function returnSuggestedReducingTermInFraction(equationSide) {
	console.log('\nreturnSuggestedReducingTermInFraction - equationSide: ' + equationSide);

	var suggestedReducingTerm = null;

	// var reducingTerm = 'a';

	// var pArr = sc.outerParenthesisBound(equationSide);
	// console.log('returnSuggestedReducingTermInFraction - pArr: ' + JSON.stringify(pArr));

	// var pObj = sc.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
	// console.log('returnSuggestedReducingTermInFraction - pObj: ' + JSON.stringify(pObj)); 

	// TequationSide = pObj.formula_mod;
	// parenthesisArr = pObj.parenthesisArr;


	pObj = sc.returnParenthesisObj_formula_mod(equationSide);
	console.log('returnSuggestedReducingTermInFraction - pObj: ' + JSON.stringify(pObj)); 

	TequationSide = pObj.equationSide_mod;
	parenthesisArr = pObj.parenthesisArr;

	// Check that the equationSide is in the form of a fraction:
	// =========================================================
	if (TequationSide.match(/(\+|\-)/g) === null) { // If there are no "+" and "-" operators...
		console.log('returnSuggestedReducingTermInFraction - A0');

		var numOfFractions = TequationSide.split('/').length-1;
		if (numOfFractions == 1) {  // ...and if there is excatly one "/" operator present, then equationSide
			console.log('returnSuggestedReducingTermInFraction - A1');

			var pos = TequationSide.indexOf('/');
			var nominator = TequationSide.substring(0, pos);
			var denominator = TequationSide.substring(pos+1);
			console.log('returnSuggestedReducingTermInFraction - denominator : ' + denominator);

			var nominatorArr = nominator.split('*');
			console.log('returnSuggestedReducingTermInFraction - nominatorArr 1: ' + nominatorArr);
			nominatorArr = nominatorArr.filter( onlyUnique );
			console.log('returnSuggestedReducingTermInFraction - nominatorArr 2: ' + nominatorArr);

			// denominator = denominator.split('*')[0];  // This deals with the case: a*b*c/(a*b)*e  --->  denominator = (a*b)
			// console.log('returnSuggestedReducingTermInFraction - denominator : ' + denominator);

			// if ((denominator.substr(0,1) == '#') && (denominator.substr(denominator.length-1,1) == '#')) {  // This matches a parenthesis in the denominator 
			if (denominator.substr(0,1) == '#') {  // This matches a parenthesis in the denominator. equationSide can be of the form a*b/(a*c) OR  a*b/(a*c)*k
				var pNum = denominator.match(/#\d+#/g)[0]; // This selects the parenthesis number (e.g. "#2#") in denominator.
				console.log('returnSuggestedReducingTermInFraction - pNum: ' + pNum);
				// if (pNum == denominator) {  // If this is the case, then equationSide is a fraction With a parenthsis in the denominator like a*b/(a*c)*k
				if (denominator.substr(0, pNum.length) == pNum) {  // If this is the case, then equationSide is a fraction With a parenthsis in the denominator like a*b/(a*c)*k
					console.log('returnSuggestedReducingTermInFraction - A2');

					pNum = parseInt(pNum.replace(/#/g, ''));
					var parenthesis = parenthesisArr[pNum];
					console.log('returnSuggestedReducingTermInFraction - parenthesis: ' + parenthesis);

					if (parenthesis.match(/(\+|\-|\/)/g) === null) { // If there no other operators than the "*" operator in the denominator parenthesis... 
						console.log('returnSuggestedReducingTermInFraction - A3');

						console.log('returnSuggestedReducingTermInFraction - parenthesis 0: ' + parenthesis);
						parenthesis = parenthesis.substring(1, parenthesis.length-1);  // Remove surrounding parenthesis
						console.log('returnSuggestedReducingTermInFraction - parenthesis 1: ' + parenthesis);

						parenthesis = parenthesis.replace(/\(/g, '').replace(/\)/g, '');  // Remove any combined parenthesis in the denominator, eg: (a*b)*(c*d) ---> a*b*c*d
						console.log('returnSuggestedReducingTermInFraction - parenthesis 2: ' + parenthesis);

						var TparenthesisArr = parenthesis.split('*');
						console.log('returnSuggestedReducingTermInFraction - TparenthesisArr 1: ' + TparenthesisArr);
						TparenthesisArr = TparenthesisArr.filter( onlyUnique );
						console.log('returnSuggestedReducingTermInFraction - TparenthesisArr 2: ' + TparenthesisArr);

						for (var n in TparenthesisArr) {
							if (elementInArray(nominatorArr, TparenthesisArr[n])){
								console.log('returnSuggestedReducingTermInFraction - A4');

								suggestedReducingTerm = TparenthesisArr[n];
								break;
							}
						}
					}
				}
			} else { // ... else no parenthesis is present in the denominator
				console.log('returnSuggestedReducingTermInFraction - A5');

				// if (elementInArray(nominatorArr, TparenthesisArr[n])){
				// 	console.log('returnSuggestedReducingTermInFraction - A5');

				// 	suggestedReducingTerm = TparenthesisArr[n];
				// 	break;
				// }
			}
		}
	}

	// find suggestedReducingTerm:

	// return {reducedEquation: "b*c/d", suggestedReducingTerm: "a"}

	console.log('returnSuggestedReducingTermInFraction - suggestedReducingTerm: ' + suggestedReducingTerm);

	return suggestedReducingTerm;
}
console.log('returnSuggestedReducingTermInFraction("a*b*c/(a*d*e)"): ' + returnSuggestedReducingTermInFraction("a*b*c/(a*d*e)"));
console.log('returnSuggestedReducingTermInFraction("a*b*c*(d+e)/(a*d*e)"): ' + returnSuggestedReducingTermInFraction("a*b*c*(d+e)/(a*d*e)"));
console.log('returnSuggestedReducingTermInFraction("a*b*c*(d+e)/((a*d*e)+(a*d*e))"): ' + returnSuggestedReducingTermInFraction("a*b*c*(d+e)/((a*d*e)+(a*d*e))"));
console.log('returnSuggestedReducingTermInFraction("a*b*c*(d+e)/((a*d*e)*(d*e*f))"): ' + returnSuggestedReducingTermInFraction("a*b*c*(d+e)/((a*d*e)*(d*e*f))"));
console.log('returnSuggestedReducingTermInFraction("a*b*c/(a*d*e)*s"): ' + returnSuggestedReducingTermInFraction("a*b*c/(a*d*e)*s"));
console.log('returnSuggestedReducingTermInFraction("a*b*c/a*s"): ' + returnSuggestedReducingTermInFraction("a*b*c/a*s"));   
console.log('returnSuggestedReducingTermInFraction("a*b/(b*b*b)"): ' + returnSuggestedReducingTermInFraction("a*b/(b*b*b)"));
console.log('returnSuggestedReducingTermInFraction("c*b/(b*b)"): ' + returnSuggestedReducingTermInFraction("c*b/(b*b)"));  // <---- FEJL: returnere "null", skal returnerer "b"
console.log('returnSuggestedReducingTermInFraction("c*b/(b*d)"): ' + returnSuggestedReducingTermInFraction("c*b/(b*d)"));

console.log('split-test: ' + String('a*s*d'.split('/').length-1));
console.log('match-test 3: ' + '#12##13#'.match(/#\d+#/g)[0]);

console.log('split-test 2x: ' + 'a'.split('*'));



// // This function is a version of returnParenthesisObj_formula(formula, pArr, reducingTerm) where "pArr" AND "reducingTerm" is not needed.
// function returnParenthesisObj_formula_mod(equationSide) {
// 	console.log('\nreturnParenthesisObj_formula_mod: - equationSide: ' + equationSide);

// 	pArr = sc.outerParenthesisBound(equationSide);

// 	var parenthesis, equationSide_mod, parenthesisArr = [];
// 	equationSide_mod = equationSide;
// 	for (var n in pArr) {
// 		parenthesis = equationSide.substring(pArr[n].left, pArr[n].right+1);
// 		parenthesisArr.push(parenthesis);
// 		equationSide_mod = equationSide_mod.replace(parenthesis, '#'+n+'#');
// 	}
// 	console.log('returnParenthesisObj_formula_mod: - equationSide_mod: ' + equationSide_mod);

// 	return {equationSide_mod: equationSide_mod, parenthesisArr: parenthesisArr, pArr: pArr};   // {"formula_mod":"c*b/(b*d)","parenthesisArr":["(b*d)"]}
// } 
// console.log('returnParenthesisObj_formula_mod("a*b*c*(d+e)/(a*d*e)*(d*e*f)"): ' + JSON.stringify( returnParenthesisObj_formula_mod("a*b*c*(d+e)/(a*d*e)*(d*e*f)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*d)"): ' + JSON.stringify( returnParenthesisObj_formula_mod("c*b/(b*d)")) );
// console.log('returnParenthesisObj_formula_mod("a*b*c/a*s"): ' + JSON.stringify( returnParenthesisObj_formula_mod("a*b*c/a*s")) );
// console.log('returnParenthesisObj_formula_mod("a*b/(b*b*b)"): ' + JSON.stringify( returnParenthesisObj_formula_mod("a*b/(b*b*b)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*b)"): ' + JSON.stringify( returnParenthesisObj_formula_mod("c*b/(b*b)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*d)"): ' + JSON.stringify( returnParenthesisObj_formula_mod("c*b/(b*d)")) );



// The purpose of this function is to perform the following:  a/b = b*c/b  ---->  a/b = b*c,   on each equationSide
function removeInverseOperatorAndReducingTermFromEquationSide(equationSide, inverseOperator, reducingTerm) {

	console.log('\nremoveInverseOperatorAndReducingTermFromEquationSide - equationSide: ' + equationSide + ', inverseOperator: ' + inverseOperator + ', reducingTerm: ' + reducingTerm);

	var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

	var pArr = sc.outerParenthesisBound(equationSide);
	console.log('removeInverseOperatorAndReducingTermFromEquationSide - pArr: ' + JSON.stringify(pArr));

	var pObj = sc.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
	console.log('removeInverseOperatorAndReducingTermFromEquationSide - pObj: ' + JSON.stringify(pObj)); 

	var TequationSide = pObj.formula_mod;
	var parenthesisArr = pObj.parenthesisArr;

	// If TequationSide = a#x@x  OR  x#a@x , where # = +,-,*,/  AND  @ = -,+,/,*  (# an @ being inverse operations) then -----> a#x  OR  x#a. ALSO: x/x ---> x
	if ((TequationSide.indexOf(inverseOperator+reducingTerm) !== -1) && 
		((TequationSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm) !== -1) || (TequationSide.indexOf(reducingTerm) == 0)) ) {
			console.log('removeInverseOperatorAndReducingTermFromEquationSide - A0'); 
			TequationSide = TequationSide.replace(inverseOperator+reducingTerm, '');
	}
	console.log('removeInverseOperatorAndReducingTermFromEquationSide - TequationSide: ' + TequationSide);

	return TequationSide;
}
// console.log("removeInverseOperatorAndReducingTermFromEquationSide('b*c/b', '/', 'b'): " + removeInverseOperatorAndReducingTermFromEquationSide('b*c/b', '/', 'b'));
// console.log("removeInverseOperatorAndReducingTermFromEquationSide('c*b/b', '/', 'b'): " + removeInverseOperatorAndReducingTermFromEquationSide('c*b/b', '/', 'b'));
// console.log("removeInverseOperatorAndReducingTermFromEquationSide('b/b', '/', 'b'): " + removeInverseOperatorAndReducingTermFromEquationSide('b/b', '/', 'b'));


// NEDENSTÅENDE TEST_BLOK ER MÅSKE IKKE NØDVENDIG:
// console.log("removeInverseOperatorAndReducingTermFromEquationSide('b/b', '/', 'b'): " + removeInverseOperatorAndReducingTermFromEquationSide('b/b', '/', 'b'));
// console.log("removeInverseOperatorAndReducingTermFromEquationSide('b-b', '-', 'b'): " + removeInverseOperatorAndReducingTermFromEquationSide('b-b', '/', 'b'));


console.log('CONVERT: ' + Number('2e-3'));
console.log('CONVERT: ' + Number('4.867E-7').toPrecision(21));  // /^([+-])?(\d+)\.?(\d*)[eE]([+-]?\d+)$/
console.log('CONVERT: ' + '4.867E-7'.match(/^([+-])?(\d+)\.?(\d*)[eE]([+-]?\d+)$/));

console.log('Match-test: ' + 'a*b/c+d-e'.match(/(\*|\/|\+|\-)/g));


function toDecStr(num){
	console.log('toDecStr - num: ' + num);
	strNum = String(num).replace('E', 'e');
	console.log('toDecStr - num: ' + num);
	if (strNum.indexOf('e')!==-1) {
		console.log('toDecStr - A0');
		var m = strNum.match(/[eE][+-]?\d+/);
		var n = strNum.substring(0, strNum.indexOf('e'));
		console.log('toDecStr - n: ' + n + ', m: ' + m);
		if (m.indexOf('-')!==-1) {
			
		} else {

		}
	}
}

toDecStr(0.00000000003);
toDecStr('3e-10');
toDecStr('-3e-10');
toDecStr('3e10');
toDecStr('-3e10');
toDecStr('-3.01e10');

// 3.2e-3 = 0.0032


// b/\cancel{a}*a
// 012345678901234567890123456789012345678901234567890
//           |         |         |         |         |


// Added 13/6-2017:
// This function converts some latex-markup to HTML by MathJax. It does so by using a placeholder in the HTML page-template.
// If a placeholder-id is given, the latex is first copied into the placeholder and then MathJax is applied and the HTML result is lastly returned by invokeMathJax().
// IMPORTANT: the placeholderId has to exist in the DOM! when the invokeMathJax() is called!
function invokeMathJax(parentId, latex, placeholderId) {

	$(placeholderId).html(latex);  // Add the equation to the hidden container

	MathJax.Hub.Queue(["Typeset",MathJax.Hub,$(placeholderId)[0]]);

	MathJax.Hub.Queue(function (){
		return $(placeholderId).html();  // Copy the equation from the hidden container to the visible container.
	});
	
	return 'invokeMathJax - TEST';
}
// invokeMathJax('test_parentId', 'TEST', 'test_placeholderId');


// ADDED 13/6-2017:
// This has a "copy" of the "selection" of left/right side form findNextOperator() in solver.js
function isEquationSolved(formula) {  
	console.log('\nisEquationSolved - formula: ' + formula);

	var numOfVars;

	var formulaArr = formula.split('=');

	var NumOfTargets_leftSide = formulaArr[0].split(fObj.target).length-1; 	
	var NumOfTargets_rightSide = formulaArr[1].split(fObj.target).length-1;	
	console.log('isEquationSolved - NumOfTargets_leftSide: ' + NumOfTargets_leftSide + ', NumOfTargets_rightSide: ' + NumOfTargets_rightSide);

	// if (NumOfTargets_leftSide == NumOfTargets_rightSide) {  	// <--- ADDED 9/6-2017  // COMMENTED OUT 13/6-2017
	// 	alert('KRITISK FEJL FRA "ligning.js" - isEquationSolved(formula): Ligningen har ingen løsning da NumOfTargets_leftSide = NumOfTargets_rightSide = ' + NumOfTargets_rightSide);
	// 	return 0;
	// }

	if (NumOfTargets_leftSide > NumOfTargets_rightSide) {  // If eg. x*x*a = x*b  --->  x = a/b
		console.log('isEquationSolved - A0');
		numOfVars = sc.returnParenthesisObj_formula_mod(formulaArr[0]).equationSide_mod.replace(/(\+|\-|\*|\/)/g, '@').split('@').length;
	} else {
		console.log('isEquationSolved - A1');
		numOfVars = sc.returnParenthesisObj_formula_mod(formulaArr[1]).equationSide_mod.replace(/(\+|\-|\*|\/)/g, '@').split('@').length;
	}
	console.log('isEquationSolved - numOfVars: ' + JSON.stringify( numOfVars ));

	if (numOfVars == 1) {
		return true;
	}

	return false;
}

// ADDED 13/6-2017:
// This replaces giveQuestion() in terms of making the student go to the next question OR giving the message that "all questions have been answered" / "equations solved".
function msg_goToNextEquation_or_finish(formula) {
	console.log('\nmsg_goToNextEquation_or_finish - formula: ' + formula);

	console.log('msg_goToNextEquation_or_finish - memObj.currentQuestionNo: ' + memObj.currentQuestionNo + ', memObj.numOfquestions: ' + memObj.numOfquestions);

	if (isEquationSolved(formula)) {
		console.log('msg_goToNextEquation_or_finish - A0');
		
		if (memObj.currentQuestionNo+1 < memObj.numOfquestions){
			console.log('msg_goToNextEquation_or_finish - A1');

			$('.operator').addClass('operator_inactive').removeClass('operator');
			$('.subHeader').addClass('subHeader_inactive').removeClass('subHeader');

			// $('#next').text('Næste opgave');   // 19/6-2017

			// microhint($(this), 'Hmmm... er du sikker på det?', true,"red");

			setTimeout(function(){  // This delay allows the student to see the result before firing the microhint!
				microhint($('#next'), "<div class='microhint_label_success'>Opgaven er løst <b>korrekt!</b> </div> Klik for at gå til næste opgave ", true, "#000");

				memObj.hasCurrentQuestionBeenAnswered = true; 
			}, 1500);

			$('#questionCount').text(String(memObj.currentQuestionNo+1) +' ud af '+ memObj.numOfquestions);
		} else {
			console.log('msg_goToNextEquation_or_finish - A2');

			UserMsgBox("body", '<h3>Du har<span class="label label-success">korrekt</span> besvaret alle opgaverne!</h3><p>Klik denne besked væk for at prøve igen.</p>');
	    	$('.MsgBox_bgr').unbind();
	    	$('#UserMsgBox').unbind();
	    	$('.MsgBox_bgr').addClass('MsgBox_reload');
	    	$('#UserMsgBox').addClass('MsgBox_reload');
		}
	}
}


function suggestReducingTerm(formula){
	formula = formula.replace(/ /g, '');
	console.log('\nsuggestReducingTerm - formula: ' + formula);

	var formulaArr = formula.split('=');
	// var targetSide = (formulaArr[0].indexOf(fObj.target)!==-1)? formulaArr[0] : formulaArr[1];  // select the side of the the formula on which fObj.target is located.
	if ((formulaArr[0].indexOf(fObj.target)!==-1) ) {
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
		console.log('suggestReducingTerm - A0');

		fObj.suggestedReducingTerm = opObj_targetSide.term;
		fObj.suggestedinverseOperator = opObj_targetSide.op;
		// fObj.suggested

		console.log('suggestReducingTerm - fObj: ' + JSON.stringify(fObj));

		if ((opObj_targetSide.op == '+') || (opObj_targetSide.op == '-')) {
			console.log('suggestReducingTerm - A1');

			return '<div class="reduceBtn btn btn-info">Reducer med \\('+convertTermsToLatexTerms( opObj_targetSide.term )+'\\)</div>';
			// return '<div class="reduceBtn btn btn-info">Reducer med '+invokeMathJax('.reduceBtn', convertTermsToLatexTerms( opObj_targetSide.term ), '#reduceBtn_hidden')+'</div>';
		}

		if ((opObj_targetSide.op == '*') || (opObj_targetSide.op == '/')) {
			console.log('suggestReducingTerm - A2');

			return '<div class="reduceBtn btn btn-info">Forkort med \\('+convertTermsToLatexTerms( opObj_targetSide.term )+'\\)</div>';
			// return '<div class="reduceBtn btn btn-info">Reducer med '+invokeMathJax('.reduceBtn', convertTermsToLatexTerms( opObj_targetSide.term ), '#reduceBtn_hidden')+'</div>';
		}
	} else if (opObj_nonTargetSide !== null) {
		console.log('suggestReducingTerm - A3');

		fObj.suggestedReducingTerm = opObj_nonTargetSide.term;
		fObj.suggestedinverseOperator = opObj_nonTargetSide.op;

		console.log('suggestReducingTerm - fObj: ' + JSON.stringify(fObj));

		if ((opObj_nonTargetSide.op == '+') || (opObj_nonTargetSide.op == '-')) {
			console.log('suggestReducingTerm - A4');

			return '<div class="reduceBtn btn btn-info">Reducer med \\('+convertTermsToLatexTerms( opObj_nonTargetSide.term )+'\\)</div>';
		}

		if ((opObj_nonTargetSide.op == '*') || (opObj_nonTargetSide.op == '/')) {
			console.log('suggestReducingTerm - A5');

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
	console.log('\nsuggestReducingTerm > suggestReducingTerm_side - END');

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
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - reducingTermMem 1: ' + JSON.stringify(reducingTermMem));


	if (reducingTermMem === null) {
		console.log('suggestReducingTerm > suggestReducingTerm_side - END - C0');

		console.log('suggestReducingTerm > suggestReducingTerm_side - END - equationSide: ' + equationSide);

		var term = returnSuggestedReducingTermInFraction(equationSide);
		console.log('suggestReducingTerm > suggestReducingTerm_side - END - term: ' + term);

		if (term !== null) {
			console.log('suggestReducingTerm > suggestReducingTerm_side - END - C0');
			reducingTermMem = {op: "/", term: term};  // This is the format that suggestReducingTerm_side returns: eiter "null" OR "{op: operator, term: term}".
		}
	}
	console.log('suggestReducingTerm > suggestReducingTerm_side - END - reducingTermMem 2: ' + JSON.stringify(reducingTermMem));

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


var memObj = {
				currentQuestionNo: 0, 	// This contain the current question number.
				solverObj: {},			// All relevant information in "memObj" from solver.js inserted here. <--- maybe this is not a good idea - it will become less clear where this data comes from.
				hasCurrentQuestionBeenAnswered: false
			};

function template() {

	var HTML = '';

	console.log('template - jsonData: ' + JSON.stringify(jsonData)); 

	HTML += '<h1>'+jsonData.header+'</h1>';
	
	HTML += instruction(jsonData.instruction);
	HTML += explanation(jsonData.explanation);

	HTML += '<div class="Clear"></div>';
	HTML += '<div id="interface">';
	HTML += 	'<div id="questionContainer" class="h3"></div>';
	HTML += 	'<div id="columnContainer">';
	HTML += 		'<div id="rightColumn" class="col-xs-12 col-md-6">';
	// HTML += 			'<div id="questionContainer" class="h3"></div>';
	HTML += 			'<div id="equationContainer"></div>';   
	// HTML += 			'<div id="equationContainer" class="fontSize250"></div>';
	HTML += 			'<div id="equationContainer_hidden" style="display: none;"></div>';
	HTML += 			'<div id="helpContainer_hidden" style="display: none;"></div>';
	HTML += 			'<div id="microhint_hidden" style="display: none;"></div>';
	HTML += 			'<div id="reduceBtn_hidden" style="display: none;"></div>';
	// HTML += 			'<div id="equationContainer_hidden" class="fontSize250"></div>';
	// HTML += 			'<div class="Clear"></div> <div id="nextBtnContainer"><div id="next" class="btn btn-primary">Næste</div><b>spørgsmål:</b> <span id="questionCount"></span></div>';
	HTML += 		'</div>';
	HTML += 		'<div id="leftColumn" class="col-xs-12 col-md-6">'; 
	// HTML += 			((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered');
	HTML += 			'<div class="autoLeftSpacer"></div>';
	HTML += 			'<div id="btnContainer"></div>';
	// HTML += 			'<div class="Clear"></div> <div id="next" class="btn btn-primary">Næste</div><b>spørgsmål:</b> <span id="questionCount"></span>';
	HTML += 			'<div id="reduceBtnContainer"></div>'
	HTML += 		'</div>';
	HTML += 		'<div class="Clear"></div>';
	HTML += 	'</div>';
	// HTML += 	'<div id="leftColumn" class="col-xs-2">'; 
	HTML += 		'<div class="Clear"></div> <div id="nextBtnContainer"><div id="next" class="btn btn-primary">Næste</div><b>spørgsmål:</b> <span id="questionCount"></span></div>';
	// HTML += 	'</div>';
	HTML += '<div class="Clear"></div>';
	// HTML += '<div id="help_complete" class="btn_help btn btn-xs btn-info">Se løsningsforslag</div>';
	// HTML += '<div id="help_now" class="btn_help btn btn-xs btn-info">Hjælp nu</div>';
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

	// $('#next').text();
	// memObj.hasCurrentQuestionBeenAnswered = false;  // ADDED 19/6-2017

	window.fObj = make_fObj(memObj.currentQuestionNo);
	console.log('giveQuestion - x - fObj 1: ' + JSON.stringify(fObj));

	var solveObj = generateSolution(true);
	fObj.noOfStepsToCompletion = solveObj.noOfStepsToCompletion;
	console.log('giveQuestion - x - fObj 2: ' + JSON.stringify(fObj));

	if (memObj.currentQuestionNo < memObj.numOfquestions){

		$('#questionContainer').html(poseQuestion());
		
		$('#equationContainer').html('$$'+poseEquation(fObj.equation)+'$$');

		// microhint('#equationContainer', poseQuestion(), "red");
		// microhint('#equationContainer', "TEST HINT", "red");


		// $('#micro_hint').html('$$'+poseEquation(fObj.equation)+'$$');

		// MathJax.Hub.Queue(function (){
		// 	$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
		// 	mathJaxEquationAjuster('#equationContainer');
		// });


		// $( "#equationContainer" ).trigger( "click" );

		// $('#equationContainer').html('$$ \\frac{Q}{C} = \\frac{ C \\cdot m \\cdot \\Delta T }{C} $$');   // <--------- VERY IMPORTANT: All "\" has to be "\\"
		// $('#equationContainer').html('\\( \\frac{Q}{C} = \\frac{ C \\cdot m \\cdot \\Delta T }{C} \\)'); // <--------- VERY IMPORTANT: All "\" has to be "\\"

		var jd = jsonData.qObj[memObj.currentQuestionNo];
		$('#btnContainer').html(makeBtnOperatorChoises(jd.equation, jd.operators));

		$('#questionCount').text(String(memObj.currentQuestionNo+1) +' ud af '+ memObj.numOfquestions);

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
console.log('convertTermsToLatexTerms("a=b/c@"): ' + convertTermsToLatexTerms("a=b/c@"));
// console.log('convertTermsToLatexTerms("a/b=\\cancel{b}*c/\\cancel{b}"): ' + convertTermsToLatexTerms("a/b=\\cancel{b}*c/\\cancel{b}"));



function poseEquation(equation) {
	// var jq = jsonData.qObj[memObj.currentQuestionNo];
	// console.log('poseEquation - jq: ' + JSON.stringify(jq));

	// var equation = convertTermsToLatexTerms(jq.equation);
	// console.log('poseEquation - equation 2: ' + JSON.stringify(equation));

	// console.log('poseEquation - equation 1: ' + fObj.equation);  
	console.log('poseEquation - equation 1: ' + equation);

	// var equation = convertTermsToLatexTerms(fObj.equation); // <----  COMMENTED OUT 9/5-2017
	var equation = convertTermsToLatexTerms(equation);		   // <----  ADDED 9/5-2017
	console.log('poseEquation - equation 2: ' + JSON.stringify(equation));

	// equation = '$$'+equationToLatex(equation)+'$$';	// <----  COMMENTED OUT 9/5-2017
	equation = equationToLatex(equation);				// <----  ADDED 9/5-2017
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
	// var operatorLookup = {'*':'Multiplicer', '/':'Divider', '+':'Adder', '-':'Subtraher'}; // COMMENTED OUT 26/6-2017, DUE TO FEEDBACK FROM SLK.
	var operatorLookup = {'*':'Gang', '/':'Divider', '+':'Plus', '-':'Minus'};  // ADDED 26/6-2017, DUE TO FEEDBACK FROM SLK.
	var latexLookup = {'*': '\\cdot', '/': '/', '+': '+', '-': '-'}
	var HTML = '';
	for (var m in operatorArr) {
		// HTML += '<div class="operatorGroup">';
		// for (var n in termArr) {
		// 	HTML += '<div class="operator btn btn-info" data-operator='+operatorArr[m]+' data-term='+termArr[n]+'>'+operatorLookup[operatorArr[m]]+' med '+((jq.fObj_translate.hasOwnProperty(termArr[n]))? '\\('+jq.fObj_translate[termArr[n]].sym+'\\)' : termArr[n])+'</div>';
		// }
		// HTML += '</div>';

		HTML += '<div class="operatorGroup">';
		// HTML += '<h4 class="subHeader">'+operatorLookup[operatorArr[m]]+' med:' + '</h4>';   			// COMMENTED OUT 26/6-2017, DUE TO FEEDBACK FROM SLK.
		HTML += '<h4 class="subHeader">'+operatorLookup[operatorArr[m]]+' på begge sider med:' + '</h4>';	// ADDED 26/6-2017, DUE TO FEEDBACK FROM SLK.
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

	reducableFormula = sc.removeOnesAndZeros(reducableFormula);
	console.log('performOperation - reducableFormula 2: ' + reducableFormula);

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


// IMPORTANT:
// The solution is generated from in the solverClass by a call to sc.isolateTarget( equation ).memObj
function generateSolution(solveFromTheBeginning) {
	console.log('\ngenerateSolution - CALLED');

	var jq = jsonData.qObj[memObj.currentQuestionNo];
	console.log('generateSolution - jq: ' + JSON.stringify(jq));

	var equation = jq.equation;
	console.log('generateSolution - equation: ' + equation);

	var target = jq.fObj_translate.target;
	var reducingTerm, count = 0, leftSide, rightSide, nominator, denominator, eqSideStr = '', pos_calc, pos, len;

	// var operatorLookup = {'*':'Multiplicer', '/':'Divider', '+':'Adder', '-':'Subtraher'}; // COMMENTED OUT 26/6-2017, DUE TO FEEDBACK FROM SLK.
	var operatorLookup = {'*':'Gang', '/':'Divider', '+':'Plus', '-':'Minus'};  // ADDED 26/6-2017, DUE TO FEEDBACK FROM SLK.
	var reduceLookup = {'*':'Forkort', '/':'Forkort', '+':'Reducer', '-':'Reducer'};
	var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};

	var solveGuide = '<h1>Løsningsforslag</h1>';

	var sc = Object.create(solverClass);
	// window.fObj = make_fObj(0);
	// console.log('generateSolution - x - fObj: ' + JSON.stringify(fObj));

	// The following two lines makes generateSolution give  
	sc.fObj = {target: target};
	if (solveFromTheBeginning) {
		console.log('generateSolution - B0');
	} else {
		console.log('generateSolution - B1');
		console.log('generateSolution - fObj: ' + JSON.stringify( fObj ));
		equation = fObj.equation;  // This solves the equation from where current the state of the equation - e.g. the studen has altered the equation by performing operations.
	}
	sc.isolateTarget(equation);

	if (solveFromTheBeginning) {
		solveGuide += 'Udgangspunktet for opgaven er isolere ' + ((jq.fObj_translate[target].hasOwnProperty('word'))? jq.fObj_translate[target].word.toLowerCase() : '') + ' \\('+jq.fObj_translate[target].sym+'\\)' + ' i udtrykket: <br><br>';
		solveGuide += '$$'+equationToLatex(convertTermsToLatexTerms( equation ))+'$$'; //  + '<br><br>';
		solveGuide += 'En mulig løsning er: <br><br>';
	} else {
		solveGuide += 'Efter din forløbige omskrivning af ligningen, ser ligningen nu således ud:';
		solveGuide += '$$'+equationToLatex(convertTermsToLatexTerms( equation ))+'$$';
		solveGuide += '- hvor opgaven var at isolere ' + ((jq.fObj_translate[target].hasOwnProperty('word'))? jq.fObj_translate[target].word.toLowerCase() : '') + ' \\('+jq.fObj_translate[target].sym+'\\).' + '<br><br>';
		solveGuide += 'En mulig løsning herfra er: <br><br>';
	}
	// solveGuide += '$$'+equationToLatex( equation )+'$$' + '<br><br>';
	// solveGuide += '$$'+convertTermsToLatexTerms( equation )+'$$' + '<br><br>';
	

	

	for (var n = 0; n < sc.memObj.stepVars.length; n++) {  // reducingTerm

		eqSideStr = '';

		reducingTerm = sc.memObj.stepVars[n].reducingTerm;
		console.log('generateSolution - reducingTerm: ' + reducingTerm);

		inverseOperator = sc.memObj.stepVars[n].inverseOperator;
		console.log('generateSolution - inverseOperator: ' + inverseOperator);

		console.log('generateSolution - n: ' + n + ', formula: ' + sc.memObj.stepVars[n].formula + ', inverseOperator: ' + inverseOperator + ', reducingTerm: ' + reducingTerm);

		++count;
		// solveGuide += '('+count+') '+ operatorLookup[inverseOperator] + ' med ' + (((typeof(jq.fObj_translate[reducingTerm])!=='undefined') && (jq.fObj_translate[reducingTerm].hasOwnProperty('word')))? jq.fObj_translate[reducingTerm].word.toLowerCase() : '') + ' \\('+((typeof(jq.fObj_translate[reducingTerm])!=='undefined')? jq.fObj_translate[reducingTerm].sym : poseEquation(reducingTerm))+'\\) på begge sider af lighedsteget: <br><br>'; // COMMENTED OUT 26/6-2017, DUE TO FEEDBACK FROM SLK.
		solveGuide += '('+count+') '+ operatorLookup[inverseOperator] + ' med ' + ' \\('+((typeof(jq.fObj_translate[reducingTerm])!=='undefined')? jq.fObj_translate[reducingTerm].sym : poseEquation(reducingTerm))+'\\) på begge sider af lighedsteget: <br><br>';  // ADDED 26/6-2017, DUE TO FEEDBACK FROM SLK.
		solveGuide += '$$'+equationToLatex(convertTermsToLatexTerms( sc.memObj.stepVars[n].reducableFormula ))+'$$'; //  + '<br><br>';

		console.log('generateSolution - reducedFormula: ' + sc.memObj.stepVars[n].reducedFormula);

		// leftSide = sc.memObj.stepVars[n].reducedFormula.split('=')[0];
		// rightSide = sc.memObj.stepVars[n].reducedFormula.split('=')[1];

		// len = reducingTerm.length+1;

		// // LEFT SIDE
		// pos_calc = leftSide.lastIndexOf(inversOpsLookup[inverseOperator]+reducingTerm);
		// console.log('generateSolution - pos_calc: ' + pos_calc + ', leftSide.length - (reducingTerm.length + 1): ' + String(leftSide.length - (reducingTerm.length + 1)));
		// if ((pos_calc!==-1) && (leftSide.length - (reducingTerm.length + 1) == pos_calc)) {
		// 	console.log('generateSolution - A0');

		// 	eqSideStr += 'venstre side ';
		// }

		// // RIGHT SIDE
		// pos_calc = rightSide.lastIndexOf(inversOpsLookup[inverseOperator]+reducingTerm);
		// console.log('generateSolution - pos_calc: ' + pos_calc + ', rightSide.length - (reducingTerm.length + 1): ' + String(rightSide.length - (reducingTerm.length + 1)));
		// if ((pos_calc!==-1) && (rightSide.length - (reducingTerm.length + 1) == pos_calc)) {
		// 	console.log('generateSolution - A1');

		// 	eqSideStr += 'højre side ';
		// }
		// console.log('generateSolution - eqSideStr: _' + eqSideStr + '_');

		// eqSideStr = (eqSideStr=='venstre side højre side ')? 'begge sider ' : eqSideStr;

		// ++count; 
		// solveGuide += '('+count+') '+ reduceLookup[inverseOperator] + ' med ' + ((jq.fObj_translate[reducingTerm].hasOwnProperty('word'))? jq.fObj_translate[reducingTerm].word.toLowerCase() : '') + ' "'+jq.fObj_translate[reducingTerm].sym+ '" på ' + eqSideStr + ' af lighedsteget. <br><br>';
		// solveGuide += sc.memObj.stepVars[n].reducedFormula + '<br><br>';

		++count; 
		// solveGuide += '('+count+') '+ reduceLookup[inverseOperator] + ' med ' + (((typeof(jq.fObj_translate[reducingTerm])!=='undefined') && (jq.fObj_translate[reducingTerm].hasOwnProperty('word')))? jq.fObj_translate[reducingTerm].word.toLowerCase() : '') + ' \\('+((typeof(jq.fObj_translate[reducingTerm])!=='undefined')? jq.fObj_translate[reducingTerm].sym : poseEquation(reducingTerm))+ '\\): <br><br>';  // COMMENTED OUT 26/6-2017, DUE TO FEEDBACK FROM SLK.
		solveGuide += '('+count+') '+ reduceLookup[inverseOperator] + ' med ' + ' \\('+((typeof(jq.fObj_translate[reducingTerm])!=='undefined')? jq.fObj_translate[reducingTerm].sym : poseEquation(reducingTerm))+ '\\): <br><br>';  // ADDED 26/6-2017, DUE TO FEEDBACK FROM SLK.
		solveGuide += '$$'+equationToLatex(convertTermsToLatexTerms( sc.memObj.stepVars[n].reducedFormula ))+'$$'; // + '<br><br>';
	}

	solveGuide += ((jq.fObj_translate[target].hasOwnProperty('word'))? jq.fObj_translate[target].word : '') + ' \\('+jq.fObj_translate[target].sym+'\\) er nu isoleret.';

	console.log('generateSolution - solveGuide: ' + solveGuide);

	
	// $('#helpContainer_hidden').html(solveGuide);  // Add the equation to the hidden container
	// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#helpContainer_hidden')[0]]);
	// MathJax.Hub.Queue(function (){
	// 	UserMsgBox('body', $('#helpContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
	// });

	
	return {solveGuide: solveGuide, noOfStepsToCompletion: sc.memObj.stepVars.length};
}



function setEventListeners() {

	$( document ).on('click', "body", function(event){
		console.log('body - CLICKED');

		if (memObj.hasCurrentQuestionBeenAnswered) {
			console.log('body - CLICKED - A0');

			$('.microhint').remove();
			$('#next').trigger('click');
		}
	});


	$( document ).on('click', "#next", function(event){ 
		console.log('#next - CLICKED');

		

			if (memObj.hasCurrentQuestionBeenAnswered) {
				console.log('#next - CLICKED - A0');

				
				// setTimeout(function(){

					$('.microhint').remove();

					// giveQuestion();
					++memObj.currentQuestionNo;
					giveQuestion();

					memObj.hasCurrentQuestionBeenAnswered = false; 

				// }, 10000);



				// Dynamisk genereret LaTex:
				// =========================
		  //       microhint($("#equationContainer"), poseQuestion(), "red");   // #micro_hint
		  //       MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.microhint')[0]]);

		  //       MathJax.Hub.Queue(function () {
				// 	console.log('mathJaxQueue - MJXc-display: ' + $('.MJXc-display').length);
				// });


				// mathJaxEquationAjuster('#equationContainer');
			} 
			else {
				if (typeof(nextBtnHintCount) === 'undefined') {
					window.nextBtnHintCount = 0;
				}
				if (nextBtnHintCount == 0) {
					microhint($('#next'), "Opgaven er ikke løst endnu, så du kan ikke gå til næste opgave.", true, "#000");
				}
				if (nextBtnHintCount >= 1) {

					if ($('.reduceBtn').length > 0) { 
						microhint($('#next'), "Opgaven er ikke løst endnu, så du kan ikke gå til næste opgave. <br> For at simplificere udtrykket, skal du forkorte det.", true, "#000");
					} else {
						microhint($(this), 'Tryk på "Se løsningsforslag" hvis du ønsker hjælp til lødningen! <br><br> <span id="help_now" class="btn btn-info">Se løsningsforslag</span> ', true,"#000");
					}
				}

				++nextBtnHintCount;
			}

		
	});

	$( document ).on('click', ".operator", function(event){ 

		$('.microhint').remove();

		console.log('\n======================================  CLICK: .operator  ==========================================\n ');

		var dataOperator = $(this).attr('data-operator');
		console.log('setEventListeners - operator - dataOperator: ' + dataOperator);

		var dataTerm = $(this).attr('data-term');
		console.log('setEventListeners - operator - dataTerm: ' + dataTerm);

		var equation = fObj.equation;
		console.log('setEventListeners - operator - equation: ' + equation);

		fObj.equation_old = equation;   // Added 27/4-2017
		fObj.equation = performOperation(equation, dataOperator, dataTerm);
		console.log('setEventListeners - operator - fObj.equation: ' + fObj.equation);
		console.log('setEventListeners - operator - fObj: ' + JSON.stringify(fObj));

		var solveObj = generateSolution(false); // <--- solveFromTheBeginning = "false" generates the answer to the studen with the current equation.
		// console.log('setEventListeners - solveObj.noOfStepsToCompletion: ' + solveObj.noOfStepsToCompletion + ', this.fObj.noOfStepsToCompletion: ' + this.fObj.noOfStepsToCompletion);
		console.log('setEventListeners - solveObj.noOfStepsToCompletion: ' + solveObj.noOfStepsToCompletion);
		console.log('setEventListeners - fObj.noOfStepsToCompletion: ' + fObj.noOfStepsToCompletion);
		

		// $('#equationContainer_hidden').html('$$'+poseEquation(fObj.equation)+'$$');  // Add the equation to the hidden container

		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);

		// MathJax.Hub.Queue(function (){
		// 	$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
		// });

		// mathJaxEquationAjuster('#equationContainer');

		var redTermStr = suggestReducingTerm(fObj.equation);
		if (redTermStr != '') {
			// $('#reduceBtnContainer').html(redTermStr);							// COMMENTED OUT 20/6-2017;
			$('.operator').addClass('operator_inactive').removeClass('operator');
			$('.subHeader').addClass('subHeader_inactive').removeClass('subHeader');


			// ADDED 20/6-2017;
			$('#reduceBtn_hidden').html(redTermStr);  // Add the equation to the hidden container
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#reduceBtn_hidden')[0]]);	
			MathJax.Hub.Queue(function (){
				$('#reduceBtnContainer').html($('#reduceBtn_hidden').html());  // Copy the equation from the hidden container to the visible container.
			});

		} 

		// ELSE-CLAUSE UDKOMMENTERET d. 26/6 efter SLK har konstateret at hints ikke er konsekvente:
		// else {


		// 	if (solveObj.noOfStepsToCompletion - fObj.noOfStepsToCompletion == jsonData.distanceBeforeHelp) {

	 //   			// DENNE MICROHINT-TEST VIRKER IKKE - DENNE STANDARD METODE FEJLER (CONSOL ERROR)
	 //   			// $('#microhint_hidden').html('$$'+equationToLatex(convertTermsToLatexTerms( 'E=m*c^2' ))+'$$');  // Add the equation to the hidden container
		// 		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#microhint_hidden')[0]]);
		// 		// MathJax.Hub.Queue(function (){
		// 		// 	microhint($(this), $('#microhint_hidden').html(), true,"red");
		// 		// 	// UserMsgBox('body', $('#microhint_hidden').html());    // <--- VIRKER FINT MED USERMSGBOX!
		// 		// 	// microhint($(this), "Dette er en test!", true,"red");  // <--- VIRKER IKKE!
		// 		// });


		// 		// DENNE MICROHINT-TEST VIRKER
		// 		// microhint($(this), "Denne teste virker fint ;-)", true,"red");  // <--- VIRKER HELT FINT!


		// 		// DENNE MICROHINT-TEST MED TIMER VIRKER IKKE - CONSOL ERROR
		// 		// $('#microhint_hidden').html('$$'+equationToLatex(convertTermsToLatexTerms( 'E=m*c^2' ))+'$$');  // Add the equation to the hidden container
		// 		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#microhint_hidden')[0]]);
		// 		// MathJax.Hub.Queue(function (){
		// 		// 	setTimeout(function(){
		// 		// 		microhint($(this), $('#microhint_hidden').html(), true,"red");
		// 		// 	}, 1000);
		// 		// });


		// 		// microhint($(this), '$$'+equationToLatex(convertTermsToLatexTerms( 'E=m*c^2' ))+'$$', true,"red");  // <---- DENNE MICROHINT-TEST VIRKER IKKE - PILEN I MICROHINTET ER IKKE SYNLIG!
		// 		microhint($(this), 'Du har ved denne operation forlænget vejen til en løsning!', true, "#000");
		// 		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.microhint')[0]]);
		// 	}

		// 	if (solveObj.noOfStepsToCompletion - fObj.noOfStepsToCompletion == jsonData.distanceBeforeHelp+1) {
		// 		microhint($(this), 'Du har nu yderligere forlænget vejen til en løsning!', true,"#000");
		// 	}

		// 	if (solveObj.noOfStepsToCompletion - fObj.noOfStepsToCompletion >= jsonData.distanceBeforeHelp+2) {
		// 		microhint($(this), 'Tryk på "Se løsningsforslag" hvis du ønsker hjælp til lødningen! <br><br> <span id="help_now" class="btn btn-info">Se løsningsforslag</span> ', true,"#000");
		// 	}
		
		// }

		msg_goToNextEquation_or_finish(fObj.equation);

		$('#equationContainer_hidden').html('$$'+poseEquation(fObj.equation)+'$$');  // Add the equation to the hidden container

		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);				// COMMENTED OUT 20/6-2017
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#equationContainer_hidden')[0]]);	// ADDED 20/6-2017

		MathJax.Hub.Queue(function (){
			$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
			$( "#equationContainer" ).hide();				// ADDED 23/6-2017
			mathJaxEquationAjuster('#equationContainer');
			$( "#equationContainer" ).fadeIn( "slow" );    // ADDED 23/6-2017
			// verticalPositionAjust('#columnContainer', '#equationContainer', 50);
		});

		
	});

	$( document ).on('click', ".reduceBtn", function(event){
		// performStrikeThrough(equationSide, inverseOperator, reducingTerm);  // <----- 5/4-2017

		$('.reduceBtn').addClass('reduceBtn_inactive').removeClass('reduceBtn');  // ADDED 20/6-2016

		// var formulaArr = fObj.equation_old.replace(/ /g,'').split('=');
		var formulaArr = fObj.equation.replace(/ /g,'').split('=');
		console.log('.reduceBtn - fObj.equation_old: ' + fObj.equation_old + ', formulaArr: ' + formulaArr);
		// var eq_left = performStrikeThrough(formulaArr[0], fObj.suggestedinverseOperator, fObj.suggestedReducingTerm);              	// COMMENTED OUT 15/6-2107
		// var eq_right = performStrikeThrough(formulaArr[1], fObj.suggestedinverseOperator, fObj.suggestedReducingTerm); 				// COMMENTED OUT 15/6-2107
		var eq_left = performStrikeThrough_onlyMultAndDiv(formulaArr[0], fObj.suggestedinverseOperator, fObj.suggestedReducingTerm);  	// ADDED 15/6-2107
		var eq_right = performStrikeThrough_onlyMultAndDiv(formulaArr[1], fObj.suggestedinverseOperator, fObj.suggestedReducingTerm); 	// ADDED 15/6-2107
		console.log('.reduceBtn - eq_left: ' + eq_left + ', eq_right: ' + eq_right);

		fObj.equation_strikeThrough = eq_left+'='+eq_right;
		console.log('.reduceBtn - fObj 1: ' + JSON.stringify(fObj));

		// fObj.equation = '\\require{cancel} ' + fObj.equation;  // IMPORTANT: This configures MathJax to treat \cancel{} as a function.
		// console.log('.reduceBtn - fObj.equation 2: ' + JSON.stringify(fObj.equation));

// // fObj.equation = '\\require{cancel} \\frac{Q}{C} = \\frac{ \\cancel{C} \\cdot m \\cdot \\Delta{T} }{\\cancel{C}}';  // TEST!
// fObj.equation = '\\require{cancel} 1 = \\frac{ \\cancel{C} }{\\cancel{C}}';  // TEST!
// fObj.equation = ' 1 \= \\frac{C}{C}';

		// console.log('.reduceBtn - test 1 - fObj.equation_strikeThrough: ' + fObj.equation_strikeThrough);
		// console.log('.reduceBtn - test 2 - (poseEquation(fObj.equation_strikeThrough)): ' + poseEquation(fObj.equation_strikeThrough));
		// console.log('.reduceBtn - test 3 - replaceStrikeThroughDelimiter(poseEquation(fObj.equation_strikeThrough)): ' + replaceStrikeThroughDelimiter(poseEquation(fObj.equation_strikeThrough)));
		// console.log('.reduceBtn - test 5 - replaceStrikeThroughDelimiter_2( fObj.equation_strikeThrough): ' + replaceStrikeThroughDelimiter_2( fObj.equation_strikeThrough));
		// console.log('.reduceBtn - test 6 - poseEquation( replaceStrikeThroughDelimiter_2( fObj.equation_strikeThrough)): ' + poseEquation( replaceStrikeThroughDelimiter_2( fObj.equation_strikeThrough)));
		// console.log('.reduceBtn - test 7 - replaceStrikeThroughDelimiter_2( poseEquation( fObj.equation_strikeThrough)): ' + replaceStrikeThroughDelimiter_2( poseEquation( fObj.equation_strikeThrough)));

		// var eq =  '$$ \\require{cancel} '+replaceStrikeThroughDelimiter(poseEquation(fObj.equation_strikeThrough))+'$$';  // <-----  IMPORTANT: This configures MathJax to treat \cancel{} as a function.  COMMENTED OUT 14/6-2017
		var eq =  '$$ \\require{cancel} '+replaceStrikeThroughDelimiter_2( poseEquation( fObj.equation_strikeThrough))+'$$';  // <-----  IMPORTANT: This configures MathJax to treat \cancel{} as a function. ADDED 14/8-2017
		console.log('.reduceBtn - eq: ' + eq);

		$('#equationContainer_hidden').html(eq);  // Add the equation to the hidden container

// $('#equationContainer').css('font-size', '200%');  // <----- VIRKER IKKE!
// $('#equationContainer').addClass('fontSize250');  // <----- VIRKER IKKE!
// $('#equationContainer .MJXc-display').css('font-size', '200%');  // <----- VIRKER IKKE!

		// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);			    // COMMENTED OUT 22/6-2017
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#equationContainer_hidden')[0]]);	// ADDED 22/6-2017

		MathJax.Hub.Queue(function (){
			$('#equationContainer').html($('#equationContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
			$( "#equationContainer" ).hide();				// ADDED 23/6-2017
			$( "#equationContainer" ).fadeIn( "slow" );    // ADDED 23/6-2017
			bugfix_strikeThrough();


			// mathJaxEquationAjuster('#equationContainer');

			// sc.reduceTargetSide_2('a+b/(a+d)', '-', 'a')
			// console.log('.reduceBtn - reduceTargetSide_3: ' + sc.reduceTargetSide_3(fObj.equation_old, fObj.suggestedinverseOperator, fObj.suggestedReducingTerm));
			
			// console.log('.reduceBtn - reduceEquation: ' + reduceEquation(fObj.equation_old, fObj.suggestedinverseOperator, fObj.suggestedReducingTerm));    // <----- FEJL 19/5-2017: 

			fObj.equation = reduceEquation(fObj.equation, fObj.suggestedinverseOperator, fObj.suggestedReducingTerm);    // Added 22/5-2017
			console.log('.reduceBtn - fObj.equation: ' + fObj.equation);    // Added 22/5-2017

			setTimeout(function(){
				$('#equationContainer_hidden').html('$$'+ poseEquation(fObj.equation) + '$$');  // Add the equation to the hidden container
				
				// MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#interface')[0]]);				// COMMENTED OUT 22/6-2017
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#equationContainer_hidden')[0]]);	// ADDED 22/6-2017

				MathJax.Hub.Queue(function (){
					$('#equationContainer').html($('#equationContainer_hidden').html()); 
					$( "#equationContainer" ).hide();				// ADDED 23/6-2017
					$( "#equationContainer" ).fadeIn( "slow" );    // ADDED 23/6-2017

					$('.operator_inactive').addClass('operator').removeClass('operator_inactive');
					$('.subHeader_inactive').addClass('subHeader').removeClass('subHeader_inactive');
					$('#reduceBtnContainer').html('');

					msg_goToNextEquation_or_finish(fObj.equation);

					$('.reduceBtn_inactive').addClass('reduceBtn').removeClass('reduceBtn_inactive');  // ADDED 20/6-2016
				});
			}, 1500);
		});

	});

	$( document ).on('click', ".microhint", function(event){
		$('.microhint').remove();
	});

	$( document ).on('click', "#equationContainer", function(event){

		// if ($('.microhint').length > 0){
		// 	$('.microhint').remove();
		// } else {
	        
		// 	// Dynamisk genereret LaTex:
		// 	// =========================
	 //        microhint($(this), poseQuestion(), "red");   // #micro_hint
	 //        MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('.microhint')[0]]);

	 //        // Pre-formateret LaTex fra hidden field:
		// 	// ======================================
	 //        // microhint($(this), String($('#micro_hint').html()), "red");
	 //    }

        console.log("microhint - CALLED");
    });


    $( document ).on('click', "#help_complete", function(event){

		var solveObj = generateSolution(true);

		$('#helpContainer_hidden').html(solveObj.solveGuide);  // Add the equation to the hidden container

		MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#helpContainer_hidden')[0]]);

		MathJax.Hub.Queue(function (){
			UserMsgBox('body', $('#helpContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
		});
	});


	$( document ).on('click', "#help_now", function(event){

		var solveObj = generateSolution(false);

		$('#helpContainer_hidden').html(solveObj.solveGuide);  // Add the equation to the hidden container

		MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#helpContainer_hidden')[0]]);

		MathJax.Hub.Queue(function (){
			UserMsgBox('body', $('#helpContainer_hidden').html());  // Copy the equation from the hidden container to the visible container.
		});
	});


	$(document).on('click', ".MsgBox_reload", function(event) {
		location.reload(); 
	});


}

function shuffelArray(ItemArray) {
    var NumOfItems = ItemArray.length;
    var NewArray = ItemArray.slice(); // Copy the array... 
    var Item2;
    var TempItem1;
    var TempItem2;
    for (var Item1 = 0; Item1 < NumOfItems; Item1++) {
        Item2 = Math.floor(Math.random() * NumOfItems);
        TempItem1 = NewArray[Item1];
        TempItem2 = NewArray[Item2];
        NewArray[Item2] = TempItem1;
        NewArray[Item1] = TempItem2;
    }
    return NewArray;
}
console.log('shuffelArray([0]): ' + shuffelArray([0]));
console.log('shuffelArray([0,1]): ' + shuffelArray([0,1]));

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
		var fontSize, fontSizeMem,  count, ajust = false;
		
		fontSize = parseInt($(equationSelector).css('font-size').replace('px', ''));
		fontSizeMem = fontSize;
		console.log('mathJaxEquationAjuster - A0 - fontSize: ' + fontSize + ', fontEquationSize: ' + fontEquationSize);
		console.log('mathJaxEquationAjuster - MJXc-display: ' + $('.MJXc-display').length + ', mjx-char x: ' + $('.mjx-char').length);  // mjx-char
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
				// $(equationSelector).css({'font-size': String(fontSize-1)+'px', 'position': 'relative', 'top': String(fontSizeMem-fontSize)+'px'});

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
				// $(equationSelector).css({'font-size': String(fontSize-1)+'px', 'position': 'relative', 'top': String(fontSize - fontSizeMem)+'px'});

				parentWidth = $(equationSelector).width(); // The width of #equationContainer
				childWidth = $(equationSelector + '> .MJXc-display > span').width();
				console.log('mathJaxEquationAjuster - parentWidth: ' + parentWidth + ', childWidth: ' + childWidth);

				++count;
			}
		}
	});
}

// percentage is the percentage-position of the midpoint of the child relative to the parent. 
// E.g. percentage = 50 will ajust the midpoint of the child at the center of the parent.
function verticalPositionAjust(parentSelector, childSelector, percentage) {
	var heightParent = $(parentSelector).height();
	var posChild = $(childSelector).position();
	var heightChild = $(childSelector).height();
	console.log('verticalPositionAjust - heightParent: ' + JSON.stringify(heightParent) + ', posChild: ' + JSON.stringify(posChild) + ', heightChild: ' + JSON.stringify(heightChild));
	// var calc = heightChild/heightParent;
}


$(window).resize(function() {
	// $('#leftColumn').attr('class', ((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered'));
	// $('#btnContainer').attr('class', ((bootstrapcolObj[bootstrapBreakpointSize] < bootstrapcolObj['md'])? 'centered' : 'not-centered'));

	autoLeftSpacer();

	mathJaxEquationAjuster('#equationContainer');
});

$(document).ready(function() {

	jsonData.qObj = shuffelArray(jsonData.qObj);  // <--- Randomize the quiz questions.

	initQuiz();
	autoLeftSpacer();

	MathJax.Hub.Queue(function () {
		console.log('mathJaxEquationAjuster - MJXc-display: ' + $('.MJXc-display').length + ', mjx-char: ' + $('#equationContainer .mjx-char').length);  // mjx-char
	});


	//========================
	// 		INIT SOLVER:
	//========================
	var sc = Object.create(solverClass);
	var jq = jsonData.qObj[memObj.currentQuestionNo];
	if (jq.fObj_translate.hasOwnProperty('target')){
		sc.fObj.target = jq.fObj_translate.target;
		console.log('document.ready - sc.fObj: ' + JSON.stringify(sc.fObj));
	} 

	// microhint('#equationContainer', "TEST HINT", "red");


	// generateSolution(true);


});





