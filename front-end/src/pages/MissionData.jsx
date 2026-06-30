// src/pages/MissionData.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MissionDataCard from "../components/MissionDataCard";
import OrangeButton from "../components/OrangeButton";
import PageTitle from "../components/PageTitle";
import MissionTabs from "../components/MissionTabs";
import { missionSchema } from "../utils/missionSchema";

import {
  createMission,
  getMissionById,
  updateMission,
} from "../services/missionService";

export default function MissionData() {
  const location = useLocation();
  const navigate = useNavigate();

  const missionId = location.state?.missionId || null;
  const isEditMode = Boolean(missionId);

  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      name: "",
      description: "",
      number_participants: "",
      number_consolidated_participants: "",
    },
  });

  // Carregar dados se for edição
  useEffect(() => {
    if (!isEditMode) return;

    getMissionById(missionId)
      .then((res) => {
        const m = res.data;
        reset({
          name: m.name || "",
          description: m.description || "",
          number_participants: m.number_participants
            ? String(m.number_participants)
            : "",
          number_consolidated_participants:
            m.number_consolidated_participants
              ? String(m.number_consolidated_participants)
              : "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao carregar dados da missão");
      })
      .finally(() => setLoading(false));
  }, [isEditMode, missionId, reset]);

  const onSubmit = async (data) => {
    const participants = Number(data.number_participants);
    const consolidated =
      data.number_consolidated_participants === "" ||
      !data.number_consolidated_participants
        ? null
        : Number(data.number_consolidated_participants);

    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      number_participants: participants,
      number_consolidated_participants: consolidated,
    };

    try {
      let id = missionId;

      if (isEditMode) {
        await updateMission(missionId, payload);
        navigate("/mission");
      } else {
        const res = await createMission(payload);
        id = res.data.id;

        navigate("/costs", {
          state: { missionId: id },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar missão");
    }
  };

  return (
    <div>
      <main className="w-full">
        <PageTitle
          title={isEditMode ? "Editar Missão" : "Dados da Missão"}
        />

        {/* Abas */}
        <MissionTabs />

        {/* Card principal */}
        <div className="relative bg-white rounded-xl shadow-md p-10 mt-2 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[14px] bg-[#2a3b8f] rounded-l-xl" />

          {loading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <MissionDataCard register={register} errors={errors} />

              <div className="mt-8 flex justify-center">
                <OrangeButton
                  buttontype="submit"
                  buttonMessage={isSubmitting ? "Salvando..." : "Salvar Missão"}
                  disabled={isSubmitting}
                />
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}