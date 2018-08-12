import EmbarkJS from 'Embark/EmbarkJS';
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
        }]
      }
    }

    componentDidMount(){ 
      EmbarkJS.onReady(() => {
        this.loadHash('QmYNFHgyivYtiqwaNJx1Ha5iAMyABweLKmhYtCwe38367c')
      });
    }

    loadHash(hash){
      EmbarkJS.Storage.get(hash)
        .then((content) => {
          const contentJson = JSON.parse(content);
          console.log(contentJson)
          this.setState({ forms: contentJson.forms });
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