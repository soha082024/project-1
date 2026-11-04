
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {
        const {
            studentName,
            guardianName,
            studentEmail,
            phone,
            course
        } = req.body || {};

        // Validate required fields
        if (
            !studentName ||
            !guardianName ||
            !studentEmail ||
            !phone ||
            !course
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all fields."
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(studentEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        // Read the secret webhook URL from Vercel
        const webhookURL = process.env.N8N_WEBHOOK_URL;

        if (!webhookURL) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error."
            });
        }

        // Send student data to n8n
        const n8nResponse = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: studentName.trim(),
                guardianName: guardianName.trim(),
                studentEmail: studentEmail.trim(),
                phone: phone.trim(),
                course: course.trim()
            }),
            signal: AbortSignal.timeout(15000)
        });

        if (!n8nResponse.ok) {
            const errorDetails = await response.text();
console.error("n8n error details:", response.status, errorDetails);
throw new Error(`n8n request failed: ${response.status}`);
        }

        return res.status(200).json({
            success: true,
            message: "Application submitted successfully!"
        });

    } catch (error) {
        console.error("Admission API error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit application. Please try again."
        });
    }
}
