// Types that can be safely imported on both client and server

// Parent/top-level category
export interface Category {
    title: string;
    slug: string;
}

// Subcategory (child of a category)
export interface Subcategory {
    title: string;
    slug: string;
    parentCategory: string; // Reference path like "content/categories/home-decor.json"
}

export interface Product {
    name: string;
    slug: string;
    category: string;  // Reference path like "content/categories/home-decor.json"
    subcategory?: string; // Reference path like "content/subcategories/wall-art.json"
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
    subcategories: Subcategory[];
}

// Pure utility function that can be used on both client and server
// Extracts slug from TinaCMS reference path
export function slugFromReference(ref: string | undefined): string | null {
    if (!ref) return null;
    // Handle both categories and subcategories paths
    const catMatch = ref.match(/content\/categories\/(.+)\.json$/);
    if (catMatch) return catMatch[1];
    const subcatMatch = ref.match(/content\/subcategories\/(.+)\.json$/);
    if (subcatMatch) return subcatMatch[1];
    return ref; // Fallback to ref itself if it's already a slug
}

