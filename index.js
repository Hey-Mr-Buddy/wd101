      const STORAGE_KEY = "user-entries";

      const form = document.getElementById("registrationForm");
      const tbody = document.getElementById("userTableBody");
      const dobInput = document.getElementById("dob");

      /* ───── Calculate date limits: 18–55 years from today ───── */
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate());
      dobInput.max = maxDate.toISOString().split("T")[0];
      dobInput.min = minDate.toISOString().split("T")[0];

      /* ───── Custom DOB validity message ───── */
      dobInput.addEventListener("input", () => {
        if (!dobInput.value) {
          dobInput.setCustomValidity("");
          return;
        }
        const date = new Date(dobInput.value);
        if (date < minDate || date > maxDate) {
          dobInput.setCustomValidity("Age must be between 18 and 55 years.");
        } else {
          dobInput.setCustomValidity("");
        }
      });

      /* ───── Local‑storage helpers ───── */
      const loadEntries = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const saveEntries = (entries) => localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      /* ───── Render table ───── */
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

      /* ───── Form submit ───── */
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        // If any field invalid, show native tooltips & stop
        if (!form.checkValidity()) {
          form.reportValidity(); // Triggers browser pop‑ups like the screenshot
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

      /* ───── Initial table render ───── */
      displayEntries();
