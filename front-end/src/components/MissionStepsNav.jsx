const MissionStepsNav = () => {
  return (
    <nav className="flex gap-6 mb-6 text-xs sm:text-base justify-center md:justify-start">
      <button className="cursor-pointer font-medium text-gray-900 rounded-xl px-6 py-2">
        Dados
      </button>
      <button className="font-medium text-gray-900 rounded-xl px-6 py-2 cursor-pointer">
        Custos
      </button>
      <button className="font-medium text-gray-900 rounded-xl px-6 py-2 cursor-pointer">
        Simulação Final
      </button>
      <button className="font-medium  rounded-xl px-6 py-2 bg-[#FE5900] text-white cursor-pointer">
        Dashboard da Missão
      </button>
    </nav>
  );
};

export default MissionStepsNav;
