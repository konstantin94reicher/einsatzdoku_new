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
  console.log(`toggleMeasures aufgerufen für: ${sectionId}, Status: ${show}`);
  const section = document.getElementById(sectionId);
  if (section) {
    if (show) {
      section.style.display = "flex";
      section.style.width = "100%";
      section.style.gap = "5px"; 
    } else {
      section.style.display = "none";
    }
  } else {
    console.warn(`Element mit ID "${sectionId}" nicht gefunden.`);
  }
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
    secondary: ["SAMPLER", "OPQRST"],
    weitereDetails: ["Transport", "Notkompetenzen", "Diagnostik"],
  },

  pädiatrisch: {
    sssGi: ["SSS", "PBD"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMPLER", "OPQRST"],
    weitereDetails: ["Transport", "Notkompetenzen", "Diagnostik"],
  },

  geriatrisch: {
    sssGi: ["SSS", "GI", "GEMS"],
    primary: ["A", "B", "C", "D", "E"],
    secondary: ["SAMPLER", "OPQRST"],
    weitereDetails: ["Transport", "Notkompetenzen", "Diagnostik"],
  },
};

function toggleNavbar() {
  const einsatztyp = getEinsatztypen();

  let config = navConfig.default;

  if (einsatztyp.pädiatrisch) {
    config = navConfig.pädiatrisch;
  } else if (einsatztyp.geriatrisch) {
    config = navConfig.geriatrisch;
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
