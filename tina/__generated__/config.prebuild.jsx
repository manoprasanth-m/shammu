// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // =====================
      // CATEGORIES (Parent/Top-Level)
      // =====================
      {
        name: "categories",
        label: "\u{1F4C1} Categories (Parent)",
        path: "content/categories",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Category Name",
            required: true,
            description: 'Name of this main/parent category (e.g., "Home Decor", "Apparel")'
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL-friendly name (lowercase, hyphens instead of spaces)"
          }
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            }
          }
        }
      },
      // =====================
      // SUBCATEGORIES (Children of Categories)
      // =====================
      {
        name: "subcategories",
        label: "\u{1F4C2} Subcategories (Children)",
        path: "content/subcategories",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Subcategory Name",
            required: true,
            description: 'Name of this subcategory (e.g., "Wall Art" under "Home Decor")'
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL-friendly name (lowercase, hyphens instead of spaces)"
          },
          {
            type: "reference",
            name: "parentCategory",
            label: "\u2B06\uFE0F Parent Category",
            required: true,
            collections: ["categories"],
            description: "Select which main category this subcategory belongs to"
          }
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            }
          }
        }
      },
      // =====================
      // PRODUCTS
      // =====================
      {
        name: "products",
        label: "\u{1F6CD}\uFE0F Products",
        path: "content/products",
        format: "json",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Product Name",
            required: true
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL-friendly name (lowercase, hyphens instead of spaces)"
          },
          {
            type: "reference",
            name: "category",
            label: "\u{1F4C1} Category",
            required: true,
            collections: ["categories"],
            description: "Select the main/parent category for this product"
          },
          {
            type: "reference",
            name: "subcategory",
            label: "\u{1F4C2} Subcategory (optional)",
            collections: ["subcategories"],
            description: "Optionally select a subcategory within the parent category"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
            required: true
          },
          {
            type: "object",
            name: "images",
            label: "Additional Images",
            list: true,
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image"
              }
            ]
          },
          {
            type: "boolean",
            name: "active",
            label: "Active",
            description: "Set to false to hide this product"
          }
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            }
          }
        },
        defaultItem: () => ({
          active: true
        })
      },
      // =====================
      // FULFILLED ORDERS
      // =====================
      {
        name: "fulfilledOrders",
        label: "\u2705 Fulfilled Orders",
        path: "content/fulfilled-orders",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Image",
            required: true
          }
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title?.toLowerCase().replace(/ /g, "-") || "";
            }
          }
        }
      }
    ]
  }
});
export {
  config_default as default
};
