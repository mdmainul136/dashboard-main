export interface RestaurantDish {
    id: string;
    name: string;
    description: string;
    price: string;
    category: "Appetizers" | "Mains" | "Desserts" | "Drinks";
    popularity: number; // 1-100
    growth: number; // percentage
    status: "Available" | "Sold Out";
}

export const restaurantDishes: RestaurantDish[] = [
    {
        id: "DISH-001",
        name: "Grilled Norwegian Salmon",
        description: "Fresh salmon filet served with asparagus and lemon butter sauce.",
        price: "$24.50",
        category: "Mains",
        popularity: 92,
        growth: 12.5,
        status: "Available",
    },
    {
        id: "DISH-002",
        name: "Truffle Mushroom Risotto",
        description: "Creamy arborio rice with wild mushrooms and white truffle oil.",
        price: "$18.99",
        category: "Mains",
        popularity: 88,
        growth: -2.1,
        status: "Available",
    },
    {
        id: "DISH-003",
        name: "Artisan Margherita Pizza",
        description: "Hand-tossed dough with San Marzano tomatoes and fresh buffalo mozzarella.",
        price: "$16.00",
        category: "Mains",
        popularity: 95,
        growth: 18.2,
        status: "Available",
    },
    {
        id: "DISH-004",
        name: "Wagyu Beef Burger",
        description: "Premium Wagyu beef on a brioche bun with caramelized onions.",
        price: "$21.00",
        category: "Mains",
        popularity: 91,
        growth: 8.4,
        status: "Available",
    },
    {
        id: "DISH-005",
        name: "Classic Caesar Salad",
        description: "Crispy romaine lettuce, parmesan shavings, and house-made dressing.",
        price: "$12.50",
        category: "Appetizers",
        popularity: 76,
        growth: 4.5,
        status: "Available",
    },
    {
        id: "DISH-006",
        name: "Lava Chocolate Cake",
        description: "Warm chocolate cake with a molten center and vanilla bean gelato.",
        price: "$9.00",
        category: "Desserts",
        popularity: 98,
        growth: 22.0,
        status: "Available",
    },
    {
        id: "DISH-007",
        name: "Passionfruit Mojito",
        description: "Fresh mint, lime, and tropical passionfruit syrup.",
        price: "$11.00",
        category: "Drinks",
        popularity: 84,
        growth: 11.3,
        status: "Available",
    },
    {
        id: "DISH-008",
        name: "Espresso Martini",
        description: "Cold brew espresso, vodka, and a hint of vanilla.",
        price: "$13.00",
        category: "Drinks",
        popularity: 89,
        growth: 15.6,
        status: "Available",
    },
];

export const restaurantOrders = [
    { id: "#TBL-12", customer: "Sophia Martinez", dish: "Norwegian Salmon", amount: "$49.50", status: "In Kitchen", time: "12:45 PM" },
    { id: "#TBL-05", customer: "James Harrison", dish: "Wagyu Burger", amount: "$21.00", status: "Delivered", time: "12:30 PM" },
    { id: "#WEB-991", customer: "Elena Korolev", dish: "Risotto + Margherita", amount: "$34.99", status: "Ready For Pickup", time: "1:10 PM" },
    { id: "#TBL-21", customer: "Marcus Chen", dish: "Salad + Drinks", amount: "$45.00", status: "Order Placed", time: "1:15 PM" },
    { id: "#WEB-992", customer: "Oliver Twist", dish: "Chocolate Cake", amount: "$9.00", status: "In Kitchen", time: "1:20 PM" },
];
