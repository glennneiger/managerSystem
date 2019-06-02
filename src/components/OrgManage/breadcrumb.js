import React from 'react';
import { Link }from 'react-router-dom';
import { Breadcrumb  } from 'antd';

//具体导航的名称
const breadcrumbNameMap = {
    '/user':'用户管理',
    '/user/user_info':'用户信息',
    '/user/user_info/user_detail':'用户详情',
    '/user/user_pool':'用户池',
    '/user/user_pool/user_detail':'用户详情',
    '/user/my_user':'我的用户',
    '/user/my_user/user_detail':'用户详情',
}

class NewBreadcrumb extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            pathSnippets: null,
            extraBreadcrumbItems: null,
        }
    }
    getPath = () => {
        //对路径进行切分，存放到this.state.pathSnippets中
        this.state.pathSnippets = this.props.pathname.split('/').filter(i => i);
        // let arr=this.state.pathSnippets;
        // let pathname=this.context.router.history.location.pathname;
        //将切分的路径读出来，形成面包屑，存放到this.state.extraBreadcrumbItems
        this.state.extraBreadcrumbItems = this.state.pathSnippets.map((_, index) => {
            let url = `/${this.state.pathSnippets.slice(0, index + 1).join('/')}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {breadcrumbNameMap[url]}
                    </Link>
                </Breadcrumb.Item>
            );
        });
    }
    componentWillMount() {
        this.getPath();
    }
    render() {
        return <Breadcrumb>{this.state.extraBreadcrumbItems}</Breadcrumb>;
    }
}
export default NewBreadcrumb;


import Link from 'umi/link';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Breadcrumb, Badge, Icon } from 'antd';

// 更多配置请移步 https://github.com/icd2k3/react-router-breadcrumbs-hoc
const routes = [{ path: '/', breadcrumb: '首页' }];

const Breadcrumbs = ({ data }) => {
  if (data && Array.isArray(data)) {
    const AntdBreadcrumb = withBreadcrumbs(data)(({ breadcrumbs }) => {
      return (
        <Breadcrumb separator={<Icon type="double-right" />} classNames="spread">
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb.Item key={breadcrumb.key}>
              {breadcrumbs.length - 1 === index ? (
                <Badge status="processing" text={breadcrumb} />
              ) : (
                <Link
                  to={{
                    pathname: breadcrumb.props.match.url,
                    state: breadcrumb.props.match.params ? breadcrumb.props.match.params : {},
                    query: breadcrumb.props.location.query ? breadcrumb.props.location.query : {},
                  }}
                >
                  {breadcrumb}
                </Link>
              )}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      );
    });
    return <AntdBreadcrumb />;
  }
  const DefaultBreadcrumb = withBreadcrumbs(routes)(({ breadcrumbs }) => (
    <div>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.key}>
          <Link
            to={{
              pathname: breadcrumb.props.match.url,
              state: breadcrumb.props.match.params ? breadcrumb.props.match.params : {},
              query: breadcrumb.props.location.query ? breadcrumb.props.location.query : {},
            }}
          >
            {breadcrumb}
          </Link>
          {index < breadcrumbs.length - 1 && <i> / </i>}
        </span>
      ))}
    </div>
  ));
  return <DefaultBreadcrumb />;
};

export default Breadcrumbs;


import {
  HashRouter as Router, Route, Switch, Link, withRouter,
} from 'react-router-dom';
import { Breadcrumb, Alert } from 'antd';

const Apps = () => (
  <ul className="app-list">
    <li>
      <Link to="/apps/1">Application1</Link>：<Link to="/apps/1/detail">Detail</Link>
    </li>
    <li>
      <Link to="/apps/2">Application2</Link>：<Link to="/apps/2/detail">Detail</Link>
    </li>
  </ul>
);

const breadcrumbNameMap = {
  '/apps': 'Application List',
  '/apps/1': 'Application1',
  '/apps/2': 'Application2',
  '/apps/1/detail': 'Detail',
  '/apps/2/detail': 'Detail',
};
const Home = withRouter((props) => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {breadcrumbNameMap[url]}
        </Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <div className="demo-nav">
        <Link to="/">Home</Link>
        <Link to="/apps">Application List</Link>
      </div>
      <Switch>
        <Route path="/apps" component={Apps} />
        <Route render={() => <span>Home Page</span>} />
      </Switch>
      <Alert style={{ margin: '16px 0' }} message="Click the navigation above to switch:" />
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  );
});

ReactDOM.render(
  <Router>
    <Home />
  </Router>,
  mountNode
);