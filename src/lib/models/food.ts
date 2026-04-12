export type FoodCategory = 'vegie' | 'fruit' | 'red_meat' | 'fish' | 'packaged' | 'other';
export type FoodState = 'fresh' | 'frozen' | 'opened' | 'sealed';
export type StorageLocation = 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper';

export interface FoodItem {
	id: string;
	name: string;
	category: FoodCategory;
	state: FoodState;
	storageLocation: StorageLocation;
	enteredAt: string; // ISO date string
	userExpiryDate?: string; // ISO date string
	bestBefore: string; // ISO date string (calculated)
	notified: boolean;
	amount?: string;
}
