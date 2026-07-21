export interface AdminDashboardStats {
  totalProducts: number;
  totalOrders: number;

  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  cancelledOrders: number;

  totalUsers: number;
}
