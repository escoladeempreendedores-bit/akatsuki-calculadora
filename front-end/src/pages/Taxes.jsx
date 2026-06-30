import ItemTax from "../components/ItemTax";
import defaultTaxesService from "../services/defaultTaxesService";
import TaxesControlPanel from "../components/TaxesControlPanel";
import { useState, useEffect } from "react";

const Taxes = () => {
  const [defaultTaxes, setDefaultTaxes] = useState([]);
  const [originalTaxes, setOriginalTaxes] = useState([]);
  const [error, setError] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function loadTaxes() {
    try {
      setError({});
      const data = await defaultTaxesService.getAllDefaultTaxes();
      setDefaultTaxes(data);
      setOriginalTaxes(data);
    } catch (error) {
      setError({ general: "Erro ao carregar taxas: " + error.message });
    }
  }

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleValueChange = (id, newValue) => {
    setDefaultTaxes((prevTaxes) =>
      prevTaxes.map((tax) =>
        tax.id === id ? { ...tax, value: newValue } : tax
      )
    );
  };

  const handleSave = async () => {
    const modified = defaultTaxes.filter((tax, i) => {
      return Number(tax.value) !== Number(originalTaxes[i].value);
    });

    if (modified.length === 0) {
      alert("Nenhuma taxa foi modificada.");
      return;
    }

    setIsSaving(true);
    try {
      const promises = modified.map((tax) =>
        defaultTaxesService.updateDefaultTax(tax.id, {
          value: Number(tax.value),
        })
      );

      await Promise.all(promises);

      alert("Taxas atualizadas com sucesso!");
      setOriginalTaxes(defaultTaxes);

    } catch (error) {
        alert("Erro ao atualizar taxas. Verifique o console.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <main className="flex gap-10 items-center flex-col w-full">
      <TaxesControlPanel 
        title={"Taxas Padrões"}
        isSaving={isSaving}
        handleSave={handleSave}
      />

      <div className="flex flex-col gap-8 w-full">
        {defaultTaxes.length === 0 ? (
          <p className="text-center">Nenhuma taxa encontrada.</p>
        ) : (
          defaultTaxes.map((tax) => (
            <ItemTax
              key={tax.id}
              id={tax.id}
              name={tax.name}
              description={tax.description}
              value={tax.value}
              onValueChange={handleValueChange}
            />
          ))
        )}
      </div>
    </main>
  );
};

export default Taxes;
