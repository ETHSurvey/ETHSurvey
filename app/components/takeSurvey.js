import EmbarkJS from 'Embark/EmbarkJS';
import Survey from 'Embark/contracts/Survey';
import React from 'react';
import { Form, Input, InputNumber, Modal, DatePicker, Col, Row, Steps, Icon, Button, message } from 'antd';

const { TextArea } = Input;

class TakeSurvey extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        name: 'ETH India',
        forms: [{
          label: 'Name',
          description: '',
          type: 'text',
        },{
          label: 'DEsc',
          description: '',
          type: 'textarea',
        },
        {
          label: 'Email',
          description: '',
          type: 'text',
        }],
        prevResponses: []
      }
    }

    componentDidMount(){ 
      const surveyName = 'Test5';
      EmbarkJS.onReady(() => {
        Survey.methods.surveyInfo(surveyName).call().then((value) => {
          this.loadHash(value[1], value[2]);
        });
      });
      // this.loadHash('QmPP8FtsZRQD1duZrbsRti6TUrqtRvPKTtXYzHjDQkudBY');
    }

    loadHash(hash, previousSubmissionHash){
      EmbarkJS.Storage.get(hash)
        .then((content) => {
          const contentJson = JSON.parse(content);
          console.log(contentJson)
          this.setState({ forms: contentJson.forms });
          EmbarkJS.Storage.get(previousSubmissionHash)
            .then((content) => {
              const contentJson = JSON.parse(content);
              console.log(contentJson)
              this.setState({ prevResponses: contentJson.forms });
            })
            .catch((err) => {
                if(err){
                    console.log("Storage get Error => " + err.message);
                }
            });
        })
        .catch((err) => {
            if(err){
                console.log("Storage get Error => " + err.message);
            }
        });
    }

    updateFormState(form, index, event) {
      console.log(form);
      console.log(index);
      console.log(event.target.value);      
      let newForm = form;
      newForm['value'] = event.target.value;
      let forms = this.state.forms;
      forms[index] = newForm;
      this.setState({ forms });
      // console.log(this.state.forms);
    }

    onSubmitSurvey() {
      console.log(this.state)
      EmbarkJS.Storage.saveText(JSON.stringify(this.state.forms))
        .then((hash) => {
          console.log(hash);
          let currentResponseHash = hash;
          EmbarkJS.Storage.saveText(JSON.stringify(this.state.prevResponses))
          .then((value) => {
            console.log(hash);
            Survey.methods.submitSurveyResponse(
              this.state.name,
              currentResponseHash,
              value
            ).send({from: web3.eth.defaultAccount}).then((value) => {
              console.log('done');
            });
          })
          .catch((err) => {
            if(err){
              message.error('There was an error: ' + err.message);
            }
          });
        })
        .catch((err) => {
          if(err){
            message.error('There was an error: ' + err.message);
          }
        });
    }
  
    render(){
      return (
        <div style={{padding: '0 20%'}}>
          <h1 className="text-center"> {this.state.name} </h1>
          {this.state.forms.map((form, index) => {
            return(
              <div key={index} className="m-top-30">
                <h3 className="label">{form.label}</h3>
                {form.description && (
                  <p className="description">{form.description}</p>
                )}
                {form.type === 'text' && (
                  <Input name="label" type="text" onChange={this.updateFormState.bind(this, form, index)} />
                )}
                {form.type === 'phoneNumber' && (
                  <InputNumber min={1} max={10} onChange={this.updateFormState.bind(this, form, index)}/>
                )}
                {form.type === 'textarea' && (
                  <TextArea rows={4} onChange={this.updateFormState.bind(this, form, index)}/>
                )}
              </div>
            )
          })}
          <div className="take-survey-submit">
            <Button size="large" type="primary" onClick={this.onSubmitSurvey.bind(this)}>Submit</Button>
          </div>
        </div>
      );
    }
  }

export default TakeSurvey;