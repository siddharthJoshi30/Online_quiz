import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Container, Form } from "react-bootstrap";
import useLoggedUser from "../Auth/Auth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Axios/Axios";
import { BsPlusCircleFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";

const initState = {
  title: "",
  category: "",
  pointsPerQuestion: "5",
  timeForQuiz: "5",
  questions: [
    {
      text: "",
      answer: "",
      options: ["", "", "", ""],
    },
  ],
};
const RadioOptionLabel = ({ name, value, onChange }) => {
  return (
    <>
      <Form.Control
        type="text"
        size="md"
        name={name}
        placeholder="Option Text"
        value={value}
        onChange={onChange}
      />
      <Form.Text className="text-danger"></Form.Text>
    </>
  );
};

const RadioOption = ({
  checked,
  qIndex,
  optionValue,
  handleRadioChange,
  handleOptionChange,
}) => (
  <>
    <Form.Check
      type="radio"
      label={
        <RadioOptionLabel value={optionValue} onChange={handleOptionChange} />
      }
      name={`options${qIndex}`}
      id="option1"
      onChange={handleRadioChange}
      checked={checked}
    />
  </>
);

const CreateQuiz = () => {
  useLoggedUser();
  const [state, setState] = useState(initState);
  const [message, setMessage] = useState("");
  const { title, category, timeForQuiz, pointsPerQuestion, questions } = state;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeQuiz, mode } = useSelector((store) => store.quiz);

  useEffect(() => {
    if (mode === "EDIT" && activeQuiz) {
      console.log(activeQuiz);
      const { title, category, timeForQuiz, pointsPerQuestion, questions } =
        activeQuiz;
      const editableQuiz = {
        title,
        category,
        timeForQuiz,
        pointsPerQuestion,
        questions: questions.map((q) => ({
          ...q,
          answer: q.options.indexOf(q.answer),
        })),
      };
      setState(editableQuiz);
    }
  }, []);
  async function createUpdateQuiz(payload) {
    try {
      setMessage("");
      const config = {
        method: "POST",
        url: "/quiz",
      };
      if (mode === "EDIT" && activeQuiz && activeQuiz._id) {
        config.method = "PUT";
        config.url = `/quiz/${activeQuiz._id}`;
      }
      const _token = JSON.parse(localStorage.getItem("QUIZETH"))?.token;
      if (!_token) navigate("/login");
      const { data, status } = await axiosInstance({
        ...config,
        data: payload,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${_token}`,
        },
      });
      if (data.response && status === 201) {
        dispatch({
          type: "SAVE_ALL_QUIZ",
          payload: data.response,
        });
        navigate("/");
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        return navigate("/");
      } else if (err?.response?.status === 401) {
        return navigate("/login");
      }
      setMessage(err?.response?.data?.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...state,
      questions: state.questions
        .filter((q) => q)
        .map((q) => ({ ...q, answer: q.options[q.answer] })),
    };
    console.log(payload);
    createUpdateQuiz(payload);
  };

  const handleAddQuestion = () => {
    const initQ = {
      text: "",
      answer: "",
      options: ["", "", "", ""],
    };
    setState({ ...state, questions: [...questions, initQ] });
  };

  const handleRemoveQuestion = (index) => {
    const { questions } = state;
    questions[index] = null;
    setState({ ...state, questions });
  };

  const handleQuestionTextChange = (e, qIndex) => {
    const { questions } = state;
    if (questions[qIndex]) {
      questions[qIndex].text = e.target.value;
    }
    setState({ ...state, questions });
  };

  const handleRadioChange = (qIndex, optIndex) => {
    const { questions } = state;
    if (questions[qIndex]) {
      questions[qIndex].answer = optIndex;
    }
    setState({ ...state, questions });
  };
  const handleOptionChange = (e, qIndex, optIndex) => {
    const { questions } = state;
    if (questions[qIndex] && questions[qIndex].options) {
      questions[qIndex].options[optIndex] = e.target.value;
    }
    setState({ ...state, questions });
  };

  const shouldEnableAdd = () => {
    const { title, category, timeForQuiz, pointsPerQuestion, questions } =
      state;
    if (
      title &&
      category &&
      +pointsPerQuestion >= 5 &&
      questions.length > 0 &&
      questions
        .filter((q) => q)
        .every(
          (q) =>
            q.text && (q.answer || q.answer === 0) && q.options.every((o) => o)
        )
    ) {
      return true;
    }
    return false;
  };

  return (
    <Container className="my-4 quiz-form-container">
      <Form
        onSubmit={handleSubmit}
        className="mb-5"
        style={{ backgroundColor: "lavender", padding: "18px" }}
      >
        <Form.Group controlId="title" className="my-4">
          <Form.Label className="text-black" style={{ fontSize: "23px" }}>
            TITLE:
          </Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setState({ ...state, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="category" className="my-4">
          <Form.Label className="text-black" style={{ fontSize: "23px" }}>
            SUBJECT NAME:
          </Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setState({ ...state, category: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="points-per-question" className="my-4">
          <Form.Label className="text-black" style={{ fontSize: "23px" }}>
            MARKS:
          </Form.Label>
          <Form.Control
            type="number"
            min="5"
            max="100"
            step="5"
            title={pointsPerQuestion}
            value={pointsPerQuestion}
            onChange={(e) =>
              setState({ ...state, pointsPerQuestion: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="time-per-quiz" className="my-4">
          <Form.Label className="text-black" style={{ fontSize: "23px" }}>
            TIME:
          </Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="50"
            step="1"
            title={timeForQuiz}
            value={timeForQuiz}
            onChange={(e) =>
              setState({ ...state, timeForQuiz: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group controlId="questions" className="my-4 mb-2">
          <Form.Label
            as="h4"
            className="text-black"
            style={{ fontSize: "23px" }}
          >
            ADD QUESTION:
          </Form.Label>
          {questions.map((question, qIndex) => {
            if (!question) return null;
            return (
              <Card
                className="mb-3 p-2 border-none question-card"
                key={qIndex}
                style={{ backgroundColor: "lavender" }}
              >
                <Card.Body>
                  {state.questions.filter((q) => q).length > 1 && (
                    <ImCross
                      style={{
                        float: "right",
                        fontSize: "1.4rem",
                        cursor: "pointer",
                        marginBottom: "15px",
                        color: "red",
                      }}
                      onClick={() => handleRemoveQuestion(qIndex)}
                    />
                  )}
                  <Form.Control
                    type="text"
                    size="md"
                    value={question.text}
                    placeholder="Question text"
                    onChange={(e) => handleQuestionTextChange(e, qIndex)}
                  />
                  <Form.Group controlId="options" className="my-4 mb-2">
                    {question.options.map((option, optIndex) => (
                      <RadioOption
                        key={optIndex}
                        qIndex={qIndex}
                        checked={questions[qIndex].answer === optIndex}
                        handleRadioChange={() =>
                          handleRadioChange(qIndex, optIndex)
                        }
                        optionValue={option}
                        handleOptionChange={(e) =>
                          handleOptionChange(e, qIndex, optIndex)
                        }
                      />
                    ))}
                  </Form.Group>
                </Card.Body>
              </Card>
            );
          })}
          <Form.Group controlId="addQBtn" className="my-1 text-right">
            <Button
              className="bg-black"
              size="sm"
              onClick={handleAddQuestion}
              disabled={!shouldEnableAdd()}
            >
              <BsPlusCircleFill size={25} />
            </Button>
          </Form.Group>
        </Form.Group>

        <div
          style={{ color: "red" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <Form.Group controlId="createQuizBtn" className="mb-4">
          <Button type="submit" className="px-5 submit-btn">
            {mode === "EDIT" && activeQuiz && activeQuiz._id
              ? "Update"
              : "SAVE & CONTINUE"}{" "}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default CreateQuiz;
