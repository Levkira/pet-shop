import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'scratcher',
    imageUrl: '/images/scratcher.jpg',
    title: 'Scratcher',
    price: 19.99,
    description:
      'The cat scratcher features thick, eco-friendly, high-quality cardboard. Solid and durable, neat and tidy. With this cat lounge toy, your cat has its own place for scratching, protecting your furniture so you never have to worry about damage.',
    rating: 4.6,
    reviewCount: 128,
    reviews: [
      {
        id: 'scratcher-review-1',
        author: 'Priya M.',
        rating: 5,
        comment: 'My cat attacked it within minutes of unboxing. Holding up well after three months.',
      },
      {
        id: 'scratcher-review-2',
        author: 'Dan O.',
        rating: 4,
        comment: 'Good quality cardboard, just wish it came in a bigger size for larger cats.',
      },
    ],
  },
  {
    id: 'pet-hanging-bed',
    imageUrl: '/images/cat_hammock.jpg',
    title: 'Pet Hanging Bed',
    price: 10.99,
    description:
      'Ideal for small or medium sized pets. Can be used both indoors and outdoors. Durable, raised-floor construction that stays comfortable for your pet. Comes in separate pieces you simply snap together with screws, with anchors placed to mitigate swaying so your cat has peace of mind while resting.',
    rating: 4.2,
    reviewCount: 64,
    reviews: [
      {
        id: 'pet-hanging-bed-review-1',
        author: 'Sam K.',
        rating: 4,
        comment: 'Assembly took about 15 minutes. Sturdier than I expected for the price.',
      },
      {
        id: 'pet-hanging-bed-review-2',
        author: 'Leah T.',
        rating: 4,
        comment: 'My dog was skeptical at first but now naps in it every afternoon.',
      },
    ],
  },
  {
    id: 'tunnel',
    imageUrl: '/images/cat_tunnel.jpg',
    title: 'Tunnel',
    price: 16.99,
    description:
      'Soft, comfortable material. An extension tunnel for hiding out, exercising, or sleeping. Taffeta fabric with a bright appearance, smooth feel, and easy cleaning. A strong, solid sprung-steel frame pops out and retracts easily for portable fun and easy storage.',
    rating: 4.8,
    reviewCount: 211,
    reviews: [
      {
        id: 'tunnel-review-1',
        author: 'Rosa V.',
        rating: 5,
        comment: 'Collapses flat for storage which is exactly what I needed in a small apartment.',
      },
      {
        id: 'tunnel-review-2',
        author: 'Ahmed F.',
        rating: 5,
        comment: 'Three cats fight over this daily. Fabric has held up to a lot of claws.',
      },
    ],
  },
  {
    id: 'house-stool',
    imageUrl: '/images/cat_house_bed_stool.jpg',
    title: 'House Stool',
    price: 48.99,
    description:
      'A dual-use cat house and foot stool: a comfortable space for your cat to hide, and a soft resting place for small dogs or cats. Super soft and warm, so your pet feels happy inside it. Requires home assembly.',
    rating: 4.0,
    reviewCount: 37,
    reviews: [
      {
        id: 'house-stool-review-1',
        author: 'Grace P.',
        rating: 3,
        comment: 'Nice looking piece of furniture but the assembly instructions could be clearer.',
      },
      {
        id: 'house-stool-review-2',
        author: 'Tom H.',
        rating: 5,
        comment: 'Doubles as an actual footstool which sold me on it. My cat approves too.',
      },
    ],
  },
  {
    id: 'house-scratcher',
    imageUrl: '/images/hoopet.jpg',
    title: 'House Scratcher',
    price: 17.99,
    description:
      'A triangle-shaped design that stays stable and will not shake. Environmentally friendly materials that are safe for your cat. The small size makes it suitable for kittens and puppies; one side is a scratching board, and a ball toy offers cats even more fun.',
    rating: 4.4,
    reviewCount: 89,
    reviews: [
      {
        id: 'house-scratcher-review-1',
        author: 'Nina S.',
        rating: 4,
        comment: 'Great for a kitten. Might be too small once she grows up but perfect for now.',
      },
      {
        id: 'house-scratcher-review-2',
        author: 'Marco L.',
        rating: 5,
        comment: 'The ball toy on the side is a nice touch — keeps my kitten entertained for hours.',
      },
    ],
  },
  {
    id: 'set-of-cats-toys',
    imageUrl: '/images/cats_toys.jpg',
    title: "Set of Cat's Toys",
    price: 5.7,
    description:
      'A fantastic toy for playing with cats. Cats are always fond of plush-made toys, and you will have fun with it too — the stick can be stretched for long-distance play.',
    rating: 4.3,
    reviewCount: 156,
    reviews: [
      {
        id: 'set-of-cats-toys-review-1',
        author: 'Julia B.',
        rating: 4,
        comment: 'Cheap and cheerful. Not the most durable but great value for the price.',
      },
      {
        id: 'set-of-cats-toys-review-2',
        author: 'Chris D.',
        rating: 5,
        comment: 'Bought three sets because my cats keep losing pieces under the couch.',
      },
    ],
  },
];
