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

// Components
import AddFormField from './AddFormField';

// Types
import { FormField } from '@src/types';
import { CreateSurveyProps } from '@src/core/props';
import { CreateSurveyState } from '@src/core/state';

import { NULL_ADDRESS } from '@src/core/constants';
import { getShortId, ipfs } from '@src/core/services';

// Styles
import '../../less/create.less';

const FormItem = Form.Item;
const Step = Steps.Step;
const { TextArea } = Input;

class CreateSurvey extends React.Component<
  CreateSurveyProps,
  CreateSurveyState
> {
  constructor(props: CreateSurveyProps) {
    super(props);

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      current: 0,
      fields: [],
      shortid: '',
      showResults: false
    };
  }

  next() {
    const field = this.state.current === 0 ? 'name' : 'expirationTime';

    this.props.form.validateFields([field], err => {
      if (!err) {
        if (this.state.fields.length === 0) {
          message.error(
            'Please add at-least one input field for the survey form!'
          );
          return;
        }

        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleSubmit(e: React.FormEvent<{}>) {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const { web3State } = this.props;
      const web3 = web3State.get('web3');

      const account = web3State.get('accounts').get(0);
      const SurveyContract = web3State.get('survey');

      const shortid = getShortId();
      const ipfsPath = `/${shortid}/fields`;

      console.log(ipfsPath);

      try {
        // Create directory
        await ipfs.createDirectory(`/${shortid}`);

        // Save the form in IPFS
        await ipfs.writeFileContent(ipfsPath, this.state.fields);

        const amount = web3.utils.toWei(values.amount.toString(), 'ether');

        const gasPrice = await web3.eth.getGasPrice();

        // Create the Survey on the Blockchain and transfer specified funds to contract
        SurveyContract.methods
          .createSurvey(
            values.name,
            shortid,
            amount.toString(),
            values.numResponses,
            NULL_ADDRESS,
            values.expirationTime.unix().toString()
          )
          .send({
            from: account,
            gasPrice,
            value: amount
          })
          .then(() => {
            this.setState({ shortid, showResults: true });
            message.success('Survey has been created successfully!');
          });
      } catch (err) {
        console.error(err);
        message.error('Error while fetching Survey: ' + err.message);
      }
    });
  }

  handleModalSubmit(values: FormField) {
    const updatedFields = this.state.fields as FormField[];
    updatedFields.push(values);
    this.setState({ fields: updatedFields });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
      <div id={'create'}>
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
                  <FormItem>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          message: 'Please enter the name of the survey!',
                          required: true,
                          type: 'string'
                        }
                      ]
                    })(<Input name="name" type="text" />)}
                  </FormItem>

                  {this.state.fields.map((field, index) => {
                    return (
                      <div key={index} className="field-item m-top-30">
                        <h3 className="label">{field.label}</h3>

                        <Icon type="delete" theme="filled" />

                        {field.description && (
                          <p className="description">{field.description}</p>
                        )}

                        {field.type === 'text' && (
                          <Input name="label" type="text" disabled={true} />
                        )}

                        {field.type === 'textarea' && (
                          <TextArea rows={4} disabled={true} />
                        )}

                        {field.type === 'mobile' && (
                          <InputNumber min={1} max={10} disabled={true} />
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
                  <FormItem>
                    {getFieldDecorator('expirationTime', {
                      rules: [
                        {
                          message: 'Please select an expiration date!',
                          required: true,
                          type: 'object'
                        }
                      ]
                    })(
                      <DatePicker
                        style={{ width: '70%' }}
                        className="m-top-30"
                      />
                    )}
                  </FormItem>
                </div>

                <div
                  className={
                    steps[current].title === 'Set Funding'
                      ? 'steps-content text-center'
                      : 'hidden'
                  }
                >
                  <h3>Set Funding Amount (in ETH)</h3>
                  <FormItem>
                    {getFieldDecorator('amount', {
                      rules: [
                        {
                          message: 'Please enter the amount to be funded!',
                          required: true,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={0.1} max={1000} step={0.1} />)}
                  </FormItem>

                  <h3 className="m-top-30">Set Responses limit</h3>
                  <p style={{ opacity: 0.3 }}>
                    The funding would be split with limit
                  </p>
                  <FormItem>
                    {getFieldDecorator('numResponses', {
                      rules: [
                        {
                          message:
                            'Please enter the number of responses required!',
                          required: true,
                          type: 'number'
                        }
                      ]
                    })(<InputNumber min={1} max={1000} step={1} />)}
                  </FormItem>
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
                  defaultValue={`http://localhost:3000/s/${this.state.shortid}`}
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
