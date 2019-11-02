const vokaalit = 'aouieyäö',
    kptVahva = ['k', 'p', 't', 'kk', 'pp', 'tt', 'nk', 'mp', 'nt', 'lt', 'rt'],
    kptHeikko = ['', 'v', 'd', 'k', 'p', 't', 'ng', 'mm', 'nn', 'll', 'rr'],
    personRus = ['я', 'ты', 'он', 'мы', 'вы', 'они'],
    personFin = ['minä', 'sinä', 'hän', 'me', 'te', 'he'];

let model = {},
    person = {},
    textFin = '',
    textRus = '',
    verbs = []
    message = '';

// получение полных фраз
// counter = очередной номер массива в общем массиве слов
function getFullPhrases(counter) {
    // получение типа фразы
    model = getModel();
    // местоимение
    person = getPerson();
    // получение полной финской фразы
    if (finalArray.length) {
        verbs = finalArray[counter].concat();
        textFin = getPhraseFin(model, person, verbs);
        message = '';
    } else {
        message = 'надо выбрать минимум 1 слово';
    }
    // получение полной русской фразы
    let idx = Number(person.key) + 1;
    textRus = getPhraseRus(model, person, verbs[idx], message);
}

// получение полной финской фразы
// getPhraseFin(тип фразы, лицо, глаголы[0])
function getPhraseFin(model, person, verbs) {
    let wordVerb = verbs[0];
    // тип глагола
    const typeVerb = getTypeVerb(wordVerb);
    // тело глагола
    const taloVerb = getTaloVerb(verbs, wordVerb, typeVerb, person, model);

    // тело глагола после kpt
    const taloKpt = getVerbKpt(typeVerb, model.mode, person.key, taloVerb.talo);

    // сборка
    const verbCorrect = buildingPhrase(model, person, taloKpt, typeVerb);

    return verbCorrect;
}

// получение полной русской фразы
// getPhraseFin(тип фразы, лицо, глаголы[лицо + 1])
function getPhraseRus(model, person, glagol, message = '') {
    let out = '';
    // 0 - отрицание, 1 - утверждение, 2 - вопрос
    if (!message) {
        if (model.mode === 0) {
            out = person.rus + ' не ' + glagol + model.mark;
            return out;
        }
        if (model.mode === 1) {
            out = person.rus + ' ' + glagol + model.mark;
            return out;
        }
        if (model.mode === 2) {
            out = glagol + ' ли ' + person.rus + model.mark;
            return out;
        }
    } else {
        return message;
    }
}


// сборка фразы
function buildingPhrase(model, person, talo, type) {

    const end = getEnd(person.key, talo, type);
    let out = '';
    // 0 - отрицание, 1 - утверждение, 2 - вопрос
    if (model.mode === 0) {
        out = person.fin + ' ' + person.neg + ' ' + talo + model.mark;
        return out;
    }
    if (model.mode === 1) {
        out = person.fin + ' ' + talo + end + model.mark;
        return out;
    }
    if (model.mode === 2) {
        out = talo + end + isKO(talo) + ' ' + person.fin + model.mark;
        return out;
    }
}

// получим окончание
function getEnd(key, talo, type) {
    let end = '';
    switch (key) {
        case 0:
            end = 'n';
            break;
        case 1:
            end = 't';
            break;
        case 2:
            if (type == 4) {
                if (talo.slice(-2, -1) === 'a' || talo.slice(-2, -1) === 'ä') {
                    end = '';
                } else {
                    end = talo.slice(-1);
                }
            } else if (type == 2) {
                if (talo === 'teke' || talo === 'näke') {
                    end = 'e';
                } else {
                    end = '';
                }
            } else {
                end = talo.slice(-1);
            }
            break;
        case 3:
            end = 'mme';
            break;
        case 4:
            end = 'tte';
            break;
        case 5:
            if (talo === 'teke' || talo === 'näke') {
                end = 'vät';
            } else {
                end = isOVAT(talo);
            }
            break;
    }
    return end;
}

// получение типа фразы
// 0 - отрицание, 1 - утверждение, 2 - вопрос
// { mode: 2, mark: ' ?' }
function getModel() {
    let mode = Math.floor(Math.random() * 3);
    model.mark = ' .';
    mode === 2 ? model.mark = ' ?' : ' .';
    model.mode = mode;
    return model;
}

// получение лица
// { rus: 'они', fin: 'he', key: 5 , neg: 'ovät'}
function getPerson() {
    const negFin = ['en', 'et', 'ei', 'emme', 'ette', 'eivät'];
    let num = Math.floor(Math.random() * 6);
    person.rus = personRus[num];
    person.fin = personFin[num];
    person.key = num;
    person.neg = negFin[num];
    return person;
}

// получение нужного A
function isA(sana) {
    return (!sana.includes('a') && !sana.includes('o') && !sana.includes('u')) ? 'ä' : 'a';
}

// получение нужного OVAT
function isOVAT(sana) {
    return (!sana.includes('a') && !sana.includes('o') && !sana.includes('u')) ? 'vät' : 'vat';
}

// получение нужного KO
function isKO(sana) {
    return (!sana.includes('a') && !sana.includes('o') && !sana.includes('u')) ? 'kö' : 'ko';
}

