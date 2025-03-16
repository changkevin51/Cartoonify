var myInteger = 0;
let styleEl = null;
let turtleDiv = null;
let pongGame = null; 
let speechBubbles = [];
let mainColor = '#ef5350';
let enableSpeechBubbles = true;
let enableTurtle = true;
let enablePong = true;
let enableinvert = true;
const audioUrl = chrome.runtime.getURL("media/Boing.mp3");
const audio = new Audio(audioUrl);
audio.preload = "auto";
audio.load();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyStyles") {
    
    mainColor = message.prefs.mainColor || mainColor;
    enableSpeechBubbles = message.prefs.enableSpeechBubbles;
    enableTurtle = message.prefs.enableTurtle;
    enablePong = message.prefs.enablePong;
    enableinvert = message.prefs.enableinvert;
    
    if (myInteger%2 === 0){
        styleEl = applyStyles();
        if (enableTurtle) applyStyles2();
        if (enablePong) applyStyles3();
        if (enableSpeechBubbles) addSpeechBubbles();
        if (enableinvert) applyInvert();
        sendResponse({status: "Cartoonify activated! POW!"});
    } 
    else {
      unapplyStyles(styleEl); 
      sendResponse({status: "Back to reality! ZOOM!"});
    }
    myInteger++;
  }
  return true;
});


function applyStyles() {
  styleEl = document.createElement('style');
  
  const doodlesURL = chrome.runtime.getURL('media/doodles.jpg');
  
  styleEl.textContent = `
  * {
      font-family: 'Bangers', cursive !important;
      color: ${mainColor};
      font-weight: bold;
  }
  body {
      background: white !important;
      background-image: url('${doodlesURL}') !important;
      background-repeat: repeat;
      background-size: auto;
  }
    
  img {
  filter: contrast(1000%) brightness(100%);
  }
  
  /* Make content containers semi-transparent to show background */
  p, div, span, section, article, main, header, footer, aside, nav {
      background-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  /* Specific elements with fully transparent backgrounds */
  #moving-turtle, #moving-turtle *, .speech-bubble, #pong-container, #pong-canvas {
    background: transparent !important;
  }
  
  *[style*="border"], *[class*="border"], *[id*="border"], 
  *[border], *[style*="outline"], table, td, th {
    border-width: 5px !important;
    border-style: solid !important;
    border-color: ${mainColor} !important;
  }
  
  @keyframes wobble {
    0% { transform: rotate(2deg); }
    50% { transform: rotate(-2deg); }
    100% { transform: rotate(2deg); }
  }
  
  h1, h2, h3 {
    display: inline-block;
    animation: wobble 0.2s infinite alternate ease-in-out;
    background-color: rgba(255, 255, 255, 0.3) !important;
    padding: 5px !important;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    background-repeat: repeat;
    background-size: auto;
    opacity: 0.5;
  }
  
  /* Comic book style action words */
  .comic-effect {
    position: fixed;
    z-index: 9998;
    font-size: 40px;
    color: ${mainColor};
    text-shadow: 2px 2px 0 black;
    pointer-events: none;
    user-select: none;
    transform: rotate(-10deg) scale(0);
    animation: popIn 0.5s forwards;
  }
  
  @keyframes popIn {
    0% { transform: rotate(-10deg) scale(0); }
    70% { transform: rotate(-10deg) scale(1.2); }
    100% { transform: rotate(-10deg) scale(1); }
  }
  
  /* Speech bubble style */
  .speech-bubble {
    position: absolute;
    background: white !important;
    border-radius: 15px !important;
    padding: 10px !important;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.2) !important;
    border: 3px solid ${mainColor} !important;
    max-width: 200px;
    z-index: 9997;
    pointer-events: none;
  }
  
  .speech-bubble:before {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 20px;
    border: 10px solid transparent;
    border-top-color: ${mainColor};
    border-bottom: 0;
  }
  
  /* Hover effects for images and links */
  img:hover {
    transform: scale(1.5);
    transition: transform 0.3s ease;
    z-index: 9996;
    position: relative;
  }
  
  a:hover {
    transform: scale(1.5);
    display: inline-block;
    transition: transform 0.2s ease;
    z-index: 9996;
    position: relative;
  }
  `;
  
  document.head.appendChild(styleEl);

  
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Bangers&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
  
  
  document.addEventListener('click', function(e) {
    if (Math.random() > 0.5) {
      addComicEffect(e.clientX, e.clientY);
    }
  });
}

