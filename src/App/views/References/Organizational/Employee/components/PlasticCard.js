import React from 'react';

import classes from './PlasticCards.module.css';

const PlasticCard = (props) => {
  return (
    <div className={classes["Base"]}>
      <div className={classes[`Inner-wrap-${props.name}`]}>
        <div className={classes['card-top']}>
          <p>{props.name}</p>
        </div>

        <div className={classes['card-middle']}>
          <svg className={classes["Chip"]} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 387.8 380.3">
            <style type="text/css">
              {"\
              .st0{\
                fill:url(#gold-gradient);\
                stroke:#000000;\
                stroke-width:10;\
                stroke-miterlimit:10;\
              }\
            "}
            </style>
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c79750"></stop>
                <stop offset="20%" stopColor="#e6b964"></stop>
                <stop offset="50%" stopColor=" #f8e889"></stop>
                <stop offset="80%" stopColor=" #deb15f"></stop>
                <stop offset="100%" stopColor=" #dfb461"></stop>
              </linearGradient>
            </defs>
            <g id="XMLID_4_">
              <path id="XMLID_1_" className="st0" d="M308.8,375.3H79.1C38.2,375.3,5,342.1,5,301.2V79.1C5,38.2,38.2,5,79.1,5h229.7
		c40.9,0,74.1,33.2,74.1,74.1v222.2C382.8,342.1,349.7,375.3,308.8,375.3z"/>
              <line id="XMLID_2_" className="st0" x1="109.9" y1="5.1" x2="109.9" y2="375.1" />
              <line id="XMLID_3_" className="st0" x1="4.9" y1="95.1" x2="109.9" y2="95.1" />
              <line id="XMLID_7_" className="st0" x1="4.9" y1="185.1" x2="109.9" y2="185.1" />
              <line id="XMLID_8_" className="st0" x1="1.9" y1="275.1" x2="106.9" y2="275.1" />
              <line id="XMLID_9_" className="st0" x1="276.9" y1="275.1" x2="381.9" y2="275.1" />
              <line id="XMLID_10_" className="st0" x1="274.9" y1="185.1" x2="379.9" y2="185.1" />
              <line id="XMLID_11_" className="st0" x1="277.9" y1="95.1" x2="382.9" y2="95.1" />
              <g id="XMLID_6_">
                <g id="XMLID_14_">
                  <g id="XMLID_32_">
                    <path id="XMLID_33_" d="M277.4,90.1h-1c-2.5,0-4.5,2-4.5,4.5v272c0,2.5,2,4.5,4.5,4.5h1c2.5,0,4.5-2,4.5-4.5v-272
					C281.9,92.1,279.9,90.1,277.4,90.1z"/>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <div>
            <div className={classes["Card-number"]}>{props.cardNumber}</div>
            <div className={classes['Expire']}>
              {/* <p>{props.expireDate.slice(0, 2)}/{props.expireDate.slice(8)}</p> */}
              <p>YY/MM</p>
            </div>
          </div>
        </div>

        <div className={classes['Name']}>
          <h3>{props.fullName}</h3>
        </div>
      </div>
    </div>
  );
};

export default PlasticCard;