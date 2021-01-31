var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var hiscore = 1000;
var gameover, overImg
var restart, startImg
var jump, checkpoint, die

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  overImg = loadAnimation("gameOver.png")
  startImg = loadAnimation("restart.png")

  jump = loadSound("jump.mp3")
  checkpoint = loadSound("checkPoint.mp3")
  die = loadSound("die.mp3")

}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;


  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  trex.setCollider("rectangle", 0, 0,80,80);
 trex.debug = false
  score = 0

  restart = createSprite(300, 140, 30, 30)
  restart.addAnimation("haha", startImg)
  restart.scale = 0.5
  gameover = createSprite(300, 100, 30, 30)
  gameover.scale = 0.5
  gameover.addAnimation("hahah", overImg)
}

function draw() {
  background("white");
  fill("cyan")
  //displaying score
  text("Score: " + score, 400, 50);
 text("Highscore"+hiscore,400,30)
  console.log("this is ", gameState)


  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(score / 100*3 + 4);
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -13;
      jump.play()
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      die.play()
    // trex.velocityY = -13
    }

    restart.visible = false
    gameover.visible = false

    if (score % 100 === 0 && score != 0) {
      checkpoint.play()

      }
    
    if(score>1200&&score<1700 ){
      background("black")
       fill("cyan")
  //displaying score
  text("Score: " + score, 400, 50);
      
  
    }
    
    if (score === hiscore ||( score>1000&&score<1020)){
      textSize(25)
      fill ("green")
      text("you crossed the high score",100,30)
    }
  } else if (gameState === END) {
    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.velocityY = 0
    cloudsGroup.setLifetimeEach(-1)
    obstaclesGroup.setLifetimeEach(-1)

    trex.changeAnimation("collided", trex_collided)

    restart.visible = true
    gameover.visible = true
    
    if(mousePressedOver(restart)){
      reset()
      
    }
  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function reset(){
  gameState = PLAY
  obstaclesGroup.destroyEach ()
  cloudsGroup.destroyEach()
  
 trex.changeAnimation("running",trex_running)
  score = 0
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}