/**
 * TERRIBILE FOGÕES - MAIN APP
 * Application initialization and coordination
 */

(function () {
  "use strict";

  /**
   * Initialize application when DOM is ready
   */
  function init() {
    initNavbar();
    initScrollAnimations();
    initSmoothScroll();
    fadeInPage();
  }

  /**
   * Navbar functionality
   */
  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const navbarToggle = document.querySelector(".navbar__toggle");
    const navbarMenu = document.querySelector(".navbar__menu");
    const navbarLinks = document.querySelectorAll(".navbar__link");

    if (!navbar) return;

    // Scroll effect
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });

    // Mobile menu toggle
    if (navbarToggle && navbarMenu) {
      navbarToggle.addEventListener("click", function () {
        navbarMenu.classList.toggle("active");
        navbarToggle.classList.toggle("active");
      });
    }

    // Close menu on link click
    navbarLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbarMenu) {
          navbarMenu.classList.remove("active");
        }
        if (navbarToggle) {
          navbarToggle.classList.remove("active");
        }
      });
    });

    // Update active link on scroll
    updateActiveNavLink();
    window.addEventListener("scroll", updateActiveNavLink);
  }
  

  /**
   * Update active navigation link based on scroll position
   */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(function (section) {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(
        '.navbar__link[href="#' + sectionId + '"]',
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) {
          document.querySelectorAll(".navbar__link").forEach(function (link) {
            link.classList.remove("active");
          });
          navLink.classList.add("active");
        }
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }

  /**
   * Scroll animations using Intersection Observer
   */
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");

          // Animate children with delay
          const children = entry.target.querySelectorAll(".animate-child");
          children.forEach(function (child, index) {
            setTimeout(function () {
              child.classList.add("animate-in");
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Fade in page on load
   */
  function fadeInPage() {
    setTimeout(function () {
      document.body.classList.add("loaded");
    }, 100);
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("show");
    }, 10);

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Navigate to WhatsApp
   */
  function contactWhatsApp(message) {
    message = message || "Olá! Gostaria de mais informações sobre os fogões.";
    const phone = "54999960180";
    const url =
      "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
  }

  /**
   * Navigate to product details, preserving the current page URL so the user can return
   */
  function viewProduct(id) {
    var from = encodeURIComponent(window.location.href);
    window.location.href = "produto-detalhes.html?id=" + id;
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose global functions
  window.contactWhatsApp = contactWhatsApp;
  window.viewProduct = viewProduct;
  window.showToast = showToast;
})();
