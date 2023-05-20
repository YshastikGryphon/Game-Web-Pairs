(function () {

  const gameField = document.getElementById('game-field');

  const inputCount = document.querySelector('input[name="count"]');
  const inputTimeout = document.querySelector('input[name="timeout"]');
  const inputTimeoutGlobal = document.querySelector('input[name="timeoutGlobal"]');
  const inputTimer = document.querySelector('input[name="timer"]');
  const displayTimer = document.querySelector('input[name="displayTimer"]');

  //Переменные
  let checkArr = [null, null];
  let checkArrID = [null, null];
  let globalID = 0;
  let correct = false;
  let countCorrect = 0;

  //Таймеры
  let timerDelay;
  let timerID;
  let timerField;

  //Правила игры
  let timeout = 300;
  let timeoutField = 3000;
  let count = 8;
  let timer = 60;

  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
  function createNumbersArray(count) {
    let arr = []
    count++;
    for (let i = 1; i < count; i++) {
      arr.push(i, i);
    }
    return arr;
  }

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
  function startGame(count) {
    checkArr = [null, null];
    checkArrID = [null, null];

    gameField.classList.remove('game__card-list--win');
    gameField.classList.remove('game__card-list--end');

    clearInterval(timerID);
    clearTimeout(timerDelay);
    clearTimeout(timerField);

    countCorrect = 0;
    globalID = 0;
    let game_array = createNumbersArray(count);
    shuffle(game_array);
    for (let i = 0; i < game_array.length; i++) {
      createCard(game_array[i]);
    }
    addFunctionToCards();

    if (timeoutField === 0) {
      showGameField();
      hideGameField();
    } else {
      showGameField();
      timerField = setTimeout(hideGameField, timeoutField);
    }

    startTimer();
  }

  // Создать карты и разместить их
  function createCard(number) {
    // Элементы
    let li = document.createElement('li');
    let span = document.createElement('span');
    let spanTwo = document.createElement('span');
    // Классы, аттрибуты, текст
    li.classList.add('game__card-item', 'game__card-item--hide');
    li.setAttribute("id", globalID);
    span.classList.add('game__card-inner');
    span.innerText = number;
    spanTwo.classList.add('game__card-inner-2');
    spanTwo.innerText = number;
    //Размещение
    li.append(span);
    li.append(spanTwo);
    gameField.append(li);
    globalID++;
  }

  //Добавить функцию картам
  function addFunctionToCards() {
    let cards = document.querySelectorAll('.game__card-item');

    cards.forEach(function (card) {
      let id = card.id;
      let number = card.innerText;
      card.addEventListener('click', () => { chooseCards(id, number) });
    })
  }

  // Выбрать карты
  function chooseCards(id, number) {
    if(checkArr[0] === null) {
      checkArr[0] = number;
      checkArrID[0] = id;
      openCard(id);
      checkCards();
      return;
    }
    if (checkArr[1] === null && checkArrID[0] !== id) {
      checkArr[1] = number;
      checkArrID[1] = id;
      openCard(id);
      checkCards();
      return;
    }
  }

  // Поверить карты и очистить
  function checkCards() {
    if (checkArr[0] === null || checkArr[1] === null) {
      return;
    } else {
      if (checkArr[0] === checkArr[1]) {
        correct = true;
      } else {
        correct = false;
      }
      checkCardsEnd();
    }
  }

  //Очистить карты
  function checkCardsEnd() {
    if (correct === true) {
      countCorrect++;

      blockCard(checkArrID[0]);
      blockCard(checkArrID[1]);

      checkArr = [null, null];
      checkArrID = [null, null];
    }
    if (correct === false) {
      let savedID = [checkArrID[0], checkArrID[1]];

      setTimeout(() => {
        closeCard(savedID[0]);
        closeCard(savedID[1]);
      }, timeout);

      checkArr = [null, null];
      checkArrID = [null, null];
    }

    if (countCorrect >= count) {
      gameWin();
    }
  }

  //Заблокировать карту
  function blockCard(id) {
    let card = document.getElementById(id);
    card.classList.add('game__card-item--block');
  }

  //Визуально открыть карту
  function openCard(id) {
    let card = document.getElementById(id);
    card.classList.remove('game__card-item--hide');
    card.classList.add('game__card-item--show');
  }

  //Визуально закрыть карту
  function closeCard(id) {
    let card = document.getElementById(id);
    card.classList.remove('game__card-item--show');
    card.classList.add('game__card-item--hide');
  }

  //Показать всё поле
  function showGameField() {
    gameField.classList.add('game__card-list--show');
  }
  //Скрыть всё поле
  function hideGameField() {
    gameField.classList.remove('game__card-list--show');
  }

  // Таймер
  function startTimer() {
    let time = timer;

    if (time == 0) {
      displayTimer.value = 'Таймер';
      return;
    } else {
      displayTimer.value = time;
      timerDelay = setTimeout(() => {
        timerID = setInterval(timerFunc, 1000);
      }, timeoutField);

      function timerFunc() {
        if (timer > 0) {
          timer--;
          displayTimer.value = timer;
          return;
        } else {
          clearInterval(timerID);
          gameOver();
        }
      }
    }
  }

  // Game Over
  function gameOver() {
    displayTimer.value = 'Время вышло!';
    gameField.classList.add('game__card-list--end');
  }

  // Win!
  function gameWin() {
    clearInterval(timerID);
    clearTimeout(timerDelay);
    clearTimeout(timerField);

    displayTimer.value = 'Победа!';
    gameField.classList.add('game__card-list--win');
  }

  function createGamePari() {
    //Очистка
    gameField.innerHTML = "";

    // Установка правил
    if (inputCount.value > 0 && inputCount.value < 20) {
      count = inputCount.value;
    }
    if ((inputTimeoutGlobal.value >= 0 && inputTimeoutGlobal.value < 120)) {
      timeoutField = (inputTimeoutGlobal.value * 1000);
    }
    if ((inputTimer.value >= 0 && inputTimer.value < 180)) {
      timer = (inputTimer.value);
    }

    // Запуск игры
    startGame(count);
  }


  // Передача функции для использования
  window.createGamePari = createGamePari;
})();
