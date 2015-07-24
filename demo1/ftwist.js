
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

function initBoard()
{ 
   board=document.getElementById('gamecanvas');
   board.handRing=document.getElementById('handring');
   board.handRing.angle=0;
   board.handRing.targetAngle=240;
   board.handRing.spinTime=5000;
   board.handRing.fullSpinTime=5000;
   board.handRing.spinSpeedMax=720;
   board.handRing.spinSpeed=720;
   board.width=300;
   board.height=300;
   board.numberZones=9;
   board.zones=new Array(board.numberZones);
   
	
   board.Ctx= board.getContext('2d');
   

   updateBoard();
   requestAnimationFrame(tickBoard)
}

function tickBoard(time)
{
	if (board.lastFrameStart) 
		board.frameTime=time-board.lastFrameStart;
	else
		board.frameTime=100;
	board.lastFrameStart=time;

    //work the hand spinner
	var hr=board.handRing;
    if (hr.spinTime>0) {
		hr.spinSpeed=(hr.spinTime/hr.fullSpinTime)*hr.spinSpeedMax;
		hr.angle+=hr.spinSpeed*board.frameTime/1000;
		hr.spinTime-=board.frameTime;
		hr.style.transform="rotateZ("+hr.angle+"deg)";
	}
	
	requestAnimationFrame(tickBoard)
}

initBoard();