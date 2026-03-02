import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import LandingPage from "./pages/LandingPage";
import MLLabPage from "./pages/MLLabPage";
import SpringBootPage from "./pages/SpringBootPage";
import FullStackPage from "./pages/FullStackPage";
import DataPage from "./pages/DataPage";
import DevOpsPage from "./pages/DevOpsPage";
import ThreeDPage from "./pages/ThreeDPage";
import WhyHireMePage from "./pages/WhyHireMePage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ml-lab" element={<MLLabPage />} />
        <Route path="/java-spring" element={<SpringBootPage />} />
        <Route path="/full-stack" element={<FullStackPage />} />
        <Route path="/data-engineering" element={<DataPage />} />
        <Route path="/devops" element={<DevOpsPage />} />
        <Route path="/interactive-3d" element={<ThreeDPage />} />
        <Route path="/why-hire-me" element={<WhyHireMePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
