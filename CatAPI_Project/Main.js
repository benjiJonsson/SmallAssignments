
// Setting URL
const url = `https://api.thecatapi.com/v1/breeds`;


//Starting the Game
const startButton = document.getElementById("startGame");
let catBreeds = [];

//Declaring Global Variables
var userNoSelect;
var theChosenOneL;
var randomBreeds;
var displayBox;
var theChosenOne;
var breedList;

// Hiding Divs that should be shown when start button is pressed
const div2 = document.getElementById("div3");
const hint = document.getElementById("hintButton");

// Loading in the API data onload
window.onload = function() {
    fetchingCats()
    div2.style.display = "none" // Hiding Divs that should be shown when start button is pressed
}

// A function to fetch the Cat API data
async function fetchingCats(){
    await fetch(url) 
    .then(response => response.json())
    .then(data => {
        catBreeds = data;
        startButton.addEventListener("click", function() { 
            startGame(catBreeds)       //Decdided to include this in the fetch so the data is only loaded in once
        })  
    })
    
    .catch( err => {
    console.log("Could not get cat breed", err); 
    });
}

// A function which stores all the functions for the game: activated when start button is pressed
function startGame(catBreeds) {
    div2.style.display = "block"
    victoryMessage.innerHTML = "";

    // Randomly Select 5, 10, 15, or 20 Breeds
    userNoSelect = document.getElementById("numberCats").value;
    const shuffled = catBreeds.sort(() => 0.5 - Math.random());
    randomBreeds = shuffled.slice(0, userNoSelect);
    //console.log(randomBreeds);

    //reset scores 
    score5 =0;
    score10 =0;
    score15 =0;
    score20 =0;

    //Keeping track of guesses and questions
    guess = 0;
    question = 0; 
    GQ.innerHTML = "Question(s): " + question + " Guess(s): " + guess;
    
    //Winning game check 
    winGame = false;

    // Display them 
    displayTenCats(randomBreeds);

    // Getting computer's chosen breed 
    let index = (getRandomInt(0, randomBreeds.length -1));
    theChosenOne = randomBreeds[index];
    theChosenOneL = theChosenOne.temperament.toLowerCase();
    //console.log(theChosenOne.name)

    //Add an option for each breed included in randomBreeds
    fillBreedOptions(randomBreeds);
    //Add an option for each temperament included in randomBreeds
    fillTempOptions(randomBreeds);


    displayBox = document.getElementsByClassName("myStyle");

    // Calling the fucntion which loops through users selected temperament question
    tempSelect.removeEventListener("change", tempQuestion);
    tempSelect.addEventListener("change", tempQuestion);

    // Calling the fucntion which loops through users selected breed guess
    guessButton.removeEventListener("click", guessQuestion);
    guessButton.addEventListener("click", guessQuestion);

    //Hint
    hint.removeEventListener("click", mathematicsGod);
    hint.addEventListener("click", mathematicsGod);

    //Adding a feature to allow the user to quit the game
    quitButton.addEventListener("click", () => {
        victoryMessage.innerHTML = "Play again soon!";;
        highScoreCompare();
        breedItems.innerHTML = ""; 
        div2.style.display = "none"
    })
}

// A function to dsiplay 10 randomly selected breeds
const guessButton = document.getElementById("guessButton");
const breedItems = document.getElementById("div2");
function displayTenCats (randomBreeds) {
    breedItems.innerHTML = "";
    for (breed of randomBreeds) {
        breedList = document.createElement("div");
        breedList.innerHTML = `<span class = "bold"> ${breed.name} </span> - ${breed.temperament}`;
        breedItems.appendChild(breedList).className = "myStyle";
    }
}

// A function to select a random breed from the array of 10 breeds
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Filling in the breed option values
function fillBreedOptions (randomBreeds) {
    const guessSelect = document.getElementById("guessSelect");
    guessSelect.innerHTML = "<option value=''>Select Breed</option>";
    for (breed of randomBreeds) {
        const option1 = document.createElement("option");
        option1.value = breed.id;
        option1.innerHTML = breed.name;
        guessSelect.appendChild(option1);
    }
}

