import { writable } from 'svelte/store';
import type { FoodItem } from '../models/food';

export const selectedFoodItem = writable<FoodItem | null>(null);
