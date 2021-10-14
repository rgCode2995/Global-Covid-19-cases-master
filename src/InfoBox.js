import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, isRedO, color, country, ...props }) {
  return (
    <div className="infobox_main">    
      <Card style={{ backgroundColor: "#19345c", borderRadius: '15px', margin: '7px 9px' }}
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"
          } ${isRedO && "infoBox--redO"} `}
      >
        <div className="CardContent_main">
          <div className="country_box">
            <h1 className="country_name">{country}</h1>
          </div>
          <CardContent >
            <Typography style={{color:'#6be1ff'}} color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${isRedO && "infoBox__cases--red"}`}>
              {cases}
            </h2>
            <Typography style={{color:'white'}} className="infoBox__total" color="textSecondary">
              {total} Total
            </Typography>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default InfoBox;
