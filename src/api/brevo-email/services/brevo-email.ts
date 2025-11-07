export default () => ({
  async sendEmail({ to, subject, html, pdfData, fileName }) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderName = process.env.BREVO_SENDER_NAME;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;

    if (!apiKey || !senderEmail) {
      strapi.log.error(
        "BREVO credentials missing. Please set BREVO_API_KEY and BREVO_SENDER_EMAIL."
      );
      throw new Error("Email service is not configured.");
    }

    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: to,
          name: to.split("@")[0], // basic name fallback
        },
      ],
      subject,
      htmlContent: html,
      attachments: [],
    };

    if (pdfData) {
      payload.attachments.push({
        filename: fileName || "invoice.pdf",
        content: pdfData.split(",")[1],
        encoding: "base64",
      });
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        strapi.log.error(`Brevo API error: ${errorBody}`);
        throw new Error(
          `Failed to send email: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      strapi.log.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  },
});
