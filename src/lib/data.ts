import fs from 'fs';
import path from 'path';

export interface Category {
  title: string;
  slug: string;
}

export interface Product {
  name: string;
  slug: string;
  category: string;
  description?: string;
  mainImage: string;
  images?: string[];
  active: boolean;
}

const CATEGORIES_DIR = path.join(process.cwd(), 'content/categories');
const PRODUCTS_DIR = path.join(process.cwd(), 'content/products');

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

export function getProductsByCategory(categorySlug: string): Product[] {
  const allProducts = getAllProducts();
  return allProducts.filter((product) => product.category === categorySlug);
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
