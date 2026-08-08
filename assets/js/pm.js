/**
 * TERRIBILE FOGÕES - PRODUCTS MANAGER
 * Filtragem e renderização de produtos na página de produtos.
 */

(function () {
  "use strict";

  const productsGrid = document.getElementById("products-grid");
  if (!productsGrid || typeof produtosData === "undefined") return;

  const subcategoriaContainer = document.getElementById(
    "subcategoriaContainer",
  );
  const subcategoriaSelect = document.getElementById("subcategoriaSelect");

  let filtroAtual = "all";

  /**
   * Retorna todos os produtos de todas as categorias como array plano.
   */
  function getAllProductsFlat() {
    const products = [];
    Object.values(produtosData).forEach(function (category) {
      products.push(...category);
    });
    return products;
  }

  /**
   * Mapeia a chave da URL (?filter=fogoes-vitroceramica) para o valor
   * usado no atributo data-filter dos botões de filtro.
   */
  function getFilterValueFromUrl(urlKey) {
    const map = {
      "fogoes-vitroceramica": "Vitrocerâmica",
      "fogoes-aluminio": "Alumínio",
      "fogoes-ferro": "Ferro",
      churrasco: "Linha Churrasco",
      "acessorios-fogao": "Acessórios",
    };
    return map[urlKey] || null;
  }

  /**
   * Obtém a primeira imagem de um produto.
   * Suporta tanto o campo "imagens" (array) quanto "imagem" (string legada).
   */
  function getProductImage(product) {
    if (product.imagens && product.imagens.length > 0) {
      return product.imagens[0];
    }
    return product.imagem || "";
  }

  /**
   * Cria o HTML de um card de produto.
   */
  function createProductCard(product) {
    const categoryShort = product.categoria
      .replace("Fogões Chapa ", "")
      .replace("Acessórios e Peças", "Acessórios");

    const imageSrc = getProductImage(product);

    const imageHtml =
      imageSrc.trim() !== ""
        ? '<img src="' +
          imageSrc +
          '" alt="' +
          product.nome +
          '" onerror="this.parentElement.innerHTML=\'<div class=&quot;product-card__placeholder&quot;>🔥</div>\'">'
        : '<div class="product-card__placeholder">🔥</div>';

    // disponibilidade
    const disponivel = product.disponibilidade !== false;

    const whatsappButton = disponivel
      ? '<a href="https://wa.me/54999960180?text=' +
        encodeURIComponent(
          product.mensagemWhatsApp || "Olá! Gostaria de mais informações.",
        ) +
        '" class="btn btn--whatsapp" target="_blank" data-status="Disponível">WhatsApp</a>'
      : '<a class="btn btn--whatsapp.indisponivel" data-status="Indisponível no momento">Indisponível no momento</a>';

    return [
      '<div class="product-card">',
      '  <div class="product-card__image">',
      "    " + imageHtml,
      "  </div>",
      '  <div class="product-card__info">',
      '    <div class="product-card__category">' + categoryShort + "</div>",
      '    <h3 class="product-card__title">' + product.nome + "</h3>",
      '    <p class="product-card__description">' +
        (product.descricao || "Fogão a lenha de alta qualidade.") +
        "</p>",
      '    <div class="product-card__actions">',
      '      <button class="btn btn--view" onclick="viewProduct(\'' +
        product.id +
        "')\">Ver Detalhes</button>",
      "      " + whatsappButton,
      "    </div>",
      "  </div>",
      "</div>",
    ].join("\n");
  }

  /**
   * Renderiza produtos no grid. Exibe mensagem "sem resultados" se vazio.
   */
  function renderProducts(products) {
    const noResults = document.getElementById("no-results");

    if (products.length === 0) {
      productsGrid.style.display = "none";
      if (noResults) noResults.style.display = "block";
      return;
    }

    productsGrid.style.display = "grid";
    if (noResults) noResults.style.display = "none";

    productsGrid.innerHTML = products.map(createProductCard).join("");
  }

  /**
   * Filtra produtos pelo valor do botão (ex: "Vitrocerâmica").
   * Usa includes() para ser tolerante a categoria longa (ex: "Fogões Chapa Vitrocerâmica").
   */
  function filterProducts(filter, subcategoria = "") {
    filtroAtual = filter;

    const all = getAllProductsFlat();

    let produtos = all;

    if (filter !== "all") {
      produtos = produtos.filter(function (p) {
        return p.categoria.includes(filter);
      });
    }

    if (subcategoria !== "") {
      produtos = produtos.filter(function (p) {
        return p.subcategoria === subcategoria;
      });
    }

    renderProducts(produtos);
  }

  function popularSubcategorias() {
    if (!subcategoriaSelect) return;

    const churrasco = produtosData["churrasco"] || []; // era "Linha Churrasco"

    const categorias = [
      ...new Set(churrasco.map((p) => p.subcategoria).filter(Boolean)),
    ];

    subcategoriaSelect.innerHTML = '<option value="">Todas</option>';

    categorias.forEach(function (categoria) {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      subcategoriaSelect.appendChild(option);
    });
  }

  /**
   * Configura os botões de filtro com estado ativo e callback de filtragem.
   * Inclui tanto os botões simples (.filter-btn) quanto os itens do
   * dropdown "Fogões" (.filter-dropdown__item), que usam a mesma lógica
   * de filtragem por data-filter.
   */
  function initFilters() {
    const fogoesDropdown = document.getElementById("fogoesDropdown");
    const fogoesToggle = document.getElementById("fogoesToggle");

    // Todos os elementos "clicáveis" que representam um filtro,
    // exceto o próprio botão que abre/fecha o dropdown.
    const filterButtons = document.querySelectorAll(
      ".filter-btn:not(.filter-dropdown__toggle), .filter-dropdown__item",
    );

    function setActiveFilterElement(activeEl) {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      if (fogoesToggle) fogoesToggle.classList.remove("active");

      activeEl.classList.add("active");

      // Se o filtro ativo é um item do dropdown, o botão "Fogões"
      // também recebe o estado ativo (visual).
      if (
        fogoesToggle &&
        activeEl.classList.contains("filter-dropdown__item")
      ) {
        fogoesToggle.classList.add("active");
      }
    }

    function applyFilter(el) {
      setActiveFilterElement(el);

      const filtro = el.dataset.filter;

      if (filtro === "Linha Churrasco") {
        subcategoriaContainer.style.display = "block";

        subcategoriaSelect.value = "";

        filterProducts("Linha Churrasco");
      } else {
        subcategoriaContainer.style.display = "none";

        filterProducts(filtro);
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(this);

        // Ao escolher uma chapa, fecha o dropdown "Fogões".
        if (fogoesDropdown) fogoesDropdown.classList.remove("open");
        if (fogoesToggle) fogoesToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Abre/fecha o dropdown "Fogões" ao clicar no botão.
    if (fogoesToggle && fogoesDropdown) {
      const fogoesMenu = document.getElementById("fogoesMenu");

      // O menu usa position:fixed (para não ser cortado pelo overflow-x:auto
      // do container de filtros), então sua posição precisa ser calculada
      // via JS a partir da posição real do botão "Fogões" na tela.
      function positionFogoesMenu() {
        if (!fogoesMenu) return;
        const rect = fogoesToggle.getBoundingClientRect();
        fogoesMenu.style.top = rect.bottom + 8 + "px";
        fogoesMenu.style.left = rect.left + "px";
      }

      function openFogoesMenu() {
        positionFogoesMenu();
        fogoesDropdown.classList.add("open");
        fogoesToggle.setAttribute("aria-expanded", "true");
      }

      function closeFogoesMenu() {
        fogoesDropdown.classList.remove("open");
        fogoesToggle.setAttribute("aria-expanded", "false");
      }

      fogoesToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (fogoesDropdown.classList.contains("open")) {
          // Segunda vez clicando em "Fogões" (menu já aberto): aplica o
          // filtro padrão, que mostra todos os fogões sem filtrar por chapa.
          const defaultItem = fogoesMenu
            ? fogoesMenu.querySelector('[data-filter="Fogões"]')
            : null;
          if (defaultItem) applyFilter(defaultItem);
          closeFogoesMenu();
        } else {
          openFogoesMenu();
        }
      });

      // Reposiciona o menu se a janela for redimensionada ou rolada
      // enquanto ele estiver aberto.
      window.addEventListener("resize", function () {
        if (fogoesDropdown.classList.contains("open")) positionFogoesMenu();
      });
      window.addEventListener(
        "scroll",
        function () {
          if (fogoesDropdown.classList.contains("open")) positionFogoesMenu();
        },
        true,
      );

      // Fecha o dropdown ao clicar fora dele.
      document.addEventListener("click", function (e) {
        if (!fogoesDropdown.contains(e.target) && e.target !== fogoesMenu) {
          closeFogoesMenu();
        }
      });

      // Fecha o dropdown com a tecla Esc.
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeFogoesMenu();
      });
    }

    subcategoriaSelect.addEventListener("change", function () {
      filterProducts("Linha Churrasco", this.value);
    });

    popularSubcategorias();
  }

  /**
   * Aplica filtro inicial baseado no parâmetro ?filter= da URL.
   */
  function initFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get("filter");
    if (!filterParam) return false;

    const filterValue = getFilterValueFromUrl(filterParam);
    if (!filterValue) return false;

    const btn = document.querySelector('[data-filter="' + filterValue + '"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  function init() {
    initFilters();
    // Se há filtro na URL, ele dispara o render via btn.click(); senão, renderiza tudo.
    const didFilter = initFromUrl();
    if (!didFilter) {
      renderProducts(getAllProductsFlat());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();