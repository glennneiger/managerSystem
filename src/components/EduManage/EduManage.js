import React, {Component} from 'react';
import {
    HashRouter  as Router,
    Route,
    Link
} from 'react-router-dom';

import GrowthCategoryManage from './GrowthCategoryManage';
import GrowthManage from './GrowthManage';
import DoubtfulAnswer from './DoubtfulAnswer';
import ListeningBookCategoryManage from './ListeningBookCategoryManage';
import ListeningBookManage from './ListeningBookManage';
import NewsCategoryManage from './NewsCategoryManage';
import NewsManage from './NewsManage';

import {Layout, Menu, Icon} from 'antd';
const {SubMenu} = Menu;
const {Content, Sider} = Layout;

class MdhManage extends Component {
    constructor(props) {
        super(props);
        this.rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];
        this.state = {
            menuList: [],
            menuList02: [],
            menuList03: [],
            menuList04: [],
            highlight: "",
            openKeys: ['sub1'],
        };
        this.menu = [];
        this.menu02 = [];
        this.menu03 = [];
        this.menu04 = [];
    }

    menuHandle = () => {
        // const tempMenuList = [];
        // const tempMenuList02 = [];
        // const tempMenuList03 = [];
        const tempSubMenu = [];
        JSON.parse(sessionStorage.menuListOne).forEach((item, index) => {
            if (item.url === "/index/edu-manage") {               
                if (item.children) {
                    this.menu04 = item.children;
                    item.children.forEach((subItem, subIndex) => {
                        let tempMenuList = [];
                        if (subItem.children) {
                            subItem.children.forEach((thirdItem, thirdIndex) => {
                                tempMenuList.push(
                                    <Menu.Item key={thirdIndex + 1} style={{textAlign: "center"}}>
                                        <Link to={thirdItem.url}>
                                            {thirdItem.name}
                                        </Link>
                                    </Menu.Item>
                                )
                            })
                        }
                        tempSubMenu.push(
                            <SubMenu key={"sub" + (subIndex + 1)} title={<span><Icon type=""/>{subItem.name}</span>}>
                                {tempMenuList}                         
                            </SubMenu>
                        )
                    })
                }
                

                // this.menu = item.children;
                // this.menu = item.children[0].children;
                // console.log(item.children[0])
                // this.menu02 = item.children[1].children;
                // this.menu03 = item.children[2].children;

                // this.menu04 = tempSubMenu;
            }
        });
        // 第一个
        // this.menu.forEach((item, index) => {
        //     if (item.url === this.props.location.pathname) {
        //         this.setState({
        //             highlight: (index + 1).toString()
        //         })
        //     }
        //     tempMenuList.push(
        //         <Menu.Item key={index + 1} style={{textAlign: "center"}}>
        //             <Link to={item.url}>
        //                 {item.name}
        //             </Link>
        //         </Menu.Item>
        //     )
        // });
        // 第二个
        // this.menu02.forEach((item, index) => {
        //     if (item.url === this.props.location.pathname) {
        //         this.setState({
        //             highlight: (index + 1).toString()
        //         })
        //     }
        //     tempMenuList02.push(
        //         <Menu.Item key={index + 1} style={{textAlign: "center"}}>
        //             <Link to={item.url}>
        //                 {item.name}
        //             </Link>
        //         </Menu.Item>
        //     )
        // });
        // 第三个
        // this.menu03.forEach((item, index) => {
        //     if (item.url === this.props.location.pathname) {
        //         this.setState({
        //             highlight: (index + 1).toString()
        //         })
        //     }
        //     tempMenuList03.push(
        //         <Menu.Item key={index + 1} style={{textAlign: "center"}}>
        //             <Link to={item.url}>
        //                 {item.name}
        //             </Link>
        //         </Menu.Item>
        //     )
        // });
        
        // console.log(this.menu04);
        this.menu04.forEach((item, index) => {
            if (item.children) {
                item.children.forEach((subItem, subIndex) => {
                    // console.log(subItem.url);
                    // console.log(this.props.location.pathname);
                    if (subItem.url === this.props.location.pathname) {
                        this.setState({
                            highlight: (subIndex + 1).toString()
                        })
                    }
                })                
            }
        });

        this.setState({
            // menuList: tempMenuList,
            // menuList02: tempMenuList02,
            // menuList03: tempMenuList03,
            // 一级菜单下的所有二级三级菜单
            menuList04: tempSubMenu,
        });
        // 设置高亮项
        // console.log(this.props.location.pathname);
        if (this.props.location.pathname === "/index/edu-manage") {
            // this.setState({
            //     highlight: "1"
            // });
            // this.props.history.push(this.menu[0].url);
            console.log(this.menu04)
            this.menu04.forEach((item, index) => {
                if (item.children) {
                    item.children.forEach((subItem, subIndex) => {
                        console.log(subItem.url);
                        console.log(this.props.location.pathname);
                        console.log(subItem.name);
                        console.log(this.menu04[0].name);
                        // if (subItem.url === this.props.location.pathname) {
                        if (subItem.name === this.menu04[0].children[0].name) {
                            this.setState({
                                highlight: (subIndex + 1).toString()
                            })
                            this.props.history.push(subItem.url);
                        }
                    })                
                }
            });
        }
    };

    setMenu = (value) => {
        this.setState({
            highlight: value.key
        })
    };

    componentWillMount() {
        if (sessionStorage.menuListOne) {
            this.menuHandle();
            // console.log(this.props);
            if (this.props.location.search) {
                this.props.history.push(this.menu[0].url)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search) {
            this.menuHandle();
            this.setState({
                highlight: "1"
            })
        }
    }
    
    // SubMenu 展开/关闭的回调
    onOpenChange = (openKeys) => {
        // 当前展开的 SubMenu 菜单项 key 数组
        console.log(openKeys);
        console.log(this.state.openKeys)
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        console.log(latestOpenKey)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            console.log(5555)
            console.log(openKeys);
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        return (
            <Router>
                <div className="information-manage">
                    <Layout>
                        <Sider width={200} style={{background: '#fff'}}>
                            <Menu
                                mode="inline"
                                openKeys={this.state.openKeys}
                                onOpenChange={this.onOpenChange}
                                selectedKeys={[this.state.highlight]}
                                // defaultOpenKeys={['sub1']}
                                style={{height: '100%', borderRight: 0}}
                                onClick={this.setMenu}
                            >
                                {/*<SubMenu key="sub1" title={<span><Icon type=""/>育儿管理</span>}>
                                    {this.state.menuList}
                                </SubMenu>*/}
                                {/*<SubMenu key="sub1" title={<span><Icon type=""/>成长管理</span>}>*/}
                                    {/*{this.state.menuList}*/}
                                    {/*<Menu.Item key="1" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/growth-category-manage">
                                            成长分类管理
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="2" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/growth-manage">
                                            成长管理
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="3" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/doubtful-answer">
                                            疑惑解答
                                        </Link>
                                    </Menu.Item>  */}                             
                               {/* </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon type=""/>听书管理</span>}>*/}
                                    {/*{this.state.menuList02}*/}
                                    {/*<Menu.Item key="4" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/listening-book-category-manage">
                                            听书分类管理
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="5" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/listening-book-manage">
                                            听书管理
                                        </Link>
                                    </Menu.Item>*/}
                                {/*</SubMenu>
                                <SubMenu key="sub3" title={<span><Icon type=""/>资讯管理</span>}>
                                    {this.state.menuList03}*/}
                                    {/*<Menu.Item key="6" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/news-category-manage">
                                            资讯分类管理
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="7" style={{textAlign: "center"}}>
                                        <Link to="/index/edu-manage/news-manage">
                                            资讯管理
                                        </Link>
                                    </Menu.Item>*/}
                                {/*</SubMenu>*/}
                                {this.state.menuList04}
                            </Menu>
                        </Sider>
                        <Layout style={{padding: '24px'}}>
                            <Content style={{background: '#fff', padding: "24px 24px 0", margin: 0, minHeight: 725}}>
                                <Route path="/index/edu-manage/growth-category-manage" component={GrowthCategoryManage}/>
                                <Route path="/index/edu-manage/growth-manage" component={GrowthManage}/>
                                <Route path="/index/edu-manage/doubtful-answer" component={DoubtfulAnswer}/>
                                <Route path="/index/edu-manage/listening-book-category-manage" component={ListeningBookCategoryManage}/>
                                <Route path="/index/edu-manage/listening-book-manage" component={ListeningBookManage}/>
                                <Route path="/index/edu-manage/news-category-manage" component={NewsCategoryManage}/>
                                <Route path="/index/edu-manage/news-manage" component={NewsManage}/>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
            </Router>
        )
    }
}

export default MdhManage;