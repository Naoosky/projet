'use strict';

let dyslexia = false;
let dyslexiaBtn = document.getElementById('dyslexia');

dyslexiaBtn.addEventListener('click', () => {
    dyslexia = !dyslexia;
    dyslexiaBtn.classList.toggle('active');
    if (dyslexia) {
        document.body.classList.add('dyslexia');
    } else {
        document.body.classList.remove('dyslexia');
    }
});