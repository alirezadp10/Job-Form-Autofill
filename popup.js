document.getElementById("jobForm").addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("loadingOverlay").style.display = "flex";

    const job_description = document.getElementById("jobDescription").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                type: "AUTOFILL_PAGE_FORM",
                job_description
            },
            (response) => {
                if (response && response.done) {
                    window.close();
                }
            }
        );
    });
});