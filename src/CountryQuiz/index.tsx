import React, { useState } from "react";
import { useCountriesState } from "./components/CountriesProvider";
import FlagImg from "./components/FlagImg";
import QuizTheme from "./components/QuizTheme";
import OrderedOptions from "./components/OrderedOptions";
import NextBtn from "./components/NextBtn";
import Result from "./components/Result";
import styles from "./index.module.css";
import { Option } from "./models/option";

// 0 ~ (max未満) の整数を返す
const getRandomNum = (max: number): number => {
  return Math.floor(Math.random() * max);
};

function CountryQuiz() {
  const countries = useCountriesState();
  const optionsNum = 4; // 選択肢のカードの数

  const createOptions = () => {
    const correctNum = getRandomNum(optionsNum);

    const newOptions: Option[] = [...Array(optionsNum).keys()].map((num) => {
      const randNum = getRandomNum(countries.length);
      const country = countries[randNum];

      return {
        id: num,
        ...country,
        isCorrect: num === correctNum,
        isClicked: false,
      };
    });

    return newOptions;
  };

  const getQuizType = () => {
    const random = Math.random();
    return random < 0.5 ? "capital" : "flag";
  };

  const [quizType, setQuizType] = useState<"capital" | "flag">(getQuizType());
  const [options, setOptions] = useState<Option[]>(createOptions()); // 選択肢の国の配列
  const [situation, setSituation] = useState("continued"); //  正解したか不正解したか
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const correctOptionIndex = options.findIndex(option => option.isCorrect); // options配列の何番目を正解にするかの数
  const [phase, setPhase] = useState<"answering" | "checking" | "resulting">(
    "answering"
  ); // 解答中or答え合わせor結果

  const changeQuizType = () => setQuizType(getQuizType());

  const changeOptions = () => setOptions(createOptions());

  const getThemeText = () => {
    if (quizType === "capital")
      return `${options[correctOptionIndex].capital} is the capital of`;
    else if (quizType === "flag")
      return "Which country does this flag belong to?";
  };

  const setTrueToClickedOption = (id: number) => {
    if (phase === "checking") return;

    setOptions((prev) =>
      prev.map((option) => {
        if (option.id !== id) return option;
        return { ...option, isClicked: true };
      })
    );
  };

  const getFlagSvg = (): string => {
    return options[correctOptionIndex].flag;
  };

  return (
    <div className={styles.countryQuiz}>
      <div className={styles.countryQuizInner}>
        <p className={styles.countryQuizTitle}>COUNTRY QUIZ</p>
        <div className={styles.countryQuizContainer}>
          {(phase === "answering" || phase === "checking") && (
            <div className={styles.countryQuizCard}>
              {quizType === "flag" && <FlagImg flag={getFlagSvg()} />}
              <QuizTheme themeText={getThemeText()} />
              <OrderedOptions
                options={options}
                phase={phase}
                setPhase={setPhase}
                setSituation={setSituation}
                setTrueToClickedOption={setTrueToClickedOption}
              />
              {phase === "checking" && (
                <NextBtn
                  situation={situation}
                  setPhase={setPhase}
                  changeOptions={changeOptions}
                  setCorrectCount={setCorrectCount}
                  changeQuizType={changeQuizType}
                />
              )}
            </div>
          )}
          {phase === "resulting" && (
            <Result
              correctCount={correctCount}
              setCorrectCount={setCorrectCount}
              setPhase={setPhase}
              changeOptions={changeOptions}
              changeQuizType={changeQuizType}
              setSituation={setSituation}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryQuiz;
