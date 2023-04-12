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
const loading = document.querySelector("[data-loading]");

if (localStorage.getItem("dark")) {
  document.body.classList.add(localStorage.getItem("dark"));
  theme.checked = true;
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

sansSerif.addEventListener("click", () => {
  document.body.style.fontFamily = "'Inter', sans-serif";
  dropdown.checked = false;
});

serif.addEventListener("click", () => {
  document.body.style.fontFamily = "'Lora', serif";
  dropdown.checked = false;
});

mono.addEventListener("click", () => {
  document.body.style.fontFamily = "'Roboto Mono', monospace";
  dropdown.checked = false;
});

const API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function setLoading(isLoading = true) {
  if (isLoading) {
    loading.classList.add("loading");
  } else {
    loading.classList.remove("loading");
  }
}

input.addEventListener("keyup", getInputVal);

function getInputVal(e) {
  if (e.key === "Enter" && isValid(e.target.value)) {
    makeAPIrequest(e.target.value).then((result) => {
      if (result.error) {
        console.log(result);
        dictionary.innerHTML = `<div class="notFound"> <span class="emoji">😢</span>  <h4>${result.title}</h4> <p>${result.message}</p> </div>`;

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
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
        ", " +
        "   " +
        `<a color href=https://en.wiktionary.org/wiki/${el}>${el}</a>`;
    });
    if (el.partOfSpeech === "noun") {
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

let map = {};

async function makeAPIrequest(word) {
  // if (map[setLoading] !== undefined) {
  //   setLoading(false);
  // } else {
  //   map[setLoading] = setLoading;
  // }
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
