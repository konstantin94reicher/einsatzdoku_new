document.querySelectorAll(".custom-select").forEach((select) => {
  const trigger = select.querySelector(".custom-select-trigger");
  const options = select.querySelector(".custom-options");
  const hiddenInput = select.querySelector("input[type='hidden']");

  // Dropdown öffnen/schließen
  trigger.addEventListener("click", () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
  });

  // Option auswählen
  select.querySelectorAll(".custom-option").forEach((option) => {
    option.addEventListener("click", () => {
      // Vorherige Auswahl entfernen
      select.querySelectorAll(".custom-option").forEach((o) => o.classList.remove("selected"));

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
    weitereDetails: ["Transport", "Medikamentengabe", "Notkompetenzen", "Diagnostik"],
  },

  pädiatrisch: {
    sssGi: ["SSS", "PBD"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: ["Transport", "Medikamentengabe", "Notkompetenzen", "Diagnostik"],
  },

  geriatrisch: {
    sssGi: ["SSS", "GI", "GEMS"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: ["Transport", "Medikamentengabe", "Notkompetenzen", "Diagnostik"],
  },

  traumatologisch: {
    sssGi: ["SSS", "GI"],
    primary: ["x", "A", "B", "C", "D", "E", "Trauma"],
    secondary: ["SAMP", "LER", "OPQRST"],
    weitereDetails: ["Transport", "Medikamentengabe", "Notkompetenzen", "Diagnostik"],
  },

  traumaGeriatrisch: {
    sssGi: ["SSS", "GI", "GEMS"],
    primary: ["x", "A", "B", "C", "D", "E", "Trauma"],
    secondary: ["SAMP", "LER", "OPQRST", "SPLATT"],
    weitereDetails: ["Transport", "Medikamentengabe", "Notkompetenzen", "Diagnostik"],
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

  if (einsatztyp.internistisch || einsatztyp.traumatologisch || einsatztyp.geriatrisch || einsatztyp.pädiatrisch) {
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

  document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));

  document.querySelectorAll(".formContainer").forEach((c) => c.classList.remove("active"));

  document.querySelectorAll(".navHeader").forEach((c) => c.classList.remove("active"));

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

function addNavHeader(itemText) {
  const container = document.querySelector(".navItem");
  if (!container) return;

  let li = document.createElement("li");

  const existing = container.querySelector(`#${itemText.toLowerCase()}`);
  if (existing) {
    return;
  } else {
    li.id = itemText.toLowerCase();
    const span = document.createElement("span");
    span.classList.add("navHeader");
    span.textContent = itemText;
    span.id = itemText.toLowerCase() + "Header";
    li.appendChild(span);
    container.appendChild(li);
  }
}

document.querySelectorAll(".navHeader").forEach((header) => {
  header.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));

    document.querySelectorAll(".formContainer").forEach((c) => c.classList.remove("active"));

    document.getElementById("primary-content").classList.add("active");
    header.classList.add("active");
  });
});

document.getElementById("news2")?.addEventListener("change", function () {
  if (this.checked) {
    addNavItem("#weitereDetails", "NEWS-2");

    // Active-Zustände zurücksetzen
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));

    document.querySelectorAll(".formContainer").forEach((c) => c.classList.remove("active"));

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
        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
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
      const filtered = whitelist.filter((item) => item.toLowerCase().startsWith(query) && !tags.includes(item));
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

const analgesieTrigger = ["Esketamin i.v.", "Paracetamol i.v.", "Methoxyfluran inhalativ", "Esketamin i.n."];

// medVerabreicht
function handleSelection(checkbox) {
  const checkedAnalgesics = Array.from(document.querySelectorAll('input[name="medVerabreicht"]:checked')).some((cb) =>
    analgesieTrigger.includes(cb.value)
  );

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
  const allMedCheckboxes = document.querySelectorAll('input[name="medVerabreicht"]');

  const anyChecked = Array.from(allMedCheckboxes).some((cb) => cb.checked);

  toggleMeasures("azmlVerabreicht-section", anyChecked);
}

function copyAnalgesieValues(from, to) {
  const suffixes = ["NRS", "GCS", "SpO2", "HF", "RR"];
  suffixes.forEach((suffix) => {
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

  const fields = ["newsAf", "newsSättigung", "newsRaumluft", "newsTemperatur", "newsSystBlutdruck", "newsHerzfrequenz", "newsBewusstsein"];

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

// GCS
function calculateGCS() {
  const eyes = document.querySelector('input[name="gcs-eyes"]:checked');
  const verbal = document.querySelector('input[name="gcs-verbal"]:checked');
  const motor = document.querySelector('input[name="gcs-motor"]:checked');

  let gcsTotal = parseInt(eyes.value) + parseInt(verbal.value) + parseInt(motor.value);

  document.getElementById("gcs-result").textContent = gcsTotal;
}

document.addEventListener("change", function (e) {
  if (e.target.matches('input[type="radio"]')) {
    calculateNEWS2();
  }
});

// =============================================================================
// removeErrorHighlights
// =============================================================================
function removeErrorHighlights() {
  document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
}

// =============================================================================
// validateForm
// =============================================================================
function validateForm() {
  removeErrorHighlights();
  let missingFields = [];

  const requiredFields = [
    { name: "sicherheit", label: "SSS Sicherheit", type: "radio" },
    { name: "einsatzstelle-type", label: "SSS Einsatzstelle", type: "radio" },
    { name: "AWfrei", label: "A Atemwege", type: "radio" },
    { name: "AF", label: "B Atemfrequenz", type: "text" },
    { name: "AZV", label: "B Atemzugsvolumen", type: "radio" },
    { name: "Thoraxexkursionen", label: "B Thoraxexkursionen", type: "radio" },
    { name: "Auskultation", label: "B Auskultation", type: "radio" },
    { name: "Atemgeräusch", label: "B Atemgeräusch", type: "radio" },
    { name: "Halsvenen", label: "B Halsvenen", type: "radio" },
    { name: "Trachea", label: "B Trachea", type: "radio" },
    { name: "PulsPeripher", label: "C Puls peripher", type: "radio" },
    { name: "PulsRhythmus", label: "C Puls Rhythmus", type: "radio" },
    { name: "HF", label: "C Herzfrequenz", type: "radio" },
    { name: "RekapZeit", label: "C Rekapzeit", type: "radio" },
    { name: "Hautfarbe", label: "C Hautfarbe", type: "radio" },
    { name: "Hautbeschaffenheit", label: "C Hautbeschaffenheit", type: "radio" },
    { name: "Hauttemperatur", label: "C Hauttemperatur", type: "radio" },
    { name: "AVPU", label: "D AVPU", type: "radio" },
    { name: "gcs-eyes", label: "D GCS - Augenöffnung", type: "radio" },
    { name: "gcs-verbal", label: "D GCS - Verbale Reaktion", type: "radio" },
    { name: "gcs-motor", label: "D GCS - Motorische Reaktion", type: "radio" },
    { name: "Isokorie", label: "D Isokorie", type: "radio" },
    { name: "Pupillengröße", label: "D Pupillengröße", type: "radio" },
    { name: "Lichtreaktion", label: "D Lichtreaktion", type: "radio" },
    { name: "Herdblick", label: "D Herdblick", type: "radio" },
    { name: "MDS", label: "D MDS", type: "radio" },
    { name: "APSS", label: "D APSS", type: "radio" },
    { name: "Entscheidung", label: "E Entscheidung kritisch/nicht kritisch", type: "radio" },
    { name: "Leitsymptom", label: "E Leitsymptom", type: "text" },
    { name: "suspKörperstellen", label: "E suspekte Körperstellen", type: "radio" },
    { name: "Symptome", label: "SAMPLER (S) Symptome", type: "text" },
    { name: "Allergien", label: "SAMPLER (A)", type: "radio" },
    { name: "Mahlzeit", label: "SAMPLER (L) Mahlzeit", type: "radio" },
    { name: "Flüssigkeit", label: "SAMPLER (L) Flüssigkeit", type: "radio" },
    { name: "Stuhl", label: "SAMPLER (L) Stuhl", type: "radio" },
    { name: "Harn", label: "SAMPLER (L) Harn", type: "radio" },
    { name: "Ereignis", label: "SAMPLER (E)", type: "text" },
    { name: "Risikofaktoren", label: "SAMPLER (R)", type: "checkbox" },
    { name: "TranspRM", label: "Transport zum Fahrzeug", type: "radio" },
  ];

  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const element = document.querySelector(`input[name="${field.name}"]:checked`);
      if (!element) {
        missingFields.push(field.label);
        document.getElementsByName(field.name).forEach((r) => r.classList.add("error"));
      }
    } else if (field.type === "checkbox") {
      const elements = document.querySelectorAll(`input[name="${field.name}"]:checked`);
      if (elements.length === 0) {
        missingFields.push(field.label);
        document.querySelectorAll(`input[name="${field.name}"]`).forEach((el) => el.classList.add("error"));
      }
    } else if (field.type === "text") {
      const textField = document.getElementById(field.name);
      if (!textField || textField.value.trim() === "") {
        missingFields.push(field.label);
        if (textField) textField.classList.add("error");
      }
    }
  });

  const toggleSections = [
    {
      sectionId: "internistisch-section",
      label: "SSS & GI - Ersteindruck",
      inputSelectors: [
        "input[name='gesamteindruck']:checked",
        "input[name='auffinden']:checked",
        "input[name='bewusstsein']:checked",
        "input[name='atmung']:checked",
        "input[name='haut']:checked",
      ],
    },
    {
      sectionId: "paediatrische-section",
      label: "SSS & GI - Pädiatrisches Beurteilungsdreieck",
      inputSelectors: [
        "input[name='pbdErscheinungsbild']:checked",
        "input[name='pbdAtmung']:checked",
        "input[name='pbdHaut']:checked",
        "input[name='ticlsMuskeltonus']:checked",
        "input[name='ticlsInteraktion']:checked",
        "input[name='ticlsConsolability']:checked",
        "input[name='ticlsLook']:checked",
        "input[name='ticlsSpeech']:checked",
      ],
    },
    {
      sectionId: "geriatrische-section",
      label: "SSS & GI - GEMS Diamant",
      inputSelectors: [
        "input[name='gAnatomie']:checked",
        "input[name='ePatientenzustand']:checked",
        "input[name='eUmgebung']:checked",
        "input[name='eTemperatur']:checked",
        "input[name='eBeleuchtung']:checked",
        "input[name='eGeruch']:checked",
        "input[name='mPolypharmazie']:checked",
        "input[name='mMultimorbidität']:checked",
        "input[name='mErnährungszustand']:checked",
        "input[name='sIsolation']:checked",
        "input[name='sDepression']:checked",
        "input[name='sVernachlässigung']:checked",
      ],
    },
    { sectionId: "privat-section", label: "SSS Einsatzstelle privat", radioName: "einsatzstelle-privat" },
    { sectionId: "öffentlich-section", label: "SSS Einsatzstelle öffentlich", radioName: "einsatzstelle-öffentlich" },
    { sectionId: "blutung-section", label: "x Maßnahmen Blutung", checkboxName: "MaßnahmenBlutung" },
    { sectionId: "airway-section", label: "A Maßnahmen Airway", checkboxName: "AWMGM" },
    { sectionId: "O2-section", label: "B Maßnahmen O2-Gabe", numberInputId: "O2-Gabe" },
    { sectionId: "KISS-section", label: "C Details KISS", checkboxName: "KISS" },
    { sectionId: "nexus-section", label: "D Details NEXUS", checkboxName: "NEXUS" },
    { sectionId: "suspect-section", label: "E Suspekte Körperstellen", textInputId: "suspekte Körperstellen" },
    { sectionId: "samplerNichtErhebbar-section", label: "SAMPLER nicht erhebbar - Begründung", radioName: "nichtErhebbarGrund" },
    { sectionId: "allergy-section", label: "SAMPLER (A) Details", textInputId: "Allergien" },
    { sectionId: "mahlzeit-section", label: "SAMPLER (L) Mahlzeit", textInputId: "Mahlzeit" },
    { sectionId: "flüssigkeit-section", label: "SAMPLER (L) Flüssigkeit", textInputId: "Flüssigkeit" },
    { sectionId: "stuhl-section", label: "SAMPLER (L) Stuhl", checkboxName: "StuhlQualität" },
    { sectionId: "stuhlSonstige-section", label: "SAMPLER (L) Stuhl sonstige Auffälligkeiten", textInputId: "StuhlQualität" },
    { sectionId: "harn-section", label: "SAMPLER (L) Harn", checkboxName: "HarnQualität" },
    { sectionId: "harnSonstige-section", label: "SAMPLER (L) Harn sonstige Auffälligkeiten", textInputId: "HarnQualität" },
    { sectionId: "risk-section", label: "SAMPLER (R) Risikofaktoren", checkboxName: "Risikofaktoren" },
    {
      sectionId: "NKV-section",
      label: "Notfallkompetenz NKV",
      inputSelectors: [
        "input[name='NKVerfolgreich']:checked",
        "#nkvVersuche",
        "input[name='nkvGröße']:checked",
        "input[name='punktionsstelle']:checked",
      ],
    },
    { sectionId: "punktionsstelleSonstiges-section", label: "NKV sonstige Punktionsstelle", textInputId: "punktionsstelle" },
    {
      sectionId: "NKI-section",
      label: "endotracheale Intubation",
      inputSelectors: [
        "input[name='NKIerfolgreich']:checked",
        "#nkiVersuche",
        "input[name='Laryngoskopie']:checked",
        "input[name='CL']:checked",
        "input[name='nkiGröße']:checked",
        "input[name='spatelGröße']:checked",
        "#zahnreihe",
        "#etCo2",
        "input[name='lagekontrolleTubusPulmo']:checked",
        "input[name='lagekontrolleTubusEpigastrium']:checked",
      ],
    },
    {
      sectionId: "NIV-section",
      label: "Nicht-invasive Beatmung",
      inputSelectors: ["input[name='nivMaskengröße']:checked", "#PEEP", "#ASB", "#pMax"],
    },
    {
      sectionId: "transport-section",
      label: "Transport in Klinik",
      inputSelectors: ["input[name='TranspKlinik']:checked", "input[name='TranspSoSi']:checked"],
    },
  ];

  toggleSections.forEach((section) => {
    const sectionElement = document.getElementById(section.sectionId);
    if (!sectionElement) return;

    const isVisible = sectionElement.classList.contains("active") || window.getComputedStyle(sectionElement).display !== "none";

    if (!isVisible) return;

    let sectionHasError = false;

    if (section.radioName) {
      const selected = document.querySelector(`input[name="${section.radioName}"]:checked`);
      if (!selected) {
        missingFields.push(section.label + " (eine Option auswählen)");
        sectionHasError = true;
      }
    }

    if (section.textInputId) {
      const textInput = document.getElementById(section.textInputId);
      if (!textInput || textInput.value.trim() === "") {
        missingFields.push(section.label + " (Textfeld ausfüllen)");
        sectionHasError = true;
      }
    }

    if (section.numberInputId) {
      const numInput = document.getElementById(section.numberInputId);
      if (!numInput || numInput.value.trim() === "") {
        missingFields.push(section.label + " (Feld ausfüllen)");
        sectionHasError = true;
      }
    }

    if (section.checkboxName) {
      const checkboxes = document.querySelectorAll(`input[name="${section.checkboxName}"]:checked`);
      if (checkboxes.length === 0) {
        missingFields.push(section.label + " (mindestens eine Option auswählen)");
        sectionHasError = true;
      }
    }

    if (section.inputSelectors) {
      const allFilled = section.inputSelectors.every((selector) => {
        const input = document.querySelector(selector);
        return input && (input.type === "radio" || input.type === "checkbox" ? input.checked : input.value.trim() !== "");
      });
      if (!allFilled) {
        missingFields.push(section.label + " (alle Pflichtfelder ausfüllen)");
        sectionHasError = true;
      }
    }

    if (sectionHasError) sectionElement.classList.add("error");
  });

  if (missingFields.length > 0) {
    alert("Bitte füllen Sie die folgenden Pflichtfelder aus:\n\n" + missingFields.join("\n"));
    return false;
  }

  return true;
}

// =============================================================================
// DOMContentLoaded – Unauffällig-Logik
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
  function safeSet(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.checked = value;
  }

  function setUnauffaelligValues(section, isChecked) {
    // ABCDE – löst A/B/C/D einzeln aus
    if (section === "abcde") {
      ["airway", "breathing", "circulation", "disability"].forEach((sub) => {
        const cb = document.querySelector(`input[name='${sub}-unauffaellig']`);
        if (cb) {
          cb.checked = isChecked;
          cb.dispatchEvent(new Event("change"));
        }
      });
      const abcdeCb = document.querySelector("input[name='abcde-unauffaellig']");
      if (abcdeCb) abcdeCb.checked = isChecked;
      safeSet("input[name='entscheidung'][value='NICHT KRITISCH']", isChecked);
      safeSet("input[name='suspekt'][value='keine weiteren Auffälligkeiten']", isChecked);

      const traumaChecked = document.querySelector("input[name='einsatzkategorie'][value='Traumatologischer Patient']")?.checked;
      if (traumaChecked) {
        const traumaCb = document.querySelector("input[name='trauma-unauffaellig']");
        if (traumaCb) {
          traumaCb.checked = isChecked;
          traumaCb.dispatchEvent(new Event("change"));
        }
        safeSet("input[name='blutung'][value='Nein']", isChecked);
      }
    }

    // A – Airway
    if (section === "airway") {
      safeSet("input[name='airway'][value='Atemwege frei']", isChecked);
    }

    // B – Breathing
    if (section === "breathing") {
      const paediatricChecked = document.querySelector("input[name='einsatzkategorie'][value='Pädiatrischer Patient']")?.checked;
      const afField = document.getElementById("af");
      if (afField) afField.value = isChecked && !paediatricChecked ? "12" : "";
      safeSet("input[name='atemzugsvolumen'][value='suffizient']", isChecked);
      safeSet("input[name='thoraxexkursionen'][value='seitengleich']", isChecked);
      safeSet("input[name='auskultation'][value='seitengleich']", isChecked);
      safeSet("input[name='atemgeräusch'][value='vesikuläres AG']", isChecked);
      safeSet("input[name='halsvenen'][value='HV nicht gestaut']", isChecked);
      safeSet("input[name='trachea'][value='Trachea mittelständig']", isChecked);
    }

    // C – Circulation
    if (section === "circulation") {
      safeSet("input[name='puls'][value='gut tastbar']", isChecked);
      safeSet("input[name='herzrhythmus'][value='rhythmisch']", isChecked);
      safeSet("input[name='herzfrequenz'][value='normofrequent']", isChecked);
      safeSet("input[name='rekapZeit'][value='< 2 Sekunden']", isChecked);
      safeSet("input[name='hautfarbe'][value='rosig']", isChecked);
      safeSet("input[name='hautbeschaffenheit'][value='trocken']", isChecked);
      safeSet("input[name='hauttemperatur'][value='warm']", isChecked);
    }

    // D – Disability
    if (section === "disability") {
      safeSet("input[name='avpu'][value='Alert']", isChecked);
      safeSet("input[name='gcs-eyes'][value='4']", isChecked);
      safeSet("input[name='gcs-verbal'][value='5']", isChecked);
      safeSet("input[name='gcs-motor'][value='6']", isChecked);
      safeSet("input[name='isokorie'][value='isokor']", isChecked);
      safeSet("input[name='pupillengroesse'][value='mittelweit']", isChecked);
      safeSet("input[name='lichtreaktion'][value='prompte Lichtreaktion']", isChecked);
      safeSet("input[name='herdblick'][value='kein Herdblick']", isChecked);
      safeSet("input[name='mds'][value='MDS unauffällig']", isChecked);
      safeSet("input[name='apss'][value='APSS negativ']", isChecked);
      if (isChecked) {
        calculateGCS();
      } else {
        resetGCS();
      }
    }

    // Trauma
    if (section === "trauma") {
      safeSet("input[name='traumaMILS'][value='keine MILS durchgeführt']", isChecked);
      safeSet("input[name='traumaThorax'][value='Thorax stabil']", isChecked);
      safeSet("input[name='traumaAbdomen'][value='Abdomen weich']", isChecked);
      safeSet("input[name='traumaOberschenkel'][value='Oberschenkel stabil']", isChecked);
      safeSet("input[name='traumaBecken'][value='Becken stabil']", isChecked);
      safeSet("input[name='traumaMILS'][value='keine MILS durchgeführt']", isChecked);
      safeSet("input[name='traumaSchaedel'][value='kein Sturz auf den Schädel']", isChecked);
      safeSet("input[name='traumaUHG'][value='Unfallhergang erinnerlich']", isChecked);
    }

    // GI – Gesamteindruck
    if (section === "gi") {
      safeSet("input[name='gesamteindruck'][value='nicht kritisch']", isChecked);
      safeSet("input[name='auffinden'][value='sitzend']", isChecked);
      safeSet("input[name='bewusstsein'][value='wach']", isChecked);
      safeSet("input[name='atmung'][value='unauffällig']", isChecked);
      safeSet("input[name='haut'][value='rosig']", isChecked);
    }

    // Pädiatrie – PBD
    if (section === "paediatrie") {
      safeSet("input[name='pbdErscheinungsbild'][value='nicht kritisch']", isChecked);
      safeSet("input[name='pbdAtmung'][value='nicht kritisch']", isChecked);
      safeSet("input[name='pbdHaut'][value='kritisch']", isChecked); // HTML hat value="kritisch" für "nicht kritisch" Option
      safeSet("input[name='ticlsMuskeltonus'][value='Muskeltonus gegeben']", isChecked);
      safeSet("input[name='ticlsInteraktion'][value='interagiert mit Umgebung']", isChecked);
      safeSet("input[name='ticlsConsolability'][value='Kind lässt sich trösten']", isChecked);
      safeSet("input[name='ticlsLook'][value='Kind hat klaren Blick']", isChecked);
      safeSet("input[name='ticlsSpeech'][value='Kind spricht altersgemäß']", isChecked);
    }

    // SAMPLER – unauffällig
    if (section === "sampler") {
      safeSet("input[name='allergienStatus'][value='Keine']", isChecked);
      safeSet("input[name='medikationStatus'][value='Keine']", isChecked);
      safeSet("input[name='patientenStatus'][value='Keine']", isChecked);
      safeSet("input[name='mahlzeit'][value='normale Nahrungsaufnahme']", isChecked);
      safeSet("input[name='fluessigkeit'][value='normale Flüssigkeitszufuhr']", isChecked);
      safeSet("input[name='stuhl'][value='unauffällig']", isChecked);
      safeSet("input[name='harn'][value='unauffällig']", isChecked);
      safeSet("input[name='risikoStatus'][value='Keine']", isChecked);
    }

    // SAMPLER – nicht erhebbar
    if (section === "samplerNichtErhebbar") {
      safeSet("input[name='allergienStatus'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='medikationStatus'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='patientenStatus'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='mahlzeit'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='fluessigkeit'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='stuhl'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='harn'][value='nicht erhebbar']", isChecked);
      safeSet("input[name='risikoStatus'][value='nicht erhebbar']", isChecked);
    }

    // Geriatrie – GEMS
    if (section === "geriatrie") {
      ["keine anatomischen / physiologischen Veränderungen", "keine kognitiven Veränderungen", "keine Kommunikationseinschränkung"].forEach(
        (value) => {
          safeSet(`input[name='gAnatomie'][value='${value}']`, isChecked);
        }
      );
      safeSet("input[name='ePatientenzustand'][value='gepflegt']", isChecked);
      safeSet("input[name='eUmgebung'][value='sauber']", isChecked);
      safeSet("input[name='eTemperatur'][value='angemessen']", isChecked);
      safeSet("input[name='eBeleuchtung'][value='ausreichend']", isChecked);
      safeSet("input[name='eGeruch'][value='unauffällig']", isChecked);
      safeSet("input[name='mPolypharmazie'][value='nein']", isChecked);
      safeSet("input[name='mMultimorbiditaet'][value='nein']", isChecked);
      safeSet("input[name='mErnaehrungszustand'][value='guter Ernährungszustand']", isChecked);
      safeSet("input[name='sIsolation'][value='regelmäßiger Kontakt zu Angehörigen']", isChecked);
      safeSet("input[name='sDepression'][value='keine Hinweise']", isChecked);
      safeSet("input[name='sVernachlaessigung'][value='keine Hinweise']", isChecked);
    }
  }

  // Mapping: checkbox name im HTML → section key in setUnauffaelligValues
  const unauffaelligMap = [
    // primary-content
    { name: "abcde-unauffaellig", section: "abcde" },
    { name: "airway-unauffaellig", section: "airway", mirror: "a-unauffaellig" },
    { name: "breathing-unauffaellig", section: "breathing", mirror: "b-unauffaellig" },
    { name: "circulation-unauffaellig", section: "circulation", mirror: "c-unauffaellig" },
    { name: "disability-unauffaellig", section: "disability", mirror: "d-unauffaellig" },

    // section-eigene Checkboxen
    { name: "a-unauffaellig", section: "airway", mirror: "airway-unauffaellig" },
    { name: "b-unauffaellig", section: "breathing", mirror: "breathing-unauffaellig" },
    { name: "c-unauffaellig", section: "circulation", mirror: "circulation-unauffaellig" },
    { name: "d-unauffaellig", section: "disability", mirror: "disability-unauffaellig" },
    { name: "x-unauffaellig", section: "x" },
    { name: "trauma-unauffaellig", section: "trauma" },
    { name: "gi-unauffaellig", section: "gi" },
    { name: "samplerUnauffaellig", section: "sampler" },
    { name: "samplerNichtErhebbar", section: "samplerNichtErhebbar" },
  ];

  unauffaelligMap.forEach(({ name, section, mirror }) => {
    document.querySelectorAll(`input[name='${name}']`).forEach((cb) => {
      cb.addEventListener("change", function () {
        setUnauffaelligValues(section, this.checked);

        if (mirror) {
          document.querySelectorAll(`input[name='${mirror}']`).forEach((mirrorCb) => {
            mirrorCb.checked = this.checked;
          });
        }
      });
    });
  });
});

// =============================================================================
// resetGCS
// =============================================================================
function resetGCS() {
  document.querySelectorAll("input[name='gcs-eyes']").forEach((i) => (i.checked = false));
  document.querySelectorAll("input[name='gcs-verbal']").forEach((i) => (i.checked = false));
  document.querySelectorAll("input[name='gcs-motor']").forEach((i) => (i.checked = false));
  document.getElementById("gcs-result").textContent = "";
}

// =============================================================================
// getLeitsymptom + ABCDEUnauffällig Button
// =============================================================================
function getLeitsymptom() {
  const leitsymptom = prompt("Leitsymptom eingeben:");
  const lsEContent = document.getElementById("leitsymptom");
  const lsSampler = document.getElementById("symptome");
  if (leitsymptom) {
    if (lsEContent) lsEContent.value = leitsymptom;
    if (lsSampler) lsSampler.innerHTML = leitsymptom;
  }
}

document.getElementById("abcde-unauffaellig-1")?.addEventListener("click", function () {
  getLeitsymptom();
  this.disabled = true;
});

// =============================================================================
// copyRest
// =============================================================================
function copyRest() {
  const el = document.getElementById("ausgabeSummary");
  const text = el ? el.innerText : "";
  const rest = text.length > 2008 ? text.slice(2008) : "";

  if (!rest) {
    const fb = document.getElementById("copyFeedback");
    if (fb) fb.textContent = "Text ist kürzer als 2009 Zeichen.";
    return;
  }

  navigator.clipboard
    .writeText(rest)
    .then(() => {
      const fb = document.getElementById("copyFeedback");
      if (fb) fb.textContent = "Restlicher Text ab Zeichen 2009 wurde kopiert.";
    })
    .catch(() => {
      const fb = document.getElementById("copyFeedback");
      if (fb) fb.textContent = "Fehler beim Kopieren. Bitte manuell kopieren.";
    });
}

// =============================================================================
// requiredFieldDefaults + activateAllRequiredFieldsForAdminTest
// =============================================================================
const requiredFieldDefaults = [
  { name: "einsatzkategorie", type: "radio", value: "Internistischer Patient" },
  { name: "sicherheit", type: "radio", value: "BO sicher" },
  { name: "einsatzstelle", type: "custom-select", value: "Wohnung" },
  { name: "gi-unauffaellig", type: "checkbox", value: "GIUnauffällig" },
  { name: "airway-unauffaellig", type: "checkbox", value: "airwayUnauffällig" },
  { name: "breathing-unauffaellig", type: "checkbox", value: "breathingUnauffällig" },
  { name: "circulation-unauffaellig", type: "checkbox", value: "circulationUnauffällig" },
  { name: "disability-unauffaellig", type: "checkbox", value: "disabilityUnauffällig" },
  { name: "entscheidung", type: "radio", value: "NICHT KRITISCH" },
  { name: "leitsymptom", type: "text", value: "Thoraxschmerz" },
  { name: "suspekt", type: "radio", value: "keine weiteren Auffälligkeiten" },
  { name: "samplerUnauffaellig", type: "checkbox", value: "unauffällig" },
  { name: "symptome", type: "text", value: "Thoraxschmerz" },
  { name: "ereignis", type: "text", value: "Thoraxschmerz" },
  { name: "transpRM", type: "radio", value: "kein Transport" },
];

function activateAllRequiredFieldsForAdminTest() {
  requiredFieldDefaults.forEach((field) => {
    if (field.type === "radio" || field.type === "checkbox") {
      const input = document.querySelector(`input[name="${field.name}"][value="${field.value}"]`);
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    } else if (field.type === "text" || field.type === "number") {
      const input = document.getElementById(field.name);
      if (input) input.value = field.value;
    } else if (field.type === "custom-select") {
      const hiddenInput = document.querySelector(`input[name="${field.name}"]`);
      if (hiddenInput) hiddenInput.value = field.value;

      const trigger = document.querySelector(`[data-name="${field.name}"] .custom-select-trigger`);
      if (trigger) trigger.textContent = field.value;

      const option = document.querySelector(`[data-name="${field.name}"] .custom-option[data-value="${field.value}"]`);
      if (option) {
        document.querySelectorAll(`[data-name="${field.name}"] .custom-option`).forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
      }
    }
  });

  document.querySelectorAll('input[type="text"]:not([disabled])').forEach((input) => {
    if (input.offsetParent !== null && input.value.trim() === "") input.value = "Testeintrag";
  });

  document.querySelectorAll('input[type="number"]:not([disabled])').forEach((input) => {
    if (input.offsetParent !== null && input.value.trim() === "") input.value = "1";
  });

  document.querySelectorAll("textarea").forEach((input) => {
    if (input.offsetParent !== null && input.value.trim() === "") input.value = "Testtext";
  });

  alert("Alle definierten Pflichtfelder wurden für den Admin-Test automatisch ausgefüllt.");
}

// generateSummary()
function generateSummary() {
  let summary = "";

  // #region Sicherheit / PSA
  const sicherheit = document.querySelector('input[name="sicherheit"]:checked');
  const psa = document.querySelector('input[name="psa"]:checked');
  summary += sicherheit ? `SSS: ${sicherheit.value}, ` : "";
  summary += psa ? `${psa.value}, ` : "";
  // #endregion

  // #region Einsatzstelle
  const einsatzstelleHidden = document.querySelector('input[name="einsatzstelle"]');
  const einsatzstelleValue = einsatzstelleHidden ? einsatzstelleHidden.value : "";
  if (einsatzstelleValue) {
    summary += `Einsatzstelle: `;
    if (einsatzstelleValue === "Sonstiges") {
      const sonstiges = document.getElementById("einsatzstelleSonstiges")?.value.trim();
      summary += sonstiges ? sonstiges : "Sonstiges";
    } else {
      summary += einsatzstelleValue;
    }
  }
  // #endregion

  // #region Anwesende Kräfte
  // Neu: name="anwesendeKraefte"
  const anwesendeKraefte = document.querySelectorAll('input[name="anwesendeKraefte"]:checked');
  if (anwesendeKraefte.length > 0) {
    summary += "\nAnwesende Kräfte: ";
    const kraefteTexte = [];

    anwesendeKraefte.forEach((checkbox) => {
      if (checkbox.value === "LPD" || checkbox.value === "FW") {
        kraefteTexte.push(checkbox.value);
      } else if (checkbox.value === "RD") {
        const erste = document.getElementById("rdErsteintreffend")?.value.trim();
        const weitere = document.getElementById("rdWeitere")?.value.trim();
        let rdText = "RD";
        if (erste) rdText += `: ersteintreffend: ${erste}`;
        if (weitere) rdText += erste ? `, weitere: ${weitere}` : `: weitere: ${weitere}`;
        kraefteTexte.push(rdText);
      } else if (checkbox.value === "sonstige") {
        const sonstige = document.getElementById("sonstigeKraefte")?.value.trim();
        kraefteTexte.push(sonstige || "sonstige");
      }
    });

    summary += kraefteTexte.join(" / ");
  }
  // #endregion

  // #region vorbehandelt durch
  // Neu: name="vorbehandelndeKraefte"
  const vorbehandelt = document.querySelectorAll('input[name="vorbehandelndeKraefte"]:checked');
  if (vorbehandelt.length > 0) {
    summary += "\nVorbehandlung durch: ";
    vorbehandelt.forEach((checkbox, index) => {
      if (
        checkbox.value === "LPD" ||
        checkbox.value === "FW" ||
        checkbox.value === "Ersthelfer" ||
        checkbox.value === "Heimhilfe / Pflegekraft"
      ) {
        summary += checkbox.value;
      } else if (checkbox.value === "Sonstige") {
        const sonstigeInput = document.getElementById("vorbehandeltSonstige");
        if (sonstigeInput && sonstigeInput.value.trim() !== "") {
          summary += sonstigeInput.value.trim();
        }
      }
      if (index < vorbehandelt.length - 1) {
        summary += " / ";
      }
    });
  }
  // #endregion

  // #region SSS - weitere Bemerkungen
  // Neu: id="sssSonstige"
  const SSSweitere = document.getElementById("sssSonstige");
  if (SSSweitere && SSSweitere.value.trim().length > 0) {
    summary += ` // ${SSSweitere.value.trim()}`;
  }

  summary += "\n";
  // #endregion

  // #region sichtbare Sections (GI / PBD / GEMS / Trauma)
  const giSection = document.getElementById("gi-content");
  const pbdSection = document.getElementById("pbd-content");
  const gemsSection = document.getElementById("gems-content");
  const traumaSection = document.getElementById("trauma-content");
  // #endregion

  // #region GI - Ersteindruck
  const gesamteindruck = document.querySelector('input[name="gesamteindruck"]:checked');
  const auffinden = document.querySelector('input[name="auffinden"]:checked');
  const bewusstsein = document.querySelector('input[name="bewusstsein"]:checked');
  const atmung = document.querySelector('input[name="atmung"]:checked');
  const hautCheckboxes = document.querySelectorAll('input[name="haut"]:checked');

  summary += gesamteindruck ? "GI: " + gesamteindruck.value + "\n" : "";
  summary += auffinden ? "Pat. " + auffinden.value + " angetroffen, " : "";
  summary += bewusstsein ? bewusstsein.value + ", " : "";
  summary += atmung ? "Atmung: " + atmung.value + ", " : "";
  if (hautCheckboxes.length > 0) {
    summary += "Haut: ";
    hautCheckboxes.forEach((checkbox, index) => {
      summary += checkbox.value;
      if (index < hautCheckboxes.length - 1) summary += ", ";
    });
  }

  // GI - weitere Bemerkungen (neu: id="giSonstige")
  const GIweitere = document.getElementById("giSonstige");
  if (GIweitere && GIweitere.value.trim().length > 0) {
    summary += ` // ${GIweitere.value.trim()}`;
  }
  summary += "\n";
  // #endregion

  // #region PBD - Pädiatrisches Beurteilungsdreieck
  const pbdErscheinungsbild = document.querySelector('input[name="pbdErscheinungsbild"]:checked');
  const pbdAtmung = document.querySelector('input[name="pbdAtmung"]:checked');
  const pbdHaut = document.querySelector('input[name="pbdHaut"]:checked');
  
  const pbdAtmungAuffaelligkeiten = document.querySelectorAll('input[name="pbdAtmungQualitaet"]:checked');
  const pbdHautAuffaelligkeiten = document.querySelectorAll('input[name="pbdHautQualitaet"]:checked');

  
  if (pbdErscheinungsbild && pbdAtmung && pbdHaut) {
    summary += "Pädiatrisches Beurteilungsdreieck: \n";
    summary += pbdErscheinungsbild ? "Erscheinungsbild: " + pbdErscheinungsbild.value + ", " : "";
    summary += pbdAtmung ? "Atmung: " + pbdAtmung.value + ", " : "";
    summary += pbdHaut ? "Haut: " + pbdHaut.value + "\n" : "";

    if (pbdErscheinungsbild.value === "kritisch" || pbdAtmung.value === "kritisch" || pbdHaut.value === "kritisch") {
      summary += "Kind nach PBD kritisch\n";
    } else {
      summary += "Kind nach PBD nicht kritisch\n";
    }

    const ticlsMuskeltonus = document.querySelector('input[name="ticlsMuskeltonus"]:checked');
    const ticlsInteraktion = document.querySelector('input[name="ticlsInteraktion"]:checked');
    const ticlsConsolability = document.querySelector('input[name="ticlsConsolability"]:checked');
    const ticlsLook = document.querySelector('input[name="ticlsLook"]:checked');
    const ticlsSpeech = document.querySelector('input[name="ticlsSpeech"]:checked');
  
    summary += "TICLS: ";
    summary += ticlsMuskeltonus ? ticlsMuskeltonus.value + ", " : "";
    summary += ticlsInteraktion ? ticlsInteraktion.value + ", " : "";
    summary += ticlsConsolability ? ticlsConsolability.value + ", " : "";
    summary += ticlsLook ? ticlsLook.value + ", " : "";
    summary += ticlsSpeech ? ticlsSpeech.value : "";
  
    if (pbdAtmungAuffaelligkeiten.length > 0) {
      summary += " // Atmung Auffälligkeiten: ";
      pbdAtmungAuffaelligkeiten.forEach((checkbox, index) => {
        summary += checkbox.value;
        if (index < pbdAtmungAuffaelligkeiten.length - 1) summary += ", ";
      });
    }
    if (pbdHautAuffaelligkeiten.length > 0) {
      summary += " // Haut Auffälligkeiten: ";
      pbdHautAuffaelligkeiten.forEach((checkbox, index) => {
        summary += checkbox.value;
        if (index < pbdHautAuffaelligkeiten.length - 1) summary += ", ";
      });
    }

    // PBD - weitere Bemerkungen (neu: id="pbdWeitere")
    const PBDweitere = document.getElementById("pbdWeitere");
    if (PBDweitere && PBDweitere.value.trim().length > 0) {
      summary += ` // ${PBDweitere.value.trim()}`;
    }
    summary += "\n";
  }

  // #endregion

  // #region Primary Assessment - x: bedrohliche Blutung
  // Neu: name="blutung", name="blutungZusatz", id="blutungWeitere"
  const blutung = document.querySelector('input[name="blutung"]:checked');
  const xUnauffaellig = document.querySelector('input[name="x-unauffaellig"]:checked');

  if (xUnauffaellig) {
    summary += `x: unauffällig`;
    summary += "\n";
  } else if (blutung) {
    summary += `x: ${blutung.value}`;
    if (blutung.value === "Ja") {
      const maßnahmenBlutung = document.querySelectorAll('input[name="blutungZusatz"]:checked');
      if (maßnahmenBlutung.length > 0) {
        summary += "\nMaßnahmen: ";
        maßnahmenBlutung.forEach((checkbox, index) => {
          summary += checkbox.value;
          if (index < maßnahmenBlutung.length - 1) summary += ", ";
        });
      }
    }
    const Xweitere = document.getElementById("blutungWeitere");
    if (Xweitere && Xweitere.value.trim().length > 0) {
      summary += ` // ${Xweitere.value.trim()}`;
    }
    summary += "\n";
  }
  // #endregion

  // #region A - Airway
  // Neu: name="airway", name="airwaymanagement", id="airwayWeitere"
  const aUnauffaellig = document.querySelector('input[name="a-unauffaellig"]:checked');
  const airway = document.querySelector('input[name="airway"]:checked');

  if (aUnauffaellig) {
    summary += `A: unauffällig`;
  } else {
    summary += airway ? `A: ${airway.value}` : "A: ";
  }

  const Aweitere = document.getElementById("airwayWeitere");
  if (Aweitere && Aweitere.value.trim().length > 0) {
    summary += ` // ${Aweitere.value.trim()}`;
  }

  const maßnahmenAtemweg = document.querySelectorAll('input[name="airwaymanagement"]:checked');
  if (maßnahmenAtemweg.length > 0) {
    summary += "\nMaßnahmen: ";
    maßnahmenAtemweg.forEach((checkbox, index) => {
      summary += checkbox.value;
      if (index < maßnahmenAtemweg.length - 1) summary += ", ";
    });
  }

  summary += "\n";
  // #endregion

  // #region B - Breathing
  // Neu: id="af", name="atemzugsvolumen", name="thoraxexkursionen", name="auskultation",
  //      name="atemgeräusch", name="halsvenen", name="trachea"
  const bUnauffaellig = document.querySelector('input[name="b-unauffaellig"]:checked');

  if (bUnauffaellig) {
    summary += `B: unauffällig`;
  } else {
    const atemfrequenz = document.getElementById("af")?.value;
    const atemzugsvolumen = document.querySelector('input[name="atemzugsvolumen"]:checked');
    const thoraxexkursionen = document.querySelector('input[name="thoraxexkursionen"]:checked');
    const auskultation = document.querySelector('input[name="auskultation"]:checked');
    const atemgeräusch = document.querySelector('input[name="atemgeräusch"]:checked');
    const halsvenen = document.querySelector('input[name="halsvenen"]:checked');
    const trachea = document.querySelector('input[name="trachea"]:checked');

    summary += `B: `;
    summary += atemfrequenz ? `AF ${atemfrequenz}, ` : "";
    summary += atemzugsvolumen ? `${atemzugsvolumen.value}, ` : "";
    summary += thoraxexkursionen ? `${thoraxexkursionen.value}, ` : "";
    summary += auskultation ? `${auskultation.value}, ` : "";
    summary += atemgeräusch ? `${atemgeräusch.value}, ` : "";
    summary += halsvenen ? `${halsvenen.value}, ` : "";
    summary += trachea ? `${trachea.value}` : "";

    // Trauma B - Blutungsräume
    if (traumaSection && window.getComputedStyle(traumaSection).display !== "none") {
      const traumaThorax = document.querySelector('input[name="traumaThorax"]:checked');
      summary += traumaThorax ? `, ${traumaThorax.value}` : "";

      // weitere Bemerkungen Trauma B (neu: id="traumaBWeitere")
      const traumaBweitere = document.getElementById("traumaBWeitere");
      if (traumaBweitere && traumaBweitere.value.trim().length > 0) {
        summary += `, ${traumaBweitere.value.trim()}`;
      }
    }
  }

  // weitere Bemerkungen B (neu: id="breathingWeitere")
  const Bweitere = document.getElementById("breathingWeitere");
  if (Bweitere && Bweitere.value.trim().length > 0) {
    summary += ` // ${Bweitere.value.trim()}`;
  }

  // Maßnahmen B (neu: name="b-massnahmen", id="b-massnahmenO2")
  const maßnahmenB = document.querySelectorAll('input[name="b-massnahmen"]:checked');
  const o2Measures = ["O2-Brille", "O2-Maske", "O2-Vernebler", "assistierte Beatmung", "kontrollierte Beatmung", "etCO2-Nasenbrille"];
  const o2GabeMenge = document.getElementById("b-massnahmenO2")?.value.trim() || "";

  if (maßnahmenB.length > 0) {
    let maßnahmenText = [];
    let o2Relevant = false;

    maßnahmenB.forEach((checkbox) => {
      const value = checkbox.value;
      maßnahmenText.push(value);
      if (o2Measures.includes(value)) o2Relevant = true;
    });

    summary += `\nMaßnahmen: ${maßnahmenText.join(", ")}`;
    if (o2Relevant && o2GabeMenge !== "") {
      summary += `, O2-Gabe: ${o2GabeMenge} l/min`;
    }
  }

  summary += "\n";
  // #endregion

  // #region C - Circulation
  // Neu: name="puls", name="pulsZentral", name="herzrhythmus", name="herzfrequenz",
  //      name="rekapZeit", name="hautfarbe", name="hautbeschaffenheit", name="hauttemperatur"
  const cUnauffaellig = document.querySelector('input[name="c-unauffaellig"]:checked');

  if (cUnauffaellig) {
    summary += `C: unauffällig`;
  } else {
    const pulsPeripher = document.querySelector('input[name="puls"]:checked');
    const pulsZentral = document.querySelector('input[name="pulsZentral"]:checked');
    const rhythmus = document.querySelector('input[name="herzrhythmus"]:checked');
    const hf = document.querySelector('input[name="herzfrequenz"]:checked');
    const rekap = document.querySelector('input[name="rekapZeit"]:checked');
    const hautfarbe = document.querySelector('input[name="hautfarbe"]:checked');
    const hautbeschaffenheit = document.querySelector('input[name="hautbeschaffenheit"]:checked');
    const hauttemperatur = document.querySelector('input[name="hauttemperatur"]:checked');

    summary += `C: `;
    summary += pulsPeripher ? `Puls peripher ${pulsPeripher.value}, ` : "";
    summary += pulsZentral ? `Puls zentral ${pulsZentral.value}, ` : "";
    summary += rhythmus ? `${rhythmus.value}, ` : "";
    summary += hf ? `${hf.value}, ` : "";
    summary += rekap ? `Rekap.Zeit ${rekap.value}, ` : "";
    summary += hautfarbe ? `Haut ${hautfarbe.value}, ` : "";
    summary += hautbeschaffenheit ? `${hautbeschaffenheit.value}, ` : "";
    summary += hauttemperatur ? `${hauttemperatur.value}` : "";

    // Trauma C - Blutungsräume
    if (traumaSection && window.getComputedStyle(traumaSection).display !== "none") {
      const traumaAbdomen = document.querySelector('input[name="traumaAbdomen"]:checked');
      const traumaOberschenkel = document.querySelector('input[name="traumaOberschenkel"]:checked');
      const traumaBecken = document.querySelector('input[name="traumaBecken"]:checked');
      summary += traumaAbdomen ? `, ${traumaAbdomen.value}` : "";
      summary += traumaOberschenkel ? `, ${traumaOberschenkel.value}` : "";
      summary += traumaBecken ? `, ${traumaBecken.value}` : "";

      // weitere Bemerkungen Trauma C (neu: id="traumaCWeitere")
      const traumaCweitere = document.getElementById("traumaCWeitere");
      if (traumaCweitere && traumaCweitere.value.trim().length > 0) {
        summary += `, ${traumaCweitere.value.trim()}`;
      }
    }
  }

  // weitere Bemerkungen C (neu: id="circulationWeitere")
  const Cweitere = document.getElementById("circulationWeitere");
  if (Cweitere && Cweitere.value.trim().length > 0) {
    summary += ` // ${Cweitere.value.trim()}`;
  }

  // Maßnahmen C (neu: name="c-massnahmen", name="kiss")
  const kreislaufMaßnahmen = document.querySelectorAll('input[name="c-massnahmen"]:checked');
  const kiss = document.querySelectorAll('input[name="kiss"]:checked');

  if (kreislaufMaßnahmen.length > 0) {
    summary += "\nMaßnahmen: ";
    kreislaufMaßnahmen.forEach((checkbox, index) => {
      summary += checkbox.value;
      if (index < kreislaufMaßnahmen.length - 1) summary += ", ";
    });
  }
  if (kiss.length > 0) {
    summary += ": ";
    kiss.forEach((checkbox, index) => {
      summary += checkbox.value;
      if (index < kiss.length - 1) summary += ", ";
    });
  }

  summary += "\n";
  // #endregion

  // #region D - Disability
  // Neu: name="avpu", name="isokorie", name="pupillengroesse", name="lichtreaktion",
  //      name="mds", name="apss", name="herdblick"
  const dUnauffaellig = document.querySelector('input[name="d-unauffaellig"]:checked');

  if (dUnauffaellig) {
    summary += `D: unauffällig`;
  } else {
    const avpu = document.querySelector('input[name="avpu"]:checked');
    const gcs = document.getElementById("gcs-result")?.textContent;
    const isokorie = document.querySelector('input[name="isokorie"]:checked');
    const pupillengröße = document.querySelector('input[name="pupillengroesse"]:checked');
    const lichtreaktion = document.querySelector('input[name="lichtreaktion"]:checked');
    const mds = document.querySelector('input[name="mds"]:checked');
    const apss = document.querySelector('input[name="apss"]:checked');
    const herdblick = document.querySelector('input[name="herdblick"]:checked');

    summary += `D: `;
    summary += avpu ? `${avpu.value}, ` : "";
    summary += gcs ? `GCS: ${gcs}, ` : "";
    summary += isokorie ? `Pupillen: ${isokorie.value}, ` : "";
    summary += pupillengröße ? `${pupillengröße.value}, ` : "";
    summary += lichtreaktion ? `${lichtreaktion.value}, ` : "";
    summary += herdblick ? `${herdblick.value}, ` : "";
    summary += mds ? `${mds.value}, ` : "";
    summary += apss ? `${apss.value}` : "";

    // Trauma D
    if (traumaSection && window.getComputedStyle(traumaSection).display !== "none") {
      // Neu: name="traumaMILS", name="traumaSchaedel", name="traumaUHG"
      const traumaMILS = document.querySelector('input[name="traumaMILS"]:checked');
      const traumaSchaedel = document.querySelector('input[name="traumaSchaedel"]:checked');
      const traumaUHG = document.querySelector('input[name="traumaUHG"]:checked');
      // Neu: name="traumaImmo", name="immoIndikation", name="nexus"
      const traumaImmo = document.querySelector('input[name="traumaImmo"]:checked');
      const immoIndikation = document.querySelector('input[name="immoIndikation"]:checked');
      const nexus = document.querySelectorAll('input[name="nexus"]:checked');

      summary += traumaMILS ? `, ${traumaMILS.value}, ` : "";
      summary += traumaSchaedel ? `${traumaSchaedel.value}, ` : "";
      summary += traumaUHG ? `${traumaUHG.value}` : "";

      if (traumaImmo && traumaImmo.value === "Ja") {
        summary += "\nPat. immobilisiert, Indikation: ";
        if (immoIndikation && immoIndikation.value === "Verletzungsmuster / Unfallkinematik") {
          summary += `${immoIndikation.value}`;
        } else {
          summary += "NEXUS-Kriterien zutreffend: ";
          nexus.forEach((checkbox, index) => {
            summary += checkbox.value;
            if (index < nexus.length - 1) summary += ", ";
          });
        }
      }

      // weitere Bemerkungen Trauma D (neu: id="traumaDWeitere")
      const traumaDweitere = document.getElementById("traumaDWeitere");
      if (traumaDweitere && traumaDweitere.value.trim().length > 0) {
        summary += `, ${traumaDweitere.value.trim()}`;
      }
    }
  }

  // weitere Bemerkungen D (neu: id="disabilityWeitere")
  const Dweitere = document.getElementById("disabilityWeitere");
  if (Dweitere && Dweitere.value.trim().length > 0) {
    summary += ` // ${Dweitere.value.trim()}`;
  }

  summary += "\n";
  // #endregion

  // #region E - Environment
  // Neu: id="eLeitsymptom", name="lagerung", id="lagerungSonstige",
  //      name="entscheidung", name="waermeerhalt", id="waermeerhaltSonstiges"
  const leitsymptom = document.getElementById("eLeitsymptom")?.value.trim() || "";
  const lagerung = document.querySelector('input[name="lagerung"]:checked');
  const lagerungSonstige = document.getElementById("lagerungSonstige")?.value.trim() || "";
  const entscheidung = document.querySelector('input[name="entscheidung"]:checked');
  const waermeerhalt = document.querySelectorAll('input[name="waermeerhalt"]:checked');
  const waermeerhaltSonstiges = document.getElementById("waermeerhaltSonstiges")?.value.trim() || "";

  summary += `E: Leitsymptom: ${leitsymptom}`;

  const waermeerhaltChecked = Array.from(waermeerhalt).filter((cb) => cb.checked);
  if (waermeerhaltChecked.length > 0) {
    const parts = waermeerhaltChecked.map((cb) => (cb.value === "sonstiges" ? waermeerhaltSonstiges || "" : cb.value)).filter(Boolean);
    if (parts.length > 0) {
      summary += ", Wärmeerhalt: " + parts.join(", ");
    }
  }

  if (lagerung) {
    summary += `, spez. Lagerung: ${lagerung.value}`;
    if (lagerung.value === "Sonstige" && lagerungSonstige !== "") {
      summary += ` ${lagerungSonstige}`;
    }
  }

  summary += "\n\n";
  summary += entscheidung ? `Entscheidung nach Primary Assessment: ${entscheidung.value}` : "";
  summary += "\n\n";
  // #endregion

  // #region SAMPLER
  // Neu: name="samplerUnauffaellig", name="samplerNichtErhebbar"
  const samplerUnauffaellig = document.querySelector('input[name="samplerUnauffaellig"]:checked');
  const samplerNichtErhebbar = document.querySelector('input[name="samplerNichtErhebbar"]:checked');

  // S - Symptome (neu: id="symptome")
  const symptome = document.getElementById("symptome")?.value.trim() || "";
  summary += `S: ${symptome}\n`;

  if (samplerNichtErhebbar) {
    // Neu: name="nichtErhebbarGrund", id="samplerNichtErhebbarSonstige"
    const samplerNichtErhebbarGrund = document.querySelector('input[name="nichtErhebbarGrund"]:checked')?.value;
    const samplerNichtErhebbarSonstige = document.getElementById("samplerNichtErhebbarSonstige")?.value.trim();

    if (samplerNichtErhebbarGrund && samplerNichtErhebbarGrund === "sonstige") {
      summary += `(S)AMPLER nicht erhebbar - ${samplerNichtErhebbarSonstige}\n`;
    } else {
      summary += `(S)AMPLER nicht erhebbar - ${samplerNichtErhebbarGrund}\n`;
    }
  } else if (!samplerUnauffaellig) {
    // #region A - Allergien
    // Neu: name="allergienStatus", id="allergien"
    const allergienStatus = document.querySelector('input[name="allergienStatus"]:checked');
    const allergieText = document.getElementById("allergien")?.value.trim().replace(/\n+/g, ", ") || "";
    if (allergienStatus) {
      if (allergienStatus.value === "Ja") {
        summary += `A: ${allergieText || "keine Angabe"}\n`;
      } else {
        summary += `A: ${allergienStatus.value}\n`;
      }
    }
    // #endregion

    // #region M - Dauermedikation
    // Neu: name="medikationStatus", id="medOutput"
    const medikationStatus = document.querySelector('input[name="medikationStatus"]:checked')?.value || "";
    const medikamenteText = document.querySelector("#medOutput")?.textContent.trim() || "";

    if (medikationStatus) {
      if (medikationStatus === "Ja") {
        if (medikamenteText) {
          summary += `M: ${medikamenteText}\n`;
        }
      } else {
        summary += `M: ${medikationStatus}\n`;
      }
    }
    // #endregion

    // #region P - Patientengeschichte
    // Neu: name="patientenStatus", id="patientengeschichteOutput"
    const patientenStatus = document.querySelector('input[name="patientenStatus"]:checked')?.value || "";
    const patientengeschichteText = document.querySelector("#patientengeschichteOutput")?.textContent.trim() || "";

    if (patientenStatus) {
      if (patientenStatus === "Ja") {
        if (patientengeschichteText) {
          summary += `P: ${patientengeschichteText}\n`;
        }
      } else {
        summary += `P: ${patientenStatus}\n`;
      }
    }
    // #endregion

    // #region L - Letzte
    summary += "L: ";

    // Mahlzeit (neu: name="mahlzeit", id="mahlzeitDetails", name="mahlzeitStunden")
    const mahlzeit = document.querySelector('input[name="mahlzeit"]:checked')?.value;
    const mahlzeitText = document.getElementById("mahlzeitDetails")?.value.trim().replace(/\n+/g, ", ") || "";
    const mahlzeitStunden =
      document.querySelector('input[name="mahlzeitStunden"]')?.value || document.getElementById("mahlzeit-stunden")?.value || "";

    if (mahlzeit) {
      if (mahlzeit === "normale Nahrungsaufnahme") {
        summary += mahlzeit;
      } else if (mahlzeit === "auffällig") {
        summary += `Mahlzeit: ${mahlzeitText}`;
      } else if (mahlzeit === "nicht erhebbar") {
        summary += `Mahlzeit: ${mahlzeit}`;
      }
    }
    if (mahlzeitStunden) summary += `, letzte Mahlzeit vor ${mahlzeitStunden} Stunden`;

    // Flüssigkeit (neu: name="fluessigkeit", id="fluessigkeit-details")
    const fluessigkeit = document.querySelector('input[name="fluessigkeit"]:checked')?.value;
    const fluessigkeitText = document.getElementById("fluessigkeit-details")?.value.trim().replace(/\n+/g, ", ") || "";

    if (fluessigkeit) {
      if (fluessigkeit === "normale Flüssigkeitszufuhr") {
        summary += `, ${fluessigkeit}`;
      } else if (fluessigkeit === "auffällig") {
        summary += `, Flüssigkeit: ${fluessigkeitText}`;
      } else if (fluessigkeit === "nicht erhebbar") {
        summary += `, Flüssigkeit: ${fluessigkeit}`;
      }
    }

    // Stuhl (neu: name="stuhl", name="stuhlQualitaet", name="stuhlSonstigeDetails")
    const stuhl = document.querySelector('input[name="stuhl"]:checked')?.value;
    if (stuhl) {
      summary += ", Stuhl: ";
      if (stuhl === "auffällig") {
        const stuhlQualCheckboxes = document.querySelectorAll('input[name="stuhlQualitaet"]:checked');
        const stuhlQualTextArr = [];

        stuhlQualCheckboxes.forEach((cb) => {
          if (cb.value === "sonstige Auffälligkeit") {
            const sonstText = document.querySelector('textarea[name="stuhlSonstigeDetails"]')?.value.trim().replace(/\n+/g, ", ");
            if (sonstText) stuhlQualTextArr.push(sonstText);
          } else {
            stuhlQualTextArr.push(cb.value);
          }
        });

        if (stuhlQualTextArr.length > 0) summary += stuhlQualTextArr.join(", ");
      } else {
        summary += stuhl;
      }
    }

    // Harn (neu: name="harn", name="harnQualitaet", name="harnSonstigeDetails")
    const harn = document.querySelector('input[name="harn"]:checked')?.value;
    if (harn) {
      summary += ", Harn: ";
      if (harn === "auffällig") {
        const harnQualCheckboxes = document.querySelectorAll('input[name="harnQualitaet"]:checked');
        const harnQualTextArr = [];

        harnQualCheckboxes.forEach((cb) => {
          if (cb.value === "sonstige Auffälligkeit") {
            const sonstText = document.querySelector('textarea[name="harnSonstigeDetails"]')?.value.trim().replace(/\n+/g, ", ");
            if (sonstText) harnQualTextArr.push(sonstText);
          } else {
            harnQualTextArr.push(cb.value);
          }
        });

        if (harnQualTextArr.length > 0) summary += harnQualTextArr.join(", ");
      } else {
        summary += harn;
      }
    }
    // #endregion

    summary += "\n";

    // #region E - Ereignis (neu: name="ereignis")
    const ereignis = document.querySelector('textarea[name="ereignis"]')?.value.trim() || "";
    if (ereignis) {
      summary += `E: ${ereignis}\n`;
    }
    // #endregion

    // #region R - Risikofaktoren (neu: name="risikoStatus", name="risiken", name="risikoSonstige")
    const risikoStatus = document.querySelector('input[name="risikoStatus"]:checked')?.value;
    if (risikoStatus === "Keine") {
      summary += "R: keine Risikofaktoren";
    } else if (risikoStatus === "nicht erhebbar") {
      summary += "R: nicht erhebbar";
    } else if (risikoStatus === "Ja") {
      const risikos = document.querySelectorAll('input[name="risiken"]:checked');
      const risikoTextArr = [];
      const sonstText = document.querySelector('textarea[name="risikoSonstige"]')?.value.trim().replace(/\n+/g, ", ");
      let includeSonstigeText = false;

      risikos.forEach((cb) => {
        if (cb.value === "sonstige") {
          includeSonstigeText = true;
        } else {
          risikoTextArr.push(cb.value);
        }
      });

      if (includeSonstigeText && sonstText) {
        risikoTextArr.push(sonstText);
      }

      summary += "R: " + risikoTextArr.join(", ");
    }
    // #endregion

    summary += "\n";

    // #region Secondary - weitere Bemerkungen (neu: name="secondaryBemerkung")
    const Secweitere = document.querySelector('input[name="secondaryBemerkung"]') || document.querySelector('[name="secondaryBemerkung"]');
    if (Secweitere && Secweitere.value?.trim().length > 0) {
      summary += `Weitere Bemerkungen zu Secondary Assessment: ${Secweitere.value.trim()}`;
      summary += "\n";
    }
    // #endregion

    // #region OPQRST (neu: name="onset/provocation/quality/region/nrs/time")
    const onset = document.querySelector('input[name="onset"]')?.value.trim() || "";
    const provocation = document.querySelector('input[name="provocation"]')?.value.trim() || "";
    const quality = document.querySelector('input[name="quality"]')?.value.trim() || "";
    const region = document.querySelector('input[name="region"]')?.value.trim() || "";
    const scale = document.querySelector('input[name="nrs"]')?.value || "";
    const time = document.querySelector('input[name="time"]')?.value.trim() || "";

    if (onset || provocation || quality || region || scale || time) {
      summary += "\nOPQRST:";
      summary += onset ? `\nO: ${onset} / ` : "";
      summary += provocation ? `P: ${provocation} / ` : "";
      summary += quality ? `Q: ${quality} / ` : "";
      summary += region ? `R: ${region} / ` : "";
      summary += scale ? `S: ${scale}/10 / ` : "";
      summary += time ? `T: ${time}\n` : "";
    }
    // #endregion

    // #region SPLATT (neu: name="splattSymptoms/splattPrevious/splattLocation/splattActivity/splattTime/splattTrauma")
    const splattSection = document.getElementById("splatt-content");
    if (splattSection && window.getComputedStyle(splattSection).display !== "none") {
      summary += "\nSPLATT:\n";

      const splattSymptoms = document.querySelector('input[name="splattSymptoms"]')?.value.trim() || "";
      const splattPrevious = document.querySelector('input[name="splattPrevious"]')?.value.trim() || "";
      const splattLocation = document.querySelector('input[name="splattLocation"]')?.value.trim() || "";
      const splattActivity = document.querySelector('input[name="splattActivity"]')?.value.trim() || "";
      const splattTime = document.querySelector('input[name="splattTime"]')?.value.trim() || "";
      const splattTrauma = document.querySelector('input[name="splattTrauma"]')?.value.trim() || "";

      summary += splattSymptoms ? `S: ${splattSymptoms} / ` : "";
      summary += splattPrevious ? `P: ${splattPrevious} / ` : "";
      summary += splattLocation ? `L: ${splattLocation} / ` : "";
      summary += splattActivity ? `A: ${splattActivity} / ` : "";
      summary += splattTime ? `T: ${splattTime} / ` : "";
      summary += splattTrauma ? `T: ${splattTrauma}\n` : "";
    }
    // #endregion
  }
  // #endregion SAMPLER

  // #region GEMS Diamant
  if (gemsSection && window.getComputedStyle(gemsSection).display !== "none") {
    summary += "\nGEMS Diamant:\n";

    // G – Geriatrischer Patient (neu: name="gAnatomie", name="gMobilitaetshilfe")
    const gAnatomie = document.querySelectorAll('input[name="gAnatomie"]:checked');
    const gHilfsmittel = document.querySelectorAll('input[name="gMobilitaetshilfe"]:checked');
    if (gAnatomie.length > 0) {
      summary += "G – Veränderungen: ";
      gAnatomie.forEach((item, index) => {
        summary += item.value;
        if (index < gAnatomie.length - 1) summary += ", ";
      });
      summary += "\n";
    }
    if (gHilfsmittel.length > 0) {
      summary += "Mobilitätshilfen: ";
      gHilfsmittel.forEach((item, index) => {
        summary += item.value;
        if (index < gHilfsmittel.length - 1) summary += ", ";
      });
      summary += "\n";
    }

    // E – Environmental Assessment (neu: name="ePatientenzustand", "eUmgebung", "eTemperatur", "eBeleuchtung", "eGeruch", id="geruchAndere")
    const ePatient = document.querySelector('input[name="ePatientenzustand"]:checked');
    const eUmgebung = document.querySelector('input[name="eUmgebung"]:checked');
    const eTemp = document.querySelector('input[name="eTemperatur"]:checked');
    const eLicht = document.querySelector('input[name="eBeleuchtung"]:checked');
    const eGeruch = document.querySelector('input[name="eGeruch"]:checked');
    const geruch = document.getElementById("geruchAndere")?.value.trim() || "";

    summary += "E – Environment: ";
    summary += ePatient ? `Patientenzustand: ${ePatient.value}, ` : "";
    summary += eUmgebung ? `Umgebung: ${eUmgebung.value}, ` : "";
    summary += eTemp ? `Temperatur: ${eTemp.value}, ` : "";
    summary += eLicht ? `Beleuchtung: ${eLicht.value}, ` : "";
    summary += eGeruch ? `Geruch: ${eGeruch.value}` : "";
    if (eGeruch && eGeruch.value === "andere" && geruch) {
      summary += `: (${geruch})`;
    }
    summary += "\n";

    // M – Medizinisch (neu: name="mNotfallart", "mPolypharmazie", "mMultimorbiditaet", "mErnaehrungszustand")
    const mArt = document.querySelector('input[name="mNotfallart"]:checked');
    const mPoly = document.querySelector('input[name="mPolypharmazie"]:checked');
    const mMulti = document.querySelector('input[name="mMultimorbiditaet"]:checked');
    const mErnaehrung = document.querySelector('input[name="mErnaehrungszustand"]:checked');

    summary += "M – Medizinische Beurteilung: ";
    summary += mArt ? `Art des Notfalls: ${mArt.value}, ` : "";
    summary += mPoly ? `Polypharmazie: ${mPoly.value}, ` : "";
    summary += mMulti ? `Multimorbidität: ${mMulti.value}, ` : "";
    summary += mErnaehrung ? `Ernährungszustand: ${mErnaehrung.value}` : "";
    summary += "\n";

    // S – Sozial (neu: name="sAngehoerige", "sDokumente", "sIsolation", "sDepression", "sVernachlaessigung")
    summary += "S – Soziales Umfeld: ";
    const sKontakt = document.querySelectorAll('input[name="sAngehoerige"]:checked');
    if (sKontakt.length > 0) {
      sKontakt.forEach((item, index) => {
        summary += item.value;
        if (index < sKontakt.length - 1) summary += ", ";
      });
      summary += ", ";
    }

    const sDokumente = document.querySelectorAll('input[name="sDokumente"]:checked');
    const sIsolation = document.querySelector('input[name="sIsolation"]:checked');
    const sDepression = document.querySelector('input[name="sDepression"]:checked');
    const sVernachlaessigung = document.querySelector('input[name="sVernachlaessigung"]:checked');
    // Note: missbrauch detail field reuses geruchAndere id in new HTML – here we search by context
    const missbrauchSection = document.getElementById("missbrauch-section");
    const missbrauch = missbrauchSection?.querySelector("input[type='text']")?.value.trim() || "";

    summary += sIsolation ? `${sIsolation.value}, ` : "";
    summary += sDepression ? `Hinweise auf Depression/Suizidalität: ${sDepression.value}, ` : "";
    summary += sVernachlaessigung ? `Hinweise auf Missbrauch/Vernachlässigung: ${sVernachlaessigung.value}` : "";
    if (sVernachlaessigung && sVernachlaessigung.value === "Hinweise auf Missbrauch" && missbrauch) {
      summary += `: (${missbrauch})`;
    }
    summary += "\n";

    if (sDokumente.length > 0) {
      summary += "vorhandene Dokumente: ";
      sDokumente.forEach((item, index) => {
        summary += item.value;
        if (index < sDokumente.length - 1) summary += ", ";
      });
      summary += "\n";
    }

    summary += "\n";
  }
  // #endregion GEMS

  // #region Transport zum Fahrzeug (name="TranspRM" bleibt gleich)
  const transport = document.querySelector('input[name="TranspRM"]:checked');
  const transportSonstige = document.getElementById("transportSonstige")?.value.trim();
  if (transport) {
    summary += "\nTransport zum Fahrzeug: ";
    if (transport.value === "Sonstiges") {
      summary += `${transportSonstige ? transportSonstige : ""}\n`;
    } else {
      summary += `${transport.value}\n`;
    }
  }
  // #endregion

  // #region Transport in Klinik (namen gleich geblieben)
  if (transport && transport.value !== "kein Transport") {
    const transportKlinik = document.querySelector('input[name="TranspKlinik"]:checked');
    const transportSoSi = document.querySelector('input[name="TranspSoSi"]:checked');
    const avisoCheckbox = document.querySelector('input[name="Aviso"]:checked');
    const avisoText = document.getElementById("aviso")?.value.trim();
    const naBegleitung = document.querySelector('input[name="naBegleitung"]:checked');

    summary += `Transport in Klinik: ${transportKlinik ? transportKlinik.value : ""}`;
    summary += `, ${transportSoSi ? transportSoSi.value : ""}`;

    if (avisoCheckbox) {
      summary += avisoText ? `, Aviso: ${avisoText}` : `, Aviso`;
    }
    if (naBegleitung) {
      summary += `, Transportbegleitung durch NA`;
    }
    summary += `\n`;
  }
  // #endregion

  // #region Notfallkompetenzen
  // Neu: id="notfallkompetenzNkv", "notfallkompetenzNki", "notfallkompetenzNiv"
  const nkvCheckbox = document.getElementById("notfallkompetenzNkv");
  const nkiCheckbox = document.getElementById("notfallkompetenzNki");
  const nivCheckbox = document.getElementById("notfallkompetenzNiv");

  if (nkvCheckbox && nkvCheckbox.checked) {
    // Neu: name="nkvErfolgreich", id="nkvPunktionsversuche", name="nkvVenflongröße",
    //      name="nkvPunktionsstelle", id="punktionsstelleSonstiges", name="nkvSpülung"
    const nkvErfolgreich = document.querySelector('input[name="nkvErfolgreich"]:checked');
    const nkvVersuche = document.getElementById("nkvPunktionsversuche")?.value;
    const nkvGrößeElements = document.querySelectorAll('input[name="nkvVenflongröße"]:checked');
    const nkvGrößeValues = Array.from(nkvGrößeElements).map((cb) => cb.value);

    const punktionsstelleElements = document.querySelectorAll('input[name="nkvPunktionsstelle"]:checked');
    const punktionsstelleValues = Array.from(punktionsstelleElements).map((cb) => {
      if (cb.value === "sonstige") {
        const sonstigeText = document.getElementById("punktionsstelleSonstiges")?.value.trim();
        return sonstigeText ? sonstigeText : "";
      }
      return cb.value;
    });

    const nkvSpülung = document.querySelector('input[name="nkvSpülung"]:checked');

    summary += `\nNotfallkompetenz NKV:\n`;
    summary += nkvErfolgreich ? `Erfolgreich: ${nkvErfolgreich.value}, ` : "";
    summary += nkvVersuche ? `Punktionsversuche: ${nkvVersuche}, ` : "";
    summary += nkvGrößeValues.length > 0 ? `${nkvGrößeValues.join("/")}, ` : "";
    summary += punktionsstelleValues.length > 0 ? `${punktionsstelleValues.join("/")}, ` : "";
    summary += nkvSpülung ? `${nkvSpülung.value}\n` : "";

    // NKV - weitere Bemerkungen (neu: id="nkvWeitereBemerkungen")
    const NKVweitere = document.getElementById("nkvWeitereBemerkungen");
    if (NKVweitere && NKVweitere.value.trim().length > 0) {
      summary += ` // ${NKVweitere.value.trim()}`;
      summary += "\n";
    }
  }

  if (nkiCheckbox && nkiCheckbox.checked) {
    // Neu: name="nkiErfolgreich", id="nkiInbutbationsversuche", id="nkiUhrzeit",
    //      name="nkiLaryngoskopie", name="nkiCormack", name="nkiTubusgröße",
    //      name="nkiSpatelgröße", id="nkiZahnreihe", id="nkiEtCo2",
    //      name="nkiPulmo", name="nkiEpigastrium",
    //      id="nkiTubusfixierung", id="nkiGänsegurgel", id="nkiBakterienfilter", id="nkiZahnstatus"
    const nkiErfolgreich = document.querySelector('input[name="nkiErfolgreich"]:checked')?.value;
    const nkiVersuche = document.getElementById("nkiInbutbationsversuche")?.value;
    const nkiUhrzeit = document.getElementById("nkiUhrzeit")?.value;
    const laryngoskopie = document.querySelector('input[name="nkiLaryngoskopie"]:checked')?.value;
    const cormackLehane = document.querySelector('input[name="nkiCormack"]:checked')?.value;
    const tubusgröße = document.querySelector('input[name="nkiTubusgröße"]:checked')?.value;
    const spatelgröße = document.querySelector('input[name="nkiSpatelgröße"]:checked')?.value;
    const zahnreihe = document.getElementById("nkiZahnreihe")?.value;
    const etCO2 = document.getElementById("nkiEtCo2")?.value;
    const lagekontrollePulmo = document.querySelector('input[name="nkiPulmo"]:checked')?.value;
    const lagekontrolleEpigastrium = document.querySelector('input[name="nkiEpigastrium"]:checked')?.value;
    const tubusFixierung = document.getElementById("nkiTubusfixierung");
    const gaensegurgel = document.getElementById("nkiGänsegurgel");
    const bakterienfilter = document.getElementById("nkiBakterienfilter");
    const zahnstatus = document.getElementById("nkiZahnstatus");
    const ETIweitere = document.getElementById("nkiWeitereBemerkungen");

    summary += `\nNotfallkompetenz NKI:\n`;
    if (nkiErfolgreich === "Ja") {
      summary += nkiVersuche ? `NKI beim ${nkiVersuche}. Versuch auf Sicht erfolgreich, ` : "";
    } else if (nkiErfolgreich === "Nein") {
      summary += "Anwendung NKI nicht erfolgreich. ";
    }
    summary += laryngoskopie ? `${laryngoskopie}, ` : "";
    summary += cormackLehane ? `${cormackLehane}, ` : "";
    summary += spatelgröße ? `${spatelgröße}, ` : "";
    summary += tubusgröße ? `e.t. Tubus ${tubusgröße}, ` : "";
    summary += zahnreihe ? `Zahnreihe ${zahnreihe}, ` : "";
    summary += nkiUhrzeit ? `${nkiUhrzeit} Uhr, ` : "";
    summary += etCO2 ? `init. etCO2 ${etCO2}mmHg, ` : "";
    summary += lagekontrolleEpigastrium ? `${lagekontrolleEpigastrium}, ` : "";
    summary += lagekontrollePulmo ? `${lagekontrollePulmo}` : "";
    summary += tubusFixierung && tubusFixierung.checked ? `, ${tubusFixierung.value}` : "";
    summary += gaensegurgel && gaensegurgel.checked ? `, ${gaensegurgel.value}` : "";
    summary += bakterienfilter && bakterienfilter.checked ? `, ${bakterienfilter.value}` : "";
    summary += zahnstatus && zahnstatus.checked ? `, ${zahnstatus.value}` : "";
    if (ETIweitere && ETIweitere.value.trim().length > 0) {
      summary += ` // ${ETIweitere.value.trim()}`;
      summary += "\n";
    }
  }

  if (nivCheckbox && nivCheckbox.checked) {
    // Neu: name="nivMaskengröße", id="peep", id="asb", id="pMax", id="nivWeitereBemerkungen"
    const maskengröße = document.querySelector('input[name="nivMaskengröße"]:checked');
    const peep = document.getElementById("peep")?.value;
    const asb = document.getElementById("asb")?.value;
    const pMax = document.getElementById("pMax")?.value;

    summary += `\nNIV durch NKI laut SOP BRW und Arzneimittelliste nach Indikation, Aufklärung und Ausschluss aller Kontraindikationen.\n`;
    summary += maskengröße ? `NIV-Maskengröße: ${maskengröße.value}, ` : "";
    summary += peep ? `Beatmungsparameter: PEEP: ${peep}, ` : "";
    summary += asb ? `ΔASB: ${asb}, ` : "";
    summary += pMax ? `pMax: ${pMax}\n` : "";

    const NIVweitere = document.getElementById("nivWeitereBemerkungen");
    if (NIVweitere && NIVweitere.value.trim().length > 0) {
      summary += ` // ${NIVweitere.value.trim()}`;
      summary += "\n";
    }
  }
  // #endregion

  // #region Medikamente verabreicht
  // Neu: alle Medikamente unter name="medVerabreicht", NA-Med unter id="medGabeNA"
  const medikamentengabeContent = document.getElementById("medikamentengabe-content");

  if (medikamentengabeContent && window.getComputedStyle(medikamentengabeContent).display !== "none") {
    const verabreichteMeds = document.querySelectorAll(
      '#azml1-section input[name="medVerabreicht"]:checked, #azml2-section input[name="medVerabreicht"]:checked'
    );

    const verabreichteMedTeleNa = document.querySelectorAll('#teleNA-section input[name="medVerabreicht"]:checked');

    const medGabeNA = document.getElementById("medGabeNA");
    const weitereMedText = medGabeNA ? medGabeNA.value.trim() : "";

    if (verabreichteMeds.length > 0 && weitereMedText.length > 0) {
      summary +=
        "\nMedikamentengabe laut SOP BRW und Arzneimittelliste nach Indikation, Aufklärung, Einverständnis und Ausschluss aller Kontraindikationen. Verabreichte Medikamente:\n";
      verabreichteMeds.forEach((cb) => {
        const details = document.querySelector(`#selectedMedsList [data-med="${cb.value}"] input[type="text"]`)?.value.trim();
        summary += `- ${cb.value}`;
        summary += details ? ` (${details})\n` : "\n";
      });
      summary += `\nMedikamentengabe durch NA:\n- ${weitereMedText.replace(/(?:\s+,\s*|,\s+|\r?\n)+/g, "\n- ")}`;
      summary += "\n";
    } else if (verabreichteMeds.length > 0) {
      summary +=
        "\nMedikamentengabe laut SOP BRW und Arzneimittelliste nach Indikation, Aufklärung, Einverständnis und Ausschluss aller Kontraindikationen. Verabreichte Medikamente:\n";
      verabreichteMeds.forEach((cb) => {
        const details = document.querySelector(`#selectedMedsList [data-med="${cb.value}"] input[type="text"]`)?.value.trim();
        summary += `- ${cb.value}`;
        summary += details ? ` (${details})\n` : "\n";
      });
    } else if (weitereMedText.length > 0) {
      summary += `\nMedikamentengabe durch NA:\n- ${weitereMedText.replace(/(?:\s+,\s*|,\s+|\r?\n)+/g, "\n- ")}`;
      summary += "\n";
    }

    if (verabreichteMedTeleNa.length > 0) {
      summary += "\nMedikamentengabe nach Freigabe durch Tele-NA:\n";
      verabreichteMedTeleNa.forEach((cb) => {
        const details = document.querySelector(`#selectedMedsList [data-med="${cb.value}"] input[type="text"]`)?.value.trim();
        summary += `- ${cb.value}`;
        summary += details ? ` (${details})\n` : "\n";
      });
    }
  }
  // #endregion

  // #region Analgesie (IDs bleiben gleich)
  const analgesieSection = document.getElementById("analgesie-section");
  const körpergewicht = document.getElementById("analgesieKGew")?.value.trim();
  if (analgesieSection && analgesieSection.classList.contains("active")) {
    summary += "\nAnalgesie:\n";
    summary += `geschätztes Körpergewicht: ${körpergewicht}kg\n`;

    function getAnalgesieBlock(titel, suffix) {
      const fields = [
        { label: "NRS", id: `analgesieNRS${suffix}` },
        { label: "GCS", id: `analgesieGCS${suffix}` },
        { label: "SpO2", id: `analgesieSpO2${suffix}` },
        { label: "HF", id: `analgesieHF${suffix}` },
        { label: "RR", id: `analgesieRR${suffix}` },
      ];

      let values = [];
      fields.forEach((f) => {
        const value = document.getElementById(f.id)?.value?.trim();
        if (value) values.push(`${f.label}: ${value}`);
      });

      const inhalationsField = document.getElementById(`analgesieInhalationen${suffix}`);
      if (inhalationsField && window.getComputedStyle(inhalationsField).display !== "none") {
        const inhalationen = inhalationsField.value.trim();
        if (inhalationen) values.push(`Inhalationen: ${inhalationen}`);
      }

      return `\n${titel}: ${values.join(", ")}`;
    }

    summary += getAnalgesieBlock("Erstbefund", "Erstbefund");
    summary += getAnalgesieBlock("5 Minuten nach Applikation", "5min");
    summary += getAnalgesieBlock("Endbefund", "Endbefund");
    summary += "\n";
  }
  // #endregion

  // #region Diagnostik
  // Neu: id="ekg" (textarea), id="bga", id="ibd", id="ultraschall", id="weitereDiagnostik"
  // NEWS-2 Score: id="news2Aviso" (Ausgabe-Element)
  const diagnostikContent = document.getElementById("diagnostik-content");

  if (diagnostikContent && window.getComputedStyle(diagnostikContent).display !== "none") {
    const ekg = document.getElementById("cbEkg");
    const bga = document.getElementById("cbBga");
    const ibd = document.getElementById("cbIbd");
    const ultraschall = document.getElementById("cbUltraschall");
    const weitereDiagnostik = document.getElementById("cbWeitere");

    const ekgValue = document.getElementById("ekg")?.value.trim();
    const bgaValue = document.getElementById("bga")?.value.trim();
    const ibdValue = document.getElementById("ibd")?.value.trim();
    const ultraschallValue = document.getElementById("ultraschall")?.value.trim();
    const weitereDiagnostikValue = document.getElementById("weitereDiagnostik")?.value.trim();

    // NEWS-2 Score aus dem Ausgabe-Span (neu: id="news2Aviso" statt "news2Score1")
    const news2Element = document.getElementById("news2Aviso");
    const news2 = news2Element ? news2Element.innerText?.trim() : "";
    // Alternativ: aus news-2-content falls sichtbar
    const news2Content = document.getElementById("news-2-content");
    const news2Visible = news2Content && window.getComputedStyle(news2Content).display !== "none";

    if (ekg || (news2Visible && news2 !== "") || bga || ibd || ultraschall || weitereDiagnostik) {
      summary += "\nErweiterte Diagnostik:\n";

      if (ekgValue) summary += `EKG: ${ekgValue}\n`;
      if (news2Visible && news2 !== "") summary += `NEWS-2 Score:${news2}\n`;
      if (bgaValue) summary += `BGA: ${bgaValue}\n`;
      if (ibdValue) summary += `IBD: ${ibdValue}\n`;
      if (ultraschallValue) summary += `Ultraschall: ${ultraschallValue}\n`;
      if (weitereDiagnostikValue) summary += `${weitereDiagnostikValue}\n`;
    }
  }
  // #endregion

  // Ausgabe
  let textSummary = summary.replace(/\n/g, "<br>").replace(/\n\n/g, "<br><br>");

  document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));

  document.querySelectorAll(".formContainer").forEach((c) => c.classList.remove("active"));

  document.querySelectorAll(".navHeader").forEach((c) => c.classList.remove("active"));

  document.getElementById("summary-content").classList.add("active");
  document.getElementById("ausgabeSummary").innerHTML = textSummary || "Keine Daten ausgewählt.";
  addNavHeader("Dokumentation");
  document.getElementById("dokumentationHeader").classList.add("active");

  // ".active" Steuerung für Nav Element
  const summaryNav = document.getElementById("dokumentationHeader");
  if (summaryNav && !summaryNav._listenerAdded) {
    summaryNav.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
      document.querySelectorAll(".formContainer").forEach((c) => c.classList.remove("active"));
      document.querySelectorAll(".navHeader").forEach((c) => c.classList.remove("active"));
      summaryNav.classList.add("active");
      document.getElementById("summary-content").classList.add("active");
    });
    summaryNav._listenerAdded = true; // verhindert doppelte Registrierung bei mehrfachem Aufruf
  }

  // document.getElementById("buttonBox").classList.add("active");
  // document.getElementById("buttonBox").hidden = false;

  // Zeichenanzahl prüfen
  const maxZeichen = 2008;
  const zeichenAnzahl = textSummary.length;
  if (zeichenAnzahl > maxZeichen) {
    alert(
      `⚠️ Achtung: Der generierte Text enthält ${zeichenAnzahl} Zeichen und überschreitet das Limit von ${maxZeichen} Zeichen für das Anamnese-Freitextfeld.\n\nBitte überprüfen Sie den Text manuell und ergänzen Sie fehlende Inhalte ggf. in einem alternativen Freitextfeld, z.B. Bemerkungen oder Zusatzbefund.`
    );
  }

  copyToClipboard(textSummary);
}
