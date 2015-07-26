
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
 		if (board.zones[i].isFoul) { //violation zone
		  board.Ctx.lineWidth=5;
		  board.Ctx.strokeStyle = "#FFF";    					
		  board.Ctx.strokeRect(5+col*100,5+row*100,90,90);
        }		
 		
	}
	
	
}

function checkBoardForFouls()
{
	//check for violation
	board.foul=false;
	for (var t=0;t<board.numberZones;t+=1) {
	  board.zones[t].isFoul=false;
      if (board.zones[t].isTouched) { 
	     if ((board.zones[t].isTarget)||(board.zones[t].isHolding)||(board.zones[t].isHidden))  continue; //we are allowed to touch a target 		 
	  } else {
	     if (!board.zones[t].isHolding) continue; //we're not suppoed to be holdit and we're not		 
      }		
	  //we found a foul!
      board.foul=true;
      board.zones[t].isFoul=true;	  
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
		var x=Math.floor((touch.clientX-board.xPosition)*3/board.offsetWidth);
		var y=Math.floor((touch.clientY-board.yPosition)*3/board.offsetHeight);
		if ((x>2)||(y>2)) continue;
		board.zones[x+y*3].isTouched=true;
	}
	checkBoardForFouls();
	if (!board.foul) {
	  for (var i=0;i<board.numberZones;i+=1) {
		//check for a target hit
		if (board.zones[i].isTouched&&board.zones[i].isTarget) {//pressed down a target
		  board.fingers[board.spinTargetFinger]=i;
		  board.zones[i].isHolding=true;
		  board.score+=Math.floor(board.timeAllowed/1000);
	      startSpinners();
          break;		  
		}
	  }
	}	
    updateBoard();
	return false;
}

function startSpinners()
{
  
  do {
    var targets=0;  
    board.spinTargetFinger=randomInt(0,2);
    board.spinTargetCol=randomInt(0,2);
    for (var i=0;i<board.numberZones;i+=1) {	      
       //check the is an available 
	   board.zones[i].isTarget=false;
	   board.zones[i].isHidden=false;		   
	   if ((Math.floor(i/3)==board.spinTargetCol)&&(!board.zones[i].isHolding)) targets+=1;	   
    }
  } while (targets==0); //try again if we don't have 
  startSpinner(board.handRing,-board.spinTargetFinger*120);
  board.colRing.spinTime=1500+randomInt(0,1000);
  startSpinner(board.colRing,-board.spinTargetCol*120);	  
  board.timeAllowed=board.goalTime;   
  setTimeout(spinnerActionComplete,2000);
  board.level+=1;
  checkBoardForFouls();   
  updateBoard();
}

function spinnerActionComplete()
{
   //remove the previous finger
   var finZone=board.fingers[board.spinTargetFinger];
   if (finZone>=0) {
      board.zones[finZone].isHolding=false;
	  board.zones[finZone].isHidden=true;	  
   }
  
   //set up the targets 
   for (var i=0;i<board.numberZones;i+=1) {	   
	   board.zones[i].isTarget=(!board.zones[i].isHolding)&&(!board.zones[i].isHidden)&&(Math.floor(i/3)==board.spinTargetCol);	   	  
   }
   
   checkBoardForFouls();
   
   updateBoard();
}

function randomInt(min,max) {
     return Math.floor(min+(max-min+1)*Math.random());
}

function resizeBoard()
{
	//General Size to fit screen
   var sw=window.innerWidth;
   var sh=window.innerHeight*2/3;
   var cw=(sw<sh)?sw:sh;
   document.getElementById('gamespace').style.width=cw+"px";
   board.style.height=cw+"px";
   board.handRing.style.bottom=(-cw*.55)+"px";
   board.colRing.style.bottom=(-cw*.5)+"px";
   board.foulIndicator.style.top=cw+"px";
   
   //calculate offset position for touch events
   board.xPosition = 0;
   board.yPosition = 0;
   element=board;
   while (element) {
        board.xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        board.yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
   }
   
}

function initBoard()
{ 
   board=document.getElementById('gamecanvas');

   
   board.foulIndicator=document.getElementById('foulindicator');
   board.timeIndicator=document.getElementById('timeindicator');
   board.scoreIndicator=document.getElementById('scoreindicator');
   board.handRing=document.getElementById('handring');
   board.handRing.angle=0;
   board.handRing.spinTime=2000;
   board.handRing.spinTurns=2;
   board.colRing=document.getElementById('colring');
   board.colRing.angle=0;
   board.colRing.spinTurns=-3;
   
   resizeBoard();
   window.addEventListener('resize',resizeBoard);
   
   
   board.width=300;
   board.height=300;
   board.numberZones=9;
   board.zones=[{},{},{},{},{},{},{},{},{}];
   board.fingers=[-1,-1,-1];
   board.goalTime=12000;
   board.spinTargetFinger=0;
   board.spinTargetCol=0;
   board.timeAllowed=0;
   board.gameOver=true;
   
	
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

  
  function setElementClass(e,cls)
  {
	  if (!e.classList.contains(cls))
		  e.classList.add(cls);
  }
  
  function unsetElementClass(e,cls)
  {
	  if (e.classList.contains(cls))
		  e.classList.remove(cls);
  }
  
function tickBoard(time)
{
	  
	requestAnimationFrame(tickBoard)	
	
	if (board.lastFrameStart) 
		board.frameTime=time-board.lastFrameStart;
	else
		board.frameTime=100;
	
	board.lastFrameStart=time;

	if (board.gameOver) return;
	
    //work the hand spinner
	tickSpinner(board.handRing,time);
	tickSpinner(board.colRing,time);
	
	//Check out the displays
	if (board.foul) 
		setElementClass(board.foulIndicator,"foul");
	else
	    unsetElementClass(board.foulIndicator,"foul");
		
		
	board.timeIndicator.innerHTML=(board.timeAllowed/1000).toFixed(1)+" Secs";
	board.scoreIndicator.innerHTML="Score: "+board.score;
	board.timeAllowed-=board.frameTime;
	  
	if (board.foul) board.timeAllowed-=board.frameTime*3;	  
	  
	if (board.timeAllowed<0) {
		board.gameOver=true;
		unsetElementClass(document.getElementById('gamespace'),'playing');	
		setElementClass(document.getElementById('gamespace'),'gameover');	
		document.getElementById('completestatus').innerHTML="Final Score "+board.score+"!";		
		ga('send', 'event', 'End',board.score);	
		ga('send', 'event', 'EndLevel',board.level);	
	}
	  
}

function startGame(time)
{
  board.zones=[{},{},{},{},{},{},{},{},{}];
  board.fingers=[-1,-1,-1];
   
  board.goalTime=time*1000;
  board.score=0;
  board.level=0;
  board.gameOver=false;  
  board.foul=0;
  setElementClass(document.getElementById('gamespace'),'playing');
  startSpinners();  	
  ga('send', 'event', 'Start'+time);	  
}

function instruct(show)
{
	if (show) setElementClass(document.getElementById('instructions'),'show');
	else unsetElementClass(document.getElementById('instructions'),'show');	
}

function mainmenu()
{
	unsetElementClass(document.getElementById('gamespace'),'gameover');	
}

initBoard();

