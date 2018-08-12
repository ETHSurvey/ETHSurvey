import EmbarkJS from 'Embark/EmbarkJS';
import Survey from 'Embark/contracts/Survey';
import React from 'react';
import { Form, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap';

class Blockchain extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      valueSet: '',
      valueGet: '',
      logs: []
    }
  }

  handleChange(e) {
    this.setState({valueSet: e.target.value});
  }

  setValue(e) {
    e.preventDefault();

    console.log(this.state.valueSet);
    web3.eth.getBalance(Survey.address).then(_value => console.log(_value));

    // If web3.js 1.0 is being used
    if (EmbarkJS.isNewWeb3()) {
      Survey.methods.surveyInfo(this.state.valueSet).call().then(_value => console.log(_value));
    }
  }

  createSurvey(e) {
    e.preventDefault();

    if (EmbarkJS.isNewWeb3()) {
      Survey.methods.createSurvey(
        'Survey 101',
        1 * 10**18,
        100,
        0x0,
        3600,
        ''
      ).send({from: web3.eth.defaultAccount, value: 1 * 10**18});
    }
  }

  submitResponse(e) {
    e.preventDefault();

    console.log('submitResponse');
    web3.eth.getBalance(Survey.address).then(_value => console.log(_value))

    if (EmbarkJS.isNewWeb3()) {
      Survey.methods.submitSurveyResponse(
        'Survey 101',
        'NA'
      ).send({from: web3.eth.defaultAccount});
    }
  }

  _addToLog(txt) {
    this.state.logs.push(txt);
    this.setState({logs: this.state.logs});
  }

  render() {
    return (<React.Fragment>
        <h3> 1. Set the value in the blockchain</h3>
        <Form inline>
          <FormGroup>
            <FormControl
              type="text"
              defaultValue={this.state.valueSet}
              onChange={(e) => this.handleChange(e)}/>
            <Button bsStyle="primary" onClick={(e) => this.setValue(e)}>Set Value</Button>
            <HelpBlock>Once you set the value, the transaction will need to be mined and then the value will be updated
              on the blockchain.</HelpBlock>
          </FormGroup>
        </Form>

        <h3> 2. Get the current value</h3>
        <Form inline>
          <FormGroup>
            <HelpBlock>current value is <span className="value">{this.state.valueGet}</span></HelpBlock>
            <Button bsStyle="primary" onClick={(e) => this.createSurvey(e)}>Create Survey</Button>
            <Button bsStyle="primary" onClick={(e) => this.submitResponse(e)}>Submit Response</Button>
            <HelpBlock>Click the button to get the current value. The initial value is 100.</HelpBlock>
          </FormGroup>
        </Form>

        <h3> 3. Contract Calls </h3>
        <p>Javascript calls being made: </p>
        <div className="logs">
          {
            this.state.logs.map((item, i) => <p key={i}>{item}</p>)
          }
        </div>
      </React.Fragment>
    );
  }
}

export default Blockchain;