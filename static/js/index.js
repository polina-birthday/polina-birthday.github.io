const CONFETI_COUNT = isMobile.any ? 15 : 25;


// Структура элемента:
//   e, i - emoji или image
//   если image, то url, если emoji, то сам emoji
//   вес в рандоме
//   минимальное количество
let dataset = [
    [
        ["i", "static/images/cat/1f63a.svg", 1, 1],
        ["i", "static/images/cat/1f63b.svg", 1, 1],
        ["i", "static/images/cat/1f63c.svg", 1, 1],
        ["i", "static/images/cat/1f63d.svg", 1, 1],
        ["i", "static/images/cat/1f63e.svg", 1, 1],
        ["i", "static/images/cat/1f63f.svg", 1, 1],
        ["i", "static/images/cat/1f638.svg", 1, 1],
        ["i", "static/images/cat/1f639.svg", 1, 1],
        ["i", "static/images/cat/1f640.svg", 1, 1],
    ],
    [
        ["i", "static/images/Pathologic/15.webp", 1, 1],
        ["i", "static/images/Pathologic/16.webp", 1, 1],
        ["i", "static/images/Pathologic/18.webp", 1, 1],
        ["i", "static/images/Pathologic/19.webp", 1, 1],
        ["i", "static/images/Pathologic/20.webp", 1, 1],
        ["i", "static/images/Pathologic/21.webp", 1, 1],
    ],
    [
        ["i", "static/images/c++.svg", 3, 3],
        ["e", "😵", 2, 0],
        ["e", "😤", 3, 0],
        ["e", "😭", 3, 0],
        ["e", "😨", 1, 0],
        ["e", "🤬", 3, 0],
    ],
    [
        ["e", "🦅", 1, 2],
        ["e", "🍔", 1, 2],
        ["i", "static/images/USA.png", 1, 2],
    ],
    [
        ["i", "static/images/ram.gif", 1, 2],
        ["i", "static/images/android studio.png", 1, 2],
        ["i", "static/images/kotlin.png", 1, 2],
    ],
    [
        ["i", "static/images/yarobot/8.webp", 1, 1],
        ["i", "static/images/yarobot/9.webp", 1, 1],
        ["i", "static/images/yarobot/10.webp", 1, 1],
        ["i", "static/images/yarobot/11.webp", 1, 1],
        ["i", "static/images/yarobot/12.webp", 1, 1],
        ["i", "static/images/yarobot/13.webp", 1, 1],
        ["i", "static/images/yarobot/14.webp", 1, 1],
        ["i", "static/images/yarobot/15.webp", 1, 1],
        ["i", "static/images/yarobot/16.webp", 1, 1],
    ],
    [
        ["i", "static/images/roll.png", 1, 0],
        ["i", "static/images/sushi.svg", 1, 0],
        ["i", "static/images/tanuki.png", 1, 1],
        ["i", "static/images/tomatosok.png", 1, 0],
    ],
]

let stage;
let hlopushka;
let confetiContainer;
let centralBirthday;
let downButton;
let movableBox;
let stageCount;
let firstOpenSetItemFlag = false;


// Эту функцию я украл со Stack Overflow
function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
    }
}

function generatePrikoli(data, count) {
    let preparedElems = [];
    let result = [];
    for (let i of data) {
        switch (i[0]) {
            case "e":
                preparedElems.push(`<div>${i[1]}</div>`) // В серьёзный проект такое нельзя, есть риск инъекции скрипта
                break;
            case "i":
                preparedElems.push(`<img src="${i[1]}">`);
                break
        }
        if (i[3] !== 0) {
            result.push(...Array(i[3]).fill(preparedElems[preparedElems.length - 1]));
        }
    }

    result.push(...randomChoises(preparedElems, data.map(e => e[2]), count - result.length));
    return result;
}

function init() {
    if (!localStorage.getItem("isOpenedBefore")) {
        stage = 0;
        firstOpenSetItemFlag = true;
    } else {
        stage = randrange(0, dataset.length - 1);
    }
    let temp = [dataset[0]];
    let forShuffle = dataset.slice(1, undefined);
    shuffle(forShuffle);
    temp.push(...forShuffle);
    dataset = temp;
    hlopushka = document.getElementById('hlopushka');
    confetiContainer = document.getElementById('confeti');
    centralBirthday = document.getElementById('central-birthday');
    downButton = document.getElementById('down-button');
    movableBox = document.getElementById('movable-box');
    window.addEventListener("click", e => {

    })
    downButton.addEventListener('click', (e) => {
        if (!downButton.classList.contains('hidden')) {
            downButton.classList.add('hidden');
            renewBox()
            setTimeout(
                nextAnimation,
                3000,
            )
        }
    })
}

// функция скорости: k - (time ** 0.09) * k
// функция положения: k * time - time ** 1.09 * k / 1.09
// Вывод коэффициента k из макс дальности w (time = 1, что под конец имеем главное)
// k - k / 1.09 = w
// k = w / (1 - 1 / 1.09)
function xTimeFunction(time, k) {
    return k * time - time ** 1.09 * k / 1.09;
}

