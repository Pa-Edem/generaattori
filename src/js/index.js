let loading = true,
    numberGroup = null,
    kysymys = null,
    vastaus = null,
    auttaa = null,
    help = null,
    kirO = null,
    kirA = null,
    uusiSata = null,
    counter = 0;


function goApp() {

    if (counter >= finalArray.length) {
        counter = 0;
    }

    if (loading) {
        vastaus.classList.remove('win');
        vastaus.classList.remove('lose');
        help.textContent = '';
        vastaus.value = '';
        getFullPhrases(counter);
        setTextContent(model.mode);
        vastaus.focus();
        counter++;
        loading = !loading;
    } else {
        checkWord();
    }
}

function setTextContent(mode) {
    loading = true;
    if (mode == 0) {
        kysymys.style.color = '#c33';
    }
    if (mode == 2) {
        kysymys.style.color = '#cc3';
    }
    if (mode == 1) {
        kysymys.style.color = '#3c3';
    }
    if (message) {
        kysymys.style.color = '#ccf';
    }
    auttaa.textContent = verbs[0];
    kysymys.textContent = textRus;
}

function checkWord() {
    loading = !loading;
    let textInput = vastaus.value.toLowerCase();
    if (textInput.slice(-1) === '?') {
        textInput = textInput.slice(0, -1);
    }

    if (textInput.trim() === textFin.slice(0, -2).trim()) {
        vastaus.classList.add('win');
    } else {
        if (kysymys.textContent !== 'lause generaattori') {
            vastaus.classList.add('lose');
            help.textContent = textFin;
        }
    }
}

function inA() {
    vastaus.value += kirA.textContent;
    vastaus.focus();
}

function inO() {
    vastaus.value += kirO.textContent;
    vastaus.focus();
}





document.addEventListener('DOMContentLoaded', function () {
    checkboxes = document.querySelectorAll('[type = checkbox]');
    checkboxes.forEach(element => {
        element.addEventListener('change', isChecked);
    });
    modal = document.querySelector('.modal');
    btn = document.querySelector('#btn-ok');
    btn.addEventListener('click', addingNeededWords);
    reset = document.querySelector('#btn-reset');
    reset.addEventListener('click', resetWords);
    all = document.querySelector('#btn-all');
    all.addEventListener('click', allWords);
    out = document.querySelector('.modal-content');
    uusiSata = document.querySelector('.uusi');
    uusiSata.addEventListener('click', goApp);
    kysymys = document.querySelector('.kysymys');
    vastaus = document.querySelector('.vastaus_input');
    help = document.querySelector('.help-text');
    auttaa = document.querySelector('.auttaa');
    kirO = document.querySelector('.btn_O');
    kirO.addEventListener('click', inO);
    kirA = document.querySelector('.btn_A');
    kirA.addEventListener('click', inA);
    numWord = 0;

    window.addEventListener('keyup', (event) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            goApp();
        }
    });
});