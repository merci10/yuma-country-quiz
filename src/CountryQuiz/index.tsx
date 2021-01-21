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

  const [options, setOptions] = useState<Option[]>([]); // 選択肢の国の配列
  const [correctCount, setCorrectCount] = useState(0); // 正解数
  const [correctOptionNum, setCorrectOptionNum] = useState(getRandomNum(optionsNum)); // options配列の何番目を正解にするかの数
  const [phase, setPhase] = useState('answering'); // 解答中or答え合わせor結果

  const addCorrectCount = () => {
    setCorrectCount(prev => prev + 1);
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

  const changePhase = (phase: string) => {
    setPhase(phase);
  }

  useEffect(() => {
    // removeOptions();
    createOptions();
  }, []);

  // useEffect(() => {
  //   if (count === 0) return;
  // }, [count]);

  console.log(options);

  return (
    <div className={styles.countryQuiz}>
      <div className={styles.countryQuizInner}>
        <p className={styles.countryQuizTitle}>COUNTRY QUIZ</p>
        <div className={styles.countryQuizCard}>
          <p className={styles.countryQuizQuestionTitle}></p>
          {(phase === 'answering' || phase === 'checking') && (
            <div className={`${styles.countryQuizOptions} ${phase === 'checking' ? styles.isChecking : styles.isAnswering}`}>
              {options.map((option, i) => {
                if (correctOptionNum === i) return (
                  <button
                    className={`${styles.countryQuizOption} ${phase === 'checking' ? styles.isCorrectOption : ''}`}
                    key={i}
                    onClick={() => {
                      addCorrectCount();
                      changePhase('checking')
                      setOptionClickedTrue(option.id)
                    }}
                  >
                    {option.name}だよ
                  </button>
                );
                else return (
                  <button
                    className={`${styles.countryQuizOption} ${option.isClicked ? styles.isIncorrectOption : ''}`}
                    key={i}
                    onClick={() => {
                      changePhase('checking');
                      setOptionClickedTrue(option.id);
                    }}
                  >
                    {option.name}
                  </button>
                );
              })}
            </div>
          )}
          {phase === 'checking' && (
            <button
              className={styles.countryQuizNextBtn}
              onClick={() => changePhase('finished')}
            >
              Next
            </button>
          )}
          {phase === 'finished' && (
            <div className={styles.countryQuizResult}>
              <div className={styles.countryQuizResultImg}></div>
              <p className={styles.countryQuizResultTitle}>Result</p>
              <p className={styles.countryQuizResultComment}></p>
              <button className={styles.countryQuizTryAgainBtn}>Try again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}