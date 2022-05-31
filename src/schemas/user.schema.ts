import { object, string, number, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' }).min(6, 'Username must be more than 6 characters'),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export const updateMeSchema = object({
  body: object({
    username: string({}),
    role: string({}),
    deposit: number({}),
    password: string(),
    passwordConfirm: string()
  }).partial(),
})

export const loginUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' }).min(
      3,
      'Invalid email or password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password'
    ),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type UpdateMeInput = TypeOf<typeof updateMeSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
