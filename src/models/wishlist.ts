export type WishlistCategory = 'food' | 'medical' | 'comfort' | 'cleaning' | 'transport' | 'toys'
export type WishlistPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface IWishlistItem {
  id: string
  name: string
  title?: string
  category: WishlistCategory
  priority: WishlistPriority
  description: string
  estimatedCost: string
  priceEstimate?: string
  icon: string
  url?: string
}

export interface IRawWishlistItem {
  id: string
  title?: string
  name?: string
  category?: string
  priority?: string
  description?: string
  priceEstimate?: string
  estimatedCost?: string
  icon?: string
  url?: string
}

export interface IPublicWishlistResponse {
  count?: number
  items?: IRawWishlistItem[]
  data?: {
    items?: IRawWishlistItem[]
  }
  byCategory?: Record<string, IRawWishlistItem[]>
}
