
const form = document.getElementById("admissionForm");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

// Replace this with your n8n production webhook URL.
const WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL";

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Basic anti-spam check
    if (document.getElementById("website").value !== "") {
        return;
    }

    const studentData = {
        studentName: document.getElementById("studentName").value.trim(),
        guardianName: document.getElementById("guardianName").value.trim(),
        studentEmail: document.getElementById("studentEmail").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    message.textContent = "";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            throw new Error("Submission failed");
        }

        message.textContent =
            "Application submitted successfully! Please check your email.";
        message.style.color = "green";

        form.reset();

    } catch (error) {
        message.textContent =
            "Something went wrong. Please try again later.";
        message.style.color = "red";

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Application";
    }
});
