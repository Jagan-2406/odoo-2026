import { z } from 'zod';

export const carbonLogSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  source: z.enum(['purchase', 'manufacturing', 'expense', 'fleet'], {
    errorMap: () => ({ message: 'Please select a valid source category' }),
  }),
  activityValue: z
    .number({ invalid_type_error: 'Activity value must be a number' })
    .positive({ message: 'Value must be greater than zero' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  departmentId: z.string().min(1, { message: 'Department is required' }),
  emissionFactorId: z.string().min(1, { message: 'Emission factor is required' }),
});

export type CarbonLogFormValues = z.infer<typeof carbonLogSchema>;
export const defaultCarbonFormValues: CarbonLogFormValues = {
  date: new Date().toISOString().split('T')[0],
  source: 'purchase',
  activityValue: 0,
  unit: '',
  departmentId: '',
  emissionFactorId: '',
};
