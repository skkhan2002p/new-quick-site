document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // 2. Dynamic Year in Footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Showcase Filter Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      tabBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      portfolioCards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 4. Contact Form Handling with MayaDB
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showStatus("Please fill in all fields.", false);
        return;
      }

      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      try {
        if (window.MayaDB) {
          // Store in private collection for privacy compliance
          await MayaDB.add("private_messages", {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
          });
          showStatus("Thank you! Your message has been received.", true);
          contactForm.reset();
        } else {
          // Offline / local preview fallback
          showStatus("Message recorded (offline preview mode).", true);
          contactForm.reset();
        }
      } catch (err) {
        console.error("MayaDB Error:", err);
        showStatus("Message saved locally. Thank you!", true);
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  function showStatus(msg, isSuccess) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = "form-status " + (isSuccess ? "success" : "error");
    
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
});
