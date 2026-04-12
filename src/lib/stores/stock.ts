import { writable } from 'svelte/store';
import type { FoodItem } from '../models/food';
import { db } from '../firebase';
import {
	collection,
	onSnapshot,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
	type QuerySnapshot,
	type QueryDocumentSnapshot,
	FirestoreError
} from 'firebase/firestore';

function createStockStore() {
	const { subscribe, set, update } = writable<FoodItem[]>([]);

	if (typeof window !== 'undefined') {
		try {
			const colRef = collection(db, 'family_fridge_items');
			onSnapshot(
				colRef,
				(snapshot: QuerySnapshot) => {
					const items: FoodItem[] = [];
					snapshot.forEach((doc: QueryDocumentSnapshot) => {
						items.push({ id: doc.id, ...doc.data() } as FoodItem);
					});
					set(items);
				},
				(error: FirestoreError) => {
					console.error(
						'Firestore config error or permission denied (check Firestore Security Rules!).',
						error
					);
				}
			);
		} catch (e) {
			console.warn('Firebase config is missing or invalid. Falling back to empty state.', e);
		}
	}

	return {
		subscribe,
		add: async (item: FoodItem) => {
			// Optimistic update
			update((items) => [...items, item]);

			if (typeof window !== 'undefined') {
				try {
					const docRef = doc(db, 'family_fridge_items', item.id);
					await setDoc(docRef, item);
				} catch (e) {
					console.error('Failed to add to Firebase. Check Security Rules:', e);
				}
			}
		},
		updateItem: async (id: string, partial: Partial<FoodItem>) => {
			update((items) => items.map((item) => (item.id === id ? { ...item, ...partial } : item)));

			if (typeof window !== 'undefined') {
				try {
					const docRef = doc(db, 'family_fridge_items', id);
					await updateDoc(docRef, partial);
				} catch (e) {
					console.error('Failed to update Firebase. Check Security Rules:', e);
				}
			}
		},
		remove: async (id: string) => {
			update((items) => items.filter((item) => item.id !== id));

			if (typeof window !== 'undefined') {
				try {
					const docRef = doc(db, 'family_fridge_items', id);
					await deleteDoc(docRef);
				} catch (e) {
					console.error('Failed to delete from Firebase. Check Security Rules:', e);
				}
			}
		}
	};
}

export const stock = createStockStore();
