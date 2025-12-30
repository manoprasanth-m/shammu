import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getAllProducts, getAllCategories, getSubcategories } from '@/lib/data';
import { Product, CategoryWithSubs } from '@/lib/types';

interface SearchPageProps {
    allProducts: Product[];
    categoryTree: CategoryWithSubs[];
}

export default function SearchPage({ allProducts, categoryTree }: SearchPageProps) {
    const router = useRouter();
    const { q } = router.query;
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(true);

    useEffect(() => {
        if (router.isReady) {
            const query = (q as string || '').toLowerCase();
            if (query) {
                const filtered = allProducts.filter((product) =>
                    product.name.toLowerCase().includes(query) ||
                    (product.description && product.description.toLowerCase().includes(query))
                );
                setResults(filtered);
            } else {
                setResults([]);
            }
            setIsSearching(false);
        }
    }, [router.isReady, q, allProducts]);

    return (
        <Layout title={`Search Results for "${q || ''}" | Mal's Mandi`}>
            <div className="container py-12">
                <h1 className="text-3xl font-bold text-secondary mb-8">
                    Search Results for "{q}"
                </h1>

                {isSearching ? (
                    <div className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((product) => (
                            <ProductCard key={product.slug} product={product} categoryTree={categoryTree} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">No items found</h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find anything matching "{q}". Try different keywords or browse our categories.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
    const allProducts = getAllProducts();

    // Build category tree mostly for ProductCard
    const parentCategories = getAllCategories();
    const categoryTree: CategoryWithSubs[] = parentCategories.map((parent) => ({
        ...parent,
        subcategories: getSubcategories(parent.slug),
    }));

    return {
        props: {
            allProducts,
            categoryTree,
        },
    };
};
