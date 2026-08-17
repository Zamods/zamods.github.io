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
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
      );
      revealElements.forEach((el) => observer.observe(el));

      // Navbar Mobile Toggle
      function toggleMobileNav() {
        const mobileNav = document.getElementById("mobile-nav");
        const menuIcon = document.getElementById("menu-icon");
        const closeIcon = document.getElementById("close-icon");
        mobileNav.classList.toggle("open");
        menuIcon.style.display = mobileNav.classList.contains("open")
          ? "none"
          : "block";
        closeIcon.style.display = mobileNav.classList.contains("open")
          ? "block"
          : "none";
      }
      function closeMobileNav() {
        document.getElementById("mobile-nav").classList.remove("open");
        document.getElementById("menu-icon").style.display = "block";
        document.getElementById("close-icon").style.display = "none";
      }

      // FAQ Accordion
      function toggleFaq(btn) {
        const item = btn.parentElement;
        const answer = item.querySelector(".faq-answer");
        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".faq-item").forEach((i) => {
          i.classList.remove("open");
          i.querySelector(".faq-answer").style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }

      // Language Dropdown Logic
      let currentLang = "en";
      function toggleLangDropdown() {
        document.getElementById("lang-menu").classList.toggle("open");
      }
      function setLang(lang) {
        currentLang = lang;
        document.getElementById("lang-current").textContent =
          lang.toUpperCase();
        document.getElementById("lang-menu").classList.remove("open");
        applyLang();
      }
      function applyLang() {
        document.documentElement.lang = currentLang;
        document.querySelectorAll("[data-en]").forEach((el) => {
          const text = el.getAttribute(`data-${currentLang}`);
          if (text) {
            // This checks if the translation contains HTML tags (like <strong>)
            if (text.includes("<")) {
              el.innerHTML = text;
            } else {
              // Otherwise, use textContent which is safer and works perfectly for tag spans
              el.textContent = text;
            }
          }
        });
        //   document.documentElement.lang = currentLang;
        //   document.querySelectorAll('[data-en]').forEach(el => {
        //     const text = el.getAttribute(`data-${currentLang}`);
        //     if (text) {
        //       if (text.includes('<strong>')) {
        //         el.innerHTML = text;
        //       } else {
        //         el.textContent = text;
        //       }
        //     }
        //   });
      }
      // Auto-detect language on load
      if (navigator.language.startsWith("fr")) {
        setLang("fr");
      }

      // Close dropdown if clicked outside
      window.onclick = function (event) {
        if (
          !event.target.matches(".lang-btn") &&
          !event.target.closest(".lang-btn")
        ) {
          const dropdown = document.getElementById("lang-menu");
          if (dropdown.classList.contains("open")) {
            dropdown.classList.remove("open");
          }
        }
      };

      // Form Submit
      function handleBooking(event) {
        event.preventDefault();
        const btn = event.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent =
          currentLang === "fr" ? "Demande envoyée !" : "Request Sent!";
        btn.style.background = "#10B981";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          event.target.reset();
        }, 3000);
      }

      // Set current year
      document.getElementById("footer-year").textContent = new Date().getFullYear();