# Job Form Autofill

**Job Form Autofill** is a Chrome extension that automatically fills out job application forms using your saved profile information and an AI-powered API. It saves time by generating relevant responses — including cover letters — tailored to job descriptions.

---

## ✨ Features

- 🔑 **Secure API integration** with [DeepInfra](https://deepinfra.com) for AI-generated answers.
- 📝 **Autofills job application forms** with your stored information.
- 💬 **Generates cover letters** in natural language based on job descriptions.
- ⚙️ **Options page** to manage your profile and API key.
- 📌 **Popup UI** for quick extension access.
- 💾 **Local storage** for your profile information (no external DB required).

---

## 🚀 How It Works

1. Save your profile details and API key in the **options page**.
2. When you open a job application form, the extension:
    - Collects visible form fields.
    - Sends your profile data + the job description to the AI API.
    - Fills the form with tailored answers.
3. Review & edit before submission.

---

## 🛠️ Installation

### From Source (Developer Mode)

1. Clone or download this repository.
2. Open **Chrome** and go to `chrome://extensions/`.
3. Enable **Developer Mode** (top-right).
4. Click **Load unpacked** and select the project folder.
5. The extension will appear in your toolbar.

---

## 📖 Usage

- Click the extension icon to open the popup.
- Use the **Options page** (`right-click → Options` or from the popup) to enter:
    - Your personal info (name, skills, etc.).
    - Your **DeepInfra API key**.
- Visit a job form and trigger autofill (the extension listens for `AUTOFILL_PAGE_FORM` messages).

---

## 🔒 Permissions

The extension requires:

- **storage** → Save your API key & user info locally.
- **scripting, activeTab** → Run content scripts on the current page to fill forms.
- **host_permissions** → Access DeepInfra API (`https://api.deepinfra.com/*`).

---


## 📌 Roadmap / Ideas

- [ ] Add UI button to trigger autofill manually on forms.
- [ ] Support multiple profiles (e.g., for different job types).
- [ ] Add template system for cover letters.
- [ ] Improve form-field matching logic with semantic labels.

---

## 📄 License

MIT License – feel free to use and modify.  
