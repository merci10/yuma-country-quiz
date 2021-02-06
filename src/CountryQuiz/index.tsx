import React, { useEffect, useState } from 'react';
import { useCountriesState } from './components/CountriesProvider';
import FlagImg from './components/FlagImg';
import QuizTheme from './components/QuizTheme';
import OrderedOptions from './components/OrderedOptions';
import NextBtn from './components/NextBtn';
import Result from './components/Result';
import styles from './index.module.css';
import { Option } from './models/option';

// 0 ~ (max以下) の整数を返す
const getRandomNum = (max: number):  number => {
  return Math.floor(Math.random() * max);
}

function CountryQuiz() {
  const countries = useCountriesState();
  const countriesLength = countries.length;
  const optionsNum = 4; // 選択肢のカードの数
  const quizTypes = ['capital', 'flag'];

  const [quizType, setQuizType] = useState('');
  const [options, setOptions] = useState<Option[]>([]); // 選択肢の国の配列
  const [situation, setSituation] = useState('continued'); //  正解したか不正解したか
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [correctOptionNum, setCorrectOptionNum] = useState(getRandomNum(optionsNum)); // options配列の何番目を正解にするかの数
  const [phase, setPhase] = useState('answering'); // 解答中or答え合わせor結果

  const getThemeText = () => {
    if (options.length === 0) return;

    if (quizType === 'capital') return `${options[correctOptionNum].capital} is the capital of`;
    else if (quizType === 'flag') return 'Which country does this flag belong to?'
  }

  const removeOptions = () => {
    setOptions([]);
  }

  const createOptions = () => {
    for (let i = 0; i < optionsNum; i++) {
      const randNum = getRandomNum(countriesLength);
      const country = countries[randNum];
      setOptions(prev => [...prev, {id: i, ...country, isClicked: false}]);
    }
  }

  const resetOptions = () => {
    setCorrectOptionNum(getRandomNum(optionsNum));
    removeOptions();
    createOptions();
  }

  const setTrueToClickedOption = (id: number) => {
    if (phase === 'checking') return;

    setOptions(prev => prev.map(option => {
      if (option.id !== id) return option;
      return {...option, isClicked: true};
    }));
  }

  const changeQuizType = () => {
    const randNum = getRandomNum(quizTypes.length);
    setQuizType(quizTypes[randNum]);
  }

  const getFlagSvg = (): string => {
    return options[correctOptionNum].flag
  }

  useEffect(() => {
    createOptions();
    changeQuizType();
  }, []);


  return (
    <div className={styles.countryQuiz}>
      <div className={styles.countryQuizInner}>
        <p className={styles.countryQuizTitle}>COUNTRY QUIZ</p>
        <div className={styles.countryQuizContainer}>
          {(phase === 'answering' || phase === 'checking') && (
            <div className={styles.countryQuizCard}>
              {quizType === 'flag' && (
                <FlagImg getFlagSvg={getFlagSvg} />
              )}
              <QuizTheme getThemeText={getThemeText} />
              <OrderedOptions
                options={options}
                phase={phase}
                correctOptionNum={correctOptionNum}
                setPhase={setPhase}
                setSituation={setSituation}
                setTrueToClickedOption={setTrueToClickedOption}
              />
              {phase === 'checking' && (
                <NextBtn
                  situation={situation}
                  setPhase={setPhase}
                  resetOptions={resetOptions}
                  setCorrectCount={setCorrectCount}
                  changeQuizType={changeQuizType}
                />
              )}
            </div>
          )}
          {phase === 'finished' && (
            <Result
              correctCount={correctCount}
              setCorrectCount={setCorrectCount}
              setPhase={setPhase}
              resetOptions={resetOptions}
              changeQuizType={changeQuizType}
              setSituation={setSituation}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CountryQuiz;