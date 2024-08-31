import { useEffect, useReducer } from "react";
import Header from "./components/Header"
import Loader from "./components/Loader"
import Error from "./components/Error"
import Main from "./components/Main";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  // 'loading' , 'error' , 'ready' , 'active' , 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
}
function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        status: 'active',
      };
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state,
        status: 'active',
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      };
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case 'finishQuiz':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore
          ? state.points
          : state.highscore
      }
    case 'restartQuiz':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: 10
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      }
    default:
      throw new Error(`Invalid action`);
  }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { questions, status, index, answer, points, highscore, secondsRemaining } = state

  const numQuestions = questions.length
  const maxPossiblePoint = questions.reduce((prev, curr) => prev + curr.points, 0)

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed' }))
  }, [])
  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions}
          dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <Progress index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoint={maxPossiblePoint}
              answer={answer} />
            <Question question={questions[index]}
              dispatch={dispatch} answer={answer} />
            <Footer >
              <Timer dispatch={dispatch}
                secondsRemaining={secondsRemaining} />
              <NextButton dispatch={dispatch} answer={answer}
                index={index}
                numQuestions={numQuestions} />
            </Footer>
          </>
        }
        {status === 'finished' &&
          <FinishScreen points={points}
            maxPossiblePoint={maxPossiblePoint}
            highscore={highscore}
            dispatch={dispatch} />}
      </Main>
    </div>
  );
}
