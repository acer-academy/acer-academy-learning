import { SubjectEnum } from '@acer-academy-learning/data-access';
import { z } from 'zod';

const phoneRegex = /^(6|8|9)\d{7}$/;

export const studentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  subjects: z
    .array(z.nativeEnum(SubjectEnum))
    .min(1, 'You must select at least one subject.'),
  school: z.string().trim().min(1, 'School cannot be empty.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number cannot be empty.')
    .regex(phoneRegex, 'Please enter a valid phone number.'),
});

export const passwordChangeSchema = z
  .object({
    password: z.string().min(1, 'Password cannot be empty.'),
    confirmPassword: z.string().min(1, 'Confirm Password cannot be empty.'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
      });
    }
  });

export const parentProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number cannot be empty.')
    .regex(phoneRegex, 'Please enter a valid phone number.'),
});

export const firstNameSchema = z.object({
  firstName: z.string().trim().min(1, 'First Name cannot be empty.'),
});
export const lastNameSchema = z.object({
  lastName: z.string().trim().min(1, 'Last Name cannot be empty.'),
});
export const subjectsSchema = z.object({
  subjects: z
    .array(z.nativeEnum(SubjectEnum))
    .min(1, 'You must select at least one subject.'),
});
export const schoolSchema = z.object({
  school: z.string().trim().min(1, 'First Name cannot be empty.'),
});
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone Number cannot be empty.')
    .regex(phoneRegex, 'Please enter a valid phone number.'),
});
