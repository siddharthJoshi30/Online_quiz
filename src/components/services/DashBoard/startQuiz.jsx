import React, { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaFlagCheckered, FaWaze } from "react-icons/fa";
import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import axiosInstance from "../Axios/Axios";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import QuizResults from "../Display/Result";
import useLoggedUser from "../Auth/Auth";
import "./timerdesign.css";
const QuizQuestion = ({ history }) => {
  const { user, getUserById } = useLoggedUser() || {};
  const { _id: userId } = user || {};
  const {
    activeQuiz,
    activeQIndex,
    selectedOptions = [],
  } = useSelector((store) => store.quiz) || {};
  const {
    questions = [],
    numberOfQuestions = 0,
    timeForQuiz = 0,
  } = activeQuiz || {};

  const [results, setResults] = useState();
  const quizTime = timeForQuiz * 60;
  const [timerCompleted, setTimerCompleted] = useState(false);

  const dispatch = useDispatch();

  const handleQuizFinish = () => {
    validateAnswer();
  };

  async function saveToLeaderboard(points) {
    try {
      const { data } = await axiosInstance.post(
        "/leaderboard",
        { _id: userId, points },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("QUIZETH")).token
            }`,
          },
        }
      );
      if (data.response) {
        dispatch({
          type: "SAVE_LEADERBOARD",
          payload: data.response,
        });
      }
    } catch (err) {
      if (err?.response?.data?.response) {
        console.log(err.response.data.response);
      } else {
        console.log(err);
      }
    }
  }

  async function validateAnswer() {
    try {
      const { data } = await axiosInstance.post(
        `/user/quiz/${activeQuiz._id}`,
        selectedOptions,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("QUIZETH")).token
            }`,
          },
        }
      );
      console.log(data.response);
      if (data.response) {
        getUserById();
        setResults(data.response);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!(Array.isArray(questions) && questions.length) && !results) {
      return history.replace("/");
    } else if (
      typeof results === "object" &&
      Array.isArray(questions) &&
      questions.length
    ) {
      dispatch({
        type: "RESET_ACTIVE_QUIZ",
      });
      saveToLeaderboard(results.points);
    }
  }, [questions, results]);

  const activeQ = questions[activeQIndex];
  const selectedOption = selectedOptions.find(
    (q) => q.id === activeQ._id
  )?.selected;

  const handleSelectOption = (option) => {
    dispatch({
      type: "UPDATE_SELECTED_QUESTIONS",
      payload: {
        id: activeQ._id,
        selected: option,
      },
    });
  };

  const handlePrevious = () => {
    dispatch({
      type: "UPDATE_ACTIVE_QUESTION",
      payload: activeQIndex - 1,
    });
  };

  const handleNext = () => {
    if (questions.length - 1 !== activeQIndex) {
      dispatch({
        type: "UPDATE_ACTIVE_QUESTION",
        payload: activeQIndex + 1,
      });
    } else {
      console.log("Submitting answers!");
      handleQuizFinish();
    }
  };

  if (!(Array.isArray(questions) && questions.length) && !results) return null;

  const LoadQuestions = () => (
    <Card className="p-3 question-card">
      <Card.Header>
        Question: {activeQIndex + 1} / {numberOfQuestions}
      </Card.Header>
      <Card.Title as="h2" className="text-black">
        <FaWaze /> {activeQ.text} ?
      </Card.Title>
      {activeQ.options.map((option, index) => (
        <Card
          key={index}
          className="p-3 my-2"
          data-selected={selectedOption === option}
          style={{
            background: selectedOption === option ? "#000" : "#fff",
            color: selectedOption === option ? "#fff" : "#000",
            border: "2px solid black",
          }}
          onClick={() => handleSelectOption(option)}
        >
          {option}
        </Card>
      ))}
      <Card.Footer className="d-flex justify-content-between bg-white text-center">
        {activeQIndex !== 0 ? (
          <Button variant="dark" onClick={handlePrevious}>
            <GiPreviousButton />
            &nbsp; Previous
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext}>
          {questions.length - 1 === activeQIndex ? (
            <span>
              Finish <FaFlagCheckered style={{ marginLeft: "2px" }} />
            </span>
          ) : (
            <span>
              Next &nbsp;
              <GiNextButton />
            </span>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );

  return (
    <Container className="quiz-question-container my-5">
      {results ? (
        <QuizResults results={results} />
      ) : (
        <>
          <div className="countdown-timer">
            <CountdownCircleTimer
              isPlaying={!timerCompleted}
              rotation="clockwise"
              duration={quizTime}
              colors={[["#00DFA2"]]}
              trailColor="#F45050"
              onComplete={() => {
                setTimerCompleted(true);
                handleQuizFinish();
              }}
              size={150}
              strokeWidth={12}
              strokeLinecap="round"
            >
              {({ remainingTime }) => (
                <div className="timer-label">
                  {Math.floor(remainingTime / 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  : {(remainingTime % 60).toString().padStart(2, "0")}
                </div>
              )}
            </CountdownCircleTimer>
          </div>
          <LoadQuestions />
        </>
      )}
    </Container>
  );
};

export default QuizQuestion;
