import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carbonLogSchema, CarbonLogFormValues, defaultCarbonFormValues } from '../schemas/carbon.schema';
import { useEmissionFactors, useCreateCarbonTransaction } from '../hooks/useCarbon';
import { useDepartments } from '../../dashboard/hooks/useDashboard';
import { Input, Select } from '../../../components/forms/Input';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/feedback/Modal';

export interface CarbonLogFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarbonLogForm = ({ isOpen, onClose }: CarbonLogFormProps) => {
  const { data: factors = [] } = useEmissionFactors();
  const { data: departments = [] } = useDepartments();
  const { mutate: createTx, isPending } = useCreateCarbonTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CarbonLogFormValues>({
    resolver: zodResolver(carbonLogSchema),
    defaultValues: defaultCarbonFormValues,
  });

  const selectedFactorId = watch('emissionFactorId');
  const selectedSource = watch('source');

  // Auto-fill unit when emission factor changes
  useEffect(() => {
    if (selectedFactorId) {
      const match = factors.find((f) => f.id === selectedFactorId);
      if (match) {
        setValue('unit', match.unit);
      }
    }
  }, [selectedFactorId, factors, setValue]);

  // Handle source category filter presets for emission factors select options
  const filteredFactors = factors.filter((f) => {
    if (selectedSource === 'fleet' || selectedSource === 'expense') {
      return f.name.toLowerCase().includes('fuel') || f.name.toLowerCase().includes('travel') || f.name.toLowerCase().includes('diesel') || f.name.toLowerCase().includes('gasoline');
    }
    if (selectedSource === 'manufacturing') {
      return f.name.toLowerCase().includes('gas') || f.name.toLowerCase().includes('waste') || f.name.toLowerCase().includes('steam');
    }
    // Default or purchase
    return true;
  });

  const onSubmit = (values: CarbonLogFormValues) => {
    createTx(values, {
      onSuccess: () => {
        reset(defaultCarbonFormValues);
        onClose();
      },
    });
  };

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: `${d.name} (${d.code})`,
  }));

  const factorOptions = [
    { value: '', label: '-- Select Emission Factor --' },
    ...filteredFactors.map((f) => ({
      value: f.id,
      label: `${f.name} (${f.factor} kg CO2e/${f.unit})`,
    })),
  ];

  const sourceOptions = [
    { value: 'purchase', label: 'Purchase Scopes (Electricity/Office)' },
    { value: 'manufacturing', label: 'Manufacturing & Heat Scopes' },
    { value: 'expense', label: 'Expense Scopes (Business Travel)' },
    { value: 'fleet', label: 'Fleet Scopes (Vehicles)' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Carbon Transaction">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <Select
          label="Emission Source Scope"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Transaction Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <Select
            label="Reporting Department"
            options={[{ value: '', label: '-- Select Dept --' }, ...departmentOptions]}
            error={errors.departmentId?.message}
            {...register('departmentId')}
          />
        </div>

        <Select
          label="Emission Factor Reference"
          options={factorOptions}
          error={errors.emissionFactorId?.message}
          {...register('emissionFactorId')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Activity Quantity"
            type="number"
            step="any"
            error={errors.activityValue?.message}
            onChange={(e) => setValue('activityValue', Number(e.target.value))}
            name="activityValue"
          />
          <Input
            label="Unit of Measure"
            disabled
            error={errors.unit?.message}
            {...register('unit')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Log Emissions
          </Button>
        </div>
      </form>
    </Modal>
  );
};
