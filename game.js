var myGamePiece;
var myBackground;
var myFloor=[];
var myScore;
var HEIGHT=400;
var WIDTH=600;
var GRID=20;
var myIslands=[];
var myMonsters=[];
var MONSTERHEIGHT=60;
var fiftypoints;
var score=0;
var bat;
var minionHeight= 60;
var myfriend;
var fireBall=[];
var fireFlower;
var gaming= true;




function startGame() {
    //Game pieces
    gaming= true;
    myFloor=[];
    myIslands=[];
    myMonsters=[];
    fireBall=[];
    myGamePiece = new mainComponent(40, minionHeight, "minion_walking.png", 10, 120, "image");
    myfriend = new component(20, minionHeight / 2, "friend.png", 10, 120, "image");
    for(var i=0; i < 10 ; i+=1){
        
        fireBall.push(new fireBallComponent(GRID, GRID, "fireball1.png", WIDTH + 200, 0 ,"image"));
    }
    pressSpace = new component("40px", "Consolas", "black", 100, HEIGHT /2 , "text");
    pressSpace.text="Press Space Bar to Begin";
    bat = new component(40, 60, "bat_wingsDown.png", WIDTH*2, 300* Math.random() , "image");
    myBackground = new component(WIDTH, HEIGHT, "background.png", 0, 0, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    
    fiftypoints = new component("20px", "Consolas", "yellow", 100, -90, "text");
    fiftypoints.speedY = -2;
    myIslands.push(new component(50, GRID, "ground.png", 100, 300 ,"image"));
    //make multiple islands in an array
    for(var j=1; j<20;j=j+1){
        myIslands.push(new component(50,GRID, "ground.png", Math.random()*WIDTH/2+ j * WIDTH/2, 250* Math.random() + 50 ,"image"));
    }
    
    fireFlower = new component(40, 40, "fireflower.png", myIslands[1].x + myIslands[1].width / 2, myIslands[1].y - 40, "image");
    fireFlower.island=1;
    
    myFloor.push(new component(GRID, GRID, "ground.png", 0,HEIGHT-GRID ,"image"));
    //make ground components
    var xpostion;
    for(var i=1;i<(WIDTH/GRID)+2;i=i+1){
        xpostion=myFloor[i-1].x+GRID;
        if(Math.random()*10<1){
            xpostion += GRID * 3;
        }
        myFloor.push(new component(GRID,GRID, "ground.png", xpostion,HEIGHT-GRID ,"image"));
    }
    
    myMonsters.push(new monsterComponent(40, MONSTERHEIGHT, "chicken1.png", WIDTH+50, 120, "image"));
    
    
    
    myGameArea.start();
}

$(document).ready(startGame);

var myGameArea = {
    //Creat background for game
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.canvas.style.position = "right";
        this.canvas.margin = "20 px"
        //this.canvas.style.zIndex   = 8;
        div = document.getElementById("game");
        
        this.context = this.canvas.getContext("2d");
        
        div.appendChild(this.canvas);
        this.frameNo = 0;
        
        
        //intervals for changing pictures and updateing motion
        //this.batInterval = setInterval(flapWings,200);
        this.monsterInterval = setInterval(monsterswitch,100);
        this.interval = setInterval(updateGameArea, 20);
        //this.fireIneterval = setInterval(fireBallswitch, 100);
        
        //listening for key impots
        window.addEventListener('keydown', function (e) {
                                myGameArea.keys = (myGameArea.keys || []);
                                myGameArea.keys[e.keyCode] = (e.type == "keydown");
                                
                                if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                                e.preventDefault();
                                }
                                
                                
                                })
        window.addEventListener('keyup', function (e) {
                                myGameArea.keys[e.keyCode] = (e.type == "keydown");
                                })
        
    },
    
    //method wipes canvas
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    //stops the game updating interval
    stop : function() {
        gaming = false;
        clearInterval(this.interval);
        clearInterval(this.monsterInterval);
        this.endgame = setInterval(waitSpace, 20);
    }
}
function waitSpace(){
    if (myGameArea.keys && myGameArea.keys[32]) {
        clearInterval(myGameArea.endgame);
        startGame();
    }
    pressSpace.update();
}

var fireballtracker = 0;

//flap the bats wings by changing pictures
var flaptracker= false;
function flapWings(){
    if(flaptracker){
        bat.image.src= "bat_wingsUp.png";
        flaptracker= false;
        bat.height=45;
    }
    else{
        bat.image.src= "bat_wingsDown.png";
        flaptracker= true;
        bat.height = 60;
    }
    
}

//make the monster walk by changing pictures
var walktracker = false;
function monsterswitch(){
    flapWings();
    if(walktracker){
        myMonsters[0].image.src = "chicken2.png";
        walktracker = false;
        
    }else{
        myMonsters[0].image.src = "chicken1.png";
        walktracker = true;
        if(fireballtracker === 0){
            for(var i=0; i < fireBall.length ; i+=1){
                fireBall[i].image.src = "fireball1.png"
            }
            fireballtracker = 1;
        } else if(fireballtracker === 1){
            for(var i=0; i < fireBall.length ; i+=1){
                fireBall[i].image.src = "fireball2.png"
            }
            fireballtracker = 2;
        }
        else {
            for(var i=0; i < fireBall.length ; i+=1){
                fireBall[i].image.src = "fireball3.png"
            }
            fireballtracker = 0;
        }
        
    }
    
    
    
}


//base method of the game objects
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color=color;
    
    if (this.type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
    
    this.speedX = 0;
    this.speedY = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image,
                          this.x,
                          this.y,
                          this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        
        this.x += this.speedX;
        this.y += this.speedY;
    }
}
fireBallComponent.prototype = new component();
function fireBallComponent(width, height, color, x, y, type) {
    this.type = type;
    this.color= color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.gravity = 0.3;
    this.gravitySpeed = 0;
    if (type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
    this.newPos = function() {
        for(var i = 0; i< myFloor.length; i+=1){
            if(this.bonk(myFloor[i])){
                this.speedY = -5;
                this.gravitySpeed=0;
            }
        }
        for(var i = 0; i< myIslands.length; i+=1){
            if(this.bonk(myIslands[i])){
                this.speedY = -5;
                this.gravitySpeed=0;
            }
        }
        for(var i = 0; i< myMonsters.length; i+=1){
            if (this.crashWith(myMonsters[i])){
                this.hide();
                fiftypoints.x = myMonsters[i].x;
                fiftypoints.y = myMonsters[i].y;
                myMonsters[i].x=WIDTH;
                myMonsters[i].y=Math.random()*300;
                myMonsters[i].gravitySpeed=0;
                myMonsters[i].speedY=0;
                myMonsters[i].height = MONSTERHEIGHT;
                score += 50;
            }
        }
        
        if (this.crashWith(bat)){
            this.hide();
            fiftypoints.x = bat.x;
            fiftypoints.y = bat.y;
            bat.x= (WIDTH*3)/2;
            bat.y= 300* Math.random();
            score += 50;
        }
        if (this.y > HEIGHT || this.x < 0){
            this.hide();
        }
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        //this.hitBottom();
    }
    this.bonk = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        } else if(mybottom < othertop + 20){
            return crash;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.hide = function(){
        this.x = WIDTH + 200;
        this.speedY=0;
        
    }
    this.spawn = function(){
        this.x = myGamePiece.x + GRID;
        this.y = myGamePiece.y + myGamePiece.height / 2;
        this.speedX = 3;
        this.gravitySpeed=0;
    }
}

//monster object inherts from component
monsterComponent.prototype = new component();
function monsterComponent(width, height, color, x, y, type) {
    this.type = type;
    this.color= color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.gravity = 0.3;
    this.gravitySpeed = 0;
    if (type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
    this.checkFloor = function (myObstacle){
        if (this.crashWith(myObstacle)) {
            
            if(this.y>(myObstacle.y-this.height-10) && this.y<(myObstacle.y-this.height+10)){
                this.y=myObstacle.y-this.height;
                this.gravitySpeed = 0;
                this.speedY = 0;
            }
            else if(this.y>(myObstacle.y+myObstacle.height-10) && this.y<(myObstacle.y+myObstacle.height+10)){
                this.y=myObstacle.y+myObstacle.height;
                this.gravitySpeed = 0;
                this.speedY = 0;
            }
            else if(this.x>(myObstacle.x-this.width-10) && this.x<(myObstacle.x-this.width+10)){
                this.x=myObstacle.x-this.width;
            }
            else if(this.x>(myObstacle.x+myObstacle.width-10) && this.x<(myObstacle.x+myObstacle.width+10)){
                this.x=myObstacle.x+myObstacle.width;
            }
        }
        
    }
    this.newPos = function() {
        for (var i = 0; i < myFloor.length; i += 1) {
            this.checkFloor(myFloor[i]);
            
        }
        for (var i = 0; i < myIslands.length; i += 1) {
            this.checkFloor(myIslands[i]);
            
        }
        
        this.gravitySpeed += this.gravity;
        
        
        
        this.x += this.speedX;
        var totalSpeedY=this.speedY + this.gravitySpeed;
        if (totalSpeedY>10){
            totalSpeedY=10;
        }
        else if(totalSpeedY<-12){
            totalSpeedY=-10;
            
        }
        this.y += totalSpeedY;
        if(this.y> HEIGHT+100 || this.x< -20 || this.height < MONSTERHEIGHT/2){
            this.spawn();
            
        }
        //this.hitBottom();
        
    }
    this.spawn = function(){
        this.x=WIDTH;
        this.y=Math.random()*300;
        this.gravitySpeed=0;
        this.speedY=0;
        this.height = MONSTERHEIGHT;
        
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed=0;
            this.speedY=0;
            
            
        }
    }
    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    
}


//Main Character component.
mainComponent.prototype = new component();
var tracker=0;
function mainComponent(width, height, color, x, y, type) {
    this.type = type;
    this.color= color;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.gravity = 0.3;
    this.gravitySpeed = 0;
    this.firecap = false;
    if (type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
    this.checkFloor = function (myObstacle){
        if (this.crashWith(myObstacle)) {
            
            if(this.y>(myObstacle.y-this.height-10) && this.y<(myObstacle.y-this.height+10)){
                this.y=myObstacle.y-this.height;
                this.gravitySpeed = 0;
                this.speedY = 0;
            }
            else if(this.y>(myObstacle.y+myObstacle.height-10) && this.y<(myObstacle.y+myObstacle.height+10)){
                this.y=myObstacle.y+myObstacle.height;
                this.gravitySpeed = 0;
                this.speedY = 0;
            }
            else if(this.x>(myObstacle.x-this.width-10) && this.x<(myObstacle.x-this.width+10)){
                this.x=myObstacle.x-this.width;
            }
            else if(this.x>(myObstacle.x+myObstacle.width-10) && this.x<(myObstacle.x+myObstacle.width+10)){
                this.x=myObstacle.x+myObstacle.width;
            }
        }
        
    }
    this.bonk = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        } else if(mybottom < othertop + 20){
            return crash;
        }
    }
    
    this.newPos = function() {
        if(this.crashWith(fireFlower)){
            
            this.image.src = "minion_fire.png";
            if(this.firecap){
                fiftypoints.x=fireFlower.x;
                fiftypoints.y=fireFlower.y;
                score += 50;
            }
            this.firecap= true;
            if(fireFlower.island === 1){
                fireFlower.island = 11;
            } else if(fireFlower.island === 11){
                fireFlower.island = 1;
            }
            
        }
        for (var i = 0; i < myMonsters.length; i += 1) {
            if(this.bonk(myMonsters[i])){
                this.gravitySpeed=0;
                this.speedY = -5 ;
                
                myMonsters[i].height = myMonsters[i].height / 2;
                fiftypoints.x=myMonsters[i].x;
                fiftypoints.y=myMonsters[i].y;
                score += 50;
                
                
            }
            else if(this.crashWith(myMonsters[i])) {
                if(this.firecap){
                    this.firecap = false;
                    this.x += 100;
                    this.image.src= "minion_walking.png";
                }else{
                    myGameArea.stop();
                }
            }
        }
        for (var i = 0; i < myFloor.length; i += 1) {
            this.checkFloor(myFloor[i]);
            
        }
        for (var i = 0; i < myIslands.length; i += 1) {
            this.checkFloor(myIslands[i]);
            
        }
        if(this.bonk(bat)){
            this.gravitySpeed=0;
            this.speedY = -5 ;
            //bat = myMonsters[i].height / 2;
            fiftypoints.x=bat.x;
            fiftypoints.y=bat.y;
            score += 50;
            
            bat.x= (WIDTH*3)/2;
            bat.y= 300* Math.random();
            
        } else if(this.crashWith(bat)){
            if(this.firecap){
                this.firecap = false;
                this.x += 100;
                this.image.src= "minion_walking.png";
            }else{
                myGameArea.stop();
            }
        }
        
        this.gravitySpeed += this.gravity;
        
        if (myGameArea.keys && myGameArea.keys[40]) {
            if(this.speedY === 0){
                this.height=minionHeight/2;
            }
            
            myGamePiece.speedY += .9;
            
        }
        else if(this.height === minionHeight/2){
            this.height=minionHeight;
            this.y+= -(minionHeight);
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            if(tracker < 10){
                if(tracker == 0 && myGamePiece.speedY !=0){
                    
                }else{
                    myGamePiece.speedY += -1.5;
                    tracker=tracker+1;
                }
            }
            
        }
        else{
            tracker=0;
            
        }
        
        
        this.x += this.speedX;
        if(this.x<0){
            this.x=0;
        }
        var totalSpeedY=this.speedY + this.gravitySpeed;
        if (totalSpeedY>10){
            totalSpeedY=10;
        }
        else if(totalSpeedY<-12){
            totalSpeedY=-10;
            myGameArea.keys[38] = false;
        }
        this.y += totalSpeedY;
        this.hitBottom();
        
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > HEIGHT) {
            //this will keep the character on the screen
            //this.y = rockbottom;
            this.gravitySpeed=0;
            this.speedY=0;
            myGameArea.stop();
            
            
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    
    
}

var fireballsent= false;

function updateGameArea() {
    
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();
    myGamePiece.newPos();
    myGamePiece.update();
    for(var i=0; i < fireBall.length ; i+=1){
        if (fireBall[i].x < WIDTH+20){
            fireBall[i].newPos();
            fireBall[i].update();
        }
    }
    myfriend.newPos();
    myfriend.update();
    //Friend Position
    myfriend.x=(((myGamePiece.x-20)-myfriend.x)/10)+myfriend.x;
    myfriend.y=((myGamePiece.y+(myGamePiece.height / 2) -myfriend.y)/3)+myfriend.y;
    
    
    
    fireFlower.x = myIslands[fireFlower.island].x + myIslands[fireFlower.island].width / 2;
    fireFlower.y = myIslands[fireFlower.island].y - fireFlower.height;
    fireFlower.newPos();
    fireFlower.update();
    //Bat Position
    bat.speedX=-3;
    
    if(bat.x < -20){
        bat.x= (WIDTH*3)/2;
        bat.y= 300* Math.random();
    }
    bat.newPos();
    bat.update();
    
    for (var j = 0; j < myMonsters.length; j += 1) {
        
        myMonsters[j].newPos();
        myMonsters[j].update();
        myMonsters[j].x += -1;
        if(myGamePiece.x > WIDTH*2/5){
            myMonsters[j].x += -1;
            
            if(myGamePiece.x > WIDTH*2/3){
                myMonsters[j].x += -1;
            }
        }
        
    }
    for (var j = 0; j < myIslands.length; j += 1) {
        if(myGamePiece.x > WIDTH*2/5){
            myIslands[j].x += -1;
            if(myGamePiece.x > WIDTH*2/3){
                myIslands[j].x += -1;
            }
            if(myIslands[j].x < -100){
                if (j >0){
                    myIslands[j].x = myIslands[j-1].x+ Math.random() * WIDTH / 2;
                }
                else{
                    myIslands[j].x = myIslands[myIslands.length-1].x+ Math.random() * WIDTH / 2;
                }
            }
        }
        myIslands[j].update();
        
    }
    
    
    for (var i = 0; i < myFloor.length; i += 1) {
        if(myGamePiece.x > WIDTH*2/5){
            myFloor[i].x += -1;
            if(myGamePiece.x > WIDTH*2/3){
                myFloor[i].x += -1;
            }
        }
        myFloor[i].update();
        
    }
    
    if(myFloor[0].x < -40) {
        for (i = 0; i < myFloor.length-1; i += 1) {
            myFloor[i].x= myFloor[i+1].x;
            
        }
        var offset=0;
        if(Math.random()*10 < 1){
            offset=GRID*3;
        }
        myFloor[myFloor.length-1].x = myFloor[myFloor.length-2].x+GRID+offset;
    }
    myGameArea.frameNo += 1;
    //score = score +.1;
    myScore.text="SCORE: " + Math.floor(score);
    myScore.update();
    fiftypoints.text="50 pts!";
    fiftypoints.newPos();
    if(fiftypoints.y > -100){
        fiftypoints.update();
    }
    myGamePiece.speedX = 0;
    myfriend.speedX = 0;
    if(myGamePiece.firecap){
        if (myGameArea.keys && myGameArea.keys[68]) {
            
            if(!fireballsent){
                for(var i=0; i < fireBall.length ; i+=1){
                    if(fireBall[i].x > WIDTH){
                        fireBall[i].spawn();
                        fireballsent = true;
                        break;
                    }
                }
            }
        } else{
            fireballsent = false;
        }
    }
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
    
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 2;
        
    }
    if(myGamePiece.x > WIDTH*2/3){
        myGamePiece.speedX += -2;
        
    } else if(myGamePiece.x > WIDTH*2/5){
        myGamePiece.speedX += -1;
        myfriend.speedX +=-1;
    }
    
    
}