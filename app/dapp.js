import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Layout } from 'antd';
import 'antd/dist/antd.css';

const Tab = Tabs.TabPane;
const { Header, Content, Footer } = Layout;

import EmbarkJS from 'Embark/EmbarkJS';
import Blockchain from './components/blockchain';
import Storage from './components/storage';

import './dapp.css';

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
      if (EmbarkJS.isNewWeb3()) {
        EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, version) => { 
          if(!err)
              this.setState({whisperEnabled: true})
            else
              console.log(err);
        });
      }

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
      <Layout className="layout">
        <Header>
          <div className="logo">
            Survey
          </div>
        </Header>
        <Content style={{ padding: '0 15%' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: '86vh' }}>
          <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
            <Tab eventKey={1} tab="Blockchain" key="1">
              <Blockchain />
            </Tab>
            <Tab eventKey={2} tab={this._renderStatus('Decentralized Storage', this.state.storageEnabled)} key="2">
              <Storage enabled={this.state.storageEnabled} />
            </Tab>
          </Tabs>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Survey
        </Footer>
      </Layout>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
