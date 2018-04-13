/******CONSTANTS***********/
var runningAverageLength = 5; 

var halfWidth = screen.width/2 ;
var halfHeight = screen.height/2; 
var topLeft = document.getElementById("topLeft");
var topRight = document.getElementById("topRight");
var bottomLeft = document.getElementById("bottomLeft");
var bottomRight = document.getElementById("bottomRight");
//for setRandomPosition
var adjustedWidth = screen.width - 50;
var adjustedHeight = screen.height - 150;
var adjustedHalfWidth = halfWidth; 
var adjustedHalfHeight = halfHeight - 50;
var previousQuadrant = 0; 
/****GLOBALS********/
var quadrant1CalibrationAverage = [1000,1000,1000,1000,1000,1000,1000,1000, 1000, 1000]
var quadrant2CalibrationAverage = [1000,1000,1000,1000,1000,1000,1000,1000, 1000, 1000]
var quadrant3CalibrationAverage = [1000,1000,1000,1000,1000,1000,1000,1000, 1000, 1000]
var quadrant4CalibrationAverage = [1000,1000,1000,1000,1000,1000,1000,1000, 1000, 1000]
var xMovingAverage = [0, 0, 0, 0, 0]; 
var yMovingAverage = [0, 0, 0, 0, 0];
//var xPreviousLocation = 0;
//var yPreviousLocation = 0; 




var yPrediction = 0;
var xPrediction = 0;

$(document).ready(function(){//initialization 
	begin();
	console.log("test");
    
    $("#circle").click(setRandomPosition);


    function determineCalibration(x1,y1){//think about doing separate calibration metrics for each quadrant
    	//find position of the dot
    	console.log("Reached");
    	//find the position of the prediction
    	x2 = xPrediction;
    	y2 = yPrediction; 
    	//run distance formula
    	distance = Math.sqrt(Math.pow((x1-x2),2) + Math.pow((y1-y2),2));
    	var quadrant1DistancePrediction;
    	var quadrant2DistancePrediction;
    	var quadrant3DistancePrediction;
    	var quadrant4DistancePrediction;

    	if (previousQuadrant == 1){//edit q1 distance
    		quadrant1CalibrationAverage.push(distance);
    		quadrant1CalibrationAverage.shift(); 
    		quadrant1DistancePrediction =  quadrant1CalibrationAverage.slice(Math.max(quadrant1CalibrationAverage.length - 10, 1)).reduce(getSum)/10; 
		}
		else if (previousQuadrant == 2){//edit q2 distance
			quadrant2CalibrationAverage.push(distance);
			quadrant2CalibrationAverage.shift(); 
    		quadrant2DistancePrediction =  quadrant2CalibrationAverage.slice(Math.max(quadrant2CalibrationAverage.length - 10, 1)).reduce(getSum)/10; 
		} 
		else if (previousQuadrant == 3){//edit q3 distance
			quadrant3CalibrationAverage.push(distance);
			quadrant3CalibrationAverage.shift();
    		quadrant3DistancePrediction =  quadrant3CalibrationAverage.slice(Math.max(quadrant3CalibrationAverage.length - 10, 1)).reduce(getSum)/10; 
		}
		else if (previousQuadrant == 4){//edit q4 distance
			quadrant4CalibrationAverage.push(distance);
			quadrant4CalibrationAverage.shift(); 
    		quadrant4DistancePrediction =  quadrant4CalibrationAverage.slice(Math.max(quadrant4CalibrationAverage.length - 10, 1)).reduce(getSum)/10; 
		}
    	//write out to screen
    	document.getElementById("distanceQ1").innerHTML = "Distance: " + String(quadrant1CalibrationAverage);
    	document.getElementById("distanceQ2").innerHTML = "Distance: " + String(quadrant2CalibrationAverage);
    	document.getElementById("distanceQ3").innerHTML = "Distance: " + String(quadrant3CalibrationAverage);
    	document.getElementById("distanceQ4").innerHTML = "Distance: " + String(quadrant4CalibrationAverage);
    }
    
	function setRandomPosition(){
		var randLeft = 0;
		var randTop = 0;
		if (previousQuadrant == 0 || previousQuadrant == 4){//place in quadrant 1
			randLeft = getRandomInt(adjustedHalfWidth, adjustedWidth);
			randTop = getRandomInt(1, adjustedHalfHeight);
			determineCalibration(randLeft, randTop); 
			previousQuadrant = 1;
		}
		else if (previousQuadrant == 1){//place in quadrant 2
			randLeft = getRandomInt(1, adjustedHalfWidth);
			randTop = getRandomInt(1, adjustedHalfHeight);
			determineCalibration(randLeft, randTop); 
			previousQuadrant = 2; 
		} 
		else if (previousQuadrant == 2){//place in quadrant 3
			randLeft = getRandomInt(1, adjustedHalfWidth);
			randTop = getRandomInt(adjustedHalfHeight, adjustedHeight);
			determineCalibration(randLeft, randTop); 
			previousQuadrant = 3;
		}
		else if (previousQuadrant == 3){//place in quadrant 4
			randLeft = getRandomInt(adjustedHalfWidth, adjustedWidth);
			randTop = getRandomInt(adjustedHalfHeight, adjustedHeight);
			determineCalibration(randLeft, randTop); 
			previousQuadrant = 4; //send back to quadrant 1
		}
		document.getElementById("score").innerHTML = "X: " + String(randLeft) + " Y: -" + String(randTop) + " current Quadrant: " + String(previousQuadrant); 
		$(this).css("left", randLeft + "px");
		$(this).css("top", randTop +"px");
	}

	function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	function begin(){
		document.getElementById("score").innerHTML = "X: " + String(600) + " Y: -" + String(350);
	}  

});	

