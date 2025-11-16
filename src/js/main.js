import { changeLang, translate } from "./translate";
import { generate } from "random-words-multilang";

//storage
function appStorage(appName) {
    return {
        key(k) {
            return `${appName}__${k}`;
        },
        get(k) {
            return localStorage.getItem(this.key(k));
        },
        set(k, v) {
            localStorage.setItem(this.key(k), v);
        },
        remove(k) {
            localStorage.removeItem(this.key(k));
        },
    };
}

//Declarations
let startBtn;
let secondsSpan;
let lvlSpan;
let upcoming;
let timeLeft;
let scoreTotal;
let score;
let input;
let wordsArr;
let selectLevels;
let word;
let footer;
let startGame;
const noOfWords = 30;
const storage = appStorage("TypeTesting");
const levels = {
    easy: 6,
    normal: 4,
    hard: 2,
};
let defaultLevel;
let defaultSeconds;
function decl() {
    startBtn = document.querySelector(".start");
    secondsSpan = document.querySelector(".message .seconds");
    lvlSpan = document.querySelector(".message .lvl");
    upcoming = document.querySelector(".upcoming-words");
    timeLeft = document.querySelector(".time span");
    scoreTotal = document.querySelector(".score .total");
    input = document.querySelector(".input");
    selectLevels = document.querySelector("#level");
    word = document.querySelector(".word");
    score = document.querySelector(".got");
    footer = document.querySelector(".finish");
}

//Select Langs
document.querySelector("#langs").addEventListener("change", () => {
    storage.set("lang", document.querySelector("#langs").value);
    if (document.querySelector("#langs").value === "ar") {
        storage.set("dir", "rtl");
    } else {
        storage.set("dir", "ltr");
    }
    reset();
    start();
});

//Select Level
document.querySelector("#level").addEventListener("change", () => {
    storage.set("level", document.querySelector("#level").value);
    defaultLevel = storage.get("level");
    defaultSeconds = levels[defaultLevel];
    lvlSpan.textContent =
        translate[document.querySelector("html").lang]["levels"][defaultLevel];
    secondsSpan.innerHTML = defaultSeconds;
    timeLeft.innerHTML = defaultSeconds;
});

//Dark mode
document.querySelector(".darkBtn").addEventListener("click", () => {
    document.querySelector("body").classList.toggle("dark");
    if (document.querySelector("body").classList.contains("dark")) {
        storage.set("dark", "yes");
    } else {
        storage.set("dark", "no");
    }
});

//Get the Saved Storage
function getStorage() {
    document.querySelector("html").lang = storage.get("lang") || "en";
    document.querySelector("html").dir = storage.get("dir") || "ltr";
    storage.get("dark") === "yes"
        ? document.querySelector("body").classList.add("dark")
        : document.querySelector("body").classList.add("light");
    document.querySelector("#langs").value = storage.get("lang") || "en";
    document.querySelector("#level").value = storage.get("level") || "normal";
}

//Start Game
function start() {
    getStorage();
    changeLang();
    // re-query elements after changeLang injected the translated HTML
    decl();
    init();
}

//Reset Game
function reset() {
    decl();
    upcoming.innerHTML = "";
    startBtn.classList.remove("disabled");
    selectLevels.classList.remove("disabled");
    footer.innerHTML = "";
    word.innerHTML = "";
    input.value = "";
    timeLeft.innerHTML = defaultSeconds;
}

//Add upcoming Words
function addWords(words) {
    upcoming.innerHTML = "";
    words.forEach((wor, index) => {
        if (index === 0) {
            word.style.textTransform = "capitalize";
            word.innerHTML = wor;
        } else {
            let div = document.createElement("div");
            div.textContent = wor;
            div.style.textTransform = "capitalize";
            upcoming.appendChild(div);
        }
    });
}

//initialize game
function init() {
    wordsArr = generate(noOfWords, document.querySelector("html").lang);
    defaultLevel = storage.get("level") || "normal";

    defaultSeconds = levels[defaultLevel];

    lvlSpan.innerHTML =
        translate[document.querySelector("html").lang]["levels"][defaultLevel];
    secondsSpan.innerHTML = defaultSeconds;
    timeLeft.innerHTML = defaultSeconds;
    scoreTotal.innerHTML = wordsArr.length;
}

start();

//Disable paste
input.onpaste = function () {
    return false;
};

//Start Game;
startBtn.onclick = function () {
    // regenerate words each time user starts (fresh game)
    wordsArr = generate(noOfWords, document.querySelector("html").lang);

    // reset UI and state
    reset();

    // now populate the words (after reset)
    addWords(wordsArr);

    // disable controls for running game
    this.classList.add("disabled");
    selectLevels.classList.add("disabled");

    // focus the input and begin timer
    input.focus();
    // startTime will create a new interval
    startTime();
};

function startTime() {
    // avoid duplicate intervals
    if (startGame) {
        clearInterval(startGame);
        startGame = null;
    }

    // start with the default seconds
    timeLeft.innerHTML = defaultSeconds;

    startGame = setInterval(() => {
        // numeric decrement
        let secs = Number(timeLeft.innerHTML) - 1;
        timeLeft.innerHTML = secs;

        if (secs <= 0) {
            // reached zero: evaluate current word
            const currentWord = (word.innerHTML || "").trim().toLowerCase();
            const typed = (input.value || "").trim().toLowerCase();

            if (currentWord && currentWord === typed) {
                // correct: award point and move on
                input.value = "";
                score.innerHTML = String(Number(score.innerHTML || "0") + 1);

                if (upcoming.children.length > 0) {
                    // shift next word into place and reset timer
                    word.innerHTML = upcoming.children[0].innerHTML;
                    upcoming.removeChild(upcoming.children[0]);
                    timeLeft.innerHTML = defaultSeconds; // reset timer for next word
                } else {
                    // no more upcoming words -> finish (append footer child) and stop
                    let span = document.createElement("span");
                    span.className = "good";
                    span.innerHTML =
                        translate[document.querySelector("html").lang][
                            "congrats"
                        ];
                    footer.appendChild(span);
                    startBtn.classList.remove("disabled");
                    selectLevels.classList.remove("disabled");
                    upcoming.innerHTML =
                        translate[document.querySelector("html").lang][
                            "upcoming"
                        ];
                    clearInterval(startGame);
                    startGame = null;
                }
            } else {
                // wrong input -> game over, append footer child and stop
                let span = document.createElement("span");
                span.className = "bad";
                span.innerHTML =
                    translate[document.querySelector("html").lang]["gameOver"];
                footer.appendChild(span);
                startBtn.classList.remove("disabled");
                selectLevels.classList.remove("disabled");
                clearInterval(startGame);
                startGame = null;
            }
        }

        // if footer has a child for any reason, ensure we stop the interval (safety)
        if (footer.children.length > 0 && startGame) {
            clearInterval(startGame);
            startGame = null;
        }
    }, 1000);
}
