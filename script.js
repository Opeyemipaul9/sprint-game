// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;

let equationsArray = [];
let playerGuessArray =[];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

//  referesh splash page bestscores

function bestScoreToDOM(){
  bestScores.forEach((score , index)=>{
    const bestScoreEl = score;
   bestScoreEl.textContent =`${bestScoreArray[index].bestScore}`;
  });

}

// check local storage for best scores, set bescorearray 
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else{
    bestScoreArray = [
      
        {questions:10, bestScore:finalTimeDisplay },
        {questions:25, bestScore:finalTimeDisplay },
        {questions:50, bestScore:finalTimeDisplay },
        {questions:99, bestScore:finalTimeDisplay }
    ];
    localStorage.setItem('bestScores' , JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}

// update  best score array
function updateBestScore (){
  bestScoreArray.forEach((score , index) =>{
    // select best score to update
    if(questionAmount == score.questions){
      // return the best scoreas a number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // update if the new final score is less or replacing zero
      if(savedBestScore === 0 || savedBestScore > finalTime ){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page
  bestScoreToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}


// reset the game
function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray=[];
  playerGuessArray = [];
  valueY= 80;
  playAgainBtn.hidden = true;
}

// show score page
function showScorePage(){
  // show play again button after 1 second
  setTimeout(()=>{
    playAgainBtn.hidden = false;
  },1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// format & display time in dom
function scoreToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time :${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}`;
  finalTimeEl.textContent = `${finalTimeDisplay}`;
  updateBestScore();

  // scroll to the , go to score page 
  itemContainer.scrollTo({top:0, behavior:'instant'});
  showScorePage();
}


// stop timer,process results and  go to score page
function checkTime(){
 ;
  if(playerGuessArray.length == questionAmount){
    clearInterval(timer);
    // check for wrong guesses , add penalty time
    equationsArray.forEach((equation, index)=>{
      if(equation.evaluated === playerGuessArray[index]){
        // correct guess

      }else{
        // incorrect guess
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoreToDOM();
   }
}

// Add a tenth of a second to timeplayed
function addTime(){
  timePlayed += 0.1;
  checkTime(); 
}


// start timer when ggame page is clicked
function startTimer(){
  // reset times
  timePlayed = 0;
  finalTime = 0;
  penaltyTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// scroll, store user selection in playerGuessArray
function select(guessedTrue){
  
  // sscroll 80pixels
  valueY += 80;
  itemContainer.scroll(0,valueY);
  // Add playyer guest to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Display game

function showGamePage(){
  gamePage.hidden = false;
  countdownPage.hidden = true;

}

// gET rANDPM NUMBER UPTO A MAX NUMBER 
function getRandomint(max){
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomint(questionAmount);

  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomint(9);
    secondNumber = getRandomint(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomint(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add Equations to DOM

function equationsToDOM(){
  equationsArray.forEach((equation) =>{

    // item
    const item = document.createElement('div');
    item.classList.add('item');

    //Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);

  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Display 3,2,1,go
function countdownStart(){
  countdown.textContent = '3';
  setTimeout(()=>{
    countdown.textContent = '2';
  },1000);
  setTimeout(()=>{
    countdown.textContent = '1';
  },2000);
  setTimeout(()=>{
    countdown.textContent = 'GO!';
  },3000); 
}

// NAVIGATE SPLASH PAGE TO COUNTDOWN PAGE
function showCountdown(){
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage,400);

}

//  get the value from selected radio button
function getradioValue(){
  let radioValue;
  radioInputs.forEach((radioInput)=>{
    if(radioInput.checked){
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}


// Start that decides amount of questions
function selectionQuestionAmount(e){
  e.preventDefault();
  questionAmount = getradioValue();
  if(questionAmount){
  showCountdown();
}
}


startForm.addEventListener('click', ()=>{
  radioContainers.forEach((radioEl)=>{

    // remove select label styling 
    radioEl.classList.remove('selected-label');

    // Add back if radio input is checked
    if(radioEl.children[1].checked){
      radioEl.classList.add('selected-label');
    }
  });
});


// Event Listeners
startForm.addEventListener('submit', selectionQuestionAmount);
gamePage.addEventListener('click', startTimer);

// OnlOad
getSavedBestScores();