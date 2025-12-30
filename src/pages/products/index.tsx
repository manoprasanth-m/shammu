import { useState, useEffect, useMemo, useRef } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, getParentCategories, getSubcategories } from '@/lib/data';
import { Product, CategoryWithSubs, slugFromReference } from '@/lib/types';

interface AllProductsPageProps {
    products: Product[];
    categoryTree: CategoryWithSubs[];
}

export default function AllProductsPage({ products, categoryTree }: AllProductsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [displayCount, setDisplayCount] = useState(24);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = products;

        // 1. Text Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // 2. Category Filter
        if (selectedCategory) {
            result = result.filter(p => {
                const catSlug = slugFromReference(p.category);
                const subcatSlug = slugFromReference(p.subcategory);

                // Find if selected is parent
                const parentCat = categoryTree.find(c => c.slug === selectedCategory);
                if (parentCat) {
                    const subSlugs = parentCat.subcategories.map(s => s.slug);
                    return catSlug === selectedCategory || subSlugs.includes(catSlug || '') || subSlugs.includes(subcatSlug || '');
                }

                // Match exact subcategory
                return catSlug === selectedCategory || subcatSlug === selectedCategory;
            });
        }

        return result;
    }, [products, searchQuery, selectedCategory, categoryTree]);

    // Infinite Scroll logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setDisplayCount(prev => prev + 24);
            }
        }, { threshold: 0.5 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [filteredProducts]);

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(24);
    }, [searchQuery, selectedCategory]);

    const visibleProducts = filteredProducts.slice(0, displayCount);

    return (
        <Layout title="All Products | Mal's Mandi">
            <div className="bg-secondary text-white py-16 mb-10">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">All Products</h1>
                    <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                        Explore our complete collection of handcrafted treasures, curated for unique homes.
                    </p>
                </div>
            </div>

            <div className="container pb-20">
                {/* Filters & Search Toolbar - Sticky & Elevated */}
                <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm shadow-lg shadow-gray-100/50 p-4 rounded-2xl border border-gray-100 mb-10 transition-all">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

                        {/* Search Input */}
                        <div className="relative w-full md:w-96 group">
                            <input
                                type="text"
                                placeholder="Search for treasures..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-medium placeholder-gray-400 group-hover:bg-white group-hover:shadow-sm"
                            />
                            <svg
                                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-secondary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Category Chips - Professional Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 border ${selectedCategory === null
                                        ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                All Items
                            </button>
                            {categoryTree.map(cat => (
                                <button
                                    key={cat.slug}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 border ${selectedCategory === cat.slug
                                            ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="mb-8 flex items-center justify-between text-sm text-gray-500 font-medium px-2">
                    <span>Showing {Math.min(displayCount, filteredProducts.length)} of {filteredProducts.length} unique pieces</span>
                </div>

                {/* Product Grid */}
                {visibleProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.slug} product={product} categoryTree={categoryTree} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-xl text-gray-400 font-medium">No products found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                            className="mt-4 text-accent hover:underline font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                {visibleProducts.length < filteredProducts.length && (
                    <div ref={loadMoreRef} className="py-12 flex justify-center w-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps<AllProductsPageProps> = async () => {
    const products = getAllProducts();
    const parentCategories = getParentCategories();

    // Build category tree
    const categoryTree: CategoryWithSubs[] = parentCategories.map((parent) => ({
        ...parent,
        subcategories: getSubcategories(parent.slug),
    }));

    return {
        props: {
            products,
            categoryTree
        },
        revalidate: 60, // Incremental Static Regeneration every 60s
    };
};
