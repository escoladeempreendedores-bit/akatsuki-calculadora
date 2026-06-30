const MissionMetricCard = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p>{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
};

export default MissionMetricCard;
