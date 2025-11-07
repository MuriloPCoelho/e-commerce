export interface BaseSpecification {
  weight: string;
  warranty: string;
}

// ==================== ROUPAS ====================
export interface ClothingSpecification extends BaseSpecification {
  type: "clothing";
  material: string[];
  composition: string[]; // Ex: ["80% Algodão", "20% Poliéster"]
  fabricType?: string; // Ex: "Malha", "Moletom", "Jersey"
  fit?: "regular" | "slim" | "oversized" | "loose" | "tight";
  neckline?: string; // Ex: "Gola careca", "Gola V"
  sleeveLength?: "short" | "long" | "sleeveless" | "3/4";
  pattern?: string; // Ex: "Liso", "Estampado", "Listrado"
  technologies?: string[]; // Ex: ["Dri-FIT", "UV Protection"]
  season?: "summer" | "winter" | "all-season";
  washInstructions?: string[];
  measurements?: {
    chestWidth?: string; // Por tamanho
    length?: string;
    shoulderWidth?: string;
  };
}

// ==================== CALÇADOS ====================
export interface FootwearSpecification extends BaseSpecification {
  type: "footwear";
  upperMaterial: string; // Ex: "Couro sintético", "Mesh"
  soleMaterial: string; // Ex: "Borracha", "EVA"
  innerMaterial?: string; // Ex: "Tecido respirável"
  closure: "lace" | "velcro" | "slip-on" | "zipper" | "buckle";
  heelHeight?: string; // Ex: "3cm"
  platformHeight?: string;
  cushioning?: string; // Ex: "Air Max", "Boost", "React"
  technologies?: string[]; // Ex: ["Nike Air", "Flyknit"]
  recommendedUse?: string[]; // Ex: ["Corrida", "Academia", "Casual"]
  terrain?: "road" | "trail" | "indoor" | "mixed";
  waterproof?: boolean;
  flexibility?: "low" | "medium" | "high";
}

// ==================== ACESSÓRIOS ====================
export interface AccessorySpecification extends BaseSpecification {
  type: "accessory";
  material: string[]; // Ex: ["Couro", "Metal", "Tecido"]
  composition?: string; // Ex: "100% Couro"
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    depth?: string;
  };
  capacity?: string; // Para mochilas/bolsas
  pockets?: number; 
  closure?: string; // Ex: "Zíper", "Velcro", "Magnético"
  adjustable?: boolean;
  waterResistant?: boolean;
  features?: string[]; // Ex: ["Compartimento para notebook", "Porta-garrafa"]
}

export interface WatchSpecification extends BaseSpecification {
  movementType: "quartz" | "automatic" | "digital" | "smart";
  displayType: "analog" | "digital" | "hybrid";
  strapMaterial: string;
  caseMaterial: string;
  glassType?: string; // Ex: "Cristal de safira", "Mineral"
  waterResistance?: string; // Ex: "5 ATM", "50m"
  features?: string[]; // Ex: ["Cronógrafo", "GPS", "Monitor cardíaco"]
  batteryLife?: string;
  connectivity?: string[]; // Para smartwatches: ["Bluetooth", "WiFi"]
}

// ==================== ESPORTIVOS ====================
export interface SportsEquipmentSpecification extends BaseSpecification {
  type: "sports-equipment";
  material: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    diameter?: string;
  };
  sportType: string; // Ex: "Futebol", "Basquete", "Natação"
  skillLevel?: "beginner" | "intermediate" | "advanced" | "professional";
  certification?: string[]; // Ex: ["FIFA Approved", "FIVB Official"]
  durability?: string;
}

// ==================== UNIÃO DE TODOS OS TIPOS ====================
export type ProductSpecification =
  | ClothingSpecification
  | FootwearSpecification
  | AccessorySpecification
  | WatchSpecification
  | SportsEquipmentSpecification;

// ==================== HELPERS ====================

/**
 * Labels legíveis para exibição na UI
 */
