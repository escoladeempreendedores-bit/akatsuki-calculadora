
function OrangeButton({ buttontype = "button", buttonMessage, onClick, disabled }) {
  return (
    <button
      type={buttontype}
      onClick={onClick}
      disabled={disabled}
      className="
        px-9 py-3 rounded-md font-bold text-white cursor-pointer text-lg gap-6
        bg-orange-600 hover:bg-orange-700
        disabled:text-gray-400 disabled:bg-transparent disabled:hover:bg-transparent disabled:focus:ring-0 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-orange-200
        transition
      "
    >
      {buttonMessage}
    </button>
  );
}

export default OrangeButton;
