import { z } from 'zod'

export const signInSchema = z.object({
  identifier: z.string().nonempty({ message: 'Email/Username is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});