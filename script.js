document.querySelectorAll(".custom-select").forEach((select) => {
  const trigger = select.querySelector(".custom-select-trigger");
  const options = select.querySelector(".custom-options");
  const hiddenInput = select.querySelector("input[type='hidden']");

  // Dropdown öffnen/schließen
  trigger.addEventListener("click", () => {
    options.style.display =
      options.style.display === "block" ? "none" : "block";
  });

  // Option auswählen
  select.querySelectorAll(".custom-option").forEach((option) => {
    option.addEventListener("click", () => {
      // Vorherige Auswahl entfernen
      select
        .querySelectorAll(".custom-option")
        .forEach((o) => o.classList.remove("selected"));

      option.classList.add("selected");
      trigger.textContent = option.textContent;
      hiddenInput.value = option.dataset.value;

      options.style.display = "none";
    });
  });

  // Klick außerhalb schließt Dropdown
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      options.style.display = "none";
    }
  });
});

function toggleMeasures(sectionId, show) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.classList.toggle("active", show);
}

function getEinsatztypen() {
  return {
    internistisch: document.getElementById("internistisch").checked,
    traumatologisch: document.getElementById("traumatologisch").checked,
    pädiatrisch: document.getElementById("pädiatrisch").checked,
    geriatrisch: document.getElementById("geriatrisch").checked,
  };
}

function createDynamicNav(containerSelector, items = []) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  let ul = container.querySelector(".dynamic-nav");

  if (!ul) {
    ul = document.createElement("ul");
    ul.classList.add("dynamic-nav");
    container.appendChild(ul);
  }

  // Inhalt immer neu aufbauen
  ul.innerHTML = "";

  items.forEach((itemText, index) => {
    const li = document.createElement("li");
    li.textContent = itemText;
    li.classList.add("nav-item");
    li.dataset.index = index;
    li.id = itemText.toLowerCase();
    ul.appendChild(li);
  });

  return ul;
}

