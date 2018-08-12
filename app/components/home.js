import React from 'react';
import { Icon } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import parallelo from '../images/parallello.svg';

class CreateSurvey extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
      }
    }
  
    render(){
      return (
        <div className="home-container">
          <div className="tagline">
            <h1> Surveys, Decentralized & Incentivised! </h1>
            <img src={parallelo} />
          </div>
          <div className="action-container">
            <Link to="/create"><h3>BUIDL Survey <Icon type="right-circle-o" /></h3></Link>
            <Link to="/view"><h3>View your Surveys <Icon type="right-circle-o" /></h3></Link>
          </div>
        </div>
      );
    }
  }

export default CreateSurvey;