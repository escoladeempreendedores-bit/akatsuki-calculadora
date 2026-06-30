import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../utils/categorySchema';

const TYPE_OPTIONS = [
  'Mão de Obra',
  'Insumos Tangíveis',
  'Insumos Intangíveis',
  'Despesas Comerciais',
  'Despesas Administrativas',
];

export default function AddCostModal({ isOpen, onClose, onSubmit, defaultType = 1 }) {
  const dialogRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: defaultType,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        type: defaultType,
      });
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [isOpen, defaultType, reset]);

  if (!isOpen) return null;

  const submitForm = async (data) => {
    await onSubmit({
      name: data.name.trim(),
      type: data.type,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-cost-title"
      >
        <h2 id="add-cost-title" className="text-3xl font-bold text-[#2a3b8f]">
          Adicionar Categoria
        </h2>
        <p className="mt-2 text-gray-500">
          Preencha os campos abaixo para adicionar um item de custo
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(submitForm)}>
          <div>
            <label className="block text-gray-700 mb-2">Categoria</label>
            <input
              type="text"
              placeholder="Ex: Passagem Aérea"
              {...register('name')}
              className="w-full rounded-xl border border-[#2a3b8f]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2a3b8f]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tipo</label>
            <div className="relative">
              <select
                {...register('type')}
                className="w-full appearance-none rounded-xl cursor-pointer border border-[#2a3b8f]/70 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-[#2a3b8f]"
              >
                <option value="" disabled>Selecione o tipo</option>
                {TYPE_OPTIONS.map((opt, index) => (
                  <option key={opt} value={index + 1}>{opt}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border cursor-pointer border-gray-200 bg-gray-100 px-6 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#ff5c00] cursor-pointer px-6 py-3 font-semibold text-white shadow-md hover:bg-[#e14e00] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
