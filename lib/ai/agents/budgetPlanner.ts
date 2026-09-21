import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';

export interface BudgetPlanItem {
  category: string;
  product: Product;
  price: number;
  bestStore: string;
  allocationPercentage: number;
}

export interface BudgetPlanResult {
  totalBudget: number;
  totalSpent: number;
  totalSaved: number;
  isFeasible: boolean;
  items: BudgetPlanItem[];
  recommendationSummary: string;
}

export function generateShoppingBudgetPlan(
  totalBudget: number,
  categories: string[]
): BudgetPlanResult {
  const all = getEnrichedProducts();
  const items: BudgetPlanItem[] = [];
  let currentSpent = 0;

  for (const cat of categories) {
    const matching = all
      .filter(
        (p) =>
          p.categoryId.toLowerCase().includes(cat.toLowerCase()) ||
          p.category?.slug.toLowerCase().includes(cat.toLowerCase()) ||
          p.name.toLowerCase().includes(cat.toLowerCase())
      )
      .sort((a, b) => (a.lowestPrice || 0) - (b.lowestPrice || 0));

    if (matching.length > 0) {
      // Pick best value within proportional remaining budget
      const picked = matching[0];
      const price = picked.lowestPrice || 0;
      items.push({
        category: cat,
        product: picked,
        price,
        bestStore: picked.bestOffer?.store.name || 'Top Store',
        allocationPercentage: 0,
      });
      currentSpent += price;
    }
  }

  // Calculate percentages
  for (const item of items) {
    item.allocationPercentage = currentSpent > 0 ? Math.round((item.price / currentSpent) * 100) : 0;
  }

  const remaining = totalBudget - currentSpent;
  const isFeasible = currentSpent <= totalBudget;

  const summary = isFeasible
    ? `Successfully assembled ${items.length} products within your ₹${totalBudget.toLocaleString('en-IN')} budget with ₹${remaining.toLocaleString('en-IN')} left over.`
    : `Total allocation of ₹${currentSpent.toLocaleString('en-IN')} exceeds your budget by ₹${Math.abs(remaining).toLocaleString('en-IN')}. Consider alternative entry-level variants.`;

  return {
    totalBudget,
    totalSpent: currentSpent,
    totalSaved: Math.max(0, remaining),
    isFeasible,
    items,
    recommendationSummary: summary,
  };
}
