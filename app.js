const theme = document.querySelector("[data-theme]");
const input = document.querySelector("[data-input]");
const list = document.querySelector("[data-list]");
const list2 = document.querySelector("[data-list2]");
const nounExample = document.querySelector("[data-noun-example]");
const word = document.querySelector("[data-word]");
const spelling = document.querySelector("[data-spelling]");
const sansSerif = document.querySelector("[data-sans-serif]");
const serif = document.querySelector("[data-serif]");
const mono = document.querySelector("[data-mono]");
const sysonmys = document.querySelector("[data-sysonmys]");
const audioBtn = document.querySelector("[data-play-audio]");
const dictionary = document.querySelector("[data-dictionary]");
const dropdownItems = document.querySelector("[data-dropdown-items]");
const dropdown = document.querySelector("#dropdown");
const meaning1 = document.querySelector("[data-meaning]");
const meaning2 = document.querySelector("[data-meaning2]");
const loading = document.querySelector("[data-loading]");
const wordType = document.querySelector("[data-word-type]");
const wordType2 = document.querySelector("[data-word-type2]");
const source = document.querySelector("[data-source]");
const dropdownText = document.querySelector("[data-dropdown-text]");
const notFoundTitle = document.querySelector("[data-notFound-title]");
const notFoundMsg = document.querySelector("[data-notFound-message]");
const notFound = document.querySelector("[data-notFound]");
const loader = document.querySelector("[data-loader-block]");

if (localStorage.getItem("dark")) {
  document.body.classList.add(localStorage.getItem("dark"));
  theme.checked = true;
}

if (localStorage.getItem("font")) {
  document.body.style.fontFamily = localStorage.getItem("font");
}

function saveLocalStorage(word) {
  console.log(word + "THIS IS ");
  localStorage.setItem("word", JSON.stringify(word));
}

// if (window.location.search) {
//   setLoading();
// }

// ?search=go
function changeTheme() {
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    localStorage.setItem("dark", "dark");
    localStorage.removeItem("checked", true);
    theme.checked = true;
  } else {
    localStorage.removeItem("dark");
    localStorage.removeItem("checked", false);
    theme.checked = false;
  }
}

document.addEventListener("click", function (e) {
  if (!dropdown.contains(e.target) && dropdown.checked) {
    dropdown.checked = false;
  }
});

sansSerif.addEventListener("click", () => {
  document.body.style.fontFamily = "'Inter', sans-serif";
  dropdownText.textContent = "Sans-Serif";
  localStorage.setItem("font", "'Inter', sans-serif");
  dropdown.checked = false;
});

serif.addEventListener("click", () => {
  document.body.style.fontFamily = "'Lora', serif";
  dropdownText.textContent = "Serif";
  localStorage.setItem("font", "'Lora', serif");
  dropdown.checked = false;
});

mono.addEventListener("click", () => {
  document.body.style.fontFamily = "'Roboto Mono', monospace";
  dropdownText.textContent = "Mono";
  localStorage.setItem("font", "'Roboto Mono', monospace");
  dropdown.checked = false;
});

const API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function setLoading(isLoading = true) {
  if (isLoading) {
    loader.classList.add("show");
  } else {
    loader.classList.remove("show");
  }
}

input.addEventListener("keyup", getInputVal);

function getInputVal(e) {
  if (e.key === "Enter" && isValid(e.target.value)) {
    makeAPIrequest(e.target.value).then((result) => {
      if (result.error) {
        dictionary.style.display = "none";
        notFound.style.display = "flex";
        notFoundTitle.textContent = result.title;
        notFoundMsg.textContent = result.message;
      } else {
        dictionary.style.display = "block";
        notFound.style.display = "none";

        appendMeaningsToHtml(result);
        e.target.value = "";
      }
    });
  }
}

let audio = null;
function play(wordAudio) {
  audio = new Audio(wordAudio);
}

audioBtn.addEventListener("click", () => {
  audio.play();
});

function appendMeaningsToHtml(res) {
  console.log(res[0] + "LETS SEE");
  word.textContent = res[0].word;
  meaning1.textContent = "Meaning";
  meaning2.textContent = "Meaning";
  audioBtn.classList.add("dictionary__play-btn");
  audioBtn.innerHTML = `<img src="./assets/play.svg" alt="play" />`;
  source.innerHTML = `<p>
  Source
  <a href="https://en.wiktionary.org/wiki/keyboard"
    >https://en.wiktionary.org/wiki/keyboard
    <img src="./assets/link.svg" alt="link"
  /></a>
</p>`;
  saveLocalStorage(res);

  if (window.location.search.slice(8) !== res[0].word) {
    window.location.search = `?search=${res[0].word}`;
  }
  spelling.textContent = res[0].phonetics[0].text;
  res[0].phonetics.forEach((item) => {
    play(item.audio);
  });

  console.log(res[0].meanings);
  res[0].meanings.forEach((el) => {
    console.log(el);
    el.synonyms.forEach((el) => {
      console.log(el);
      sysonmys.innerHTML +=
        `<a color href=https://en.wiktionary.org/wiki/${el}>${el}</a>` + ", ";
    });
    if (el.partOfSpeech === "noun") {
      wordType.innerHTML = `<p>noun</p>
      <span></span>`;
      console.log(el.definitions);
      el.definitions.forEach((el) => {
        if (el.example) {
          const p = document.createElement("p");
          const li = document.createElement("li");
          p.textContent = el.example;
          li.innerHTML = `<div class="flex"><span></span> ${el.definition}</div> <div class="dictionary__word-example">${el.example}</div>`;
          list.appendChild(li);
        }
        console.log(el);
      });
    } else if (el.partOfSpeech === "verb") {
      wordType2.innerHTML = `
       <p>verb</p>
          <span></span>`;
      el.definitions.forEach((el) => {
        if (el.example) {
          const p = document.createElement("p");
          const li = document.createElement("li");
          p.textContent = el.example;
          li.innerHTML = `<div class="flex"><span></span> ${el.definition}</div> <div class="dictionary__word-example">${el.example}</div>`;
          list2.appendChild(li);
        }
        console.log(el);
      });
    }
  });
}

function isValid(val) {
  if (val.trim() !== "") {
    return true;
  }
  return false;
}

async function makeAPIrequest(word) {
  setLoading();

  try {
    const res = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    );
    if (res.status !== 200) {
      const result = await res.json();
      result.error = res.status;
      setLoading(false);
      // setBusy(false);
      return result;
    } else {
      setLoading(false);
      // setBusy(false);
      return await res.json();
    }
  } catch (err) {
    // setBusy(false);
    setLoading(false);
    console.log(err);
    return {
      error: 500,
      title: "server error",
      message: "could not reach dictionary api",
    };
  }
}

if (localStorage.getItem("word")) {
  appendMeaningsToHtml(JSON.parse(localStorage.getItem("word")));
}
