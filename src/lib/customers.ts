export type Customer = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
};

export const customers: Customer[] = [
  {
    id: 1,
    name: "Ali Karimov",
    email: "ali@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Vali Tursunov",
    email: "vali@gmail.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Sardor Ergashev",
    email: "sardor@gmail.com",
    status: "Active",
  },
];