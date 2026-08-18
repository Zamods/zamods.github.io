document.addEventListener("DOMContentLoaded", () => {
    // Create a Trusted Types Policy for safe innerHTML usage
  let ttPolicy;
  if (window.trustedTypes && trustedTypes.createPolicy) {
    ttPolicy = trustedTypes.createPolicy("langPolicy", {
      createHTML: (string) => string
    });
  }
  // Scroll Reveal
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  revealElements.forEach((el) => observer.observe(el));

  // Navbar Mobile Toggle
  function toggleMobileNav() {
    const mobileNav = document.getElementById("mobile-nav");
    const menuIcon = document.getElementById("menu-icon");
    const closeIcon = document.getElementById("close-icon");
    mobileNav.classList.toggle("open");
    menuIcon.style.display = mobileNav.classList.contains("open") ? "none" : "block";
    closeIcon.style.display = mobileNav.classList.contains("open") ? "block" : "none";
  }

  function closeMobileNav() {
    const mobileNav = document.getElementById("mobile-nav");
    if (mobileNav) {
      mobileNav.classList.remove("open");
      document.getElementById("menu-icon").style.display = "block";
      document.getElementById("close-icon").style.display = "none";
    }
  }

  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", toggleMobileNav);
  }

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  // Smooth Scroll for "Book Now" Buttons
  document.querySelectorAll("[data-book-now]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // FAQ Accordion
  function toggleFaq(event) {
    const btn = event.currentTarget;
    const item = btn.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((i) => {
      i.classList.remove("open");
      const ans = i.querySelector(".faq-answer");
      if (ans) ans.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("open");
      if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
    }
  }

  document.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", toggleFaq);
  });

  // Language Dropdown Logic
  let currentLang = "en";
  function toggleLangDropdown() {
    const menu = document.getElementById("lang-menu");
    if (menu) menu.classList.toggle("open");
  }
  
  function setLang(lang) {
    currentLang = lang;
    const langCurrent = document.getElementById("lang-current");
    const langMenu = document.getElementById("lang-menu");
    if (langCurrent) langCurrent.textContent = lang.toUpperCase();
    if (langMenu) langMenu.classList.remove("open");
    applyLang();
  }

  function applyLang() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-en]").forEach((el) => {
      const text = el.getAttribute(`data-${currentLang}`);
      if (text) {
        if (text.includes("<")) {
          // Wrap text in Trusted Types policy if it exists, otherwise fallback
          el.innerHTML = ttPolicy ? ttPolicy.createHTML(text) : text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  const langToggleBtn = document.getElementById("lang-toggle-btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", toggleLangDropdown);
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      setLang(e.currentTarget.dataset.lang);
    });
  });

  // Auto-detect language on load
  if (navigator.language.startsWith("fr")) {
    setLang("fr");
  }

  // Close dropdown if clicked outside (using addEventListener)
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".lang-dropdown")) {
      const dropdown = document.getElementById("lang-menu");
      if (dropdown && dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
      }
    }
  });

  // Form Submit
async function handleBooking(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  
  const originalText = btn.textContent;
  
  // Change button to loading state
  btn.disabled = true;
  btn.textContent = currentLang === "fr" ? "Envoi en cours..." : "Sending...";

  try {
    // Create a FormData object from the form
    const formData = new FormData(form);
    
    // Send data to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Success!
      btn.textContent = currentLang === "fr" ? "Demande envoyée !" : "Request Sent!";
      btn.style.background = "#10B981";
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
        form.reset();
      }, 3000);
    } else {
      // Web3Forms returned an error
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    console.error("Booking submission failed:", error);
    btn.textContent = currentLang === "fr" ? "Erreur, réessayez" : "Error, try again";
    btn.style.background = "#EF4444";
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  }
}

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBooking);
  }

  // Set current year
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});