// Types that can be safely imported on both client and server

export interface Category {
    title: string;
    slug: string;
    parentCategory?: string; // Reference path like "content/categories/home-decor.json"
}

export interface Product {
    name: string;
    slug: string;
    category: string;  // Reference path like "content/categories/home-decor.json"
    subcategory?: string; // Reference path like "content/categories/wall-art.json"
    description?: string;
    mainImage: string;
    images?: string[];
    active: boolean;
}

export interface FulfilledOrder {
    title: string;
    image: string;
}

export interface CategoryWithSubs extends Category {
    subcategories: Category[];
}

// Pure utility function that can be used on both client and server
// Extracts slug from TinaCMS reference path (e.g., "content/categories/home-decor.json" -> "home-decor")
export function slugFromReference(ref: string | undefined): string | null {
    if (!ref) return null;
    const match = ref.match(/content\/categories\/(.+)\.json$/);
    return match ? match[1] : ref; // Fallback to ref itself if it's already a slug
}
