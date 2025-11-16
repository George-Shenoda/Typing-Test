export let translate = {
    en: {
        game: "Typing Speed Test",
        message: `You Are Playing On 
        <span class="lvl"></span> 
        Level &You Have 
        <span class="seconds"></span> 
        Seconds To Type The Word
        `,
        start: "Start Playing",
        time: `Time Left: <span></span> Seconds`,
        score: `Score: <span class="got">0</span> From <span class="total"></span>`,
        levels: {
            easy: "Easy",
            normal: "Normal",
            hard: 'Hard'
        },
        upcoming: "Words will Show here",
        gameOver: "Game Over",
        congrats: "Congrats"
    },
    ar: {
        game: "اختبار سرعة الكتابة",
        message: `انت تلعب في مستوي 
        <span class="lvl"></span> 
        و لديك 
        <span class="seconds"></span> 
        ثانية لتكتب الكلمة
        `,
        start: "ابدا اللعب",
        time: `متبقي من الوقت: <span></span> ثانية`,
        score: `النتيجة: <span class="got">0</span> من <span class="total"></span>`,
        levels: {
            easy: "سهل",
            normal: "متوسط",
            hard: 'صعب'
        },
        upcoming: "الكلمات ستظهر هنا",
        gameOver: "حظ اوفر",
        congrats: "تهنينا"
    },
    it: {
        game: "Gioco Di Test Di Velocità Di Digitazione",
        message: `Stai Giocando al 
        <span class="lvl"></span>
        Livello e Hai
        <span class="seconds"></span> 
        Secondi per Digitare la Parola`,
        start: "Inizia a Giocare",
        time: `Tempo rimanente: <span></span> secondi`,
        score: `Punto: <span class="got">0</span> Su <span class="total"></span>`,
        levels: {
            easy: "Facile",
            normal: "Normale",
            hard: 'Difficile'
        },
        upcoming: "Le parole verranno mostrate qui",
        gameOver: "Game Over",
        congrats: "congratulazioni"
    },
};

export function changeLang() {
    let lang = translate[document.querySelector("html").lang];
    document.title = lang["game"];
    document.querySelector(".game .name").innerHTML = lang["game"];
    document.querySelector(".game .message").innerHTML = lang["message"];
    document.querySelector(".game .start").innerHTML = lang["start"];
    document.querySelector(".game .control .time").innerHTML = lang["time"];
    document.querySelector(".game .control .score").innerHTML = lang["score"];
    document.querySelector(`#level [value='easy']`).innerHTML = lang["levels"]["easy"];
    document.querySelector(`#level [value='normal']`).innerHTML = lang["levels"]['normal'];
    document.querySelector(`#level [value='hard']`).innerHTML = lang["levels"]['hard'];
    document.querySelector(".upcoming-words").innerHTML = lang['upcoming'];
}