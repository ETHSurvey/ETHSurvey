import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Tab = Tabs.TabPane;
const { Header, Content, Footer } = Layout;

import EmbarkJS from 'Embark/EmbarkJS';
import Blockchain from './components/blockchain';
import Storage from './components/storage';
import CreateSurvey from './components/createSurvey';
import ViewSurveys from './components/viewSurverys';
import Home from './components/home';

import './dapp.css';
import 'antd/dist/antd.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      whisperEnabled: false,
      storageEnabled: false
    }
  }

  componentDidMount(){ 
    EmbarkJS.onReady(() => {
      /*if (EmbarkJS.isNewWeb3()) {
        EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, version) => { 
          if(!err)
              this.setState({whisperEnabled: true})
            else
              console.log(err);
        });
      }*/

      this.setState({
        storageEnabled: true
      });
    });
  }


  _renderStatus(title, available){
    let className = available ? 'pull-right status-online' : 'pull-right status-offline';
    return (
      <div>
        {title} 
        <span className={className}></span>
      </div>
    );
  }

  render(){
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo">
              Survey
            </div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="5"><Link to="/storage">Storage</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/blockchain">Blockchain</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/view">Topics</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/create">About</Link></Menu.Item>
                <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
              </Menu>
          </Header>
          <Content className="container">
            <Route exact path="/" component={Home} />
            <Route path="/create" component={CreateSurvey} />
            <Route path="/view" component={ViewSurveys} />
            <Route path="/blockchain" component={Blockchain} />
            <Route path="/storage" component={Storage} />
          </Content>
        </Layout>
      </Router>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
