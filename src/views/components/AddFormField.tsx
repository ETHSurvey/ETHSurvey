import React from 'react';
import { Button, Icon, Input, Modal, Select } from 'antd';

// Types
import { FormField } from '@src/types';
import { AddFormFieldProps } from '@src/core/props';

const Option = Select.Option;

class AddFormField extends React.Component<AddFormFieldProps, FormField> {
  constructor(props: AddFormFieldProps) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.showModal = this.showModal.bind(this);

    this.state = {
      description: '',
      label: '',
      type: 'text',
      visible: false
    };
  }

  showModal() {
    this.setState({ visible: true });
    this.resetState();
  }

  handleCancel(e: React.FormEvent<{}>) {
    this.setState({ visible: false });
    this.resetState();
  }

  resetState() {
    this.setState({
      description: '',
      label: '',
      type: 'text'
    });
  }

  handleOk(e: React.FormEvent<{}>) {
    this.props.submit(this.state);
    this.setState({ visible: false });
    this.resetState();
  }

  handleChange(type: string) {
    this.setState({ type });
  }

  public render() {
    return (
      <div>
        <Button
          htmlType={'button'}
          type="dashed"
          className="add-button m-top-40"
          onClick={this.showModal}
        >
          <Icon type="plus" /> Add Input field
        </Button>

        <Modal
          title="Buidl the field"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h4>Enter the title</h4>
          <Input
            onChange={e => this.setState({ label: e.target.value })}
            value={this.state.label}
            name="label"
            type="text"
          />

          <h4 className="m-top-30">Enter the description if any</h4>
          <Input
            onChange={e => this.setState({ description: e.target.value })}
            value={this.state.description}
            name="description"
            type="text"
          />

          <h4 className="m-top-30">Enter the type of form field</h4>
          <Select
            style={{ width: 120 }}
            value={this.state.type}
            onChange={this.handleChange}
          >
            <Option value={'text'}>Short Text</Option>
            <Option value={'textarea'}>Long Text</Option>
            <Option value={'mobile'}>Phone Number</Option>
          </Select>
        </Modal>
      </div>
    );
  }
}

export default AddFormField;
