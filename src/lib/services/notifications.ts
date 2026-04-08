import { stock } from '../stores/stock';
import type { FoodItem } from '../models/food';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function checkExpiringItems(items: FoodItem[]) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  
  const now = new Date();
  now.setHours(0,0,0,0);
  
  // 1 day from now
  const upcomingThreshold = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); 
  
  const expiringSoon = items.filter(item => {
    if (item.notified) return false;
    const expiry = new Date(item.bestBefore);
    return expiry.getTime() <= upcomingThreshold.getTime();
  });
  
  if (expiringSoon.length > 0) {
    let bodyText = expiringSoon.map(i => i.name).join(', ');
    if (bodyText.length > 50) {
      bodyText = bodyText.substring(0, 47) + '...';
    }
    
    new Notification('Fridge Stock Alert', {
      body: `${bodyText} expiring soon or already expired!`,
      icon: '/pwa-192.png'
    });
    
    expiringSoon.forEach(item => {
      stock.updateItem(item.id, { notified: true });
    });
  }
}
