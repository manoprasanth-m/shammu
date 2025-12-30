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
    const [displayCount, setDisplayCount] = useState(20);

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
                setDisplayCount(prev => prev + 20);
            }
        }, { threshold: 0.5 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [filteredProducts]);

    // Reset display count when filters change
    useEffect(() => {
        setDisplayCount(20);
    }, [searchQuery, selectedCategory]);

    const visibleProducts = filteredProducts.slice(0, displayCount);

    return (
        <Layout title="All Products | Mal's Mandi">
            <div className="bg-secondary text-white py-12 mb-8">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold mb-2">All Products</h1>
                    <p className="text-gray-300">Explore our complete collection of handcrafted treasures</p>
                </div>
            </div>

            <div className="container pb-20">
                {/* Filters & Search Toolbar */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm sticky top-20 z-40">

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                        />
                        <svg
                            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category Chips - Simplified Horizontal Scroll */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === null
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Items
                        </button>
                        {categoryTree.map(cat => (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat.slug
                                        ? 'bg-accent text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                        {/* Flatten subcategories for easy access in filter list too? Optional, but let's stick to parents for main filter to keep it clean */}
                    </div>
                </div>

                {/* Results Info */}
                <div className="mb-6 text-gray-500 text-sm">
                    Showing {Math.min(displayCount, filteredProducts.length)} of {filteredProducts.length} results
                </div>

                {/* Product Grid */}
                {visibleProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
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
