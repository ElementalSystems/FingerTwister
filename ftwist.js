
var board;
//javascript stuff
function updateBoard()
{
	//clear board
	board.Ctx.fillStyle = "#000";    	
	board.Ctx.fillRect(0,0,300,300);
		
	for (var i=0;i<9;i+=1) {
		if (board.zones[i].isHidden) continue;
		var row=Math.floor(i/3);
		var col=i%3;
	    
		switch (row) {
			case 0://Red
	            board.Ctx.fillStyle = board.zones[i].isTouched?"#F00":"#500";    	
				board.Ctx.strokeStyle = "#F00";    					
				break;
			case 1: //green
			    board.Ctx.fillStyle = board.zones[i].isTouched?"#0F0":"#050";    	
				board.Ctx.strokeStyle = "#0F0";    	
				break;
			case 2: //blue
			    board.Ctx.fillStyle = board.zones[i].isTouched?"#00F":"#005";    	
				board.Ctx.strokeStyle = "#00F";    					
				break;
		}
			
		board.Ctx.fillRect(5+col*100,5+row*100,90,90);
		if (board.zones[i].isTarget) {
		  board.Ctx.lineWidth=2;
		  board.Ctx.strokeRect(5+col*100,5+row*100,90,90);
        }		
 		if (board.zones[i].isHolding&&(!board.zones[i].isTouched)) { //violation zone
		  board.Ctx.lineWidth=5;
		  board.Ctx.strokeStyle = "#FFF";    					
		  board.Ctx.strokeRect(5+col*100,5+row*100,90,90);
        }		
 		
	}
	
	
}

function touchBoard(event)
{
	event.preventDefault();
	//first clear all touches
	for (var i=0;i<board.numberZones;i+=1) {
	  board.zones[i].prevTouched=board.zones[i].isTouched;
	  board.zones[i].isTouched=false;
	}
	var tch=event.touches;
	for (var j=0;j<tch.length;j+=1) {
		var touch=tch[j];
		var x=Math.floor(touch.clientX*3/board.offsetWidth);
		var y=Math.floor(touch.clientY*3/board.offsetHeight);
		if ((x>2)||(y>2)) continue;
		board.zones[x+y*3].isTouched=true;
	}
	for (var i=0;i<board.numberZones;i+=1) {
		//check for a target hit
		if (board.zones[i].isTouched&&board.zones[i].isTarget) {//pressed down a target
		    //check that we are otherwise other legal
			var allGood=true;
			for (var t=0;t<board.numberZones;t+=1)
				if ((board.zones[t].isHolding)&&(!board.zones[t].isTouched)) //if we are not all legit then screw it 
					allGood=false;
			if (allGood) {
			  board.fingers[board.spinTargetFinger]=i;
			  board.zones[i].isHolding=true;
			  startSpinners();			
			}
		}
	}
	
    updateBoard();
	return false;
}

function startSpinners()
{
   board.spinTargetFinger=randomInt(0,2);
   board.spinTargetCol=randomInt(0,2);
   
   startSpinner(board.handRing,-board.spinTargetFinger*120);
   board.colRing.spinTime=1500+randomInt(0,1000);
   startSpinner(board.colRing,-board.spinTargetCol*120);	
   for (var i=0;i<board.numberZones;i+=1) {	   
	   board.zones[i].isTarget=false;
	   board.zones[i].isHidden=false;	  
   }
   
   setTimeout(spinnerActionComplete,2000);
}

function spinnerActionComplete()
{
   //start the timer
   //remove the previous finger
   var finZone=board.fingers[board.spinTargetFinger];
   if (finZone>=0) {
      board.zones[finZone].isHolding=false;
	  board.zones[finZone].isHidden=true;	  
   }
  
   //set up the targets and remove last target
   for (var i=0;i<board.numberZones;i+=1) {	   
	   board.zones[i].isTarget=(!board.zones[i].isHolding)&&(Math.floor(i/3)==board.spinTargetCol);	   
   }
   updateBoard();
   //setTimeout(startSpinners,8000);
}

function randomInt(min,max) {
     return Math.floor(min+(max-min+1)*Math.random());
}


function initBoard()
{ 
   board=document.getElementById('gamecanvas');
   board.handRing=document.getElementById('handring');
   board.handRing.angle=0;
   board.handRing.spinTime=2000;
   board.handRing.spinTurns=2;
   board.colRing=document.getElementById('colring');
   board.colRing.startSpin=true;
   board.colRing.angle=0;
   board.colRing.spinTurns=-3;
   board.width=300;
   board.height=300;
   board.numberZones=9;
   board.zones=[{},{},{},{},{},{},{},{},{}];
   board.fingers=[-1,-1,-1];
   startSpinners();
	
   board.Ctx= board.getContext('2d');
   

   updateBoard();
   requestAnimationFrame(tickBoard)
}

function interpolate(sv,ev,st,et,time)
{
   var r=(time-st)/(et-st);
   return sv+(ev-sv)*r;   
}

function interpolateSO(sv,ev,st,et,time)
{
   var r=(time-st)/(et-st);
   r=2*r-r*r;
   return sv+(ev-sv)*r;   
}

function interpolateSISO(sv,ev,st,et,time)
{
   var r=(time-st)/(et-st);
   r=3*r*r-2*r*r*r;
   return sv+(ev-sv)*r;   
}

function startSpinner(hr,target)
{	
	hr.startSpin=true;
	hr.spinOffset=target;
}

function tickSpinner(hr,time)
{
	if (hr.startSpin) {
		hr.timeStart=time;
		hr.timeEnd=time+hr.spinTime;
		hr.angleStart=hr.angle%360;
		
		hr.angleEnd=360*hr.spinTurns+hr.spinOffset;
		hr.isSpinning=true;
		hr.startSpin=false;
	}
    if (hr.isSpinning) {
		if (hr.timeEnd<time) { //we're done
		  hr.isSpinning=false;
		  hr.angle=hr.angleEnd;
		} else {
		  hr.angle=interpolateSO(hr.angleStart,hr.angleEnd,hr.timeStart,hr.timeEnd,time);
		}
		hr.style.transform="rotateZ("+hr.angle+"deg)";
	}
	
}

function tickBoard(time)
{
	if (board.lastFrameStart) 
		board.frameTime=time-board.lastFrameStart;
	else
		board.frameTime=100;
	board.lastFrameStart=time;

	
    //work the hand spinner
	tickSpinner(board.handRing,time);
	tickSpinner(board.colRing,time);
	
	requestAnimationFrame(tickBoard)
}

initBoard();