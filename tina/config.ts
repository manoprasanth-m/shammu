import { defineConfig } from 'tinacms';

const branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'categories',
        label: 'Categories',
        path: 'content/categories',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug',
            required: true,
            description: 'URL-friendly name (lowercase, hyphens instead of spaces)',
          },
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, '-') || '';
            },
          },
        },
      },
      {
        name: 'products',
        label: 'Products',
        path: 'content/products',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Product Name',
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Slug',
            required: true,
            description: 'URL-friendly name (lowercase, hyphens instead of spaces)',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
            options: [
              { value: 'customized-gifts', label: 'Customized Gifts' },
              { value: 'apparel', label: 'Apparel' },
              { value: 'bags', label: 'Bags' },
              { value: 'jewelry', label: 'Jewelry' },
              { value: 'paintings', label: 'Paintings' },
              { value: 'art-prints', label: 'Art Prints' },
              { value: 'wall-decor', label: 'Wall Decor' },
              { value: 'home-decor', label: 'Home Decor' },
              { value: 'home-furnishings', label: 'Home Furnishings' },
              { value: 'kitchen-dining', label: 'Kitchen & Dining' },
              { value: 'stationery-office', label: 'Stationery & Office' },
              { value: 'kids-baby', label: 'Kids & Baby' },
              { value: 'events-parties', label: 'Events & Parties' },
              { value: 'custom-requests', label: 'Custom Requests' },
              { value: 'seasonal-decor', label: 'Seasonal Decor' },
            ],
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'mainImage',
            label: 'Main Image',
            required: true,
          },
          {
            type: 'object',
            name: 'images',
            label: 'Additional Images',
            list: true,
            fields: [
              {
                type: 'image',
                name: 'src',
                label: 'Image',
              },
            ],
          },
          {
            type: 'boolean',
            name: 'active',
            label: 'Active',
            description: 'Set to false to hide this product',
          },
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, '-') || '';
            },
          },
        },
        defaultItem: () => ({
          active: true,
        }),
      },
    ],
  },
});
