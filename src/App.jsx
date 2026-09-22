import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import FlightsPage from "./components/FlightsPage";
import AccommodationPage from "./components/AccommodationPage";
import TransfersPage from "./components/TransfersPage";
import TeeTimesPage from "./components/TeeTimesPage";
import ScoreboardPage from "./components/ScoreboardPage";
import TeamsPage from "./components/TeamsPage";
import AdminPage from "./components/AdminPage";

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/flights"    element={<FlightsPage />} />
          <Route path="/hotel"      element={<AccommodationPage />} />
          <Route path="/transfers"  element={<TransfersPage />} />
          <Route path="/teetimes"   element={<TeeTimesPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="/teams"      element={<TeamsPage />} />
          <Route path="/admin"      element={<AdminPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
