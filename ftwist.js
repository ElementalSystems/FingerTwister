
var board=document.getElementById('gamecanvas');
//javascript stuff
function updateBoard()
{
	
	board.Ctx.fillStyle = "#F00";
    board.Ctx.fillRect(5,5,90,90);
	board.Ctx.fillRect(105,5,90,90);
	board.Ctx.fillRect(205,5,90,90);
	
	board.Ctx.fillStyle = "#0F0";
	board.Ctx.fillRect(5,105,90,90);
	board.Ctx.fillRect(105,105,90,90);
	board.Ctx.fillRect(205,105,90,90);
	
	board.Ctx.fillStyle = "#00F";
	board.Ctx.fillRect(5,206,90,90);
	board.Ctx.fillRect(105,205,90,90);
	board.Ctx.fillRect(205,205,90,90);
	
}

function initBoard()
{ 
   board.width=300;
   board.height=300;
	
   board.Ctx= board.getContext('2d');
   

   updateBoard();
}

initBoard();