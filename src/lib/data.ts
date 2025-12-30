import fs from 'fs';
import path from 'path';

// Re-export types and utility functions from types.ts
export type { Category, Product, FulfilledOrder, CategoryWithSubs, Subcategory } from './types';
export { slugFromReference } from './types';

import type { Category, Product, FulfilledOrder, Subcategory } from './types';
import { slugFromReference } from './types';

const CATEGORIES_DIR = path.join(process.cwd(), 'content/categories');
const SUBCATEGORIES_DIR = path.join(process.cwd(), 'content/subcategories');
const PRODUCTS_DIR = path.join(process.cwd(), 'content/products');
const FULFILLED_ORDERS_DIR = path.join(process.cwd(), 'content/fulfilled-orders');

// Get only top-level parent categories
export function getAllCategories(): Category[] {
  try {
    if (!fs.existsSync(CATEGORIES_DIR)) {
      return [];
    }
    const files = fs.readdirSync(CATEGORIES_DIR);
    const categories: Category[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(CATEGORIES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        categories.push(data);
      }
    }

    return categories.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

// Get all subcategories from the new subcategories collection
export function getAllSubcategories(): Subcategory[] {
  try {
    if (!fs.existsSync(SUBCATEGORIES_DIR)) {
      return [];
    }
    const files = fs.readdirSync(SUBCATEGORIES_DIR);
    const subcategories: Subcategory[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(SUBCATEGORIES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        subcategories.push(data);
      }
    }
    return subcategories.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading subcategories:', error);
    return [];
  }
}

// Get parent categories (alias for getAllCategories now, kept for compatibility)
export function getParentCategories(): Category[] {
  return getAllCategories();
}

// Get subcategories for a given parent category slug
export function getSubcategories(parentSlug: string): Subcategory[] {
  const allSubcategories = getAllSubcategories();
  return allSubcategories.filter((sub) => {
    const parentRef = slugFromReference(sub.parentCategory);
    return parentRef === parentSlug;
  });
}

// Get a top-level category by slug
export function getCategoryBySlug(slug: string): Category | null {
  try {
    const filePath = path.join(CATEGORIES_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading category:', error);
    return null;
  }
}

// Get a subcategory by slug
export function getSubcategoryBySlug(slug: string): Subcategory | null {
  try {
    const filePath = path.join(SUBCATEGORIES_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading subcategory:', error);
    return null;
  }
}

// Get the parent category for a given subcategory
export function getParentCategoryOf(subcategory: Subcategory): Category | null {
  if (!subcategory.parentCategory) return null;
  const parentSlug = slugFromReference(subcategory.parentCategory);
  return parentSlug ? getCategoryBySlug(parentSlug) : null;
}

// Build a full category path string
export function getCategoryPath(categorySlug: string | null, subcategorySlug: string | null): string {
  const parts: string[] = [];

  if (categorySlug) {
    const category = getCategoryBySlug(categorySlug);
    if (category) parts.push(category.title);
  }

  if (subcategorySlug) {
    const subcategory = getSubcategoryBySlug(subcategorySlug);
    if (subcategory) parts.push(subcategory.title);
  }

  return parts.join(' / ');
}

export function getAllProducts(): Product[] {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      return [];
    }
    const files = fs.readdirSync(PRODUCTS_DIR);
    const products: Product[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(PRODUCTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        if (data.active !== false) {
          products.push(data);
        }
      }
    }

    return products.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// Get products by category slug (matches either parent category or subcategory)
export function getProductsByCategory(slug: string): Product[] {
  const allProducts = getAllProducts();
  return allProducts.filter((product) => {
    const productCatSlug = slugFromReference(product.category);
    const productSubcatSlug = slugFromReference(product.subcategory);
    // Match if the category slug matches product's category OR subcategory
    return productCatSlug === slug || productSubcatSlug === slug;
  });
}

// Get products that belong to a parent category (including all its subcategories)
export function getProductsByParentCategory(parentSlug: string): Product[] {
  const allProducts = getAllProducts();
  const subcategories = getSubcategories(parentSlug);
  const subcategorySlugs = subcategories.map((s) => s.slug);

  return allProducts.filter((product) => {
    const productCatSlug = slugFromReference(product.category);
    const productSubcatSlug = slugFromReference(product.subcategory);

    // Match if product's category is the parent
    if (productCatSlug === parentSlug) return true;
    // Or if product's subcategory belongs to this parent
    if (productSubcatSlug && subcategorySlugs.includes(productSubcatSlug)) return true;

    return false;
  });
}

export function getProductBySlug(slug: string): Product | null {
  try {
    const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading product:', error);
    return null;
  }
}

export function getAllFulfilledOrders(): FulfilledOrder[] {
  try {
    if (!fs.existsSync(FULFILLED_ORDERS_DIR)) {
      return [];
    }
    const files = fs.readdirSync(FULFILLED_ORDERS_DIR);
    const orders: FulfilledOrder[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(FULFILLED_ORDERS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        orders.push(data);
      }
    }

    return orders;
  } catch (error) {
    console.error('Error reading fulfilled orders:', error);
    return [];
  }
}

