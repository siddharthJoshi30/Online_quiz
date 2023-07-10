import { useSelector } from "react-redux";
import { Button, Card, Container } from "react-bootstrap";
import useLoggedUser from "../../services/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaBackspace } from "react-icons/fa";

const Rules = ({ history }) => {
  const navigate = useNavigate();
  useLoggedUser();
  const { activeQuiz } = useSelector((store) => store.quiz);

  if (!activeQuiz?._id) navigate("/");

  const handleQuizStart = () => {
    navigate("/quiz/start/question");
  };

  return (
    <Container className="my-5 rules-container">
      <Card className="p-5">
        {!activeQuiz?._id ? (
          <>
            <Card.Text>Please select a quiz to get started</Card.Text>
            <Button
              variant="outline-dark"
              className="mt-0"
              onClick={() => history("/")}
            >
              &lt; Home
            </Button>
          </>
        ) : (
          <>
            <Card.Title as="h1" style={{ color: "black" }}>
              Rules:{" "}
            </Card.Title>
            <Card.Body>
              <Card.Text style={{ color: "black", fontSize: "18px" }}>
                # Welcome to "QUIZETH" online quiz application 🙏
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "17px" }}>
                # Start the quiz by clicking on the "NEXT" button ⏭️
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "17px" }}>
                # Avoid refreshing or reloading the page until you have
                submitted your answers 🔄️
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "17px" }}>
                # You have the flexibility to navigate back and forth between
                questions. ⬅️➡️
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "17px" }}>
                # There is no negative marking in exam ❌
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "17px" }}>
                # Try to attempt all and results will be displayed after
                submission 👁️
              </Card.Text>
              <Card.Text style={{ color: "black", fontSize: "20px" }}>
                ALL THE BEST 😊 😊 😊 😊
              </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between bg-white text-center">
              <Button variant="danger" onClick={() => navigate("/")}>
                <FaBackspace size={20} />
                &nbsp;Cancel
              </Button>
              <Button onClick={handleQuizStart}>
                NEXT <FaArrowRight />
              </Button>
            </Card.Footer>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Rules;
