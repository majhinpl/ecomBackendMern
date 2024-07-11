export interface OderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  paymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    pidx?: string;
  };
  items: OrderDetails[];
}

export interface OrderDetails {
  quantity: number;
  productId: string;
}

export enum PaymentMethod {
  Columnod = "cod",
  Khalti = "khalti",
}

export enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
}

export interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}
