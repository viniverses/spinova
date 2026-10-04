export interface Address {
  id: string;
  label: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressData {
  label: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface UpdateAddressData {
  label?: string;
  street?: string;
  number?: string;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
