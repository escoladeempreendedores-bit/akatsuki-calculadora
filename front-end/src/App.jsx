import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "./components/Container";
import CategoryCostsDetails from "./pages/CategoryCostsDetails";
import Costs from "./pages/Costs";
import FinalSimulation from "./pages/FinalSimulation";
import ForgotPassword from "./pages/ForgotPassword";
import GeneralDashboard from "./pages/GeneralDashboard";
import Login from "./pages/Login";
import Mission from "./pages/Mission";
import MissionDashboard from "./pages/MissionDashboard";
import MissionData from "./pages/MissionData";
import Taxes from "./pages/Taxes";
import MissionTaxes from "./pages/MissionTaxes";
import User from "./pages/UserPage";
import UserList from "./pages/UserList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Container />}>
          <Route index element={<GeneralDashboard />} />

          <Route path="missiondata" element={<MissionData />} />
          <Route path="mission" element={<Mission />} />
          <Route path="costs" element={<Costs />} />
          <Route path="costs/:categoryId" element={<CategoryCostsDetails />} />
          <Route path="dashboardmission" element={<MissionDashboard />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="missiontaxes" element={<MissionTaxes />} />
          <Route path="finalsimulation" element={<FinalSimulation />} />
          <Route path="user" element={<User />} />
          <Route path="userlist" element={<UserList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