function addComicEffect(x, y) {
  const effects = ['POW!', 'BAM!', 'ZOOM!', 'WHAM!', 'BOOM!', 'KAPOW!', 'ZAP!'];
  const effect = effects[Math.floor(Math.random() * effects.length)];
  
  const comicEffect = document.createElement('div');
  comicEffect.className = 'comic-effect';
  comicEffect.textContent = effect;
  comicEffect.style.left = `${x - 30}px`;
  comicEffect.style.top = `${y - 30}px`;
  
  document.body.appendChild(comicEffect);
  
  setTimeout(() => {
    comicEffect.parentNode.removeChild(comicEffect);
  }, 980);
}

function addSpeechBubbles() {
  
  speechBubbles.forEach(bubble => {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  });
  speechBubbles = [];
  
  
  const headlines = document.querySelectorAll('h1, h2, h3');
  const interactiveElements = document.querySelectorAll('a, button');
  
  
  const randomHeadlines = Array.from(headlines).slice(0, Math.min(3, headlines.length));
  const randomInteractiveElements = Array.from(interactiveElements)
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(5, interactiveElements.length));
  
  const elements = [...randomHeadlines, ...randomInteractiveElements];
  
  
  const phrases = [
    'Click me!', 
    'Comic power!', 
    'Wow!', 
    'Amazing!',
    'Look at this!',
    'Incredible!',
    'Super!',
    'Fantastic!',
    'Holy moly!'
  ];
  
  elements.forEach(element => {
    if (element.getBoundingClientRect().width > 0 && isElementVisible(element)) {
      const bubble = document.createElement('div');
      bubble.className = 'speech-bubble';
      bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      
      const rect = element.getBoundingClientRect();
      bubble.style.left = `${rect.left + window.scrollX}px`;
      bubble.style.top = `${rect.top + window.scrollY - 50}px`;
      
      document.body.appendChild(bubble);
      speechBubbles.push(bubble);
    }
  });
}

function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && 
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

function applyStyles2() {
  turtleDiv = document.createElement('div');
  turtleDiv.id = 'moving-turtle';
  turtleDiv.style.cssText = 'position: fixed; bottom: -6px; z-index: 9999; pointer-events: none; background: transparent !important;';
  
  const turtleImg = document.createElement('img');
  turtleImg.src = chrome.runtime.getURL('media/turtle.gif');
  turtleImg.style.height = '200px'; 
  turtleImg.style.background = 'transparent';
  turtleDiv.appendChild(turtleImg);
  
  document.body.appendChild(turtleDiv);
  const turtleStyleEl = document.createElement('style');
  // const intervalId = setInterval(() => {
  //   audio.currentTime = 0; // Reset playback to the start
  //   audio.play();
  //   }, 1000);
  for (let i = 0; i < 500; i++){
    Id = setInterval(() => {
      // audio.currentTime = 0; // Reset playback to the start
      audio.play()
    }
  )
  }

  turtleStyleEl.textContent = `
    @keyframes moveLeftToRight {
      from { right: -100px; }
      to { right: calc(100% + 100px); }
    }
    
    #moving-turtle {
      animation: moveLeftToRight 15s linear infinite reverse;
    }
  `;
  
  document.head.appendChild(turtleStyleEl);
  
  if (!styleEl) styleEl = turtleStyleEl;
}

function unapplyStyles(){
  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    if (style.textContent.includes('Bangers') || 
        style.textContent.includes('moveLeftToRight') ||
        style.textContent.includes('pong-container') || 
        style.textContent.includes('filter')) {
      style.parentNode.removeChild(style);
    }
  });
  if (styleEl && styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
    styleEl = null;
  }
  if (turtleDiv && turtleDiv.parentNode) {
    turtleDiv.parentNode.removeChild(turtleDiv);
    turtleDiv = null;
  }
  
  if (pongGame && pongGame.parentNode) {
    pongGame.parentNode.removeChild(pongGame);
    pongGame = null;
  }
  
  
  speechBubbles.forEach(bubble => {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  });
  speechBubbles = [];
  
  
  const comicEffects = document.querySelectorAll('.comic-effect');
  comicEffects.forEach(effect => {
    effect.parentNode.removeChild(effect);
  });
  
  styleEl = null;
}

function applyStyles3() {
  addPongGame(); 
  
  const styleEl = document.createElement('style');
  
  document.head.appendChild(styleEl);
}

function applyInvert() {
  const styleEl = document.createElement('style');

  styleEl.textContent = `
  /* Additional styles can be added here if needed */
  html{
  filter: invert(1);
  }
  `;
  document.head.appendChild(styleEl);
}

