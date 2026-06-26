const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static("public"));

// email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ainastamher@gmail.com",
    pass: "baxr xmgi rjne otzk" // ❗ no spaces
  }
});

// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/audit", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({
      error: "No URL provided"
    });
  }

  try {

    const response = await axios.get(url, {
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36"
  }
});

    const html = response.data;
    const $ = cheerio.load(html);

    // =========================
    // WEBSITE DATA EXTRACTION
    // =========================

    const title = $("title").text().trim();
    const meta = $('meta[name="description"]').attr("content");
    const h1 = $("h1").length;
    const images = $("img").length;
    const links = $("a").length;

    // =========================
    // SCORE ENGINE
    // =========================

    let seoScore = 0;
    let aeoScore = 0;
    let performanceScore = 100;

    // SEO
    if (title) seoScore += 30;
    if (meta) seoScore += 30;
    if (h1 === 1) seoScore += 40;

    // AEO
    if (title) aeoScore += 25;
    if (meta) aeoScore += 25;
    if (h1 > 0) aeoScore += 25;
    if (images > 2) aeoScore += 25;

    // Performance estimate
    performanceScore -= images * 2;

    if (performanceScore < 40) {
      performanceScore = 40;
    }

    // =========================
    // INSIGHTS + IMPROVEMENTS
    // =========================

    let insights = [];
    let improvements = [];

    // TITLE
    if (title) {
      insights.push("Title tag is present");
    } else {
      insights.push("Missing title tag");
      improvements.push("Add SEO-friendly title (50–60 chars)");
    }

    // META
    if (meta) {
      insights.push("Meta description detected");
    } else {
      insights.push("Missing meta description");
      improvements.push("Add meta description (140–160 chars)");
    }

    // H1
    if (h1 === 1) {
      insights.push("Proper H1 structure found");
    } else if (h1 === 0) {
      insights.push("No H1 heading found");
      improvements.push("Add one strong H1 heading");
    } else {
      insights.push("Multiple H1 headings detected");
      improvements.push("Use only one H1 heading");
    }

    // IMAGES
    if (images > 0) {
      insights.push(`${images} images found on page`);
    } else {
      insights.push("No images found");
      improvements.push("Add optimized images with alt text");
    }

    // LINKS
    if (links >= 5) {
      insights.push("Internal linking structure looks decent");
    } else {
      insights.push("Low internal linking detected");
      improvements.push("Add more internal navigation links");
    }

    // =========================
    // FINAL RESPONSE
    // =========================

    return res.json({
      url,

      scores: {
        seo: seoScore,
        aeo: aeoScore,
        performance: performanceScore
      },

      insights,
      improvements
    });

  } catch (error) {

    return res.json({
      error: "Website not reachable or blocked"
    });

  }
});
/* =========================
   CONTACT ROUTE
========================= */
app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "ainastamher@gmail.com",
    subject: subject,
    text: `
Name: ${name}
Email: ${email}
Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      return res.send("❌ Email failed to send");
    }

    return res.send(`
      <h2>✅ Message Sent Successfully</h2>
      <a href="/">Go Back</a>
    `);
  });
});

/* =========================
   SERVER START
========================= */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});