const navConfig = {
  default: {
    sssGi: ["SSS", "GI"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: [
      "Transport",
      "Medikamentengabe",
      "Notkompetenzen",
      "Diagnostik",
    ],
  },

  pädiatrisch: {
    sssGi: ["SSS", "PBD"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: [
      "Transport",
      "Medikamentengabe",
      "Notkompetenzen",
      "Diagnostik",
    ],
  },

  geriatrisch: {
    sssGi: ["SSS", "GI", "GEMS"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: [
      "Transport",
      "Medikamentengabe",
      "Notkompetenzen",
      "Diagnostik",
    ],
  },

  traumatologisch: {
    sssGi: ["SSS", "GI"],
    primary: ["x", "A", "B", "C", "D", "E", "Trauma"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: [
      "Transport",
      "Medikamentengabe",
      "Notkompetenzen",
      "Diagnostik",
    ],
  },

  traumaGeriatrisch: {
    sssGi: ["SSS", "GI", "GEMS"],
    primary: ["x", "A", "B", "C", "D", "E", "Trauma"],
    secondary: ["SAMP", "LER", "OPQRST", "SPLATT"],
    weitereDetails: [
      "Transport",
      "Medikamentengabe",
      "Notkompetenzen",
      "Diagnostik",
    ],
  },
};

function toggleNavbar() {
  const einsatztyp = getEinsatztypen();

  let config = navConfig.default;

  if (einsatztyp.pädiatrisch) {
    config = navConfig.pädiatrisch;
  } else if (einsatztyp.traumatologisch && einsatztyp.geriatrisch) {
    config = navConfig.traumaGeriatrisch;
  } else if (einsatztyp.geriatrisch) {
    config = navConfig.geriatrisch;
  } else if (einsatztyp.traumatologisch) {
    config = navConfig.traumatologisch;
  }

  createDynamicNav("#sss-gi", config.sssGi);
  createDynamicNav("#primary", config.primary);
  createDynamicNav("#secondary", config.secondary);
  createDynamicNav("#weitereDetails", config.weitereDetails);

  const sssGi = document.querySelector("#sss-gi");

  if (
    einsatztyp.internistisch ||
    einsatztyp.traumatologisch ||
    einsatztyp.geriatrisch ||
    einsatztyp.pädiatrisch
  ) {
    sssGi.classList.remove("hiddenSection");
    primary.classList.remove("hiddenSection");
    secondary.classList.remove("hiddenSection");
    weitereDetails.classList.remove("hiddenSection");
  } else {
    sssGi.classList.add("hiddenSection");
    primary.classList.add("hiddenSection");
    secondary.classList.add("hiddenSection");
    weitereDetails.classList.add("hiddenSection");
  }
}

document.addEventListener("click", function (e) {
  const navItem = e.target.closest(".nav-item");
  if (!navItem) return;

  document
    .querySelectorAll(".nav-item")
    .forEach((i) => i.classList.remove("active"));

  document
    .querySelectorAll(".formContainer")
    .forEach((c) => c.classList.remove("active"));

  const contentId = navItem.id + "-content";
  const content = document.getElementById(contentId);

  if (content) {
    content.classList.add("active");
  }

  navItem.classList.add("active");
});

function addNavItem(containerSelector, itemText) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let ul = container.querySelector(".dynamic-nav");

  // Falls noch keine UL existiert → neu erzeugen
  if (!ul) {
    ul = document.createElement("ul");
    ul.classList.add("dynamic-nav");
    container.appendChild(ul);
  }

  // Prüfen, ob Item schon existiert (verhindert Duplikate)
  const existing = ul.querySelector(`#${itemText.toLowerCase()}`);
  if (existing) return;

  const li = document.createElement("li");
  li.textContent = itemText;
  li.classList.add("nav-item");
  li.id = itemText.toLowerCase();

  ul.appendChild(li);
}

document.getElementById("news2").addEventListener("change", function () {
  if (this.checked) {
    addNavItem("#weitereDetails", "NEWS-2");

    // Active-Zustände zurücksetzen
    document
      .querySelectorAll(".nav-item")
      .forEach((i) => i.classList.remove("active"));

    document
      .querySelectorAll(".formContainer")
      .forEach((c) => c.classList.remove("active"));

    // Zur Section navigieren
    document.getElementById("news-2-content")?.classList.add("active");
    document.getElementById("news-2")?.classList.add("active");
  } else {
    // OPTIONAL: Wenn deaktiviert → Nav-Item wieder entfernen
    const navItem = document.getElementById("news-2");
    if (navItem) navItem.remove();

    // OPTIONAL: Content ausblenden
    document.getElementById("news-2-content")?.classList.remove("active");
  }
});

// Medikamente & Vorerkrankungen Tags
document.querySelectorAll(".tag-wrapper").forEach(initTagInput);

function initTagInput(wrapper) {
  const input = wrapper.querySelector(".tag-input");
  const tagsContainer = wrapper.querySelector(".tags");
  const suggestionsBox = wrapper.querySelector(".suggestions");
  const output = wrapper.querySelector(".output");

  const whitelist = JSON.parse(wrapper.dataset.whitelist || "[]");
  let tags = [];
  let selectedSuggestionIndex = -1;

  input.addEventListener("keydown", function (e) {
    const items = suggestionsBox.querySelectorAll("li");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length > 0) {
        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
        highlightSuggestion(items);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length > 0) {
        selectedSuggestionIndex =
          (selectedSuggestionIndex - 1 + items.length) % items.length;
        highlightSuggestion(items);
      }
      return;
    }

    if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      const selected = items[selectedSuggestionIndex];
      if (selected) {
        addTag(selected.textContent);
        input.value = "";
        suggestionsBox.innerHTML = "";
        selectedSuggestionIndex = -1;
      }
      return;
    }

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = input.value.trim();
      if (value && !tags.includes(value)) {
        addTag(value);
      }
      input.value = "";
      suggestionsBox.innerHTML = "";
      selectedSuggestionIndex = -1;
    }

    if (e.key === "Backspace" && input.value === "") {
      if (tags.length > 0) {
        tags.pop();
        const lastTagEl = tagsContainer.querySelector(".tag:last-child");
        if (lastTagEl) tagsContainer.removeChild(lastTagEl);
        updateOutput();
      }
    }
  });

  input.addEventListener("input", function () {
    selectedSuggestionIndex = -1;
    const query = input.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    if (query.length > 0) {
      const filtered = whitelist.filter(
        (item) => item.toLowerCase().startsWith(query) && !tags.includes(item)
      );
      filtered.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.addEventListener("click", () => {
          addTag(item);
          input.value = "";
          suggestionsBox.innerHTML = "";
        });
        suggestionsBox.appendChild(li);
      });
    }
  });

  function highlightSuggestion(items) {
    items.forEach((item, index) => {
      item.classList.toggle("active", index === selectedSuggestionIndex);
    });
  }

  function addTag(text) {
    tags.push(text);
    const tagEl = document.createElement("div");
    tagEl.className = "tag";
    tagEl.textContent = text;

    const removeBtn = document.createElement("span");
    removeBtn.className = "remove";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => {
      tagsContainer.removeChild(tagEl);
      tags = tags.filter((t) => t !== text);
      updateOutput();
    });

    tagEl.appendChild(removeBtn);
    tagsContainer.appendChild(tagEl);
    updateOutput();
  }

  function updateOutput() {
    output.textContent = tags.join(", ");
  }
}

