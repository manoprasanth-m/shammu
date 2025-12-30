import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

interface SearchProduct {
    name: string;
    slug: string;
    image: string;
    category: string;
    subcategory?: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch all products for client-side search
        fetch('/api/search')
            .then((res) => res.json())
            .then((data) => setAllProducts(data))
            .catch((err) => console.error('Failed to load search index', err));

        // Handle clicking outside to close dropdown
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            const filtered = allProducts.filter((product) =>
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered.slice(0, 5)); // Limit to 5 suggestions
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-6 hidden md:block">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search for treasures..."
                    className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-accent transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </form>

            {isOpen && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                    {results.length > 0 ? (
                        <ul>
                            {results.map((product) => (
                                <li key={product.slug}>
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-secondary">{product.name}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full p-2 text-center text-xs font-medium text-accent hover:bg-gray-50 transition-colors"
                                >
                                    View all results for "{query}"
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
