import { z } from 'zod';

const createOrderZodSchema = z.object({
     body: z.object({
          customer: z.string({
               required_error: 'Customer ID is required',
          }),
          products: z.array(
               z.object({
                    product: z.string({
                         required_error: 'Product ID is required',
                    }),
                    quantity: z
                         .number({
                              required_error: 'Quantity is required',
                         })
                         .min(1),
                    price: z
                         .number({
                              required_error: 'Price is required',
                         })
                         .min(0),
                    totalAmount: z
                         .number({
                              required_error: 'Subtotal is required',
                         })
                         .min(0),
               }),
          ),
          shippingAddress: z.object({
               street: z.string({
                    required_error: 'Street is required',
               }),
               city: z.string({
                    required_error: 'City is required',
               }),
               state: z.string({
                    required_error: 'State is required',
               }),
               postalCode: z.string({
                    required_error: 'Postal code is required',
               }),
               country: z.string({
                    required_error: 'Country is required',
               }),
          }),
          paymentMethod: z.string({
               required_error: 'Payment method is required',
          }),
          notes: z.string().optional(),
     }),
});

const updateOrderZodSchema = z.object({
     body: z.object({
          orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
     }),
});

export const OrderValidation = {
     createOrderZodSchema,
     updateOrderZodSchema,
};