// function toggleMedInput(checkbox) {
//   const wrapper = checkbox.closest('.checkbox-wrapper');
//   const input = wrapper.querySelector('.med-input');

//   if (!input) return; // Sicherheit

//   if (checkbox.checked) {
//     input.style.display = 'inline-block';
//   } else {
//     input.style.display = 'none';
//     input.value = '';
//   }
// }

// function toggleMedInput(checkbox) {
//   const row = checkbox.closest('.med-row');

//   if (checkbox.checked) {
//     row.classList.add('active');
//   } else {
//     row.classList.remove('active');
//     const input = row.querySelector('.med-input');
//     input.value = '';
//   }
// }

const analgesieTrigger = [
  "Esketamin i.v.",
  "Paracetamol i.v.",
  "Methoxyfluran inhalativ",
  "Esketamin i.n.",
];

function handleSelection(checkbox) {
  const checkedAnalgesics = Array.from(
    document.querySelectorAll('input[name="medVerabreicht"]:checked')
  ).some((cb) => analgesieTrigger.includes(cb.value));

  toggleMeasures("analgesie-section", checkedAnalgesics);

  const container = document.getElementById("selectedMedsList");
  const medName = checkbox.value;

  if (checkbox.checked) {
    // Medikament hinzufügen
    const row = document.createElement("div");
    row.classList.add("selected-med-row");
    row.setAttribute("data-med", medName);

    row.innerHTML = `
      <div class="selected-med-label">${medName}</div>
      <div class="text-wrapper"> 
        <input 
          type="text" 
          name="medDetails_${medName}" 
          placeholder="Dosierung, Uhrzeit, sonstige Info...">
          </div>
    `;

    container.appendChild(row);
  } else {
    // Medikament entfernen
    const existing = container.querySelector(`[data-med="${medName}"]`);
    if (existing) existing.remove();
  }
  const allMedCheckboxes = document.querySelectorAll(
    'input[name="medVerabreicht"]'
  );

  const anyChecked = Array.from(allMedCheckboxes).some((cb) => cb.checked);

  toggleMeasures("azmlVerabreicht-section", anyChecked);
}

function copyAnalgesieValues(from, to) {
  const suffixes = ["NRS", "GCS", "SpO2", "HF", "RR"];
  suffixes.forEach(suffix => {
      const fromInput = document.getElementById(`analgesie${suffix}${capitalize(from)}`);
      const toInput = document.getElementById(`analgesie${suffix}${capitalize(to)}`);
      if (fromInput && toInput) {
          toInput.value = fromInput.value;
      }
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// news-2 Score
function calculateNEWS2() {
  let score = 0;

  const fields = [
    "newsAf",
    "newsSättigung",
    "newsRaumluft",
    "newsTemperatur",
    "newsSystBlutdruck",
    "newsHerzfrequenz",
    "newsBewusstsein",
  ];

  fields.forEach((name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (checked) {
      score += parseInt(checked.value, 10);
    }
  });

  // Ausgabe (z. B. in span oder input)
  const news2Output = document.getElementById("news2ScoreOutput");
  const news2Aviso = document.getElementById("news2Aviso");

  news2Output.innerText = score;
  if (score >= 7) {
    news2Output.classList.add("red");
    news2Aviso.innerText = "&rarr; Aviso";
  } else {
    news2Output.classList.remove("red");
  }
  return score;
}

document.addEventListener("change", function (e) {
  if (e.target.matches('input[type="radio"]')) {
    calculateNEWS2();
  }
});
