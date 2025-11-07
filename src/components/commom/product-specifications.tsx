import {
  ProductSpecification,
  groupSpecifications,
  formatSpecificationValue,
} from "@/lib/product-specifications";

interface ProductSpecificationsProps {
  specifications: ProductSpecification;
  className?: string;
}

export default function ProductSpecifications({
  specifications,
  className = "",
}: ProductSpecificationsProps) {
  if (!specifications) {
    return null;
  }

  const groupedSpecs = groupSpecifications(specifications);
  const groupNames = Object.keys(groupedSpecs);

  return (
    <div className={className}>
      <div className="space-y-6">
        {groupNames.map((groupName) => {
          const specs = groupedSpecs[groupName];

          return (
            <div key={groupName} className="">
              {/* Título da Seção */}
              <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide pb-1">
                {groupName}
              </h3>

              {/* Grid de Especificações */}
              <div className="grid">
                {specs.map(({ key, label, value }) => (
                  <div
                    key={key}
                    className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 py-1"
                  >
                    <span className="text-xs font-semibold text-gray-600">
                      {label}
                    </span>
                    <span className="text-xs text-gray-900 font-normal">
                      {formatSpecificationValue(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
