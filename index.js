const STORAGE_KEY = "user-entries";

const form   = document.getElementById("registrationForm");
const tbody  = document.getElementById("userTableBody");
const dobInp = document.getElementById("dob");


const today = new Date("2025-06-19T00:00:00");      

const maxDob = new Date(                         // youngest allowed (18 yrs)
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
);
const minDob = new Date(                         // oldest allowed (55 yrs)
  today.getFullYear() - 55,
  today.getMonth(),
  today.getDate()
);

dobInp.max = maxDob.toISOString().split("T")[0]; // 2007‑06‑19
dobInp.min = minDob.toISOString().split("T")[0]; // 1970‑06‑19

const calcAge = (d) => {
  let age = today.getFullYear() - d.getFullYear();
  const m  = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
};
function validateDob() {
  if (!dobInp.value) { dobInp.setCustomValidity(""); return; }
  const age = calcAge(new Date(dobInp.value));
  dobInp.setCustomValidity(age < 18 || age > 55
    ? "Age must be between 18 and 55 years."
    : "");
}
dobInp.addEventListener("input", validateDob);

const loadEntries = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveEntries = (entries) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));


function displayEntries() {
  const entries = loadEntries();
  tbody.innerHTML = "";
  entries.forEach(e => {
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


form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  validateDob();                    // ensure custom check fires
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


displayEntries();
