export type Customer = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
};

const API_URL =
  "https://jsonplaceholder.typicode.com/users";

// Barcha mijozlarni olish
export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Customers yuklanmadi");
  }

  return (await response.json()) as Customer[];
}


// Bitta mijozni ID orqali olish
export async function getCustomer(
  id: string
): Promise<Customer | null> {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const response = await fetch(`${API_URL}/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Customer yuklanmadi");
  }

  const customer = (await response.json()) as Customer;

  return customer?.id ? customer : null;
}