import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import { Col, Row, Card } from 'antd';


class ViewSurveys extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
      }
    }

    componentDidMount(){ 
      EmbarkJS.onReady(() => {
        //Ready
      });
    }
  
    render(){
      return (
        <div>
          <Row gutter={16}>
          <h1>Your Surveys</h1>
            <Col span={8}>
              <Card title="Survey 1" bordered={false} className="survery-card">32 Responses </Card>
            </Col>
            <Col span={8}>
              <Card title="Survey 2" bordered={false} className="survery-card">11 Responses </Card>
            </Col>
            <Col span={8}>
              <Card title="Survey 3" bordered={false} className="survery-card">122 Responses </Card>
            </Col>
          </Row>
        </div>
      );
    }
  }

export default ViewSurveys;