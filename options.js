const INFO_KEY = "userInfo";

function setStatus(msg, type = "success") {
    const el = document.getElementById("status");
    el.className = type;
    el.innerText = msg;
}

function getUserInfoFromFields() {
    return {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        jobTitle: document.getElementById("jobTitle").value,
        englishLevel: document.getElementById("englishLevel").value,
        birthday: document.getElementById("birthday").value,
        country: document.getElementById("country").value,
        city: document.getElementById("city").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value,
        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
        email: document.getElementById("email").value,
        expectedSalary: document.getElementById("expectedSalary").value,
        skills: document.getElementById("skills").value.split(",").map(s => s.trim()),
        otherDetails: document.getElementById("otherDetails").value.split("\n").map(s => s.trim()),
        photoUrl: document.getElementById("photoUrl").value,
        cvUrl: document.getElementById("cvUrl").value,
        apiKey: document.getElementById("apiKey").value,
    };
}

// Auto-save fields
document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("change", saveUserInfo);
});

// Submit form (just save locally)
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveUserInfo();
    setStatus("💾 Form saved locally in Chrome storage!", "success");
});

// On load, restore data
window.addEventListener("load", async () => {
    await loadUserInfo();
});

async function saveUserInfo() {
    const info = getUserInfoFromFields();
    chrome.storage.local.set({ [INFO_KEY]: info }, () => {
        setStatus("✅ User info saved locally!", "success");
    });
}

async function loadUserInfo() {
    chrome.storage.local.get(INFO_KEY, (res) => {
        const data = res[INFO_KEY];
        if (!data) return;
        for (let key in data) {
            if (document.getElementById(key)) {
                document.getElementById(key).value =
                    Array.isArray(data[key]) ? data[key].join(", ") : data[key];
            }
        }
    });
}
