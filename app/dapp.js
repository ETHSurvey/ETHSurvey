import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import EmbarkJS from 'Embark/EmbarkJS';
import Blockchain from './components/blockchain';
import Storage from './components/storage';
import TakeSurvey from './components/takeSurvey';
import CreateSurvey from './components/createSurvey';
import ViewSurveys from './components/viewSurverys';
import Home from './components/home';
import Identicon from './components/identi';
import logo from './images/logo.svg';

import './dapp.css';
import 'antd/dist/antd.css';

const { Header, Content } = Layout;

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedInAccount:  '0x000000000000000000000000',
      storageEnabled: false,
      showNavbar: true,
    }
  }

  componentDidMount(){
    EmbarkJS.onReady(() => {
      this.setState({
        storageEnabled: true,
        loggedInAccount: web3.eth.defaultAccount
      });
    });
  }


  _renderStatus(title, available){
    let className = available ? 'pull-right status-online' : 'pull-right status-offline';
    return (
      <div>
        {title} 
        <span className={className} />
      </div>
    );
  }

  render() {
    return (
      <Router>
        <Layout className="layout">
          {this.state.showNavbar && (
            <Header>
              <div className="logo">
                <img src={logo} /> ETHSurvey
              </div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="7" disabled>{this.state.loggedInAccount.substring(0,4)}... <Identicon address={this.state.loggedInAccount} size={30}/></Menu.Item>
                <Menu.Item key="6"><Link to="/survey">Take Survey</Link></Menu.Item>
                {/*<Menu.Item key="5"><Link to="/storage">Storage</Link></Menu.Item>*/}
                {/*<Menu.Item key="4"><Link to="/blockchain">Blockchain</Link></Menu.Item>*/}
                <Menu.Item key="3"><Link to="/view">View</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/create">Create</Link></Menu.Item>
                <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
              </Menu>
            </Header>
          )}
          <Content className="container">
            <Route exact path="/" component={Home} />
            <Route path="/create" component={CreateSurvey} />
            <Route path="/view" component={ViewSurveys} />
            <Route path="/blockchain" component={Blockchain} />
            <Route path="/storage" component={Storage} />
            <Route path="/survey" component={TakeSurvey} />
          </Content>
        </Layout>
      </Router>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