// получение типа глагола
// 1, 2, 3, 4, 5
function getTypeVerb(word) {

    const b = word.slice(-1);
    const bb = word.slice(-2, -1);
    const bbb = word.slice(-3, -2);

    // первый
    if (b === 'a' || b === 'ä') {
        if (vokaalit.includes(bb)) {
            return 1;
        }
    }
    // второй
    if (b === 'a' || b === 'ä') {
        if (bb === 'd') {
            return 2;
        }
    }
    // третий
    if (b === 'a' || b === 'ä') {
        if (bb === 'l' || bb === 'r' || bb === 'n') {
            return 3;
        }
        if (bb === 't' && bbb === 's') {
            return 3;
        }
    }
    // четвертый
    if ((b === 'a' || b === 'ä') && bb === 't') {
        if (vokaalit.includes(bbb) && bbb !== 'i') {
            return 4;
        }
    }
    // пятый
    if (b === 'a' || b === 'ä') {
        if (bb === 't' && bbb === 'i') {
            return 5;
        }
    }
    return console.log('Не могу определить тип глагола');
}

// получение тела глагола
// { talo: 'puhu' }
function getTaloVerb(verbs, wordVerb, typeVerb, person, model) {
    let talo = {};

    switch (typeVerb) {
        case 1:
            talo.talo = wordVerb.slice(0, -1);
            break;
        case 2:
            if (wordVerb === 'tehdä') {
                if ((person.key != 2 && person.key != 5) || model.mode == 0) {
                    talo.talo = 'tee';
                } else {
                    talo.talo = 'teke';
                }
            } else if (wordVerb === 'nähdä') {
                if ((person.key != 2 && person.key != 5) || model.mode == 0) {
                    talo.talo = 'näe';
                } else {
                    talo.talo = 'näke';
                }
            } else {
                talo.talo = wordVerb.slice(0, -2);
            }
            break;
        case 3:
            if (verbs[7]) {
                talo.talo = verbs[7] + 'e';
            } else {
                talo.talo = wordVerb.slice(0, -2) + 'e';
            }
            break;
        case 4:
            if (verbs[7]) {
                talo.talo = verbs[7] + isA(wordVerb.slice(0, -2));
            } else {
                talo.talo = wordVerb.slice(0, -2) + isA(wordVerb.slice(0, -2));
            }
            break;
        case 5:
            talo.talo = wordVerb.slice(0, -2) + 'tse';
            break;
    }
    return talo;
}

// тело глагола после kpt
// getVerbKpt(person, taloVerb)
function getVerbKpt(type, mode, key, talo) {
    if (type == 1) {
        return getKpt_1Type(mode, key, talo);
    }
    return talo;
}

// чередование для 1 типа глаголов
function getKpt_1Type(mode, key, talo) {

    if ((key != 2 && key != 5) || mode == 0) {
        let kk = null;
        for (let i = 1; i < talo.length; i++) {
            let k = talo.slice(-1 - i, -i);
            if (vokaalit.includes(k)) {
                kk = i;
                break;
            }
        }
        let aaa = talo.slice(0, -kk);
        let kpt = talo.slice(-kk, -1);
        let zzz = talo.slice(-1);

        let correct = kpt;
        if (kpt === 'sk' || kpt === 'st' || kpt === 'tk') {
            return talo;
        } else {
            correct = frontKpt(kpt);
            return aaa + correct + zzz;
        }
    } else {
        return talo;
    }
}
// логика прямого чередования
function frontKpt(kpt) {
    let correct = kpt;

    if (kpt.length === 1) {
        switch (kpt) {
            case kptVahva[0]:
                correct = kptHeikko[0];
                break;
            case kptVahva[1]:
                correct = kptHeikko[1];
                break;
            case kptVahva[2]:
                correct = kptHeikko[2];
                break;
        }
    }

    if (kpt.length === 2) {

        if (kptVahva.includes(kpt)) {
            // точное соответствие
            switch (kpt) {
                case kptVahva[3]:
                    correct = kptHeikko[3];
                    break;
                case kptVahva[4]:
                    correct = kptHeikko[4];
                    break;
                case kptVahva[5]:
                    correct = kptHeikko[5];
                    break;
                case kptVahva[6]:
                    correct = kptHeikko[6];
                    break;
                case kptVahva[7]:
                    correct = kptHeikko[7];
                    break;
                case kptVahva[8]:
                    correct = kptHeikko[8];
                    break;
                case kptVahva[9]:
                    correct = kptHeikko[9];
                    break;
                case kptVahva[10]:
                    correct = kptHeikko[10];
                    break;
            }
        } else {
            // если первая буква другая, а вторая k, p или t
            let x = kpt.slice(0, 1);
            let xx = kpt.slice(-1);
            if (x !== 'k' && x !== 'p' && x !== 't') {
                if (xx === 'k' || xx === 'p' || xx === 't') {
                    let idxx = kptVahva.indexOf(xx);
                    correct = x + kptHeikko[idxx];
                }
            }
        }
    }

    if (kpt.length > 2) {
        // если первая буква другая, а вторая и третья наши
        let xxx = kpt.slice(-2);
        if (kptVahva.includes(xxx)) {
            let idxxx = kptVahva.indexOf(xxx);
            correct = kpt.slice(0, 1) + kptHeikko[idxxx];
        }
    }

    return correct;
}


// метод SHUFFLE перемешивает массив
Array.prototype.shuffle = function () {
    if (this.length == 1) {
        return this;
    }
    for (let j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
}
