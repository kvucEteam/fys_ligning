
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


solverClass = {
  
	fObj : {target: 'x', a: '13[J*s]'},   // Defines the variable (here "x") the program will try to isolate, and physical tanslations of known constants/entities like a = 13[J*s]

	memObj: {
				fObj: this.fObj,
				stepVars: [], 
				knownFunctions: ['asin','sin','acos','cos','atan','tan'] // <----- IMPORTANT: the inverse operator "axxx" has to be BEFORE the corresponding operator "xxx". 
			},


	posOfChar: function(formula, Char){
		posArr = [];
		pos = formula.indexOf(Char);
		while (pos!==-1){
			posArr.push(pos);
			pos = formula.indexOf(Char, pos+1);
		}
		return posArr;
	},
	// console.log('posOfChar: ' + posOfChar('012345678901234567890','0'));


	outerParenthesisBound: function(formula){
		var fArr = formula.split("");
		// console.log('outerParenthesisBound - fArr: ' + JSON.stringify(fArr));
		var pL = 0, pL_old = 0, pR = 0, pArr = []; 
		var pLarr = this.posOfChar(formula, '(');
		var pRarr = this.posOfChar(formula, ')');
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
	},
	// console.log('outerParenthesisBound("a*b+c"): ' + JSON.stringify( outerParenthesisBound('a*b+c')) );
	// console.log('outerParenthesisBound("(...)"): ' + JSON.stringify( outerParenthesisBound('(...)')) );
	// console.log('outerParenthesisBound("(...)(...)"): ' + JSON.stringify( outerParenthesisBound('(...)(...)')) );
	// console.log('outerParenthesisBound("((...))"): ' + JSON.stringify( outerParenthesisBound('((...))')) );
	// console.log('outerParenthesisBound("((...)(...))"): ' + JSON.stringify( outerParenthesisBound('((...)(...))')) );
	// console.log('outerParenthesisBound("((...)((...)))"): ' + JSON.stringify( outerParenthesisBound('((...)((...)))')) );
	// console.log('outerParenthesisBound("((...)((...)))(...)"): ' + JSON.stringify( outerParenthesisBound('((...)((...)))(...)')) );




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


	create_iObj: function(formula){
		var fArr = formula.split("");
		var iObj = [];
		for (var n in fArr) {
			iObj.push({index:n, val:fArr[n]});
			
			if (fArr[n] == this.fObj.target) {  // This finds the position of fObj.target and stores it:
				this.fObj.index = n;
			}
		}
		// console.log('create_iObj - iObj: ' + JSON.stringify(iObj));

		return iObj;
	},
	// console.log('create_iObj - iObj: ' + JSON.stringify(create_iObj('1/(3*(1 + ax/b)) + c = k')));


	removeParenthesis_formula: function(formula, pArr){
		var parenthesis; 
		var formula_mod = formula;
		for (var n in pArr) {
			parenthesis = formula.substring(pArr[n].left, pArr[n].right+1);
			formula_mod = formula_mod.replace(parenthesis, '');
			console.log('removeParenthesis_formula - n: '+n+', formula_mod: ' + formula_mod);
		}

		return formula_mod;
	},


	returnParenthesisObj_formula: function(formula, pArr, reducingTerm){
		console.log('\nreturnParenthesisObj_formula - formula: ' + formula + ', pArr: ' + JSON.stringify(pArr) + ', reducingTerm: ' + reducingTerm); 

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
	},


	// Added 30/5-2017:
	// This function is a version of returnParenthesisObj_formula(formula, pArr, reducingTerm) where "pArr" AND "reducingTerm" is not needed.
	returnParenthesisObj_formula_mod: function (equationSide) {
		console.log('\nreturnParenthesisObj_formula_mod: - equationSide: ' + equationSide);

		pArr = this.outerParenthesisBound(equationSide);

		var parenthesis, equationSide_mod, parenthesisArr = [];
		equationSide_mod = equationSide;
		for (var n in pArr) {
			parenthesis = equationSide.substring(pArr[n].left, pArr[n].right+1);
			parenthesisArr.push(parenthesis);
			equationSide_mod = equationSide_mod.replace(parenthesis, '#'+n+'#');
		}
		console.log('returnParenthesisObj_formula_mod: - equationSide_mod: ' + equationSide_mod);

		return {equationSide_mod: equationSide_mod, parenthesisArr: parenthesisArr, pArr: pArr};   // {"formula_mod":"c*b/(b*d)","parenthesisArr":["(b*d)"]}
	},



	removeParenthesis_iObj: function(iObj, pArr){
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
	},


	removeNumAndCharsAndOperators_iObj: function(iObj){
		var TiObj = iObj.slice();
		for (var i = iObj.length - 1; i >= 0; i--) { 
			if ('1234567890.,abcdefghijklmnopqrstuvwxyzæøåABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ_[]'.indexOf(iObj[i].val)!==-1) {
				TiObj.splice(i, 1);
			}
		}
		console.log('removeNumAndCharsAndOperators_iObj - TiObj: ' + JSON.stringify(TiObj)); 

		return TiObj;
	},


	// This function decides which operator (the inverse operator), and therefore which constant/therm, that need to be added/subtracted/multiplied/devided on each side.
	reduceOperators: function(iObj_ops){  
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
	},


	// The purpose of this function is to wrap a parenthesis around all memObj.knownFunctions. The reason for this is that when "sin(x)" is wrapped in a 
	// parenthesis, like so "(sin(x))", then it will be treated like a constant "c" by all the other algorithms in the program. If the function is not wrapped, then
	// "sin" and "(x)" will be treated as two separate entities. 
	addParenthesisAroundFunctions: function(targetSide){
		var pArr = this.outerParenthesisBound(targetSide);
		console.log('addParenthesisAroundFunctions - pArr: ' + JSON.stringify(pArr));
		var f = this.memObj.knownFunctions;
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
	},
	// console.log('==================  XXX - 0 - XXX  ==================');
	// console.log('addParenthesisAroundFunctions("sin(x)+asin(x)+cos(x)+acos(x)+tan(x)+atan(x)+k"): ' + addParenthesisAroundFunctions("sin(x)+asin(x)+cos(x)+acos(x)+tan(x)+atan(x)+k"));
	// console.log('==================  XXX - 1 - XXX  ==================');
	// console.log('addParenthesisAroundFunctions("(sin(x))+(asin(x))+(cos(x))+k"): ' + addParenthesisAroundFunctions("(sin(x))+(asin(x))+(cos(x))+k")); // Check that eg (sin(x)) is ignored by the algorithm, and does not become ((sin(x))).  

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
	addParenthesisAroundNegativeTerms: function(targetSide){
		var formulaArr = targetSide.split("");
		var formulaArrKeys = Object.keys(formulaArr);  // <---- All elements in formulaArrKeys are of type string, due to comparison with (# 6 #).
		console.log('addParenthesisAroundNegativeTerms - typeof(formulaArrKeys[0]): ' + typeof(formulaArrKeys[0]));
		console.log('addParenthesisAroundNegativeTerms - formulaArrKeys: ' + formulaArrKeys);
		var newFormulaArr, pos, posRightParenthesis, newTargetSide_start, newTargetSide;
		var pArr = this.outerParenthesisBound(targetSide);
		console.log('addParenthesisAroundNegativeTerms - pArr: ' + JSON.stringify(pArr));
		var pArrSet = this.helper_makeSetFrom_pArr(pArr);
		console.log('addParenthesisAroundNegativeTerms - pArrSet: ' + pArrSet);
		var pArrLookup = this.helper_pArr_lookup(pArr);
		var excludedSet = this.helper_excludedSet(formulaArrKeys, pArrSet);
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
	},
	// console.log('==================  XXX 0 XXX  ==================');
	// console.log('addParenthesisAroundNegativeTerms("-a*x") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-a*x")));
	// console.log('==================  XXX 1 XXX  ==================');
	// console.log('addParenthesisAroundNegativeTerms("-(a*x)") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-(a*x)")));
	// console.log('==================  XXX 2 XXX  ==================');
	// console.log('addParenthesisAroundNegativeTerms("-(a*x)+(b*c)-(d*e)") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-(a*x)+-(b*c)*-(d*e)")));
	// console.log('==================  XXX 3 XXX  ==================');
	// console.log('addParenthesisAroundNegativeTerms("-sin(x)*a") : ' + JSON.stringify(addParenthesisAroundNegativeTerms("-sin(x)*a")));


	helper_pArr_lookup: function(pArr){
		pArrLookup = {};
		for (var n in pArr) {
			pArrLookup[pArr[n].left] = pArr[n].right;
		}

		return pArrLookup;
	},
	// console.log('pArrLookup("[{"left":1,"right":5}, {"left":7,"right":9}]") : ' + JSON.stringify( helper_pArr_lookup( [{"left":1,"right":5}, {"left":7,"right":9}] )));


	helper_makeSetFrom_pArr: function(pArr){
		var set = [];
		for (var n in pArr){
			if (typeof(pArr[n] !== 'undefined')){
				for (var i = pArr[n].left; i <= pArr[n].right; i++) {
					set.push(String(i));   // <---- Make sure all elements are of type string, due to comparison with (# 6 #).
				}
			}
		}
		return set;
	},
	// console.log('helper_makeSetFrom_pArr("[{"left":1,"right":5}, {"left":7,"right":9}]") : ' + JSON.stringify( helper_makeSetFrom_pArr( [{"left":1,"right":5}, {"left":7,"right":9}] )));


	helper_excludedSet: function(set, subSet){
		
		var Tset = set.slice();

		Tset = Tset.filter( function( element ) {
			return subSet.indexOf( element ) < 0;
		} );

		return Tset;
	},
	// console.log('helper_excludedSet([0,1,2,3,4,5,6,7,8,9], [2,3,4,7,8]): ' + JSON.stringify(helper_excludedSet([0,1,2,3,4,5,6,7,8,9], [2,3,4,7,8])));


	// Added 31/5-2017:
	// This method simplify fractions so e.g. 
	// 		a/b/c --->  a/(b*c)
	//		a/b/c/d --->  a/(b*c*d)
	simplyfyFraction: function(equationSide) {
		console.log('\nsimplyfyFraction - equationSide: ' + equationSide);
		var ob = this.decomposeEquation(equationSide);   // ob = {opObj: opObj, varObj: varObj};
		var divCount = 0, createParenthesis = false, len;
		var mem = [];
		var varLookup = {};  // protocol:  {pos0: var0, pos1: var1, pos2: var2, ...}

		for (var n in ob.varObj) {
			varLookup[ob.varObj[n].pos] = ob.varObj[n].var;
		}
		console.log('simplyfyFraction - varLookup: ' + JSON.stringify(varLookup));

		var TequationSide = equationSide;

		// HANDLE CASE:  a/b/c --->  a/(b*c)  AND  a/b/c/d --->  a/(b*c*d)
		// ===============================================================
		for (var n = 0; n < ob.opObj.length; n++) {
			if ( ((ob.opObj[n].op == '/') && (typeof(ob.opObj[n+1]) !== 'undefined') && (ob.opObj[n+1].op == '/')) || (createParenthesis) ) {
				console.log('simplyfyFraction - A0 - n: ' + n);

				if (!createParenthesis) {
					console.log('simplyfyFraction - A1 - n: ' + n);
					TequationSide = equationSide.substring(0, ob.opObj[n].pos+1) + '(';
					createParenthesis = true;
				}

				if (ob.opObj[n].op == '/') {
					console.log('simplyfyFraction - A2 - n: ' + n);
					TequationSide += varLookup[ob.opObj[n].pos+1]; 
				} 

				if ((typeof(ob.opObj[n+1]) !== 'undefined') && (ob.opObj[n+1].op == '/')) {
					console.log('simplyfyFraction - A4 - n: ' + n);
					TequationSide += '*'; 
				} else {
					console.log('simplyfyFraction - A5 - n: ' + n);
					createParenthesis = false;
					len = varLookup[ob.opObj[n].pos+1].length;
					TequationSide += ')' + equationSide.substr(ob.opObj[n].pos+1 + len);
				}
			}
			
			console.log('simplyfyFraction - TequationSide: ' + TequationSide + ', ob.opObj['+n+'].op: ' + ob.opObj[n].op + ', createParenthesis: ' + createParenthesis);
		}
		console.log('simplyfyFraction - TequationSide 1: ' + TequationSide);

		// HANDLE CASE:  a/(b*c)/e  --->  a/(b*c*e)
		// ========================================
		var pObj = this.returnParenthesisObj_formula_mod(TequationSide);
		var equationSide_mod = pObj.equationSide_mod;
		var parenthesisArr = pObj.parenthesisArr;
		var variable, parenthesis;

		for (var n in parenthesisArr) {
			if ((equationSide_mod.indexOf('/#'+String(n-1)+'#/#')===-1) &&  // If ()/() does not exist on the left side ...
				(equationSide_mod.indexOf('/#'+n+'#/')!==-1) && 			// ... and /()/ exist ...
				(equationSide_mod.indexOf('#/#'+String(n+1)+'#/')===-1)) {  // ... and ()/() does not exist on the right side ...
				
				if (parenthesisArr[n].match(/(\+|\-|\/|\(|\))/g) !== null) {  // If the parenthesis only contains the '*' operator...
					pos = TequationSide.indexOf(parenthesisArr[n]) + parenthesisArr[n].length + 1; // Get the position of the variable "e" in "a/(b*c)/e"
					variable = varLookup[pos];
					parenthesis = parenthesisArr[n];
					parenthesisArr[n] = parenthesisArr[n].substr(0, parenthesisArr[n].length-1) + '*' + variable + ')';
					TequationSide = TequationSide.replace(parenthesis+'/'+variable, parenthesisArr[n]);
				}
			}
		}
		console.log('simplyfyFraction - TequationSide 2: ' + TequationSide);


		return TequationSide;
	},


	// Added 31/5-2017:
	// This method simplify expressions so that a*(b*c)/d  --->  a*b*c/d
	removeMultiplicationParenthesis: function(equationSide) {
		console.log('\nremoveMultiplicationParenthesis - equationSide: ' + equationSide);

		if (equationSide.indexOf('(') !== -1) {  // If there is a perenthesis to begin with...
			console.log('removeMultiplicationParenthesis - A0');
			
			var pObj = this.returnParenthesisObj_formula_mod(equationSide);
			var equationSide_mod = pObj.equationSide_mod;
			var parenthesisArr = pObj.parenthesisArr;

			var ob = this.decomposeEquation(equationSide_mod);   // ob = {opObj: opObj, varObj: varObj};
			console.log('removeMultiplicationParenthesis - ob: ' + JSON.stringify(ob));

			var pos, len;
			console.log('removeMultiplicationParenthesis - equationSide_mod 1: ' + equationSide_mod);

			for (var n in parenthesisArr) {
				if (equationSide_mod.indexOf('/#'+n+'#')===-1) {  // If the parenthesis does not have a '/' operator before it...
					console.log('removeMultiplicationParenthesis - A1');
					pos = equationSide_mod.indexOf('#'+n+'#');
					len = ob.opObj.length;
					for (var i = 0; i < len; i++) {
						console.log('removeMultiplicationParenthesis - A2');

						if (parenthesisArr[n].match(/(\+|\-|\/|\(|\))/g) !== null) {  // If the parenthesis only contains the '*' operator...
							console.log('removeMultiplicationParenthesis - A3');

							parenthesisArr[n] = parenthesisArr[n].substring(1, parenthesisArr[n].length-1);  // remove the perenthesis
						}
					} 
				}
			}
			console.log('removeMultiplicationParenthesis - parenthesisArr: ' + parenthesisArr);

			for (var n in parenthesisArr) {
				equationSide_mod = equationSide_mod.replace('#'+n+'#', parenthesisArr[n]);
			}
			console.log('removeMultiplicationParenthesis - equationSide_mod 2: ' + equationSide_mod);

			equationSide = equationSide_mod;
		}

		return equationSide;
	},


	// Added 30/5-2017:
	// This method decomposes the equation into an object of oprators (opObj) and an object of variables (varObj), each consisting a position to the operator or variable.
	decomposeEquation: function(equation) {
		console.log('\ndecomposeEquation - x - equation: ' + equation);
		equation = equation.replace(/ /g, '');
		var opArr = ['+','-','*','/','(',')','='], opObj = [], varObj = [];
		var pos = -1, searchPos = 0, minPos = 1000000, op = null, count = 0, opFound = true;
		while ((opFound) && (count < 50)) {
			opFound = false;
			console.log('decomposeEquation - count: ' + count + ', pos: ' + pos);
			for (var n in opArr) {
				pos = equation.indexOf(opArr[n], searchPos);
				console.log('decomposeEquation - opArr['+n+']: ' + opArr[n] + ', pos: ' + pos);
				if ((-1<pos) && (pos<minPos)) {
					console.log('decomposeEquation - A1');
					minPos = pos;
					op = opArr[n];
					opFound = true;
				}
			}
			if (opFound) {
				console.log('decomposeEquation - A2');
				opObj.push({'op': op, 'pos': minPos});
				searchPos = minPos+1;
				minPos = 1000000;
			}
			++count;
			console.log('decomposeEquation - count: ' + count + ', opFound: ' + opFound +  ', searchPos: ' + searchPos + ', minPos: ' + minPos);
		}
		console.log('decomposeEquation - x - opObj: ' + JSON.stringify(opObj));

		pos = -1;
		var equationArr = equation.replace(/(\+|\-|\*|\/|\(|\)|\=)/g,'@_@').split('@_@');
		console.log('decomposeEquation - equationArr 1: ' + equationArr);

		equationArr = this.removeEmptyElements(equationArr);
		console.log('decomposeEquation - equationArr 2: ' + equationArr);

		for (var n in equationArr) {
			pos = equation.indexOf(equationArr[n], pos+1);
			varObj.push({'var': equationArr[n], 'pos': pos});
		}
		console.log('decomposeEquation - x - varObj: ' + JSON.stringify(varObj));

		return {opObj: opObj, varObj: varObj};
	},


	/**
     * DESCRIPTION: 
     * 
     * EXAMPLES OF USE:
     *      console.log('removeEmptyElements: ' + JSON.stringify(removeEmptyElements([1,2,,3,,4,'',5,'',6])));
     */ 
    removeEmptyElements : function(Tarray){
        console.log('removeEmptyElements - Tarray: ' + JSON.stringify(Tarray));
        for (var i in Tarray){
            if (Tarray[i] === '') {
                Tarray.splice(i, 1);
            }
        }
        return Tarray;
    },

    
    // ADDED 1/5-2017:
    // ===============
    // If an equationSide (either leftSide or rightSide) is in the simple fraction form a*b/(a*d) (or b/(a*d)*a), then this function reduces the equationSide:
    // 		a*b/(a*d)  --->  b/(d)
    reducedEquation_simpelFraction: function(equation) {
    	console.log('\nreducedEquation_simpelFraction - equation: ' + equation);

    	equation = equation.replace(/ /g, '');

    	var eqArr = equation.split('=');  // leftSide = eqArr[0], rightSide = eqArr[1]

    	for (var n in eqArr) {
	    	if (eqArr[n].match(/(\+|\-)/g) === null) {  // If the eqArr[n] only contains the '*' or the '/' operators or parenthesis...

	    		var sideArr = eqArr[n].split('/');
	    		if (sideArr.length == 2) {  // If sideArr.length == 2, then there is ONE fraction present... 
	    			
	    			var nominator = sideArr[0];
	    			var denominator = sideArr[1];

	    			var ob_nominator = decomposeEquation(nominator);
	    			var ob_denominator = decomposeEquation(denominator);

		   //  		var pObj = returnParenthesisObj_formula_mod(eqArr[n]);
		   //  		var equationSide_mod = pObj.equationSide_mod;
					// var parenthesisArr = pObj.parenthesisArr;

		    		var ob = decomposeEquation(equationSide_mod);
		    		for (var n in ob_nominator.varObj) {
		    			for (var m in ob_denominator.varObj) {
		    				if (ob_nominator.varObj[n] == ob_denominator.varObj[m]) {
		    					// termArr.splice(n, 1);
		    				}
		    			}
		    		}
		    	}
	    	} 
	   	}

    },


    removeVarAndOperatorFromdecomposedEquation: function(composedEqObj, variable){

    	console.log('\nremoveVarAndOperatorFromdecomposedEquation - composedEqObj: ' + JSON.stringify(composedEqObj, null, 4) + ', variable: ' + variable);

    	var eqLength = 0;
    	for (var n in composedEqObj.varObj) {
    		eqLength += composedEqObj.varObj[n].var.length;
    	}
    	eqLength += composedEqObj.opObj.length;  // Add the length of all the operators, each having length of one char.  
    	console.log('removeVarAndOperatorFromdecomposedEquation - eqLength: ' + eqLength);

    	var varLookup = {};
    	for (var n in composedEqObj.opObj) {
			varLookup[composedEqObj.opObj[n].pos] = composedEqObj.opObj[n].op;
		}

    	for (var n in composedEqObj.varObj) {
    		console.log('removeVarAndOperatorFromdecomposedEquation - n: ' + n);
    		if (composedEqObj.varObj[n].var == variable) {
    			console.log('removeVarAndOperatorFromdecomposedEquation - A0');

    			var pos_obBefore = composedEqObj.varObj[n].pos-1;
    			var pos_obAfter = composedEqObj.varObj[n].pos + composedEqObj.varObj[n].var.length;
    			console.log('removeVarAndOperatorFromdecomposedEquation - pos_obBefore: ' + pos_obBefore + ', pos_obAfter: ' + pos_obAfter);

    			var op_before = (varLookup[pos_obBefore] !== 'undefined')? varLookup[pos_obBefore] : null;
    			var op_after = (varLookup[pos_obAfter] !== 'undefined')? varLookup[pos_obAfter] : null;

    			if ((op_before === null) && (op_after === null)) {
    				console.log('removeVarAndOperatorFromdecomposedEquation - A1');
    			}

    			if (op_before === null) {
    				console.log('removeVarAndOperatorFromdecomposedEquation - A2');

    				if (op_after !== null) { 
    					console.log('removeVarAndOperatorFromdecomposedEquation - A3');

    					if ((op_after == '+') || (op_after == '*')) {
    						console.log('removeVarAndOperatorFromdecomposedEquation - A4');

    						composedEqObj.varObj.splice(n, 1);
    					} 
    				}
    			}

    		}
    	}
    },

    // ADDED 13/6-2017:
    // This function removes the parenthesis around a single variable: (c) ---> c. So eg. a*(b)/(c) = 3  --->  a*b/c = 3
    removeParenthesisAroundSingleVariable: function(formula) {

    	console.log('\nremoveParenthesisAroundSingleVariable - formula 1: ' + formula);

    	var dObj = this.decomposeEquation(formula);
    	console.log('removeParenthesisAroundSingleVariable - dObj: ' + JSON.stringify( dObj ));
    	for (var n in dObj.varObj) {
    		// if (true) {   // Make a recognition for trigonometric functions here?
    			formula = formula.replace('('+dObj.varObj[n].var+')', dObj.varObj[n].var);
    		// }
    	}
    	console.log('removeParenthesisAroundSingleVariable - formula 2: ' + formula);
    	
    	return formula;
    },


	findNextOperator: function(formula) {
		// formula = formula.replace(/ /g, '').replace(/\*/g, '');
		formula = formula.replace(/ /g, '');
		console.log('\nfindNextOperator - formula: ' + formula);

		formula = this.removeParenthesisAroundSingleVariable(formula);
		console.log('findNextOperator - formula 1: ' + formula);

		var formulaArr = formula.split('=');
		// var targetSide = (formulaArr[0].indexOf(fObj.target)!==-1)? formulaArr[0] : formulaArr[1];  // select the side of the the formula on which fObj.target is located.
		
		
		var NumOfTargets_leftSide = formulaArr[0].split(this.fObj.target).length-1; 	// <--- ADDED 9/6-2017
		var NumOfTargets_rightSide = formulaArr[1].split(this.fObj.target).length-1;	// <--- ADDED 9/6-2017
		console.log('isolateTarget > findNextOperator - NumOfTargets_leftSide: ' + NumOfTargets_leftSide + ', NumOfTargets_rightSide: ' + NumOfTargets_rightSide);

		// if (NumOfTargets_leftSide == NumOfTargets_rightSide) {  	// <--- ADDED 9/6-2017  // COMMENTED OUT 13/6-2017
		// 	alert('KRITISK FEJL FRA "solver.js" - findNextOperator(formula): Ligningen har ingen løsning da NumOfTargets_leftSide = NumOfTargets_rightSide = ' + NumOfTargets_rightSide);
		// 	return 0;
		// }

		// if (formulaArr[0].indexOf(this.fObj.target)!==-1) {   // select the side of the the formula on which fObj.target is located. <--- COMMENTED OUT 9/6-2017
		if (NumOfTargets_leftSide > NumOfTargets_rightSide) {	// If eg. x*x*a = x*b  --->  x = a/b  <--- ADDED 9/6-2017
			var targetSide = this.removeOuterParenthesisAroundNonSpecialTerms(formulaArr[0]);
			var nonTargetSide = this.removeOuterParenthesisAroundNonSpecialTerms(formulaArr[1]);
			var varSide = 'left';
		} else {
			var targetSide = this.removeOuterParenthesisAroundNonSpecialTerms(formulaArr[1]);
			var nonTargetSide = this.removeOuterParenthesisAroundNonSpecialTerms(formulaArr[0]);
			var varSide = 'right';
		}
		console.log('findNextOperator - nonTargetSide 1: ' + nonTargetSide);
		console.log('findNextOperator - targetSide 1: ' + targetSide);

		if (targetSide != this.fObj.target) {

			targetSide = this.addParenthesisAroundNegativeTerms(targetSide);   // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
			console.log('findNextOperator - targetSide 2: ' + targetSide);

			targetSide = this.addParenthesisAroundFunctions(targetSide);      // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
			console.log('findNextOperator - targetSide 2: ' + targetSide);

			var iObj = this.create_iObj(targetSide);
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
			var pArr = this.outerParenthesisBound(targetSide);
			console.log('findNextOperator - pArr: ' + JSON.stringify(pArr));

			var TtargetSide = this.removeParenthesis_formula(targetSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
			console.log('findNextOperator - TtargetSide: ' + TtargetSide);    

			iObj_red = this.removeParenthesis_iObj(iObj, pArr);							// <-------- (#-2-#) IMPORTANT : iObj needs to be similar to targetSide - see (#-1-#) above.
			console.log('findNextOperator - iObj_red: ' + JSON.stringify(iObj_red));

			iObj_ops = this.removeNumAndCharsAndOperators_iObj(iObj_red);				// Array of operators "+" and "-", which might be empty if "*" and "/" are the only operators used.
			console.log('findNextOperator - iObj_ops: ' + JSON.stringify(iObj_ops) + ', fObj: ' + JSON.stringify(this.fObj));

			var selected_op = this.reduceOperators(iObj_ops); 
			console.log('findNextOperator - selected_op: ' + JSON.stringify(selected_op));

			console.log('findNextOperator - iObj_ops 2: ' + JSON.stringify(iObj_ops));
			var reducingTerm = this.findReducingTerm(selected_op, iObj, iObj_ops, targetSide);
			console.log('findNextOperator - reducingTerm: ' + reducingTerm);

			var inverseOperator = this.findInverseOperator(selected_op, reducingTerm, targetSide);
			console.log('findNextOperator - inverseOperator: ' + inverseOperator);


			var targetSide_red = this.reduceSide(targetSide, inverseOperator, reducingTerm, TtargetSide); // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
			console.log('findNextOperator - targetSide_red 1: ' + targetSide_red);

			targetSide_red = this.simplyfyFraction(targetSide_red);
			console.log('findNextOperator - targetSide_red 2: ' + targetSide_red);

			targetSide_red = this.removeMultiplicationParenthesis(targetSide_red);
			console.log('findNextOperator - targetSide_red 3: ' + targetSide_red);


			nonTargetSide_red = this.addReducingTermOnNonTargetSide(nonTargetSide, inverseOperator, reducingTerm);  // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
			console.log('findNextOperator - nonTargetSide_red 1: ' + nonTargetSide_red);

			nonTargetSide_red = this.simplyfyFraction(nonTargetSide_red);
			console.log('findNextOperator - nonTargetSide_red 2: ' + nonTargetSide_red);

			nonTargetSide_red = this.removeMultiplicationParenthesis(nonTargetSide_red);
			console.log('findNextOperator - nonTargetSide_red 3: ' + nonTargetSide_red);


			var reducableFormula = (varSide == 'left')? targetSide_red+'='+nonTargetSide_red : nonTargetSide_red+'='+targetSide_red;
			console.log('findNextOperator - reducableFormula: ' + reducableFormula);

			// prepareNonTargetSide(targetSide_red);

			var termArr = this.identifyInvolvedTerms(iObj, iObj_ops);
			console.log('findNextOperator - termArr: ' + JSON.stringify(termArr));

			// var reducedTargetSide = this.reduceTargetSide(termArr, iObj_ops, inverseOperator, reducingTerm);   // <------------------  GAMMEL MED FEJL <--- COMMENTED OUT 31/5-2017
			// var reducedTargetSide = this.reduceTargetSide_2(targetSide, inverseOperator, reducingTerm);   // <------------------  NY MED FEJL
			var reducedTargetSide = this.reduceTargetSide_3(targetSide, inverseOperator, reducingTerm); // ADDED 31/5-2017
			console.log('findNextOperator - reducedTargetSide: ' + reducedTargetSide);

			var reducedNonTargetSide = this.reduceTargetSide_3(nonTargetSide, inverseOperator, reducingTerm); // ADDED 8/6-2017
			console.log('findNextOperator - reducedNonTargetSide 0: ' + reducedNonTargetSide);                  // ADDED 8/6-2017

			// BUGFIX ADDED 8/6-2017:
			// If reduceTargetSide_3() cannot reduce nonTargetSide, then add the "add" the reducingTerm by addReducingTermOnNonTargetSide() _AND_ use simplyfyFraction() and removeMultiplicationParenthesis() to beautify the nonTargetSide.
			if (nonTargetSide == reducedNonTargetSide) {  // ADDED 8/6-2017
				reducedNonTargetSide = this.addReducingTermOnNonTargetSide(nonTargetSide, inverseOperator, reducingTerm);  // The reduced targetSide, eg. the inverseOperator and reducingTerm "operating" on the targetSide.
				console.log('findNextOperator - reducedNonTargetSide 1: ' + reducedNonTargetSide); 

				reducedNonTargetSide = this.simplyfyFraction(reducedNonTargetSide);
				console.log('findNextOperator - reducedNonTargetSide 2: ' + reducedNonTargetSide); 

				reducedNonTargetSide = this.removeMultiplicationParenthesis(reducedNonTargetSide);
				console.log('findNextOperator - reducedNonTargetSide 3: ' + reducedNonTargetSide); 
			}

			// var reducedFormula = (varSide == 'left')? reducedTargetSide+'='+nonTargetSide_red : nonTargetSide_red+'='+reducedTargetSide; // COMMENTED OUT 8/6-2017
			// console.log('findNextOperator - reducedFormula: ' + reducedFormula);															// COMMENTED OUT 8/6-2017
			var reducedFormula = (varSide == 'left')? reducedTargetSide+'='+reducedNonTargetSide : reducedNonTargetSide+'='+reducedTargetSide;	// ADDED 8/6-2017
			console.log('findNextOperator - reducedFormula: ' + reducedFormula);															// ADDED 8/6-2017

			// this.reduceTargetSide_2(targetSide, inverseOperator, reducingTerm); // Commented out 19/5-2017
			// this.reduceTargetSide_3(targetSide, inverseOperator, reducingTerm); // Added 19/5-2017

			this.memObj.stepVars.push({formula: formula, formulaArr: formulaArr, targetSide: targetSide, iObj: iObj, iObj_ops: iObj_ops, selected_op: selected_op, reducingTerm: reducingTerm, inverseOperator: inverseOperator, reducableFormula: reducableFormula, reducedFormula: reducedFormula}); // Save all variables.

			return true;  // fObj.target has NOT been isolated!

		} else {

			return false;  // fObj.target has been isolated!
		}
	},
	// console.log('\n================================================================================\n ');
	// findNextOperator('sin(a)*x = k');					// <-------------   NOTE: Fra d. 14/2-2017 bliver hele ord opfattet som een variabel ---> lav oversættelselisste/lookup til inverse funktioner.
	// console.log('\n================================================================================\n ');
	// findNextOperator('-a*x = k');					// <-------------   FEJL:  "" (ingenting) bliver forslået som reducingTerm. (#-5-#)  <------ OK NU! (#-5-#) 
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/x = k');					
	// console.log('\n================================================================================\n ');
	// findNextOperator('x/a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*x = k');					
	// console.log('\n================================================================================\n ');
	// findNextOperator('x*a = k');					
	// console.log('\n================================================================================\n ');
	// findNextOperator('a+x = k');					
	// console.log('\n================================================================================\n ');
	// findNextOperator('x+a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a-x = k');					
	// console.log('\n================================================================================\n ');
	// findNextOperator('x-a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b + x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b + x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b - x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b - x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c + x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b/c + x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c - x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b/c - x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*x - c = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b/x - c = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c*x - d = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b/c/x - d = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c*x*e*f - d = k');		   // <-------------   FEJL:  e*f bliver forslået som reducingTerm. (#-4-#)   <------ OK NU! (#-4-#)
	// console.log('\n================================================================================\n ');
	// findNextOperator('a/b/c/x/e/f - d = k');           // <-------------   FEJL:  e/f bliver forslået som reducingTerm. (#-4-#)   <------ OK NU! (#-4-#)
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c*x*e*f = k');		 
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*b*c*x = k');		 
	// console.log('\n================================================================================\n ');
	// findNextOperator('x/(3*(1 + a/b))= k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(3*(1 + a*x/b))= k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(3*(1 + a*x/b)) + c = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(3*(1 + a/b)) + x = k');       // <-------------   FEJL:  (3*(1 + a/b)) bliver forslået som reducingTerm. (#-3-#) <------ OK NU! (#-3-#)
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(3*(1 + a*x/b))*((a+b)*(3*(1+c))) + c = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*(1 + a*x/b)= k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*(1 + a*x/b)/c= k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*(1 + a*x/b)/c + h - j = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3 + (1 + a*x/b)/c + h - j = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x/c = k + 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x*c = k + 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x/c = k * 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x*c = k * 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x+c = k * 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x-c = k * 2');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x+c = 1');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x-c = 1');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x*c = 1');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x/c = 1');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x+c = 0');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x-c = 0');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x*c = 0');
	// console.log('\n================================================================================\n ');
	// findNextOperator('3*x/c = 0');
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('(a*x+c-c)/a = (k-c)/a');      // <------------------------  NOTE: her er "x" isoleret hvis man blot "reducere" 2 gange på venstresiden (#-6-#)
	// console.log('\n================================================================================\n ');
	// findNextOperator('a*x+c-c = k-c');      
	// console.log('\n================================================================================\n ');
	// findNextOperator('x = k*c/3');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a+x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('a-x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('-x+a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('x+a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('b+x+a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('-a+x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('-a-x = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('x-a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('-x-a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('b-a+x = k');
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('a*x = k');
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('x*a = k');
	// console.log('\n================================================================================\n ');
	// findNextOperator('1/(x+a)+2/b + c = k'); 
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('1/(x+a)+2/b = k - c'); 
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('1/(x+a)+2/b=k-c-2/b'); 
	// console.log('\n================================================================================\n ');
	// findNextOperator('2/b + x = k - c'); 
	// // console.log('\n================================================================================\n ');
	// // findNextOperator('a+x = k'); 


	isolateTarget: function(formula){

		console.log('isolateTarget - formula: ' + formula);

		this.memObj.stepVars = [];

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

		while ((this.findNextOperator(formula)) && (count < 25)) {
			console.log('isolateTarget - memObj('+count+'): ' + JSON.stringify(this.memObj));

			formula = this.memObj.stepVars[this.memObj.stepVars.length-1].reducedFormula;
			formula_red = this.memObj.stepVars[this.memObj.stepVars.length-1].reducableFormula;

			formulaSteps += '('+count+')  '+((count<10)?' ':'')+formula+'\n';
			formulaReductionSteps += '('+count+')  '+((count<10)?' ':'')+formula_red+'\n';

			combinedSteps += '('+count2+')  '+((count<10)?' ':'')+formula_red+'\n';
			++count2;
			combinedSteps += '('+count2+')  '+((count<10)?' ':'')+formula+'\n';

			++count;
			++count2;
		}
		console.log('isolateTarget - memObj: ' + JSON.stringify(this.memObj, null, 4));

		console.log('isolateTarget - formulaSteps: ' + formulaSteps);
		console.log('isolateTarget - combinedSteps: ' + combinedSteps);

		// alert('formulaSteps: ' + formulaSteps + '\ncombinedSteps: ' + combinedSteps);
	},
	// console.log('\n================================================================================\n ');
	// isolateTarget('-b+x-a = k');
	// isolateTarget('-b-x-a = k');   // <----- FEJL - 23/2 kl 14:35
	// isolateTarget('b*x*a = k');            // <-------  NOTE: FIX at x = k/a/b   <==>  k/(a*b)
	// isolateTarget('1/x + c = k');
	// isolateTarget('1/(x+a) + c = k'); 

	// isolateTarget('a-x = k'); // <----- FEJL - 23/2 kl 14:35


	// isolateTarget('1/(x+a)+2/b + c = k'); // <----- FEJL - 23/2 kl 14:35
	// isolateTarget('1/(x+a)+2/(3+b) + c = k'); // <----- FEJL - 23/2 kl 14:35

	// isolateTarget('DeltaE = x*m*Delta_T');  // <--------  TEST af brug af '_' i størrelser i ligning. 27/2

	// This function perform the action of finding 'b' (aka 'reducing term') for use in the reduceingStep: 
	//		ax + b = y  <==>  ax + b - b = y - b
	findReducingTerm: function(selected_op, iObj, iObj_ops, targetSide){

		console.log('\nfindReducingTerm - selected_op: ' + JSON.stringify(selected_op) + ', iObj: ' + JSON.stringify(iObj) + ', iObj_ops: ' + JSON.stringify(iObj_ops) + ', targetSide: ' + targetSide);
		
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
			reducingTerm = this.returnElement(termArr, selected_op.index, false);
		}

		if ((selected_op.val == '*') || (selected_op.val == '+') || (selected_op.val == '-')){ 
			console.log('findReducingTerm - A2');
			console.log('findReducingTerm - fObj.index: ' + typeof(this.fObj.index) + ', selected_op.index: ' + typeof(selected_op.index));
			if (parseInt(this.fObj.index) < parseInt(selected_op.index)){  // If the fObj.target is located before the selected operator, then select the term after the operator:
				console.log('findReducingTerm - A3');
				reducingTerm = this.returnElement(termArr, selected_op.index, false);
			} else {							 // If the fObj.target is located after the selected operator, then select the term before the operator:
				console.log('findReducingTerm - A4');
				reducingTerm = this.returnElement(termArr, selected_op.index, true);
			}
		}
		console.log('findReducingTerm - reducingTerm 0: ' + reducingTerm);

		// ADDED 1/6-2017:     <------  VIGTIG: FEJL hvis nedenstående kodeblok aktiveres!
		// ===============
		// The popurse of this code-block is to optimize the following situation: when a = b/(c*d*x)  ---->  reducingTerm = (c*d*x), which causes the program to go through the 
		// formulaSteps: 
		// 		(0)   a=b/(c*d*x)
		// 		(1)   a*c*d*x=b
		// 		(2)   a*c*x=b/d
		// 		(3)   a*x=b/(d*c)
		// 		(4)   x=b/(d*c*a)
		// BUT a more optimal approach would be to make a check so that, if only the "*" operator is used, then reducingTerm = x, which causes the program to go through the
		if (reducingTerm.match(/(\+|\-|\/)/g) === null) {  // If the reducingTerm only contains the '*' operator or parenthesis...
			console.log('findReducingTerm - B0');

			console.log('findReducingTerm - fObj.target: ' + JSON.stringify( this.fObj ));

			if (reducingTerm.indexOf(this.fObj.target) !== -1) {
				console.log('findReducingTerm - B1');

				reducingTerm = this.fObj.target;
			}
		}

		return reducingTerm;
	},


	returnElement: function(Tarray, length, termBefore) {
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
	},



	findInverseOperator: function(selected_op, reducingTerm, targetSide){  
		console.log('\nfindInverseOperator - selected_op: ' + JSON.stringify( selected_op ) + ', reducingTerm: ' + reducingTerm + ', targetSide: ' + targetSide);
		// var inverseOperator, cOp;  				// <-----------  COMMENTED OUT 1/6-2017
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};
		var inverseOperator = inversOpsLookup[selected_op.val];  //  ADDED 1/6-2017
		var cOp;					  				// <-----------  ADDED 1/6-2017
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
	},


	// This function perform the action: 
	//		ax + b = y  <==>  ax + b - b = y - b
	addReducingTermOnNonTargetSide: function(nonTargetSide, inverseOperator, reducingTerm){
		var pArr = this.outerParenthesisBound(nonTargetSide);
		console.log('addReducingTermOnNonTargetSide - pArr: ' + JSON.stringify(pArr));

		var TtargetSide = this.removeParenthesis_formula(nonTargetSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
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

		equationSide = this.reduceSide(nonTargetSide, inverseOperator, reducingTerm, TtargetSide);
		console.log('addReducingTermOnNonTargetSide - equationSide: ' + equationSide); 

		return equationSide;
	},


	// This function perform the action on ONE of the equation sides (right or left, determined by the string "equationSide"): 
	//		ax + b = y  <==>  ax + b - b = y - b
	reduceSide: function(equationSide, inverseOperator, reducingTerm, TtargetSide){
		
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
	},



	removeOuterParenthesisAroundNonSpecialTerms: function(equationSide) {

		var pArr = this.outerParenthesisBound(equationSide);
		console.log('removeOuterParenthesisAroundNonSpecialTerms - pArr: ' + JSON.stringify(pArr));

		var TequationSide = this.removeParenthesis_formula(equationSide, pArr);    
		console.log('removeOuterParenthesisAroundNonSpecialTerms - TtargetSide: ' + TequationSide); 

		// if ((equationSide.indexOf('(-')!==0) && (TequationSide.length==0)) {
		if (TequationSide.length==0) {
			return equationSide.substring(1, equationSide.length-1);
		} else {
			return equationSide;
		}
	},
	// console.log('removeOuterParenthesisAroundNonSpecialTerms("a*(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("a*(b+x)"));
	// console.log('removeOuterParenthesisAroundNonSpecialTerms("c(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("c(b+x)"));
	// console.log('removeOuterParenthesisAroundNonSpecialTerms("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("(b+x)"));
	// console.log('removeOuterParenthesisAroundNonSpecialTerms("(b+x)"): ' + removeOuterParenthesisAroundNonSpecialTerms("(-b+x)"));  // <------ MEGET VIGIGT: Her er et hul i strategien om at negative størrelser angivet med (-a). OK nu, idet (-b+x) --> -b+x --> (-b)+x senere i programmet.


	// ======================
	// 		NOT IN USE:       Denne funktion er muligvis overflødig, idet -a*x = k  <==>  (-a)*x/(-a) = k/(-a)  _og_  -a+x = k  <==>  (-a)+x-(-a) = k-(-a)
	// ======================
	removeOuterParenthesisAroundNegativeTerm: function(term) {
		if (term.indexOf('(-') === 0){
			return term.substring(1, term.length-1);
		} else {
			return term;
		}
	},
	// console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("a*(-3)"));
	// console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("1(-3)"));
	// console.log('removeOuterParenthesisAroundNegativeTerm("a*(-3)"): ' + removeOuterParenthesisAroundNegativeTerm("(-3)"));



	// This function perform the action: 
	//		ax + b - b = y - b  <==>  ax = y - b
	reduceTargetSide: function(termArr, iObj_ops, inverseOperator, reducingTerm){
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
	},


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
	reduceTargetSide_2: function(equationSide, inverseOperator, reducingTerm){
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

		console.log('\nreduceTargetSide_2 - equationSide 1: ' + equationSide + ', inverseOperator 1: ' + inverseOperator + ', reducingTerm 1: ' + reducingTerm);

		var pArr = this.outerParenthesisBound(equationSide);
		console.log('reduceTargetSide_2 - pArr: ' + JSON.stringify(pArr));

		var pObj = this.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
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
	},

	// console.log('reduceTargetSide_2 - Test: ' + 'b*x*a'.replace('*'+'a', ''))


	// ADDED 19/5-2017:
	// ================
	// This function perform the action: 
	//		ax + b - b = y - b  <==>  ax = y - b
	reduceTargetSide_3: function(equationSide, inverseOperator, reducingTerm){
		var inversOpsLookup = {'/':'*', '*':'/', '+':'-', '-':'+'};	

		console.log('\nreduceTargetSide_3 - equationSide 1: ' + equationSide + ', inverseOperator 1: ' + inverseOperator + ', reducingTerm 1: ' + reducingTerm);

		var pArr = this.outerParenthesisBound(equationSide);
		console.log('reduceTargetSide_3 - pArr: ' + JSON.stringify(pArr));

		var pObj = this.returnParenthesisObj_formula(equationSide, pArr, reducingTerm);   
		console.log('reduceTargetSide_3 - pObj: ' + JSON.stringify(pObj)); 

		var TequationSide = pObj.formula_mod;
		var parenthesisArr = pObj.parenthesisArr;


		console.log('reduceTargetSide_3 - TequationSide 1: ' + TequationSide + ', inverseOperator 2: ' + inverseOperator + ', reducingTerm 2: ' + reducingTerm);

		// var pos_begin = null, pos_end = null;
		// var opBefore = null, opEnd = null 

		var pos = -1;
		var loopCount = 0;
		var reducingTerm_exist = true;

		while ((TequationSide == pObj.formula_mod) && (reducingTerm_exist) && (loopCount < 10)) {

			var pos_begin = null, pos_end = null;
			var opBefore = null, opEnd = null 

			// var pos = equationSide.indexOf(inversOpsLookup[inverseOperator]+reducingTerm);
			pos = TequationSide.indexOf(reducingTerm, pos+1);
			console.log('reduceTargetSide_3 - pos: ' + pos + ', loopCount: ' + loopCount + ', reducingTerm_exist: ' + reducingTerm_exist);
			if (pos !== -1) {
				console.log('reduceTargetSide_3 - A0');

				if (pos == 0) {
					console.log('reduceTargetSide_3 - A1');

					pos_begin = pos;
					pos_end = reducingTerm.length-1;

					// if (TequationSide.length >= pos_end+1) {   	// Commented out 19/5-2017
					if (TequationSide.length > pos_end+1) {			// Added 19/5-2017
						console.log('reduceTargetSide_3 - A2');

						opEnd = TequationSide.substring(pos_end+1, pos_end+2);

					}
				}

				if ((pos > 0) && (pos < TequationSide.length - reducingTerm.length)) {
					console.log('reduceTargetSide_3 - A3');

					pos_begin = pos;
					pos_end = pos + reducingTerm.length-1;

					opEnd = TequationSide.substring(pos_end+1, pos_end+2);
					opBefore = TequationSide.substring(pos_begin-1, pos_begin);
				}

				if ((pos > 0) && (pos == TequationSide.length - reducingTerm.length)) {
					console.log('reduceTargetSide_3 - A4');

					pos_begin = pos;
					pos_end = TequationSide.length-1;

					opBefore = TequationSide.substring(pos_begin-1, pos_begin);
				}

				console.log('reduceTargetSide_3 - opBefore 1: _' + opBefore + '_ , opEnd 1: _' + opEnd + '_');

				opBefore = (opBefore=='(')? null : opBefore;    // ADDED 6/6-2017
				opEnd = (opEnd==')')? null : opEnd;				// ADDED 6/6-2017
				console.log('reduceTargetSide_3 - opBefore 2: _' + opBefore + '_ , opEnd 2: _' + opEnd + '_');  // ADDED 6/6-2017

				// ==================================

				if (inverseOperator == '+') { 
					console.log('reduceTargetSide_3 - A5');
					if (opBefore == '-')  {
						console.log('reduceTargetSide_3 - A6');

						if ((opEnd == '+') || (opEnd == '-')) {
							console.log('reduceTargetSide_3 - A7');

							TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
						}
						if (opEnd === null) {
							console.log('reduceTargetSide_3 - A8');

							if (opBefore+reducingTerm == TequationSide) {
								console.log('reduceTargetSide_3 - A8b');

								TequationSide = TequationSide.replace(opBefore+reducingTerm, '0');
							} else {
								console.log('reduceTargetSide_3 - A8c');

								TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
							}
						}
					}
				}

				if (inverseOperator == '-') { 
					console.log('reduceTargetSide_3 - A9');

					if (opBefore === null)  {
						console.log('reduceTargetSide_3 - A10');

						if (opEnd == '-') {
							console.log('reduceTargetSide_3 - A11');

							TequationSide = TequationSide.replace(reducingTerm+opEnd, opEnd);
						}

						if (opEnd == '+') {
							console.log('reduceTargetSide_3 - A11b');

							TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
						}

						if (opEnd === null) {
							console.log('reduceTargetSide_3 - A11c');

							TequationSide = TequationSide.replace(reducingTerm, '0');
						}
					}
					if (opBefore == '+')  {
						console.log('reduceTargetSide_3 - A12');

						if ((opEnd == '+') || (opEnd == '-')) {
							console.log('reduceTargetSide_3 - A13');

							TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
						}
						if (opEnd === null) {
							console.log('reduceTargetSide_3 - A14');

							TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
						}
					}
				}


				// From performStrikeThrough 19/5-2017:
				// ====================================
				if (inverseOperator == '*') { 		
					console.log('reduceTargetSide_3 - A15');

					if ((opBefore == '/') && ((opEnd == '*') || (opEnd == '/'))) {
					// if (((opBefore == null) || (opBefore == '*') || (opBefore == '/')) && ((opEnd == '*') || (opEnd == '/'))){  // Added 1/5-2017
						console.log('reduceTargetSide_3 - A16');

						TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opEnd);
						// TequationSide = TequationSide.replace(opBefore+reducingTerm+opEnd, opBefore+reducingTerm+st+opEnd);
					}

					// if ((opEnd == null) && (opBefore == '/')){
					if ((opEnd === null) && ((opBefore == '*') || (opBefore == '/'))){  // Added 1/5-2017 
						console.log('reduceTargetSide_3 - A17');

						TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
						// TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
					}

					if ((opBefore === null) && (opEnd == '*')){  // Added 1/5-2017 
						console.log('reduceTargetSide_3 - A17-B');

						TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
						// TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
					}
				}


				// From performStrikeThrough 19/5-2017:
				// ====================================
				if (inverseOperator == '/') {  	
					console.log('reduceTargetSide_3 - A18');

					// if (((opBefore == null) || (opBefore == '*')) && ((opEnd == '*') || (opEnd == '/'))){
					if (((opBefore === null) || (opBefore == '*')) && (opEnd == '*')){  
						console.log('reduceTargetSide_3 - A19');

						TequationSide = TequationSide.replace(reducingTerm+opEnd, '');
						// TequationSide = TequationSide.replace(reducingTerm+opEnd, reducingTerm+st+opEnd);
					}

					if (((opBefore === null) || (opBefore == '*')) && (opEnd == '/')){ 
					// if (((opBefore == null) || (opBefore == '*') || (opBefore == '/')) && ((opEnd == '*') || (opEnd == '/'))){  // Added 1/5-2017
						console.log('reduceTargetSide_3 - A20');

						TequationSide = TequationSide.replace(reducingTerm+opEnd, '1'+opEnd);   // ----> 1/a
						// TequationSide = TequationSide.replace(reducingTerm+opEnd, reducingTerm+st+opEnd);
					}

					if ((opEnd === null) && (opBefore == '*')){
					// if ((opEnd == null) && ((opBefore == '*') || (opBefore == '/'))){  // Added 1/5-2017
						console.log('reduceTargetSide_3 - A21');

						TequationSide = TequationSide.replace(opBefore+reducingTerm, '');
						// TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
					}

					if ((opBefore === null) && (opEnd === null)){  // Added 22/5-2017
						console.log('reduceTargetSide_3 - A22');

						TequationSide = TequationSide.replace(reducingTerm, '1');
						// TequationSide = TequationSide.replace(opBefore+reducingTerm, opBefore+reducingTerm+st);
					}
				}


				

			} else {
				console.log('reduceTargetSide_3 - A23');

				reducingTerm_exist = false;
			}

			++loopCount;

		} // END WHILE

		console.log('reduceTargetSide_3 - TequationSide 2: ' + TequationSide + ', inverseOperator 3: ' + inverseOperator + ', reducingTerm 3: ' + reducingTerm);

		for (var n in parenthesisArr) {
			TequationSide = TequationSide.replace('#'+n+'#', parenthesisArr[n]);
		}
		console.log('reduceTargetSide_3 - TequationSide 3: ' + TequationSide + ', inverseOperator 4: ' + inverseOperator + ', reducingTerm 4: ' + reducingTerm);

		TequationSide = this.removeOnesAndZeros(TequationSide);
		console.log('reduceTargetSide_3 - TequationSide 4: ' + TequationSide);

		return TequationSide;
	},


	removeOnesAndZeros: function(equation) {
		console.log('\nremoveOnesAndZeros - equation 0: ' + equation);
	
		equation = equation.replace('*1*', '*').replace('*1', '').replace('1*', '');
		console.log('removeOnesAndZeros - equation 1: ' + equation);

		equation = equation.replace(/(\+|\-)0\+/, '').replace(/(\+|\-)0\-/, '-').replace(/(\+|\-)0/, '').replace(/0\+/, '').replace(/0\-/, '-');
		console.log('removeOnesAndZeros - equation 2: ' + equation);
		
		return equation;
	},	



	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	// This function does much of what findNextOperator() does for the targetSide, but does it just for the nonTargetSide:
	extractInfoFromEquationSide: function(equationSide){

		equationSide = this.addParenthesisAroundNegativeTerms(equationSide);   // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
		console.log('extractInfoFromEquationSide - '+equationSide+' - targetSide 1: ' + equationSide);

		equationSide = this.addParenthesisAroundFunctions(equationSide);      // This has to be before create_iObj AND outerParenthesisBound, so that the modifications to targetSide get incorporated.
		console.log('extractInfoFromEquationSide - '+equationSide+' - targetSide 2: ' + equationSide);

		var iObj = this.create_iObj(equationSide);
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj: ' + JSON.stringify(iObj));

		var pArr = this.outerParenthesisBound(equationSide);
		console.log('extractInfoFromEquationSide - '+equationSide+' - pArr: ' + JSON.stringify(pArr));

		var TtargetSide = this.removeParenthesis_formula(equationSide, pArr);      // <-------- (#-1-#) IMPORTANT : targetSide needs to be similar to iObj - see (#-2-#) below. NOTE: This is only used as a sanity-check
		console.log('findNextOperator - TtargetSide: ' + TtargetSide);    

		iObj_red = this.removeParenthesis_iObj(iObj, pArr);							// <-------- (#-2-#) IMPORTANT : iObj needs to be similar to targetSide - see (#-1-#) above.
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj_red: ' + JSON.stringify(iObj_red));

		iObj_ops = this.removeNumAndCharsAndOperators_iObj(iObj_red);				// Array of operators "+" and "-", which might be empty if "*" and "/" are the only operators used.
		console.log('extractInfoFromEquationSide - '+equationSide+' - iObj_ops: ' + JSON.stringify(iObj_ops) + ', fObj: ' + JSON.stringify(this.fObj));

		termArr = this.identifyInvolvedTerms(iObj, iObj_ops);
		console.log('extractInfoFromEquationSide - '+equationSide+' - termArr: ' + JSON.stringify(termArr));


		// identifyReducingTerms(termArr, iObj_ops);


		return {equationSide: equationSide, iObj: iObj, pArr: pArr, iObj_red: iObj_red, iObj_ops: iObj_ops, termArr: termArr};
	},

	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	// This function has a replica of the first code found in findReducingTerm(), which has the purpose of isolating the involved 
	// terms, eg. sin(a)*x = k  -->  ["(sin(a))","x"] for the left side og the formula.
	identifyInvolvedTerms: function(iObj, iObj_ops){

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
	},



	// ======================
	// 		NOT IN USE:       // Disse funktioner skal gøre det muligt at finde hvilke størrelser der kan reduceres - se (#-6-#) foroven!
	// ======================
	identifyReducingTerms: function(termArr, iObj_ops){
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

} // END solverClass


