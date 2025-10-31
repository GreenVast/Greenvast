interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  sellerEmail?: string;
}

const products: Product[] = [
  { id: 'p1', name: 'Maize (1 kg)', price: 120, image: undefined, sellerEmail: 'farmer@gmail.com' },
  { id: 'p2', name: 'Tomatoes (1 kg)', price: 80, image: undefined, sellerEmail: 'farmer@gmail.com' },
  { id: 'p3', name: 'Avocados (1 piece)', price: 50, image: undefined, sellerEmail: 'farmer@gmail.com' },
];

export function addProduct(p: Omit<Product, 'id'>) {
  const id = Date.now().toString();
  const prod = { id, ...p };
  products.unshift(prod);
  return prod;
}

export function listProducts() {
  return products.slice();
}