//Filling in the temperament option values 
const tempSelect = document.getElementById("tempSelect");
let tempArray = [];
let catArray = [];
let catArray2 = [];
function fillTempOptions (randomBreeds) {
    tempSelect.innerHTML = "<option value=''>Select Temperament</option>";
    for (breed of randomBreeds){
        tempArray = breed.temperament.split(", ");
        //console.log(breed.temperament);
        for(temps in tempArray){
            catArray.push(tempArray[temps]); // Creating an array of all cat temperaments
        }
    }
    catArray2 = catArray.filter((item, index) => catArray.indexOf(item) === index); // Removing duplicates
    //https://stackoverflow.com/questions/45522616/how-to-use-indexof-with-filter-in-javascript
    for (temps of catArray2){
        const option2 = document.createElement("option");
        option2.value = temps;
        option2.innerHTML = temps;
        tempSelect.appendChild(option2);
    }
}

//For user guess
const quitButton = document.getElementById("quitGame");
const numberCats = document.getElementById("numberCats");

// Select Number of Breeds
numberCats.innerHTML = "<option value=''>No. of Breeds</option>";
function fillNumberCats(){
    for (let i=0; i< 4; i++){
        const option3 = document.createElement("option");
        option3.value = (i + 1) * 5;            // Proabaly a smarter way to do this, but this seemed simple enough
        option3.innerHTML = (i + 1) * 5;
        numberCats.appendChild(option3);
    }
}
fillNumberCats();

//Function for temperament question by user
function tempQuestion() {
    var tempAlert = 0;
    question += 1; 
    var userTempSel = document.getElementById("tempSelect").value.toLowerCase();
    var x = document.getElementById("guessSelect");
    for (let i=0; i < randomBreeds.length; i++){
        let breedLower = randomBreeds[i].temperament.toLowerCase()
        console.log(breedLower);
        if (theChosenOneL.includes(userTempSel)){
            if (breedLower.includes(userTempSel)){
                tempAlert = 1;
            } else {
                displayBox[i].style.backgroundColor = "#e645c879";
                displayBox[i].innerHTML = '<strike>' + displayBox[i].innerHTML + '</strike>';
                tempAlert = 1;

            }
        } else {
            if (breedLower.includes(userTempSel)){
                displayBox[i].style.backgroundColor = "#e645c879";
                displayBox[i].innerHTML = '<strike>' + displayBox[i].innerHTML + '</strike>';
                tempAlert = 2;
            }
        }
    }

    // If statement to alert the user about their guess
    if (tempAlert == 1){
        alert("Yes! The breed is " + userTempSel); 
    } else if (tempAlert == 2) {
        alert("No! The breed is not " + userTempSel); 
    } 
    tempAlert = 0;
    removeTEMP();
    highScoreNumber();
    GQ.innerHTML = "Question(s): " + question + " Guess(s): " + guess;
}

// Reference for strking elements: https://stackoverflow.com/questions/6841271/strike-the-element-using-id-in-javascript


//Function for removing selected temperament so user can't guess again 
function removeTEMP(){
    var x = document.getElementById("tempSelect");
    x.remove(x.selectedIndex);
}

displayBox = document.getElementsByClassName("myStyle");

//Function for breed guess by user
function guessQuestion() {
    var guessAlert = 0;
    guess +=1;
    const playerGuess = guessSelect.value;
    for (let i=0; i < randomBreeds.length; i++){
        if (randomBreeds[i].id == playerGuess && playerGuess == theChosenOne.id){
            displayBox[i].style.backgroundColor = "#4bdf3579";
            guessAlert = 1;
            winGame = true;
        } else if (randomBreeds[i].id == playerGuess && playerGuess != theChosenOne.id){
            displayBox[i].style.backgroundColor = "#e645c879";
            displayBox[i].innerHTML = '<strike>' + displayBox[i].innerHTML + '</strike>';
            guessAlert = 2;
        } else if (randomBreeds[i].id != playerGuess && playerGuess === theChosenOne.id){
            displayBox[i].style.backgroundColor = "#e645c879";
            displayBox[i].innerHTML = '<strike>' + displayBox[i].innerHTML + '</strike>';
        } 
    }
    removeBREED();
    highScoreNumber();
    if (guessAlert == 1) {
        alert("Correct! The Breed was " + theChosenOne.name);
        highScoreCompare();
    } else if (guessAlert == 2) {
        alert("Incorrect!")
    }
    guessAlert = 0;
    GQ.innerHTML = "Question(s): " + question + " Guess(s): " + guess;
}

//Function for removing breed guess so user can't guess again
function removeBREED(){
    var x = document.getElementById("guessSelect");
    x.remove(x.selectedIndex);
    console.log(x);
}

//Tracking Highscore
//Variable to Determine Win
var winGame = false;