var sc = Object.create(solverClass);
// sc.isolateTarget('1/(x+a) + c = k'); // <----- FEJL - Rettelser d. 6/6-2017 har introduceret fejl her!
// sc.isolateTarget('-b-x-a = k');   // <----- FEJL - 23/2 kl 14:35   <-----  skyldes fejl i reduceTargetSide_3 - 6/6-2017
// sc.isolateTarget('(-b)-x = k+a'); // <----- FEJL - 23/2 kl 14:35 - Dette er her fejlen opstår fra testen på linjen for oven!  <-----  skyldes fejl i reduceTargetSide_3 - 6/6-2017
// sc.isolateTarget('1/(x*a) = k');  // <------ Løser ligning OK, men (1) det er en lang OG (2) resultatet præsenteres som 1/k/a = x, som skal omskrives til 1/(k*a) = x. <--- OK 6/6-2017 

														//=====================================================================================================
// TESTS MED REN MULTIPLIKATION OG DIVISION:  <-------- //  VIGTIGT: Alle fejl ift isolateTarget skyldes at der er fejl i reduceTargetSide_3!  -  6/6-2017  <--- Ikke korrekt: findNextOperator kan også give anledning til fejl - 8/6-2017
// =========================================			//=====================================================================================================
// sc.isolateTarget('a=x*b');
// sc.isolateTarget('a=x/b');
// sc.isolateTarget('a=x*b/c');
// sc.isolateTarget('a=x*b/(c*d)');
// sc.isolateTarget('a=b/(c*d*x)');  // <----- FEJL EFTER MOD 1/6-2017. <--- OK 6/6-2017
// sc.isolateTarget('a=b/x'); 
// sc.isolateTarget('a=b/(c*x)');   // <----- FEJL EFTER MOD 1/6-2017.  <--- OK 6/6-2017
// sc.isolateTarget('b/(c*x)=a');
// sc.isolateTarget('a=1/(x*c)');
// sc.isolateTarget('a*b=c*x*b');  // <----- FEJL EFTER MOD 6/6-2017  <--- OK 8/6-2017
// sc.isolateTarget('a=c*x');
// sc.isolateTarget('a*x=c*x*x');   // <---- FEJL EFTER 9/6-2017 - SE NEDENSTÅENDE LINJE  <--- OK 9/6-2017
// sc.isolateTarget('a*x*x*x=c*x*x');  // <---- DETTE VIRKER 9/6-2017 - SE OVENSTÅENDE LINJE: Lav et fix i findNextOperator() ift "pege" på den rigtige equationSide 
// sc.isolateTarget('a/(b*x) = x*c/x');  // <---- FEJL 13/6-2017
// sc.isolateTarget('a/(b*x)*x=x*c/x*x');  // <---- FEJL 13/6-2017
// sc.isolateTarget('x/(a*b)=c');  // VIGTIGT: Løser ligning OK, men der skal lave en mulighed for at gange med "(a*b)" i ligning.js


// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_2(targetSide, inverseOperator, reducingTerm));
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_2('a+b/(a+d)', '-', 'a'));

// console.log('solverClass - reducedTargetSide_2 : ' + sc.reduceTargetSide_2('a/(a+d)+a', '-', 'a'));  // <------ 19/5-2017: Sammenlign denne med nedenstående!
// console.log('solverClass - reducedTargetSide_3 : ' + sc.reduceTargetSide_3('a/(a+d)+a', '-', 'a'));  // <------ 19/5-2017: Sammenlign denne med ovenstående!


////////////////////////////////////////////////////////////////////////////////////
//
//		19/5-2017
//	    ---------
//		VIGTIGT: Lav alle de mulige kombinationer af operatore "+", "-", "*", "/", og sikre tilfælde:
//
//		reduceTargetSide_3 - linje 1320
//
//		reduceTargetSide_3('a', '-', 'a')  	---->  0
//		reduceTargetSide_3('-a', '+', 'a')  ---->  0
//		reduceTargetSide_3('b/a', '/', 'b') ---->  1/a
//		reduceTargetSide_3('1/a', '*', 'a') ---->  1
//
//////////////////////////////////////////////////////////////////////////////////// 

// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('a*b', '/', 'b'));
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('b*a', '/', 'b'));
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('a/b', '/', 'b'));
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('b/a', '/', 'b'));  // <----- FEJL 19/5-2017: Returnere "a", Korrekt: "1/a". NOTE: husk også at reduceTargetSide_3('a', '-', 'a') skal returnere "0". <--- OK 19/5-2017
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('b', '/', 'b'));

// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('1/a', '*', 'a'));

// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('a', '-', 'a'));	// <----- FEJL 19/5-2017: Returnere "a", Korrekt: "0".  <--- OK 19/5-2017
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('-a', '-', 'a'));

// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('-a', '+', 'a'));	// <----- FEJL 19/5-2017: Returnere "", Korrekt: "0".  <--- OK 19/5-2017
// console.log('solverClass - reducedTargetSide : ' + sc.reduceTargetSide_3('a', '+', 'a'));



// console.log('returnParenthesisObj_formula_mod("a*b*c*(d+e)/(a*d*e)*(d*e*f)"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("a*b*c*(d+e)/(a*d*e)*(d*e*f)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*d)"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("c*b/(b*d)")) );
// console.log('returnParenthesisObj_formula_mod("a*b*c/a*s"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("a*b*c/a*s")) );
// console.log('returnParenthesisObj_formula_mod("a*b/(b*b*b)"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("a*b/(b*b*b)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*b)"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("c*b/(b*b)")) );
// console.log('returnParenthesisObj_formula_mod("c*b/(b*d)"): ' + JSON.stringify( sc.returnParenthesisObj_formula_mod("c*b/(b*d)")) );


// console.log('decomposeEquation("a/b=a*x"): ' + JSON.stringify( sc.decomposeEquation("a/b=a*x")) );
// console.log('decomposeEquation("a/b*d-e+f*h=a*x"): ' + JSON.stringify( sc.decomposeEquation("a/b*d-e+f*h=a*x")) );
// console.log('decomposeEquation("a"): ' + JSON.stringify( sc.decomposeEquation("a")) );
// console.log('decomposeEquation("(a+b)"): ' + JSON.stringify( sc.decomposeEquation("(a+b)")) );
// console.log('decomposeEquation("(a+b)*c"): ' + JSON.stringify( sc.decomposeEquation("(a+b)*c")) );


