# ERPCore | Advanced Enterprise Resource Planning Suite

A high-performance, industrial-grade ERP dashboard built with **Next.js 14**. This project offering high-density data environment for managing global inventory and personnel.



## 🚀 Core Features

### 📦 Precision Inventory & Logistics
* **Multi-Warehouse Management:** Real-time stock tracking across "Warehouse A", "Warehouse B", and "Distribution Centers".
* **Automated Fiscal Logic:** Dynamic tax liability calculations ($Price \times Stock \times (1 + TaxRate)$) calculated on the fly.
* **Inventory Health:** Visual indicators for "Low Stock" and "Out of Stock" states with optimistic UI updates.
* **Audit-Ready Exports:** One-click CSV generation for physical warehouse reconciliations.

### 👥 Human Capital Management
* **Personnel Lifecycle:** Full tracking for departments including Engineering, Operations, and Finance.
* **Role-Based Access Control (RBAC):** Integrated `PermissionGate` components to ensure only authorized roles (Admin/Manager) can modify sensitive records.
* **Status Monitoring:** Real-time visibility into employee availability (Active, On Leave, Terminated).

### 📱 Responsive "Hybrid" Architecture
* **Adaptive Viewports:** Seamlessly transitions from high-density **Data Tables** (Desktop) to **Mobile Action Cards** (Mobile).
* **Modern UX:** Built with a dark-mode first approach using Tailwind CSS and Radix UI primitives.

## 🛠️ Technical Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript (Strict Type Safety)
* **State Management:** TanStack Query (React Query)
* **UI Components:** Shadcn UI + Tailwind CSS
* **Icons & Data Viz:** Lucide React + Recharts
* **API Handling:** Axios + Mock Service Worker (MSW) logic



## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/jyraut/ERPcore.git]
    cd erp-core
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` for local network testing (Mobile debugging):
    ```env
    NEXT_PUBLIC_API_URL=http://your-local-ip:3000/api
    ```

4.  **Launch Development Server:**
    ```bash
    npm run dev
    ```

## 🔒 Security & Data Integrity
* **Permission Gates:** Conditional rendering based on user role strings.
* **Skeleton States:** Sophisticated loading states to prevent Layout Shift (CLS).
* **Validation:** Strict TypeScript interfaces for all `Product` and `Employee` objects.

---

**Developed with a focus on Scalability, Maintainability, and Enterprise UX.**