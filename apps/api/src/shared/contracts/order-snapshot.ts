export interface OrderAddressSnapshot {
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
}

export interface OrderProductSnapshot {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  format: "vinyl" | "cd" | "cassette";
  image: {
    url: string;
    altText: string | null;
  } | null;
}
