// page.jsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import style from "./page.module.css";

// Dados dos produtos
const produtosData = [
  { id: 1, nome: "Paracetamol", descricao: "Analgésico e antitérmico", preco: 12.90, imagem: "/paracetamol.jpg", categoria: "Analgésicos", destaque: true, promocao: true },
  { id: 2, nome: "Omeprazol", descricao: "Protetor gástrico", preco: 15.50, imagem: "/omeprazol.jpg", categoria: "Gastrintestinal", destaque: false, promocao: false },
  { id: 3, nome: "Dipirona", descricao: "Analgésico e antitérmico", preco: 8.90, imagem: "/dipirona.jpg", categoria: "Analgésicos", destaque: true, promocao: true },
  { id: 4, nome: "Ibuprofeno", descricao: "Anti-inflamatório", preco: 18.75, imagem: "/ibuprofeno.jpg", categoria: "Anti-inflamatórios", destaque: false, promocao: false },
  { id: 5, nome: "Losartana", descricao: "Anti-hipertensivo", preco: 24.90, imagem: "/losartana.jpg", categoria: "Cardiovascular", destaque: true, promocao: false },
  { id: 6, nome: "Metformina", descricao: "Antidiabético", preco: 16.40, imagem: "/metformina.jpg", categoria: "Endócrino", destaque: false, promocao: true },
  { id: 7, nome: "Amoxicilina", descricao: "Antibiótico", preco: 32.90, imagem: "/amoxicilina.jpg", categoria: "Antibióticos", destaque: true, promocao: false },
  { id: 8, nome: "Atorvastatina", descricao: "Redutor de colesterol", preco: 28.50, imagem: "/atorvastatina.jpg", categoria: "Cardiovascular", destaque: false, promocao: false },
  { id: 9, nome: "Sinvastatina", descricao: "Redutor de colesterol", preco: 22.30, imagem: "/sinvastatina.jpg", categoria: "Cardiovascular", destaque: false, promocao: true },
  { id: 10, nome: "Cloridrato de Metformina", descricao: "Antidiabético", preco: 15.90, imagem: "/metformina.jpg", categoria: "Endócrino", destaque: false, promocao: false },
  { id: 11, nome: "Cimegrip", descricao: "Antigripal", preco: 12.50, imagem: "/cimegrip.jpg", categoria: "Gripes e Resfriados", destaque: true, promocao: true },
  { id: 12, nome: "Vitamina C", descricao: "Suplemento vitamínico", preco: 19.90, imagem: "/vitaminac.jpg", categoria: "Vitaminas", destaque: false, promocao: false }
];

