import React from 'react';
import { Card, Col, Row } from 'antd';

// Types
import { DefaultProps } from '@src/core/props';
import { DashboardState } from '@src/core/state';

// Services
import { getSurveyList } from '@src/core/services';

class Dashboard extends React.Component<DefaultProps, DashboardState> {
  constructor(props: DefaultProps) {
    super(props);

    this.state = {
      surveys: []
    };
  }

  componentDidMount() {
    const { web3State } = this.props;
    const SurveyContract = web3State.get('survey');

    if (SurveyContract !== null) {
      SurveyContract.methods
        .getUserSurveys(web3State.get('accounts').get(0))
        .call()
        .then(value => {
          const surveys = getSurveyList(value);

          this.setState({ surveys });
        });
    }
  }

  componentDidUpdate(prevProps: DefaultProps) {
    const { web3State } = this.props;
    const SurveyContract = web3State.get('survey');

    if (this.props !== prevProps && SurveyContract !== null) {
      SurveyContract.methods
        .getUserSurveys(web3State.get('accounts').get(0))
        .call()
        .then(value => {
          const surveys = getSurveyList(value);

          this.setState({ surveys });
        });
    }
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <h1>Your Surveys</h1>

          {this.state.surveys.length > 0 &&
            this.state.surveys.map((survey, index) => {
              return (
                <div key={index}>
                  <Col span={8}>
                    <Card
                      title={survey.name}
                      bordered={false}
                      className="survery-card"
                    >
                      {`${survey.totalResponses} Responses`}
                    </Card>
                  </Col>
                </div>
              );
            })}

          {this.state.surveys.length === 0 && <p>No surveys found</p>}
        </Row>
      </div>
    );
  }
}

export default Dashboard;
