/**
 * TERRIBILE FOGÕES - PRODUCT DETAILS
 * Product detail page functionality
 */

(function () {
  "use strict";

  // ================================================
  // GALLERY - constructor function (Edge compatible)
  // ================================================
  function ProductGallery(galleryElement) {
    this.gallery = galleryElement;
    this.images = galleryElement.querySelectorAll(".product-gallery__image");
    this.thumbnails = galleryElement.querySelectorAll(
      ".product-gallery__thumbnail",
    );
    this.currentIndex = 0;
    this._init();
  }

  ProductGallery.prototype._init = function () {
    var self = this;

    // Thumbnails
    for (var i = 0; i < this.thumbnails.length; i++) {
      (function (index) {
        self.thumbnails[index].addEventListener("click", function () {
          self.goToSlide(index);
        });
      })(i);
    }

    // Nav buttons
    var prevBtn = this.gallery.querySelector(".product-gallery__nav-btn--prev");
    var nextBtn = this.gallery.querySelector(".product-gallery__nav-btn--next");
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        self.previousSlide();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        self.nextSlide();
      });
    }

    // Keyboard
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        self.previousSlide();
      } else if (e.key === "ArrowRight") {
        self.nextSlide();
      }
    });
  };

  ProductGallery.prototype.goToSlide = function (index) {
    for (var i = 0; i < this.images.length; i++) {
      this.images[i].classList.remove("active");
    }
    for (var j = 0; j < this.thumbnails.length; j++) {
      this.thumbnails[j].classList.remove("active");
    }
    if (this.images[index]) {
      this.images[index].classList.add("active");
    }
    if (this.thumbnails[index]) {
      this.thumbnails[index].classList.add("active");
    }
    this.currentIndex = index;
  };

  ProductGallery.prototype.nextSlide = function () {
    var nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goToSlide(nextIndex);
  };

  ProductGallery.prototype.previousSlide = function () {
    var prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToSlide(prevIndex);
  };

  // ================================================
  // TABS - constructor function (Edge compatible)
  // ================================================
  function ProductTabs(tabsElement) {
    this.tabsElement = tabsElement;
    this.buttons = tabsElement.querySelectorAll(".product-tabs__btn");
    this.contents = tabsElement.querySelectorAll(".product-tabs__content");
    this._init();
  }

  ProductTabs.prototype._init = function () {
    var self = this;
    for (var i = 0; i < this.buttons.length; i++) {
      (function (index) {
        self.buttons[index].addEventListener("click", function () {
          self.switchTab(index);
        });
      })(i);
    }
  };

  ProductTabs.prototype.switchTab = function (index) {
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].classList.remove("active");
    }
    for (var j = 0; j < this.contents.length; j++) {
      this.contents[j].classList.remove("active");
    }
    if (this.buttons[index]) {
      this.buttons[index].classList.add("active");
    }
    if (this.contents[index]) {
      this.contents[index].classList.add("active");
    }
  };

  // ================================================
  // LOAD PRODUCT DATA
  // ================================================
  function loadProductData() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get("id");

    if (!productId || typeof produtosData === "undefined") {
      return;
    }

    var product = null;
    var categories = Object.keys(produtosData);
    for (var c = 0; c < categories.length; c++) {
      var category = produtosData[categories[c]];
      for (var p = 0; p < category.length; p++) {
        if (category[p].id === productId) {
          product = category[p];
          break;
        }
      }
      if (product) break;
    }

    if (!product) return;

    updateProductInfo(product);
  }

  // ================================================
  // UPDATE PRODUCT INFO
  // ================================================
  function updateProductInfo(product) {
    // Page title
    document.title = product.nome + " | TERRIBILE Fogões";

    // Product title
    var titleEl = document.querySelector(".product-info__title");
    if (titleEl) {
      titleEl.textContent = product.nome;
    }

    // Breadcrumb
    var breadcrumb = document.querySelector(".breadcrumb-item.active");
    if (breadcrumb) {
      breadcrumb.textContent = product.nome;
    }

    // Category
    var categoryEl = document.querySelector(".product-info__category");
    if (categoryEl) {
      categoryEl.textContent = product.categoria;
    }

    // Description
    var descEl = document.querySelector(".product-info__description");
    if (descEl && product.descricao) {
      descEl.textContent = product.descricao;
    }

    // Features list
    if (product.caracteristicas && product.caracteristicas.length > 0) {
      var featuresList = document.querySelector(".product-features__list");
      if (featuresList) {
        var html = "";
        for (var i = 0; i < product.caracteristicas.length; i++) {
          var caracFull = product.caracteristicas[i];
          var colonIdx = caracFull.indexOf(":");
          var cardLabel =
            colonIdx !== -1
              ? caracFull.substring(0, colonIdx).trim()
              : caracFull;
          html +=
            '<li class="product-features__item">' +
            '<i class="bi bi-check-circle-fill"></i>' +
            "<span>" +
            cardLabel +
            "</span>" +
            "</li>";
        }
        featuresList.innerHTML = html;
      }
    }

    // Frase do produto
    if (product.frase && product.frase.length > 0) {
      var fraseEl = document.querySelector(".product-frase");
      if (fraseEl) {
        fraseEl.innerHTML =
          '<i class="bi bi-quote product-frase__icon"></i>' +
          '<p class="product-frase__text">' +
          product.frase[0] +
          "</p>";
        fraseEl.style.display = "";
      }
    }

    // Tabs content
    updateTabsContent(product);

    // WhatsApp button
    var waBtn = document.querySelector(".product-actions .btn--primary");
    if (waBtn && product.mensagemWhatsApp) {
      waBtn.href =
        "https://wa.me/54999960180?text=" +
        encodeURIComponent(product.mensagemWhatsApp);
    }

    // Specs
    if (product.especificacoes) {
      updateSpecs(product.especificacoes);
    }

    // Gallery
    if (product.imagens && product.imagens.length > 0) {
      updateGallery(product.imagens);
    } else if (product.imagem) {
      updateGallery([product.imagem]);
    }
  }

  // ================================================
  // TABS CONTENT
  // ================================================
  function updateTabsContent(product) {
    var tabContents = document.querySelectorAll(".product-tabs__content");
    if (!tabContents || tabContents.length === 0) return;

    // Tab 0: Descrição
    if (tabContents[0]) {
      var descHtml = "<h3>Sobre Este Produto</h3>";
      descHtml += "<p>" + product.descricao + "</p>";

      if (product.caracteristicas && product.caracteristicas.length > 0) {
        descHtml += '<ul style="margin-top:1rem;padding-left:1.25rem;">';
        for (var i = 0; i < product.caracteristicas.length; i++) {
          descHtml +=
            '<li style="margin-bottom:0.4rem;">' +
            product.caracteristicas[i] +
            "</li>";
        }
        descHtml += "</ul>";
      }

      descHtml +=
        '<p style="margin-top:1rem;">Fabricados com dedicação em Aratiba-RS, nossos fogões são sinônimo de qualidade, funcionalidade e do calor acolhedor que só um produto feito com paixão pode oferecer.</p>';
      tabContents[0].innerHTML = descHtml;
    }

    // Tab 1: Especificações
    if (tabContents[1] && product.especificacoes) {
      var specsHtml = "<h3>Especificações Detalhadas</h3>";
      specsHtml += '<table style="width:100%;border-collapse:collapse;">';
      var keys = Object.keys(product.especificacoes);
      for (var k = 0; k < keys.length; k++) {
        specsHtml +=
          '<tr style="border-bottom:1px solid rgba(255,255,255,0.08);">' +
          '<td style="padding:0.6rem 0.5rem;font-weight:600;width:45%;color:var(--color-primary,#c0392b);">' +
          keys[k] +
          "</td>" +
          '<td style="padding:0.6rem 0.5rem;">' +
          product.especificacoes[keys[k]] +
          "</td>" +
          "</tr>";
      }
      specsHtml += "</table>";
      tabContents[1].innerHTML = specsHtml;
    }
  }

  // ================================================
  // SPECS GRID
  // ================================================
  function updateSpecs(specs) {
    var specsGrid = document.querySelector(".product-specs__grid");
    if (!specsGrid || !specs) return;

    specsGrid.innerHTML = "";

    for (var key in specs) {
      if (specs.hasOwnProperty(key)) {
        var value = specs[key] || "-";
        var specItem = document.createElement("div");
        specItem.className = "product-specs__item";
        specItem.innerHTML =
          '<span class="product-specs__label">' +
          key +
          ":</span>" +
          '<span class="product-specs__value">' +
          value +
          "</span>";
        specsGrid.appendChild(specItem);
      }
    }
  }

  // ================================================
  // GALLERY UPDATE
  // ================================================
  function updateGallery(images) {
    var mainContainer = document.querySelector(".product-gallery__main");
    var thumbnailsContainer = document.querySelector(
      ".product-gallery__thumbnails",
    );
    var placeholder = document.querySelector(".product-gallery__placeholder");

    if (!mainContainer || !thumbnailsContainer) return;

    if (!images || images.length === 0) {
      if (placeholder) {
        placeholder.style.display = "flex";
      }
      return;
    }

    if (placeholder) {
      placeholder.style.display = "none";
    }

    // Clear existing
    var existingImages = mainContainer.querySelectorAll(
      ".product-gallery__image",
    );
    for (var r = 0; r < existingImages.length; r++) {
      existingImages[r].parentNode.removeChild(existingImages[r]);
    }
    thumbnailsContainer.innerHTML = "";

    // Add images
    for (var i = 0; i < images.length; i++) {
      var imageUrl = images[i];

      // Main image
      var img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Produto - Imagem " + (i + 1);
      img.className = "product-gallery__image";
      if (i === 0) {
        img.classList.add("active");
      }

      var navEl = mainContainer.querySelector(".product-gallery__nav");
      if (navEl) {
        mainContainer.insertBefore(img, navEl);
      } else {
        mainContainer.appendChild(img);
      }

      // Thumbnail
      var thumb = document.createElement("div");
      thumb.className = "product-gallery__thumbnail";
      if (i === 0) {
        thumb.classList.add("active");
      }

      var thumbImg = document.createElement("img");
      thumbImg.src = imageUrl;
      thumbImg.alt = "Thumbnail " + (i + 1);
      thumb.appendChild(thumbImg);
      thumbnailsContainer.appendChild(thumb);
    }

    // Re-init gallery
    var gallery = document.querySelector(".product-gallery");
    if (gallery) {
      new ProductGallery(gallery);
    }
  }

  // ================================================
  // INIT
  // ================================================
  function init() {
    var gallery = document.querySelector(".product-gallery");
    if (gallery) {
      new ProductGallery(gallery);
    }

    var tabs = document.querySelector(".product-tabs");
    if (tabs) {
      new ProductTabs(tabs);
    }

    loadProductData();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose globally
  window.ProductGallery = ProductGallery;
  window.ProductTabs = ProductTabs;
})();
