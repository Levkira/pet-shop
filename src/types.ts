export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
}

export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface CartItem {
  id: string;
  amount: number;
}
