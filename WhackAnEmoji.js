/* Whack An Emoji Game
 */
 
/* Define Canvas */

var canvas;
var stage;

/* Background */

var titleBg;

/* Title View */

var titleBgImg = new Image();
var titleBg;
var playBtnImg = new Image();
var playBtn;
var creditsBtnImg = new Image();
var creditsBtn;
var titleView = new Container();

/* Credits */

var creditsViewImg = new Image();
var creditsView;

/* Game Bg */

var gameBgImg = new Image();
var gameBg;

/* Alert */

var alertBgImg = new Image();
var alertBg;

/* Score */

var score;

/* emojis */

var emojiImg = new Image();
var emoji;

var emojisX = [80, 198, 338, 70, 225, 376, 142, 356];
var emojisY = [11, 51, 34, 110, 136, 96, 211, 186];
var lastemoji;

/* Variables */

var centerX = 240;
var centerY = 160;
var gfxLoaded = 0;

var timerSource;
var currentemojis = 0;
var emojisHit = 0;
var totalemojis = 10;
				 
function Main()
{
	/* Link Canvas */
	
	canvas = document.getElementById('WhackAnEmoji');
  	stage = new Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  		
  	/* Load GFX */
  		
  	titleBgImg.src = 'titleBg.png';
  	titleBgImg.name = 'titleBg';
  	titleBgImg.onload = loadGfx;
  	
  	gameBgImg.src = 'gameBg.png';
  	gameBgImg.name = 'gameBg';
  	gameBgImg.onload = loadGfx;
	
	playBtnImg.src = 'playBtn.png';
	playBtnImg.name = 'playBtn';
	playBtnImg.onload = loadGfx;
	
	creditsBtnImg.src = 'creditsBtn.png';
	creditsBtnImg.name = 'creditsBtn';
	creditsBtnImg.onload = loadGfx;
	
	creditsViewImg.src = 'creditsView.png';
	creditsViewImg.name = 'credits';
	creditsViewImg.onload = loadGfx;
	
	alertBgImg.src = 'alertBg.png';
	alertBgImg.name = 'alertBg';
	alertBgImg.onload = loadGfx;
	
	emojiImg.src = 'emoji.png';
	emojiImg.name = 'emoji';
	emojiImg.onload = loadGfx;
	
	/* Ticker */
	
	Ticker.setFPS(30);
	Ticker.addListener(stage);
}

function loadGfx(e)
{
	if(e.target.name = 'titleBg'){titleBg = new Bitmap(titleBgImg);}
	if(e.target.name = 'gameBg'){gameBg = new Bitmap(gameBgImg);}
	if(e.target.name = 'playBtn'){playBtn = new Bitmap(playBtnImg);}
	if(e.target.name = 'creditsBtn'){creditsBtn = new Bitmap(creditsBtnImg);}
	if(e.target.name = 'alertBg'){alertBg = new Bitmap(alertBgImg);}
	/* --CreditsView
	   --emojis */
	
	gfxLoaded++;
	
	if(gfxLoaded == 7)
	{
		addTitleView();
	}
}

function addTitleView()
{	
	/* Add GameView BG */
	
	stage.addChild(gameBg);
	
	/* Title Screen */
	
	playBtn.x = centerX - 25;
	playBtn.y = centerY + 35;
	
	creditsBtn.x = centerX - 40;
	creditsBtn.y = centerY + 80;
				
	titleView.addChild(titleBg, playBtn, creditsBtn);
	
	stage.addChild(titleView);
	
	startButtonListeners('add');
	
	stage.update();
}

function startButtonListeners(action)
{
	if(action == 'add')
	{
		titleView.getChildAt(1).onPress = showGameView;
		titleView.getChildAt(2).onPress = showCredits;
	}
	else
	{
		titleView.getChildAt(1).onPress = null;
		titleView.getChildAt(2).onPress = null;
	}
}

function showCredits()
{
	playBtn.visible = false;
	creditsBtn.visible = false;
	creditsView = new Bitmap(creditsViewImg);
	stage.addChild(creditsView);
	creditsView.x = -203;
	
	Tween.get(creditsView).to({x:0}, 200).call(function(){creditsView.onPress = hideCredits;});
}

function hideCredits()
{
	playBtn.visible = true;
	creditsBtn.visible = true;
	Tween.get(creditsView).to({x:-203}, 200).call(function(){creditsView.onPress = null; stage.removeChild(creditsView); creditsView = null;});
}

function showGameView()
{
	Tween.get(titleView).to({x: -480}, 200).call(function(){startButtonListeners('rmv'); stage.removeChild(titleView); titleView = null; showemoji();});
	score = new Text('0' + '/' + totalemojis, 'bold 15px Arial', '#EEE');
	score.x = 58;
	score.y = 21;
	stage.addChild(score);
}

function showemoji()
{
	if(currentemojis == totalemojis)
	{
		showAlert();
	}
	else
	{	
		if(lastemoji != null)
		{
			lastemoji.onPress = null;
			stage.removeChild(lastemoji);
			stage.update();
			lastemoji = null;
		}
		
		var randomPos = Math.floor(Math.random() * 8);
		var emoji = new Bitmap(emojiImg);
		
		emoji.x = emojisX[randomPos];
		emoji.y = emojisY[randomPos];
		stage.addChild(emoji);
		emoji.onPress = emojiHit;
		
		lastemoji = emoji;
		lastemoji.scaleY = 0.3;
		lastemoji.y += 42;
		stage.update();
		
		Tween.get(lastemoji).to({scaleY: 1, y: emojisY[randomPos]}, 200).wait(1000).call(function(){currentemojis++; showemoji()});
	}
}

function emojiHit()
{
	emojisHit++;
	score.text = emojisHit + '/' + totalemojis;
	
	lastemoji.onPress = null;
	stage.removeChild(lastemoji);
	lastemoji = null;
	stage.update();
}

function showAlert()
{
	alertBg.x = centerX - 120;
	alertBg.y = -80;
	stage.addChild(alertBg);
	
	Tween.get(alertBg).to({y:centerY - 80}, 200).call(function()
	{
		Ticker.removeAllListeners();
		var score = new Text(emojisHit + '/' + totalemojis, 'bold 20px Arial', '#EEE');
		score.x = 220;
		score.y = 205;
		stage.addChild(score);
		stage.update();
	});
}