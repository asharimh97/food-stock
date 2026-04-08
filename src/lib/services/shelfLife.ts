import type { FoodCategory, FoodState, StorageLocation } from '../models/food';

// Shelf life heuristics in days
export function calculateBestBefore(
  enteredAt: string,
  category: FoodCategory,
  state: FoodState,
  location: StorageLocation,
  userExpiryDate?: string
): string {
  if (category === 'packaged') {
    if (state === 'sealed' && userExpiryDate) {
      return userExpiryDate;
    }
    if (state === 'opened') {
      const entry = new Date(enteredAt);
      const openedExpiry = new Date(entry.getTime() + 6 * 24 * 60 * 60 * 1000);
      if (userExpiryDate) {
        const userProvided = new Date(userExpiryDate);
        return openedExpiry < userProvided ? openedExpiry.toISOString() : userProvided.toISOString();
      }
      return openedExpiry.toISOString();
    }
    // Fallback if no userExpiryDate is given but labeled as packaged
    if (userExpiryDate) return userExpiryDate;
  }

  // Treat fresh in freezer as frozen, frozen in chiller/shelf as fresh
  const effectiveState = location === 'freezer' ? 'frozen' : 'fresh';

  let days = 7; // Default

  switch (category) {
    case 'red_meat':
      days = effectiveState === 'frozen' ? 180 : 3;
      break;
    case 'fish':
      days = effectiveState === 'frozen' ? 180 : 2;
      break;
    case 'vegie':
      days = effectiveState === 'frozen' ? 240 : 7;
      break;
    case 'fruit':
      days = effectiveState === 'frozen' ? 240 : 10;
      break;
    case 'other':
    default:
      days = effectiveState === 'frozen' ? 180 : 7;
      break;
  }

  const result = new Date(enteredAt);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}