function addPongGame() {
  pongGame = document.createElement('div');
  pongGame.id = 'pong-container';
  pongGame.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    height: 240px;
    background: black;
    border: 3px solid ${mainColor};
    z-index: 10000;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  `;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'pong-canvas';
  canvas.width = 320;
  canvas.height = 240;
  canvas.style.cssText = `
    display: block;
    background: black;
  `;
  
  pongGame.appendChild(canvas);
  document.body.appendChild(pongGame);
  
  const ctx = canvas.getContext('2d');
  let gameState = 'start'; 
  let score = { player: 0, computer: 0 };
  
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    velocityX: 5,
    velocityY: 5,
    speed: 3,
    color: "white"
  };
  
  const paddleHeight = 50;
  const paddleWidth = 10;
  
  const player = {
    x: canvas.width - paddleWidth - 10,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    color: mainColor,
    speed: 8
  };
  
  const computer = {
    x: 10,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    score: 0,
    color: mainColor,
    speed: 5
  };
  
  let upArrowPressed = false;
  let downArrowPressed = false;
  let enterPressed = false;
  
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
  
  function keyDownHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'Up') {
      upArrowPressed = true;
    }
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      downArrowPressed = true;
    }
    if (e.key === 'Enter') {
      enterPressed = true;
      if (gameState === 'start' || gameState === 'gameOver') {
        resetGame();
        gameState = 'playing';
      }
    }
  }
  
  function keyUpHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'Up') {
      upArrowPressed = false;
    }
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      downArrowPressed = false;
    }
    if (e.key === 'Enter') {
      enterPressed = false;
    }
  }
  
  function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
    score.player = 0;
    score.computer = 0;
  }
  
  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
  }
  
  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }
  
  function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }
  
  function drawText(text, x, y, color, fontSize) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Bangers`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
  }
  
  function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
      drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
    }
  }
  
  function collision(b, p) {
    // var audio = new Audio("media/Boing.mp3");
    // audio.play();
    // const audioUrl = chrome.runtime.getURL("media/Boing.mp3");
    // // const audioUrl2 = chrome.runtime.getURL("resonance/Boing.mp3");
    
    // const audio = new Audio(audioUrl);
    // // const resonance = new Audio(audioUrl2)
    // audio.play();
    // resonance.play();
    
    
    // audio.currentTime = 0; // Reset playback to the start
    // audio.play();
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
  }
  
  function update() {
    if (upArrowPressed && player.y > 0) {
      player.y -= player.speed;
    } else if (downArrowPressed && player.y < canvas.height - player.height) {
      player.y += player.speed;
    }
    
    let computerCenter = computer.y + computer.height / 2;
    let ballCenter = ball.y;
    
    if (computerCenter < ballCenter - 35) {
      computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
      computer.y -= computer.speed;
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.velocityY = -ball.velocityY;
    }
    
    let paddle = (ball.x + ball.radius < canvas.width / 2) ? computer : player;
    
    if (collision(ball, paddle)) {
      let collidePoint = (ball.y - (paddle.y + paddle.height / 2));
      collidePoint = collidePoint / (paddle.height / 2);
      
      let angleRad = (Math.PI / 4) * collidePoint;
      
      let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
      
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      
      ball.speed += 0.1;
      
      
      addComicEffect(paddle.x, ball.y);
    }
    
    if (ball.x - ball.radius < 0) {
      score.player++;
      resetBall();
      if (score.player >= 5) {
        gameState = 'gameOver';
      }
    } else if (ball.x + ball.radius > canvas.width) {
      score.computer++;
      resetBall();
      if (score.computer >= 5) {
        gameState = 'gameOver';
      }
    }
  }
  
  function render() {
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    
    if (gameState === 'start') {
      drawText("PONG", canvas.width / 2, canvas.height / 2 - 30, mainColor, 30);
      drawText("Press ENTER to Start", canvas.width / 2, canvas.height / 2 + 30, "white", 15);
    } 
    else if (gameState === 'playing') {
      drawNet();
      
      drawText(score.computer.toString(), canvas.width / 4, 30, "white", 24);
      drawText(score.player.toString(), 3 * canvas.width / 4, 30, "white", 24);
      
      drawRect(player.x, player.y, player.width, player.height, player.color);
      drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
      
      drawCircle(ball.x, ball.y, ball.radius, ball.color);
    } 
    else if (gameState === 'gameOver') {
      let winner = score.player > score.computer ? "YOU WIN!" : "COMPUTER WINS!";
      drawText(winner, canvas.width / 2, canvas.height / 2 - 30, mainColor, 24);
      drawText(`${score.computer} - ${score.player}`, canvas.width / 2, canvas.height / 2, "white", 20);
      drawText("Press ENTER to Restart", canvas.width / 2, canvas.height / 2 + 30, "white", 15);
    }
  }
  
  function gameLoop() {
    if (gameState === 'playing') {
      update();
    }
    render();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();
}