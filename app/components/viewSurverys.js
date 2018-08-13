import EmbarkJS from 'Embark/EmbarkJS';
import Survey from 'Embark/contracts/Survey';
import React from 'react';
import { Col, Row, Card } from 'antd';


class ViewSurveys extends React.Component {

    constructor(props) {
      super(props);
      console.log(props);
    }

    componentDidMount(){ 
      EmbarkJS.onReady(() => {
        // Ready
        // If web3.js 1.0 is being used
        if (EmbarkJS.isNewWeb3()) {
          Survey.methods.getUserSurveys(web3.eth.defaultAccount)
            .call()
            .then((data) => {
              console.log(data);

              const count = data[0].length;

              const FIELD_NAME  = 0;
              const FIELD_TOTAL_RESPONSES = 1;

              let surveys = [];

              for (let i = 0; i < count; i++) {
                const s = {
                  name:  data[FIELD_NAME][i],
                  totalResponses: data[FIELD_TOTAL_RESPONSES][i],
                }

                surveys.push(s);
              }

              console.log('surveys =', surveys);
            });
        }
      });
    }
  
    render(){
      return (
        <div>
          <Row gutter={16}>
          <h1>Your Surveys</h1>
            <Col span={8}>
              <Card title="Survey 1" bordered={false} className="survery-card">12 Responses </Card>
            </Col>
            <Col span={8}>
              <Card title="Survey 3" bordered={false} className="survery-card">122 Responses </Card>
            </Col>
            <Col span={8}>
              <Card title="Survey 3" bordered={false} className="survery-card">45 Responses </Card>
            </Col>
          </Row>
        </div>
      );
    }
  }

export default ViewSurveys;