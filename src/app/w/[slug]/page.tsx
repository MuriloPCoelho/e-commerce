import Header from "@/components/commom/header";
import ProductCard from "@/components/commom/product-card";
import { db } from "@/db";
import { categoriesTable, productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categoriesTable.findFirst({
    where: eq(categoriesTable.slug, slug),
  });

  if (!category) return notFound();

  const products = await db.query.productsTable.findMany({
    where: eq(productsTable.categoryId, category.id),
    with: {
      variants: {
        with: {
          color: true,
        }
      },
    },
  });

  return (
    <>
      <Header />
      <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{category.name}</h1>
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
