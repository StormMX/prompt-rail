var objectiveInput = document.getElementById('objective-input');
var objectiveCount = document.getElementById('objective-count');
var extraInput = document.getElementById('extra-input');
var extraCount = document.getElementById('extra-count');
var textOutput = document.getElementById('output');

var responseLabels = {
  "text-long": "Testo esteso",
  "text-short": "Riassunto",
  "email": "Email formattata",
  "bullet": "Elenco puntato",
  "code": "Blocco di codice",
  "table": "Tabella organizzata",
  "file": "File allegato"
};

var styleLabels = {
  "friendly": "Amichevole",
  "formal": "Formale",
  "technical": "Tecnico"
};

// Gestione operezioni al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  let count = objectiveInput.value.length;
  objectiveCount.textContent = `${count} / 4000 caratteri`;
  handleThemeToggle();
});


// Gestione conteggio caratteri Obiettivo
objectiveInput.addEventListener('input', () => {
  let count = objectiveInput.value.length;
  objectiveCount.textContent = `${count} / 4000 caratteri`;
});


function generate() {
  // Inizializzazione valore campi
  let objectiveValue = objectiveInput.value.trim();
  let roleIaValue = (document.getElementById('role-ai-input')).value.trim();
  let roleUserValue = (document.getElementById('role-user-input')).value.trim();
  let responsesValue = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]')).filter(option => option.checked).map(option => option.value);
  let styleValue = (document.querySelector('.radio-group input[name="tone"]:checked')).value;
  let styleLabel = styleLabels[styleValue];
  let extraValue = extraInput.value.trim();
  let formatterValue = (document.getElementById('format-select')).value;

  let prompt = "";
  let headerPrompt = "Ciao Chat, ho una domanda per te: \n\n";

  // Gestione delle casistiche di formattazione
  switch (formatterValue) {
    case "markdown":
      prompt += objectiveValue ? `### Obiettivo\n\n${objectiveValue}\n\n` : "";
      prompt += roleIaValue ? `### Ruolo IA\n\n${roleIaValue}\n\n` : "";
      prompt += roleUserValue ? `### Tuo Ruolo\n\n${roleUserValue}\n\n` : "";
      if (responsesValue.length > 0) {
        prompt += `### Formato Risposta\n\n`;
        for (let item of responsesValue) {
          prompt += `- ${responseLabels[item]}\n`;
        }
        prompt += `\n`;
      }
      prompt += styleValue ? `### Stile\n\n${styleLabel}\n\n` : "";
      prompt += extraValue ? `### Extra\n\n${extraValue}\n\n` : "";
      break;

    case "json":
      let jsonObject = {};
      if (objectiveValue) jsonObject.obiettivo = objectiveValue;
      if (roleIaValue) jsonObject.ruoloIA = roleIaValue;
      if (roleUserValue) jsonObject.ruoloUtente = roleUserValue;
      if (responsesValue.length > 0) jsonObject.formatoRisposta = responsesValue.map(val => responseLabels[val] || val);
      if (styleValue) jsonObject.stile = styleLabel;
      if (extraValue) jsonObject.extra = extraValue;
      prompt = JSON.stringify(jsonObject, null, 2);
      break;

    case "xml":
      prompt += `<prompt>\n`;
      prompt += objectiveValue ? `\t<obiettivo>\n\t\t${objectiveValue}\n\t</obiettivo>\n` : "";
      prompt += roleIaValue ? `\t<ruoloIA>\n\t\t${roleIaValue}\n\t</ruoloIA>\n` : "";
      prompt += roleUserValue ? `\t<ruoloUtente>\n\t\t${roleUserValue}\n\t</ruoloUtente>\n` : "";
      if (responsesValue.length > 0) {
        prompt += `\t<formatoRisposta>\n`;
        for (let item of responsesValue) {
          prompt += `\t\t<formato>${responseLabels[item]}</formato>\n`;
        }
        prompt += `\t</formatoRisposta>\n`;
      }
      prompt += styleValue ? `\t<stile>\n\t\t${styleLabel}\n\t</stile>\n` : "";
      prompt += extraValue ? `\t<extra>\n\t\t${extraValue}\n\t</extra>\n` : "";
      prompt += `</prompt>`;
      break;

    default:
      prompt += objectiveValue ? `Obiettivo:\n${objectiveValue}\n\n` : "";
      prompt += roleIaValue ? `Ruolo IA:\n${roleIaValue}\n\n` : "";
      prompt += roleUserValue ? `Ruolo Utente:\n${roleUserValue}\n\n` : "";
      if (responsesValue.length > 0) {
        prompt += `Formato della risposta:\n`;
        for (let item of responsesValue) {
          prompt += `- ${responseLabels[item]}\n`;
        }
        prompt += `\n`;
      }
      prompt += styleValue ? `Stile:\n${styleLabel}\n\n` : "";
      prompt += extraValue ? `Extra:\n${extraValue}\n\n` : "";
  }

  // Scrittura nella Textarea di output
  textOutput.value = headerPrompt + prompt;
}


function copy() {
  const textArea = document.getElementById('output');
  navigator.clipboard.writeText(textArea.value);
}



function handleThemeToggle() {
  // Controlla se esiste una preferenza di tema salvata
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Aggiungi il toggle del tema all'header
  const headerIcons = document.querySelector('.header-icons');
  const themeToggle = document.createElement('a');
  themeToggle.href = '#';
  themeToggle.className = 'theme-toggle';
  themeToggle.textContent = savedTheme === 'light' ? '🌙 Dark' : '☀️ Light';
  headerIcons.appendChild(themeToggle);

  // Gestisci il toggle del tema
  themeToggle.addEventListener('click', function (e) {
    e.preventDefault();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Aggiorna il testo del pulsante
    themeToggle.textContent = newTheme === 'light' ? '🌙 Dark' : '☀️ Light';
  });
}