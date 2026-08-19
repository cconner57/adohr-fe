export type WishlistCategory = 'food' | 'medical' | 'comfort' | 'cleaning' | 'transport' | 'toys'
export type WishlistPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface IWishlistItem {
  id: string
  name: string
  category: WishlistCategory
  priority: WishlistPriority
  description: string
  estimatedCost: string
  icon: string  // emoji
}
