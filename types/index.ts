export type Customer = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  measurements: Measurements[];
};

export type Measurements = {
  id: string;
  type: string;
  notes: string;
  data: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};