function getSum(total, num) {
    return total + num;
}
function distanceFormula(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))	
}


function move() {
	var elem = document.getElementById("myBar");   
	var width = 10;
	var id = setInterval(frame, 10);
	function frame() {
		if (width >= 100) {
			clearInterval(id);
		} else {
			width++; 
			elem.style.width = width + '%'; 
			elem.innerHTML = width * 1  + '%';
		}
	}
}


function quadrantControl(xPrediction, yPrediction){
	if (xPrediction < halfWidth && yPrediction < halfHeight){//show top left
		topLeft.style.backgroundColor = "#AAA";
		bottomLeft.style.backgroundColor = "#FFFFFF";
		topRight.style.backgroundColor = "#FFFFFF";
		bottomRight.style.backgroundColor = "#FFFFFF"; 
	}
	else if (xPrediction > halfWidth && yPrediction < halfHeight){//show top right
		topRight.style.backgroundColor = "#AAA";
		bottomRight.style.backgroundColor = "#FFFFFF";
		topLeft.style.backgroundColor = "#FFFFFF";
		bottomLeft.style.backgroundColor = "#FFFFFF"; 
	} else if (xPrediction< halfWidth && yPrediction > halfHeight){//show bottom left
		bottomLeft.style.backgroundColor = "#AAA"; 
		topRight.style.backgroundColor = "#FFFFFF";
		bottomRight.style.backgroundColor = "#FFFFFF";
		topLeft.style.backgroundColor = "#FFFFFF";
	}
	else if (xPrediction> halfWidth && yPrediction> halfHeight){//show bottom right
		bottomRight.style.backgroundColor = "#AAA";
		bottomLeft.style.backgroundColor = "#FFFFFF"; 
		topRight.style.backgroundColor = "#FFFFFF";
		topLeft.style.backgroundColor = "#FFFFFF";
	}
}

function cleanUpMovingAverageArray(){
	if (xMovingAverage.length > runningAverageLength*2) {
		xMovingAverage.shift();//removes first element to keep the length of the array manageable
	}
	if (yMovingAverage.length > runningAverageLength*2) {
		yMovingAverage.shift();//removes first element to keep the length of the array manageable
	}
}



window.onload = function() {
	var localstorageLabel = 'webgazerGlobalData';
	window.localStorage.setItem(localstorageLabel, null);
	

	webgazer.setRegression('ridge')
	.setTracker('clmtrackr')
	.setGazeListener(function(data, elapsedTime) {
		if (!data) {
			return;
		}
		/*gets moving average for x and y coordinates by storing all predictions and selecting last [runningAverageLength] to average*/
		xMovingAverage.push(data.x); 
		yMovingAverage.push(data.y); 
		xPrediction =  xMovingAverage.slice(Math.max(xMovingAverage.length - runningAverageLength, 1)).reduce(getSum)/runningAverageLength; 
		yPrediction = yMovingAverage.slice(Math.max(yMovingAverage.length - runningAverageLength, 1)).reduce(getSum)/runningAverageLength; 
		cleanUpMovingAverageArray(); 
		quadrantControl(xPrediction, yPrediction);
		//outputs to screen section 
		document.getElementById("prediction").innerHTML = "X: " + String(xPrediction) + " Y: -" + String(yPrediction);
		document.getElementById("tracker").style.left = xPrediction+"px";
		document.getElementById("tracker").style.top = yPrediction+"px";
		
		var cl = webgazer.getTracker().clm;

		//start of section for line drawing and video feedback

		
	}).begin().showPredictionPoints(false);
};

window.onbeforeunload = function() {
		//webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
		window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}