export const specificationLabels: Record<string, string> = {
  // Comuns
  countryOfOrigin: "País de Origem",
  brand: "Marca",
  sku: "SKU",
  careInstructions: "Instruções de Cuidado",

  // Roupas
  material: "Material",
  composition: "Composição",
  fabricType: "Tipo de Tecido",
  weight: "Peso",
  fit: "Modelagem",
  neckline: "Gola",
  sleeveLength: "Comprimento da Manga",
  pattern: "Padrão",
  technologies: "Tecnologias",
  season: "Estação",
  washInstructions: "Instruções de Lavagem",
  measurements: "Medidas",

  // Calçados
  upperMaterial: "Material do Cabedal",
  soleMaterial: "Material da Sola",
  innerMaterial: "Material Interno",
  closure: "Fechamento",
  heelHeight: "Altura do Salto",
  platformHeight: "Altura da Plataforma",
  cushioning: "Amortecimento",
  recommendedUse: "Indicado Para",
  terrain: "Terreno",
  waterproof: "À Prova D'água",
  breathable: "Respirável",
  flexibility: "Flexibilidade",

  // Acessórios
  dimensions: "Dimensões",
  capacity: "Capacidade",
  pockets: "Bolsos",
  adjustable: "Ajustável",
  waterResistant: "Resistente à Água",
  features: "Características",

  // Jóias e Relógios
  stoneType: "Tipo de Pedra",
  warranty: "Garantia",
  movementType: "Tipo de Movimento",
  displayType: "Tipo de Display",
  strapMaterial: "Material da Pulseira",
  caseMaterial: "Material da Caixa",
  glassType: "Tipo de Vidro",
  waterResistance: "Resistência à Água",
  batteryLife: "Duração da Bateria",
  connectivity: "Conectividade",

  // Esportivos
  sportType: "Esporte",
  skillLevel: "Nível de Habilidade",
  certification: "Certificações",
  durability: "Durabilidade",
};

/**
 * Tradução de valores enum para português
 */
export const specificationValues: Record<string, Record<string, string>> = {
  fit: {
    regular: "Regular",
    slim: "Ajustado",
    oversized: "Oversized",
    loose: "Folgado",
    tight: "Justo",
  },
  sleeveLength: {
    short: "Curta",
    long: "Longa",
    sleeveless: "Sem Manga",
    "3/4": "3/4",
  },
  season: {
    summer: "Verão",
    winter: "Inverno",
    "all-season": "Todas as Estações",
  },
  closure: {
    lace: "Cadarço",
    velcro: "Velcro",
    "slip-on": "Slip-on",
    zipper: "Zíper",
    buckle: "Fivela",
  },
  terrain: {
    road: "Asfalto",
    trail: "Trilha",
    indoor: "Indoor",
    mixed: "Misto",
  },
  flexibility: {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  },
  movementType: {
    quartz: "Quartzo",
    automatic: "Automático",
    digital: "Digital",
    smart: "Smart",
  },
  displayType: {
    analog: "Analógico",
    digital: "Digital",
    hybrid: "Híbrido",
  },
  skillLevel: {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
    professional: "Profissional",
  },
};

/**
 * Formata o valor da especificação para exibição
 */
export function formatSpecificationValue(key: string, value: any): string {
  if (value === null || value === undefined) return "-";

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${specificationLabels[k] || k}: ${v}`)
      .join(" | ");
  }

  // Verifica se tem tradução de valor
  if (specificationValues[key]?.[value]) {
    return specificationValues[key][value];
  }

  return String(value);
}

/**
 * Agrupa especificações por seção para melhor organização visual
 */
export function groupSpecifications(specs: ProductSpecification) {
  const groups: Record<
    string,
    Array<{ key: string; label: string; value: any }>
  > = {};

  Object.entries(specs).forEach(([key, value]) => {
    if (key === "type" || value === null || value === undefined) return;

    let groupName = "Informações Gerais";

    // Roupas
    if (
      [
        "material",
        "composition",
        "fabricType",
        "weight",
        "fit",
        "neckline",
        "sleeveLength",
        "pattern",
      ].includes(key)
    ) {
      groupName = "Material e Tecido";
    } else if (
      ["technologies", "season", "washInstructions", "measurements"].includes(
        key
      )
    ) {
      groupName = "Características";
    }

    // Calçados
    else if (
      ["upperMaterial", "soleMaterial", "innerMaterial", "weight"].includes(key)
    ) {
      groupName = "Materiais";
    } else if (
      [
        "cushioning",
        "technologies",
        "flexibility",
        "waterproof",
        "breathable",
      ].includes(key)
    ) {
      groupName = "Tecnologia e Conforto";
    } else if (["recommendedUse", "terrain"].includes(key)) {
      groupName = "Uso Recomendado";
    }

    // Acessórios
    else if (["dimensions", "capacity", "pockets", "features"].includes(key)) {
      groupName = "Detalhes do Produto";
    }

    // Relógios
    else if (
      [
        "movementType",
        "displayType",
        "waterResistance",
        "batteryLife",
      ].includes(key)
    ) {
      groupName = "Características Técnicas";
    }

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push({
      key,
      label: specificationLabels[key] || key,
      value,
    });
  });

  return groups;
}