// Одинаковые функции для x и y получись
// Пытался для y сделать замедление через g, чтобы частицы успевали чуть упасть перед остановкой, но так оказалось лучше
function yTimeFunction(time, k) {
    return k * time - time ** 1.09 * k / 1.09;
}



async function effectNew(x, y, effectElem) {
    const endTime = 1;
    let initLeft = x + Math.random() * 40 - 20;
    let initTop = y - 25 + Math.random() * 40 - 20;
    effectElem.style.left = `${initLeft}px`;
    effectElem.style.top = `${initTop}px`;
    confetiContainer.appendChild(effectElem);

    const direction = Math.random() < 0.5 ? -1 : 1;
    const xSpeedCoef = (Math.random() * window.innerWidth * 0.82 + window.innerWidth * 0.1) / 2 / (1 - 1 / 1.09) * direction;
    const ySpeedCoef = (Math.random() * y * 0.83 + y * 0.1) / (1 - 1 / 1.09);

    let time = 0;
    function animate() {
        if (time <= endTime * 0.7) {
            time += 0.016; // Потому что 60 FPS (1/60)
        } else {
            time += (0.016 * ((endTime - time) / endTime / 0.3)); // замедляем время под конец
        }

        x = xTimeFunction((time / endTime), xSpeedCoef);
        y = yTimeFunction((time / endTime), ySpeedCoef);
        effectElem.style.left = `${initLeft + x}px`;
        effectElem.style.top = `${initTop - y}px`;
        if (time < endTime * 0.995) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

function stageComplited() {
    downButton.classList.remove('hidden');
    stage = (stage + 1) % dataset.length;
}

function effectElemTapped(effectElem) {
    if (!effectElem.classList.contains('tapped')) {
        effectElem.classList.add("tapped");
        setTimeout(() => {
            effectElem.remove();
            stageCount--;
            if (stageCount <= 0) {
                stageComplited();
            }}, 500)
        if (firstOpenSetItemFlag) {
            localStorage.setItem("isOpenedBefore", "1")
            firstOpenSetItemFlag = false;
        }
    }
}

function confetiAnimationNew() {
    const elemBox = hlopushka.getBoundingClientRect();
    let prikoli = generatePrikoli(dataset[stage], CONFETI_COUNT);
    stageCount = CONFETI_COUNT;
    for (let i of prikoli) {
        let coords = [elemBox.left + (elemBox.right - elemBox.left) * (Math.random() * 0.7 + 0.35),
            elemBox.top + (elemBox.bottom - elemBox.top) * (Math.random() * 0.3 + 0.1)];
        const effectElem = document.createElement('div');
        effectElem.classList.add("confeta");
        effectElem.style.setProperty("--background-color-hsl", randomColorHSL())
        effectElem.innerHTML = i;
        let pressTimer;
        let pressFlag = false;
        effectElem.onpointerdown = function (e) {
            pressTimer = setTimeout(function() {
                effectElem.classList.add("press");
                pressFlag = true;
                effectElem.setPointerCapture(e.pointerId);
            },750);
        }
        effectElem.onpointerup = function (e) {
            clearTimeout(pressTimer);
            if (pressFlag) {
                pressFlag = false;
                effectElem.classList.remove("press");
                effectElem.releasePointerCapture(e.pointerId)
            } else {
                effectElemTapped(effectElem)
            }
        }
        effectNew(...coords, effectElem);
    }
}

function randrange(max, min = 0 ) {
    return min + Math.floor( Math.random() * (max - min + 1) );
}

function randomColorHSL() {
    return `${randrange( 360 )},${randrange( 70, 100)}%,${randrange( 70, 90)}%`;
}

window.addEventListener('load', pageLoadAnimation)

function hlopushkaAnimation(callback) {
    let endTime = 1;
    let time = 0;
    let effectElem = hlopushka;
    effectElem.classList.add('started');
    setTimeout(() => {
        effectElem.classList.remove('started');
        effectElem.classList.add('boomed');
        centralBirthday.classList.add('started');
        setTimeout(() => {
            callback()
        }, 100)
    }, 1400)
}

function pageLoadAnimation() {
    hlopushkaAnimation(confetiAnimationNew)
}

function renewBox() {
    movableBox.classList.add('move-out');
    setTimeout(() => {
        centralBirthday.classList.remove('started');
        centralBirthday.classList.add('hidden');
        confetiContainer.innerHTML = '';
        hlopushka.classList.remove('boomed');

        movableBox.classList.remove('move-out');
        movableBox.classList.add('go-down');
        setTimeout(() => {
            centralBirthday.classList.remove('hidden');
            movableBox.classList.remove('go-down');
        }, 500)
    }, 1000);
}

function nextAnimation() {
    hlopushkaAnimation(confetiAnimationNew)
}