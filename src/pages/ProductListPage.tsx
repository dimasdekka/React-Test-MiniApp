import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { getProducts } from "../api/products";
import type { Product } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useProduct } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
const ITEMS_PER_PAGE = 12;
const TOTAL_PRODUCTS = 200;

export default function ProductListPage() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { newProducts } = useProduct();

  // New States for Sorting & Filtering
  const [sortByName, setSortByName] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const data = await getProducts(offset, ITEMS_PER_PAGE);
        setProducts(data);
      } catch {
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, [currentPage]);

  // removed local state event listener as it's now handled by ProductContext

  // useMemo untuk cache all current Product nya
  const allProducts = useMemo(() => {
    // Selalu sertakan newProducts saat pencarian aktif agar produk baru bisa ditemukan
    // Atau saat berada di halaman 1
    if (searchQuery.trim() || currentPage === 1) {
      return [...newProducts, ...products];
    }
    return products;
  }, [newProducts, products, currentPage, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query));
    }

    // Filter Mock (Price <= 50)
    if (filterActive) {
      result = result.filter((p) => p.price <= 50);
    }

    // Sort by Title
    if (sortByName) {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allProducts, searchQuery, sortByName, filterActive]);

  const totalPages = Math.ceil(TOTAL_PRODUCTS / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // RESET ke halaman 1 saat mencari
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Editorial Header Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-xs font-medium text-primary mb-2 tracking-widest uppercase">
            <span>StoreMini</span>
            <span
              className="material-symbols-outlined text-[10px]"
              data-icon="chevron_right"
            >
              chevron_right
            </span>
            <span className="text-on-surface-variant">Collections</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface leading-none mb-4 font-headline">
            Product Catalog
          </h1>
          <p className="text-on-surface-variant font-body text-base md:text-lg leading-relaxed opacity-80">
            A curated selection of high-end essentials, managed with surgical
            precision. Monitor stock levels, trends, and editorial placement.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`flex items-center gap-2 px-6 py-3 border text-sm font-manrope font-bold rounded-lg transition-all cursor-pointer ${
              filterActive
                ? "bg-primary text-white border-primary"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span
              className="material-symbols-outlined text-sm"
              data-icon="filter_list"
            >
              filter_list
            </span>
            {filterActive ? "Filter: ≤$50" : "Filter"}
          </button>
          <button
            onClick={() => setSortByName(!sortByName)}
            className={`flex items-center gap-2 px-6 py-3 border text-sm font-manrope font-bold rounded-lg transition-all cursor-pointer ${
              sortByName
                ? "bg-primary text-white border-primary"
                : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span
              className="material-symbols-outlined text-sm"
              data-icon="sort"
            >
              sort
            </span>
            {sortByName ? "Sorted A-Z" : "Sorted by Name"}
          </button>
        </div>
      </section>

      {/* Search using local searchbar matching Stitch logic component */}
      <div className="mb-10 max-w-xl">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all font-body text-lg"
            placeholder="Search within collection..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">
              progress_activity
            </span>
            <p className="text-sm text-outline font-body">
              Curating collection...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-error-container/20 rounded-2xl border border-error/10">
          <p className="text-error font-semibold mb-3 font-body">{error}</p>
          <button
            onClick={() => setCurrentPage(currentPage)}
            className="text-sm text-primary hover:text-primary-container font-bold cursor-pointer font-manrope"
          >
            Attempt Recovery
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/50">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
            inventory_2
          </span>
          <p className="text-on-surface-variant text-lg font-manrope font-semibold">
            {searchQuery
              ? `No artifacts matching "${searchQuery}"`
              : "The collection is currently empty"}
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid (Asymmetric & Editorial) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Skeleton / Add State Card */}
            {isAuthenticated && (
              <Link
                to="/products/new"
                className="group border-2 border-dashed border-outline-variant/50 rounded-lg flex flex-col items-center justify-center p-8 transition-all hover:bg-surface-container hover:border-primary/40 cursor-pointer min-h-[300px] h-full"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="add"
                  >
                    add
                  </span>
                </div>
                <p className="font-manrope font-bold text-lg text-on-surface text-center">
                  New Curated Item
                </p>
                <p className="text-xs text-on-surface-variant opacity-60 text-center mt-1">
                  Expansion of the Editorial line
                </p>
              </Link>
            )}
          </div>

          {/* Pagination */}
          {!searchQuery && (
            <div className="mt-16 pb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Floating Action Button (Contextual) */}
      {isAuthenticated && (
        <Link
          to="/products/new"
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        >
          <span className="material-symbols-outlined text-4xl" data-icon="add">
            add
          </span>
        </Link>
      )}
    </div>
  );
}
