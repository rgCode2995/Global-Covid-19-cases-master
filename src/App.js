import React, { useState, useEffect } from "react";
import "./App.css";
import {

  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import Fade from 'react-reveal/Fade';
import logo from './image/logo.png'
import LoadingBar from 'react-top-loading-bar'



const App = () => {
  const [progress, setProgress] = useState(0)
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(1.5);
console.log(countryInfo,'countryInfo')
  useEffect(() => {
    setProgress(35);
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      setProgress(45);
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setProgress(70);
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
          setProgress(100);
        });
    };

    getCountriesData();
  }, []);
  console.log(country, "country")

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    if (countryCode === "worldwide") {
      document.title = "Coronavirus Outbreak in World"
    } else {
      document.title = `Coronavirus Outbreak in ${countryCode}`
    }


    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    setProgress(40);

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProgress(60);

        setInputCountry(countryCode);
        setCountryInfo(data);
        setProgress(100);

        // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        // setMapZoom(4);
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(2);
        }
        else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  const nameOfCountry = () => {
    if (country === 'worldwide') {
      return country
    } else {
      return countryInfo.country
    }
  }



  return (

    <div className="main_app">
      <div className="app">
        <LoadingBar
          height={5}
          color='#f11946'
          progress={progress}
        />
        <div>
          <div className="logo">
            <Fade top>
              <img src={logo} alt="Logo" />
              <h1>COVID-19 Tracker</h1>
            </Fade>
          </div>
          <div className="selectwrap">
            <select variant="outlined" value={country} onChange={onCountryChange}>
              <option value="worldwide">Worldwide</option>
              {countries.map((country, i) => (
                <option key={i} value={country.value}>{country.name}</option>))}
            </select>
          </div>
        </div>
      </div>
      <div className="main_top">
        <div className="left_container">
          <div className="infobox1">
            <InfoBox
              onClick={(e) => setCasesType("cases") }
              title="Coronavirus Cases"
              style={{ color: "#6be1ff" }}
              // country={countryInfo.country}
              country={nameOfCountry()}
              color="#6ce0ff"
              isRed
              active={casesType === "cases"}
              // cases={prettyPrintStat(countryInfo.todayCases)}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
          </div>
          <div className="infobox2">
            <div className="ininfox2">
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                color="#6ce0ff"
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
            </div>
            <div className="ininfox3">
              <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                isRedO
                color="#6ce0ff"
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>
          </div>
        </div>
        <div className="graph_container">
          <CardContent className="card_graph" >
            <p >Worldwide new {casesType}</p>
            <LineGraph casesType={casesType} />
          </CardContent>
        </div>
      </div>
      <div className="bottom_container">
        <div className="map_container">
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom} />
        </div>
        <div className="table_container">
          <Card className="app__right" style={{ borderRadius: '12px', background: '#102544' }}>
            <CardContent style={{ background: '#19345c' }}>
              <div className="app__information">
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};



// {/* <FormControl className="app__dropdown" >
// <Select
//   className="dropdown_menu"
//   style={{ color: '#6be1ff', backgroundColor: '#102544' }}
//   variant="outlined"
//   value={country}
//   onChange={onCountryChange}
// >
//   <MenuItem value="worldwide">Worldwide</MenuItem>
//   {countries.map((country, i) => (
//     <MenuItem key={i} value={country.value}>{country.name}</MenuItem>
//   ))}
// </Select>
// </FormControl> */}
export default App;