// assets/js/custom.js
// Custom JavaScript for CV contact form and validation

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    rating1: document.getElementById('rating1'),
    rating2: document.getElementById('rating2'),
    rating3Group: document.getElementById('rating3-group')
  };

  const submitButton = document.getElementById('contact-submit');
  const resultBox = document.getElementById('contact-result');
  const rating2ValueSpan = document.getElementById('rating2-value');

  const errorElements = {};
  document.querySelectorAll('.contact-error').forEach(function (el) {
    const key = el.getAttribute('data-for');
    if (key) {
      errorElements[key] = el;
    }
  });

  function setError(fieldKey, message) {
    const field = fields[fieldKey];
    const errorEl = errorElements[fieldKey];
    if (field) {
      field.classList.add('is-invalid');
    }
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.style.display = message ? 'block' : 'none';
    }
  }

  function clearError(fieldKey) {
    setError(fieldKey, '');
    const field = fields[fieldKey];
    if (field) {
      field.classList.remove('is-invalid');
    }
  }

  function validateNotEmpty(fieldKey, label) {
    const field = fields[fieldKey];
    if (!field) return false;
    const value = field.value.trim();
    if (!value) {
      setError(fieldKey, label + ' yra privalomas laukas.');
      return false;
    }
    clearError(fieldKey);
    return true;
  }

  function validateName(fieldKey, label) {
    const field = fields[fieldKey];
    if (!field) return false;
    const value = field.value.trim();
    if (!value) {
      setError(fieldKey, label + ' yra privalomas laukas.');
      return false;
    }
    // tik raidės (įskaitant LT), tarpai ir brūkšneliai
    const nameRegex = /^[A-Za-zÀ-žŽžŠšŪūŲųĮįĄąČčĘęŪū\s-]+$/;
    if (!nameRegex.test(value)) {
      setError(fieldKey, label + ' turi būti sudarytas tik iš raidžių.');
      return false;
    }
    clearError(fieldKey);
    return true;
  }

  function validateEmail() {
    const field = fields.email;
    const value = field.value.trim();
    if (!value) {
      setError('email', 'El. paštas yra privalomas laukas.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('email', 'Neteisingas el. pašto formatas.');
      return false;
    }
    clearError('email');
    return true;
  }

  function validateAddress() {
    return validateNotEmpty('address', 'Adresas');
  }

  // telefono numerio normalizavimas į +370 6xx xxxxx
  function normalizePhone(raw) {
    // paliekam tik skaitmenis, ribojam ilgį iki 11 (3706 + 7 skaitmenys)
    let digits = raw.replace(/\D/g, '').slice(0, 11);

    if (!digits) return '';

    let result = '+';

    // jei prasideda 3706, formatuojam kaip +370 6xx xxxxx
    if (digits.startsWith('3706') && digits.length >= 5) {
      const prefix = digits.slice(0, 3); // 370
      const part1 = digits.slice(3, 6);  // 6xx
      const part2 = digits.slice(6);     // xxxxx

      result += prefix;

      if (part1) {
        result += ' ' + part1;
      }
      if (part2) {
        result += ' ' + part2;
      }
    } else {
      // kitais atvejais tiesiog pridedam + ir iki tol įvestus skaitmenis
      result += digits;
    }

    return result;
  }


  function validatePhone() {
    const field = fields.phone;
    const value = field.value.trim();
    if (!value) {
      setError('phone', 'Telefono numeris yra privalomas laukas.');
      return false;
    }

    // tikriname tik skaitmenis, formatas: 3706 + 7 skaitmenys
    const digits = value.replace(/\D/g, '');
    const phoneDigitsRegex = /^3706\d{7}$/;

    if (!phoneDigitsRegex.test(digits)) {
      setError('phone', 'Telefono numeris turi būti lietuvišku formatu +370 6xx xxxxx.');
      return false;
    }
    clearError('phone');
    return true;
  }


  function getRating3Value() {
    const checked = fields.rating3Group.querySelector('input[name="rating3"]:checked');
    return checked ? checked.value : '';
  }

  function validateRating1() {
    const field = fields.rating1;
    const value = field.value.trim();
    if (!value) {
      setError('rating1', 'Klausimo 1 įvertinimas yra privalomas.');
      return false;
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 10) {
      setError('rating1', 'Klausimo 1 įvertinimas turi būti nuo 1 iki 10.');
      return false;
    }
    clearError('rating1');
    return true;
  }

  function validateRating2() {
    const field = fields.rating2;
    const num = Number(field.value);
    if (!Number.isFinite(num) || num < 1 || num > 10) {
      setError('rating2', 'Klausimo 2 įvertinimas turi būti nuo 1 iki 10.');
      return false;
    }
    clearError('rating2');
    return true;
  }

  function validateRating3() {
    const value = getRating3Value();
    if (!value) {
      setError('rating3', 'Pasirinkite klausimo 3 įvertinimą.');
      return false;
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 10) {
      setError('rating3', 'Klausimo 3 įvertinimas turi būti nuo 1 iki 10.');
      return false;
    }
    clearError('rating3');
    return true;
  }

  function updateSubmitState() {
    const allValid =
      validateName('firstName', 'Vardas') &&
      validateName('lastName', 'Pavardė') &&
      validateEmail() &&
      validatePhone() &&
      validateAddress() &&
      validateRating1() &&
      validateRating2() &&
      validateRating3();

    submitButton.disabled = !allValid;
  }

  // Vardas
  fields.firstName.addEventListener('input', function () {
    validateName('firstName', 'Vardas');
    updateSubmitState();
  });

  // Pavardė
  fields.lastName.addEventListener('input', function () {
    validateName('lastName', 'Pavardė');
    updateSubmitState();
  });

  // El. paštas
  fields.email.addEventListener('input', function () {
    validateEmail();
    updateSubmitState();
  });

  // Adresas
  fields.address.addEventListener('input', function () {
    validateAddress();
    updateSubmitState();
  });

  // Telefonas – realaus laiko formatavimas + validacija
  fields.phone.addEventListener('input', function (event) {
    const formatted = normalizePhone(event.target.value);
    event.target.value = formatted;
    validatePhone();
    updateSubmitState();
  });

  // Klausimas 1
  fields.rating1.addEventListener('input', function () {
    validateRating1();
    updateSubmitState();
  });

  // Klausimas 2 (slider)
  fields.rating2.addEventListener('input', function () {
    if (rating2ValueSpan) {
      rating2ValueSpan.textContent = fields.rating2.value;
    }
    validateRating2();
    updateSubmitState();
  });

  // Klausimas 3 (radio)
  fields.rating3Group.addEventListener('change', function () {
    validateRating3();
    updateSubmitState();
  });

  // pradinė slider reikšmė
  if (rating2ValueSpan) {
    rating2ValueSpan.textContent = fields.rating2.value;
  }

  // Submit
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // paskutinė validacija
    updateSubmitState();
    if (submitButton.disabled) {
      return;
    }

    const rating1 = Number(fields.rating1.value);
    const rating2 = Number(fields.rating2.value);
    const rating3 = Number(getRating3Value());
    const averageRating = ((rating1 + rating2 + rating3) / 3).toFixed(1);

    const formData = {
      firstName: fields.firstName.value.trim(),
      lastName: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      address: fields.address.value.trim(),
      rating1: rating1,
      rating2: rating2,
      rating3: rating3,
      average: Number(averageRating)
    };

    // 4 punktas – išvedimas į konsolę
    console.log('Kontaktų formos duomenys:', formData);

    // 4 ir 5 punktai – atvaizdavimas po forma
    if (resultBox) {
      resultBox.innerHTML = `
        <p class="contact-result-success">Forma išsiųsta sėkmingai.</p>
        <p><strong>Vardas:</strong> ${formData.firstName}</p>
        <p><strong>Pavardė:</strong> ${formData.lastName}</p>
        <p><strong>El. paštas:</strong> ${formData.email}</p>
        <p><strong>Telefono numeris:</strong> ${formData.phone}</p>
        <p><strong>Adresas:</strong> ${formData.address}</p>
        <p><strong>Klausimų įvertinimai:</strong> 
          ${formData.rating1}, ${formData.rating2}, ${formData.rating3}
        </p>
        <p><strong>Vidurkis:</strong> ${averageRating}</p>
        <p><strong>${formData.firstName} ${formData.lastName}:</strong> ${averageRating}</p>
      `;
    }

    // jei reikia – gali išvalyti formą:
    // form.reset();
    // updateSubmitState();
  });

  // pradžioje submit visada neaktyvus
  submitButton.disabled = true;
});
// =====================
// KORTELIŲ ŽAIDIMAS
// =====================

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('memory-grid');
  const difficultySelect = document.getElementById('memory-difficulty');
  const startButton = document.getElementById('memory-start');
  const resetButton = document.getElementById('memory-reset');
  const movesSpan = document.getElementById('memory-moves');
  const matchesSpan = document.getElementById('memory-matches');
  const timeSpan = document.getElementById('memory-time');
  const bestSpan = document.getElementById('memory-best');
  const messageBox = document.getElementById('memory-message');

  // jei sekcijos nėra – nieko nedarom
  if (!grid || !difficultySelect || !startButton || !resetButton) {
    return;
  }

  // mažiausiai 6 unikalūs elementai, iš viso 12 – užtenka sunkiausiam lygiui
  const baseCards = [
    { id: 'a', label: '🐱' },
    { id: 'b', label: '🐶' },
    { id: 'c', label: '🦊' },
    { id: 'd', label: '🐼' },
    { id: 'e', label: '🐸' },
    { id: 'f', label: '🐨' },
    { id: 'g', label: '🐯' },
    { id: 'h', label: '🐵' },
    { id: 'i', label: '🐙' },
    { id: 'j', label: '🐰' },
    { id: 'k', label: '🦁' },
    { id: 'l', label: '🐷' }
  ];

  const difficultyConfig = {
    easy: { rows: 3, cols: 4, pairs: 6 },   // 4×3 = 12 kortelių = 6 poros
    hard: { rows: 4, cols: 6, pairs: 12 }   // 6×4 = 24 kortelės = 12 porų
  };

  const state = {
    difficulty: difficultySelect.value || 'easy',
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matches: 0,
    totalPairs: 0,
    timerId: null,
    secondsElapsed: 0,
    isRunning: false
  };

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function getBestKey() {
    return 'memoryBest_' + state.difficulty;
  }

  function loadBestScore() {
    if (!bestSpan) return;
    let bestText = '–';
    try {
      const stored = window.localStorage.getItem(getBestKey());
      const bestMoves = stored ? Number(stored) : NaN;
      if (Number.isFinite(bestMoves) && bestMoves > 0) {
        bestText = String(bestMoves);
      }
    } catch (err) {
      // localStorage gali būti išjungtas – ignoruojam
    }
    bestSpan.textContent = bestText;
  }

  function saveBestScore(moves) {
    try {
      const stored = window.localStorage.getItem(getBestKey());
      const bestMoves = stored ? Number(stored) : NaN;
      if (!Number.isFinite(bestMoves) || moves < bestMoves) {
        window.localStorage.setItem(getBestKey(), String(moves));
        if (bestSpan) {
          bestSpan.textContent = String(moves);
        }
      }
    } catch (err) {
      // ignoruojam
    }
  }

  function updateStats() {
    if (movesSpan) {
      movesSpan.textContent = String(state.moves);
    }
    if (matchesSpan) {
      matchesSpan.textContent = state.matches + ' / ' + state.totalPairs;
    }
    if (timeSpan) {
      timeSpan.textContent = state.secondsElapsed + ' s';
    }
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.secondsElapsed = 0;
    updateStats();
    state.timerId = setInterval(function () {
      state.secondsElapsed += 1;
      updateStats();
    }, 1000);
  }

  function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
  }

  function handleCardClick(cardEl) {
    if (!state.isRunning || state.lockBoard) return;
    if (cardEl.classList.contains('is-open') || cardEl.classList.contains('is-matched')) return;
    if (state.firstCard === cardEl) return;

    cardEl.classList.add('is-open');

    if (!state.firstCard) {
      state.firstCard = cardEl;
      return;
    }

    state.secondCard = cardEl;
    state.lockBoard = true;
    state.moves += 1;
    updateStats();

    const isMatch = state.firstCard.dataset.id === state.secondCard.dataset.id;

    if (isMatch) {
      state.firstCard.classList.add('is-matched');
      state.secondCard.classList.add('is-matched');
      state.matches += 1;
      updateStats();
      resetTurn();
      checkForWin();
    } else {
      setTimeout(function () {
        state.firstCard.classList.remove('is-open');
        state.secondCard.classList.remove('is-open');
        resetTurn();
      }, 800);
    }
  }

  function buildBoard() {
    const config = difficultyConfig[state.difficulty] || difficultyConfig.easy;
    const pairCount = Math.min(config.pairs, baseCards.length);
    state.totalPairs = pairCount;

    const selected = baseCards.slice(0, pairCount);
    const cardsArray = [];
    selected.forEach(function (item) {
      cardsArray.push({ id: item.id, label: item.label });
      cardsArray.push({ id: item.id, label: item.label });
    });

    shuffle(cardsArray);

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + config.cols + ', minmax(0, 1fr))';

    cardsArray.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.id = item.id;

      const inner = document.createElement('div');
      inner.className = 'memory-card-inner';
      inner.textContent = item.label;

      card.appendChild(inner);

      card.addEventListener('click', function () {
        handleCardClick(card);
      });

      grid.appendChild(card);
    });
  }

  function resetGame() {
    stopTimer();
    state.moves = 0;
    state.matches = 0;
    state.secondsElapsed = 0;
    state.isRunning = false;
    resetTurn();
    if (messageBox) {
      messageBox.textContent = '';
    }
    buildBoard();
    updateStats();
  }

  function startGame() {
    resetGame();
    state.isRunning = true;
    startTimer();
  }

  function checkForWin() {
    if (state.matches === state.totalPairs && state.totalPairs > 0) {
      stopTimer();
      state.isRunning = false;
      if (messageBox) {
        messageBox.textContent = 'Laimėjote! Visos poros surastos.';
      }
      saveBestScore(state.moves);
    }
  }

  // sunkumo lygio keitimas
  difficultySelect.addEventListener('change', function () {
    state.difficulty = difficultySelect.value || 'easy';
    resetGame();
    loadBestScore();
  });

  // Start mygtukas – pradeda žaidimą ir laikmatį
  startButton.addEventListener('click', function () {
    startGame();
  });

  // Atnaujinti mygtukas – permaišo korteles ir atstato būseną
  resetButton.addEventListener('click', function () {
    resetGame();
  });

  // pradinė būsena
  resetGame();
  loadBestScore();
});
