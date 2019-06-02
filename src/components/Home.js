import React, {Component} from 'react';
import {
    HashRouter  as Router,
    Route,
    Link
} from 'react-router-dom';
import AppHome from './AppHome/AppHome';
import OrgManage from './OrgManage/OrgManage';
import EduManage from './EduManage/EduManage';
import OrderManage from './OrderManage/OrderManage';
import CheckManage from './CheckManage/CheckManage';

import DataStatistics from './DataStatistics/DataStatistics';
import MdhManage from './MdhManage/MdhManage';
import InformationManage from './InformationManage/InformationManage';
import MallManage from './MallManage/MallManage';

import FinancialManage from './FinancialManage/FinancialManage';
import UserManage from './UserManage/UserManage';
import BackUserManage from './BackUserManage/BackUserManage';
import AgentManage from './AgentManage/AgentManage';
import SysManage from './SysManage/SysManage';

import {
    Table,
    Layout,
    Menu,
    Popconfirm,
    Input,
    message,
    Button,
    Modal,
    Form
} from 'antd';
import '../config/config.js';
import reqwest from 'reqwest';
import logoImg from "../logo.png";

const {Header, Footer} = Layout;
const FormItem = Form.Item;
const confirm = Modal.confirm;

//栅格设置
const formItemLayout_8 = {
    labelCol: {span: 4},
    wrapperCol: {span: 8},
};
const formItemLayout_10 = {
    labelCol: {span: 4},
    wrapperCol: {span: 10},
};
const formItemLayout_12 = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
};

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

//修改密码表单
const ResetPasswordForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, countDown, codeButtonStatus, getCode, confirmLoading} = props;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="修改密码"
                width={600}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                <div className="resetPassword">
                    <Form layout="vertical">
                        <FormItem className="phone" {...formItemLayout_8} label="手机号码：">
                            {getFieldDecorator('phone', {
                                rules: [{
                                    required: true,
                                    message: '手机号码不能为空',
                                }],
                            })(
                                <Input placeholder="请输入手机号码"/>
                            )}
                        </FormItem>
                        <FormItem className="codeButton" {...formItemLayout_12}>
                            <Button style={{float: "right", width: "100px"}}
                                    type="primary"
                                    onClick={getCode}
                            >
                                {codeButtonStatus ? countDown + "s后重发" : "获取验证码"}
                            </Button>
                        </FormItem>
                        <FormItem className="code" {...formItemLayout_8} label="验证码：">
                            {getFieldDecorator('code', {
                                rules: [{
                                    required: true,
                                    message: '验证码不能为空',
                                }],
                            })(
                                <Input placeholder="请输入短信验证码"/>
                            )}
                        </FormItem>
                        <FormItem className="pwd" {...formItemLayout_10} label="新密码：">
                            {getFieldDecorator('pwd', {
                                rules: [{
                                    required: true,
                                    message: '密码不能为空',
                                }],
                            })(
                                <Input placeholder="8-16位字母与数字组合"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
);

//修改密码组件
class ResetPassword extends Component {
    state = {
        visible: false,
        countDown: 0,
        codeButtonStatus: false,
        // 确认按钮状态开关
        confirmLoading: false
    };
    fn_countDown = "";

    showModal = () => {
        this.setState({visible: true});
    };

    countDown = () => {
        if (this.state.countDown <= 0) {
            clearInterval(this.fn_countDown);
            this.setState({
                countDown: 0,
                codeButtonStatus: false
            });
            return;
        }
        this.setState({
            countDown: this.state.countDown - 1
        })
    };
    // 获取验证码
    getCode = () => {
        const form = this.form;
        const phone = form.getFieldValue("phone");
        if (this.state.codeButtonStatus) {
            return;
        } else {
            const regPhone = /^1[0-9]{10}$/;
            if (regPhone.test(phone)) {
                reqwest({
                    url: '/mobileCode/sendVerificationCode',
                    type: 'json',
                    method: 'post',
                    data: {
                        phone: phone
                    },
                    headers: {
                        Authorization: sessionStorage.token
                    },
                    success: (json) => {
                        if (json.result === 0) {
                            this.setState({
                                codeButtonStatus: true,
                                countDown: 60
                            }, () => {
                                this.fn_countDown = setInterval(this.countDown, 1000)
                            })
                        } else {
                            message.error(json.message);
                        }
                    },
                    error: (XMLHttpRequest) => {
                        message.error("发送失败");
                    }
                });
            } else {
                if (phone) {
                    message.error("请填写正确的手机号码")
                } else {
                    message.error("手机号码不能为空")
                }
            }
        }
    };

    // 取消处理
    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    countDown: 0,
                    codeButtonStatus: false,
                    confirmLoading: false
                });
            })
        };
        const data = form.getFieldsValue();
        let flag = false;
        for (let x in data) {
            if (data[x]) {
                flag = true
            }
        }
        if (flag) {
            confirm({
                title: '已添加信息未保存，确认放弃添加？',
                content: "",
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    cancel();
                },
                onCancel() {
                }
            });
        } else {
            cancel()
        }
    };

    // 确认处理
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/user/resetPassword',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    phone: values.phone,
                    code: values.code,
                    userKey: sessionStorage.userKey,
                    pwd: values.pwd
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("密码设置成功，请重新登录");
                        // 密码设置成功后更新缓存登陆信息
                        const loginMsg = {
                            phone: values.phone
                        };
                        localStorage.loginMsg = JSON.stringify(loginMsg);
                        // 退出登录
                        this.props.signOut()
                    } else {
                        if (json.code === "703") {
                            message.error("短信验证码错误或已过期")
                        } else if (json.code === "803") {
                            message.error("密码格式错误")
                        } else {
                            message.error(json.message);
                        }
                        this.setState({
                            confirmLoading: false
                        });
                    }
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    });
                }
            });
        });
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a>
                <span onClick={this.showModal}>修改密码</span>
                <ResetPasswordForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    countDown={this.state.countDown}
                    codeButtonStatus={this.state.codeButtonStatus}
                    getCode={this.getCode}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//机构列表表格
const InstitutionListTable = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, pagination, data, columns, pageChange, loading} = props;

        return (
            <Modal
                width={1000}
                visible={visible}
                title="机构列表"
                footer={null}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
            >
                <div className="institution-list">
                    <Table bordered pagination={pagination} dataSource={data} columns={columns}
                           onChange={pageChange} loading={loading}/>;
                </div>
            </Modal>
        );
    }
);

