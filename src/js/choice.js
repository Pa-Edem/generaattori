let checkboxes = null,
    btn = null,
    modal = null,
    out = null,
    finalArray = [],
    final = null,
    ggg = null;

// при выборе группы
// либо добавляем в финальный массив слова из этой группы
// либо удаляем из финального массива слова этой группы
function isChecked(event) {
    let gg = event.target.getAttribute('data-key');
    ggg = gg;

    if (event.target.checked) {
        // отметили какую-то группу
        // получим все массивы слов этой группы
        let allArraysAddedGroup = loadCheckedGroup(gg);
        // получим массив финских слов этой группы
        let arraySuomenSanat = getSanatList(allArraysAddedGroup);
        // получим массив финских слов этой группы из LocalStorage
        let arraySanatFromLS = getSanatFromLS(gg);
        // выведем на экран список слов этой группы
        viewSanatFromList(arraySanatFromLS, arraySuomenSanat, out);
        // повесим на них слушателей
        addListenerOnSanat('.sana');
    } else {
        // сняли отметку с какой-то группы
        // получим все массивы слов этой группы
        let allArraysAddedGroup = loadCheckedGroup(gg);
        // получим массив финских слов этой группы
        let arraySuomenSanat = getSanatList(allArraysAddedGroup);
        // удаляем из финального массива слова этой группы
        removeUnCheckedGroup(arraySuomenSanat);
        viewNumberSanat(ggg);
    }
}
// получим все массивы слов нужной группы
function loadCheckedGroup(gg) {
    let arrayFromCheckedGroup = [];
    kaikki.forEach(obj => {
        if (obj.hasOwnProperty(gg)) {
            arrayFromCheckedGroup.push(obj[gg]);
        }
    });
    return arrayFromCheckedGroup;
}
// получим массив финских слов
function getSanatList(arr) {
    let arraySanatList = [];
    arr.forEach(elem => {
        arraySanatList.push(elem[0]);
    });
    return arraySanatList;
}
// получим массив финских слов из LS
function getSanatFromLS(gg) {
    let json = localStorage.getItem(gg);
    if (json) {
        return JSON.parse(json);
    } else {
        return false;
    }
}
// выведем на экран список слов выбранной группы
function viewSanatFromList(listLS, list, parent) {
    let html = '';
    list.sort();
    for (let i = 0; i < list.length; i++) {
        if (listLS.length > 0) {
            if (listLS.includes(list[i])) {
                html += `<div class="sana modal-content-item linetext">${list[i]}</div>`;
            } else {
                html += `<div class="sana modal-content-item">${list[i]}</div>`;
            }
        } else {
            html += `<div class="sana modal-content-item">${list[i]}</div>`;
        }
    }
    parent.innerHTML = html;
    modal.style.display = 'flex';
}
// повесим на них слушателей
function addListenerOnSanat(selector) {
    let elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', () => {
            isUseSana(event);
        });
    }
}
// определяем выбор слов
function isUseSana(event) {
    let element = event.target;
    if (element.classList.contains('linetext')) {
        element.classList.remove('linetext');
    } else {
        element.classList.add('linetext');
    }
}
// жмем RESET и очищаем слова в окне
function resetWords() {
    event.preventDefault();
    let arr = document.querySelectorAll('.sana');
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].classList.contains('linetext')) {
            arr[i].classList.remove('linetext');
        }
    }
}
// жмем ALL и все слова запишем в хранилище
function allWords() {
    event.preventDefault();
    // получим все массивы слов этой группы
    let allArraysAddedGroup = loadCheckedGroup(ggg);
    // получим массив финских слов этой группы
    let arraySuomenSanat = getSanatList(allArraysAddedGroup);
    // запишем выбранные слова в Хранилище
    let json = JSON.stringify(arraySuomenSanat);
    //Запишем в localStorage с ключом gg:
    localStorage[ggg] = json;
    // получим массив финских слов этой группы из LocalStorage
    let arraySanatFromLS = getSanatFromLS(ggg);
    // выведем на экран список слов этой группы
    viewSanatFromList(arraySanatFromLS, arraySuomenSanat, out);
    // повесим на них слушателей
    addListenerOnSanat('.sana');

}
// жмем ОК и начинаем формировать итоговый массив
function addingNeededWords() {
    event.preventDefault();
    let listFromWindow = [];
    let elements = document.querySelectorAll('.sana');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains('linetext')) {
            listFromWindow.push(elements[i].textContent);
        }
    }
    createFinalList(listFromWindow);
    modal.style.display = 'none';
}
// проверим, есть ли слово в итоговом массиве
function hasSanaInFinalList(sana) {
    let elements = document.querySelectorAll('.sanat');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].textContent === sana) {
            return false;
        }
    }
    return true;
}
// получим итоговый массив слов
function createFinalList(list) {
    let gg = '';
    // проходимся по главному массиву слов
    kaikki.forEach(obj => {
        for (let key in obj) {
            // находим нужные массивы по первым словам
            let temp = obj[key];
            if (list.includes(temp[0])) {
                // проверим есть ли слово в списке
                if (hasSanaInFinalList(temp[0])) {
                    // формируем итоговый массив
                    finalArray.push(temp);
                }
                gg = key;
            }
        }
    });

    viewNumberSanat(ggg, list.length);
    hasOneGroup() ? uusiSata.disabled = false : uusiSata.disabled = true;

    // запишем выбранные слова в Хранилище
    let json = JSON.stringify(list);
    //Запишем в localStorage с ключом gg:
    localStorage[ggg] = json;

    finalArray.shuffle();
}
// удаляем из финального массива слова этой группы
function removeUnCheckedGroup(list) {
    let tempFinalArray = finalArray.concat();
    finalArray = [];
    // проходимся по массиву финских слов
    tempFinalArray.forEach(elements => {
        // проверим есть ли слово в итоговом массиве слов
        if (!list.includes((elements[0]))) {
            // если нет, то добавим в итоговый массив
            finalArray.push(elements);
        }
    });
    hasOneGroup() ? uusiSata.disabled = false : uusiSata.disabled = true;
    finalArray.shuffle();
}
// проверим, выбрана ли хоть одна группа
function hasOneGroup() {
    let checkboxes = document.querySelectorAll('[type = checkbox]');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            return true;
        }
    }
    return false;
}
// выведем количество выбранных слов
function viewNumberSanat(ggg, val = '') {
    let mark = document.querySelector(`.mark[data-key = ${ggg}]`);
    mark.textContent = val;
    val !== '' ? mark.classList.add('view') : mark.classList.remove('view');
}
