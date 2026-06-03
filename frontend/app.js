const API_BASE_URL = "http://localhost:3000/api/resources";
let resources = [];

document.addEventListener("DOMContentLoaded", () => {
    
    const resourceForm = document.getElementById("resourceForm");
    if (resourceForm) {
        resourceForm.addEventListener("submit", handleFormSubmit);
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", resetForm);
    }

    const sortUrlBtn = document.getElementById("sortUrl");
    if (sortUrlBtn) {
        sortUrlBtn.addEventListener("click", sortResourcesByUrl);
    }

    const sortNazBtn = document.getElementById("sortNaz");
    if (sortNazBtn) {
        sortNazBtn.addEventListener("click", sortResourcesByNaz);
    }

   
    loadResources();
});

function setListStatus(status, message = "") {
    const statusDiv = document.getElementById("listStatus");
    if (!statusDiv) return;

    if (status === "loading") {
        statusDiv.innerHTML = "⏳ Завантаження даних...";
        statusDiv.style.color = "#555";
    } else if (status === "empty") {
        statusDiv.innerHTML = "📭 Поки що немає ресурсів.";
        statusDiv.style.color = "#856404";
    } else if (status === "error") {
        statusDiv.innerHTML = `❌ Помилка: ${message}`;
        statusDiv.style.color = "red";
    } else {
        statusDiv.innerHTML = "";
    }
}

async function loadResources() {
    setListStatus("loading");
    document.getElementById("itemsTableBody").innerHTML = "";

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`Помилка сервера: ${response.status}`);
        
        const data = await response.json();
        resources = data.items || [];

        if (resources.length === 0) {
            setListStatus("empty");
        } else {
            setListStatus("success");
            renderTable();
        }
    } catch (error) {
        setListStatus("error", error.message);
    }
}


async function viewResourceDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        alert(`ДЕТАЛІ РЕСУРСУ:\nНазва: ${data.title}\nURL: ${data.url}\nТип: ${data.type}\nАвтор: ${data.author}`);
    } catch (error) {
        alert("Не вдалося завантажити деталі: " + error.message);
    }
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const dto = {
        title: document.getElementById("titleInput").value.trim(),
        url: document.getElementById("urlInput").value.trim(),
        type: document.getElementById("typeSelect").value,
        description: document.getElementById("descInput").value.trim(),
        author: document.getElementById("authorInput").value.trim()
    };

    if (!validate(dto)) return;

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (!response.ok) throw new Error("Не вдалося додати ресурс");
        
        resetForm();
        loadResources(); 
    } catch (error) {
        alert("Помилка створення: " + error.message);
    }
}


async function deleteResource(id) {
    if (confirm("Ви впевнені, що хочете видалити цей ресурс?")) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Не вдалося видалити ресурс");
            
            loadResources(); 
        } catch (error) {
            alert("Помилка видалення: " + error.message);
        }
    }
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
    const form = document.getElementById("resourceForm");
    if (form) form.reset();
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
            <td>
                <button style="margin-bottom: 5px; cursor: pointer;" onclick="viewResourceDetails('${item.id}')">Деталі</button>
                <button class="delete-btn" onclick="deleteResource('${item.id}')">Видалити</button>
            </td>
        </tr>
    `).join("");
}

function sortResourcesByUrl() {
    if (resources.length < 2) return; 
    resources.sort((a, b) => a.url.localeCompare(b.url));
    renderTable();
}

function sortResourcesByNaz() {
    if (resources.length < 2) return; 
    resources.sort((a, b) => a.title.localeCompare(b.title));
    renderTable(); 
}