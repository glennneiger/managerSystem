import React, {Component} from 'react';
import {
    Link
} from 'react-router-dom';
import {
    Table,
    Input,
    Modal,
    Form,
    Select,
    Button,
    List,
    message,
    Tabs,
    InputNumber,
    DatePicker,
    Icon,
    Spin,
} from 'antd';
import reqwest from 'reqwest';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const {Option} = Select;
const {TextArea} = Input;

//栅格设置

const formItemLayout_14 = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

//课程订单详情组件
class Item01Details extends Component {
    state = {
        visible: false,
        data: {}
    };

    timeHandle = (para) => {
        const tempDate = new Date(para.replace("CST", "GMT+0800")),
            oMonthT = (tempDate.getMonth() + 1).toString(),
            oMonth = oMonthT.length <= 1 ? "0" + oMonthT : oMonthT,
            oDayT = tempDate.getDate().toString(),
            oDay = oDayT.length <= 1 ? "0" + oDayT : oDayT,
            oYear = tempDate.getFullYear().toString(),
            oHourT = tempDate.getHours().toString(),
            oHour = oHourT.length <= 1 ? "0" + oHourT : oHourT,
            oMinuteT = tempDate.getMinutes().toString(),
            oMinute = oMinuteT.length <= 1 ? "0" + oMinuteT : oMinuteT,
            oTime = oYear + '-' + oMonth + '-' + oDay + " " + oHour + ":" + oMinute;
        return oTime;
    };

    showModal = () => {
        let tempStatus = "";
        let tempData = {};
        if (this.props.data) {
            if (this.props.data.state === 1) {
                tempStatus = "待付款"
            }
            if (this.props.data.state === 3) {
                tempStatus = "已付款"
            }
            if (this.props.data.state === 10) {
                tempStatus = "进行中"
            }
            if (this.props.data.state === 4) {
                tempStatus = "待评价"
            }
            if (this.props.data.state === 5) {
                tempStatus = "已完成"
            }
            if (this.props.data.state === 6) {
                tempStatus = "已退款"
            }
            if (this.props.data.state === 7) {
                tempStatus = "已关闭"
            }
            if (this.props.data.state === 8) {
                tempStatus = "退款中"
            }
            if (this.props.data.state === 9) {
                tempStatus = "退款失败"
            }
            tempData = this.props.data;
            tempData.status = tempStatus;
        }
        this.setState({
            visible: true,
            data: tempData
        })
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const dataSource = [
            <div className="orderSn">
                <span className="item-name">订单编号：</span>
                <span className="item-content">{this.state.data.orderSn}</span>
            </div>,
            <div className="tradeNo">
                <span className="item-name">外部编号：</span>
                <span className="item-content">{this.state.data.tradeNo || "暂无"}</span>
            </div>,
            <div className="userName">
                <span className="item-name">用户名：</span>
                <span className="item-content">{this.state.data.userName}</span>
            </div>,
            <div className="phone">
                <span className="item-name">用户电话：</span>
                <span className="item-content">{this.state.data.phone}</span>
            </div>,
            <div className="eduName">
                <span className="item-name">机构名称：</span>
                <span className="item-content">{this.state.data.eduName}</span>
            </div>,
            <div className="totalPrice">
                <span className="item-name">订单总额：</span>
                <span className="item-content">￥{this.state.data.totalPrice}</span>
            </div>,
            <div className="orderAmount">
                <span className="item-name">实际付款：</span>
                <span className="item-content">￥{this.state.data.orderAmount}</span>
            </div>,
            <div className="reductionMoney">
                <span className="item-name">减免金额：</span>
                <span
                    className="item-content">{this.state.data.reductionMoney ? "￥" + this.state.data.reductionMoney : "无"}</span>
            </div>,
            <div className="createTime">
                <span className="item-name">下单时间：</span>
                <span className="item-content">
                    {this.state.data.createTime ? this.timeHandle(this.state.data.createTime) : ""}
                </span>
            </div>,
            <div className="remark">
                <span className="item-name">备注：</span>
                <span className="item-content">{this.state.data.remark || "暂无"}</span>
            </div>,
            <div className="status">
                <span className="item-name">状态：</span>
                <span className="item-content">{this.state.data.status}</span>
            </div>,
        ];
        return (
            <a>
                <span onClick={() => this.showModal(this.props.id)}>详情</span>
                <Modal
                    title="课程订单详情"
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <div className="order-details">
                        <div className="order-baseData">
                            <List
                                size="small"
                                split="false"
                                dataSource={dataSource}
                                renderItem={item => (<List.Item>{item}</List.Item>)}
                            />
                        </div>
                    </div>
                </Modal>
            </a>
        );
    }
}

//课程订单内容列表表格
const ItemContent01ListTable = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, pagination, data, columns, pageChange, loading} = props;

        return (
            <Modal
                width={1000}
                visible={visible}
                title="订单内容列表"
                footer={null}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
            >
                <div className="class-list">
                    <Table bordered pagination={pagination} dataSource={data} columns={columns}
                           onChange={pageChange} loading={loading}/>
                </div>
            </Modal>
        );
    }
);

