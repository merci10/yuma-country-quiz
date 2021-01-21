import React, { createContext, useContext, useEffect, useState } from 'react';
import { Country } from '../models/country';

const countriesContext = createContext<Country[]>([])

export function CountriesProvider(props: {children: React.ReactNode}) {
  const [countries, setCountries] = useState<Country[]>()

  useEffect(() => {
    (async function () {
      const response = await fetch('https://restcountries.eu/rest/v2/all');
      const data = await response.json();

      setCountries(data);
    })();
  }, []);

  if (!countries) return <p>Loading...</p>

  return (
    <countriesContext.Provider value={countries}>
      {props.children}
    </countriesContext.Provider>
  )
}

export function useCountriesState() {
  return useContext(countriesContext);
}
