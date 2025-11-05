/**
 * Supported filter types
 */
export interface ProductFilters {
  gender?: "men" | "women" | "unisex";
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  collectionSlug?: string;
  onSale?: boolean;
}

export function parseFilters(filters: string[]): ProductFilters {
  const result: ProductFilters = {};

  if (!filters || filters.length === 0) return result;

  const [first, second, third] = filters;

  switch (first) {
    case "men":
    case "women":
    case "unisex":
      result.gender = first;

      if (second) {
        result.categorySlug = second;

        if (third) {
          result.subcategorySlug = third;
        }
      }
      break;

    case "categories":
      if (second) {
        result.categorySlug = second;

        if (third) {
          result.subcategorySlug = third;
        }
      }
      break;

    case "brands":
      if (second) {
        result.brandSlug = second;
      }
      break;

    case "collections":
      if (second) {
        result.collectionSlug = second;
      }
      break;

    case "sale":
      result.onSale = true;

      if (second && ["men", "women", "unisex"].includes(second)) {
        result.gender = second as "men" | "women" | "unisex";
      }

      if (
        second &&
        second !== "men" &&
        second !== "women" &&
        second !== "unisex"
      ) {
        result.categorySlug = second;
      }
      break;

    default:
      result.categorySlug = first;
      if (second) {
        result.subcategorySlug = second;
      }
      break;
  }

  return result;
}

export function generatePageTitle(filters: ProductFilters): string {
  const parts: string[] = [];

  if (filters.onSale) {
    parts.push("Sale");
  }

  if (filters.gender) {
    parts.push(
      filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)
    );
  }

  if (filters.subcategorySlug) {
    parts.push(
      filters.subcategorySlug.charAt(0).toUpperCase() +
        filters.subcategorySlug.slice(1)
    );
  } else if (filters.categorySlug) {
    parts.push(
      filters.categorySlug.charAt(0).toUpperCase() +
        filters.categorySlug.slice(1)
    );
  }

  if (filters.brandSlug) {
    parts.push(
      filters.brandSlug.charAt(0).toUpperCase() + filters.brandSlug.slice(1)
    );
  }

  if (filters.collectionSlug) {
    parts.push(
      filters.collectionSlug.charAt(0).toUpperCase() +
        filters.collectionSlug.slice(1)
    );
  }

  return parts.length > 0 ? parts.join(" - ") : "Products";
}
