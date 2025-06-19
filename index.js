/* ====== CONSTANTS & ELEMENTS ====== */
const STORAGE_KEY = "user-entries";

const form = document.getElementById("registrationForm");
const tbody = document.getElementById("userTableBody");
const dobInput = document.getElementById("dob");

/* ====== DATE-OF-BIRTH LIMITS (18 – 55 years) ====== */
const today = new Date();

/* Convert to YYYY-MM-DD (local time, not UTC) */
const formatDateToInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Min = 55 years ago, Max = 18 years ago
const minDob = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());
const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

dobInput.min = formatDateToInputValue(minDob); // "1970-06-19" if today is 2025-06-19
dobInput.max = formatDateToInputValue(maxDob); // "2007-06-19" if today is 2025-06-19

/* Age calculator */
const calculateAge = (dobDate) => {
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
};

/* Custom validation on DOB */
function validateDobField() {
  const dobDate = dobInput.valueAsDate;
  if (!dobDate) {
    dobInput.setCustomValidity("");
    return;
  }
  const age = calculateAge(dobDate);
  if (age < 18 || age > 55) {
    dobInput.setCustomValidity("Age must be between 18 and 55 years.");
  } else {
    dobInput.setCustomValidity("");
  }
}
dobInput.addEventListener("input", validateDobField);

/* ====== LOCAL‑STORAGE HELPERS ====== */
const loadEntries = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveEntries = (entries) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

/* ====== RENDER TABLE ====== */
function displayEntries() {
  const entries = loadEntries();
  tbody.innerHTML = ""; // clear existing table rows

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
form.addEventListener("submit", (event) => {
  event.preventDefault();

  validateDobField(); // validate DOB before checking form

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const newEntry = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    dob: dobInput.value,
    acceptedTerms: document.getElementById("acceptTerms").checked,
  };

  const entries = loadEntries();
  entries.push(newEntry);
  saveEntries(entries);
  displayEntries();
  form.reset();
});

/* ====== INITIAL RENDER ====== */
displayEntries();
