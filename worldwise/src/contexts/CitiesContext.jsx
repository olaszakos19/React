/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useContext, useReducer } from "react";
import { createContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState =  {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}


function reducer(state,action){
  switch(action.type){

    case 'loading':
      return {
        ...state,
        isLoading: true,
      };

    case 'cities/loaded':
      return{
        ...state,
        isLoading: false,
        cities: action.payload
      };

    case 'city/loaded':
      return{
        ...state,
        isLoading: false,
        currentCity: action.payload,

      };

    case 'city/created':
      return{
        ...state,
        isLoading: false,
        cities: [...state.cities,action.payload],
        currentCity: action.payload
      };

    case 'city/deleted':
      return{
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id != action.payload),
        currentCity: {}
      };

    case 'rejected':
      return{
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
       throw new Error("Unkonw action type");
  }
}


function CitiesProvider({ children }) {
  
  const [{cities,isLoading,currentCity}, dispatch] = useReducer(reducer,initialState);
  
  //const [cities, setCities] = useState([]);
  //const [isLoading, setIsLoading] = useState(false);
  //const [currentCity, setCurrentCity] = useState({});
  
  
  useEffect(function () {
    async function fetchCities() {
      dispatch({type: 'loading'});
      try {

        //setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: "cities/loaded",payload: data})
        //setCities(data);
      } catch {
        dispatch({type: "rejected",payload: "Error"});
        //alert("Error");
      } 
    }
    fetchCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    dispatch({type: 'loading'});
    try {
      
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type: 'city/loaded',payload: data});
      //setCurrentCity(data);
    } catch {
      dispatch({type: "rejected",payload: "Error"});
    } 
  },[currentCity.id]);

  async function createCity(newCity) {
    dispatch({type: 'loading'});
    try {
      
      const res = await fetch(`${BASE_URL}/cities`, 
        {
          method: 'POST',
          body: JSON.stringify(newCity),
          headers:{
            "Content-Type": "application/json",
          },

        } );
      const data = await res.json();
      dispatch({type: 'city/created',payload:data});
      //setCities((cities) => [...cities,data]);
    } catch {
      alert("Error");
    } 
  }

  async function deleteCity(id) {
    dispatch({type: 'loading'});
    try {
     
      const res = await fetch(`${BASE_URL}/cities/${id}`, 
        {
          method: 'DELETE',
          

        } );
      const data = await res.json();
      dispatch({type: 'city/deleted',payload: id});
      //setCities((cities) => cities.filter((city) => city.id != id));
    } catch {
      alert("Error");
    } 
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
