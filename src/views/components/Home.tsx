import * as React from 'react';
import { Icon, Layout } from 'antd';
import { Link } from 'react-router-dom';

// Assets
import parallelo from '@src/img/parallello.svg';

const { Content } = Layout;

class Home extends React.Component<{}, {}> {
  public render() {
    return (
      <Layout>
        <Content>
          <div className="home-container">
            <div className="tagline">
              <h1>Surveys, Decentralized & Incentivised!</h1>
              <img src={parallelo} />
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
