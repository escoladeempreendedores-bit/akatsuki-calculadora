import OrangeButton from "./OrangeButton";
import PageTitle from '../components/PageTitle';

const TaxesControlPanel = ({title, isSaving, handleSave}) => {
  return (
    <>
      <div className="flex justify-between items-center w-full ">
        <PageTitle title={title} />
        <div className="mb-6">
          <OrangeButton
            buttontype="button"
            buttonMessage={isSaving ? "Salvando..." : "Salvar Taxas"}
            onClick={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default TaxesControlPanel;
