import React from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Steps
} from 'antd';
import moment from 'moment';

// import SurveyArtifact from '@contracts/Survey.sol';

import AddFormField from './AddFormField';
import { FormComponentProps } from 'antd/es/form';

const Step = Steps.Step;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
    xs: { span: 24 }
  },
  wrapperCol: {
    sm: { span: 20 },
    xs: { span: 24 }
  }
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    sm: { span: 20, offset: 4 },
    xs: { span: 24, offset: 0 }
  }
};

interface CreateSurveyState {
  amount: string;
  current: number;
  expirationTime: string;
  forms: Array<{}>;
  name: string;
  numResponses: number;
  showResults: boolean;
  visible: boolean;
}

class CreateSurvey extends React.Component<
  FormComponentProps,
  CreateSurveyState
> {
  constructor(props: FormComponentProps) {
    super(props);

    this.state = {
      amount: '',
      current: 0,
      expirationTime: '',
      forms: [],
      name: '',
      numResponses: 0,
      showResults: false,
      visible: false
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleSubmit(e: React.FormEvent<{}>) {
    e.preventDefault();
    console.log(this.state);

    // EmbarkJS.Storage.saveText(JSON.stringify(this.state))
    //   .then(hash => {
    //     console.log(hash);
    //     Survey.methods
    //       .createSurvey(
    //         this.state.name,
    //         this.state.amount * 10 ** 18,
    //         this.state.numResponses,
    //         0x0,
    //         this.state.expirationTime,
    //         hash
    //       )
    //       .send({
    //         from: web3.eth.defaultAccount,
    //         value: this.state.amount * 10 ** 18
    //       })
    //       .then(value => {
    //         console.log(value);
    //         this.setState({ showResults: true });
    //         message.success('Transaction completed successfully!');
    //       });
    //   })
    //   .catch(err => {
    //     if (err) {
    //       message.error('There was an error: ' + err.message);
    //     }
    //   });
  }

  handleCancel() {
    this.setState({ visible: false });
  }

  handleModalSubmit(values: {}) {
    const updatedForms = this.state.forms as Array<{}>;
    updatedForms.push(values);
    this.setState({ forms: updatedForms });
  }

  onFundingChange(amount: string) {
    this.setState({ amount });
  }

  onDateSelect(date: moment.Moment) {
    this.setState({ expirationTime: date.unix().toString() });
  }

  onResponseChange(numResponses: number) {
    this.setState({ numResponses });
  }

  render() {
    const { current } = this.state;

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const steps = [
      {
        title: 'Buidl Form'
      },
      {
        title: 'Set Expiration'
      },
      {
        title: 'Set Funding'
      }
    ];

    return (
      <div>
        <h1 className="m-bottom-40"> Create a Survey </h1>
        <Row type="flex" align="center">
          <Col span={20}>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </Col>
          <Col span={16}>
            {!this.state.showResults && (
              <Form
                onSubmit={this.handleSubmit.bind(this)}
                className="m-top-40 form-container"
              >
                <div
                  className={
                    steps[current].title === 'Buidl Form'
                      ? 'steps-content'
                      : 'hidden'
                  }
                >
                  <h3>Name of the Survey</h3>
                  <Input
                    name="name"
                    type="text"
                    onChange={e => this.setState({ name: e.target.value })}
                    value={this.state.name}
                  />
                  {this.state.forms.map((form, index) => {
                    return (
                      <div key={index} className="m-top-30">
                        <h3 className="label">{form.label}</h3>
                        {form.description && (
                          <p className="description">{form.description}</p>
                        )}
                        {form.type === 'text' && (
                          <Input name="label" type="text" />
                        )}
                        {form.type === 'phoneNumber' && (
                          <InputNumber min={1} max={10} />
                        )}
                        {form.type === 'textarea' && <TextArea rows={4} />}
                      </div>
                    );
                  })}
                  <AddFormField submit={this.handleModalSubmit.bind(this)} />
                </div>
                <div
                  className={
                    steps[current].title === 'Set Expiration'
                      ? 'steps-content text-center'
                      : 'hidden'
                  }
                >
                  <h3>Select Expiration date</h3>
                  <DatePicker
                    onChange={this.onDateSelect}
                    style={{ width: '70%' }}
                    className="m-top-30"
                  />
                </div>
                <div
                  className={
                    steps[current].title === 'Set Funding'
                      ? 'steps-content text-center'
                      : 'hidden'
                  }
                >
                  <h3>Set Funding Amount (in ETH)</h3>
                  <InputNumber onChange={this.onFundingChange.bind(this)} />
                  <h3 className="m-top-30">Set Responses limit</h3>
                  <p style={{ opacity: '0.3' }}>
                    The funding would be split with limit
                  </p>
                  <InputNumber onChange={this.onResponseChange.bind(this)} />
                </div>
                <div className="steps-action m-top-40">
                  {current > 0 && (
                    <Button
                      size="large"
                      className="step-action-buttons"
                      ghost
                      style={{ marginRight: 8, padding: '3' }}
                      onClick={() => this.prev()}
                    >
                      Previous
                    </Button>
                  )}
                  {current < steps.length - 1 && (
                    <Button
                      size="large"
                      className="step-action-buttons"
                      type="primary"
                      onClick={() => this.next()}
                    >
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      size="large"
                      className="step-action-buttons"
                      type="primary"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </Form>
            )}
            {this.state.showResults && (
              <div className="m-top-40">
                <Icon type="notification" className="congrats-icon" />
                <h1>Congratulations! You've created a decentralized Survey.</h1>
                <p style={{ opacity: 0.5 }}>Here's the URL for your survey</p>
                <Input
                  className="m-top-20"
                  defaultValue={
                    'http://localhost:8000/survey?name=' +
                    this.state.name.replace(/\s/g, '-')
                  }
                />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const WrappedForm = Form.create()(CreateSurvey);
export default WrappedForm;
