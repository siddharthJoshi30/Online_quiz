import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/pages/Header/Header";
import Home from "./components/pages/Main/Home";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";
import Leaderboard from "./components/pages/Rank/Rank";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Rules from "./components/pages/Rules/Rules";
import QuizQuestion from "./components/services/DashBoard/startQuiz";
import CreateQuiz from "./components/services/Create/createQuiz";
import HomePage from "./components/pages/Home/HomePage";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz/rules" element={<Rules />} />
        <Route path="/quiz/start/question" element={<QuizQuestion />} />
        <Route path="/quiz/new-update" element={<CreateQuiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
