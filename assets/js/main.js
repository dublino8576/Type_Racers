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

  function startTest(startBtn, stopBtn, textareaEl) {
    //performance.now() gives a high-resolution timestamp in milliseconds from clicking start. It does not depend on system clock so more accurate for measuring elapsed time like in Date.now() object
    startTime = performance.now();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    clearTextarea(textareaEl);
    enableTextarea(textareaEl);
  }

  function stopTest(startBtn, stopBtn, elapsedTimeEl, textareaEl) {
    if (startTime === null) return; // ignore if not started
    const endTime = performance.now();
    const seconds = computeElapsedSeconds(startTime, endTime);
    updateElapsedTimeDisplay(seconds, elapsedTimeEl);
    stopBtn.disabled = true;
    startBtn.disabled = false;
    disableTextarea(textareaEl);
    startTime = null;
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
    let startTime = null;

    //safety checks to ensure elements exist before proceeding
    if (!selectEl || !inputEl || !startBtn || !stopBtn || !elapsedTimeEl)
      return;

    // Initialize label and prompt
    updateSelectedLevelLabel(selectEl, selectedLevelEl);
    setRandomPrompt(selectEl.value, inputEl);

    // On change, update label and assign a new random prompt
    selectEl.addEventListener("change", () => {
      updateSelectedLevelLabel(selectEl, selectedLevelEl);
      setRandomPrompt(selectEl.value, inputEl);
    });
    // Initialize buttons
    setInitialButtonState(startBtn, stopBtn, textareaEl);

    // Wire up start/stop
    startBtn.addEventListener("click", () =>
      startTest(startBtn, stopBtn, textareaEl)
    );
    stopBtn.addEventListener("click", () =>
      stopTest(startBtn, stopBtn, elapsedTimeEl, textareaEl)
    );
  });
})();
// the final parentheses () invoke it immediately after its definition.
