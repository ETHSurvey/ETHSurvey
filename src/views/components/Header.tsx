import * as React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import Identicon from '@src/views/components/Identicon';

// Assets
import logo from '@src/img/logo.svg';

const AntDHeader = Layout.Header;

interface HeaderProps {
  account: string;
}

class Header extends React.Component<HeaderProps, {}> {
  public render() {
    const { account } = this.props;

    return (
      <AntDHeader>
        <div className="logo">
          <img src={logo} /> ETHSurvey
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="7" disabled>
            {account.substring(0, 4)}
            ... <Identicon address={account} size={30} />
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/survey">Take Survey</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/view">View</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/create">Create</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
        </Menu>
      </AntDHeader>
    );
  }
}

export default Header;
