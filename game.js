const canvas = document.querySelector('#game');
const btnup = document.querySelector('#up');
const btndown = document.querySelector('#down');
const btnleft = document.querySelector('#left');
const btnright = document.querySelector('#right');
const spanLife = document.querySelector('#lifes');
const spanTimer = document.querySelector('#timer');
const spanRecord = document.querySelector('#record');
const game = canvas.getContext('2d');

let canvasSize;
let elementSize;
let level = 0;
let enemies = [];
let lives = 3;

let StartTime;
let timer;

const player = {
    emoji : emojis['PLAYER'],
    positionX: undefined,
    positionY: undefined,
};

const gift = {
    emoji : emojis['I'],
    positionX: undefined,
    positionY: undefined,
};

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

//Event listener for movements
window.addEventListener('keydown',moveByKeys);
btnup.addEventListener('click', moveUp);
btndown.addEventListener('click', moveDown);
btnleft.addEventListener('click', moveLeft);
btnright.addEventListener('click', moveRight);

function startGame(){
    game.font = elementSize + "px Verdana";
    game.textAlign = '';
    if(!StartTime){
        StartTime = Date.now();
        timer = setInterval(showTime,100);
    }
    
    renderMap();
};

function renderMap(){
    let map = maps[level];
    if(!map){
        gameWin();
        return;
    };
        
    // const mapRowsRegex = maps[0].match(/[IXO\-]+]/g).map(a=>a.split(""))
    const mapRows = map.trim().split('\n'); //Trim delete blank spaces before and after of an String ---- split as it name says split and string to an array as per depent of the character introduced.
    enemies = [];
    game.clearRect(0,0,canvasSize,canvasSize);
    const mapCols = mapRows.map((row) => row.trim().split(''));

    mapCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) =>{
            const emoji = emojis[col];
            const posX = Math.round(elementSize * colIndex);
            const posY = Math.round(elementSize * (rowIndex + 1));
            game.fillText(emoji, posX, posY);

            // Player beginning position
            if(col == 'O' && player.positionX == undefined){
                player.positionX = posX;
                player.positionY = posY;
            }
            else if(col == 'I'){
                gift.positionX = posX;
                gift.positionY = posY;
            }
            else if(col == 'X'){
                enemies.push({
                    positionX: posX,
                    positionY: posY,
                });
            }
        });        
    });
    renderPlayer();
    showLife();
    spanRecord.innerHTML = localStorage.getItem("record");
    // console.log({elementSize, canvasSize, player, gift, level, enemies, lives});
};

function renderPlayer(){
    const isMatchGiftX = player.positionX === gift.positionX;  
    const isMatchGiftY = player.positionY === gift.positionY;
    const isMatchEnemy = enemies.some((enemy) => enemy.positionX === player.positionX && enemy.positionY === player.positionY);
    
    if (isMatchGiftX && isMatchGiftY){
        console.log('Lets Go New Level');
        ++level;
        // if(level < 2){
        // }else{
        //     gameWin();
        //     return;
        // }
        player.positionX = undefined;
        player.positionY = undefined;
        renderMap();
    };

    if (isMatchEnemy){
        console.log('You died');
        lives--;
        player.positionX = undefined;
        player.positionY = undefined;
        if(lives < 1){
            lives = 3;
            StartTime = undefined;
            level = 0;
            startGame();
            // gameOver();
        }
        
        renderMap();
    };
    game.fillText(player.emoji, player.positionX, player.positionY);
};

function showLife(){
    spanLife.innerHTML = emojis['HEART'].repeat(lives);
};

function showTime(){

    spanTimer.innerHTML = ((Date.now() - StartTime) / 1000).toFixed(1);
};

function setCanvasSize(){
    canvasSize = window.innerHeight > window.innerWidth ? Math.round(canvasSize = window.innerWidth * 0.8) : Math.round(canvasSize = window.innerHeight * 0.8);
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementSize = Math.round((canvasSize / 10) - 1) ;
    startGame();
};

function moveByKeys(event){
    // console.log(event);
    switch (event.key) {
        case "ArrowUp":
            moveUp();            
        break;
        case "ArrowDown":
            moveDown();            
        break;
        case "ArrowLeft":
            moveLeft();            
        break;
        case "ArrowRight":
            moveRight();            
        break;
        default:
            break;
    } 
};

function moveUp(){
    player.positionY -= Math.round(player.positionY) > Math.round(elementSize) ? Math.round(elementSize) : 0;
    renderMap();
};

function moveDown(){
    player.positionY += Math.round(player.positionY + elementSize) < Math.round(canvasSize) ? Math.round(elementSize) : 0;
    renderMap();
};

function moveLeft(){
    player.positionX -= Math.round(player.positionX) > 0 ? Math.round(elementSize) : 0;
    renderMap();
};

function moveRight(){
    player.positionX += Math.round(player.positionX + elementSize) < Math.round(canvasSize - elementSize) ? Math.round(elementSize) : 0;
    renderMap();
};

function gameOver(){
    console.log('You Lose!');
};

function gameWin(){
    
    localStorage.getItem("record");
    console.log('You Win!');
    getRecord();   
    clearInterval(timer);
};

function getRecord(){
    const score = ((Date.now() - StartTime) / 1000).toFixed(1);
    const currentRecord = localStorage.getItem('record');
    console.log({score, currentRecord});
    if(currentRecord){
        if(score < currentRecord){
            localStorage.setItem('record', score);
            // spanRecord.innerHTML = localStorage.getItem('record');
        }else{
            console.log("NO new Record");
        }
    }else{
        localStorage.setItem('record', score);
    }

}