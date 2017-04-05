
////////////////////////////////////////////////////////////////////
// 
//   ATO ---> http://dragonbox.com/
// 
////////////////////////////////////////////////////////////////////



//###########################################################################
//
//				Notes concerning the use of MathJax
//
//###########################################################################
//
// IMPORTANT: 
// The TeX-MML-AM_CHTML configuration is one of the most general (and thus largest) combined configuration files. If this loads too slowly, we will spend time optimizing the configuartion:
// http://docs.mathjax.org/en/latest/start.html#mathjax-cdn
// 
// The location of the included MathJax Javascript is in the head-tag, and not the body-tag. In this e-learning object we will try out the body-tag (just "business as usual"...)
// http://docs.mathjax.org/en/latest/start.html#mathjax-cdn
//
// Dynamic load of MathJax:
// http://stackoverflow.com/questions/38751145/rendering-mathjax-updated-with-html
//
// MathJax Example Pages:
// https://cdn.mathjax.org/mathjax/latest/test/examples.html
//
// MathJax API:
// http://docs.mathjax.org/en/latest/api/variable.html
//
// JavaScript libraries:
// http://algebra.js.org/
// 
// VIGTIGT: AsciiMath pluginet ser ud til at virke i Chrome også (på trods af rød note på siden - virker det i IE?). Det kan være en mulighed (dog ikke understøttelse af strike-through tegn mv). 
// Det er heller ikke sikkert at man dynamisk kan kalde AsciiMath på en klasse eller id - det rendere kun når siden loader. Se nedenstående inderaktive demo:
// http://asciimath.org/
// 
// IMPORTANT (1): MathJax: Event when typesetting is done? Rescaling after rendering...
// https://github.com/mathjax/mathjax-docs/wiki/Event-when-typesetting-is-done%3F-Rescaling-after-rendering...
// 
// IMPORTANT (2): (link from (1) above) - MathJax: signal example page:
// http://cdn.mathjax.org/mathjax/latest/test/sample-signals.html


///////////////////////////////////////////////////////////////////////////// 
//
// asciiMath:
// http://asciimath.org/
// 


