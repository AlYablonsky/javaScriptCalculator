
$(document).ready(function () {
    
  // Stores user input for later calculations
    var inputs = [""];
	
// String to store current input string	
    var totalString;
  
// Operators array for validation without the "."	
    
	var operators1 = ["+", "-", "*", "/"];

// Operators array for validation with the "." 	

	var operators2 = ["."];
	
// Boolean flag for decimal input false if "." is not present, true otherwise
	
	var isDecimal = false;
	
// Boolean flag for number obtained from total (after pressing "=" sign) , if true pressing a number key or decimal resets the value	
	var isMutable = false;
	
// Numbers for validation	
	var nums = [0,1,2,3,4,5,6,7,8,9];


	
// Updates the result 
	function getValue(input){
		
	
	// Case where inputs.length = 1 and inputs[0] ==="" and input is operator1 "+" "-" "*" "/"  => error
		if (inputs.length === 1 && inputs[0] === "" && operators1.includes(input) === true) {
			
			console.log("Operator w/o Operand");
		}
		
		else if ( isMutable === true && operators2.includes(input) === true) {
			
			inputs =[""];
			inputs.splice(0, 1, "0", input);
			isDecimal = true;
			isMutable = false;
		}
		
		// Case where inputs.length = 1 and inputs[0] ==="" input is operator2 "." => push "0" + input to position 0, and // 1 isDecimal becomes true
		else if (inputs.length === 1 && inputs[0] === "" && operators2.includes(input) === true){
			
			inputs.splice(0, 1, "0", input);
			isDecimal = true;
		}
		

		// Case where inputs.length = 1 and inputs[0] ==="" input is a number 0-9 => push it to position 0
		else if (inputs.length === 1 && inputs[0] === "" &&  nums.includes(Number(input)))  {
			
			inputs.splice(0, 1, input);
			
		}
		
		// Case where inputs.length = 1, and  inputs[0] === "0", input 0-9 overwrites the prior value
		else if ( inputs.length === 1 && inputs[0] === "0" && nums.includes(Number(input)) ) {
			
			inputs.splice(0, 1, input);	
		}
		
		// Case where inputs[inputs.lenght-2] is operator1 "+" "-" "*" "/" and inputs[inputs.lenght-1] is "0", input is 0-9, overwrites the prior value isDecimal becomes false
		else if ( operators1.includes(inputs[inputs.length-2] ) === true && inputs[inputs.length-1] === "0" && nums.includes(Number(input)) ) {
		
			inputs.splice([inputs.length-1], 1, input);
		    isDecimal = false; // may not be necessary	
			}
	
		// Case where inputs[inputs.lenght-1] is operators1 "+" "-" "*" "/" and input is decimal (operators2) , push "0" + input, isDecimal = true 
		else if ( operators1.includes(inputs[inputs.length-1] ) === true &&  operators2.includes(input) === true) {
			
			inputs.push("0" + input);
			isDecimal = true;
		}
		
		
		// Case where isDecimal = true and input is another "." operators2 => illegal operation
		else if ( isDecimal === true && operators2.includes(input) === true) {
			
			console.log("Duplicate '.'");
			
		}
		
		
		// Case where previous positions are "0"-"9", input is decimal point operators2, isDecimal becomed true
		else if ( nums.includes((Number(inputs[inputs.length-1]))) && operators2.includes(input) === true ) {
			inputs.push(input);
			isDecimal = true;
		}
		
		// Case where inputs[length-1] is operators1 and input is operators1 => illegal operation
		else if (  operators1.includes(inputs[inputs.length-1]) === true  && operators1.includes(input) === true) {
				 
			console.log("Illegal operation - consecutive operators1");
				 
		}
		
		
		// Case where input is operators1 "+" "-" "*" "/" , conditions good for pushing into array
		else if (operators1.includes(input) === true) {
			isMutable = false;
			inputs.push(input);
			isDecimal = false;
		}
		
		
		// Case where input is a number, push into array
		else if (nums.includes(Number(input)))  {
		
			if (isMutable === true){
				inputs=[""];
				isMutable = false;
				isDecimal = false;
			}
			
			inputs.push(input);
		}
		update();
	} // End of getValue function
	
	
	// Calculate function
	
	function calculateResult (aString){
		
	var	floatArray = [];
	var oprArray = [];
	var expressionArray = [];	
		
		floatArray = aString.split(new RegExp('[-+*/]', 'g'));
		
		for (var i =0; i < totalString.length; i++){
			
			if (aString.charAt(i) === '+' || aString.charAt(i) === '-' || aString.charAt(i) === '*' || aString.charAt(i) === '/') {
				oprArray.push(aString.charAt(i));
			}
		}
		
		let len = floatArray.length;
		for (var i = 0; i < len; i++){
			expressionArray.push(Number(floatArray[i]));
			if (i < len-1){
			   expressionArray.push(oprArray[i]);
			}
		}
		
		
		let tempVar;
		    for ( var i = 1; i < expressionArray.length - 1; i++){
			
			    if ( expressionArray[i] === '*') { 
				    tempVar = expressionArray[i-1] * expressionArray[i+1]
			        expressionArray.splice(i-1, 3, tempVar );
					i--;
				}
				else if ( expressionArray[i] === '/' ) { 
				    tempVar = expressionArray[i-1] / expressionArray[i+1]
			        expressionArray.splice(i-1, 3, tempVar );
					i--;
				}
			}
			for ( var i = 1; i < expressionArray.length - 1; i++){
			
			    if ( expressionArray[i] === '+' ) { 
				    tempVar = expressionArray[i-1] + expressionArray[i+1]
			        expressionArray.splice(i-1, 3, tempVar );
					i--;
				}
				else if ( expressionArray[i] === '-' ) { 
				    tempVar = expressionArray[i-1] - expressionArray[i+1]
			        expressionArray.splice(i-1, 3, tempVar );
					i--;
				}
			}
		return expressionArray[0];
	}
	
// Updates the output to most current value
	function update(){
		totalString = inputs.join("");
		$("#steps").html(totalString);
		$("#steps1").html(inputs);
	
	}
	
// Evaluates the result but does not print it	
	function getTotal(){
		totalString = inputs.join("");
	    
		// Handle division by 0, exit program
		if (isFinite(calculateResult(totalString)) === false ) {
			inputs =[""];
			$("#steps").html("Undefined: Division by 0");
			$("#steps1").html(inputs);
			return;
		}
			
		// Handle out of bounds values outside +/-1 1e21
		else if (Math.abs(calculateResult(totalString)) >= 1e21) {
			
			inputs =[""];
				$("#steps").html("Value out of bounds");
				$("#steps1").html(inputs);
				return;	
		}
		
	
		// Standard output
		else {
			isMutable = true;
			$("#steps").html(calculateResult(totalString));
			inputs = [""];
		}
		// Replacing the input array values with the obtained calculated result 
			
		 inputs.push(calculateResult(totalString));
		
} 
	
// Code for button click function	
	
	$("button").on("click", function() {
		
		// Case for AC button 
		if (this.id === "deleteAll") {
			inputs = [""];
			update();
			isDecimal = false;
			isMutable = false;	
		}   
				
		// Remove last element CE button
		else if (this.id === "deleteLast") {
	
			var popVal = inputs.pop();
			
			isMutable = false;
			
			// If decimal is removed, provide option to add it later	
			if( popVal === ".") {
				isDecimal = false;
			}
	
			// If operators1 "+","*","-","/" are removed determine whether
			// remaining number is an integer or decimal so as to be able to add 
			// or not add another decimal point
			
			else if (operators1.includes(popVal) === true) {
				
				var iCount = 0;
				isDecimal = false;
				while ( operators1.includes(inputs[inputs.length - (1 + iCount)]) === false && iCount <= inputs.length - 1 ){
					
					if ( inputs[inputs.length - (1 + iCount)] === ".") {
						isDecimal = true;	
						break;
					}
					iCount++;
				}
			}
			
			
			// Provide correct Boolean flags after clearing all of the input array
			else if (inputs.length === 1 && inputs[0] === ""){
				isDecimal = false;
				isMutable = false;
			}
			
			// Initialize input array	
			else if (inputs.length === 0){
				inputs = [""];
				isDecimal = false;
				isMutable = false;
			}
			update();
		}
		// Get completed calculation "="
		else if (this.id === "total") {
	
			getTotal();
		}

		else { // All other id's [0-9], "+", "-" , "*", "/"
				getValue(this.id);
				
		}
			
	});  
	
});  
    