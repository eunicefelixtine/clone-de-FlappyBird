//canvas
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//oiseau
let birdWidth = 34;
let birdHeight =24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width : birdWidth,
    height: birdHeight
}

//tuyaux
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physique du jeu
let velocityX = -2; //vitesse de deplacement des tuyaux vers la gauche
let velocityY = 0; //vitesse de saut de l'oiseau
let gravity = 0.4; //pour que l'oiseau redescende automatiquement si on cesse de presser le bouton

let gameOver = false;

let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //sert à dessiner sur le tableau

    //dessin de l'oiseau
    birdImg = new Image()
    birdImg.src = "flappybird.png";
    birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
    }

    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png"

    
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //chaque 1,5 secondes
    document.addEventListener("keydown", moveBird);

}

function update(){
    requestAnimationFrame(update);

    if (gameOver){ //pour arreter de peindre la toile si c'est gameOver
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //oiseau
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //pour s'assurer que l'oiseau ne depasse pas le haut du canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

    if(bird.y > board.height){
        gameOver = true;
    }

    //tuyaux
    for(let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; // ça fait 1point pour chaque paire de tuyau traversé
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    // pour effecer les tuyaux qui sortent du canvas pour éviter que le tableau ne soit trop volumineux
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); //supprime le premier élément du tableau
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45) // positions

    //pour afficher "GAME OVER" quand la partie est terminée
    if (gameOver){
        context.fillText("GAME OVER", 40, 300)
        context.fillText("score:" + score, 100, 380)
    }

}

function placePipes(){

    if(gameOver){ //pour que les tutaux n'apparaissent plus après un gameOver
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); //pour que le hauteur du tuyau varie au fur et à mesure
    openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe)

}

function moveBird(e){
    if(e.code == "space" || e.code == "ArrowUp" || e.code == "keyX"){
        //saut
        velocityY = -6;

        //pour réinitialiser le jeu sans actualiser la page
        if(gameOver){
            bird.y = birdY;
            pipeArray = []; //pour supprimer les tuyau
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    
}