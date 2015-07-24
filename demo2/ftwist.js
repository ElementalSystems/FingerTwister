
var board;
//javascript stuff
function updateBoard()
{
	
	board.Ctx.fillStyle = board.zones[0]?"#F00":"#500";
    board.Ctx.fillRect(5,5,90,90);
	board.Ctx.fillStyle = board.zones[1]?"#F00":"#500";
    board.Ctx.fillRect(105,5,90,90);
	board.Ctx.fillStyle = board.zones[2]?"#F00":"#500";
    board.Ctx.fillRect(205,5,90,90);
	
	board.Ctx.fillStyle = board.zones[3]?"#0F0":"#050";
    board.Ctx.fillRect(5,105,90,90);
	board.Ctx.fillStyle = board.zones[4]?"#0F0":"#050";
    board.Ctx.fillRect(105,105,90,90);
	board.Ctx.fillStyle = board.zones[5]?"#0F0":"#050";
    board.Ctx.fillRect(205,105,90,90);
	
	board.Ctx.fillStyle = board.zones[6]?"#00F":"#005";    
	board.Ctx.fillRect(5,206,90,90);
	board.Ctx.fillStyle = board.zones[7]?"#00F":"#005";    
	board.Ctx.fillRect(105,205,90,90);
	board.Ctx.fillStyle = board.zones[8]?"#00F":"#005";    
	board.Ctx.fillRect(205,205,90,90);
	
}

function touchBoard(event)
{
	event.preventDefault();
	//first clear all touches
	for (var i=0;i<board.numberZones;i+=1)
	  board.zones[i]=0;
	var tch=event.touches;
	for (var j=0;j<tch.length;j+=1) {
		var touch=tch[j];
		var x=Math.floor(touch.clientX*3/400.0);
		var y=Math.floor(touch.clientY*3/400.0);
		if ((x>2)||(y>2)) continue;
		board.zones[x+y*3]=1;
	}
    updateBoard();
	return false;
}

function startSpinners()
{
   startSpinner(board.handRing,randomInt(0,2)*120);
   startSpinner(board.colRing,randomInt(0,2)*120);	
   setTimeout(startSpinners,5000);
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
   board.colRing.spinTime=2500;
   board.colRing.spinTurns=-3;
   board.width=300;
   board.height=300;
   board.numberZones=9;
   board.zones=new Array(board.numberZones);
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
		hr.angleEnd=360*hr.spinTurns-hr.angleStart+hr.spinOffset;
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