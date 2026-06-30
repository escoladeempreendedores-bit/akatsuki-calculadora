import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { itemSchema } from "../utils/itemSchema";

export default function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues = null,
}) {
  const isEdit = Boolean(initialValues?.id);
  const dialogRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      description: "",
      quantity: "",
      unitPrice: "",
    },
  });

  //  valor atual do campo unitPrice no form (pra controlar o NumericFormat)
  const unitPriceValue = watch("unitPrice");

    useEffect(() => {
    if (!isOpen) return;

    
    const rawQuantity =
      initialValues?.quantity ??
      initialValues?.final_quantity ??
      initialValues?.initial_quantity ??
      "";

    const rawUnitPrice =
      initialValues?.unitPrice ??
      initialValues?.final_unit_value ??
      initialValues?.initial_unit_value ??
      "";

    reset({
      description: initialValues?.description ?? "",
      quantity:
        rawQuantity !== null && rawQuantity !== undefined
          ? String(rawQuantity)
          : "",
      unitPrice:
        rawUnitPrice !== null && rawUnitPrice !== undefined
          ? String(rawUnitPrice)
          : "",
    });

    setTimeout(() => dialogRef.current?.focus(), 0);
  }, [isOpen, initialValues, reset]);

  if (!isOpen) return null;

  const submitForm = async (data) => {
    await onSubmit({
      id: initialValues?.id,
      description: data.description.trim(),
      quantity: data.quantity,
      unitPrice: data.unitPrice, 
    });
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
        aria-labelledby="item-modal-title"
      >
        <h2 id="item-modal-title" className="text-3xl font-bold text-[#2a3b8f]">
          {isEdit ? "Editar Item" : "Adicionar Item"}
        </h2>
        <p className="mt-2 text-gray-500">
          {isEdit
            ? "Atualize os campos do item selecionado."
            : "Preencha os campos abaixo para adicionar um item de custo."}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(submitForm)}>
          {/* Descrição */}
          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Latam"
              {...register("description")}
              className="w-full rounded-xl border border-[#2a3b8f]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2a3b8f]"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-gray-700 mb-2">Quantidade</label>
            <input
              inputMode="numeric"
              placeholder="Ex: 20"
              {...register("quantity")}
              className="w-full rounded-xl border border-[#2a3b8f]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2a3b8f]"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          {/* Valor Unitário */}
          <div>
            <label className="block text-gray-700 mb-2">
              Valor Unitário (R$)
            </label>

            {/* Campo "real" controlado pelo react-hook-form via watch/setValue */}
            <NumericFormat
              value={unitPriceValue}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder="R$ 0,00"
              customInput="input"
              className="w-full rounded-xl border border-[#2a3b8f]/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2a3b8f]"
              onValueChange={(values) =>
                setValue("unitPrice", values.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />

            {/* Registro "oculto" para o react-hook-form/zod */}
            <input type="hidden" {...register("unitPrice")} />

            {errors.unitPrice && (
              <p className="text-red-500">{errors.unitPrice.message}</p>
            )}
          </div>

          {/* Botões */}
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
              {isSubmitting
                ? "Salvando..."
                : isEdit
                ? "Salvar alterações"
                : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
