import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '@/lib/data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = getAllProducts();

        // Return a simplified version of products for search
        const searchData = products.map((product) => ({
            name: product.name,
            slug: product.slug,
            image: product.mainImage,
            category: product.category,
            subcategory: product.subcategory
        }));

        res.status(200).json(searchData);
    } catch (error) {
        console.error('Search API Error:', error);
        res.status(500).json({ error: 'Failed to fetch search data' });
    }
}
