import React, { useEffect, useState } from 'react';
import { useCountriesState } from './components/CountriesProvider';
import QuizTheme from './components/QuizTheme';
import styles from './index.module.css';
import { Option } from './models/option';

// 0 ~ (max以下) の整数を返す
const getRandomNum = (max: number):  number => {
  return Math.floor(Math.random() * max);
}

export function CountryQuiz() {
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

  const createOptions = () => {
    for (let i = 0; i < optionsNum; i++) {
      const randNum = getRandomNum(countriesLength);
      const country = countries[randNum];
      setOptions(prev => [...prev, {id: i, ...country, isClicked: false}]);
    }
  }

  const removeOptions = () => {
    setOptions([]);
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
                <div className={styles.countryQuizFlagImgOuter}>
                  <img className={styles.countryQuizFlagImg} src={getFlagSvg()} alt="A image of the flag" width="84px" height="auto" />
                </div>
              )}
              <QuizTheme getThemeText={getThemeText}></QuizTheme>
              <div className={`${styles.countryQuizOptions} ${phase === 'checking' ? styles.isChecking : styles.isAnswering}`}>
                {options.map((option, i) => {
                  if (correctOptionNum === i) return (
                    <button
                      className={`${styles.countryQuizOption} ${phase === 'checking' ? styles.isCorrectOption : ''}`}
                      key={option.id}
                      onClick={() => {
                        setPhase('checking')
                        setTrueToClickedOption(option.id)
                      }}
                    >
                      {option.name}だよ
                    </button>
                  );
                  else return (
                    <button
                      className={`${styles.countryQuizOption} ${option.isClicked ? styles.isIncorrectOption : ''}`}
                      key={option.id}
                      onClick={() => {
                        setPhase('checking');
                        setSituation('gameOver');
                        setTrueToClickedOption(option.id);
                      }}
                    >
                      {option.name}
                    </button>
                  );
                })}
              </div>
              {phase === 'checking' && (
                <button
                  className={styles.countryQuizNextBtn}
                  onClick={() => {
                    if (situation === 'continued') {
                      setPhase('answering');
                      setCorrectOptionNum(getRandomNum(optionsNum));
                      removeOptions();
                      createOptions();
                      changeQuizType();
                      setCorrectCount(prev => prev + 1)
                    } else if (situation === 'gameOver') {
                      setPhase('finished');
                    }
                  }}
                >
                  Next
                </button>
              )}
            </div>
          )}
          {phase === 'finished' && (
            <div className={styles.countryQuizResult}>
              <div className={styles.countryQuizResultImg}></div>
              <p className={styles.countryQuizResultTitle}>Result</p>
              <p className={styles.countryQuizResultDescription}>You got <span className={styles.countryQuizResultCorrectAnswerCount}>{correctCount}</span> correct asnwers</p>
              <button
                className={styles.countryQuizTryAgainBtn}
                onClick={() => {
                  setPhase('answering');
                  setSituation('continued');
                  setCorrectOptionNum(getRandomNum(optionsNum));
                  removeOptions();
                  createOptions();
                  changeQuizType();
                  setCorrectCount(0);
                }}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}