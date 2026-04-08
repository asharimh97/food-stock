import { writable } from 'svelte/store';
import type { FoodItem } from '../models/food';

const STORAGE_KEY = 'fridge_stock_pwa_data';

function createStockStore() {
  // Safe initial hydration (only in browser)
  let initial: FoodItem[] = [];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        initial = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stock from local storage", e);
      }
    }
  }

  const { subscribe, set, update } = writable<FoodItem[]>(initial);

  return {
    subscribe,
    add: (item: FoodItem) => {
      update((items) => {
        const newItems = [...items, item];
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        }
        return newItems;
      });
    },
    updateItem: (id: string, partial: Partial<FoodItem>) => {
      update((items) => {
        const newItems = items.map(item => item.id === id ? { ...item, ...partial } : item);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        }
        return newItems;
      });
    },
    remove: (id: string) => {
      update((items) => {
        const newItems = items.filter(item => item.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        }
        return newItems;
      });
    }
  };
}

export const stock = createStockStore();
