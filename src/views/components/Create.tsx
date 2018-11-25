import React from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Row,
  Steps
} from 'antd';
import moment from 'moment';

// Components
import AddFormField from './AddFormField';

// Types
import { RootState } from '@src/redux/state';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { Survey } from '@src/types/Survey';
import { FormField } from '@src/types';

import { NULL_ADDRESS } from '@src/core/constants';

const Step = Steps.Step;
const { TextArea } = Input;

interface CreateSurveyProps extends RootState {
  form: WrappedFormUtils;
}

interface CreateSurveyState {
  amount: string;
  current: number;
  expirationTime: string;
  forms: FormField[];
  name: string;
  numResponses: number;
  showResults: boolean;
  visible: boolean;
}

class CreateSurvey extends React.Component<
  CreateSurveyProps,
  CreateSurveyState
> {
  constructor(props: CreateSurveyProps) {
    super(props);

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDateSelect = this.onDateSelect.bind(this);
    this.onFundingChange = this.onFundingChange.bind(this);
    this.onResponseChange = this.onResponseChange.bind(this);

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

    const { web3State } = this.props;
    const web3 = web3State.get('web3');

    const account = web3State.get('accounts').get(0);
    const SurveyContract: Survey = web3State.get('survey');

    SurveyContract.methods
      .createSurvey(
        this.state.name,
        web3.utils.toWei(this.state.amount, 'ether'),
        this.state.numResponses,
        NULL_ADDRESS,
        this.state.expirationTime,
        '0x0'
      )
      .send({
        from: account,
        value: web3.utils.toWei(this.state.amount, 'ether')
      })
      .then(value => {
        console.log(value);
        this.setState({ showResults: true });
        message.success('Transaction completed successfully!');
      });

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

  handleModalSubmit(values: FormField) {
    const updatedForms = this.state.forms as FormField[];
    updatedForms.push(values);
    this.setState({ forms: updatedForms });
  }

  onFundingChange(amount: number) {
    this.setState({ amount: amount.toString(10) });
  }

  onDateSelect(date: moment.Moment) {
    this.setState({ expirationTime: date.unix().toString() });
  }

  onResponseChange(numResponses: number) {
    this.setState({ numResponses });
  }

  render() {
    const { current } = this.state;

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
        <Row type="flex" justify="center">
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
                onSubmit={this.handleSubmit}
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
                          <Input name="label" type="text" disabled={true} />
                        )}
                        {form.type === 'phoneNumber' && (
                          <InputNumber min={1} max={10} disabled={true} />
                        )}
                        {form.type === 'textarea' && (
                          <TextArea rows={4} disabled={true} />
                        )}
                      </div>
                    );
                  })}

                  <AddFormField submit={this.handleModalSubmit} />
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
                  <InputNumber
                    min={1}
                    max={1000}
                    step={1}
                    onChange={this.onFundingChange}
                  />

                  <h3 className="m-top-30">Set Responses limit</h3>
                  <p style={{ opacity: 0.3 }}>
                    The funding would be split with limit
                  </p>
                  <InputNumber
                    min={1}
                    max={1000}
                    step={1}
                    onChange={this.onResponseChange}
                  />
                </div>

                <div className="steps-action m-top-40">
                  {current > 0 && (
                    <Button
                      size="large"
                      className="step-action-buttons"
                      ghost
                      style={{ marginRight: 8, padding: '3' }}
                      onClick={this.prev}
                    >
                      Previous
                    </Button>
                  )}

                  {current < steps.length - 1 && (
                    <Button
                      size="large"
                      className="step-action-buttons"
                      type="primary"
                      onClick={this.next}
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
                    'http://localhost:3000/survey?name=' +
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
