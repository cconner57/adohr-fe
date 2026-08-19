import type { IWishlistItem } from '@/models/wishlist'

export const MOCK_WISHLIST: IWishlistItem[] = [
  {
    id: 'w1',
    name: 'Kitten Formula (KMR)',
    category: 'food',
    priority: 'urgent',
    description: 'Essential for bottle-baby kittens without a mother.',
    estimatedCost: '$15-20',
    icon: '🍼'
  },
  {
    id: 'w2',
    name: 'Puppy Kibble',
    category: 'food',
    priority: 'high',
    description: 'High-protein dry food for growing pups.',
    estimatedCost: '$30-45',
    icon: '🥣'
  },
  {
    id: 'w3',
    name: 'Senior Wet Food',
    category: 'food',
    priority: 'medium',
    description: 'Soft food for older dogs and cats with dental issues.',
    estimatedCost: '$25-35',
    icon: '🥫'
  },
  {
    id: 'w4',
    name: 'Training Treats',
    category: 'food',
    priority: 'low',
    description: 'Soft, smelly treats for positive reinforcement training.',
    estimatedCost: '$10-15',
    icon: '🥓'
  },
  {
    id: 'w5',
    name: 'Flea & Tick Prevention',
    category: 'medical',
    priority: 'urgent',
    description: 'Monthly topical treatments for incoming rescues.',
    estimatedCost: '$45-60',
    icon: '🦟'
  },
  {
    id: 'w6',
    name: 'Dewormer (Panacur)',
    category: 'medical',
    priority: 'urgent',
    description: 'Critical medication for treating parasites in new arrivals.',
    estimatedCost: '$20-30',
    icon: '💊'
  },
  {
    id: 'w7',
    name: 'Eye Drops (Terramycin)',
    category: 'medical',
    priority: 'high',
    description: 'Ointment for kittens with eye infections.',
    estimatedCost: '$18-25',
    icon: '👁️'
  },
  {
    id: 'w8',
    name: 'Ear Cleaner',
    category: 'medical',
    priority: 'medium',
    description: 'Gentle cleansing solution for dirty or infected ears.',
    estimatedCost: '$12-18',
    icon: '👂'
  },
  {
    id: 'w9',
    name: 'First-Aid Kit',
    category: 'medical',
    priority: 'medium',
    description: 'Gauze, wrap, and antiseptic for minor scrapes.',
    estimatedCost: '$25-35',
    icon: '🚑'
  },
  {
    id: 'w10',
    name: 'Fleece Blankets',
    category: 'comfort',
    priority: 'high',
    description: 'Soft, washable blankets to keep animals warm.',
    estimatedCost: '$10-20',
    icon: '🧣'
  },
  {
    id: 'w11',
    name: 'Crate Pads',
    category: 'comfort',
    priority: 'medium',
    description: 'Supportive bedding for recovering dogs.',
    estimatedCost: '$25-40',
    icon: '🛏️'
  },
  {
    id: 'w12',
    name: 'Calming Spray (Adaptil/Feliway)',
    category: 'comfort',
    priority: 'low',
    description: 'Pheromone sprays to help anxious pets settle in.',
    estimatedCost: '$20-30',
    icon: '🌬️'
  },
  {
    id: 'w13',
    name: 'Heating Pads (Snuggle Safe)',
    category: 'comfort',
    priority: 'urgent',
    description: 'Microwaveable heating discs for neonates.',
    estimatedCost: '$30-35',
    icon: '🔥'
  },
  {
    id: 'w14',
    name: 'Enzyme Cleaner (Nature\'s Miracle)',
    category: 'cleaning',
    priority: 'high',
    description: 'Essential for cleaning up accidents in foster homes.',
    estimatedCost: '$15-25',
    icon: '🫧'
  },
  {
    id: 'w15',
    name: 'Clumping Litter',
    category: 'cleaning',
    priority: 'urgent',
    description: 'Unscented clumping litter for our foster cats.',
    estimatedCost: '$18-25',
    icon: '🐈'
  },
  {
    id: 'w16',
    name: 'Puppy Pee Pads',
    category: 'cleaning',
    priority: 'high',
    description: 'For un-vaccinated puppies learning to potty.',
    estimatedCost: '$20-30',
    icon: '🧻'
  },
  {
    id: 'w17',
    name: 'Laundry Detergent (Free & Clear)',
    category: 'cleaning',
    priority: 'medium',
    description: 'Unscented detergent for washing endless rescue bedding.',
    estimatedCost: '$12-18',
    icon: '🧺'
  },
  {
    id: 'w18',
    name: 'Soft Pet Carriers',
    category: 'transport',
    priority: 'high',
    description: 'For safely transporting cats and small dogs to vet appointments.',
    estimatedCost: '$30-45',
    icon: '🎒'
  },
  {
    id: 'w19',
    name: 'Collapsible Wire Crates',
    category: 'transport',
    priority: 'medium',
    description: 'Medium and large crates for adoption events.',
    estimatedCost: '$45-75',
    icon: '🪤'
  },
  {
    id: 'w20',
    name: 'Car Seat Covers',
    category: 'transport',
    priority: 'low',
    description: 'Waterproof covers to protect volunteer vehicles.',
    estimatedCost: '$25-40',
    icon: '🚗'
  },
  {
    id: 'w21',
    name: 'Kong Toys',
    category: 'toys',
    priority: 'high',
    description: 'Durable rubber toys for stuffing with treats to keep dogs busy.',
    estimatedCost: '$10-18',
    icon: '🦴'
  },
  {
    id: 'w22',
    name: 'Feather Wands',
    category: 'toys',
    priority: 'medium',
    description: 'Interactive toys to help shy cats build confidence.',
    estimatedCost: '$8-12',
    icon: '🪶'
  },
  {
    id: 'w23',
    name: 'Puzzle Feeders',
    category: 'toys',
    priority: 'low',
    description: 'Mental enrichment for high-energy fosters.',
    estimatedCost: '$15-25',
    icon: '🧩'
  },
  {
    id: 'w24',
    name: 'Nyla Chew Toys',
    category: 'toys',
    priority: 'medium',
    description: 'Tough chews for anxious or teething dogs.',
    estimatedCost: '$12-20',
    icon: '🦷'
  }
]
