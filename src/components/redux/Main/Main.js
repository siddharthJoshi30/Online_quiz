import { combineReducers } from "redux";
import leaderboardReducer from "../Rank/Rank";
import quizReducer from "../Exam/Exam";
import userReducer from "../User/User";
const rootReducer = combineReducers({
  user: userReducer,
  quiz: quizReducer,
  leaderboard: leaderboardReducer,
});
export default rootReducer;
