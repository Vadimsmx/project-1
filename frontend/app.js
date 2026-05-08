// Масив для збереження даних
const resources = [];

document.addEventListener("DOMContentLoaded", () => {
    
    const resourceForm = document.getElementById("resourceForm");
    if (resourceForm) {
        resourceForm.addEventListener("submit", handleFormSubmit);
    }

    
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetForm);
    }

    
    const sortBtn = document.getElementById("sortUrl");
    if (sortBtn) {
        sortBtn.addEventListener("click", sortResourcesByUrl);
    }

     const sortBtn = document.getElementById("sortNaz");
    if (sortBtn) {
        sortBtn.addEventListener("click", sortResourcesByNaz);
    }
});

function handleFormSubmit(event) {
    event.preventDefault();

    const dto = {
        title: document.getElementById("titleInput").value.trim(),
        url: document.getElementById("urlInput").value.trim(),
        type: document.getElementById("typeSelect").value,
        description: document.getElementById("descInput").value.trim(),
        author: document.getElementById("authorInput").value.trim()
    };

    if (!validate(dto)) return;

    resources.push(dto);
    renderTable();
    resetForm();
}

function validate(dto) {
    clearErrors();
    let isValid = true;

    if (dto.title === "") {
        showError("titleInput", "titleError", "Введіть назву.");
        isValid = false;
    }
    if (dto.url === "") {
        showError("urlInput", "urlError", "Введіть URL.");
        isValid = false;
    }
    if (dto.type === "") {
        showError("typeSelect", "typeError", "Оберіть тип.");
        isValid = false;
    }
    if (dto.author === "") {
        showError("authorInput", "authorError", "Вкажіть автора.");
        isValid = false;
    }

    return isValid;
}

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).innerHTML = message;
}

function clearErrors() {
    const inputs = document.querySelectorAll(".invalid");
    inputs.forEach(input => input.classList.remove("invalid"));
    const errors = document.querySelectorAll(".error-text");
    errors.forEach(error => error.innerHTML = "");
}

function resetForm() {
    document.getElementById("resourceForm").reset();
    clearErrors();
}

function renderTable() {
    const tbody = document.getElementById("itemsTableBody");
    if (!tbody) return;

    tbody.innerHTML = resources.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.title}</strong><br><small>${item.description}</small></td>
            <td>${item.url}</td>
            <td>${item.type}</td>
            <td>${item.author}</td>
        </tr>
    `).join("");
}

function sortResourcesByUrl() {
    if (resources.length < 2) return; 

    resources.sort((a, b) => {
        const urlA = a.url.toLowerCase();
        const urlB = b.url.toLowerCase();

        if (urlA < urlB) return -1;
        if (urlA > urlB) return 1;
    });
}

function sortResourcesByNaz() {
    if (resources.length < 2) return; 

    resources.sort((a, b) => {
        const urlA = a.naz.toLowerCase();
        const urlB = b.naz.toLowerCase();

        if (urlA < urlB) return -1;
        if (urlA > urlB) return 1;
        return 0;
    });

    renderTable(); 
}