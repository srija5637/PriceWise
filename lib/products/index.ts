// Product Normalization and Matching Engine for PriceWise

export interface ParsedProductQuery {
  rawQuery: string;
  brand?: string;
  model?: string;
  storage?: string;
  ram?: string;
  color?: string;
  screenSize?: string;
  categoryHint?: string;
  canonicalKey: string;
}

const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'OnePlus', 'Dell', 'HP', 'Lenovo', 'Asus',
  'Xiaomi', 'LG', 'Google', 'Nothing', 'Boat', 'Noise', 'Realme', 'Motorola',
  'Acer', 'Bose', 'Sennheiser', 'Canon', 'Nikon', 'PlayStation', 'Xbox', 'Nintendo',
  'Dyson', 'Philips', 'Nike', 'Adidas', 'Puma'
];

const STORAGE_REGEX = /\b(32|64|128|256|512)\s*(?:gb|gigabytes?)\b|\b(1|2)\s*(?:tb|terabytes?)\b/i;
const RAM_REGEX = /\b(4|6|8|12|16|18|24|32|64)\s*(?:gb|gigabytes?)\s*ram\b|\bram\s*(4|6|8|12|16|18|24|32|64)\s*gb\b/i;
const SCREEN_SIZE_REGEX = /\b(40|43|50|55|65|75|85)\s*(?:inch|"|'')\b|\b(13|14|15|16)\s*(?:inch|"|'')\b/i;
const COLOR_REGEX = /\b(black|white|blue|pink|green|silver|space gray|midnight|starlight|titanium|natural titanium|desert titanium|purple|yellow|gold|red)\b/i;

export function parseProductQuery(query: string): ParsedProductQuery {
  const trimmed = query.trim();
  let brand: string | undefined;
  let storage: string | undefined;
  let ram: string | undefined;
  let color: string | undefined;
  let screenSize: string | undefined;

  // 1. Detect Brand
  for (const b of KNOWN_BRANDS) {
    const regex = new RegExp(`\\b${b}\\b`, 'i');
    if (regex.test(trimmed)) {
      brand = b;
      break;
    }
  }

  // 2. Detect Storage
  const storageMatch = trimmed.match(STORAGE_REGEX);
  if (storageMatch) {
    storage = storageMatch[0].toUpperCase().replace(/\s+/g, '');
  }

  // 3. Detect RAM
  const ramMatch = trimmed.match(RAM_REGEX);
  if (ramMatch) {
    const digits = ramMatch[1] || ramMatch[2];
    ram = `${digits}GB RAM`;
  }

  // 4. Detect Screen Size
  const screenMatch = trimmed.match(SCREEN_SIZE_REGEX);
  if (screenMatch) {
    screenSize = screenMatch[0].replace(/["'']/g, '-inch');
  }

  // 5. Detect Color
  const colorMatch = trimmed.match(COLOR_REGEX);
  if (colorMatch) {
    color = colorMatch[0].toLowerCase();
  }

  // 6. Extract Model Name by cleaning extracted tags
  let cleaned = trimmed;
  if (brand) {
    cleaned = cleaned.replace(new RegExp(`\\b${brand}\\b`, 'gi'), '');
  }
  if (storage) {
    cleaned = cleaned.replace(new RegExp(STORAGE_REGEX.source, 'gi'), '');
  }
  if (ram) {
    cleaned = cleaned.replace(new RegExp(RAM_REGEX.source, 'gi'), '');
  }
  if (color) {
    cleaned = cleaned.replace(new RegExp(`\\b${color}\\b`, 'gi'), '');
  }
  if (screenSize) {
    cleaned = cleaned.replace(new RegExp(SCREEN_SIZE_REGEX.source, 'gi'), '');
  }

  const model = cleaned
    .replace(/[-_()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 7. Generate Canonical Matching Key
  // Note: Storage, RAM, and Screen Size are strict variant keys and must NEVER be merged!
  const keyParts = [
    brand?.toLowerCase() || 'unknown',
    model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    storage?.toLowerCase() || 'std',
    ram?.toLowerCase().replace(/\s+/g, '') || 'std'
  ];

  const canonicalKey = keyParts.filter(Boolean).join('::');

  return {
    rawQuery: query,
    brand,
    model: model || undefined,
    storage,
    ram,
    color,
    screenSize,
    canonicalKey,
  };
}

/**
 * Compare two product titles to check if they represent the exact same canonical product variant.
 * Strictly prevents false-positive merging when critical attributes (e.g. 128GB vs 256GB) differ.
 */
export function areVariantsMatching(titleA: string, titleB: string): boolean {
  const parsedA = parseProductQuery(titleA);
  const parsedB = parseProductQuery(titleB);

  // If storage is detected on either, they MUST match
  if (parsedA.storage && parsedB.storage && parsedA.storage !== parsedB.storage) {
    return false;
  }

  // If RAM is detected on either, they MUST match
  if (parsedA.ram && parsedB.ram && parsedA.ram !== parsedB.ram) {
    return false;
  }

  // If brands are specified and differ, they cannot match
  if (parsedA.brand && parsedB.brand && parsedA.brand.toLowerCase() !== parsedB.brand.toLowerCase()) {
    return false;
  }

  // Compare core model tokens
  if (parsedA.model && parsedB.model) {
    const tokensA = new Set(parsedA.model.toLowerCase().split(/\s+/).filter(t => t.length > 2));
    const tokensB = new Set(parsedB.model.toLowerCase().split(/\s+/).filter(t => t.length > 2));
    
    let intersection = 0;
    for (const t of tokensA) {
      if (tokensB.has(t)) intersection++;
    }

    const similarity = intersection / Math.max(tokensA.size, tokensB.size, 1);
    return similarity >= 0.6;
  }

  return false;
}