//课程订单内容列表组件
class ItemContent01List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: true,
            data: [],
            pagination: {
                current: 1,
                pageSize: 5
            },
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '8%',
            },
            {
                title: '课程名称',
                dataIndex: 'courseName',
                width: '30%',
                render: (text, record) => this.renderColumns(text, record, 'courseName'),
            },
            {
                title: '课程图片',
                dataIndex: 'coursePhoto',
                width: '8%',
                render: (text, record) => (
                    <img style={{width: '50px', height: "24px"}} alt="" src={record["coursePhoto"]}/>)
            },
            {
                title: '孩子昵称',
                dataIndex: 'studentName',
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, 'studentName'),
            },
            {
                title: '孩子头像',
                dataIndex: 'studentPhoto',
                width: '8%',
                render: (text, record) => (
                    <img style={{width: '30px', height: "30px"}} alt="" src={record["studentPhoto"]}/>)
            },
            {
                title: '价格',
                dataIndex: 'price',
                width: '10%',
                render: (text, record) => this.renderColumns(text, record, 'price'),
            }
        ];
    }

    //获取内容列表
    getData = () => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/order/getCourseItem',
            type: 'json',
            method: 'post',
            data: {
                orderSn: this.props.orderSn
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                message.error("获取失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                const data = [];
                if (json.result === 0) {
                    json.data.list.forEach((item, index) => {
                        data.push({
                            key: item.id,
                            id: item.id,
                            index: index + 1,
                            courseName: item.courseName,
                            coursePhoto: "http://image.taoerxue.com/" + item.coursePhoto,
                            studentName: item.studentName,
                            studentPhoto: "http://image.taoerxue.com/" + item.studentPhoto,
                            price: item.pice
                        });
                    });
                    this.setState({
                        loading: false,
                        data: data,
                    });
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            loading: false
                        })
                    }
                }
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

    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

    render() {
        return (
            <a>
                <span onClick={() => this.showModal(this.props.id)}>订单内容列表</span>
                <ItemContent01ListTable
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    data={this.state.data}
                    columns={this.columns}
                    pageChange={this.pageChange}
                />
            </a>
        );
    }
}

