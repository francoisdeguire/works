import type { PhotoInput } from '@/lib/photography'

// v1 placeholders served from picsum.photos (matches the artifacts manifest
// convention). External URLs bypass Bunny's image processing; real photos
// uploaded to images.francois.works will use leading-slash paths instead.
const land = (slug: string) => `https://picsum.photos/seed/${slug}/1200/800` // 3:2
const port = (slug: string) => `https://picsum.photos/seed/${slug}/800/1200` // 2:3
const sqr = (slug: string) => `https://picsum.photos/seed/${slug}/1000/1000` // 1:1

export const photographyManifest: PhotoInput[] = [
  { slug: 'montreal-01', src: land('montreal-01'), alt: 'Snow-covered street at dusk', location: 'Montréal, QC', width: 1200, height: 800 },
  { slug: 'montreal-02', src: port('montreal-02'), alt: 'Iron staircase facade', location: 'Plateau Mont-Royal, QC', width: 800, height: 1200 },
  { slug: 'brooklyn-01', src: land('brooklyn-01'), alt: 'Bridge cables against sky', location: 'Brooklyn, NY', width: 1200, height: 800 },
  { slug: 'brooklyn-02', src: sqr('brooklyn-02'), alt: 'Empty diner counter', location: 'Williamsburg, NY', width: 1000, height: 1000 },
  { slug: 'lisbon-01', src: land('lisbon-01'), alt: 'Tiled wall pattern', location: 'Lisbon, Portugal', width: 1200, height: 800 },
  { slug: 'lisbon-02', src: port('lisbon-02'), alt: 'Tram on cobblestone hill', location: 'Alfama, Lisbon', width: 800, height: 1200 },
  { slug: 'tokyo-01', src: port('tokyo-01'), alt: 'Vending machine glow at night', location: 'Shibuya, Tokyo', width: 800, height: 1200 },
  { slug: 'tokyo-02', src: land('tokyo-02'), alt: 'Train platform reflection', location: 'Shinjuku, Tokyo', width: 1200, height: 800 },
  { slug: 'tokyo-03', src: sqr('tokyo-03'), alt: 'Convenience store entrance', location: 'Nakameguro, Tokyo', width: 1000, height: 1000 },
  { slug: 'paris-01', src: land('paris-01'), alt: 'Wet pavement under streetlight', location: 'Paris, France', width: 1200, height: 800 },
  { slug: 'paris-02', src: port('paris-02'), alt: 'Spiral staircase', location: 'Le Marais, Paris', width: 800, height: 1200 },
  { slug: 'reykjavik-01', src: land('reykjavik-01'), alt: 'Black sand beach', location: 'Vík, Iceland', width: 1200, height: 800 },
  { slug: 'reykjavik-02', src: sqr('reykjavik-02'), alt: 'Foggy lava field', location: 'Reykjanes, Iceland', width: 1000, height: 1000 },
  { slug: 'mexico-01', src: land('mexico-01'), alt: 'Painted house facades', location: 'Oaxaca, México', width: 1200, height: 800 },
  { slug: 'mexico-02', src: port('mexico-02'), alt: 'Market vendor at midday', location: 'Mercado de Abastos, Oaxaca', width: 800, height: 1200 },
  { slug: 'berlin-01', src: land('berlin-01'), alt: 'Empty U-Bahn corridor', location: 'Berlin, Germany', width: 1200, height: 800 },
  { slug: 'berlin-02', src: sqr('berlin-02'), alt: 'Brutalist concrete wall', location: 'Kreuzberg, Berlin', width: 1000, height: 1000 },
  { slug: 'osaka-01', src: port('osaka-01'), alt: 'Neon alley after rain', location: 'Dōtonbori, Osaka', width: 800, height: 1200 },
  { slug: 'quebec-01', src: land('quebec-01'), alt: 'Frozen river at dawn', location: 'Charlevoix, QC', width: 1200, height: 800 },
  { slug: 'quebec-02', src: land('quebec-02'), alt: 'Snow on pine boughs', location: 'Mont-Tremblant, QC', width: 1200, height: 800 },
  { slug: 'nyc-01', src: port('nyc-01'), alt: 'Steam rising from grate', location: 'Midtown, NY', width: 800, height: 1200 },
  { slug: 'london-01', src: land('london-01'), alt: 'Black cab in motion', location: 'Soho, London', width: 1200, height: 800 },
  { slug: 'london-02', src: sqr('london-02'), alt: 'Brick chimneys at dusk', location: 'Hackney, London', width: 1000, height: 1000 },
  { slug: 'amsterdam-01', src: port('amsterdam-01'), alt: 'Canal house reflection', location: 'Jordaan, Amsterdam', width: 800, height: 1200 },
]
