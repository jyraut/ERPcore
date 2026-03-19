import { http, HttpResponse, delay } from "msw";
import { Product } from "@/features/inventory/types";
import { Employee } from "@/features/employees/types";
import { Transaction } from "@/features/finance/types";
import { AuditLog } from "@/features/audit/types";

// We use 'let' so we can push new items into the array
let mockProducts: Product[] = [
  {
    id: "1",
    sku: "SKU-001",
    name: "Industrial Turbine",
    category: "Heavy Machinery",
    stock: 12,
    price: 4500,
    status: "In Stock",
    warehouse: "Warehouse A",
    taxRate: 0.15,
  },
  {
    id: "2",
    sku: "SKU-002",
    name: "Bearing Kit",
    category: "Parts",
    stock: 3,
    price: 120,
    status: "Low Stock",
    warehouse: "Warehouse B",
    taxRate: 0.08,
  },
  {
    id: "3",
    sku: "SKU-003",
    name: "Sealant Gasket",
    category: "Consumables",
    stock: 0,
    price: 15,
    status: "Out of Stock",
    warehouse: "Distribution Center",
    taxRate: 0.05,
  },
  {
    id: "4",
    sku: "SKU-004",
    name: "Hydraulic Pump",
    category: "Heavy Machinery",
    stock: 8,
    price: 2100,
    status: "In Stock",
    warehouse: "Warehouse A",
    taxRate: 0.15,
  },
];
let mockEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Senior Dev",
    role: "System Admin",
    department: "Engineering",
    email: "admin@erpcore.com",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: "emp-2",
    name: "Sarah Chen",
    role: "Inventory Manager",
    department: "Operations",
    email: "s.chen@erpcore.com",
    status: "Active",
    joinDate: "2024-03-10",
  },
  {
    id: "emp-3",
    name: "Marcus Thorne",
    role: "Chief Financial Officer",
    department: "Finance",
    email: "m.thorne@erpcore.com",
    status: "Active",
    joinDate: "2023-11-05",
  },
  {
    id: "emp-4",
    name: "Elena Rodriguez",
    role: "UX Designer",
    department: "Engineering",
    email: "e.rodriguez@erpcore.com",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: "emp-5",
    name: "David Kim",
    role: "Warehouse Supervisor",
    department: "Operations",
    email: "d.kim@erpcore.com",
    status: "On Leave",
    joinDate: "2024-01-22",
  },
  {
    id: "emp-6",
    name: "Aisha Patel",
    role: "QA Engineer",
    department: "Engineering",
    email: "a.patel@erpcore.com",
    status: "Active",
    joinDate: "2024-04-01",
  },
  {
    id: "emp-7",
    name: "James Wilson",
    role: "Accountant",
    department: "Finance",
    email: "j.wilson@erpcore.com",
    status: "Active",
    joinDate: "2023-09-15",
  },
  {
    id: "emp-8",
    name: "Lucia Rossi",
    role: "Logistics Coordinator",
    department: "Operations",
    email: "l.rossi@erpcore.com",
    status: "Active",
    joinDate: "2024-05-12",
  },
  {
    id: "emp-9",
    name: "Jordan Smith",
    role: "DevOps Engineer",
    department: "Engineering",
    email: "j.smith@erpcore.com",
    status: "Active",
    joinDate: "2024-02-28",
  },
  {
    id: "emp-10",
    name: "Maria Garcia",
    role: "HR Manager",
    department: "Operations",
    email: "m.garcia@erpcore.com",
    status: "Terminated",
    joinDate: "2023-08-10",
  },
  {
    id: "emp-11",
    name: "Kevin Zhang",
    role: "Financial Analyst",
    department: "Finance",
    email: "k.zhang@erpcore.com",
    status: "Active",
    joinDate: "2024-06-01",
  },
  {
    id: "emp-12",
    name: "Sophie Muller",
    role: "Frontend Developer",
    department: "Engineering",
    email: "s.muller@erpcore.com",
    status: "Active",
    joinDate: "2024-03-15",
  }
];
let mockTransactions: Transaction[] = [
  {
    id: "t1",
    date: "2024-03-01",
    category: "Inventory",
    description: "Turbine Parts Bulk Order",
    amount: 12500,
    type: "EXPENSE",
  },
  {
    id: "t2",
    date: "2024-03-05",
    category: "Sales",
    description: "Client Project Alpha Payment",
    amount: 45000,
    type: "INCOME",
  },
  {
    id: "t3",
    date: "2024-03-15",
    category: "Payroll",
    description: "Monthly Salary Batch",
    amount: 28000,
    type: "EXPENSE",
  },
];
const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: new Date().toISOString(),
    user: { name: "Sarah Chen", role: "Admin" },
    action: "UPDATE",
    module: "FINANCE",
    description: "Approved Q1 Budget Forecast",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: { name: "James Wilson", role: "Manager" },
    action: "CREATE",
    module: "INVENTORY",
    description: "Added 50x Industrial Turbines to stock",
  },
  {
    id: "log-3",
    timestamp: new Date().toISOString(),
    user: { name: "Admin User", role: "Superuser" },
    action: "UPDATE",
    module: "INVENTORY",
    description: "Modified 'Industrial Turbine' pricing",
    metadata: {
      previousState: { price: 450, stock: 12, status: "IN_STOCK" },
      newState: { price: 599, stock: 12, status: "LIMITED" },
    },
  },
];
export const handlers = [
  // 1. COMBINED GET: Handles both "Fetch All" and "Search/Filter"
  http.get("/api/inventory", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("q")?.toLowerCase();

    let filteredProducts = [...mockProducts];

    // If there is a 'q' parameter, filter the list
    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search),
      );
    }

    await delay(search ? 400 : 1000); // Snappy for search, realistic for load
    return HttpResponse.json(filteredProducts);
  }),

  // 2. POST: Add a new product
  http.post("/api/inventory", async ({ request }) => {
    const newProductData = (await request.json()) as Omit<Product, "id">;
    const newProduct: Product = {
      ...newProductData,
      id: Math.random().toString(36).substr(2, 9),
      category: "General",
    };
    mockProducts = [newProduct, ...mockProducts];
    await delay(800);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // 3. PATCH: Update stock levels
  http.patch("/api/inventory/:id", async ({ params, request }) => {
    const { id } = params;
    const { newStock } = (await request.json()) as { newStock: number };
    const product = mockProducts.find((p) => p.id === id);
    if (product) {
      product.stock = newStock;
      product.status =
        newStock > 5 ? "In Stock" : newStock > 0 ? "Low Stock" : "Out of Stock";
      await delay(500);
      return HttpResponse.json(product, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // 4. DELETE: Remove product
  http.delete("/api/inventory/:id", async ({ params }) => {
    const { id } = params;
    mockProducts = mockProducts.filter((p) => p.id !== id);
    await delay(500);
    return new HttpResponse(null, { status: 204 });
  }),

  //EMPLOYEES

  http.get("/api/employees", async () => {
    await delay(800);
    return HttpResponse.json(mockEmployees);
  }),

  // 1. ADD THIS: POST handler for new employees
  http.post("/api/employees", async ({ request }) => {
    const newEmployeeData = (await request.json()) as any;

    // Create a full employee object based on your type
    const newEmployee = {
      ...newEmployeeData,
      id: `emp-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
      status: "Active", // Default status
      joinDate: new Date().toISOString().split("T")[0], // Today's date (YYYY-MM-DD)
    };

    // Push into our local "database" variable
    mockEmployees = [newEmployee, ...mockEmployees];

    await delay(800); // Simulate network latency
    return HttpResponse.json(newEmployee, { status: 201 });
  }),
  http.delete("/api/employees/:id", async ({ params }) => {
    const { id } = params;

    // Filter out the employee from our local array
    mockEmployees = mockEmployees.filter((emp) => emp.id !== id);

    await delay(500);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/finance/transactions", async () => {
    await delay(600);
    return HttpResponse.json(mockTransactions);
  }),

  http.get("/api/audit-logs", () => {
    return HttpResponse.json(mockAuditLogs);
  }),
];
