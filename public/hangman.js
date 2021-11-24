let arrayToPass;
let gameOverFlag = true;
function hideScreen(arg) {
  if (arg == "animal") {
    arrayToPass = [...animalsList];
  } else if (arg == "country") {
    arrayToPass = [...countryList];
  } else if (arg === "names") {
  }
  playSound();

  let screen = document.getElementById("secondScreen");
  screen.style.display = "none";
  document.getElementById("first screen").style.display = "block";
  animalGuess();
}

function pickRandom(arr) {
  let range = arr.length;
  let index = Math.floor(Math.random() * range + 0);
  return arr[index];
}

function animalGuess() {
  wordInnerHTML = document.getElementById("word");
  lifeInnerHTML = document.getElementById("life");
  let hint = document.getElementById("hint");
  let wrong = document.getElementById("wrong");
  let gameString = "";
  let orignalString = pickRandom(arrayToPass).toLowerCase();
  let gameOver = 5;
  let startingIndex;
  let usersInputsArr = [];
  for (let i = 0; i < orignalString.length; i++) {
    gameString = gameString + "_";
  }
  let revealedString = builtInRevealer(gameString, orignalString);
  console.log(revealedString);
  wordInnerHTML.innerHTML = revealedString;
  // hint maker
  let flag = false;

  hint.addEventListener("click", () => {
    if (flag === false && gameOverFlag === true) {
      const str = builtInRevealer(revealedString, orignalString);
      wordInnerHTML.innerHTML = str;
      revealedString = str;

      flag = true;
      if (!revealedString.includes("_")) {
        isWon(orignalString);
      }
    }
  });

  const input = document.getElementById("user-input");
  input.addEventListener("keydown", function (event) {
    if (event.code === "Enter" && gameOverFlag === true) {
      const userInput = event.target.value;
      usersInputsArr.push(userInput);
      event.target.value = "";
      // checking if more than a character
      if (userInput.length > 1) {
        document.getElementById("two-letter-condition").innerHTML =
          "Please enter only 1 character";
        return;
      }

      //game logic
      startingIndex = 0;
      // checking weather character lies inside a word or not
      if (orignalString.includes(userInput, startingIndex)) {
        // checking for how many times it is present
        while (orignalString.includes(userInput, startingIndex)) {
          // getting the index of inupt character
          let indexToReplaced = orignalString.indexOf(userInput, startingIndex);
          // calling the function which is replacing and storing it in variable
          let currentString = replacestring(
            revealedString,
            userInput,
            indexToReplaced
          );
          // updating the gameString variable
          revealedString = currentString;
          startingIndex = indexToReplaced + 1;
        }
        document.getElementById("two-letter-condition").innerHTML = "";
        wrong.innerHTML = "";
        wordInnerHTML.innerHTML = revealedString;
        document.getElementById("letterCorrect").play();

        //game end condition
      } else {
        gameOver--;
        document.getElementById("two-letter-condition").innerHTML = "";
        lifeInnerHTML.innerHTML = gameOver;
        wrong.innerHTML = "wrong";
        document.getElementById("letterWrong").play();
      }

      //won condition
      if (!revealedString.includes("_")) {
        isWon(orignalString);
      }

      //lost condition
      if (gameOver === 0) {
        gameOverFlag = false;
        document.getElementById(
          "won-condition"
        ).innerHTML = `YOU LOST!<br> THE WORD IS: ${orignalString}`;
        document.getElementById("losingAudio").play();
        loadPhoto(orignalString);
        showRestart();
        return;
      }
    }
  });
}
// function to replace string
function replacestring(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);
  let newString = firstPart + replaceChar + lastPart;

  return newString;
}

// function to show some characters
function builtInRevealer(hidedSTring, nonHidedstring) {
  let hidedSTrings = hidedSTring;
  let nonHidedstrings = nonHidedstring;
  console.log("hidedSTring: ", hidedSTring);
  let range = nonHidedstring.length;
  let index = Math.floor(Math.random() * range + 0);
  let replaceChar = nonHidedstring[index];
  let hidedStringChar = hidedSTring[index];
  if (hidedStringChar === "_") {
    let startingIndex = 0;
    let revealString;
    while (nonHidedstring.includes(replaceChar, startingIndex)) {
      index = nonHidedstring.indexOf(replaceChar, startingIndex);
      revealString = replacestring(hidedSTring, replaceChar, index);
      hidedSTring = revealString;
      startingIndex = index + 1;
    }
    return revealString;
  } else {
    return builtInRevealer(hidedSTrings, nonHidedstrings);
  }
}
// function to restart the game
let restart = document.getElementById("restart");
function showRestart() {
  restart.style.display = "unset";
}
// function to check for win
function isWon(keyword) {
  gameOverFlag = false;
  document.getElementById("won-condition").innerHTML = "YOU WON";
  document.getElementById("winningAudio").play();
  showRestart();
  loadPhoto(keyword);
  return;
}
function playSound() {
  var sound = document.getElementById("selectOption");
  sound.load();
  sound.play();
}

async function loadPhoto(keyword) {
  const frame = document.querySelector(".img-window");
  const loader = frame.querySelector(".loader");
  const img = frame.querySelector("img");

  try {
    loader.style.display = "unset";
    let res = await fetch(
      `https://api.unsplash.com/search/photos?query=${keyword}&client_id=OZRtWBpTS7o5pw4IKVj1sldnLHYC34xWMZJ5Ye1X-kQ`
    );
    if (res.ok) res = await res.json();
    else throw res.statusText;
    img.src = res.results[0].urls.small;
    img.style.display = "unset";
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = "none";
  }
}
