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
      {
        name: "categories",
        label: "Categories",
        path: "content/categories",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
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
            name: "parentCategory",
            label: "Parent Category (leave empty for top-level)",
            collections: ["categories"]
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
      {
        name: "products",
        label: "Products",
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
            label: "Category",
            required: true,
            collections: ["categories"]
          },
          {
            type: "reference",
            name: "subcategory",
            label: "Subcategory (optional)",
            collections: ["categories"]
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
      {
        name: "fulfilledOrders",
        label: "Fulfilled Orders",
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
