(function () {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const recipient = form.getAttribute("data-recipient") || "contact@enventures.co.uk";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent("ENVentures website enquiry");
    const body = encodeURIComponent(
      [
        "Name: " + name,
        "Email: " + email,
        company ? "Company: " + company : "Company:",
        "",
        message,
      ].join("\n")
    );

    window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
  });
})();
