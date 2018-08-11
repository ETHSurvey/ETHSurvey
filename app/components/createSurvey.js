import EmbarkJS from 'Embark/EmbarkJS';
import React from 'react';
import { Form, Input, InputNumber, Modal, DatePicker, Col, Row, Steps, Icon, Button, message } from 'antd';

import AddFormField from './addFormField';

const FormItem = Form.Item;
const Step = Steps.Step;
const { TextArea } = Input;
let uuid = {key: 0, type: '', label: ''};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};


class CreateSurvey extends React.Component {

    constructor(props) {
      super(props);
  
      this.state = {
        current: 0,
        visible: false,
        labels: [],
        forms: [],
        expirationDate: '',
        funding: '',
        responsesLimit: 0
      }
    }

    next() {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  
    prev() {
      const current = this.state.current - 1;
      this.setState({ current });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      console.log('Received values of form: ', this.state);
    }

    setModalVisibility() {
      this.setState({ visible: !visible });
      return this.state.visible
    }

    handleCancel() {
      this.setState({ visible: false });
    }
  
    handleModalSubmit(values) {
      console.log(values)
      let updatedForms = this.state.forms;
      updatedForms.push(values);
      this.setState({
        forms: updatedForms
      })
      console.log(this.state)
    }

    onFundingChange(value) {
      console.log(value)
      this.setState({
        funding: value
      })
    }

    onDateSelect(date, dateString) {
      console.log(date, dateString);
      this.setState({
        expirationDate: dateString
      })
    }

    onResponseChange(value) {
      this.setState({
        responsesLimit: value
      })
    }
  
    render(){
      const { current } = this.state;

      const { getFieldDecorator, getFieldValue } = this.props.form;

      const steps = [{
        title: 'Build Form',
      }, {
        title: 'Set Pricing & Expiration',
      }, {
        title: 'Review',
      }];

      return (
        <div>
          <h1> Create a Survey </h1>
          <Row type="flex">
            <Col span={24}>
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <Form onSubmit={this.handleSubmit.bind(this)} className="m-top-40">
                <div className={steps[current].title === 'Build Form' ? 'steps-content' : 'hidden'}>
                  {this.state.forms.map((form, index) => {
                    return(
                      <div key={index}>
                        <p>{form.label}</p>
                        {form.description && (
                          <p>{form.description}</p>
                        )}
                        {form.type === 'text' && (
                          <Input name="label" type="text"/>
                        )}
                        {form.type === 'phoneNumber' && (
                          <InputNumber min={1} max={10}/>
                        )}
                        {form.type === 'textarea' && (
                          <TextArea rows={4} />
                        )}
                      </div>
                    )
                  })}
                  <AddFormField
                    submit={this.handleModalSubmit.bind(this)}
                  />
                </div>
                <div className={steps[current].title === 'Set Pricing & Expiration' ? 'steps-content' : 'hidden'}>
                  <p>Select Expiration date</p>
                  <DatePicker onChange={this.onDateSelect.bind(this)} />
                  <p>Set Funding Amount</p>
                  <InputNumber
                    formatter={value => `${value}ETH`}
                    parser={value => value.replace('ETH', '')}
                    onChange={this.onFundingChange.bind(this)}
                  />
                  <p>Set Responses limit</p>
                  <InputNumber
                    onChange={this.onResponseChange.bind(this)}
                  />
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
                <div className="steps-action">
                  {
                    current < steps.length - 1
                    && <Button type="primary" onClick={() => this.next()}>Next</Button>
                  }
                  {
                    current === steps.length - 1
                    && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                  }
                  {
                    current > 0
                    && (
                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                      Previous
                    </Button>
                    )
                  }
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      );
    }
  }

const WrappedForm = Form.create()(CreateSurvey);
export default WrappedForm;