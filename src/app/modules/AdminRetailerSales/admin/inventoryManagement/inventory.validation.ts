import { z } from 'zod';

const createProductZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Product name is required' }),
          quantity: z.number({ required_error: 'Quantity is required' }),
          price: z.number({ required_error: 'Price is required' }),
          category: z.string({ required_error: 'Category is required' }),
          description: z.string().optional(),
          reorderPoint: z.number().optional(),
     }),
});

const updateProductZodSchema = z.object({
     body: z.object({
          name: z.string().optional(),
          quantity: z.number().optional(),
          price: z.number().optional(),
          category: z.string().optional(),
          description: z.string().optional(),
          reorderPoint: z.number().optional(),
     }),
});
const updateProductQuantityZodSchema = z.object({
     body: z.object({
          quantity: z.number({ required_error: 'Quantity is required' }),
     }),
});
export const ProductValidation = {
     createProductZodSchema,
     updateProductZodSchema,
     updateProductQuantityZodSchema,
};