export default function PaginaProdutos() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortOption, setSortOption] = useState("padrao");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(50);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [cartItems, setCartItems] = useState(3);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Categorias únicas para filtro
  const categorias = ["Todas", ...new Set(produtosData.map(produto => produto.categoria))];

  // Filtrar e ordenar produtos
  const filteredProducts = produtosData.filter(produto => {
    const matchesCategory = selectedCategory === "Todas" || produto.categoria === selectedCategory;
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = produto.preco <= priceRange;
    const matchesFeatured = !showFeatured || produto.destaque;
    const matchesSale = !showOnSale || produto.promocao;
    
    return matchesCategory && matchesSearch && matchesPrice && matchesFeatured && matchesSale;
  });

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "preco-menor") return a.preco - b.preco;
    if (sortOption === "preco-maior") return b.preco - a.preco;
    if (sortOption === "destaque") return (b.destaque - a.destaque) || (b.promocao - a.promocao);
    if (sortOption === "nome") return a.nome.localeCompare(b.nome);
    return 0;
  });

  // Adicionar ao carrinho
  const addToCart = (product) => {
    setCartItems(prev => prev + 1);
    // Aqui você normalmente adicionaria a um estado de carrinho mais complexo
    console.log("Produto adicionado ao carrinho:", product.nome);
  };

  // Alternar wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Resetar filtros
  const resetFilters = () => {
    setSelectedCategory("Todas");
    setPriceRange(50);
    setShowFeatured(false);
    setShowOnSale(false);
    setSearchTerm("");
  };

  return (
    <div className={style.container}>
      {/* Barra de busca e ações */}
      <div className={style.topBar}>
        <div className={style.searchContainer}>
          <div className={style.searchInput}>
            <span className={style.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar medicamentos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={style.searchButton}>Buscar</button>
        </div>
        
        <div className={style.actions}>
          <button 
            className={style.filterToggle}
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <span className={style.filterIcon}>⚙️</span>
            Filtros
          </button>
          <div className={style.viewOptions}>
            <button 
              className={viewMode === "grid" ? style.viewOptionActive : ""}
              onClick={() => setViewMode("grid")}
            >
              <span className={style.gridIcon}>⊞</span>
            </button>
            <button 
              className={viewMode === "list" ? style.viewOptionActive : ""}
              onClick={() => setViewMode("list")}
            >
              <span className={style.listIcon}>≡</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banner promocional */}
      <div className={style.promoBanner}>
        <div className={style.promoContent}>
          <h2>Promoção de Verão</h2>
          <p>Até 30% de desconto em medicamentos selecionados</p>
          <button className={style.promoButton}>Ver Ofertas</button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className={style.mainContent}>
        <div className={style.contentWrapper}>
          {/* Filtros */}
          <aside className={`${style.filtersSidebar} ${isFilterVisible ? style.filtersVisible : ""}`}>
            <h2>Filtrar Produtos</h2>
            
            <div className={style.filterSection}>
              <h3>Categorias</h3>
              <div className={style.categoryList}>
                {categorias.map((categoria, index) => (
                  <button
                    key={index}
                    className={`${style.categoryButton} ${selectedCategory === categoria ? style.categoryButtonActive : ''}`}
                    onClick={() => setSelectedCategory(categoria)}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            <div className={style.filterSection}>
              <h3>Preço</h3>
              <div className={style.priceRange}>
                <span className={style.priceLabel}>Até R$ {priceRange}</span>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className={style.rangeSlider} 
                />
                <div className={style.priceValues}>
                  <span>R$ 5</span>
                  <span>R$ 50</span>
                </div>
              </div>
            </div>

            <div className={style.filterSection}>
              <h3>Status</h3>
              <label className={style.filterCheckbox}>
                <input 
                  type="checkbox" 
                  checked={showFeatured}
                  onChange={(e) => setShowFeatured(e.target.checked)}
                />
                <span className={style.checkmark}></span>
                Em destaque
              </label>
              <label className={style.filterCheckbox}>
                <input 
                  type="checkbox" 
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                />
                <span className={style.checkmark}></span>
                Em promoção
              </label>
            </div>

            <div className={style.filterActions}>
              <button className={style.filterButton}>Aplicar Filtros</button>
              <button className={style.filterReset} onClick={resetFilters}>Limpar</button>
            </div>
          </aside>

          {/* Lista de produtos */}
          <section className={style.productsSection}>
            <div className={style.productsHeader}>
              <h2>
                {selectedCategory === "Todas" ? "Todos os Medicamentos" : selectedCategory}
                <span className={style.productCount}> ({sortedProducts.length} produtos)</span>
              </h2>
              <div className={style.sortOptions}>
                <label>Ordenar por:</label>
                <select 
                  className={style.sortSelect}
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="padrao">Padrão</option>
                  <option value="preco-menor">Preço: Menor ao maior</option>
                  <option value="preco-maior">Preço: Maior ao menor</option>
                  <option value="destaque">Destaques</option>
                  <option value="nome">Nome A-Z</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className={style.noProducts}>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou termos de busca</p>
                <button className={style.filterButton} onClick={resetFilters}>
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className={`${style.productsGrid} ${viewMode === "list" ? style.listView : ""}`}>
                  {sortedProducts.map(produto => (
                    <div key={produto.id} className={style.productCard}>
                      <div className={style.productImageContainer}>
                        <div className={style.imageWrapper}>
                          <Image
                            src={produto.imagem}
                            width={200}
                            height={200}
                            alt={produto.nome}
                            className={style.productImage}
                          />
                        </div>
                        {produto.destaque && <span className={style.featuredBadge}>Destaque</span>}
                        {produto.promocao && <span className={style.saleBadge}>-30%</span>}
                        <button 
                          className={`${style.wishlistBtn} ${wishlist.includes(produto.id) ? style.inWishlist : ''}`}
                          onClick={() => toggleWishlist(produto.id)}
                        >
                          {wishlist.includes(produto.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <div className={style.productInfo}>
                        <span className={style.productCategory}>{produto.categoria}</span>
                        <h3>{produto.nome}</h3>
                        <p>{produto.descricao}</p>
                        <div className={style.productPrice}>
                          <span className={style.price}>R$ {produto.preco.toFixed(2)}</span>
                          {produto.promocao && (
                            <span className={style.originalPrice}>R$ {(produto.preco * 1.3).toFixed(2)}</span>
                          )}
                        </div>
                        <button 
                          className={style.addToCartBtn}
                          onClick={() => addToCart(produto)}
                        >
                          <span className={style.cartIcon}>🛒</span> Adicionar ao carrinho
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                <div className={style.pagination}>
                  <button className={style.pageButton}>
                    <span className={style.chevronLeft}>‹</span>
                  </button>
                  <button className={`${style.pageButton} ${style.active}`}>1</button>
                  <button className={style.pageButton}>2</button>
                  <button className={style.pageButton}>3</button>
                  <button className={style.pageButton}>
                    <span className={style.chevronRight}>›</span>
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* Mini barra de ações flutuante */}
      <div className={style.floatingActions}>
        <button className={style.floatingCart}>
          <span className={style.cartIcon}>🛒</span>
          <span className={style.cartCount}>{cartItems}</span>
        </button>
        <button 
          className={style.floatingFilter}
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <span className={style.filterIcon}>⚙️</span>
        </button>
      </div>
    </div>
  );
}