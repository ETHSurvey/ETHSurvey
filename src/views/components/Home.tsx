import * as React from 'react';
import { Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';

// Types
import { DefaultProps } from '@src/core/props';
import { HomeState } from '@src/core/state';

// Services
import { getSurveyList } from '@src/core/services';

// Assets
import parallelo from '@src/img/parallello.svg';

const { Content } = Layout;

class Home extends React.Component<DefaultProps, HomeState> {
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
        .getAllSurveys()
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
        .getAllSurveys()
        .call()
        .then(value => {
          const surveys = getSurveyList(value);

          this.setState({ surveys });
        });
    }
  }

  public render() {
    return (
      <Layout>
        <Content>
          <div className="home-container">
            <div className="tagline">
              <h1>Surveys, Decentralized & Incentivised!</h1>
              <img src={parallelo} alt={'ETHSurvey'} />
            </div>
            <div className="action-container">
              <Link to="/create">
                <h3>
                  BUIDL Survey <Icon type="right-circle-o" />
                </h3>
              </Link>
              <Link to="/dashboard">
                <h3>
                  View your Surveys <Icon type="right-circle-o" />
                </h3>
              </Link>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Home;
