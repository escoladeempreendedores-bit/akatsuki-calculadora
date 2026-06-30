import tax from "../assets/tax.svg";
import profit from "../assets/profit.svg";
import creditCard from "../assets/creditCard.svg";
import InputTax from "./InputTax";

const ItemTax = ({ id, name, description, value, onValueChange }) => {
  let iconSvg;
  if (id === 1) {
    iconSvg = tax;
  } else if (id === 2) {
    iconSvg = profit;
  } else {
    iconSvg = creditCard;
  }

  return (
    <section className="flex px-3 py-3 justify-between border border-border-color rounded-[20px] bg-background-white">
      <div className="flex justify-center gap-8 ml-3">
        <div className="flex justify-center items-center px-5 py-5 bg-background-blue rounded-2xl">
          <img
            src={iconSvg}
            alt="Imagem de uma receita"
            className="opacity-50"
          />
        </div>

        <div className="flex justify-center flex-col">
          <h1 className="text-primary-blue font-bold text-[1.35rem]">{name}</h1>
          <p className="text-description-color font-light text-[1rem]">
            {description}
          </p>
        </div>
      </div>

      <aside className="flex justify-between items-center px-4 bg-background-blue rounded-2xl gap-2 w-[8%] mr-5">
        <InputTax
          value={value}
          onChange={(newValue) => onValueChange(id, newValue)}
        />
        <p className="text-primary-blue font-bold text-[1.2rem]">%</p>
      </aside>
    </section>
  );
};

export default ItemTax;
