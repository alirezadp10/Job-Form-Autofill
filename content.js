// ==============================
// Constants
// ==============================
const API_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";
const INFO_KEY = "userInfo";

// ==============================
// Runtime Listener
// ==============================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== "AUTOFILL_PAGE_FORM") return;

    handleAutofill(msg.job_description, sendResponse);
    return true; // keep channel open for async response
});

async function handleAutofill(jobDescription, sendResponse) {
    try {
        const userInfo = await getUserInfoJSON();
        const payload = {
            my_information: userInfo,
            questions: buildEmptyJsonFromForm("form"),
            job_description: jobDescription
        };

        const answers = await fetchCorrection(payload);
        await fillForm("form", answers);

        sendResponse({ done: true });
    } catch (err) {
        console.error("Autofill failed:", err);
        sendResponse({ done: false, error: err.message });
    }
}

// ==============================
// API
// ==============================
async function fetchCorrection(payload) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.warn("No API key set");
        return {};
    }

    const authHeader = apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;

    try {
        const resp = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{
                    role: "user",
                    content: buildPrompt(payload)
                }]
            })
        });

        if (!resp.ok) {
            console.error("API error:", resp.status, resp.statusText);
            return {};
        }

        const data = await resp.json();
        const raw = data?.choices?.[0]?.message?.content || "";

        console.log("Raw API response:", raw);

        return extractQuestions(raw);
    } catch (err) {
        console.error("Fetch failed:", err);
        return {};
    }
}

function buildPrompt(payload) {
    return (
        "Fill the questions object using the data from my_information and job_description. " +
        "Each response must be placed inside its corresponding key in the questions object. " +
        "For cover letter, write a simple human-like letter in B1 English level that naturally includes the applicant’s extra details: " +
        "wanting to emigrate, eagerness to start, passion for the software, responsibility with deadlines, and contribution to Laravel framework. " +
        "Return only {questions: {...}} with no extra text.\n" +
        JSON.stringify(payload)
    );
}

function extractQuestions(raw) {
    if (!raw) return {};

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
        console.warn("No JSON found in:", raw);
        return {};
    }

    const jsonStr = raw.slice(start, end + 1);
    try {
        const parsed = JSON.parse(jsonStr);
        return parsed.questions || parsed || {};
    } catch (err) {
        console.error("Failed to parse JSON:", err, jsonStr);
        return {};
    }
}

function getApiKey() {
    return new Promise(resolve => {
        chrome.storage.local.get([INFO_KEY], res => {
            resolve(res[INFO_KEY]?.apiKey || "");
        });
    });
}

// ==============================
// Form Utilities
// ==============================
function getVisibleFormElementsWithLabels(formSelector = "form") {
    const form = document.querySelector(formSelector);
    if (!form) return [];

    const elements = form.querySelectorAll("input, select, textarea, button");
    return Array.from(elements)
        .filter(el => el.offsetWidth || el.offsetHeight || el.getClientRects().length)
        .map(el => ({
            tag: el.tagName.toLowerCase(),
            type: el.type || null,
            name: el.name || null,
            id: el.id || null,
            label: getElementLabel(form, el)
        }));
}

function getElementLabel(form, el) {
    if (el.id) {
        const label = form.querySelector(`label[for="${el.id}"]`);
        if (label) return label.innerText.trim();
    }
    const parentLabel = el.closest("label");
    return parentLabel ? parentLabel.innerText.trim() : null;
}

function buildEmptyJsonFromForm(formSelector = "form") {
    const elements = getVisibleFormElementsWithLabels(formSelector);
    const json = {};
    let counter = 1;

    elements.forEach(({ label, name, id }) => {
        const key = label || name || id || `unnamed_field_${counter++}`;
        json[key] = "";
    });

    return json;
}

async function fillForm(formSelector = "form", answers = {}) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    for (const el of form.querySelectorAll("input, select, textarea")) {
        if (el.type === "file") continue;

        const key = getFormElementKey(form, el);
        if (!key || answers[key] === undefined) continue;

        if (el.type === "checkbox" || el.type === "radio") {
            el.checked = !!answers[key];
        } else {
            el.value = answers[key];
        }
    }
}

function getFormElementKey(form, el) {
    return getElementLabel(form, el) || el.name || el.id || "";
}

// ==============================
// Storage Utilities
// ==============================
function getUserInfoJSON() {
    return new Promise(resolve => {
        chrome.storage.local.get(INFO_KEY, res => {
            resolve(res[INFO_KEY] || {});
        });
    });
}
