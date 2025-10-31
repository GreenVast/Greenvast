type Role = 'farmer' | 'investor' | 'buyer';

interface Profile {
  name?: string;
  phone?: string;
  county?: string;
  subCounty?: string;
  language?: string;
  farmingType?: string;
  email?: string;
}

interface MockUser {
  email: string;
  password: string;
  role: Role;
  profile?: Profile;
}

const users: MockUser[] = [
  // seeded users (no real personal names)
  { email: 'farmer@gmail.com', password: '123', role: 'farmer', profile: { name: '', phone: '', county: '', language: 'en', farmingType: '', email: 'farmer@gmail.com' } },
  { email: 'investor@gmail.com', password: '123', role: 'investor', profile: { name: 'Investor', email: 'investor@gmail.com' } },
  { email: 'buyer@gmail.com', password: '123', role: 'buyer', profile: { name: 'Buyer', phone: '', county: '', email: 'buyer@gmail.com' } },
];

export function findUser(email: string, password?: string) {
  if (password === undefined) return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
}

export function addUser(user: MockUser) {
  const exists = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error('User already exists');
  users.push(user);
  return user;
}

export function getAllUsers() {
  return users.slice();
}
