document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     HERO TEXT ANIMATION
  ========================== */

  const texts = [
    "We Build AI-Ready Websites That Dominate Search Engines",
    "We Help Businesses Appear in ChatGPT, Gemini & AI Answers",
    "We Turn Websites Into High-Converting Lead Machines",
    "We Future-Proof Your Business for AI Search Revolution",
    "We Engineer Digital Visibility Using Advanced AEO & AIO Systems"
  ];

  let i = 0;

  const heroText = document.getElementById("heroText");

  function changeHeroText() {

    heroText.style.opacity = 0;
    heroText.style.transform = "translateY(15px)";

    setTimeout(() => {

      heroText.textContent = texts[i];

      heroText.style.opacity = 1;
      heroText.style.transform = "translateY(0px)";

      i = (i + 1) % texts.length;

    }, 600);
  }

  // first text instantly
  heroText.textContent = texts[0];

  // change continuously
  setInterval(changeHeroText, 3500);



  /* =========================
     AI AUDIT TOOL
  ========================== */

  window.runAudit = function () {

    const url = document.getElementById("websiteUrl").value;
    const result = document.getElementById("auditResult");

    if (!url) {
      result.textContent = "Please enter a website URL first.";
      return;
    }

    const scores = [
      "Low AI Visibility ❌",
      "Medium AI Readiness ⚠️",
      "High AI Optimization ✅"
    ];

    const random = scores[Math.floor(Math.random() * scores.length)];

    result.textContent = `Result for ${url}: ${random}`;
  };



  /* =========================
     LEAD ESTIMATOR
  ========================== */

  window.calculateLeads = function () {

    const traffic =
      parseFloat(document.getElementById("traffic").value) || 0;

    const conversion =
      parseFloat(document.getElementById("conversion").value) || 0;

    const result = document.getElementById("leadResult");

    if (traffic === 0 || conversion === 0) {
      result.textContent =
        "Please enter valid traffic and conversion rate.";
      return;
    }

    const leads = Math.round((traffic * conversion) / 100);

    result.textContent =
      `Estimated Monthly Leads: ${leads}`;
  };



  /* =========================
     FAQ DROPDOWN
  ========================== */

  document.querySelectorAll(".faq-question").forEach(button => {

    button.addEventListener("click", () => {

      const answer = button.nextElementSibling;

      if (answer.style.display === "block") {
        answer.style.display = "none";
      } else {
        answer.style.display = "block";
      }

    });

  });



  /* =========================
     CONTACT FORM
  ========================== */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {

    contactForm.addEventListener("submit", async function (e) {

      e.preventDefault();

      const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
      };

      const status =
        document.getElementById("formStatus");

      try {

        const res = await fetch("/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {

          status.textContent =
            "Message sent successfully!";

          contactForm.reset();

        } else {

          status.textContent =
            "Something went wrong. Try again.";

        }

      } catch (err) {

        status.textContent =
          "Server error. Try again later.";

      }

    });

  }



  /* =========================
     MOBILE NAVBAR
  ========================== */

  const menuToggle =
    document.getElementById("menuToggle");

  const navLinks =
    document.getElementById("navLinks");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      navLinks.classList.toggle("active");

    });

  }

});