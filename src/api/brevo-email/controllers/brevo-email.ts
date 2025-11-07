export default {
  async sendEmail(ctx) {
    try {
      // Strapi v4 body
      const body = ctx.request.body;

      const { to, subject, html } = body || {};

      if (!to || !subject || !html) {
        return ctx.badRequest("Missing required fields: to, subject, html");
      }

      const response = await strapi
        .service("api::brevo-email.brevo-email")
        .sendEmail({ to, subject, html });

      ctx.send({ message: "Email sent successfully", response, success: true });
    } catch (error) {
      console.error("Email error:", error);
      ctx.send({ error: "Failed to send email", success: false });
    }
  },
};
