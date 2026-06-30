// src/components/MissionDataCard.jsx
export default function MissionDataCard({ register, errors }) {
  return (
    <section className="space-y-10">
      {/* Nome da Missão */}
      <div className="flex flex-col gap-3">
        <label className="text-[#2a3b8f] font-semibold text-lg">
          Nome da Missão
        </label>

        <input
          type="text"
          placeholder="Digite o nome da missão"
          {...register("name")}
          className="
            w-full
            bg-[#f5f7ff]
            rounded-3xl
            px-6 py-4
            text-[#2a3b8f]
            outline-none
            border border-transparent
            focus:border-[#2a3b8f]
            focus:bg-white
            transition
          "
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-3">
        <label className="text-[#2a3b8f] font-semibold text-lg">
          Descrição
        </label>

        <textarea
          placeholder="ex: destino e data de missão"
          {...register("description")}
          className="
            w-full
            bg-[#f5f7ff]
            rounded-3xl
            px-6 py-4
            h-28
            text-[#2a3b8f]
            outline-none
            border border-transparent
            focus:border-[#2a3b8f]
            focus:bg-white
            transition
            resize-none
          "
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Linha com participantes e participantes consolidados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Número de Participantes Esperado */}
        <div className="flex flex-col gap-3">
          <label className="text-[#2a3b8f] font-semibold text-lg">
            Número de Participantes Esperado
          </label>

          <input
            type="number"
            min={0}
            max={999}
            step={1}
            placeholder="Ex: 30"
            {...register("number_participants")}
            className="
              w-full
              bg-[#f5f7ff]
              rounded-3xl
              px-6 py-4
              text-[#2a3b8f]
              outline-none
              border border-transparent
              focus:border-[#2a3b8f]
              focus:bg-white
              transition
            "
          />
          {errors.number_participants && (
            <p className="text-red-500 text-sm">{errors.number_participants.message}</p>
          )}
        </div>

        {/* Número de Participantes Consolidado */}
        <div className="flex flex-col gap-3">
          <label className="text-[#2a3b8f] font-semibold text-lg">
            Número de Participantes Consolidado
          </label>

          <input
            type="number"
            min={0}
            max={999}
            step={1}
            placeholder="Ex: 28"
            {...register("number_consolidated_participants")}
            className="
              w-full
              bg-[#f5f7ff]
              rounded-3xl
              px-6 py-4
              text-[#2a3b8f]
              outline-none
              border border-transparent
              focus:border-[#2a3b8f]
              focus:bg-white
              transition
            "
          />
          {errors.number_consolidated_participants && (
            <p className="text-red-500 text-sm">{errors.number_consolidated_participants.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
