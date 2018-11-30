import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Card, Col, Row } from 'antd';

// Types
import { Survey as SurveyClass } from '@src/types/Survey';
import { Web3State } from '@src/redux/modules/web3';

interface Survey {
  name: string;
  totalResponses: string;
}

interface ViewSurveysProps extends RouteComponentProps<{}> {
  web3State: Web3State;
}

interface ViewSurveysState {
  surveys: Survey[];
}

class ViewSurveys extends React.Component<ViewSurveysProps, ViewSurveysState> {
  constructor(props: ViewSurveysProps) {
    super(props);

    this.state = {
      surveys: []
    };
  }

  componentDidUpdate(prevProps: ViewSurveysProps) {
    const { web3State } = this.props;
    const web3 = web3State.get('web3');
    const SurveyContract: SurveyClass = web3State.get('survey');

    if (this.props !== prevProps && SurveyContract !== null) {
      SurveyContract.methods
        .getUserSurveys(web3State.get('accounts').get(0))
        .call()
        .then(value => {
          const count = value[0].length;

          const FIELD_NAME = 0;
          const FIELD_TOTAL_RESPONSES = 1;

          const surveys = [];

          for (let i = 0; i < count; i++) {
            const s = {
              name: web3.utils.toAscii(value[FIELD_NAME][i]),
              totalResponses: value[FIELD_TOTAL_RESPONSES][i]
            };

            surveys.push(s);
          }

          this.setState({ surveys });
        });
    }
  }

  render() {
    return (
      <div>
        <Row gutter={16}>
          <h1>Your Surveys</h1>

          {this.state.surveys.map((survey, index) => {
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
        </Row>
      </div>
    );
  }
}

export default ViewSurveys;
