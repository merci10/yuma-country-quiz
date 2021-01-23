import React, { useEffect, useState } from 'react';
import { useCountriesState } from './components/CountriesProvider';
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

  const [quizType, setQuizType] = useState('capital');
  const [options, setOptions] = useState<Option[]>([]); // 選択肢の国の配列
  const [situation, setSituation] = useState('continued'); //  正解したか不正解したか
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [correctOptionNum, setCorrectOptionNum] = useState(getRandomNum(optionsNum)); // options配列の何番目を正解にするかの数
  const [phase, setPhase] = useState('answering'); // 解答中or答え合わせor結果

  const getTitleInfo = () => {
    if (options.length === 0) return;

    if (quizType === 'capital') return options[correctOptionNum].capital;
    else if (quizType === 'flag') return options[correctOptionNum].name;
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

  const setOptionClickedTrue = (id: number) => {
    if (phase === 'checking') return;

    setOptions(prev => prev.map(option => {
      if (option.id !== id) return option;
      return {...option, isClicked: true};
    }));
  }

  useEffect(() => {
    createOptions();
  }, []);

  return (
    <div className={styles.countryQuiz}>
      <div className={styles.countryQuizInner}>
        <p className={styles.countryQuizTitle}>COUNTRY QUIZ</p>
        <div className={styles.countryQuizContainer}>
          {(phase === 'answering' || phase === 'checking') && (
            <div className={styles.countryQuizCard}>
              <p className={styles.countryQuizQuestionTitle}>{getTitleInfo()} is the capital of</p>
              <div className={`${styles.countryQuizOptions} ${phase === 'checking' ? styles.isChecking : styles.isAnswering}`}>
                {options.map((option, i) => {
                  if (correctOptionNum === i) return (
                    <button
                      className={`${styles.countryQuizOption} ${phase === 'checking' ? styles.isCorrectOption : ''}`}
                      key={option.id}
                      onClick={() => {
                        setPhase('checking')
                        setOptionClickedTrue(option.id)
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
                        setOptionClickedTrue(option.id);
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