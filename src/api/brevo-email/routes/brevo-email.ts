export default {
  routes: [
    {
      method: "POST",
      path: "/send-email",
      handler: "brevo-email.sendEmail",
      config: {
        auth: false, // Set to true if authentication is required
      },
    },
  ],
};
