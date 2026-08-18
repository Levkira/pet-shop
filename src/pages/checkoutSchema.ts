import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  address: z.string().trim().min(5, 'Enter a shipping address'),
  cardNumber: z
    .string()
    .trim()
    .regex(/^(\d[ -]*){13,19}$/, 'Enter a valid card number'),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
