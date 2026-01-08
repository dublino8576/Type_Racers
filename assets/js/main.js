// Type Racer prompt generator by difficulty

// IIFE to avoid polluting global namespace by invoking function immediately (iife: immediately invoked function expression)
//the function is wrapped in parentheses to create a function expression

//This way all variables and functions defined inside are scoped locally to this function, so no overlap if there are other scripts on the page with same variable or function names
(function () {
  const PROMPTS = {
    1: [
      "The sun is bright today.",
      "I like to cook pasta.",
      "A dog ran down the road.",
    ],
    2: [
      "Typing quickly requires practice, focus, and good posture.",
      "Please bring apples, bananas, and grapes to the picnic.",
      "There are seven continents on Earth, each unique.",
    ],
    3: [
      "She whispered, 'Meet at 7:45—don't be late!' before leaving.",
      "A curious fox jumps over 13 lazy dogs, twice.",
      "Optimizing code requires patience, profiling, and precise refactoring.",
    ],
  };

  // --- Timer logic (named functions) ---
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setRandomPrompt(levelValue, inputEl) {
    const options = PROMPTS[levelValue] || PROMPTS["1"];
    inputEl.value = pickRandom(options);
  }

  function updateSelectedLevelLabel(selectEl, labelEl) {
    if (!labelEl) return;
    //text accesses the text content of the selected option and ?. provides a fallback when undefined otherwise "easy" would not run
    const label = selectEl.options[selectEl.selectedIndex]?.text || "easy";
    labelEl.textContent = label;
  }
  // Adds disabled state to buttons appropriately on load
  function setInitialButtonState(startBtn, stopBtn, textareaEl) {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    textareaEl.disabled = true;
  }
  function highlightPromptWords(promptText, userText, promptContainerEl) {
    if (!promptContainerEl) return;

    const promptWords = splitIntoWords(promptText);
    const userWords = splitIntoWords(userText);

    let highlightedHtml = "";
    const rawPromptWords = promptText.trim().split(/\s+/);

    for (let i = 0; i < rawPromptWords.length; i++) {
      const word = rawPromptWords[i];
      let className = "";

      if (i < userWords.length) {
        const promptWord = sanitizeWord(word);
        const typedWord = userWords[i];
        className =
          promptWord === typedWord ? "correct-word" : "incorrect-word";
      }

      highlightedHtml += className
        ? `<span class="${className}">${word}</span> `
        : `${word} `;
    }

    promptContainerEl.innerHTML = highlightedHtml.trim();
  }

  function resetPromptDisplay(promptText, promptContainerEl) {
    if (!promptContainerEl) return;
    promptContainerEl.textContent = promptText;
  }

  function updatePromptDisplay(inputEl, promptContainerEl) {
    if (!inputEl || !promptContainerEl) return;
    promptContainerEl.textContent = inputEl.value;
  }

  function startTest(startBtn, stopBtn, textareaEl) {
    //performance.now() gives a high-resolution timestamp in milliseconds from clicking start. It does not depend on system clock so more accurate for measuring elapsed time like in Date.now() object
    startTime = performance.now();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    clearTextarea(textareaEl);
    enableTextarea(textareaEl);
  }

  function stopTest(
    startBtn,
    stopBtn,
    elapsedTimeEl,
    textareaEl,
    inputEl,
    wpmEl,
    promptContainerEl
  ) {
    if (startTime === null) return; // ignore if not started
    const endTime = performance.now();
    const seconds = computeElapsedSeconds(startTime, endTime);
    updateElapsedTimeDisplay(seconds, elapsedTimeEl);
    const correctWords = countCorrectWords(inputEl.value, textareaEl.value);
    const wpm = computeWpm(correctWords, seconds);
    updateWpmDisplay(wpm, wpmEl);
    stopBtn.disabled = true;
    startBtn.disabled = false;
    disableTextarea(textareaEl);
    resetPromptDisplay(inputEl.value, promptContainerEl);
    startTime = null;
  }

  function sanitizeWord(word) {
    return word.replace(/[^\w']/g, "").toLowerCase();
  }

  function splitIntoWords(text) {
    return text.trim().split(/\s+/).map(sanitizeWord).filter(Boolean); //filter(Boolean) removes empty strings or falsy values
  }

  function countCorrectWords(promptText, userText) {
    const promptWords = splitIntoWords(promptText);

    const userWords = splitIntoWords(userText);
    let correct = 0;
    //loop through both arrays up to the length of the shorter one
    for (let i = 0; i < Math.min(promptWords.length, userWords.length); i++) {
      if (userWords[i] === promptWords[i]) correct++;
    }
    return correct;
  }

  function computeWpm(correctWords, seconds) {
    if (!seconds) return 0;
    return Math.round(correctWords / (seconds / 60));
  }

  function updateWpmDisplay(wpm, wpmEl) {
    if (!wpmEl) return;
    wpmEl.textContent = wpm;
  }

  function clearTextarea(textareaEl) {
    if (!textareaEl) return;
    textareaEl.value = "";
  }

  function enableTextarea(textareaEl) {
    if (!textareaEl) return;
    //enable the textarea for user input & focus on it automatically
    textareaEl.disabled = false;
    textareaEl.focus();
  }

  function disableTextarea(textareaEl) {
    if (!textareaEl) return;
    textareaEl.disabled = true;
  }

  function computeElapsedSeconds(start, end) {
    return (end - start) / 1000;
  }

  function updateElapsedTimeDisplay(seconds, elapsedTimeEl) {
    if (!elapsedTimeEl) return;
    elapsedTimeEl.textContent = formatSecondsToTwoDecimals(seconds);
  }

  function formatSecondsToTwoDecimals(seconds) {
    return seconds.toFixed(2);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const selectEl = document.getElementById("inputGroupSelect01");
    const inputEl = document.getElementById("textPrompt");
    const selectedLevelEl = document.getElementById("selectedLevel");
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const elapsedTimeEl = document.getElementById("elapsedTime");
    const textareaEl = document.querySelector("textarea");
    const wpmEl = document.getElementById("wpm");
    const promptContainerEl = document.getElementById("promptContainer");

    let startTime = null;

    //safety checks to ensure elements exist before proceeding
    if (
      !selectEl ||
      !inputEl ||
      !startBtn ||
      !stopBtn ||
      !elapsedTimeEl ||
      !wpmEl ||
      !textareaEl ||
      !promptContainerEl
    )
      return;

    // Initialize label and prompt
    updateSelectedLevelLabel(selectEl, selectedLevelEl);
    setRandomPrompt(selectEl.value, inputEl);
    updatePromptDisplay(inputEl, promptContainerEl);

    // On change, update label and assign a new random prompt
    selectEl.addEventListener("change", () => {
      updateSelectedLevelLabel(selectEl, selectedLevelEl);
      setRandomPrompt(selectEl.value, inputEl);
      updatePromptDisplay(inputEl, promptContainerEl);
    });
    // Initialize buttons
    setInitialButtonState(startBtn, stopBtn, textareaEl);

    // Real-time highlighting as user types
    textareaEl.addEventListener("input", (startTime) => {
      if (startTime !== null) {
        highlightPromptWords(
          inputEl.value,
          textareaEl.value,
          promptContainerEl
        );
      }
    });
    // Wire up start/stop
    startBtn.addEventListener("click", () =>
      startTest(startBtn, stopBtn, textareaEl)
    );
    stopBtn.addEventListener("click", () =>
      stopTest(
        startBtn,
        stopBtn,
        elapsedTimeEl,
        textareaEl,
        inputEl,
        wpmEl,
        promptContainerEl
      )
    );
  });
})();
// the final parentheses () invoke it immediately after its definition.
