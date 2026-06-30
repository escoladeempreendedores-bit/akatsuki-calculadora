const MissionCostCard = ({ label, value, description, icon }) => {
  return (
    <div className="border border-[#394C97] shadow-sm shadow-[#394C97] rounded-xl bg-white px-4 py-2 flex justify-between">
      <div>
        <p className="text-base text-gray-900 font-medium">{label}</p>
        <p className="text-xl text-blue-700 font-semibold">{value}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {icon ? <i className={`${icon} `} /> : null}
    </div>
  );
};

export default MissionCostCard;