//审核信息表单
const CheckForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, onChange, form, data, orgName, confirmLoading} = props;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="审核帐单"
                width={750}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                {
                    JSON.stringify(data) === "{}" ?
                        <div className="spin-box">
                            <Spin/>
                        </div>
                        :
                        <div className="institution-edit institution-form item-form ">
                            <Form layout="vertical">
                                <h3 style={{color: "#3390FF"}}>商家在当前自然月内4次免费申请，超出额外收取服务费</h3>
                                <FormItem className="companyName" {...formItemLayout_14 } label="账单编号：">
                                    {getFieldDecorator('orderNum', {
                                        initialValue: data.orderNum,
                                        rules: [
                                            {
                                                required: false,
                                                message: '账单编号不能为空',
                                            },
                                        ]
                                    })(
                                        <Input disabled placeholder="请输入账单编号"/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="帐单金额：">
                                    {getFieldDecorator('totalSum', {
                                        initialValue: data.totalSum,
                                        rules: [{
                                            required: false,
                                            message: '帐单金额不能为空',
                                        }],
                                    })(
                                        <div>
                                            <InputNumber 
                                                formatter={value => `￥ ${data.totalSum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                                                style={{width: "100%"}}
                                                precision={2}
                                                disabled placeholder="请输入帐单金额"/>
                                        </div>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="机构名称：">
                                    {getFieldDecorator('orgName', {
                                        initialValue: orgName,
                                        rules: [{
                                            required: false,
                                            message: '机构名称不能为空',
                                        }],
                                    })(
                                        <Input disabled placeholder="请输入机构名称"/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="companyName" {...formItemLayout_14 } label="额外服务费：">
                                    {getFieldDecorator('extraFee', {
                                        initialValue: data.serviceFees,
                                        rules: [
                                            {
                                                required: false,
                                                message: '额外服务费不能为空',
                                            }
                                        ]
                                    })(
                                        <div>
                                            <InputNumber
                                                defaultValue={data.serviceFees}
                                                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                                                style={{width: "60%"}} 
                                                placeholder="请输入额外服务费"
                                                precision={2}
                                                onChange={onChange}
                                                /> 第{1}次申请结算
                                        </div>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="转帐手续费：">
                                    {getFieldDecorator('transferFee', {
                                        initialValue: data.transferFee,
                                        rules: [{
                                            required: false,
                                            message: '转帐手续费不能为空',
                                        }],
                                    })(
                                        <Input placeholder="请扣除转帐产生的手续费"/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <div className="ant-line"></div>          
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//审核信息组件
class Check extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
            visible: false,
            // 订单基本信息
            data: {},
            // 提交按钮状态变量
            confirmLoading: false,
            extraFee: "",
        };
    } 

    onChange = (value) => {
        console.log('onChange ', value);
        this.setState({ 
            extraFee: value
        });
    };

    // 获取银行卡基本信息
    getData = () => {
        reqwest({
            url: '/sys/orgBank/details',
            type: 'json',
            method: 'get',
            data: {
                orgId: this.props.record.orgId
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
               
            },
            success: (json) => {
                if (json.result === 0) {
                    if (json.data) {
                        this.setState({
                            data: json.data,
                        })
                    }                                       
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                    }
                }
            }
        })
    };

    showModal = () => {
        // 获取订单基本信息
        console.log(this.props.record)
        // this.getData();
        this.setState({
            visible: true,
            data: this.props.record,
        })
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        const itemList = ["orderNum:", "payNum", "orderAmount", "couponNum", "consumTime"];
        const result = {};
        itemList.forEach((item) => {
            if (values[item] !== initValues[item]) {
                result[item] = values[item];
            }
        });
        console.log(result);
        if (JSON.stringify(result) === "{}") {
            return false;
        } else {
            result.id = this.props.id;
            return result;
        }
    };

    // 取消操作
    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    data: {},
                    confirmLoading: false
                });
            })
        };
        // data空值处理
        if (JSON.stringify(this.state.data) === "{}") {
            cancel();
            return;
        }

        form.validateFields((err, values) => {
            confirm({
                title: '确认放弃审核？',
                content: "",
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    cancel();
                }
            });
        })
    };

    // 确认操作
    handleCreate = () => {
        // data空值处理
        if (JSON.stringify(this.state.data) === "{}") {
            return;
        }
        const form = this.form;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            // 信息比对
            // const result = this.dataContrast(values);
            const result = {
                id: this.props.id,
                settleCode: values.orderNum,
                extraFee: this.state.extraFee ? this.state.extraFee : values.extraFee,
                transferFee: values.transferFee,
            }
            if (!result) {
                message.error("暂无信息更改");
                return;
            }
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/sys/settle/check',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: result,
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("审核成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                data: {},                                
                                confirmLoading: false
                            });
                        });
                        // this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === "1127") {
                            message.error("已修改信息正在审核中，暂不能修改");
                            this.setState({
                                confirmLoading: false
                            })
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            });
        });
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>                               
                <Button  
                    onClick={this.showModal} 
                    type="primary" 
                    style={{marginRight: "24px"}}>审核</Button>
                <CheckForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onChange={this.onChange}
                    id={this.props.id}
                    orgName={this.props.record.orgName}
                    data={this.state.data}
                    allTypeList={this.state.allTypeList}
                    handleSearch={this.handleSearch}
                    handleChange={this.handleChange}
                    typeList={this.state.typeList}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//支付信息表单
const PayForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, data, orgName, confirmLoading} = props;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="确认帐单支付"
                width={600}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                {
                    /*JSON.stringify(data) === "{}" ?
                        <div className="spin-box">
                            <Spin/>
                        </div>
                        :*/
                        <div className="institution-edit institution-form item-form ">
                            <Form layout="vertical">
                                <h3 style={{color: "#3390FF"}}>帐单确认支付后，此帐单的处理流程全部结束</h3>
                                <FormItem className="companyName" {...formItemLayout_14 } label="账单编号：">
                                    {getFieldDecorator('orderNum', {
                                        initialValue: data.orderNum,
                                        rules: [
                                            {
                                                required: false,
                                                message: '账单编号不能为空',
                                            },
                                        ]
                                    })(
                                        <Input disabled placeholder="请输入账单编号"/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="帐单金额：">
                                    {getFieldDecorator('totalSum', {
                                        initialValue: data.totalSum,
                                        rules: [{
                                            required: false,
                                            message: '帐单金额不能为空',
                                        }],
                                    })(
                                        <div>
                                            <InputNumber 
                                                formatter={value => `￥ ${data.totalSum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                                                style={{width: "100%"}}
                                                precision={2}
                                                disabled placeholder="请输入帐单金额"/>
                                        </div>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="机构名称：">
                                    {getFieldDecorator('orgName', {
                                        initialValue: orgName,
                                        rules: [{
                                            required: false,
                                            message: '机构名称不能为空',
                                        }],
                                    })(
                                        <Input disabled placeholder="请输入机构名称"/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="companyName" {...formItemLayout_14 } label="付款时间：">
                                    {getFieldDecorator('payTime', {
                                        // initialValue: data.payTime,
                                        // initialValue: moment('2018-06-06', "YYYY-MM-DD"),
                                        rules: [
                                            {
                                                required: true,
                                                message: '付款时间不能为空',
                                            }
                                        ]
                                    })(
                                        <DatePicker placeholder="请选择付款日期"
                                                    style={{width: "100%"}}
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    // onChange={this.setStartTime}
                                                    />
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <FormItem className="licenseNumber" {...formItemLayout_14 } label="付款备注：">
                                    {getFieldDecorator('remark', {
                                        // initialValue: data.remark,
                                        rules: [{
                                            required: false,
                                            message: '付款备注不能为空',
                                        }],
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="汇款单号、支付方式等支付凭证" rows={5}/>
                                    )}
                                </FormItem>
                                <div className="ant-line"></div>
                                <div className="ant-line"></div>          
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//支付信息组件
class Pay extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
            visible: false,
            // 订单基本信息
            data: {},
            // 提交按钮状态变量
            confirmLoading: false,
        };
    } 

    onChange = (value) => {
        console.log('onChange ', value);
        this.setState({ 
            tempTypeIds: value
        });
    };

    // 获取银行卡基本信息
    getData = () => {
        reqwest({
            url: '/sys/orgBank/details',
            type: 'json',
            method: 'get',
            data: {
                orgId: this.props.record.orgId
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
               
            },
            success: (json) => {
                if (json.result === 0) {
                    if (json.data) {
                        this.setState({
                            data: json.data,
                        })
                    }                                       
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                    }
                }
            }
        })
    };

    showModal = () => {
        // 获取订单基本信息
        console.log(this.props.record)
        // this.getData();
        this.setState({
            visible: true,
            data: this.props.record,
        })
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        const itemList = ["orderNum:", "payNum", "orderAmount", "couponNum", "consumTime"];
        const result = {};
        itemList.forEach((item) => {
            if (values[item] !== initValues[item]) {
                result[item] = values[item];
            }
        });
        console.log(result);
        if (JSON.stringify(result) === "{}") {
            return false;
        } else {
            result.id = this.props.id;
            return result;
        }
    };

    // 取消操作
    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    data: {},
                    confirmLoading: false
                });
            })
        };
        // data空值处理
        if (JSON.stringify(this.state.data) === "{}") {
            cancel();
            return;
        }

        form.validateFields((err, values) => {
            confirm({
                title: '确认放弃支付？',
                content: "",
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    cancel();
                }
            });
        })
    };

    // 确认操作
    handleCreate = () => {
        // data空值处理
        if (JSON.stringify(this.state.data) === "{}") {
            return;
        }
        const form = this.form;
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            // 信息比对
            // const result = this.dataContrast(values);
            const result = {
                // id: this.props.id,
                // birthday: values.birthday.format('YYYY-MM-DD HH:mm:ss'),
                // birthday: parseInt((Date.parse(new Date(values.birthday))) / 1000),
                settleCode: values.orderNum,
                transferTime: values.payTime.format('YYYY-MM-DD HH:mm:ss'),
                remark: values.remark,
        }
            if (!result) {
                message.error("暂无信息更改");
                return;
            }
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/sys/settle/transfer',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: result,
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("支付成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                data: {},                                
                                confirmLoading: false
                            });
                        });
                        this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === "1127") {
                            message.error("已修改信息正在审核中，暂不能修改");
                            this.setState({
                                confirmLoading: false
                            })
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            });
        });
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <Button 
                    onClick={this.showModal} 
                    type="primary" 
                    style={{marginRight: "24px"}}>支付</Button>
                <PayForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onChange={this.onChange}
                    id={this.props.id}
                    orgName={this.props.record.orgName}
                    data={this.state.data}
                    allTypeList={this.state.allTypeList}
                    handleSearch={this.handleSearch}
                    handleChange={this.handleChange}
                    typeList={this.state.typeList}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//确认表单
const ConfirmationForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, data, confirmLoading} = props;
        
        console.log(data.statusCode)
        return (
            <Modal
                visible={visible}
                title="确认提示"
                width={750}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                {
                    data.statusCode === 2 ?                        
                        <div className="">
                            <h3 style={{fontWeight: "bold"}}>
                            <Icon type="close" style={{background: "red", color: "#FFF", borderRadius: "100%"}}/>操作后将无法恢复，您确定是进行操作吗？</h3>
                        </div>
                        :
                        <div className="">
                            <h3 style={{fontWeight: "bold"}}>
                            <Icon type="close" style={{background: "red", color: "#FFF", borderRadius: "100%"}}/>平台未完成审核，请耐心等待....</h3>
                        </div>
                }
            </Modal>
        );
    }
);

//确认组件
class Confirmation extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
            visible: false,
            // 订单基本信息
            data: {},
            // 提交按钮状态变量
            confirmLoading: false,
            extraFee: "",

        };
    } 

    showModal = () => {
        // 获取订单基本信息
        console.log(this.props.record)
        this.setState({
            visible: true,
        })
    };

    // 取消操作
    handleCancel = () => {
        this.setState({
            visible: false
       }, () => {
           this.setState({
               data: {},
               confirmLoading: false
           });
       })
    };

    // 确认操作
    handleCreate = () => {
        if (this.props.record.statusCode === 2) {
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/sys/settle/confirm',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    settleCode: this.props.record.orderNum
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("确认成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                data: {},                                
                                confirmLoading: false
                            });
                        });
                        // this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === "902") {
                            message.error("登录信息已过期，请重新登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === "1127") {
                            message.error("已修改信息正在审核中，暂不能修改");
                            this.setState({
                                confirmLoading: false
                            })
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            });
        } else {
            this.handleCancel();
        }
        
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>                            
                {/*<Button  onClick={this.showModal} type="primary" style={{marginRight: "24px", display: this.props.record.statusCode === 2 ? "inline" : "none"}}>确认</Button>*/}
                <Button  
                    onClick={this.showModal} 
                    type="primary" 
                    style={{marginRight: "24px", display: "inline"}}>确认</Button>
                <ConfirmationForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onChange={this.onChange}
                    data={this.props.record}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//订单列表
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            originalData: [],
            data: [],
            pagination: {
                current: 1,
                pageSize: Number(localStorage.orderPageSize) || 10,
                pageSizeOptions: ["5", "10", "15", "20"],
                showQuickJumper: true,
                showSizeChanger: true
            },
        };
        this.columns = [];
        // 课程订单表格的列配置
        this.columns01 = Number(sessionStorage.EId) === 0 ?
            // 当前登陆人为系统管理员需展示订单所属机构，为机构管理员则不展示
            [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: '6%',
                    render: (text, record) => this.renderColumns(text, record, 'index'),
                },
                {
                    title: '订单编号',
                    dataIndex: 'orderSn',
                    width: '12%',
                    render: (text, record) => this.renderColumns(text, record, 'orderSn'),
                },
                {
                    title: '完成时间',
                    dataIndex: 'consumeTime',
                    width: '12%',
                    render: (text, record) => this.renderColumns(text, record, 'consumeTime'),
                },
                {
                    title: '订单金额',
                    dataIndex: 'orderAmount',
                    width: '10%',
                    render: (text, record) => this.renderColumns(text, record, 'orderAmount'),
                },
                {
                    title: '平台分佣',
                    dataIndex: 'fee',
                    width: '15%',
                    render: (text, record) => this.renderColumns(text, record, 'fee'),
                },
                {
                    title: '操作',
                    dataIndex: '操作',
                    render: (text, record) => {
                        return (
                            <div className="editable-row-operations">
                                {/*课程订单详情*/}
                                <Item01Details data={this.state.originalData[record.index - 1]}/>
                                {/*课程订单的订单内容列表*/}
                                <ItemContent01List orderSn={record.orderSn} toLoginPage={this.props.toLoginPage}/>
                            </div>
                        );
                    },
                }
            ]
            :
            [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: '6%',
                    render: (text, record) => this.renderColumns(text, record, 'index'),
                },
                {
                    title: '订单编号',
                    dataIndex: 'orderSn',
                    width: '12%',
                    render: (text, record) => this.renderColumns(text, record, 'orderSn'),
                },
                {
                    title: '完成时间',
                    dataIndex: 'consumeTime',
                    width: '12%',
                    render: (text, record) => this.renderColumns(text, record, 'consumeTime'),
                },
                {
                    title: '订单金额',
                    dataIndex: 'orderAmount',
                    width: '10%',
                    render: (text, record) => this.renderColumns(text, record, 'orderAmount'),
                },
                {
                    title: '平台分佣',
                    dataIndex: 'fee',
                    width: '15%',
                    render: (text, record) => this.renderColumns(text, record, 'fee'),
                },
                {
                    title: '操作',
                    dataIndex: '操作',
                    render: (text, record) => {
                        return (
                            <div className="editable-row-operations">
                                <Link 
                                    to={"./bill-detail?" + record.id}
                                    style={{display: this.props.opObj.select ? "inline" : "none"}}
                                    >查看</Link>
                                {/*课程订单详情*/}
                                {/*<Item01Details data={this.state.originalData[record.index - 1]}/>*/}
                                {/*课程订单的订单内容列表*/}
                                {/*<ItemContent01List orderSn={record.orderSn} toLoginPage={this.props.toLoginPage}/>*/}
                                {/*退款按钮仅机构管理员可见*/}
                                {/*<Popconfirm title="确认退款?"
                                            placement="topRight"
                                            onConfirm={() => this.refund(record.id)}
                                            onCancel=""
                                            okType="danger"
                                            okText="确认"
                                            cancelText="取消">
                                    <a style={{display: record.stateCode === 3 || record.stateCode === 9 ? "inline" : "none"}}>退款</a>
                                </Popconfirm>*/}
                                {/*结束订单按钮仅机构管理员可见，且只有进行中的订单可进行此项操作*/}
                                {/*<Popconfirm title="确认结束订单?"
                                            placement="topRight"
                                            onConfirm={() => this.endOrder(record.orderSn)}
                                            onCancel=""
                                            okType="danger"
                                            okText="确认"
                                            cancelText="取消">
                                    <a style={{display: record.stateCode === 10 ? "inline" : "none"}}>结束订单</a>
                                </Popconfirm>*/}
                            </div>
                        );
                    },
                }
            ];
        // 商品订单表格的列配置
        this.columns02 = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'index'),
            },        
            {
                title: '订单编号',
                dataIndex: 'orderSn',
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, 'orderSn'),
            },
            {
                title: "退单金额",
                dataIndex: "refundAmount",
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, "refundAmount"),
            },
            {
                title: "退还佣金",
                dataIndex: "refundCommission",
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, "refundCommission"),
            },
            {
                title: '平台处理时间',
                dataIndex: 'refundEndTime',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'refundEndTime'),
            },
            /*{
                title: '平台优惠劵',
                dataIndex: 'platformCoupon',
                width: '10%',
                render: (text, record) => this.renderColumns(text, record, 'platformCoupon'),
            },
            {
                title: '退还平台优惠劵',
                dataIndex: 'returnPlatformCoupon',
                width: '10%',
                render: (text, record) => this.renderColumns(text, record, 'returnPlatformCoupon'),
            },*/
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            <Link 
                                to={"./bill-detail?" + record.id}
                                style={{display: this.props.opStatusReturn ? "inline" : "none"}}
                                >查看</Link>
                            {/*<Item02Details data={this.state.originalData[record.index - 1]}/>
                            <LogisticsData orderSn={record.orderSn} status={record.statusCode === 3}/>*/}
                        </div>
                    );
                },
            }
        ];
    }

    // 时间处理
    timeHandle = (para) => {
        const tempDate = new Date(para.replace("CST", "GMT+0800")),
            oMonthT = (tempDate.getMonth() + 1).toString(),
            oMonth = oMonthT.length <= 1 ? "0" + oMonthT : oMonthT,
            oDayT = tempDate.getDate().toString(),
            oDay = oDayT.length <= 1 ? "0" + oDayT : oDayT,
            oYear = tempDate.getFullYear().toString(),
            oHourT = tempDate.getHours().toString(),
            oHour = oHourT.length <= 1 ? "0" + oHourT : oHourT,
            oMinuteT = tempDate.getMinutes().toString(),
            oMinute = oMinuteT.length <= 1 ? "0" + oMinuteT : oMinuteT,
            oTime = oYear + '-' + oMonth + '-' + oDay + " " + oHour + ":" + oMinute;
        return oTime;
    };

    //获取本页信息
    getData = (keyword) => {
        // 根据type，即订单类型的不同请求相应订单接口
        const type = keyword ? keyword.type : this.props.keyword.type;
        this.setState({
            loading: true
        });
        // 订单列表接口
        if (type === "0") {
            reqwest({
                url: '/sys/settle/OrderList',
                type: 'json',
                method: 'get',
                data: {
                    settleCode: this.props.settleCode, 
                    payState: 3,
                    pageNum: this.state.pagination.current,
                    pageSize: this.state.pagination.pageSize
                },
                headers: {
                    Authorization: sessionStorage.token
                },
                error: (XMLHttpRequest) => {
                    message.error("获取失败");
                    this.setState({
                        loading: false,
                        originalData: [],
                        data: [],
                    })
                },
                success: (json) => {
                    const data = [];
                    if (json.result === 0) {
                        if (json.data.list.length === 0 && this.state.pagination.current !== 1) {
                            this.setState({
                                pagination: {
                                    current: 1,
                                    pageSize: this.state.pagination.pageSize
                                }
                            }, () => {
                                this.getData();
                            });
                            return
                        }
                        json.data.list.forEach((item, index) => {
                            let tempPayState = "";
                            let tempConsumeState = "";
                            if (item.payState === 1) {
                                tempPayState = "待付款"
                            }
                            if (item.payState === 3) {
                                tempPayState = "已付款"
                            }                           
                            if (item.payState === 5) {
                                tempPayState = "已完成"
                            }
                            if (item.payState === 6) {
                                tempPayState = "已退款"
                            }
                            if (item.payState === 7) {
                                tempPayState = "已关闭"
                            }
                            if (item.payState === 8) {
                                tempPayState = "退款中"
                            }
                            if (item.payState === 9) {
                                tempPayState = "退款失败"
                            }
                            if (item.consumeState === 1) {
                                tempConsumeState = "待消费"
                            }
                            if (item.consumeState === 2) {
                                tempConsumeState = "已消费"
                            }
                            data.push({
                                key: index.toString(),
                                id: item.id,
                                index: index + 1,
                                orderSn: item.orderSn,
                                consumeTime: item.consumeTime,
                                orderAmount: "￥" + item.orderAmount.toFixed(2),
                                fee: "￥" + item.fee.toFixed(2),                                
                                userName: item.userName,
                                phone: item.phone,
                                // createTime: item.createTime,
                                payStateCode: item.payState,
                                payState: tempPayState,
                                consumeStateCode: item.consumeState,
                                consumeState: tempConsumeState,
                            });
                        });
                        this.setState({
                            loading: false,
                            originalData: json.data.list,
                            data: data,
                            pagination: {
                                total: json.data.size,
                                current: this.state.pagination.current,
                                pageSize: this.state.pagination.pageSize
                            }
                        });
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else {
                            message.error(json.message);
                            this.setState({
                                loading: false
                            })
                        }
                    }
                }
            });
        }
        // 退单列表接口
        if (type === "1") {
            reqwest({
                url: '/sys/settle/OrderList',
                type: 'json',
                method: 'get',
                data: {
                    settleCode: this.props.settleCode, 
                    payState: 6,
                    pageNum: this.state.pagination.current,
                    pageSize: this.state.pagination.pageSize
                },
                headers: {
                    Authorization: sessionStorage.token
                },
                error: (XMLHttpRequest) => {
                    message.error("获取失败");
                    this.setState({
                        loading: false,
                        originalData: [],
                        data: [],
                    })
                },
                success: (json) => {
                    const data = [];
                    if (json.result === 0) {
                        if (json.data.list.length === 0 && this.state.pagination.current !== 1) {
                            this.setState({
                                pagination: {
                                    current: 1,
                                    pageSize: this.state.pagination.pageSize
                                }
                            }, () => {
                                this.getData();
                            });
                            return
                        }
                        json.data.list.forEach((item, index) => {
                            let status = "";
                            if (item.state === 1) {
                                status = "待付款"
                            }
                            if (item.state === 2) {
                                status = "待发货"
                            }
                            if (item.state === 3) {
                                status = "待收货"
                            }
                            if (item.state === 4) {
                                status = "待评价"
                            }
                            if (item.state === 5) {
                                status = "已完成"
                            }
                            if (item.state === 6) {
                                status = "已退款"
                            }
                            if (item.state === 7) {
                                status = "已取消"
                            }

                            let tempPayState = "";
                            let tempConsumeState = "";
                            if (item.payState === 1) {
                                tempPayState = "待付款"
                            }
                            if (item.payState === 3) {
                                tempPayState = "已付款"
                            }                           
                            if (item.payState === 5) {
                                tempPayState = "已完成"
                            }
                            if (item.payState === 6) {
                                tempPayState = "已退款"
                            }
                            if (item.payState === 7) {
                                tempPayState = "已关闭"
                            }
                            if (item.payState === 8) {
                                tempPayState = "退款中"
                            }
                            if (item.payState === 9) {
                                tempPayState = "退款失败"
                            }
                            if (item.consumeState === 1) {
                                tempConsumeState = "待消费"
                            }
                            if (item.consumeState === 2) {
                                tempConsumeState = "已消费"
                            }
                            data.push({
                                key: index.toString(),
                                id: item.id,
                                index: index + 1,
                                orderSn: item.orderSn,
                                refundAmount: "￥" + item.refundAmount.toFixed(2),
                                refundCommission: "￥" + item.fee.toFixed(2),
                                refundEndTime: item.refundEndTime,
                                payStateCode: item.payState,
                                payState: tempPayState,
                                consumeStateCode: item.consumeState,
                                consumeState: tempConsumeState,
                                statusCode: item.state,
                                status: status,
                            });
                        });
                        this.setState({
                            loading: false,
                            originalData: json.data.list,
                            data: data,
                            pagination: {
                                total: json.data.total,
                                current: this.state.pagination.current,
                                pageSize: this.state.pagination.pageSize
                            }
                        });
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            // 返回登陆页
                            this.props.toLoginPage();
                        } else {
                            message.error(json.message);
                            this.setState({
                                loading: false
                            })
                        }
                    }
                }
            });
        }
    };

    //退款
    refund = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/order/launchRefundsExamine',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("退款成功");
                    this.getData()
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            loading: false
                        })
                    }
                }
            }
        });
    };

    //结束订单
    endOrder = (orderSn) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/order/endOrder',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                orderSn: orderSn
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("结束订单成功");
                    this.getData()
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            loading: false
                        })
                    }
                }
            }
        });
    };

    //列渲染
    renderColumns(text) {
        return (
            <Cell value={text}/>
        );
    }

    //页码变化处理
    handleTableChange = (pagination) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        localStorage.orderPageSize = pagination.pageSize;
        pager.pageSize = Number(localStorage.orderPageSize);
        this.setState({
            pagination: pager,
        }, () => {
            this.getData();
        });
    };

    componentWillMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.keyword === this.props.keyword && nextProps.flag_add === this.props.flag_add) {
            return;
        }
        this.getData(nextProps.keyword);
    }

    render() {
        if (this.props.keyword.type === "0") {
            this.columns = this.columns01;
        }
        if (this.props.keyword.type === "1") {
            this.columns = this.columns02;
        }
        return <Table bordered
                      loading={this.state.loading}
                      dataSource={this.state.data}
                      pagination={this.state.pagination}
                      columns={this.columns}
                      onChange={this.handleTableChange}/>;
    }
}

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 订单状态选项列表
            optionsOfStatus: [
                <Option key={0} value="0">{"所有订单"}</Option>,
                <Option key={1} value="1">{"待付款"}</Option>,
                <Option key={3} value="3">{"已付款"}</Option>,
                <Option key={10} value="10">{"进行中"}</Option>,
                <Option key={4} value="4">{"待评价"}</Option>,
                <Option key={5} value="5">{"已完成"}</Option>,
                <Option key={6} value="6">{"已退款"}</Option>,
                <Option key={7} value="7">{"已关闭"}</Option>,
                <Option key={8} value="8">{"退款中"}</Option>,
                <Option key={9} value="9">{"退款失败"}</Option>
            ],
            // 获取订单列表所需关键词
            keyword: {
                // 订单类型变量：0为课程订单
                type: "0",
                // 订单状态变量
                status: "0",
                // 起始日期
                startTime: "",
                // 结束日期
                endTime: "",
            },
            flag_add: false,
            recordBillData: {},
            orderNum: '',
            // 查看传过来的权限
            tempOrderOpObj: {},
            // 审核，支付，打印权限
            opObj02: {},
            // 订单权限
            opObj: {},
            // 退单权限
            opObjReturn: {},
        }
    }

    // 订单状态选项列表设置
    setOptionsOfStatus = () => {
        //课程订单
        if (this.state.keyword.type === "0") {
            this.setState({
                optionsOfStatus: [
                    <Option key={0} value="0">{"所有订单"}</Option>,
                    <Option key={1} value="1">{"待付款"}</Option>,
                    <Option key={3} value="3">{"已付款"}</Option>,
                    <Option key={10} value="10">{"进行中"}</Option>,
                    <Option key={4} value="4">{"待评价"}</Option>,
                    <Option key={5} value="5">{"已完成"}</Option>,
                    <Option key={6} value="6">{"已退款"}</Option>,
                    <Option key={7} value="7">{"已关闭"}</Option>,
                    <Option key={8} value="8">{"退款中"}</Option>,
                    <Option key={9} value="9">{"退款失败"}</Option>
                ]
            })
        }
        // 商品订单
        if (this.state.keyword.type === "1") {
            this.setState({
                optionsOfStatus: [
                    <Option key={0} value="0">{"所有订单"}</Option>,
                    <Option key={1} value="1">{"待付款"}</Option>,
                    <Option key={2} value="2">{"待发货"}</Option>,
                    <Option key={3} value="3">{"待收货"}</Option>,
                    <Option key={4} value="4">{"待评价"}</Option>,
                    <Option key={5} value="5">{"已完成"}</Option>,
                    <Option key={6} value="6">{"已退款"}</Option>,
                    <Option key={7} value="7">{"已取消"}</Option>,
                ]
            })
        }
    };

    // 订单类型设置
    setType = (value) => {
        this.setState({
            keyword: {
                type: value,
                status: this.state.keyword.status,
                startTime: this.state.keyword.startTime,
                endTime: this.state.keyword.endTime,
            },
        }, () => {
            // 类型变更需重新设置订单状态选项列表
            this.setOptionsOfStatus()
        })
    };

    // 订单状态设置
    setStatus = (value) => {
        this.setState({
            keyword: {
                type: this.state.keyword.type,
                status: value,
                startTime: this.state.keyword.startTime,
                endTime: this.state.keyword.endTime,
            }
        })
    };

    // 起始日期写入
    setStartTime = (date, dateString) => {
        this.setState({
            keyword: {
                type: this.state.keyword.type,
                status: this.state.keyword.status,
                startTime: dateString,
                endTime: this.state.keyword.endTime,
            }
        })
    };

    // 结束日期写入
    setEndTime = (date, dateString) => {
        this.setState({
            keyword: {
                type: this.state.keyword.type,
                status: this.state.keyword.status,
                startTime: this.state.keyword.startTime,
                endTime: dateString,
            }
        })
    };

    setFlag = () => {
        this.setState({
            flag_add: !this.state.flag_add
        })
    };

    // 获取当前登录人对此菜单的操作权限
    setPower = () => {
        // 菜单信息为空则直接返回登陆页
        if (!sessionStorage.menuListOne) {
            this.toLoginPage();
            return
        }
        // 获取审核，支付，打印权限
        JSON.parse(sessionStorage.menuListOne).forEach((item) => {
            item.children.forEach((subItem) => {               
                if (subItem.url === "/index/financial-manage/settle") {
                    let data = {};
                    subItem.children.forEach((thirdItem) => {
                        data[thirdItem.url] = true;
                    });
                    this.setState({
                        opObj02: data
                    })
                }
            })
        })

        // 订单列表权限
        JSON.parse(sessionStorage.menuListOne).forEach((item) => {
            item.children.forEach((subItem) => {
                console.log(subItem)
                const fnfilter = (para) => {
                    return  para.url === "/index/financial-manage/order-detail-list";
                    // return  para.url === "/index/financial-manage/order-detail";
                }
                const tempSubItem = subItem.children.filter(fnfilter);
                console.log(tempSubItem);
                subItem.children.forEach((fourthItem) => {
                    // tempSubItem.forEach((fourthItem) => {
                    console.log(fourthItem)
                    if (fourthItem.url === "/index/financial-manage/order-detail-list") {
                        let data = {};
                        fourthItem.children.forEach((fifthItem) => {
                            data[fifthItem.url] = true;
                        })
                        console.log(data)
                        this.setState({
                            opObj: data
                        })
                    }                    
                })
                /*if (subItem.url === this.props.location.pathname) {
                    let data = {};
                    subItem.children.forEach((thirdItem) => {
                        data[thirdItem.url] = true;
                    });
                    this.setState({
                        opObj: data
                    })
                }*/
            })
        })

        // 退单列表权限
        JSON.parse(sessionStorage.menuListOne).forEach((item) => {
            item.children.forEach((subItem) => {
                console.log(subItem)
                const fnfilter = (para) => {
                    return  para.url === "/index/financial-manage/return-order-detail";
                }
                const tempSubItem = subItem.children.filter(fnfilter);
                console.log(tempSubItem);
                subItem.children.forEach((fourthItem) => {
                    // tempSubItem.forEach((fourthItem) => {
                    console.log(fourthItem)
                    if (fourthItem.url === "/index/financial-manage/return-order-detail") {
                        let data = {};
                        fourthItem.children.forEach((fifthItem) => {
                            data[fifthItem.url] = true;
                        })
                        console.log(data)
                        this.setState({
                            opObjReturn: data
                        })
                    }                    
                })
                /*if (subItem.url === this.props.location.pathname) {
                    let data = {};
                    subItem.children.forEach((thirdItem) => {
                        data[thirdItem.url] = true;
                    });
                    this.setState({
                        opObj: data
                    })
                }*/
            })
        })
    };

    // 登陆信息过期或不存在时的返回登陆页操作
    toLoginPage = () => {
        sessionStorage.clear();
        this.props.history.push('/')
    };

    componentWillMount() {
        // console.log(this.props);
        this.setPower();
        if (this.props.location.search.substring(1) && this.props.location.search.substring(1) !== ' ') {
            sessionStorage.recordBillData = this.props.location.search.substring(1);
        }
        const temp = JSON.parse(sessionStorage.recordBillData);
        this.setState({
            recordBillData: temp,
        }, () =>{
            console.log(this.state.recordBillData);
        })
        if (this.props.location.search) {
            this.props.history.push(this.props.location.pathname)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search) {
            this.props.history.push(nextProps.location.pathname);
            this.setFlag();
        }
    }

    // 返回按钮
    handleBack = () => {
        this.props.history.push('/index/financial-manage/settle');
        // this.props.history.go(-1);
        // this.props.history.goBack();
    };

    // 打印有问题，操作之后，页面不能点击了
    printOrder = () => {
        var newstr = document.getElementById("print-order-detail").innerHTML;//得到需要打印的元素HTML
        var oldstr = document.body.innerHTML;//保存当前页面的HTML
        document.body.innerHTML = newstr;

        window.print();
        document.body.innerHTML = oldstr;
        // 使用window.print()后网页不能操作
        // 使用window.location.reload()重新加载
        window.location.reload();
        return false;
    };

    render() {
        console.log(this.state.opObj02);
        console.log(this.state.opObj);
        console.log(this.state.opObjReturn);
        return (
            <div className="orders">
                <header style={{marginBottom: "10px", background: "#FFF", minHeight: "60px", position: "relative"}}>
                    <div className="billBack">
                        <Button onClick={this.handleBack}><Icon type="left"/>返回</Button>
                    </div>
                </header>
                <header style={{minHeight: "60px", lineHeight: "60px", padding: "0 24px", background: "#FFF"}}>
                    {/*订单类型tab栏*/}
                    <div>账单编号：{this.state.recordBillData.orderNum}</div>
                    <div className="add-button">
                        {/*if (item.status === 1) {
                            tempStatus = "商家申请"
                        }
                        if (item.status === 2) {
                            tempStatus = "平台审核"
                        }
                        if (item.status === 3) {
                            tempStatus = "商家确认"
                        }
                        if (item.status === 4) {
                            tempStatus = "财务支付"
                        }*/}

                        {/*平台审核*/}
                        <Check
                            record={this.state.recordBillData}
                            opStatus02={this.state.opStatus02}
                            flag_add={this.state.flag_add}
                            toLoginPage={this.toLoginPage}
                            opStatus={this.state.opObj02.check && this.state.recordBillData.statusCode === 1}
                        />                        
                        
                        {/*商家确认*/}
                        <Confirmation
                            record={this.state.recordBillData}
                            flag_add={this.state.flag_add}
                            toLoginPage={this.toLoginPage}
                            opStatus={this.state.opObj02.confirm && this.state.recordBillData.statusCode === 2}
                        />
                        
                        {/*财务支付*/}
                        <Pay
                            record={this.state.recordBillData}
                            opStatus02={this.state.opStatus02}
                            flag_add={this.state.flag_add}
                            toLoginPage={this.toLoginPage}
                            opStatus={this.state.opObj02.pay && this.state.recordBillData.statusCode === 3}
                        />

                        <Button 
                            type="primary"
                            onClick={this.printOrder}
                            style={{display: this.state.opObj02.print ? "inline" : "none", marginRight: "24px"}}>打印</Button>
                    </div>
                </header>
                <header style={{minHeight: "100px", padding: "24px", border: "1px solid #e8e8e8", background: "#F2F2F2"}}>
                    <p>机构名称：{this.state.recordBillData.orgName}</p>
                    <p>截止日期：{this.state.recordBillData.settleEndDate}</p>
                    <p>出帐日期：{this.state.recordBillData.createTime}</p>
                    <p>平台应结金额：{this.state.recordBillData.settleSum} = ￥ {this.state.recordBillData.totalSum}（已消费订单金额[截止日期前全部未结算订单]）- ￥{this.state.recordBillData.serviceFees}(额外服务费) - ￥{this.state.recordBillData.transferFee}(转帐手续费)</p>
                    <p>结算状态： {this.state.recordBillData.billStatus}</p>
                    <p>付款时间： {this.state.recordBillData.transferTime}</p>
                    <p>付款备注： {this.state.recordBillData.remark}</p>                    
                </header>
                <header id="print-order-detail" style={{display: "none", minHeight: "100px", padding: "24px", border: "1px solid #e8e8e8", background: "#F2F2F2"}}>
                    <p style={{textAlign: "center"}}>结算单</p>
                    <div style={{height: "1px", background: "#CCCCCC"}}></div>
                    <p>账单编号：{this.state.recordBillData.orderNum}</p>
                    <p>机构名称：{this.state.recordBillData.orgName}</p>
                    <p>截止日期：{this.state.recordBillData.settleEndDate}</p>
                    <p>出帐日期：{this.state.recordBillData.createTime}</p>
                    <p>订单金额：￥ {this.state.recordBillData.totalSum}</p>
                    <p>平台分佣： ￥ {this.state.recordBillData.serviceFees}</p>
                    <p>退款金额： ￥ {this.state.recordBillData.serviceFees}</p>
                    <p>退还佣金： ￥ {this.state.recordBillData.serviceFees}</p>
                    <p>额外服务费： ￥ {this.state.recordBillData.serviceFees}</p>
                    <p>转帐手续费： ￥ {this.state.recordBillData.transferFee}</p>
                    <p>结算金额： ￥ {this.state.recordBillData.settleSum}</p>
                    <p>结算金额： ￥ {this.state.recordBillData.settleSum}</p>
                    <p>结算状态： {this.state.recordBillData.billStatus}</p>
                    <p>收款银行开户名： {this.state.recordBillData.transferTime}</p>
                    <p>银行卡号： {this.state.recordBillData.remark}</p>
                    <p>开户行名称： {this.state.recordBillData.remark}</p>
                    <p>开户行所在地： {this.state.recordBillData.remark}</p>
                    <div style={{height: "1px", background: "#CCCCCC"}}></div>                  
                </header>
                <header className="clearfix" style={{background: "#FFF", padding: "24px 24px 0"}}>
                    {/*订单类型tab栏*/}
                    <Tabs defaultActiveKey={this.state.keyword.type} onChange={this.setType}>
                        <TabPane tab="订单列表" key="0"/>
                        <TabPane tab="退单列表" key="1"/>
                    </Tabs>
                    <div className="add-button">
                        {/*商品订单发货*/}
                        {/*<OrderDeliver setFlag={this.setFlag} type={this.state.keyword.type}
                                      toLoginPage={this.toLoginPage}/>*/}
                    </div>
                </header>
                {/*订单列表*/}
                <div className="table-box" style={{background: "#FFF", padding: "0 24px"}}>
                    <DataTable 
                                keyword={this.state.keyword}
                                opObj={this.state.opObj}
                                settleCode={this.state.recordBillData.orderNum}
                                opStatusReturn={this.state.opObjReturn.select}
                                flag_add={this.state.flag_add}
                                toLoginPage={this.toLoginPage}/>
                </div>
            </div>
        )
    }
}

export default Orders;