//5 cats 
var highScore5 = 100;
var score5 = 0;

//10 cats 
var highScore10 = 100;
var score10 = 0;

//15 cats 
var highScore15 = 100;
var score15 = 0;

//20 cats 
var highScore20 = 100;
var score20 = 0;

//Function for highscore for each # of selected cats
function highScoreNumber(){
    if (userNoSelect == 5) {
        score5 +=1;
    } else if (userNoSelect == 10){
        score10 += 1;
    } else if (userNoSelect == 15){
        score15 += 1; 
    } else if (userNoSelect == 20){
        score20 +=1;
    }

}
//Function to compare a game's score to user's highscore
const victoryMessage = document.getElementById("victoryMessage");
function highScoreCompare(){
    if (userNoSelect == 5) {
        if (score5 < highScore5 && winGame){
            highScore5 = score5;
            victoryMessage.innerHTML = "New Highscore! " + highScore5;
            let HS5 = document.getElementById("score5");
            HS5.innerHTML = "5:  " + highScore5;
        }
    } else if (userNoSelect == 10){
        if (score10 < highScore10 && winGame){
            highScore10 = score10;
            victoryMessage.innerHTML = "New Highscore! " + highScore10;
            let HS10 = document.getElementById("score10");
            HS10.innerHTML = "10: " + highScore10
        }
    } else if (userNoSelect == 15){
        if (score15 < highScore15 && winGame){
            highScore15 = score15;
            victoryMessage.innerHTML = "New Highscore! " + highScore15;
            let HS15 = document.getElementById("score15");
            HS15.innerHTML = "15: " + highScore15
        }
    } else if (userNoSelect == 20){
        if (score20 < highScore20 && winGame){
            highScore20 = score20;
            victoryMessage.innerHTML = "New Highscore! " + highScore20;
            let HS20 = document.getElementById("score20");
            HS20.innerHTML = "20: " + highScore20
        }
    }

}

// Variables for guesses and questions 
const GQ = document.getElementById("questionsGuess");
GQ.innerHTML = "To start: select number of breeds in game (e.g. 10) and then press New Game"
var guess = 0;
var question = 0;


//Hint 
let minDifference = 100;
let minTemperament;

function mathematicsGod (){
    //First step must be to try to count each time a temperament occurs
    let tempCounts = {};
    for (temperament of catArray){
        if (temperament in tempCounts){
            tempCounts[temperament][0]++;
        } else {
            tempCounts[temperament] = [1];
        }
    }
    console.log(tempCounts);

    //Then subtract that number from the number of breeds in that game
    // i.e., if there are 10 breeds and 5 are playful, 10-5 = 5 are not
    // Then subtract the original number from that number. Taking the absolute value
    for (temperament in tempCounts) {
        tempCounts[temperament][0 - userNoSelect];
    }
    Object.entries(tempCounts).forEach(([temperament, count]) => { 
            let difference = Math.abs((userNoSelect - count) - count);
            if (difference < minDifference) {
                minDifference = difference;
                minTemperament = temperament;
            }
    })
    console.log(minDifference, minTemperament);
    alert("I suggest " + minTemperament);
}


// Storing HighScores after webpage refresh 
// Ran out of time to complete so have commented it out
/*
let HighScores;
var mostRecentScore = JSON.parse(localStorage.getItem("mostRecentScore")) || [ ];
function savingHighScore(){
    if (userNoSelect == 5) {
        mostRecentScore = highScore5;
        HighScores = userNoSelect
    } else if (userNoSelect == 10){
        mostRecentScore = highScore5;
        HighScores = userNoSelect
    } else if (userNoSelect == 15){
        mostRecentScore = highScore15
        HighScores = userNoSelect
    } else if (userNoSelect == 20){
        mostRecentScore = highScore20
        HighScores = userNoSelect
    }
}
const highScores = JSON.parse(localStorage.getItem("highScores")) || [ ];

const MAX_HIGH = 5;

function saveHighScore () {
const score = {
    score: mostRecentScore,
    breedNo: HighScores
};
highScores.push(score)
console.log(highScores);

highScores.sort( (a,b) => b.score - a.score);
highScores.splice(4);

localStorage.setItem('highScores', JSON.stringify(highScores));
};

// https://michael-karen.medium.com/how-to-save-high-scores-in-local-storage-7860baca9d68
// https://www.youtube.com/watch?v=DFhmNLKwwGw

*/