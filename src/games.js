import { initTheme, setupThemeToggle } from "./theme.js";

initTheme();
setupThemeToggle();

// ==========================================
// Flashcard System
// ==========================================
const flashcardContainer = document.getElementById('flashcard-container');
const flashcardInner = document.getElementById('flashcard-inner');
const fcControls = document.getElementById('fc-controls');

let isFlipped = false;

const cardsData = [
    {
        term: "Mens Rea",
        def: "(Guilty mind) องค์ประกอบภายในของความผิดอาญา หมายถึงสภาพจิตใจของผู้กระทำที่รู้สำนึกและตั้งใจก่อให้เกิดผล"
    },
    {
        term: "Actus Reus",
        def: "(Guilty act) องค์ประกอบภายนอกของความผิดอาญา คือการกระทำทางกายภาพที่เป็นความผิดตามกฎหมาย"
    },
    {
        term: "Bona Fide",
        def: "(In good faith) โดยสุจริตใจ ปราศจากการหลอกลวงหรือเจตนาร้าย"
    }
];

let currentCardIdx = 0;

flashcardContainer?.addEventListener('click', () => {

    isFlipped = !isFlipped;

    if (isFlipped) {
        flashcardInner?.classList.add('rotate-y-180');
        fcControls?.classList.remove('opacity-50', 'pointer-events-none');
    } else {
        flashcardInner?.classList.remove('rotate-y-180');
        fcControls?.classList.add('opacity-50', 'pointer-events-none');
    }
});

window.nextCard = function () {

    flashcardInner?.classList.remove('rotate-y-180');
    fcControls?.classList.add('opacity-50', 'pointer-events-none');

    isFlipped = false;

    setTimeout(() => {

        currentCardIdx =
            (currentCardIdx + 1) % cardsData.length;

        document.getElementById('fc-term').innerText =
            cardsData[currentCardIdx].term;

        document.getElementById('fc-def').innerText =
            cardsData[currentCardIdx].def;

        document.getElementById('fc-progress').innerText =
            `${currentCardIdx + 1} / ${cardsData.length}`;

    }, 250);
};

// ==========================================
// Cloze Test
// ==========================================
const clozeAnswers = {
    blank1: 'free_consent',
    blank2: 'object'
};

window.checkClozeAnswers = function () {

    let score = 0;
    const total = Object.keys(clozeAnswers).length;

    Object.entries(clozeAnswers).forEach(([id, answer]) => {

        const selectEl = document.getElementById(id);

        selectEl.classList.remove(
            'text-green-400',
            'border-green-400',
            'text-red-400',
            'border-red-400'
        );

        if (selectEl.value === answer) {

            selectEl.classList.add(
                'text-green-400',
                'border-green-400'
            );

            score++;

        } else {

            selectEl.classList.add(
                'text-red-400',
                'border-red-400'
            );
        }
    });

    const feedback =
        document.getElementById('cloze-feedback');

    feedback.classList.remove(
        'hidden',
        'text-green-400',
        'text-red-400'
    );

    if (score === total) {

        feedback.innerText =
            '🎉 ยอดเยี่ยม! ถูกต้องทั้งหมดครับ';

        feedback.classList.add('text-green-400');

    } else {

        feedback.innerText =
            `🤔 ถูกต้อง ${score} จาก ${total} ช่อง`;

        feedback.classList.add('text-red-400');
    }
};

window.resetCloze = function () {

    document.querySelectorAll('.cloze-select')
        .forEach(el => {

            el.value = '';

            el.classList.remove(
                'text-green-400',
                'border-green-400',
                'text-red-400',
                'border-red-400'
            );
        });

    document.getElementById('cloze-feedback')
        ?.classList.add('hidden');
};