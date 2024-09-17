import React from 'react'
import { useQuiz } from '../contexts/QuizContext'

import StartScreen from "../components/StartScreen";
import Question from "../components/Question";
import NextButton from "../components/NextButton";
import Progress from "../components/Progress";
import FinishScreen from "../components/FinishScreen";
import Footer from "../components/Footer";
import Timer from "../components/Timer";

import Loader from "../components/Loader"
import Error from "../components/Error"

export default function Main() {

  const { status } = useQuiz()
  return (
    <main>{status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && <StartScreen />}
      {status === 'active' &&
        <>
          <Progress />
          <Question />
          <Footer >
            <Timer />
            <NextButton />
          </Footer>
        </>
      }
      {status === 'finished' &&
        <FinishScreen />}</main>
  )
}
