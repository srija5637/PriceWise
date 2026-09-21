import { parseProductQuery, areVariantsMatching } from '../lib/products';

describe('Product Normalization and Matching Engine', () => {
  test('parseProductQuery identifies brand, model, storage, and color', () => {
    const parsed = parseProductQuery('Apple iPhone 16 128GB Black');
    expect(parsed.brand).toBe('Apple');
    expect(parsed.storage).toBe('128GB');
    expect(parsed.color).toBe('black');
  });

  test('areVariantsMatching recognizes identical product with different string formats', () => {
    const titleA = 'Apple iPhone 16 128GB Black';
    const titleB = 'iPhone 16 128 GB Black';
    expect(areVariantsMatching(titleA, titleB)).toBe(true);
  });

  test('areVariantsMatching STRICTLY separates distinct storage variants', () => {
    const variant128 = 'Apple iPhone 16 128GB Black';
    const variant256 = 'Apple iPhone 16 256GB Black';
    // 128GB must NEVER match 256GB!
    expect(areVariantsMatching(variant128, variant256)).toBe(false);
  });

  test('areVariantsMatching separates different models', () => {
    const iphone = 'Apple iPhone 16 128GB';
    const galaxy = 'Samsung Galaxy S25 128GB';
    expect(areVariantsMatching(iphone, galaxy)).toBe(false);
  });
});
