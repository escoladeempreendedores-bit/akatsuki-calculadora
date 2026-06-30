// src/components/CategoryActions.jsx
const CategoryActions = ({
  primaryLabel = 'Ver',
  secondaryLabel = 'Excluir',
  onPrimary,
  onSecondary,
}) => {
  return (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={onPrimary}
        className="px-3 py-1 text-sm rounded-md bg-[#2a3b8f] cursor-pointer text-white hover:bg-[#1f2d6b] transition-colors"
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        onClick={onSecondary}
        className="px-3 py-1 text-sm rounded-md bg-orange-600 cursor-pointer text-white hover:bg-orange-700 transition-colors"
      >
        {secondaryLabel}
      </button>
    </div>
  );
};

export default CategoryActions;