// solverClass = {
  

	var fObj = {target: 'x', a: '13[J*s]'};   // Defines the variable (her "x")the program will try to isolate, and physical tanslations of known constants/entities like a = 13[J*s]


	var memObj = {
					fObj: fObj,
					stepVars: [], 
					knownFunctions: ['asin','sin','acos','cos','atan','tan'] // <----- IMPORTANT: the inverse operator "axxx" has to be BEFORE the corresponding operator "xxx". 
				};


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


	function outerParenthesisBound(formula){
		var fArr = formula.split("");
		// console.log('outerParenthesisBound - fArr: ' + JSON.stringify(fArr));
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
			alert('Parentes fejl: antallet af start- og slut-parenteser stemmer ikke!');
		}

		return pArr;
	}
	console.log('outerParenthesisBound("a*b+c"): ' + JSON.stringify( outerParenthesisBound('a*b+c')) );
	console.log('outerParenthesisBound("(...)"): ' + JSON.stringify( outerParenthesisBound('(...)')) );
	console.log('outerParenthesisBound("(...)(...)"): ' + JSON.stringify( outerParenthesisBound('(...)(...)')) );
	console.log('outerParenthesisBound("((...))"): ' + JSON.stringify( outerParenthesisBound('((...))')) );
	console.log('outerParenthesisBound("((...)(...))"): ' + JSON.stringify( outerParenthesisBound('((...)(...))')) );
	console.log('outerParenthesisBound("((...)((...)))"): ' + JSON.stringify( outerParenthesisBound('((...)((...)))')) );
	console.log('outerParenthesisBound("((...)((...)))(...)"): ' + JSON.stringify( outerParenthesisBound('((...)((...)))(...)')) );




	// function labelOperators(formula){
	// 	var ops = ['*','/','+','-'];
	// 	var formulaStr = '';
	// 	for (var i in ops) {
	// 		// formula.replace(new RegExp(ops[i], 'g'), '#'+ops[i]+':(#)#');
	// 		var formulaParts = formula.split(ops[i]);
	// 		console.log('labelOperators - formulaParts: ' + formulaParts);
	// 		for (var j in formulaParts) {
	// 			formulaStr += formulaParts[i]+((j+1 < formulaParts.length)? '#'+ops[i]+':'+j+'#' : '');
	// 			console.log('labelOperators - ops['+i+']: ' + ops[i] + ', formulaStr: ' + formulaStr);
	// 		};
	// 	};
	// 	console.log('labelOperators - formulaStr: ' + formulaStr);
	// }
	// labelOperators('1/(3*(1 + ax/b)) + c = k');


	function create_iObj(formula){
		var fArr = formula.split("");
		var iObj = [];
		for (var n in fArr) {
			iObj.push({index:n, val:fArr[n]});
			
			if (fArr[n] == fObj.target) {  // This finds the position of fObj.target and stores it:
				fObj.index = n;
			}
		}
		// console.log('create_iObj - iObj: ' + JSON.stringify(iObj));

		return iObj;
	}
	console.log('create_iObj - iObj: ' + JSON.stringify(create_iObj('1/(3*(1 + ax/b)) + c = k')));


	function removeParenthesis_formula(formula, pArr){
		var parenthesis; 
		var formula_mod = formula;
		for (var n in pArr) {
			parenthesis = formula.substring(pArr[n].left, pArr[n].right+1);
			formula_mod = formula_mod.replace(parenthesis, '');
			console.log('removeParenthesis_formula - n: '+n+', formula_mod: ' + formula_mod);
		}

		return formula_mod;
	}


	function returnParenthesisObj_formula(formula, pArr, reducingTerm){
		var parenthesis; 
		var formula_mod = formula;
		var formula_mod_mem;
		var parenthesisArr_mem = [];
		var parenthesisArr = [];
		for (var n in pArr) {
			parenthesis = formula.substring(pArr[n].left, pArr[n].right+1);

			formula_mod_mem = formula_mod;
			parenthesisArr_mem = parenthesisArr;

			if (formula_mod_mem.indexOf(reducingTerm)!==-1) {  // Roll-back if eg (-2)/b-x = k, reducingTerm = (-2)/b, then (-2) will be removed - which is an error!
				console.log('returnParenthesisObj_formula - A1'); 
			}

			if (parenthesis != reducingTerm) {  // This condition does NOT remove the reducingTerm if it is a parenthesis.
				console.log('returnParenthesisObj_formula - A2'); 
				formula_mod = formula_mod.replace(parenthesis, '#'+n+'#');
				parenthesisArr.push(parenthesis);
			}

			if (formula_mod.indexOf(reducingTerm)===-1) {  // Roll-back if eg (-2)/b-x = k, reducingTerm = (-2)/b, then (-2) will be removed (will become: #0#/b-x = k) - which is an error!
				console.log('returnParenthesisObj_formula - A3'); 
				formula_mod = formula_mod_mem;
				parenthesisArr = parenthesisArr_mem;
			}


			console.log('returnParenthesisObj_formula - n: ' + n + ', parenthesis: ' + parenthesis + ' , formula_mod: ' + formula_mod + ' , parenthesisArr: ' + JSON.stringify(parenthesisArr) );
		}

		return {formula_mod: formula_mod, parenthesisArr: parenthesisArr};
	}



	function removeParenthesis_iObj(iObj, pArr){
		var TiObj = iObj.slice();
		var iObj_mod = [];
		// for (var n in pArr) {
		// 	for (var m in iObj) {
		// 		if ((pArr[n].left <= iObj[m].index) && (iObj[m].index <= pArr[n].right)) {
		// 			iObj.splice(m, 1);
		// 		}
		// 	}
		// }

		for (var i = pArr.length - 1; i >= 0; i--) {  // The key is to work our way backwards in pArr in order not to destroy the sequence/order in iObj:
			TiObj.splice(pArr[i].left, pArr[i].right - pArr[i].left + 1);
			console.log('removeParenthesis_iObj - i: '+i+', TiObj: ' + JSON.stringify(TiObj));
		};

		return TiObj;
	}


	function removeNumAndCharsAndOperators_iObj(iObj){
		var TiObj = iObj.slice();
		for (var i = iObj.length - 1; i >= 0; i--) { 
			if ('1234567890.,abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ_[]'.indexOf(iObj[i].val)!==-1) {
				TiObj.splice(i, 1);
			}
		}
		console.log('removeNumAndCharsAndOperators_iObj - TiObj: ' + JSON.stringify(TiObj)); 

		return TiObj;
	}


	// This function decides which operator (the inverse operator), and therefore which constant/therm, that need to be added/subtracted/multiplied/devided on each side.
	function reduceOperators(iObj_ops){  
		var iObj_ops_red = iObj_ops.slice();
		var selected_op;
		var opsStr = '';
		for (var n in iObj_ops) {
			opsStr += iObj_ops[n].val;
		}
		console.log('reduceOperators - opsStr 1: ' + opsStr + ', iObj_ops: ' + JSON.stringify(iObj_ops));

		// If '+' OR '-' operator are present:  ----->  delete all '*' and '/' operators
		// ===================================
		if ((opsStr.indexOf('+')!==-1) || (opsStr.indexOf('-')!==-1)){
			for (var i = iObj_ops.length - 1; i >= 0; i--) { 
				if ('*/'.indexOf(iObj_ops[i].val)!==-1) {
					iObj_ops_red.splice(i, 1);
				}
			}
			opsStr = opsStr.replace(/(\*|\/)/g, '');
			console.log('reduceOperators - opsStr 2: ' + opsStr + ', iObj_ops_red: ' + JSON.stringify(iObj_ops_red));

			////////////////////////////////////////////////////////////////////////////////////////////////
			//
			//	Decide HERE, based on the position of fObj.taget, which operator ('+' or '-') to choose". NO: just choose the last operator to keep it simple!
			//
			////////////////////////////////////////////////////////////////////////////////////////////////

			// At this point there will only be '+'- OR '-'-operators left - choose the last operator:
			selected_op = iObj_ops_red[iObj_ops_red.length-1];
			console.log('reduceOperators - selected_op: ' + JSON.stringify(selected_op));

		}

		// If '*' AND '/' operator are present:  ----->  delete all '*' operators, and choose the last '/' operator
		// ====================================
		if ((opsStr.indexOf('*')!==-1) && (opsStr.indexOf('/')!==-1)){
			for (var i = iObj_ops.length - 1; i >= 0; i--) { 
				if ('*'.indexOf(iObj_ops[i].val)!==-1) {
					iObj_ops_red.splice(i, 1);
				}
			}
			opsStr = opsStr.replace(/\*/g, '');
			console.log('reduceOperators - opsStr 2: ' + opsStr + ', iObj_ops_red: ' + JSON.stringify(iObj_ops_red));

			// // At this point there will only be '/'-operators left - choose the last '/'-operator:
			// selected_op = iObj_ops_red[iObj_ops_red.length-1];
			// console.log('reduceOperators - selected_op: ' + JSON.stringify(selected_op));
		}

		// If '*' OR '/' operators are present:  ----->  Select the last operator
		// ====================================
		if ((opsStr.indexOf('*')!==-1) || (opsStr.indexOf('/')!==-1)){
			
			// At this point there will only be '/'- OR '*'-operators left - choose the last operator:
			selected_op = iObj_ops_red[iObj_ops_red.length-1];
			console.log('reduceOperators - selected_op: ' + JSON.stringify(selected_op));
		}


		return selected_op;
	}


	// The purpose of this function is to wrap a parenthesis around all memObj.knownFunctions. The reason for this is that when "sin(x)" is wrapped in a 
	// parenthesis, like so "(sin(x))", then it will be treated like a constant "c" by all the other algorithms in the program. If the function is not wrapped, then
	// "sin" and "(x)" will be treated as two separate entities. 
	function addParenthesisAroundFunctions(targetSide){
		var pArr = outerParenthesisBound(targetSide);
		console.log('addParenthesisAroundFunctions - pArr: ' + JSON.stringify(pArr));
		var f = memObj.knownFunctions;
		var fl, fc, TtargetSide;
		var newTargetSide = '';
		var pos = 0;
		var Pcount = 0;
		
		for (var m in pArr) {
			for (var n in f) {
				fl = f[n].length;
				fc = targetSide.substring(pArr[m].left-fl, parseInt(pArr[m].left));
				console.log('addParenthesisAroundFunctions - fc: ' + fc + ', fl: ' + fl);
				if ((pArr[m].left-fl >= 0) && (targetSide.substring(pArr[m].left-fl, pArr[m].left) == f[n])) {
					console.log('addParenthesisAroundFunctions - A0');
					newTargetSide += targetSide.substring(pos, pArr[m].left-fl) + '(' + targetSide.substring(pArr[m].left-fl, pArr[m].right+1) + ')';
					pos = pArr[m].right+1;
					Pcount += 2;
					break;
				}
			}
			console.log('addParenthesisAroundFunctions - m: ' + m + ', n: ' + n + ', newTargetSide: ' + newTargetSide + ', targetSide: ' + targetSide);
		}
		console.log('addParenthesisAroundFunctions - newTargetSide 1: ' + newTargetSide);

		console.log('addParenthesisAroundFunctions - newTargetSide.length: ' + newTargetSide.length + ', Pcount: ' + Pcount + ', targetSide.length: ' + targetSide.length+ ', pos: ' + pos);
		newTargetSide += (pos < targetSide.length)? targetSide.substring(pos) : '';  // append any missing piece of the equation to newTargetSide
		console.log('addParenthesisAroundFunctions - newTargetSide 2: ' + newTargetSide);

		return newTargetSide;
	}
	console.log('==================  XXX - 0 - XXX  ==================');
	console.log('addParenthesisAroundFunctions("sin(x)+asin(x)+cos(x)+acos(x)+tan(x)+atan(x)+k"): ' + addParenthesisAroundFunctions("sin(x)+asin(x)+cos(x)+acos(x)+tan(x)+atan(x)+k"));
	console.log('==================  XXX - 1 - XXX  ==================');
	console.log('addParenthesisAroundFunctions("(sin(x))+(asin(x))+(cos(x))+k"): ' + addParenthesisAroundFunctions("(sin(x))+(asin(x))+(cos(x))+k")); // Check that eg (sin(x)) is ignored by the algorithm, and does not become ((sin(x))).  

	// 0123456789012345678901234567890123456789012345678901234567890
	// |         |         |         |         |         |         |
	// sin(x)+asin(x)+cos(x)+acos(x)+tan(x)+atan(x)+k
	// (sin(x))+(asin(x))+(cos(x))+(acos(x))+(tan(x))+(atan(x))


	// The purpose of this function is to wrap a parenthesis around a negative term in the following cases:
	// 		CASE 1: where the equation starts with a negative term like so: 
	//
	// 			-a # ... = k, where # is any operator (*/+-)
	//
	// 		CASE 2: or a negative term follows another operator like    // <----------------   CASE 2 will not be made!!!
	//			
	//			... # -a # ... = k, where # is any operator (*/+-)
	//
	// When showing the LaTex/MathJax result of the equation, then the intension is NOT to show the parenthesis. This
	// way the equation will appaear as it originally is - without parenthesis.
	function addParenthesisAroundNegativeTerms(targetSide){
		var formulaArr = targetSide.split("");
		var formulaArrKeys = Object.keys(formulaArr);  // <---- All elements in formulaArrKeys are of type string, due to comparison with (# 6 #).
		console.log('addParenthesisAroundNegativeTerms - typeof(formulaArrKeys[0]): ' + typeof(formulaArrKeys[0]));
		console.log('addParenthesisAroundNegativeTerms - formulaArrKeys: ' + formulaArrKeys);
		var newFormulaArr, pos, posRightParenthesis, newTargetSide_start, newTargetSide;
		var pArr = outerParenthesisBound(targetSide);
		console.log('addParenthesisAroundNegativeTerms - findNextOperator - pArr: ' + JSON.stringify(pArr));
		var pArrSet = helper_makeSetFrom_pArr(pArr);
		console.log('addParenthesisAroundNegativeTerms - pArrSet: ' + pArrSet);
		var pArrLookup = helper_pArr_lookup(pArr);
		var excludedSet = helper_excludedSet(formulaArrKeys, pArrSet);
		console.log('addParenthesisAroundNegativeTerms - excludedSet: ' + excludedSet);
		var excludedSetStr = '_'+excludedSet.join('_')+'_';
		var l = formulaArr.length;
		var opArr = ['*','/','+','-'];
		for (var n = 0; n < l; n++) {

			// CASE 1:
			// =======
			if ((n == 0) && (formulaArr[n] == '-')) {   // If the first value in formulaArr is the subtraction-operator, then...
				console.log('addParenthesisAroundNegativeTerms - A0');
				if ((pArr.length > 0) && (pArr[0].left==1)) {  // If there is a parenthesis after the subtraction-operator, then find the end of the parenthesis:
					console.log('addParenthesisAroundNegativeTerms - A1');
					newTargetSide = '(-'+targetSide.substring(pArr[0].left, pArr[0].right+1)+')'+targetSide.substring(pArr[0].right+1); 
				} else {	// else find the end of the the term after the subtraction-operator:
					console.log('addParenthesisAroundNegativeTerms - A2');
					// var TformulaArr = formulaArr.slice(1, formulaArr.length); 
					for (var i = 1; i < formulaArr.length; i++) {

						pos = '*/+-'.indexOf(formulaArr[i]);   // First: find the type of operator
						if (pos!==-1) {
							pos = formulaArr.indexOf(opArr[pos], 1); // Second: find the position of the operator
							break;
						}
					};
					console.log('addParenthesisAroundNegativeTerms - pos: ' + pos);
					newTargetSide = '(-'+targetSide.substring(1, pos)+')'+targetSide.substring(pos);
				}

				break; // IMPORTANT: This break has to be removed if CASE 2 is to be used!
			} else {   // IMPORTANT: This else-clause has to be removed if CASE 2 is to be used!
				newTargetSide = targetSide;
			}

			console.log('addParenthesisAroundNegativeTerms - newTargetSide: ' + newTargetSide);
			console.log('addParenthesisAroundNegativeTerms - n: ' + n + ', excludedSetStr: ' + excludedSetStr + ', formulaArr['+n+']: ' + formulaArr[n]);

			// CASE 2:
			// =======
			// if ((n < l) && (excludedSetStr.indexOf('_'+String(n)+'_')!==-1) && ('*/+-'.indexOf(formulaArr[n])!==-1) && (formulaArr[n+1] == '-')) {
			// 	console.log('addParenthesisAroundNegativeTerms - A1');

			// 	if (formulaArr[n+2] == '(') {
			// 		posRightParenthesis = pArrLookup[n+2];
			// 		console.log('addParenthesisAroundNegativeTerms - posRightParenthesis: ' + posRightParenthesis);
			// 		// newTargetSide += '('+targetSide.substring(n+1, posRightParenthesis+1)+')'+targetSide.substring(posRightParenthesis+1);
			// 		newTargetSide += '('+newTargetSide.substring(n+1, posRightParenthesis+1)+')'+newTargetSide.substring(posRightParenthesis+1);
			// 		ajust = ajust + 2;
			// 	}
			// }

			console.log('addParenthesisAroundNegativeTerms - newTargetSide 1: ' + newTargetSide);
		}
		console.log('addParenthesisAroundNegativeTerms - newTargetSide 2: ' + newTargetSide);

		return newTargetSide;
	}
	console.log('==================  XXX 0 XXX  ==================');
	console.log('addParenthesisAroundNegativeTerms("-a*x") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-a*x")));
	console.log('==================  XXX 1 XXX  ==================');
	console.log('addParenthesisAroundNegativeTerms("-(a*x)") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-(a*x)")));
	console.log('==================  XXX 2 XXX  ==================');
	console.log('addParenthesisAroundNegativeTerms("-(a*x)+(b*c)-(d*e)") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-(a*x)+-(b*c)*-(d*e)")));
	console.log('==================  XXX 3 XXX  ==================');
	console.log('addParenthesisAroundNegativeTerms("-sin(x)*a") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-sin(x)*a")));


	function helper_pArr_lookup(pArr){
		pArrLookup = {};
		for (var n in pArr) {
			pArrLookup[pArr[n].left] = pArr[n].right;
		}

		return pArrLookup;
	}
	console.log('pArrLookup("[{"left":1,"right":5}, {"left":7,"right":9}]") : ' + JSON.stringify( helper_pArr_lookup( [{"left":1,"right":5}, {"left":7,"right":9}] )));


	function helper_makeSetFrom_pArr(pArr){
		var set = [];
		for (var n in pArr){
			if (typeof(pArr[n] !== 'undefined')){
				for (var i = pArr[n].left; i <= pArr[n].right; i++) {
					set.push(String(i));   // <---- Make sure all elements are of type string, due to comparison with (# 6 #).
				}
			}
		}
		return set;
	}
	console.log('helper_makeSetFrom_pArr("[{"left":1,"right":5}, {"left":7,"right":9}]") : ' + JSON.stringify( helper_makeSetFrom_pArr( [{"left":1,"right":5}, {"left":7,"right":9}] )));


	function helper_excludedSet(set, subSet){
		
		var Tset = set.slice();

		Tset = Tset.filter( function( element ) {
			return subSet.indexOf( element ) < 0;
		} );

		return Tset;
	}
	console.log('helper_excludedSet([0,1,2,3,4,5,6,7,8,9], [2,3,4,7,8]): ' + JSON.stringify(helper_excludedSet([0,1,2,3,4,5,6,7,8,9], [2,3,4,7,8])));


	function removeOuterParenthesis() {

	}


	function findNextOperator(formula) {
		// formula = formula.replace(/ /g, '').replace(/\*/g, '');
		formula = formula.replace(/ /g, '');
		console.log('findNextOperator - formula: ' + formula);

		var formulaArr = formula.split('=');
		// var targetSide = (formulaArr[0].indexOf(fObj.target)!==-1)? formulaArr[0] : formulaArr[1];  // select the side of the the formula on which fObj.target is located.
		if (formulaArr[0].indexOf(fObj.target)!==-1) {
			var targetSide = removeOuterParenthesisAroundNonSpecialTerms(formulaArr[0]);
			var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms(formulaArr[1]);
			var varSide = 'left';
		} else {
			var targetSide = removeOuterParenthesisAroundNonSpecialTerms(formulaArr[1]);
			var nonTargetSide = removeOuterParenthesisAroundNonSpecialTerms(formulaArr[0]);
			var varSide = 'right';
		}
		console.log('findNextOperator - targetSide 1: ' + targetSide);

		if (targetSide != fObj.target) {

			targetSide = addParenthesisAroundNegativeTerms(targetSide);   // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
			console.log('findNextOperator - targetSide 2: ' + targetSide);

			targetSide = addParenthesisAroundFunctions(targetSide);      // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
			console.log('findNextOperator - targetSide 2: ' + targetSide);

			var iObj = create_iObj(targetSide);
			console.log('findNextOperator - iObj: ' + JSON.stringify(iObj));

			// var opsStr = targetSide.replace(/(\w|\d|\.|\,)/g, '');  //  <-----  VIGTIGT: Dette skal ikke bruges - se strategi forneden!!!
			// console.log('findNextOperator - opsStr: ' + opsStr);

			// ==================
			// 		STRATEGI:
			// ==================
			// 1. Fjern parenteser med outerParenthesisBound - men brug iObj som book-keeping således at alle {index: xx, val: yy} svarende til den fjernede parentes også fjernes
			// 2. Loop derefter over alle '\w', '\d', '.' og ',' tegn i iObj så disse fjernes 
			// 3. Se hvilke operatore der er tilbage i iObj - '*', '/' kan fjernes mens '+' og '-' skal efterbehandles:
			//		(*) Hvis kun '/' er tilbage, så er der tale om en brøk
			// 		(*) Hvis kun '+' eller '-' er tilbage, så er der tale om led.
			//		(*) Hvis flere operatore er tilbage, f.eks '/' og '+', så fjernes '/' så '+' står tilbage. 
			//		(*) Hvis flere operatore er tilbage, f.eks '/' og '-', så fjernes '/' så '-' står tilbage.  

			// Remove parenthesis
			var pArr = outerParenthesisBound(targetSide);
			console.log('findNextOperator - pArr: ' + JSON.stringify(pArr));

			var TtargetSide = removeParenthesis_formula(targetSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
			console.log('findNextOperator - TtargetSide: ' + TtargetSide);    

			iObj_red = removeParenthesis_iObj(iObj, pArr);							// <-------- (#-2-#) IMPORTANT : iObj needs to be similar to targetSide - see (#-1-#) above.
			console.log('findNextOperator - iObj_red: ' + JSON.stringify(iObj_red));

			iObj_ops = removeNumAndCharsAndOperators_iObj(iObj_red);				// Array of operators "+" and "-", which might be empty if "*" and "/" are the only operators used.
			console.log('findNextOperator - iObj_ops: ' + JSON.stringify(iObj_ops) + ', fObj: ' + JSON.stringify(fObj));

			var selected_op = reduceOperators(iObj_ops); 
			console.log('findNextOperator - selected_op: ' + JSON.stringify(selected_op));

			console.log('findNextOperator - iObj_ops 2: ' + JSON.stringify(iObj_ops));
			var reducingTerm = findReducingTerm(selected_op, iObj, iObj_ops, targetSide);
			console.log('findNextOperator - reducingTerm: ' + reducingTerm);

			var inverseOperator = findInverseOperator(selected_op, reducingTerm, targetSide);
			console.log('findNextOperator - inverseOperator: ' + inverseOperator);

			var targetSide_red = reduceSide(targetSide, inverseOperator, reducingTerm, TtargetSide); // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
			console.log('findNextOperator - targetSide_red: ' + targetSide_red);

			nonTargetSide_red = addReducingTermOnNonTargetSide(nonTargetSide, inverseOperator, reducingTerm);  // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
			console.log('findNextOperator - nonTargetSide_red: ' + nonTargetSide_red);

			var reducableFormula = (varSide == 'left')? targetSide_red+'='+nonTargetSide_red : nonTargetSide_red+'='+targetSide_red;
			console.log('findNextOperator - reducableFormula: ' + reducableFormula);

			// prepareNonTargetSide(targetSide_red);

			var termArr = identifyInvolvedTerms(iObj, iObj_ops);
			console.log('findNextOperator - termArr: ' + JSON.stringify(termArr));

			var reducedTargetSide = reduceTargetSide(termArr, iObj_ops, inverseOperator, reducingTerm);   // <------------------  GAMMEL MED FEJL
			// var reducedTargetSide = reduceTargetSide_2(targetSide, inverseOperator, reducingTerm);   // <------------------  NY MED FEJL
			console.log('findNextOperator - reducedTargetSide: ' + reducedTargetSide);

			var reducedFormula = (varSide == 'left')? reducedTargetSide+'='+nonTargetSide_red : nonTargetSide_red+'='+reducedTargetSide;
			console.log('findNextOperator - reducedFormula: ' + reducedFormula);

			reduceTargetSide_2(targetSide, inverseOperator, reducingTerm);

			memObj.stepVars.push({formula: formula, formulaArr: formulaArr, targetSide: targetSide, iObj: iObj, iObj_ops: iObj_ops, selected_op: selected_op, inverseOperator: inverseOperator, reducableFormula: reducableFormula, reducedFormula: reducedFormula}); // Save all variables.

			return true;  // fObj.target has NOT been isolated!

		} else {

			return false;  // fObj.target has been isolated!
		}
	}
	console.log('\n================================================================================\n ');
	findNextOperator('sin(a)*x = k');					// <-------------   NOTE: Fra d. 14/2-2017 bliver hele ord opfattet som een variabel ---> lav oversættelselisste/lookup til inverse funktioner.
	console.log('\n================================================================================\n ');
	findNextOperator('-a*x = k');					// <-------------   FEJL:  "" (ingenting) bliver forslået som reducingTerm. (#-5-#)  <------ OK NU! (#-5-#) 
	console.log('\n================================================================================\n ');
	findNextOperator('a/x = k');					
	console.log('\n================================================================================\n ');
	findNextOperator('x/a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*x = k');					
	console.log('\n================================================================================\n ');
	findNextOperator('x*a = k');					
	console.log('\n================================================================================\n ');
	findNextOperator('a+x = k');					
	console.log('\n================================================================================\n ');
	findNextOperator('x+a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a-x = k');					
	console.log('\n================================================================================\n ');
	findNextOperator('x-a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b + x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b + x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b - x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b - x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c + x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b/c + x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c - x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b/c - x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*x - c = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b/x - c = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c*x - d = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a/b/c/x - d = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c*x*e*f - d = k');		   // <-------------   FEJL:  e*f bliver forslået som reducingTerm. (#-4-#)   <------ OK NU! (#-4-#)
	console.log('\n================================================================================\n ');
	findNextOperator('a/b/c/x/e/f - d = k');           // <-------------   FEJL:  e/f bliver forslået som reducingTerm. (#-4-#)   <------ OK NU! (#-4-#)
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c*x*e*f = k');		 
	console.log('\n================================================================================\n ');
	findNextOperator('a*b*c*x = k');		 
	console.log('\n================================================================================\n ');
	findNextOperator('x/(3*(1 + a/b))= k');
	console.log('\n================================================================================\n ');
	findNextOperator('1/(3*(1 + a*x/b))= k');
	console.log('\n================================================================================\n ');
	findNextOperator('1/(3*(1 + a*x/b)) + c = k');
	console.log('\n================================================================================\n ');
	findNextOperator('1/(3*(1 + a/b)) + x = k');       // <-------------   FEJL:  (3*(1 + a/b)) bliver forslået som reducingTerm. (#-3-#) <------ OK NU! (#-3-#)
	console.log('\n================================================================================\n ');
	findNextOperator('1/(3*(1 + a*x/b))*((a+b)*(3*(1+c))) + c = k');
	console.log('\n================================================================================\n ');
	findNextOperator('3*(1 + a*x/b)= k');
	console.log('\n================================================================================\n ');
	findNextOperator('3*(1 + a*x/b)/c= k');
	console.log('\n================================================================================\n ');
	findNextOperator('3*(1 + a*x/b)/c + h - j = k');
	console.log('\n================================================================================\n ');
	findNextOperator('3 + (1 + a*x/b)/c + h - j = k');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x/c = k + 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x*c = k + 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x/c = k * 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x*c = k * 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x+c = k * 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x-c = k * 2');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x+c = 1');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x-c = 1');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x*c = 1');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x/c = 1');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x+c = 0');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x-c = 0');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x*c = 0');
	console.log('\n================================================================================\n ');
	findNextOperator('3*x/c = 0');
	// console.log('\n================================================================================\n ');
	// findNextOperator('(a*x+c-c)/a = (k-c)/a');      // <------------------------  NOTE: her er "x" isoleret hvis man blot "reducere" 2 gange på venstresiden (#-6-#)
	console.log('\n================================================================================\n ');
	findNextOperator('a*x+c-c = k-c');      
	console.log('\n================================================================================\n ');
	findNextOperator('x = k*c/3');
	console.log('\n================================================================================\n ');
	findNextOperator('a+x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('a-x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('-x+a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('x+a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('b+x+a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('-a+x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('-a-x = k');
	console.log('\n================================================================================\n ');
	findNextOperator('x-a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('-x-a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('b-a+x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('x*a = k');
	console.log('\n================================================================================\n ');
	findNextOperator('1/(x+a)+2/b + c = k'); 
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(x+a)+2/b = k - c'); 
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(x+a)+2/b=k-c-2/b'); 
	// console.log('\n================================================================================\n ');
	// findNextOperator('2/b + x = k - c'); 
	// console.log('\n================================================================================\n ');
	// findNextOperator('a+x = k'); 


	function isolateTarget(formula){

		console.log('isolateTarget - formula: ' + formula);

		memObj.stepVars = [];

		var count = 0;
		var count2 = 0
		var formulaSteps = '\n';
		var formulaReductionSteps = '\n';
		var combinedSteps = '\n';

		formulaSteps += '('+count+')  '+((count<10)?' ':'')+formula.replace(/ /g, '')+'\n';
		formulaReductionSteps = formulaSteps;
		combinedSteps = formulaSteps;

		++count;
		++count2;

		while ((findNextOperator(formula)) && (count < 25)) {
			formula = memObj.stepVars[memObj.stepVars.length-1].reducedFormula;
			formula_red = memObj.stepVars[memObj.stepVars.length-1].reducableFormula;

			formulaSteps += '('+count+')  '+((count<10)?' ':'')+formula+'\n';
			formulaReductionSteps += '('+count+')  '+((count<10)?' ':'')+formula_red+'\n';

			combinedSteps += '('+count2+')  '+((count<10)?' ':'')+formula_red+'\n';
			++count2;
			combinedSteps += '('+count2+')  '+((count<10)?' ':'')+formula+'\n';

			++count;
			++count2;
		}

		console.log('isolateTarget - formulaSteps: ' + formulaSteps);
		console.log('isolateTarget - combinedSteps: ' + combinedSteps);

		alert('formulaSteps: ' + formulaSteps + '\ncombinedSteps: ' + combinedSteps);
	}
	console.log('\n================================================================================\n ');
	// isolateTarget('-b+x-a = k');
	// isolateTarget('-b-x-a = k');   // <----- FEJL - 23/2 kl 14:35
	// isolateTarget('b*x*a = k');            // <-------  NOTE: FIX at x = k/a/b   <==>  k/(a*b)
	// isolateTarget('1/x + c = k');
	isolateTarget('1/(x+a) + c = k'); 

	// isolateTarget('a-x = k'); // <----- FEJL - 23/2 kl 14:35


	// isolateTarget('1/(x+a)+2/b + c = k'); // <----- FEJL - 23/2 kl 14:35
	// isolateTarget('1/(x+a)+2/(3+b) + c = k'); // <----- FEJL - 23/2 kl 14:35

	// isolateTarget('DeltaE = x*m*Delta_T');  // <--------  TEST af brug af '_' i størrelser i ligning. 27/2

	// This function perform the action of finding 'b' (aka 'reducing term') for use in the reduceingStep: 
	//		ax + b = y  <==>  ax + b - b = y - b
	function findReducingTerm(selected_op, iObj, iObj_ops, targetSide){
		
		var indexStr = '_'; 
		var opsStr = '';
		for (var n in iObj_ops){
			indexStr += iObj_ops[n].index + '_';
			opsStr += iObj_ops[n].val;
		}
		console.log('findReducingTerm - indexStr: ' + indexStr);

		
		var fStr = '';
		for (var n in iObj){
			fStr += (indexStr.indexOf('_'+iObj[n].index+'_')!==-1)? '#' : iObj[n].val;
		}
		console.log('findReducingTerm - fStr 1: ' + fStr);

		var termArr = fStr.split('#');
		console.log('findReducingTerm - termArr 1: ' + JSON.stringify(termArr));


		////////////////////////////////////////////////////////////////////////////////////////////////////////

		//
		// VIGTIGT: DER ER STADIG FEJL I DENNE INDRAMMEDE KODE BLOK - SE (#-4-#) FOROVEN!
		//

		// The following corrects this error - see (#-3-#) above:
		// IF a*b + x = k, a/b + x = k, a*b - x = k, a/b - x = k, THEN a*b and a/b needs to be treated as one term and not as two terms. The same goes for a*b*c + x = k

		fStr = '';
		for (var n in iObj_ops){  
			fStr += termArr[n];
			console.log('findReducingTerm - n: ' + n + ', fStr: ' + fStr);
			
			if (((iObj_ops[n].val == '*') || (iObj_ops[n].val == '/')) && ((selected_op.val == '+') || (selected_op.val == '-'))) {  // Multiplication AND division
			// if ((iObj_ops[n].val == '/') && ((selected_op.val == '+') || (selected_op.val == '-'))) {  // ONLY division
				fStr += iObj_ops[n].val; 
			} else {
				fStr += '#';
			}
		}
		fStr += termArr[termArr.length-1];

		console.log('findReducingTerm - fStr 2: ' + fStr);

		var termArr = fStr.split('#');
		console.log('findReducingTerm - termArr 2: ' + JSON.stringify(termArr));

		////////////////////////////////////////////////////////////////////////////////////////////////////////


		var reducingTerm = '';

		if (selected_op.val == '/'){  // Always select the denominator for the '/' operator - also when fObj.target is located inside it:
			console.log('findReducingTerm - A1');
			reducingTerm = returnElement(termArr, selected_op.index, false);
		}

		if ((selected_op.val == '*') || (selected_op.val == '+') || (selected_op.val == '-')){ 
			console.log('findReducingTerm - A2');
			console.log('findReducingTerm - fObj.index: ' + typeof(fObj.index) + ', selected_op.index: ' + typeof(selected_op.index));
			if (parseInt(fObj.index) < parseInt(selected_op.index)){  // If the fObj.target is located before the selected operator, then select the term after the operator:
				console.log('findReducingTerm - A3');
				reducingTerm = returnElement(termArr, selected_op.index, false);
			} else {							 // If the fObj.target is located after the selected operator, then select the term before the operator:
				console.log('findReducingTerm - A4');
				reducingTerm = returnElement(termArr, selected_op.index, true);
			}
		}

		return reducingTerm;
	}


	function returnElement(Tarray, length, termBefore) {
		var sum = 0;
		for (var n in Tarray){
			sum += Tarray[n].length+1;
			console.log('returnElement - n: ' + n + ', sum: ' + sum + ', length: ' + length);
			if (sum-1 > length) {
				console.log('returnElement - B1');
				if (termBefore){
					console.log('returnElement - B2');
					return Tarray[n-1];
				} else {
					console.log('returnElement - B3');
					return Tarray[n];
				}
			}
		}
	}



	function findInverseOperator(selected_op, reducingTerm, targetSide){  
		var inverseOperator, cOp;
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};
		var strBefore = targetSide.substring(0, selected_op.index);
		var strAfter = targetSide.substring(parseInt(selected_op.index)+1);
		console.log('findInverseOperator - targetSide: ' + targetSide + ', strBefore: ' + strBefore + ', strAfter: ' + strAfter);
		if (strBefore.lastIndexOf(reducingTerm) + reducingTerm.length == strBefore.length) {
			console.log('findInverseOperator - A0');
			if ((selected_op.val == '*') || (selected_op.val == '+/')){
				console.log('findInverseOperator - A1');
				inverseOperator = inversOpsLookup[selected_op.val];
			}
			if ((selected_op.val == '+') || (selected_op.val == '-')){
				console.log('findInverseOperator - A2');
				if (reducingTerm.length < strBefore.length) {
					console.log('findInverseOperator - A3');
					cOp = strBefore.substr(strBefore.length - 1 - reducingTerm.length, 1);
					console.log('findInverseOperator - cOp: ' + cOp);
					inverseOperator = inversOpsLookup[cOp];
				} else {
					console.log('findInverseOperator - A4');
					inverseOperator = '-';
				}
			} 
		}
		if (strAfter.indexOf(reducingTerm) == 0) {
			console.log('findInverseOperator - A5');
			inverseOperator = inversOpsLookup[selected_op.val];
		}
		console.log('findInverseOperator - inverseOperator: ' + inverseOperator);

		return inverseOperator;
	}


	// This function perform the action: 
	//		ax + b = y  <==>  ax + b - b = y - b
	function addReducingTermOnNonTargetSide(nonTargetSide, inverseOperator, reducingTerm){
		var pArr = outerParenthesisBound(nonTargetSide);
		console.log('addReducingTermOnNonTargetSide - pArr: ' + JSON.stringify(pArr));

		var TtargetSide = removeParenthesis_formula(nonTargetSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
		console.log('addReducingTermOnNonTargetSide - TtargetSide: ' + TtargetSide); 


		// if ((TtargetSide.indexOf('+')!==-1) || (TtargetSide.indexOf('-')!==-1)) {
		// 	if ((inverseOperator == '*') || (inverseOperator == '/')) {
		// 		nonTargetSide = '('+nonTargetSide+')'+inverseOperator+reducingTerm;
		// 	} else {
		// 		nonTargetSide = nonTargetSide+inverseOperator+reducingTerm;
		// 	}
		// } else {
		// 	if ((TtargetSide.indexOf('*')!==-1) || (TtargetSide.indexOf('/')!==-1)) {
		// 		nonTargetSide = nonTargetSide+inverseOperator+reducingTerm;
		// 	} else {
		// 		if (nonTargetSide == '0') {
		// 			if ((inverseOperator == '*') || (inverseOperator == '/')) {
		// 				nonTargetSide = '0';
		// 			} else {
		// 				nonTargetSide = (inverseOperator == '-')? inverseOperator+reducingTerm : reducingTerm;
		// 			}
		// 		}
		// 		if (nonTargetSide == '1') {
		// 			if (inverseOperator == '*') {
		// 				nonTargetSide = reducingTerm;
		// 			} else {
		// 				nonTargetSide = nonTargetSide+inverseOperator+reducingTerm;
		// 			}
		// 		} 
		// 	}
		// }

		// console.log('addReducingTermOnNonTargetSide - nonTargetSide: ' + nonTargetSide); 

		equationSide = reduceSide(nonTargetSide, inverseOperator, reducingTerm, TtargetSide);
		console.log('addReducingTermOnNonTargetSide - equationSide: ' + equationSide); 

		return equationSide;
	}


	// This function perform the action on ONE of the equation sides (right or left, determined by the string "equationSide"): 
	//		ax + b = y  <==>  ax + b - b = y - b
	function reduceSide(equationSide, inverseOperator, reducingTerm, TtargetSide){
		
		if ((TtargetSide.indexOf('+')!==-1) || (TtargetSide.indexOf('-')!==-1)) {
			if ((inverseOperator == '*') || (inverseOperator == '/')) {
				equationSide = '('+equationSide+')'+inverseOperator+reducingTerm;
			} else {
				equationSide = equationSide+inverseOperator+reducingTerm;
			}
		} else {
			if ((TtargetSide.indexOf('*')!==-1) || (TtargetSide.indexOf('/')!==-1)) {
				equationSide = equationSide+inverseOperator+reducingTerm;
			} else {
				if (equationSide == '0') {
					if ((inverseOperator == '*') || (inverseOperator == '/')) {
						equationSide = '0';
					} else {
						equationSide = (inverseOperator == '-')? inverseOperator+reducingTerm : reducingTerm;
					}
				} else if (equationSide == '1') {
					if (inverseOperator == '*') {
						equationSide = reducingTerm;
					} else {
						equationSide = equationSide+inverseOperator+reducingTerm;
					}
				} else {
					equationSide = equationSide+inverseOperator+reducingTerm;
				}
			}
		}

		return equationSide;
	}



	function removeOuterParenthesisAroundNonSpecialTerms(equationSide) {

		var pArr = outerParenthesisBound(equationSide);
		console.log('removeOuterParenthesisAroundNonSpecialTerms - pArr: ' + JSON.stringify(pArr));

		var TequationSide = removeParenthesis_formula(equationSide, pArr);    
		console.log('removeOuterParenthesisAroundNonSpecialTerms - TtargetSide: ' + TequationSide); 

		// if ((equationSide.indexOf('(-')!==0) && (TequationSide.length==0)) {
		if (TequationSide.length==0) {
			return equationSide.substring(1, equationSide.length-1);
		} else {
			return equationSide;
		}
	}
	console.log('removeOuterParenthesisAroundNonSpecialTerms("a*(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("a*(b+x)"));
	console.log('removeOuterParenthesisAroundNonSpecialTerms("c(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("c(b+x)"));
	console.log('removeOuterParenthesisAroundNonSpecialTerms("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("(b+x)"));
	console.log('removeOuterParenthesisAroundNonSpecialTerms("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("(-b+x)"));  // <------ MEGET VIGIGT: Her er et hul i strategien om at negative størrelser angivet med (-a). OK nu, idet (-b+x) --> -b+x --> (-b)+x senere i programmet.


	// ======================
	// 		NOT IN USE:       Denne funktion er muligvis overflødig, idet -a*x = k  <==>  (-a)*x/(-a) = k/(-a)  _og_  -a+x = k  <==>  (-a)+x-(-a) = k-(-a)
	// ======================
	function removeOuterParenthesisAroundNegativeTerm(term) {
		if (term.indexOf('(-') === 0){
			return term.substring(1, term.length-1);
		} else {
			return term;
		}
	}
	console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("a*(-3)"));
	console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("1(-3)"));
	console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("(-3)"));



	// This function perform the action: 
	//		ax + b - b = y - b  <==>  ax = y - b
	function reduceTargetSide(termArr, iObj_ops, inverseOperator, reducingTerm){
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

		console.log('reduceTargetSide - termArr 1: ' + JSON.stringify(termArr) + ', iObj_ops 1: ' + JSON.stringify(iObj_ops) + ', inverseOperator 1: ' + inverseOperator + ', reducingTerm 1: ' + reducingTerm);

		var len = termArr.length;
		for (var n in termArr){
			if (termArr[n] == reducingTerm) {
				console.log('reduceTargetSide - A0 - n: ' + n);

				if (inverseOperator == '-') {
					console.log('reduceTargetSide - A1 - n: ' + n);

					if ((n == 0) && (iObj_ops[n].val == '-')) {  // CASE: a-x-a = k-a
						console.log('reduceTargetSide - A2 - n: ' + n);

						termArr.splice(n, 1);
					}

					if ((n == 0) && (iObj_ops[n].val == '+')) {  // CASE: a+x-a = k-a
						console.log('reduceTargetSide - A3 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n, 1);  // <---- IMPORTANT: remove the "+" operator 
					}

					if ((n > 0) && (n < len-1) && ((iObj_ops[n-1].val == '+') || (iObj_ops[n-1].val == '-')) && ((iObj_ops[n].val == '+') || (iObj_ops[n].val == '-'))) {  // CASE: c+a+x-a = k-a
						console.log('reduceTargetSide - A4 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}

					if ((n == len-1) && (iObj_ops[n-1].val == '+')) { // CASE: x+a-a = k-a
						console.log('reduceTargetSide - A5 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}
				}

				if (inverseOperator == '+') {
					console.log('reduceTargetSide - A6 - n: ' + n);

					if ((n == 0) && (iObj_ops[n].val == '-')) {  // CASE: -a-x+a = k-a
						console.log('reduceTargetSide - A7 - n: ' + n);

						termArr.splice(n, 1);
					}

					if ((n == 0) && (iObj_ops[n].val == '+')) {  // CASE: -a+x+a = k-a
						console.log('reduceTargetSide - A8 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n, 1);  // <---- IMPORTANT: remove the "+" operator 
					}

					if ((n > 0) && (n < len-1) && ((iObj_ops[n-1].val == '+') || (iObj_ops[n-1].val == '-')) && ((iObj_ops[n].val == '+') || (iObj_ops[n].val == '-'))) {  // CASE: c-a+x+a = k-a
						console.log('reduceTargetSide - A9 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}

					if ((n == len-1) && (iObj_ops[n-1].val == '-')) { // CASE: x-a+a = k-a
						console.log('reduceTargetSide - A10 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}
				}


				if ((inverseOperator == '*') || (inverseOperator == '/')) {
					console.log('reduceTargetSide - A11 - n: ' + n);

					if (n == 0) {  // CASE:  a*x/a = k/a
						console.log('reduceTargetSide - A12 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n, 1);
					}

					if ((n > 0) && (n < len-1)) {  // CASE: c*a*x/a = k/a
						console.log('reduceTargetSide - A13 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}

					if (n == len-1) { // CASE: x*a/a = k/a
						console.log('reduceTargetSide - A14 - n: ' + n);

						termArr.splice(n, 1);
						iObj_ops.splice(n-1, 1);
					}
				}

			}
		}

		console.log('reduceTargetSide - termArr 2: ' + JSON.stringify(termArr) + ', iObj_ops 2: ' + JSON.stringify(iObj_ops) + ', inverseOperator 2: ' + inverseOperator + ', reducingTerm 2: ' + reducingTerm);

		var reducedEquationSide = '';
		if (termArr.length == iObj_ops.length){
			for (var n in termArr) {
				reducedEquationSide += iObj_ops[n].val+termArr[n];
			}
		}

		if (termArr.length == iObj_ops.length + 1){
			for (var n in termArr) {
				console.log('reduceTargetSide - n: ' + n + ', iObj_ops.length: ' + iObj_ops.length );
				reducedEquationSide += termArr[n]+((typeof(iObj_ops[n])!=='undefined')? iObj_ops[n].val : '');
			}
		}

		console.log('reduceTargetSide - reducedEquationSide: ' + reducedEquationSide);

		return reducedEquationSide;
	} 


	// function returnSurroundingOperators(equationSide, reducingTerm) {
	// 	var pos = equationSide.indexOf(reducingTerm);
	// 	if (pos !== -1) {
	// 		console.log('reduceTargetSide_2 - A0');

	// 		if (pos == 0) {
	// 			console.log('reduceTargetSide_2 - A0');
	// 			pos_begin = pos;
	// 			pos_end = reducingTerm.length-1;
	// 			if () {

	// 			}
	// 		}
	// 	} else {
	// 		console.log('reduceTargetSide_2 - A1');
	// 	}
	// }


	// This function perform the action: 
	//		ax + b - b = y - b  <==>  ax = y - b
	function reduceTargetSide_2(equationSide, inverseOperator, reducingTerm){
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

		console.log('reduceTargetSide_2 - equationSide 1: ' + equationSide + ', inverseOperator 1: ' + inverseOperator + ', reducingTerm 1: ' + reducingTerm);

		var pArr = outerParenthesisBound(equationSide);
		console.log('findNextOperator - pArr: ' + JSON.stringify(pArr));

		var pObj = returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
		console.log('reduceTargetSide_2 - pObj: ' + JSON.stringify(pObj)); 

		var TequationSide = pObj.formula_mod;
		var parenthesisArr = pObj.parenthesisArr;


		console.log('reduceTargetSide_2 - TequationSide 1: ' + TequationSide + ', inverseOperator 2: ' + inverseOperator + ', reducingTerm 2: ' + reducingTerm);

		var pos_begin = null, pos_end = null;
		var opBefore = null, opEnd = null 

		// var pos = equationSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm);
		var pos = TequationSide.indexOf(reducingTerm);
		if (pos !== -1) {
			console.log('reduceTargetSide_2 - A0');

			if (pos == 0) {
				console.log('reduceTargetSide_2 - A1');

				pos_begin = pos;
				pos_end = reducingTerm.length-1;

				if (TequationSide.length >= pos_end+1) {
					console.log('reduceTargetSide_2 - A2');

					opEnd = TequationSide.substring(pos_end+1, pos_end+2);

				}
			}

			if ((pos > 0) && (pos < TequationSide.length - reducingTerm.length)) {
				console.log('reduceTargetSide_2 - A3');

				pos_begin = pos;
				pos_end = pos + reducingTerm.length-1;

				opEnd = TequationSide.substring(pos_end+1, pos_end+2);
				opBefore = TequationSide.substring(pos_begin-1, pos_begin);
			}

			if ((pos > 0) && (pos == TequationSide.length - reducingTerm.length)) {
				console.log('reduceTargetSide_2 - A4');

				pos_begin = pos;
				pos_end = TequationSide.length-1;

				opBefore = TequationSide.substring(pos_begin-1, pos_begin);
			}

			console.log('reduceTargetSide_2 - opBefore: _' + opBefore + '_ , opEnd: _' + opEnd + '_');

			// ==================================

			if (inverseOperator == '+') { 
				console.log('reduceTargetSide_2 - A5');
				if (opBefore == '-')  {
					console.log('reduceTargetSide_2 - A6');

					if ((opEnd == '+') || (opEnd == '-')) {
						console.log('reduceTargetSide_2 - A7');

						TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
					}
					if (opEnd == null) {
						console.log('reduceTargetSide_2 - A8');

						TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
					}
				}
			}

			if (inverseOperator == '-') { 
				console.log('reduceTargetSide_2 - A9');

				if (opBefore == null)  {
					console.log('reduceTargetSide_2 - A10');

					if (opEnd == '-') {
						console.log('reduceTargetSide_2 - A11');

						TequationSide = TequationSide.replace(reducingTerm+opEnd, opEnd);
					}

					if (opEnd == '+') {
						console.log('reduceTargetSide_2 - A11b');

						TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
					}
				}
				if (opBefore == '+')  {
					console.log('reduceTargetSide_2 - A12');

					if ((opEnd == '+') || (opEnd == '-')) {
						console.log('reduceTargetSide_2 - A13');

						TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
					}
					if (opEnd == null) {
						console.log('reduceTargetSide_2 - A14');

						TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
					}
				}
			}

			if ((inverseOperator == '*') || (inverseOperator == '/')) { 
				console.log('reduceTargetSide_2 - A15');

				var opBefore_escaped = ((opBefore =='*')? '\*' : ((opBefore =='/')? '\/' : null));
				var opEnd_escaped = ((opEnd =='*')? '\*' : ((opEnd =='/')? '\/' : null));
				console.log('reduceTargetSide_2 - opBefore_escaped: ' + opBefore_escaped + ', opEnd_escaped: ' + opEnd_escaped);


				if ((opBefore == null) && ((opEnd == '*') || (opEnd == '/'))){
					console.log('reduceTargetSide_2 - A16');

					TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
				}
				
				if (((opBefore == '*') || (opBefore == '/')) && ((opEnd == '*') || (opEnd == '/'))) {
					console.log('reduceTargetSide_2 - A17');

					TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
				}

				if ((opEnd == null) && ((opBefore == '*') || (opBefore == '/'))){
					console.log('reduceTargetSide_2 - A18');
					TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
				}
			}

		} else {
			console.log('reduceTargetSide_2 - A19');
		}

		console.log('reduceTargetSide_2 - TequationSide 2: ' + TequationSide + ', inverseOperator 3: ' + inverseOperator + ', reducingTerm 3: ' + reducingTerm);

		for (var n in parenthesisArr) {
			TequationSide = TequationSide.replace('#'+n+'#', parenthesisArr[n]);
		}

		
		console.log('reduceTargetSide_2 - TequationSide 3: ' + TequationSide + ', inverseOperator 4: ' + inverseOperator + ', reducingTerm 4: ' + reducingTerm);

		return TequationSide;
	} 

	console.log('reduceTargetSide_2 - Test: ' + 'b*x*a'.replace('*'+'a', ''))



	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	// This function does much of what findNextOperator() does for the targetSide, but does it just for the nonTargetSide:
	function extractInfoFromEquationSide(equationSide){

		equationSide = addParenthesisAroundNegativeTerms(equationSide);   // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
		console.log('extractInfoFromEquationSide - '+equationSide+' - targetSide 1: ' + equationSide);

		equationSide = addParenthesisAroundFunctions(equationSide);      // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
		console.log('extractInfoFromEquationSide - '+equationSide+' - targetSide 2: ' + equationSide);

		var iObj = create_iObj(equationSide);
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj: ' + JSON.stringify(iObj));

		var pArr = outerParenthesisBound(equationSide);
		console.log('extractInfoFromEquationSide - '+equationSide+' - pArr: ' + JSON.stringify(pArr));

		var TtargetSide = removeParenthesis_formula(equationSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
		console.log('findNextOperator - TtargetSide: ' + TtargetSide);    

		iObj_red = removeParenthesis_iObj(iObj, pArr);							// <-------- (#-2-#) IMPORTANT : iObj needs to be similar to targetSide - see (#-1-#) above.
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj_red: ' + JSON.stringify(iObj_red));

		iObj_ops = removeNumAndCharsAndOperators_iObj(iObj_red);				// Array of operators "+" and "-", which might be empty if "*" and "/" are the only operators used.
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj_ops: ' + JSON.stringify(iObj_ops) + ', fObj: ' + JSON.stringify(fObj));

		termArr = identifyInvolvedTerms(iObj, iObj_ops);
		console.log('extractInfoFromEquationSide - '+equationSide+' - termArr: ' + JSON.stringify(termArr));


		// identifyReducingTerms(termArr, iObj_ops);


		return {equationSide: equationSide, iObj: iObj, pArr: pArr, iObj_red: iObj_red, iObj_ops: iObj_ops, termArr: termArr};
	}

	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	// This function has a replica of the first code found in findReducingTerm(), which has the purpose of isolating the involved 
	// terms, eg. sin(a)*x = k  -->  ["(sin(a))","x"] for the left side og the formula.
	function identifyInvolvedTerms(iObj, iObj_ops){

		var indexStr = '_'; 
		for (var n in iObj_ops){
			indexStr += iObj_ops[n].index + '_';
		}
		console.log('identifyInvolvedTerms - indexStr: ' + indexStr);

		var fStr = '';
		for (var n in iObj){
			fStr += (indexStr.indexOf('_'+iObj[n].index+'_')!==-1)? '#' : iObj[n].val;
		}
		console.log('identifyInvolvedTerms - fStr : ' + fStr);

		var termArr = fStr.split('#');
		console.log('identifyInvolvedTerms - termArr : ' + JSON.stringify(termArr));

		return termArr;
	}



	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	function identifyReducingTerms(termArr, iObj_ops){
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};
		var TtermArr = '#'+termArr.join('#')+'#';
		var firstOp, secondOp;
		var opArr = [];
		for (var n in termArr){
			var numOfTerms = TtermArr.split('#'+termArr[n]+'#').length - 1;
			if (numOfTerms > 1) {
				firstOp = (n==0)? null : iObj_ops[n];
				for (var m in termArr) {
					if ((m != n) && (termArr[m] == termArr[n])){
						secondOp = iObj_ops[m-1];

						// if ((firstOp == null) && ((secondOp == '/') || (secondOp == '*'))) {
						 	opArr.push({val: termArr[n], firstOp: firstOp, secondOp: secondOp});
						// }
					}
				}
			}
		}

		return opArr;
	}

// } // END solverClass


// 1/(3*(1+a*x/b))*((a+b)*(3*(1+c)))+c=k
// 01234567890123456789012345678901234567890
// |         |         |         |         |
// abcdefghijklmnopqrstuvwxyzæøå
// ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ


