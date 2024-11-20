export interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity_available: number;
    available_date: number;
    registration_closing?: number;
  }
  
  export interface Order {
    id: number;
    food: FoodItem;
    quantity: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    timestamp: number;
  }
  