//机构列表组件
class InstitutionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // 列表信息加载状态 true：加载中；false：加载完成
            loading: false,
            // 机构列表
            data: [],
            // 分页相关变量
            pagination: {
                // 当前页码
                current: 1,
                // 每页信息条数
                pageSize: 5,
            },
        };
        // 表格的列配置
        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '8%',
                render: (text, record) => this.renderColumns(text, record, 'index'),
            },
            {
                title: '机构名称',
                dataIndex: 'name',
                width: '40%',
                render: (text, record) => this.renderColumns(text, record, 'name'),
            },
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {/*当前机构项展示此信息*/}
                            <p style={{display: Number(sessionStorage.EId) === record.id ? "inline" : "none"}}>当前机构</p>
                            <Popconfirm title="确认切换?"
                                        placement="topRight"
                                        onConfirm={() => this.itemSwitch(record.id)}
                                        onCancel=""
                                        okType="danger"
                                        okText="立即切换"
                                        cancelText="取消">
                                {/*当前机构项不展示此按钮*/}
                                <a style={{display: Number(sessionStorage.EId) === record.id ? "none" : "inline"}}>切换</a>
                            </Popconfirm>
                            <Popconfirm title="确认设置该机构为主机构?"
                                        placement="topRight"
                                        onConfirm={() => this.itemMainInstitution(record.id)}
                                        onCancel=""
                                        okType="danger"
                                        okText="确认"
                                        cancelText="取消">
                                {/*当前机构项不展示此按钮*/}
                                <a style={{display: Number(sessionStorage.EId) === record.id ? "none" : "inline"}}>设为主机构</a>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
    }

    // 列表信息写入
    getData = () => {
        this.setState({
            data: this.props.institutionList
        }, () => {
            const data = [];
            this.state.data.forEach((item, index) => {
                data.push({
                    key: index.toString(),
                    id: item.id,
                    index: index + 1,
                    name: item.name,
                });
            });
            this.setState({
                data: data
            })
        })
    };

    // 机构切换
    itemSwitch = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/user/switchAdminUser',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                eid: id
            },
            success: (json) => {
                if (json.result === 0) {
                    // 切换成功后登陆信息更新
                    sessionStorage.token = json.data.token;
                    sessionStorage.id = json.data.userInfo.id;
                    sessionStorage.EId = json.data.userInfo.EId;
                    sessionStorage.name = json.data.userInfo.username;
                    sessionStorage.phone = json.data.userInfo.phone;
                    sessionStorage.userKey = json.data.userInfo.userKey;
                    // 切换成功后其他操作
                    this.props.switchSuccess(json.data.menuList);
                    // 取消对话框
                    this.handleCancel();
                    message.success("机构切换成功");
                    this.setState({
                        loading: false
                    });
                } else {
                    message.error(json.message);
                    this.setState({
                        loading: false
                    });
                }
            },
            error: (XMLHttpRequest) => {
                message.error("切换失败");
                this.setState({
                    loading: false
                });
            }
        });
    };

    // 主机构设置
    itemMainInstitution = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/institution/switchMainEducation',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                eId: id
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("设置成功，请重新登录");
                    this.props.signOut()
                } else {
                    message.error(json.message);
                    this.setState({
                        loading: false
                    });
                }
            },
            error: (XMLHttpRequest) => {
                message.error("设置失败");
                this.setState({
                    loading: false
                });
            }
        });
    };

    showModal = () => {
        this.getData();
        this.setState({visible: true});
    };

    //列渲染
    renderColumns(text) {
        return (
            <Cell value={text}/>
        );
    }

    //页码变化处理
    pageChange = (pagination) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        })
    };

    // 取消对话框
    handleCancel = () => {
        this.setState({visible: false})
    };

    render() {
        return (
            <a style={{display: this.props.flag ? "inline" : "none", marginRight: 10}}>
                <span onClick={() => this.showModal(this.props.id)}>机构列表</span>
                <InstitutionListTable
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    data={this.state.data}
                    columns={this.columns}
                    pageChange={this.pageChange}
                />
            </a>
        )
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            userKey: "",
            // 一级菜单组件列表
            menuList: [],
            // 高亮项索引
            highlight: "",
            // 登陆人下属机构列表
            institutionList: [],
            // 机构切换开关
            switchFlag: true
        }
    }

    // 获取一级菜单路由
    getSuperiorPath = (para) => {
        const index01 = para.slice(1).indexOf("/") + 1;
        const index02 = para.slice(index01 + 1).indexOf("/") + 1;
        return index02 ? para.slice(0, index01 + index02) : para;
    };

    // 菜单分级处理函数
    dataHandle = (data) => {
        const dataEffective = (para) => {
            return para && para.status === false
        };
        data = data.filter(dataEffective);
        const tempResult = [];
        const result = [];
        const fnFilter01 = (para) => {
            return para.parentId === 0
        };
        let data01 = data.filter(fnFilter01);
        data01.sort((a, b) => {
            return a.orderNum - b.orderNum
        });
        data01.forEach((item) => {
            const temp = {
                id: item.id,
                name: item.name,
                url: item.url,
            };
            tempResult.push(temp)
        });
        tempResult.forEach((item) => {
            const fnFilter02 = (para) => {
                return para.parentId === item.id
            };
            let data02 = data.filter(fnFilter02);
            data02.sort((a, b) => {
                return a.orderNum - b.orderNum
            });
            if (data02.length) {
                item.children = [];
                data02.forEach((subItem) => {
                    const fnFilter03 = (para) => {
                        return para.parentId === subItem.id
                    };
                    let data03 = data.filter(fnFilter03);
                    const temp = {
                        id: subItem.id,
                        name: subItem.name,
                        url: subItem.url,
                        children: data03
                    };
                    item.children.push(temp)
                });
                // console.log(item)
                result.push(item)
            }
        });
        return result
    };

    getMenuList = () => {
        // 导航做的伪数据
        const json = {
            result: 0,
            data: [
                {
                    "id": 21,
                    "name": "app管理",
                    "url": "/index/app-home",
                    "children": [
                        {
                            "id": 32,
                            "name": "分类管理",
                            "url": "/index/app-home/category",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 148,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 32,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 149,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 32,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 150,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 32,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 151,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 32,
                                    "status": false
                                }
                            ]
                        },
                        /*{
                            "id": 59,
                            "name": "推荐机构",
                            "url": "/index/app-home/recommend-institutions",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 248,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 59,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 249,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 59,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 250,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 59,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 251,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 59,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 54,
                            "name": "banner管理",
                            "url": "/index/app-home/banner",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 228,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 54,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 229,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 54,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 230,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 54,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 231,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 54,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 33,
                            "name": "视频课程",
                            "url": "/index/app-home/video-courses",
                            "children": [{
                                "name": "新增",
                                "id": 152,
                                "type": 2,
                                "url": "add",
                                "parentId": 33,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 153,
                                "type": 2,
                                "url": "modify",
                                "parentId": 33,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 154,
                                "type": 2,
                                "url": "delete",
                                "parentId": 33,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 155,
                                "type": 2,
                                "url": "select",
                                "parentId": 33,
                                "status": false
                            }]
                        },
                        {
                            "id": 31,
                            "name": "众筹名师讲堂",
                            "url": "/index/app-home/crowdFunding",
                            "children": [{
                                "name": "新增",
                                "id": 144,
                                "type": 2,
                                "url": "add",
                                "parentId": 31,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 145,
                                "type": 2,
                                "url": "modify",
                                "parentId": 31,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 146,
                                "type": 2,
                                "url": "delete",
                                "parentId": 31,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 147,
                                "type": 2,
                                "url": "select",
                                "parentId": 31,
                                "status": false
                            }]
                        }*/
                    ]
                },                       
                {
                    "id": 23,
                    "name": "机构管理",
                    "url": "/index/org-manage",
                    "children": [                        
                        {
                            "id": 35,
                            "name": "所有机构",
                            "url": "/index/org-manage/org",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 160,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 35,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 161,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 35,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 162,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 35,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 163,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 35,
                                    "status": false
                                },
                            ]
                        },                                
                        {
                            "id": 389,
                            "name": "教师监控",
                            "url": "/index/org-manage/teachers-monitor",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 391,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 389,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 392,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 389,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 393,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 389,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 394,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 389,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 395,
                            "name": "课程监控",
                            "url": "/index/org-manage/courses-monitor",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 396,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 395,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 397,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 395,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 398,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 395,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 399,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 395,
                                    "status": false
                                },
                            ]
                        },                        
                    ]
                },
                {
                    "id": 72,
                    "name": "信息审核",
                    "url": "/index/check-manage",
                    "children": [{
                        "id": 73,
                        "name": "机构审核",
                        "url": "/index/check-manage/org-check",
                        "children": [{
                            "name": "新增",
                            "id": 292,
                            "type": 2,
                            "url": "add",
                            "parentId": 73,
                            "status": false
                        }, {
                            "name": "修改",
                            "id": 293,
                            "type": 2,
                            "url": "modify",
                            "parentId": 73,
                            "status": false
                        }, {
                            "name": "删除",
                            "id": 294,
                            "type": 2,
                            "url": "delete",
                            "parentId": 73,
                            "status": false
                        }, {
                            "name": "查询",
                            "id": 295,
                            "type": 2,
                            "url": "select",
                            "parentId": 73,
                            "status": false
                        }]
                    },
                    ]
                },
                {
                    "id": 60,
                    "name": "育儿管理",
                    "url": "/index/edu-manage",
                    "children": [
                        {
                            "id": 61,
                            "name": "成长分类管理",
                            "url": "/index/edu-manage/growth-category-manage",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 252,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 61,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 253,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 61,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 254,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 61,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 255,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 61,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 62,
                            "name": "成长管理",
                            "url": "/index/edu-manage/growth-manage",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 256,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 62,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 257,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 62,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 258,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 62,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 259,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 62,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 81,
                            "name": "答疑解惑",
                            "url": "/index/edu-manage/doubtful-answer",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 324,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 81,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 325,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 81,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 326,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 81,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 327,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 81,
                                    "status": false
                                },
                            ]
                        },
                    ]
                },
                {
                    "id": 83,
                    "name": "订单管理",
                    "url": "/index/order-manage",
                    "children": [
                        {
                            "id": 84,
                            "name": "订单管理",
                            "url": "/index/order-manage/order",
                            "children": [{
                                "name": "新增",
                                "id": 292,
                                "type": 2,
                                "url": "add",
                                "parentId": 84,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 293,
                                "type": 2,
                                "url": "modify",
                                "parentId": 84,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 294,
                                "type": 2,
                                "url": "delete",
                                "parentId": 84,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 295,
                                "type": 2,
                                "url": "select",
                                "parentId": 84,
                                "status": false
                            }]
                        },
                        {
                            "id": 85,
                            "name": "评价管理",
                            "url": "/index/order-manage/evaluation-manage",
                            "children": [{
                                "name": "新增",
                                "id": 392,
                                "type": 2,
                                "url": "add",
                                "parentId": 85,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 393,
                                "type": 2,
                                "url": "modify",
                                "parentId": 85,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 394,
                                "type": 2,
                                "url": "delete",
                                "parentId": 85,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 395,
                                "type": 2,
                                "url": "select",
                                "parentId": 85,
                                "status": false
                            }]
                        },
                    ]
                },
                {
                    "id": 26,
                    "name": "财务管理",
                    "url": "/index/financial-manage",
                    "children": [
                        {
                            "id": 477,
                            "name": "收款银行卡",
                            "url": "/index/financial-manage/bank",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 192,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "修改",
                                    "id": 193,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "删除",
                                    "id": 194,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "查询",
                                    "id": 195,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 43,
                                    "status": false
                                }
                            ]
                        },
                        {
                            "id": 450,
                            "name": "结算管理",
                            "url": "/index/financial-manage/settle",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 451,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "修改",
                                    "id": 452,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "删除",
                                    "id": 453,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 43,
                                    "status": false
                                }, 
                                {
                                    "name": "查询",
                                    "id": 454,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 43,
                                    "status": false
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 22,
                    "name": "用户管理",
                    "url": "/index/user-manage",
                    "children": [
                        {
                            "id": 34,
                            "name": "所有用户",
                            "url": "/index/user-manage/users",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 156,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 34,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 157,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 34,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 158,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 34,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 159,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 34,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 53,
                            "name": "用户反馈",
                            "url": "/index/user-manage/user-feedback",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 224,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 53,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 225,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 53,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 226,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 53,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 227,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 53,
                                    "status": false
                                },
                            ]
                        },
                    ]
                },
                {
                    "id": 48,
                    "name": "账号管理",
                    "url": "/index/backUser-manage",
                    "children": [
                        {
                            "id": 49,
                            "name": "所有账号",
                            "url": "/index/backUser-manage/backUsers",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 212,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 49,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 213,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 49,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 214,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 49,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 215,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 49,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 50,
                            "name": "角色管理",
                            "url": "/index/backUser-manage/roles",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 216,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 50,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 217,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 50,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 218,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 50,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 219,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 50,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 376,
                            "name": "部门管理",
                            "url": "/index/backUser-manage/department",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 281,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 376,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 282,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 376,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 283,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 376,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 284,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 376,
                                    "status": false
                                },
                            ]
                        },
                    ]
                },
                {
                    "id": 25,
                    "name": "代理管理",
                    "url": "/index/agent-manage",
                    "children": [
                        {
                            "id": 40,
                            "name": "所有代理",
                            "url": "/index/agent-manage/all",
                            "children": [{
                                "name": "新增",
                                "id": 180,
                                "type": 2,
                                "url": "add",
                                "parentId": 40,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 181,
                                "type": 2,
                                "url": "modify",
                                "parentId": 40,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 182,
                                "type": 2,
                                "url": "delete",
                                "parentId": 40,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 183,
                                "type": 2,
                                "url": "select",
                                "parentId": 40,
                                "status": false
                            }]
                        },
                        {
                            "id": 41,
                            "name": "我的公司",
                            "url": "/index/agent-manage/my",
                            "children": [{
                                "name": "新增",
                                "id": 184,
                                "type": 2,
                                "url": "add",
                                "parentId": 41,
                                "status": false
                            }, {
                                "name": "修改",
                                "id": 185,
                                "type": 2,
                                "url": "modify",
                                "parentId": 41,
                                "status": false
                            }, {
                                "name": "删除",
                                "id": 186,
                                "type": 2,
                                "url": "delete",
                                "parentId": 41,
                                "status": false
                            }, {
                                "name": "查询",
                                "id": 187,
                                "type": 2,
                                "url": "select",
                                "parentId": 41,
                                "status": false
                            }]
                        },
                    ]
                },
                {
                    "id": 51,
                    "name": "系统管理",
                    "url": "/index/sys-manage",
                    "children": [
                        {
                            "id": 52,
                            "name": "菜单管理",
                            "url": "/index/sys-manage/menus",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 220,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 52,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 221,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 52,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 222,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 52,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 223,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 52,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 79,
                            "name": "系统通知",
                            "url": "/index/sys-manage/notice",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 316,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 79,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 317,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 79,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 318,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 79,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 319,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 79,
                                    "status": false
                                },
                            ]
                        },
                        {
                            "id": 80,
                            "name": "app版本管理",
                            "url": "/index/sys-manage/appEdition",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 320,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 80,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 321,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 80,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 322,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 80,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 323,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 80,
                                    "status": false
                                },
                            ]
                        },
                        // {
                        //     "id": 87,
                        //     "name": "物流公司管理",
                        //     "url": "/index/sys-manage/logisticsCompany",
                        //     "children": [
                        //         {
                        //             "name": "新增",
                        //             "id": 871,
                        //             "type": 2,
                        //             "url": "add",
                        //             "parentId": 87,
                        //             "status": false
                        //         },
                        //         {
                        //             "name": "修改",
                        //             "id": 872,
                        //             "type": 2,
                        //             "url": "modify",
                        //             "parentId": 87,
                        //             "status": false
                        //         },
                        //         {
                        //             "name": "删除",
                        //             "id": 873,
                        //             "type": 2,
                        //             "url": "delete",
                        //             "parentId": 87,
                        //             "status": false
                        //         },
                        //         {
                        //             "name": "查询",
                        //             "id": 874,
                        //             "type": 2,
                        //             "url": "select",
                        //             "parentId": 87,
                        //             "status": false
                        //         },
                        //     ]
                        // },
                        {
                            "id": 82,
                            "name": "操作日志",
                            "url": "/index/sys-manage/operationRecord",
                            "children": [
                                {
                                    "name": "新增",
                                    "id": 328,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 82,
                                    "status": false
                                },
                                {
                                    "name": "修改",
                                    "id": 329,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 82,
                                    "status": false
                                },
                                {
                                    "name": "删除",
                                    "id": 330,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 82,
                                    "status": false
                                },
                                {
                                    "name": "查询",
                                    "id": 331,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 82,
                                    "status": false
                                },
                            ]
                        },
                    ]
                },                       
            ]
        };
        if (json.result === 0) {
            const tempMenuList = [];
            // const handleResult = this.dataHandle(json.data);
            // const handleResult = json.data;
            // sessionStorage.menuList = JSON.stringify(handleResult);
            // 新改的菜单数据
            const handleResult = JSON.parse(sessionStorage.menuListOne);
            // console.log(handleResult);
            handleResult.forEach((item, index) => {
                tempMenuList.push(
                    <Menu.Item key={index + 1}>
                        <Link to={item.url}>
                            {item.name}
                        </Link>
                    </Menu.Item>
                )
            });
            this.setState({
                menuList: tempMenuList
            }, () => {
                // console.log(this.props.location.pathname);
                // 地址有误当有三级菜单路由时，暂时不改，有时间改
                if (this.props.location.pathname === "/index") {
                    this.props.history.push(handleResult[0].url);
                    // console.log(handleResult[0].url);
                    this.setState({
                        highlight: "1"
                    })
                } else {
                    // console.log(this.props.location.pathname);
                    const superiorPath = this.getSuperiorPath(this.props.location.pathname);
                    const tempMenuList = JSON.parse(sessionStorage.menuListOne);
                    tempMenuList.forEach((item, index) => {
                        // console.log(superiorPath);
                        if (item.url === superiorPath) {
                            this.setState({
                                highlight: (index + 1).toString()
                            })
                        }
                    })
                }
            })
        }
        /*reqwest({
            url: '/menu/getSysMenuByUserId',
            // url: '/admin/user/getMenuListByUserId',
            type: 'json',
            method: 'get',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                const json = {
                    result: 0,
                    data: [
                        {
                            "id": 21,
                            "name": "APP管理",
                            "url": "/index/app-home",
                            "children": [
                                {
                                    "id": 32,
                                    "name": "推荐课程",
                                    "url": "/index/app-home/recommend-courses",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 148,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 32,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 149,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 32,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 150,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 32,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 151,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 32,
                                            "status": false
                                        }
                                    ]
                                },
                                {
                                    "id": 59,
                                    "name": "推荐机构",
                                    "url": "/index/app-home/recommend-institutions",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 248,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 59,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 249,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 59,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 250,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 59,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 251,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 59,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 54,
                                    "name": "banner管理",
                                    "url": "/index/app-home/banner",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 228,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 54,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 229,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 54,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 230,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 54,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 231,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 54,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 33,
                                    "name": "视频课程",
                                    "url": "/index/app-home/video-courses",
                                    "children": [{
                                        "name": "新增",
                                        "id": 152,
                                        "type": 2,
                                        "url": "add",
                                        "parentId": 33,
                                        "status": false
                                    }, {
                                        "name": "修改",
                                        "id": 153,
                                        "type": 2,
                                        "url": "modify",
                                        "parentId": 33,
                                        "status": false
                                    }, {
                                        "name": "删除",
                                        "id": 154,
                                        "type": 2,
                                        "url": "delete",
                                        "parentId": 33,
                                        "status": false
                                    }, {
                                        "name": "查询",
                                        "id": 155,
                                        "type": 2,
                                        "url": "select",
                                        "parentId": 33,
                                        "status": false
                                    }]
                                },
                                {
                                    "id": 31,
                                    "name": "众筹名师讲堂",
                                    "url": "/index/app-home/crowdFunding",
                                    "children": [{
                                        "name": "新增",
                                        "id": 144,
                                        "type": 2,
                                        "url": "add",
                                        "parentId": 31,
                                        "status": false
                                    }, {
                                        "name": "修改",
                                        "id": 145,
                                        "type": 2,
                                        "url": "modify",
                                        "parentId": 31,
                                        "status": false
                                    }, {
                                        "name": "删除",
                                        "id": 146,
                                        "type": 2,
                                        "url": "delete",
                                        "parentId": 31,
                                        "status": false
                                    }, {
                                        "name": "查询",
                                        "id": 147,
                                        "type": 2,
                                        "url": "select",
                                        "parentId": 31,
                                        "status": false
                                    }]
                                }
                            ]
                        },                        
                        {
                            "id": 23,
                            "name": "机构管理",
                            "url": "/index/institution-manage",
                            "children": [
                                // {
                                //     "id": 30,
                                //     "name": "分类管理",
                                //     "url": "/index/institution-manage/category",
                                //     "children": [
                                //         {
                                //             "name": "新增",
                                //             "id": 140,
                                //             "type": 2,
                                //             "url": "add",
                                //             "parentId": 30,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "修改",
                                //             "id": 141,
                                //             "type": 2,
                                //             "url": "modify",
                                //             "parentId": 30,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "删除",
                                //             "id": 142,
                                //             "type": 2,
                                //             "url": "delete",
                                //             "parentId": 30,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "查询",
                                //             "id": 143,
                                //             "type": 2,
                                //             "url": "select",
                                //             "parentId": 30,
                                //             "status": false
                                //         },
                                //     ]
                                // },
                                {
                                    "id": 35,
                                    "name": "所有机构",
                                    "url": "/index/institution-manage/institutions",
                                    "children": [                                        
                                        {
                                            "name": "新增",
                                            "id": 160,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 35,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 161,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 35,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 162,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 35,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 163,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 35,
                                            "status": false
                                        },
                                    ]
                                },                                
                                {
                                    "id": 389,
                                    "name": "教师监控",
                                    "url": "/index/institution-manage/teachers-monitor",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 391,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 389,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 392,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 389,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 393,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 389,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 394,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 389,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 395,
                                    "name": "课程监控",
                                    "url": "/index/institution-manage/courses-monitor",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 396,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 395,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 397,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 395,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 398,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 395,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 399,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 395,
                                            "status": false
                                        },
                                    ]
                                },
                                // {
                                //     "id": 57,
                                //     "name": "我的机构",
                                //     "url": "/index/institution-manage/myInstitution",
                                //     "children": [
                                //         {
                                //             "name": "新增",
                                //             "id": 240,
                                //             "type": 2,
                                //             "url": "add",
                                //             "parentId": 57,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "修改",
                                //             "id": 241,
                                //             "type": 2,
                                //             "url": "modify",
                                //             "parentId": 57,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "删除",
                                //             "id": 242,
                                //             "type": 2,
                                //             "url": "delete",
                                //             "parentId": 57,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "查询",
                                //             "id": 243,
                                //             "type": 2,
                                //             "url": "select",
                                //             "parentId": 57,
                                //             "status": false
                                //         },
                                //     ]
                                // },
                                // {
                                //     "id": 58,
                                //     "name": "优惠券管理",
                                //     "url": "/index/institution-manage/coupons",
                                //     "children": [
                                //         {
                                //             "name": "新增",
                                //             "id": 244,
                                //             "type": 2,
                                //             "url": "add",
                                //             "parentId": 58,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "修改",
                                //             "id": 245,
                                //             "type": 2,
                                //             "url": "modify",
                                //             "parentId": 58,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "删除",
                                //             "id": 246,
                                //             "type": 2,
                                //             "url": "delete",
                                //             "parentId": 58,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "查询",
                                //             "id": 247,
                                //             "type": 2,
                                //             "url": "select",
                                //             "parentId": 58,
                                //             "status": false
                                //         },
                                //     ]
                                // },
                                // {
                                //     "id": 76,
                                //     "name": "签到管理",
                                //     "url": "/index/institution-manage/attend-confirm",
                                //     "children": [
                                //         {
                                //             "name": "新增",
                                //             "id": 304,
                                //             "type": 2,
                                //             "url": "add",
                                //             "parentId": 76,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "修改",
                                //             "id": 305,
                                //             "type": 2,
                                //             "url": "modify",
                                //             "parentId": 76,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "删除",
                                //             "id": 306,
                                //             "type": 2,
                                //             "url": "delete",
                                //             "parentId": 76,
                                //             "status": false
                                //         },
                                //         {
                                //             "name": "查询",
                                //             "id": 307,
                                //             "type": 2,
                                //             "url": "select",
                                //             "parentId": 76,
                                //             "status": false
                                //         },
                                //     ]
                                // },
                            ]
                        },
                        {
                            "id": 72,
                            "name": "信息审核",
                            "url": "/index/check-manage",
                            "children": [{
                                "id": 73,
                                "name": "机构审核",
                                "url": "/index/check-manage/institution-check",
                                "children": [{
                                    "name": "新增",
                                    "id": 292,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 73,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 293,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 73,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 294,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 73,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 295,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 73,
                                    "status": false
                                }]
                            }, 
                            // {
                            //     "id": 74,
                            //     "name": "教师审核",
                            //     "url": "/index/check-manage/teacher-check",
                            //     "children": [{
                            //         "name": "新增",
                            //         "id": 296,
                            //         "type": 2,
                            //         "url": "add",
                            //         "parentId": 74,
                            //         "status": false
                            //     }, {
                            //         "name": "修改",
                            //         "id": 297,
                            //         "type": 2,
                            //         "url": "modify",
                            //         "parentId": 74,
                            //         "status": false
                            //     }, {
                            //         "name": "删除",
                            //         "id": 298,
                            //         "type": 2,
                            //         "url": "delete",
                            //         "parentId": 74,
                            //         "status": false
                            //     }, {
                            //         "name": "查询",
                            //         "id": 299,
                            //         "type": 2,
                            //         "url": "select",
                            //         "parentId": 74,
                            //         "status": false
                            //     }]
                            // }, 
                            // {
                            //     "id": 75,
                            //     "name": "课程审核",
                            //     "url": "/index/check-manage/course-check",
                            //     "children": [{
                            //         "name": "新增",
                            //         "id": 300,
                            //         "type": 2,
                            //         "url": "add",
                            //         "parentId": 75,
                            //         "status": false
                            //     }, {
                            //         "name": "修改",
                            //         "id": 301,
                            //         "type": 2,
                            //         "url": "modify",
                            //         "parentId": 75,
                            //         "status": false
                            //     }, {
                            //         "name": "删除",
                            //         "id": 302,
                            //         "type": 2,
                            //         "url": "delete",
                            //         "parentId": 75,
                            //         "status": false
                            //     }, {
                            //         "name": "查询",
                            //         "id": 303,
                            //         "type": 2,
                            //         "url": "select",
                            //         "parentId": 75,
                            //         "status": false
                            //     }]
                            // }
                            ]
                        },
                        // {
                        //     "id": 60,
                        //     "name": "妈董会管理中心",
                        //     "url": "/index/mdh-manage",
                        //     "children": [
                        //         {
                        //             "id": 61,
                        //             "name": "图文管理",
                        //             "url": "/index/mdh-manage/newsOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 252,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 61,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 253,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 61,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 254,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 61,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 255,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 61,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 62,
                        //             "name": "课程管理",
                        //             "url": "/index/mdh-manage/courseOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 256,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 62,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 257,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 62,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 258,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 62,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 259,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 62,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 63,
                        //             "name": "音频管理",
                        //             "url": "/index/mdh-manage/audioOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 260,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 63,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 261,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 63,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 262,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 63,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 263,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 63,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 64,
                        //             "name": "广告管理",
                        //             "url": "/index/mdh-manage/advOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 264,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 64,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 265,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 64,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 266,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 64,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 267,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 64,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 71,
                        //             "name": "banner管理",
                        //             "url": "/index/mdh-manage/bannerOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 288,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 71,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 289,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 71,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 290,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 71,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 291,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 71,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 70,
                        //             "name": "订单管理",
                        //             "url": "/index/mdh-manage/orderOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 284,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 70,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 285,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 70,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 286,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 70,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 287,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 70,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 65,
                        //             "name": "图文审核",
                        //             "url": "/index/mdh-manage/newsOneCheck",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 268,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 65,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 269,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 65,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 270,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 65,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 271,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 65,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 66,
                        //             "name": "课程审核",
                        //             "url": "/index/mdh-manage/courseOneCheck",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 272,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 66,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 273,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 66,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 274,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 66,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 275,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 66,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 67,
                        //             "name": "音频审核",
                        //             "url": "/index/mdh-manage/audioOneCheck",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 276,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 67,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 277,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 67,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 278,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 67,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 279,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 67,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 68,
                        //             "name": "广告审核",
                        //             "url": "/index/mdh-manage/advOneCheck",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 280,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 68,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 281,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 68,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 282,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 68,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 283,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 68,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 81,
                        //             "name": "答疑解惑",
                        //             "url": "/index/mdh-manage/answerOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 324,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 81,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 325,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 81,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 326,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 81,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 327,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 81,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 83,
                        //             "name": "推荐课程",
                        //             "url": "/index/mdh-manage/recommendCourseOne",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 332,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 83,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 333,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 83,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 334,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 83,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 335,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 83,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //     ]
                        // },
                        // {
                        //     "id": 24,
                        //     "name": "资讯管理",
                        //     "url": "/index/information-manage",
                        //     "children": [{
                        //         "id": 38,
                        //         "name": "资讯列表",
                        //         "url": "/index/information-manage/information",
                        //         "children": [
                        //             {
                        //                 "name": "新增",
                        //                 "id": 172,
                        //                 "type": 2,
                        //                 "url": "add",
                        //                 "parentId": 38,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "修改",
                        //                 "id": 173,
                        //                 "type": 2,
                        //                 "url": "modify",
                        //                 "parentId": 38,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "删除",
                        //                 "id": 174,
                        //                 "type": 2,
                        //                 "url": "delete",
                        //                 "parentId": 38,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "查询",
                        //                 "id": 175,
                        //                 "type": 2,
                        //                 "url": "select",
                        //                 "parentId": 38,
                        //                 "status": false
                        //             },
                        //         ]
                        //     }, {
                        //         "id": 39,
                        //         "name": "资讯频道",
                        //         "url": "/index/information-manage/information-channel",
                        //         "children": [
                        //             {
                        //                 "name": "新增",
                        //                 "id": 176,
                        //                 "type": 2,
                        //                 "url": "add",
                        //                 "parentId": 39,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "修改",
                        //                 "id": 177,
                        //                 "type": 2,
                        //                 "url": "modify",
                        //                 "parentId": 39,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "删除",
                        //                 "id": 178,
                        //                 "type": 2,
                        //                 "url": "delete",
                        //                 "parentId": 39,
                        //                 "status": false
                        //             },
                        //             {
                        //                 "name": "查询",
                        //                 "id": 179,
                        //                 "type": 2,
                        //                 "url": "select",
                        //                 "parentId": 39,
                        //                 "status": false
                        //             },
                        //         ]
                        //     }]
                        // },                        
                        // {
                        //     "id": 25,
                        //     "name": "商城管理",
                        //     "url": "/index/mall-manage",
                        //     "children": [
                        //         {
                        //             "id": 40,
                        //             "name": "商品分类",
                        //             "url": "/index/mall-manage/goodsCategory",
                        //             "children": [{
                        //                 "name": "新增",
                        //                 "id": 180,
                        //                 "type": 2,
                        //                 "url": "add",
                        //                 "parentId": 40,
                        //                 "status": false
                        //             }, {
                        //                 "name": "修改",
                        //                 "id": 181,
                        //                 "type": 2,
                        //                 "url": "modify",
                        //                 "parentId": 40,
                        //                 "status": false
                        //             }, {
                        //                 "name": "删除",
                        //                 "id": 182,
                        //                 "type": 2,
                        //                 "url": "delete",
                        //                 "parentId": 40,
                        //                 "status": false
                        //             }, {
                        //                 "name": "查询",
                        //                 "id": 183,
                        //                 "type": 2,
                        //                 "url": "select",
                        //                 "parentId": 40,
                        //                 "status": false
                        //             }]
                        //         },
                        //         {
                        //             "id": 41,
                        //             "name": "商品标签",
                        //             "url": "/index/mall-manage/goodsLabel",
                        //             "children": [{
                        //                 "name": "新增",
                        //                 "id": 184,
                        //                 "type": 2,
                        //                 "url": "add",
                        //                 "parentId": 41,
                        //                 "status": false
                        //             }, {
                        //                 "name": "修改",
                        //                 "id": 185,
                        //                 "type": 2,
                        //                 "url": "modify",
                        //                 "parentId": 41,
                        //                 "status": false
                        //             }, {
                        //                 "name": "删除",
                        //                 "id": 186,
                        //                 "type": 2,
                        //                 "url": "delete",
                        //                 "parentId": 41,
                        //                 "status": false
                        //             }, {
                        //                 "name": "查询",
                        //                 "id": 187,
                        //                 "type": 2,
                        //                 "url": "select",
                        //                 "parentId": 41,
                        //                 "status": false
                        //             }]
                        //         },
                        //         {
                        //             "id": 42,
                        //             "name": "店铺管理",
                        //             "url": "/index/mall-manage/goods",
                        //             "children": [{
                        //                 "name": "新增",
                        //                 "id": 188,
                        //                 "type": 2,
                        //                 "url": "add",
                        //                 "parentId": 42,
                        //                 "status": false
                        //             }, {
                        //                 "name": "修改",
                        //                 "id": 189,
                        //                 "type": 2,
                        //                 "url": "modify",
                        //                 "parentId": 42,
                        //                 "status": false
                        //             }, {
                        //                 "name": "删除",
                        //                 "id": 190,
                        //                 "type": 2,
                        //                 "url": "delete",
                        //                 "parentId": 42,
                        //                 "status": false
                        //             }, {
                        //                 "name": "查询",
                        //                 "id": 191,
                        //                 "type": 2,
                        //                 "url": "select",
                        //                 "parentId": 42,
                        //                 "status": false
                        //             }]
                        //         },
                        //         {
                        //             "id": 87,
                        //             "name": "商品退款审核",
                        //             "url": "/index/mall-manage/goodsRefundCheck",
                        //         }]
                        // },
                        {
                            "id": 83,
                            "name": "数据统计",
                            "url": "/index/data-statistics",
                            "children": [
                                {
                                    "id": 84,
                                    "name": "类别数据统计",
                                    "url": "/index/data-statistics/categoryStatistics",
                                },
                                {
                                    "id": 85,
                                    "name": "机构数据统计",
                                    "url": "/index/data-statistics/institutionStatistics",
                                },
                                {
                                    "id": 86,
                                    "name": "课程数据统计",
                                    "url": "/index/data-statistics/courseStatistics",
                                },
                            ]
                        },
                        {
                            "id": 26,
                            "name": "财务管理",
                            "url": "/index/financial-manage",
                            "children": [{
                                "id": 43,
                                "name": "我的财务",
                                "url": "/index/financial-manage/finance",
                                "children": [{
                                    "name": "新增",
                                    "id": 192,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 43,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 193,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 43,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 194,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 43,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 195,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 43,
                                    "status": false
                                }]
                            }, {
                                "id": 44,
                                "name": "提现审核",
                                "url": "/index/financial-manage/withdrawCheck",
                                "children": [{
                                    "name": "新增",
                                    "id": 196,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 44,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 197,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 44,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 198,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 44,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 199,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 44,
                                    "status": false
                                }]
                            }, {
                                "id": 45,
                                "name": "银行卡",
                                "url": "/index/financial-manage/bankcards",
                                "children": [{
                                    "name": "新增",
                                    "id": 200,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 45,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 201,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 45,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 202,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 45,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 203,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 45,
                                    "status": false
                                }]
                            }, {
                                "id": 56,
                                "name": "订单管理",
                                "url": "/index/financial-manage/orders",
                                "children": [{
                                    "name": "新增",
                                    "id": 236,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 56,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 237,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 56,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 238,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 56,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 239,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 56,
                                    "status": false
                                }]
                            }, {
                                "id": 77,
                                "name": "退款审核",
                                "url": "/index/financial-manage/refundCheck",
                                "children": [{
                                    "name": "新增",
                                    "id": 308,
                                    "type": 2,
                                    "url": "add",
                                    "parentId": 77,
                                    "status": false
                                }, {
                                    "name": "修改",
                                    "id": 309,
                                    "type": 2,
                                    "url": "modify",
                                    "parentId": 77,
                                    "status": false
                                }, {
                                    "name": "删除",
                                    "id": 310,
                                    "type": 2,
                                    "url": "delete",
                                    "parentId": 77,
                                    "status": false
                                }, {
                                    "name": "查询",
                                    "id": 311,
                                    "type": 2,
                                    "url": "select",
                                    "parentId": 77,
                                    "status": false
                                }]
                            }]
                        },
                        {
                            "id": 22,
                            "name": "用户管理",
                            "url": "/index/user-manage",
                            "children": [
                                {
                                    "id": 34,
                                    "name": "所有用户",
                                    "url": "/index/user-manage/users",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 156,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 34,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 157,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 34,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 158,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 34,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 159,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 34,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 53,
                                    "name": "用户反馈",
                                    "url": "/index/user-manage/user-feedback",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 224,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 53,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 225,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 53,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 226,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 53,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 227,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 53,
                                            "status": false
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            "id": 48,
                            "name": "账号管理",
                            "url": "/index/backUser-manage",
                            "children": [
                                {
                                    "id": 49,
                                    "name": "所有账号",
                                    "url": "/index/backUser-manage/backUsers",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 212,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 49,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 213,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 49,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 214,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 49,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 215,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 49,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 50,
                                    "name": "角色管理",
                                    "url": "/index/backUser-manage/roles",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 216,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 50,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 217,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 50,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 218,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 50,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 219,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 50,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 376,
                                    "name": "部门管理",
                                    "url": "/index/backUser-manage/department",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 281,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 376,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 282,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 376,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 283,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 376,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 284,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 376,
                                            "status": false
                                        },
                                    ]
                                },
                            ]
                        },
                        // {
                        //     "id": 373,
                        //     "name": "代理管理",
                        //     "url": "/index/agent-manage",
                        //     "children": [
                        //         {
                        //             "id": 374,
                        //             "name": "所有代理",
                        //             "url": "/index/agent-manage/agent",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 385,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 374,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 386,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 374,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 387,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 374,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 388,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 374,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //         {
                        //             "id": 375,
                        //             "name": "我的公司",
                        //             "url": "/index/agent-manage/myCompany",
                        //             "children": [
                        //                 {
                        //                     "name": "新增",
                        //                     "id": 216,
                        //                     "type": 2,
                        //                     "url": "add",
                        //                     "parentId": 375,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "修改",
                        //                     "id": 217,
                        //                     "type": 2,
                        //                     "url": "modify",
                        //                     "parentId": 375,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "删除",
                        //                     "id": 218,
                        //                     "type": 2,
                        //                     "url": "delete",
                        //                     "parentId": 375,
                        //                     "status": false
                        //                 },
                        //                 {
                        //                     "name": "查询",
                        //                     "id": 219,
                        //                     "type": 2,
                        //                     "url": "select",
                        //                     "parentId": 375,
                        //                     "status": false
                        //                 },
                        //             ]
                        //         },
                        //     ]
                        // },
                        {
                            "id": 25,
                            "name": "代理管理",
                            "url": "/index/mall-manage",
                            "children": [
                                {
                                    "id": 40,
                                    "name": "所有代理",
                                    "url": "/index/mall-manage/agent",
                                    "children": [{
                                        "name": "新增",
                                        "id": 180,
                                        "type": 2,
                                        "url": "add",
                                        "parentId": 40,
                                        "status": false
                                    }, {
                                        "name": "修改",
                                        "id": 181,
                                        "type": 2,
                                        "url": "modify",
                                        "parentId": 40,
                                        "status": false
                                    }, {
                                        "name": "删除",
                                        "id": 182,
                                        "type": 2,
                                        "url": "delete",
                                        "parentId": 40,
                                        "status": false
                                    }, {
                                        "name": "查询",
                                        "id": 183,
                                        "type": 2,
                                        "url": "select",
                                        "parentId": 40,
                                        "status": false
                                    }]
                                },
                                {
                                    "id": 41,
                                    "name": "我的公司",
                                    "url": "/index/mall-manage/myCompany",
                                    "children": [{
                                        "name": "新增",
                                        "id": 184,
                                        "type": 2,
                                        "url": "add",
                                        "parentId": 41,
                                        "status": false
                                    }, {
                                        "name": "修改",
                                        "id": 185,
                                        "type": 2,
                                        "url": "modify",
                                        "parentId": 41,
                                        "status": false
                                    }, {
                                        "name": "删除",
                                        "id": 186,
                                        "type": 2,
                                        "url": "delete",
                                        "parentId": 41,
                                        "status": false
                                    }, {
                                        "name": "查询",
                                        "id": 187,
                                        "type": 2,
                                        "url": "select",
                                        "parentId": 41,
                                        "status": false
                                    }]
                                },
                            ]
                        },
                        {
                            "id": 51,
                            "name": "系统管理",
                            "url": "/index/sys-manage",
                            "children": [
                                {
                                    "id": 52,
                                    "name": "菜单管理",
                                    "url": "/index/sys-manage/menus",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 220,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 52,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 221,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 52,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 222,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 52,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 223,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 52,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 55,
                                    "name": "配置管理",
                                    "url": "/index/sys-manage/configuration",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 232,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 55,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 233,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 55,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 234,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 55,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 235,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 55,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 79,
                                    "name": "系统通知",
                                    "url": "/index/sys-manage/notice",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 316,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 79,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 317,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 79,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 318,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 79,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 319,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 79,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 80,
                                    "name": "app版本管理",
                                    "url": "/index/sys-manage/appEdition",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 320,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 80,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 321,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 80,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 322,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 80,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 323,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 80,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 87,
                                    "name": "物流公司管理",
                                    "url": "/index/sys-manage/logisticsCompany",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 871,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 87,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 872,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 87,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 873,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 87,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 874,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 87,
                                            "status": false
                                        },
                                    ]
                                },
                                {
                                    "id": 82,
                                    "name": "操作日志",
                                    "url": "/index/sys-manage/operationRecord",
                                    "children": [
                                        {
                                            "name": "新增",
                                            "id": 328,
                                            "type": 2,
                                            "url": "add",
                                            "parentId": 82,
                                            "status": false
                                        },
                                        {
                                            "name": "修改",
                                            "id": 329,
                                            "type": 2,
                                            "url": "modify",
                                            "parentId": 82,
                                            "status": false
                                        },
                                        {
                                            "name": "删除",
                                            "id": 330,
                                            "type": 2,
                                            "url": "delete",
                                            "parentId": 82,
                                            "status": false
                                        },
                                        {
                                            "name": "查询",
                                            "id": 331,
                                            "type": 2,
                                            "url": "select",
                                            "parentId": 82,
                                            "status": false
                                        },
                                    ]
                                },
                            ]
                        },                       
                    ]
                };
                if (json.result === 0) {
                    const tempMenuList = [];
                    // const handleResult = this.dataHandle(json.data);
                    const handleResult = json.data;
                    sessionStorage.menuList = JSON.stringify(handleResult);
                    handleResult.forEach((item, index) => {
                        tempMenuList.push(
                            <Menu.Item key={index + 1}>
                                <Link to={item.url}>
                                    {item.name}
                                </Link>
                            </Menu.Item>
                        )
                    });
                    this.setState({
                        menuList: tempMenuList
                    }, () => {
                        if (this.props.location.pathname === "/index") {
                            this.props.history.push(handleResult[0].url);
                            this.setState({
                                highlight: "1"
                            })
                        } else {
                            const superiorPath = this.getSuperiorPath(this.props.location.pathname);
                            const tempMenuList = JSON.parse(sessionStorage.menuList);
                            tempMenuList.forEach((item, index) => {
                                if (item.url === superiorPath) {
                                    this.setState({
                                        highlight: (index + 1).toString()
                                    })
                                }
                            })
                        }
                    })
                }
            },
            success: (json) => {
                if (json.result === 0) {
                    const tempMenuList = [];
                    // 菜单分级处理
                    const handleResult = this.dataHandle(json.data);
                    // 菜单信息写入sessionStorage
                    sessionStorage.menuList = JSON.stringify(handleResult);
                    // 一级菜单组件列表生成及写入
                    handleResult.forEach((item, index) => {
                        tempMenuList.push(
                            <Menu.Item key={index + 1}>
                                <Link to={item.url}>
                                    {item.name}
                                </Link>
                            </Menu.Item>
                        )
                    });
                    this.setState({
                        menuList: tempMenuList
                    }, () => {
                        if (this.props.location.pathname === "/index") {
                            // 路由一级菜单信息为空时，默认渲染列表第一个菜单组件并设置高亮
                            this.props.history.push(handleResult[0].url);
                            this.setState({
                                highlight: "1"
                            })
                        } else {
                            // 获取当前页面的一级菜单路由
                            const superiorPath = this.getSuperiorPath(this.props.location.pathname);
                            const tempMenuList = JSON.parse(sessionStorage.menuList);
                            tempMenuList.forEach((item, index) => {
                                // 路由与superiorPath吻合的一级菜单设为高亮
                                if (item.url === superiorPath) {
                                    this.setState({
                                        highlight: (index + 1).toString()
                                    })
                                }
                            })
                        }
                    })
                    console.log(this.state.menuList);
                } else {
                    this.props.history.push('/')
                }
            }
        })*/
    };

    // 退出登录处理
    signOut = () => {
        reqwest({
            url: '/user/loginOut',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                sessionStorage.clear();
                this.props.history.push('/')
            },
            success: (json) => {
                // 清除登陆信息
                sessionStorage.clear();
                // 跳转至登陆页面
                this.props.history.push('/')
            }
        });
    };

    getInstitutionList = () => {
        reqwest({
            url: '/institution/getEducations',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        institutionList: json.data.list
                    })
                }
            },
            error: (XMLHttpRequest) => {

            }
        });
    };

    // 设置机构切换开关
    setSwitchFlag = () => {
        reqwest({
            url: '/institution/getDetail',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {

            },
            success: (json) => {
                if (json.result === 0) {
                    if (json.data.institution) {
                        // 若该机构为主机构，则机构切换开关开启
                        this.setState({
                            switchFlag: json.data.institution.mainEducation === 0
                        })
                    }
                }
            }
        });
    };

    // 机构切换成功函数
    switchSuccess = (data) => {
        // 设置机构切换开关
        this.setSwitchFlag();
        // 菜单列表重新写入
        const tempMenuList = [];
        const handleResult = this.dataHandle(data);
        sessionStorage.menuList = JSON.stringify(handleResult);
        handleResult.forEach((item, index) => {
            tempMenuList.push(
                <Menu.Item key={index + 1}>
                    <Link to={item.url}>
                        {item.name}
                    </Link>
                </Menu.Item>
            )
        });
        this.setState({
            menuList: tempMenuList
        }, () => {
            // 跳转至第一个二级菜单
            this.props.history.push(handleResult[0].children[0].url + "?flag=true")
        });
        // 其他信息重新写入
        this.setState({
            highlight: "1",
            name: sessionStorage.name,
            userKey: sessionStorage.userKey
        })
    };

    // 高亮选项设置
    setHighlight = (value) => {
        this.setState({
            highlight: value.key
        })
    };

    componentWillMount() {
        // 登陆人为机构管理员的分支操作
        if (Number(sessionStorage.EId) !== 0 && Number(sessionStorage.EId) !== 1) {
            // 获取该机构管理员下属机构列表
            // this.getInstitutionList();
            // 设置机构切换开关
            // this.setSwitchFlag();
        }
        // 登陆信息写入
        this.setState({
            name: sessionStorage.name,
            userKey: sessionStorage.userKey
        });
        // 获取菜单列表
        this.getMenuList();
    }

    componentWillReceiveProps(nextProps) {
        // url一级菜单部分有变化，则重新设置高亮项
        // console.log(nextProps);
        // console.log(this.getSuperiorPath(nextProps.location.pathname));
        // console.log(this.getSuperiorPath(this.getSuperiorPath(this.props.location.pathname)));
        if (this.getSuperiorPath(nextProps.location.pathname) !== this.getSuperiorPath(this.props.location.pathname)) {
            JSON.parse(sessionStorage.menuListOne).forEach((item, index) => {
                // console.log(item.url);
                // console.log(this.getSuperiorPath(nextProps.location.pathname))
                if (item.url === this.getSuperiorPath(nextProps.location.pathname)) {
                    this.setState({
                        highlight: (index + 1).toString()
                    })
                }
            })
        }
    }

    render() {
        return (
            <Router>
                <div className="home">
                    <Layout>
                        <Header className="header">
                            {/*LOGO框*/}
                            <div className="logo">
                                <img src={logoImg} alt=""/>
                                <div className="pic-right">
                                    <p>淘儿学</p>
                                    <p>运营管理系统</p>
                                </div>
                            </div>
                            {/*一级菜单栏*/}
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[this.state.highlight]}
                                style={{marginLeft: '150px', lineHeight: '64px'}}
                                onClick={this.setHighlight}
                            >
                                {this.state.menuList}
                            </Menu>
                            {/*登陆信息相关*/}
                            <div className="right-box">
                                {/*当前登录人信息*/}
                                <span
                                    className="username">{sessionStorage.name ? (sessionStorage.name + "(" + sessionStorage.phone + ")") : "未登录"}</span>
                                {/*机构管理员下属机构列表，当前机构为主机构且机构数量大于1时展示*/}
                                <InstitutionList 
                                    institutionList={this.state.institutionList}
                                    switchSuccess={this.switchSuccess}
                                    signOut={this.signOut}
                                    flag={this.state.institutionList.length > 1 && this.state.switchFlag}/>
                                {/*重置密码*/}
                                <ResetPassword signOut={this.signOut}/> 
                                {/*退出登录*/}
                                <Popconfirm title="确认退出?"
                                            placement="topRight"
                                            onConfirm={this.signOut}
                                            onCancel=""
                                            okType="danger"
                                            okText="立即退出"
                                            cancelText="取消">
                                    <a style={{marginLeft: "10px"}}>退出</a>
                                </Popconfirm>

                            </div>
                        </Header>
                        
                    </Layout>
                    {/*一级菜单路由组件映射表*/}
                    <Route path="/index/app-home" component={AppHome}/>
                    <Route path="/index/org-manage" component={OrgManage}/>
                    <Route path="/index/edu-manage" component={EduManage}/>
                    <Route path="/index/order-manage" component={OrderManage}/>
                    <Route path="/index/check-manage" component={CheckManage}/>

                    <Route path="/index/data-statistics" component={DataStatistics}/>
                    <Route path="/index/mdh-manage" component={MdhManage}/>                 
                    <Route path="/index/information-manage" component={InformationManage}/>
                    <Route path="/index/mall-manage" component={MallManage}/>
                    
                    <Route path="/index/financial-manage" component={FinancialManage}/>
                    <Route path="/index/user-manage" component={UserManage}/>
                    <Route path="/index/backUser-manage" component={BackUserManage}/>
                    <Route path="/index/agent-manage" component={AgentManage}/>                     
                    <Route path="/index/sys-manage" component={SysManage}/> 
                    <Layout>
                        <Footer className="footer">
                            <div className="version-infor">Copyright © www.taoerxue.com, All Rights Reserved.</div>
                            <div className="version-infor">浙江淘儿学教育科技有限公司</div>
                        </Footer>
                    </Layout>                   
                </div>
            </Router>
        )
    }
}

export default Home;