// console.log('simplyfyFraction("a/b/c"): ' + sc.simplyfyFraction("a/b/c"));
// console.log('simplyfyFraction("a/b/c"): ' + sc.simplyfyFraction("a/b/c/d"));
// console.log('simplyfyFraction("a/b*c/d"): ' + sc.simplyfyFraction("a/b*c/d"));
// console.log('simplyfyFraction("a/b/c+d"): ' + sc.simplyfyFraction("a/b/c+d"));
// console.log('simplyfyFraction("3+a/b/c+d"): ' + sc.simplyfyFraction("3+a/b/c+d"));
// console.log('simplyfyFraction("a/(b*c)/d+e"): ' + sc.simplyfyFraction("a/(b*c)/d+e"));
// console.log('simplyfyFraction("a/(b*c)/(d*e)"): ' + sc.simplyfyFraction("a/(b*c)/(d*e)"));


// console.log('removeMultiplicationParenthesis("(a*b)"): ' + sc.removeMultiplicationParenthesis("(a*b)"));
// console.log('removeMultiplicationParenthesis("(a*b)*c"): ' + sc.removeMultiplicationParenthesis("(a*b)*c"));
// console.log('removeMultiplicationParenthesis("c*(a*b)"): ' + sc.removeMultiplicationParenthesis("c*(a*b)"));
// console.log('removeMultiplicationParenthesis("c*(a*b)*d"): ' + sc.removeMultiplicationParenthesis("c*(a*b)*d"));
// console.log('removeMultiplicationParenthesis("c*(a*b)/d"): ' + sc.removeMultiplicationParenthesis("c*(a*b)/d"));
// console.log('removeMultiplicationParenthesis("c+(a*b)"): ' + sc.removeMultiplicationParenthesis("c+(a*b)"));
// console.log('removeMultiplicationParenthesis("c+(a*b)+d"): ' + sc.removeMultiplicationParenthesis("c+(a*b)+d"));
// console.log('removeMultiplicationParenthesis("(a*b)*(c*d)"): ' + sc.removeMultiplicationParenthesis("(a*b)*(c*d)"));
// console.log('removeMultiplicationParenthesis("(a*b)+(c*d)"): ' + sc.removeMultiplicationParenthesis("(a*b)+(c*d)"));
// console.log('removeMultiplicationParenthesis("(a*b)/(c*d)"): ' + sc.removeMultiplicationParenthesis("(a*b)/(c*d)"));
// console.log('removeMultiplicationParenthesis("(a*b)/(c*d)*k"): ' + sc.removeMultiplicationParenthesis("(a*b)/(c*d)*k"));


// console.log('removeVarAndOperatorFromdecomposedEquation(decomposedEqObj, "a"): eq=(a+b): ' + sc.removeVarAndOperatorFromdecomposedEquation(sc.decomposeEquation("(a+b)"), 'a') );


// console.log('removeParenthesisAroundSingleVariable("(a*b)/(c)*k"): ' + sc.removeParenthesisAroundSingleVariable("(a*b)/(c)*k") );
// console.log('removeParenthesisAroundSingleVariable("(a)/(c)*k"): ' + sc.removeParenthesisAroundSingleVariable("(a)/(c)*k") );
// console.log('removeParenthesisAroundSingleVariable("(sin(x))/(c)*k"): ' + sc.removeParenthesisAroundSingleVariable("(sin(x))/(c)*k") );



// 1/(3*(1+a*x/b))*((a+b)*(3*(1+c)))+c=k
// a/b*d-e+f*h=a*x
// 01234567890123456789012345678901234567890
// |         |         |         |         |
// abcdefghijklmnopqrstuvwxyzæøå
// ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ


