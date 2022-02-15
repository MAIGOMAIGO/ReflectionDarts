// Text init
const scoreText = document.getElementById('score');
const timeText = document.getElementById('time');
const bulletsText = document.getElementById('bullets');

let score = 0;
let time = 60.0;
let numbullet = 3;
let gameMode = 0;
let timer = null;
let pointIndex = 0;
let targetTiming = 0;

scoreText.innerText += String(score);
timeText.innerText += String(time.toFixed(1));
bulletsText.innerText += String(numbullet);

// bullet setting
const bullets = []
const bulletSpeed = 5;
class Bullet {
    constructor(){
       this.x = canvas.width/2;
       this.y = canvas.height*7/8;
       this.radius = canvas.height/40;
       this.dx = 0;
       this.dy = 0;
       this.numReflect = 1;
       this.enable = true;
    }
    render(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
        ctx.fillStyle = 'rgb(255,255,0)';
        ctx.fill();
    }
    update(){
        if(this.enable){
            this.x += this.dx;
            this.y += this.dy;

            if(this.x > canvas.width - this.radius || this.x < this.radius){
                this.dx = -this.dx;
                this.numReflect++;
            }
            if(this.y < this.radius){
                this.dy = -this.dy;
                this.numReflect++;
            }
            if(this.y > canvas.height - this.radius){
                this.dx = 0;
                this.dy = 0;
                this.enable = false;
            }else{
                this.render();
            }
        }
    }
}

// pointBoard setting
const pointBoards = [];
const point = [9,14,12,11,5,8,20,16,1,7,18,19,4,3,13,17,6,2,10,15];
class pointBoard{
    constructor(x,index){
        this.x = x;
        this.y = 0;
        this.radius = canvas.height/20;
        this.dx = canvas.width/300;
        this.index = index%20;
        this.enable = true;
    }
    render(){
        if(this.index%2 == 0){
            this.y = canvas.height/7;
        }else{
            this.y = canvas.height/2;
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.fill();

        const pointFontSize = this.radius;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.font = pointFontSize+'px Arial';
        ctx.fillText(String(point[this.index]),this.x-this.radius/2,this.y+this.radius/3);
    }
    update(){
        if(this.enable){
            // cheak hit
            for(let i=0;i<bullets.length;i++){
                const vx = bullets[i].x - this.x;
                const vy = bullets[i].y - this.y;
                if(this.radius+bullets[i].radius >= Math.sqrt(vx*vx+vy*vy)){
                    this.enable = false;
                    bullets[i].enable = false;
                    bullets[i].y = canvas.height;

                    score += point[this.index]*bullets[i].numReflect;
                    scoreText.innerText = String(score);
                }
            }
            if(-this.radius < this.x && this.x < canvas.width){
                if(this.index%2 == 0){
                    this.x -= this.dx;
                }else{
                    this.x += this.dx;
                }
                this.render();
            }else{
                this.enable = false;
            }
        }
    }
}

//canvas init
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*5/8;
canvas.height = canvas.width*2/3;

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.weblitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (cb) { setTimeout(cb, 17); };

//get Click event
canvas.addEventListener('click',(event) => {
    if(gameMode == 0){  // start page

        // clear
        ctx.fillStyle = 'rgb(120,120,120)';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        const finishTime = performance.now() + 60000;
        timer = setInterval(function(){
            if(performance.now()>=finishTime){
                // check TimeOut
                timeText.innerText = '0.0';
                clearInterval(timer);
                finish();
            }else{
                targetTiming++;
                // count down
                time = (finishTime-performance.now())/1000;
                timeText.innerText = String(time.toFixed(1));
            }
        },50);
        gameMode = 1;

        // first bullet
        const bullet = new Bullet();
        bullets.push(bullet);

        // first target
        const pointboard1 = new pointBoard(canvas.width-canvas.height/20,pointIndex);
        pointIndex = (pointIndex + 1)%20;
        pointBoards.push(pointboard1);
        const pointboard2 = new pointBoard(0,pointIndex);
        pointIndex = (pointIndex + 1)%20;
        pointBoards.push(pointboard2);

        render();

    }else if(gameMode == 1){    // game play page
        // add bullet
        if(numbullet>0 && event.y < canvas.height*7/8){
            const rect = canvas.getBoundingClientRect();
            const vx = (event.x-rect.left) - canvas.width/2;
            const vy = (event.y-rect.top) - canvas.height*7/8;

            bullets[bullets.length-1].dx = bulletSpeed*vx/Math.sqrt(vx*vx+vy*vy);
            bullets[bullets.length-1].dy = bulletSpeed*vy/Math.sqrt(vx*vx+vy*vy);
            if(bullets.length < 3){
                const bullet = new Bullet();
                bullets.push(bullet);
            }
            numbullet--;
            bulletsText.innerText = String(numbullet);
        }
    }else if(gameMode == 2){
        window.location.reload();
    }
});

// start Page
makeStartPage();
function makeStartPage(){
    ctx.fillStyle = 'rgb(120,120,120)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const title = 'リフレクションダーツ';
    const titleFontSize = canvas.height/8;
    ctx.font = 'bold '+titleFontSize+'px Arial';
    ctx.fillStyle = 'rgb(255,255,0)';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title,(canvas.width-titleWidth)/2,titleFontSize*2);

    const start = '画面をクリックしてゲームスタート!';
    const startFontSize = canvas.height/14;
    ctx.font = startFontSize+'px Arial';
    const startWidth = ctx.measureText(start).width;
    ctx.fillText(start,(canvas.width-startWidth)/2,startFontSize*10);
}

// frame move
function render(){
    if(gameMode == 1){
        // clear
        ctx.fillStyle = 'rgb(120,120,120)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // bullets update
        for(let i=0;i<bullets.length;i++){
            bullets[i].update();
            
        }
        // point update
        for(let i=0;i<pointBoards.length;i++){
            pointBoards[i].update();
        }
        // new point Board
        if(targetTiming*pointBoards[0].dx > canvas.width/12){
            targetTiming = 0;

            const pointboard1 = new pointBoard(canvas.width-canvas.height/20,pointIndex);
            pointIndex = (pointIndex + 1)%20;
            pointBoards.push(pointboard1);

            const pointboard2 = new pointBoard(0,pointIndex);
            pointIndex = (pointIndex + 1)%20;
            pointBoards.push(pointboard2);
        }
        // cheak finish
        if(bullets.length == 3){
            if(!bullets[0].enable && !bullets[1].enable && !bullets[2].enable){
                clearInterval(timer);
                finish();
            } 
        }
        requestAnimationFrame(render);
    }
}

function finish(){
    gameMode = 2;
                
    ctx.fillStyle = 'rgb(120,120,120)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const title = 'SCORE:'+String(score);
    const titleFontSize = canvas.height/8;
    ctx.font = 'bold '+titleFontSize+'px Arial';
    ctx.fillStyle = 'rgb(255,255,0)';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title,(canvas.width-titleWidth)/2,titleFontSize*2);

    const start = '画面をクリックして最初に戻る';
    const startFontSize = canvas.height/14;
    ctx.font = startFontSize+'px Arial';
    const startWidth = ctx.measureText(start).width;
    ctx.fillText(start,(canvas.width-startWidth)/2,startFontSize*10);
}