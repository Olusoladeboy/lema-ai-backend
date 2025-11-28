export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  address?: string; // Formatted address: "street, state, city, zipcode"
}
