/* ====== CONSTANTS & ELEMENTS ====== */
const STORAGE_KEY = "user-entries";

const form   = document.getElementById("registrationForm");
const tbody  = document.getElementById("userTableBody");
const dobInp = document.getElementById("dob");

/* ------------------------------------------------------------------
   FIXED DATE WINDOW
   • MIN =  9 Nov 1967
   • MAX =  9 Nov 2004
------------------------------------------------------------------ */
const MIN_DOB_STR = "1967-11-09";
const MAX_DOB_STR = "2004-11-09";

dobInp.min = MIN_DOB_STR;
dobInp.max = MAX_DOB_STR;

/* Helper: convert input value to Date safely */
const parseInputDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* Custom validation for DOB */
function validateDob() {
  if (!dobInp.value) { dobInp.setCustomValidity(""); return; }

  const dobDate = parseInputDate(dobInp.value);
  const minDate = parseInputDate(MIN_DOB_STR);
  const maxDate = parseInputDate(MAX_DOB_STR);

  const inRange = dobDate >= minDate && dobDate <= maxDate;

  dobInp.setCustomValidity(
    inRange
      ? ""
      : `Birth‑date must be between ${MIN_DOB_STR} and ${MAX_DOB_STR}.`
  );
}
dobInp.addEventListener("input", validateDob);

/* ====== LOCAL‑STORAGE HELPERS ====== */
const loadEntries = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveEntries = (entries) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

/* ====== RENDER TABLE ====== */
function displayEntries() {
  const entries = loadEntries();
  tbody.innerHTML = "";
  entries.forEach((e) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    row.innerHTML = `
      <td class="px-6 py-3">${e.name}</td>
      <td class="px-6 py-3">${e.email}</td>
      <td class="px-6 py-3">${e.password}</td>
      <td class="px-6 py-3">${e.dob}</td>
      <td class="px-6 py-3">${e.acceptedTerms}</td>`;
    tbody.appendChild(row);
  });
}

/* ====== FORM SUBMIT ====== */
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  validateDob();                       // ensure DOB is re‑checked
  if (!form.checkValidity()) return form.reportValidity();

  const entry = {
    name:          document.getElementById("name").value.trim(),
    email:         document.getElementById("email").value.trim(),
    password:      document.getElementById("password").value,
    dob:           dobInp.value,
    acceptedTerms: document.getElementById("acceptTerms").checked,
  };

  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  displayEntries();
  form.reset();
});

/* ====== INITIAL RENDER ====== */
displayEntries();
