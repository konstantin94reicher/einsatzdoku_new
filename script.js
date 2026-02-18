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
          section.style.display = "block";
          section.style.width = "100%";
      } else {
          section.style.display = "none";
      }
  } else {
      console.warn(`Element mit ID "${sectionId}" nicht gefunden.`);
  }
}