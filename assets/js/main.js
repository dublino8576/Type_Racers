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

  document.addEventListener("DOMContentLoaded", () => {
    const selectEl = document.getElementById("inputGroupSelect01");
    const inputEl = document.getElementById("textPrompt");
    const selectedLevelEl = document.getElementById("selectedLevel");

    //safety checks if selected elements exist
    if (!selectEl || !inputEl) return;

    // Initialize label and prompt
    updateSelectedLevelLabel(selectEl, selectedLevelEl);
    setRandomPrompt(selectEl.value, inputEl);

    // On change, update label and assign a new random prompt
    selectEl.addEventListener("change", () => {
      updateSelectedLevelLabel(selectEl, selectedLevelEl);
      setRandomPrompt(selectEl.value, inputEl);
    });
  });
})();
// the final parentheses () invoke it immediately after its definition.
