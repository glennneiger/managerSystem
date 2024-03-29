import React, {Component} from 'react';
import {
    Table,
    Input,
    Button,
    Modal,
    Form,
    Popconfirm,
    Checkbox,
    message,
    Row,
    Col,
    Spin,
    Tree,
    Icon,
} from 'antd';
import reqwest from 'reqwest';

const Search = Input.Search;
const {TextArea} = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TreeNode } = Tree;

//栅格设置
const formItemLayout_16 = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

// const gData = [
//     {
//         title: '总裁办',
//         key: '总裁办',
//         children: [
//             {
//                 title: '张晓明',
//                 key: '张晓明',
//                 children: [
//                     { title: '小孙', key: '小孙' },
//                     { title: '小孙', key: '小孙' },
//                     { title: '小孙', key: '小孙' },
//                 ],
//             }, 
//             {
//                 title: '小孙',
//                 key: '小孙',
//                 children: [
//                     { title: '小孙', key: '小孙' },
//                     { title: '小孙', key: '小孙' },
//                     { title: '小孙', key: '小孙' },
//                 ],
//             }, 
//             {
//                 title: '小孙',
//                 key: '小孙',
//             }
//       ],
//     }, 
//     {
//         title: '人事部',
//         key: '人事部',
//         children: [
//             { title: '张晓明', key: '张晓明' },
//             { title: '张明', key: '张明' },
//             { title: '张晓', key: '张晓' },
//         ],
//     }, 
//     {
//         title: '技术部',
//         key: '技术部',
//         children: [
//             { title: '张晓明', key: '张晓明' },
//             { title: '张明', key: '张明' },
//             { title: '张晓', key: '张晓' },
//         ],
//     }
// ];

// const dataList = [];
// const generateList = (data) => {
//     for (let i = 0; i < data.length; i++) {
//         const node = data[i];
//         const key = node.key;
//         dataList.push({ key, title: key });
//         if (node.children) {
//           generateList(node.children);
//         }
//     }
// };
// generateList(gData);

// const getParentKey = (key, tree) => {
//     let parentKey;
//     for (let i = 0; i < tree.length; i++) {
//         const node = tree[i];
//         if (node.children) {
//            if (node.children.some(item => item.key === key)) {
//                 parentKey = node.key;
//            } else if (getParentKey(key, node.children)) {
//                 parentKey = getParentKey(key, node.children);
//            }
//         }
//     }
//     return parentKey;
// };


//新增角色表单
const ItemAddForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, confirmLoading} = props;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="添加角色"
                width={600}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                <div className="role-add role-form">
                    <Form layout="vertical">
                        <FormItem className="roleName" {...formItemLayout_16} label="角色名称：">
                            {getFieldDecorator('roleName', {
                                rules: [{
                                    required: true,
                                    message: '角色名称不能为空'
                                }]
                            })(
                                <Input placeholder="请填写角色名称"/>
                            )}
                        </FormItem>
                        <FormItem className="remark" {...formItemLayout_16} label="角色描述：">
                            {getFieldDecorator('remark', {
                                rules: [{
                                    required: false,
                                    message: '角色描述'
                                }]
                            })(
                                <TextArea style={{resize: "none"}} placeholder="请填写角色描述" rows={5}/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
);

//新增角色组件
class ItemAdd extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({visible: true});
    };

    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
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
                url: '/admin/role/save',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    roleName: values.roleName,
                    remark: values.remark,
                    orgId: 0,
                    orgCode: null,
                    isSys: 0,
                    isDelete: 0,
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("角色添加成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                confirmLoading: false
                            });
                        });
                        this.props.setFlag()
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            this.props.toLoginPage();
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            })
        })
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <div style={{display: this.props.opStatus ? "block" : "none"}}>
                <Button type="primary" onClick={this.showModal}>添加</Button>
                <ItemAddForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    confirmLoading={this.state.confirmLoading}
                />
            </div>
        );
    }
}

//添加人员表单
const ItemAddMemberForm  = Form.create()(
    (props) => {
        const {visible, checkedKeys, onCancel, onCreate, confirmLoading, 
            // treeData, defaultCheckedKeys, dataList, onLoadData,
            gData, searchValue, expandedKeys, autoExpandParent, onChange, onExpand, memberList, menberListLen, clearAllMember, clearSingle, onSelect, onCheck} = props;
        
        // console.log(treeData);
        // 另外一种方式
        const renderTreeNodes = data => data.map((item) => {
            if (item.children) {
              return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                  {renderTreeNodes(item.children)}
                </TreeNode>
              );
            }
            return <TreeNode {...item} dataRef={item} />;
        });

        // console.log(gData);
        // 添加人员所有的列表
        const loop = data => data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : <span>{item.title}</span>;

            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });        

        // 已选用户列表
        const memberListOption = [];
        memberList.forEach((item, index) => {
            memberListOption.push(
                <li key={index}>
                    <div>{item.name}</div>
                    <div onClick={()=>clearSingle(index, item.name,  item.id, (item.name + ',' + item.id))}><Icon type="close" style={{textAlign:"right"}} /></div>                                    
                </li>
            );
        });
        
        console.log(checkedKeys);
        return (
            <Modal
                visible={visible}
                title="添加人员"
                width={600}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                {
                    <div className="role-edit role-form role-add-member">
                        <div className="left">
                            <div className="top">添加人员</div>
                            <div className="bottom">
                                <Search style={{ marginBottom: 8}} 
                                    placeholder="输入员工姓名" 
                                    onChange={onChange}
                                    />
                                <div style={{maxHeight: "300px", overflow: "auto"}}>
                                    <Tree
                                        checkedKeys={checkedKeys}
                                        onExpand={onExpand}
                                        expandedKeys={expandedKeys}
                                        autoExpandParent={autoExpandParent}
                                        onSelect={onSelect}
                                        onCheck={onCheck}
                                        checkable={true}
                                        >
                                        {loop(gData)}
                                    </Tree>
                                    {/*<Tree
                                        loadData={onLoadData}
                                        onExpand={onExpand}
                                        expandedKeys={expandedKeys}
                                        autoExpandParent={autoExpandParent}
                                        onSelect={onSelect}
                                        onCheck={onCheck}
                                        checkable={true}
                                        >
                                        {loop(gData)}
                                        {renderTreeNodes(treeData)}
                                    </Tree>*/}
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="top">
                                <div>已选（<span>{menberListLen}</span>）</div>
                                <div onClick={clearAllMember}>清空</div>
                            </div>
                            <ul className="bottom">
                                {memberListOption}
                            </ul>
                        </div>
                        {/* 穿梭框*/}
                        {/*<Transfer
                            dataSource={mockData}
                            showSearch
                            listStyle={{
                                width: 230,
                                height: 300,                                    
                            }}
                            filterOption={filterOption}
                            targetKeys={targetKeys}
                            onChange={handleChange}
                            onSearch={handleSearch}
                            render={item => item.title}
                          />*/}
                    </div>
                }
            </Modal>
        );
    }
);

//添加人员组件
class ItemAddMember extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            visible: false,
            // 初始详情信息
            data: {},
            confirmLoading: false,
            mockData: [],
            targetKeys: [],
            // 添加人员菜单项初始化
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            // 添加人员选择人员数组初始化
            memberList: [],
            // 已选人员数
            menberListLen: 0,
            // 添加人员所有id
            memberListId: [],
            // 选中的key
            checkedKeys: [],
            // 部门列表数据
            gData: [
                // {
                //     title: '总裁办',
                //     key: '总裁办',
                //     children: [
                //         {
                //             title: '张晓明1',
                //             key: '张晓明1',
                //             children: [
                //                 { title: '小孙6', key: '小孙6' },
                //                 { title: '小孙4', key: '小孙4' },
                //                 { title: '小孙5', key: '小孙5' },
                //             ],
                //         }, 
                //         {
                //             title: '小孙',
                //             key: '小孙11',
                //             children: [
                //                 { title: '小孙8', key: '小孙8' },
                //                 { title: '小孙1', key: '小孙1' },
                //                 { title: '小孙2', key: '小孙2' },
                //             ],
                //         }, 
                //         {
                //             title: '小孙',
                //             key: '小孙12',
                //         }
                //   ],
                // }, 
                // {
                //     title: '人事部',
                //     key: '人事部',
                //     children: [
                //         { title: '张晓明', key: '张晓明' },
                //         { title: '张明', key: '张明' },
                //         { title: '张晓', key: '张晓' },
                //     ],
                // }, 
                // {
                //     title: '技术部',
                //     key: '技术部',
                //     children: [
                //         { title: '张晓明', key: '张晓明' },
                //         { title: '张明', key: '张明' },
                //         { title: '张晓', key: '张晓' },
                //     ],
                // }
            ],
            dataList: [],
            treeData: [],
        };
    }   

    showModal = () => {
        // 获取部门列表
        this.getDepartmentList();
        // 
        this.generateList(this.state.gData);
        // 获取初始详情信息
        // this.getData();
        console.log(this.props.id);
        console.log(this.props.orgId);
        this.getMock();
        this.setState({
            visible: true,
        });
    };
    
    // 部门列表数据树型结构处理
    handleTree = (data) => {
        const tempResult = [];
        const result = [];
        
        let data01 = data.list;
        
        data01.forEach((item) => {
            const temp = {
                title: item.sysDepartment.name,
                key: item.sysDepartment.id, 
                id: item.sysDepartment.id,
                children: item.children,        
            };
            tempResult.push(temp)
        });
        console.log(tempResult)
        // let cityLists = tempResult.children;
        tempResult.forEach((item) => {
            // const fnFilter02 = (para) => {
            //     return para.parentId === item.id
            // };
            // let data02 = cityLists.filter(fnFilter02);
            if (item.children) {
                item.children.forEach((subItem) => {
                    const temp = {
                        key: subItem.id,
                        title: subItem.name,
                        id: subItem.id,
                    };
                    item.children = [];
                    item.children.push(temp)                
                });
                result.push(item)
            }
        });
        console.log(result);
        return result;
    };
    
    // 获取部门列表
    getDepartmentList = (departmentName) => {
        reqwest({
            url: '/sys/department/getDepartmentUser',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            // data: result,
            data: {
                name: departmentName,
                orgId: this.props.orgId,
                pageNum: 1,
                pageSize: 20,
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    confirmLoading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    const data = [];
                    json.data.forEach((item) => {
                        let subData = [];
                        console.log(item.userList)

                        if (item.children) {
                            item.children.forEach((subItem) => {
                                let thirdData = [];
                                console.log(4444444)
                                if (subItem.children) {
                                    console.log(555555)
                                    subItem.children.forEach((thirdItem) => {
                                        let fourthData = [];
                                        if (thirdItem.children) {
                                            console.log(66666)
                                            thirdItem.children.forEach((fourthItem) => {
                                                fourthData.push({
                                                    title: fourthItem.sysDepartment.name,
                                                    key: fourthItem.sysDepartment.id,
                                                    // key: fourthItem.sysDepartment.name + ',' + fourthItem.sysDepartment.id,
                                                })
                                            })
                                        } else {
                                            console.log(232323)
                                            if (thirdItem.userList) {
                                                console.log(56676767)
                                                thirdItem.userList.forEach((fifthItem) =>{
                                                    fourthData.push({
                                                        title: fifthItem.userName,
                                                        // key: fifthItem.id,
                                                        key: fifthItem.userName + ',' + fifthItem.id
                                                    })
                                                })
                                            }                                          
                                        }
                                        
                                        thirdData.push({
                                            title: thirdItem.sysDepartment.name,
                                            key: thirdItem.sysDepartment.id,
                                            // key: thirdItem.sysDepartment.name + ',' + thirdItem.sysDepartment.id,
                                            children: fourthData,
                                        })
                                    })
                                } else {
                                    if (subItem.userList) {
                                        subItem.userList.forEach((thirdCopyItem) => {
                                            thirdData.push({
                                                title: thirdCopyItem.userName,
                                                // key: thirdCopyItem.id,
                                                key: thirdCopyItem.userName + ',' + thirdCopyItem.id,
                                            })                                            
                                        })
                                    }
                                }
                                console.log(subItem.userList)
                                subData.push({
                                    title: subItem.sysDepartment.name,
                                    key: subItem.sysDepartment.id,
                                    // key: subItem.sysDepartment.name + ',' + subItem.sysDepartment.id,
                                    // value: subItem.name+ '/' + subItem.parentId + ',' + subItem.id,
                                    children: thirdData
                                })
                            })
                        } else {
                            if (item.userList) {
                                item.userList.forEach((subCopyItem) => {
                                    subData.push({
                                        title: subCopyItem.userName,
                                        // key: subCopyItem.id
                                        key: subCopyItem.userName + ',' + subCopyItem.id
                                    })
                                })
                            }
                        }                      
                        data.push({
                            title: item.sysDepartment.name,
                            key: item.sysDepartment.id,
                            // key: item.sysDepartment.name + ',' + item.sysDepartment.id,
                            children: subData
                        })
                    });
                    console.log(data);
                    this.setState({
                        // treeData: this.handleTree(json.data),
                        // gData: this.handleTree(json.data),
                        gData: data,
                    });
                    console.log(this.state.treeData)
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            confirmLoading: false
                        })
                    }
                }
            }
        })
    };
    
    // 异步加载 （暂时没用到）
    onLoadData = treeNode => {
        // reqwest({
        //     url: '/sys/department/list',
        //     type: 'json',
        //     method: 'get',
        //     headers: {
        //         Authorization: sessionStorage.token
        //     },
        //     data: {
        //         name: '',
        //         orgId: this.props.orgId,
        //         pageNum: 1,
        //         pageSize: 10,
        //     },
        //     error: (XMLHttpRequest) => {
        //         message.error("保存失败");
        //         this.setState({
        //             confirmLoading: false
        //         })
        //     },
        //     success: (json) => {
        //         if (json.result === 0) {
        //             console.log(json.data.list);
        //             this.setState({
        //                 // treeData: this.handleTree(json.data)
        //             });
        //             console.log(this.state.treeData)
        //         } else {
        //             if (json.code === 901) {
        //                 message.error("请先登录");
        //                 this.props.toLoginPage();
        //             } else if (json.code === 902) {
        //                 message.error("登录信息已过期，请重新登录");
        //                 this.props.toLoginPage();
        //             } else {
        //                 message.error(json.message);
        //                 this.setState({
        //                     confirmLoading: false
        //                 })
        //             }
        //         }
        //     }
        // })
        new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];
                treeNode.props.dataRef.children = this.state.treeData.children;
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 1000);
        })
    };
    
    // 
    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            this.state.dataList.push({ key, title: key });
            if (node.children) {
              this.generateList(node.children);
            }
        }
    };    
    
    // 获取父级Key
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
               if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
               } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
               }
            }
        }
        return parentKey;
    };

    // componentDidMount() {
    //     this.getMock();
    // };
    
    // 展开指定的父节点key
    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    };
    
    // 搜索查询
    onChange = (e) => {
        console.log(e.target);
        const value = e.target.value;
        console.log(value);
        // 按姓名模糊搜索部门
        this.getDepartmentList(value);

        const expandedKeys = this.state.dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.state.gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
    };

    // 多选点击复选框的时候执行
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        // 所选人员userName
        const userNamesTemp = [];
        //  所选人员userId
        const userIdsTemp = [];
        
        // 所有一级，二级id
        let allIds = [];

        // 选中的key（包括父级，自己，人员那一级）
        checkedKeys.forEach((item, index) => {
            let endIndex = item.indexOf(',');
            console.log(endIndex)
            if (endIndex !== -1) {
                let name = item.slice(0, endIndex);
                let id = item.slice(endIndex + 1);
                // 所选人员name
                // userNamesTemp.push(name);
                userNamesTemp.push({
                    name: name,
                    id: id
                })
                // 所选人员id
                userIdsTemp.push(Number(id));
            }
            if (endIndex === -1) {
                allIds.push(Number(item));
            }

            // 人员
            // let endddIndex = item.indexOf('*');
            // console.log(endddIndex);
            // let userName = item.slice(-1, endddIndex);
            // let userId = item.slice(endddIndex);
            // userNameTemp.push(userName);
            // userIdTemp.push(userId);
        })
        // 所选人员name
        console.log(userNamesTemp);
        // 所选人员id
        console.log(userIdsTemp);
        // 所有id
        console.log(allIds);
        // userId 去重
        console.log(userIdsTemp);
        let setUserIds = Array.from(new Set(userIdsTemp));
        console.log(setUserIds);
        
        // console.log(typeIdsTem);
        // const temp = setTypeIds.concat(typeIdsTem);
        // console.log(temp);

        console.log(allIds);
        // 合并人员和父级, 子级的id
        const temp = allIds.concat(userIdsTemp);
        console.log(temp)
        // 现在是只显示人员名字那一层，那一层有人员，显示那些人员名字
        this.setState({
            // 已选添加人员的name列表
            memberList: userNamesTemp,
            // 所有id（包括父级，子级，人员那一级）
            memberListAllIds: temp,
            // memberLlist: userNameTemp,
            // menberListLen: checkedKeys.length,
            // 已选人员数
            menberListLen: userNamesTemp.length,

            // 传给后台的已选人员id
            memberListId: userIdsTemp,
            // 选中的checkedKeys
            checkedKeys: checkedKeys,
        }, () => {
            console.log(this.state.memberList);
            // 传给后台的已选人员id
            console.log(this.state.memberListId);
            // 所有id（包括父级，子级, 人员那一级）
            console.log(this.state.memberListAllIds);
        })
    };

    // 单选
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        console.log(selectedKeys);        
    };
    
    // 清空所有 但是复选项框没有清除选项状态
    clearAllMember = () => {
        this.setState({
            // 已选添加人员的name列表
            memberList: [],
            // 传给后台的已选人员id
            memberListId: [],
            // 已选人员数
            menberListLen: 0,
            // 清空选中复选框的树节点
            checkedKeys: [],
        },()=> {
            // message.info("已清空");
            console.log(this.state.memberListId)
        })
    };
    
    // 清掉单个 但是复选项框没有清除选项状态（使用checkedKeys)
    clearSingle = (index, name, id, userName) => {
        console.log(index)
        console.log(userName)
        let memberListTemp = this.state.memberList;
        console.log(memberListTemp);
        
        let memberListTempId = this.state.memberListId;
        console.log(memberListTempId);

        // 已选成员人员name列表数组(删除当前点击name)
        console.log(userName)
        console.log(this.state.memberList)
        let userNameIndex = this.state.memberList.indexOf(userName)
        console.log(userNameIndex)
        let memberListTemp01 = []
        this.state.memberList.forEach((item) => {
            if (item.name !== name) {
                memberListTemp01.push(item)
            } 
        })               
        console.log(memberListTemp01);

        // 已选成员人员id (删除当前点击id)
        let memberListTempId01 = [];
        console.log(this.state.memberListId)
        
        this.state.memberListId.forEach((item) => {
            // 数据类型
            if (item !== Number(id)) {
                memberListTempId01.push(item);
            }
        })
        console.log(memberListTempId01);
        console.log(this.state.checkedKeys);
        // 清掉单个之后，没有清掉的选中状态keys       
        let defaultCheckedKeys = [];
        this.state.checkedKeys.forEach((item)=>{
            // let tempIndex = this.state.checkedKeys.indexOf(userName);
            console.log(item);
            console.log(userName);
            // 判断清除一个人员与选中人员进行比较，返回不等于清除的那个人员的所有人员名字
            if (item !== userName) {
                defaultCheckedKeys.push(item)
                // 清除一个添加人员的id 需要清除父级和子级id，当添加人员都被选了，默认父级和子级都选中
                let parentIndex = defaultCheckedKeys.indexOf(",")
                if (parentIndex === -1) {
                    defaultCheckedKeys = defaultCheckedKeys.splice(parentIndex, 1)
                }                
            }
        })
        console.log(memberListTemp);
        console.log(memberListTempId);
        console.log(defaultCheckedKeys);
        this.setState({
            // 已选人员name
            memberList: memberListTemp01,
            // 已选成员人员id
            memberListId: memberListTempId01,
            // 已选人员数
            menberListLen: memberListTemp01.length,
            // 选择人员数节点控件
            checkedKeys: defaultCheckedKeys,
            // defaultCheckedKeys: defaultCheckedKeys,
        },()=>{
            // message.info("已清除一个");
            if (!this.state.memberList.length) {
                this.setState({
                    // 已选添加人员的name列表
                    memberList: [],
                    // 传给后台的已选人员id
                    memberListId: [],
                    // 已选人员数
                    menberListLen: 0,
                    // 清空选中复选框的树节点
                    checkedKeys: [],
                })
            }
            console.log(this.state.memberList);
            console.log(this.state.memberListId);
            console.log(defaultCheckedKeys);
            console.log(this.state.checkedKeys);
        })
    };

    // 造伪数据（暂时没用到）
    getMock = () => {        
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
            const data = {
                key: i.toString(),
                title: `技术部${i + 1}`,
                description: `description of content${i + 1}`,
                chosen: Math.random() * 2 > 1,
            };
            if (data.chosen) {
                targetKeys.push(data.key);
            }
            mockData.push(data);
        }
        this.setState({ 
            mockData, 
            targetKeys,
            // visible: false,
            confirmLoading: false,
        });
    };

    // 过滤
    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1
    };    
    
    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        const itemList = ["roleName"];
        const result = {};
        itemList.forEach((item) => {
            if (values[item] !== initValues[item]) {
                result[item] = values[item];
            }
        });
        if (JSON.stringify(result) === "{}") {
            return false;
        } else {
            result.id = this.props.id;
            return result;
        }
    };
    
    // 取消
    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false,
            }, () => {
                this.setState({
                    data: {},
                    confirmLoading: false,
                    mockData: [],
                    targetKeys: [],
                    // 添加人员菜单项初始化
                    expandedKeys: [],
                    searchValue: '',
                    autoExpandParent: true,
                    // 添加人员选择人员数组初始化
                    memberList: [],
                    // 已选人员数
                    menberListLen: 0,
                    // 添加人员所有id
                    memberListId: [],
                    // 选中的key
                    checkedKeys: [],
                    // 部门列表数据
                    gData: [],
                    dataList: [],
                    treeData: [],
                });
            })
        };
        form.validateFields((err, values) => {
            const result = this.dataContrast(values);
            if (result) {
                confirm({
                    title: '确认放弃添加？',
                    content: "",
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        cancel();
                    }
                });
            } else {
                cancel();
            }
        })
    };
    
    // 添加人员按钮
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.setState({
                confirmLoading: true
            });
            console.log(this.state.memberListId);
            reqwest({
                url: '/admin/role/bindUserRole',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    // 添加人员所有id
                    userId: this.state.memberListId,
                    roleId: this.props.id,
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("添加人员成功");
                        this.setState({
                            visible: false,
                        }, () => {
                            this.setState({
                                data: {},
                                memberList: [],
                                memberListId: [],
                                menberListLen: 0,
                                confirmLoading: false
                            });
                        });
                        // 编辑成功，重新获取列表
                        this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            this.props.toLoginPage();
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            })
        })
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        console.log(this.state.checkedKeys);
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>添加人员</span>
                <ItemAddMemberForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onLoadData={this.onLoadData}
                    treeData={this.state.treeData}
                    checkedKeys={this.state.checkedKeys}
                    defaultCheckedKeys={this.state.defaultCheckedKeys}
                    data={this.state.data}
                    confirmLoading={this.state.confirmLoading}
                    onExpand={this.onExpand}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    expandedKeys={this.state.expandedKeys}
                    searchValue={this.state.searchValue}
                    autoExpandParent={this.state.autoExpandParent}
                    memberList={this.state.memberList}
                    menberListLen={this.state.menberListLen}
                    clearAllMember={this.clearAllMember}
                    clearSingle={this.clearSingle}
                    mockData={this.state.mockData}
                    gData={this.state.gData}
                    targetKeys={this.state.targetKeys}
                    getMock={this.getMock}
                    dataList={this.state.dataList}
                    getParentKey={this.getParentKey}

                    handleChange={this.handleChange}
                    handleSearch={this.handleSearch}
                    filterOption={this.filterOption}
                />
            </a>
        )
    }
}

//角色权限设置表单
const RoleAuthorityForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, menuList, menuListExist, setMenuListExist, confirmLoading} = props;

        // 一级菜单项点击处理函数
        const itemClick = (id, value) => {
            setMenuListExist(1, id, value)
        };
        // 二级菜单项点击处理函数
        const subItemClick = (id, value, parentId) => {
            setMenuListExist(2, id, value, parentId)
        };
        // 三级菜单项点击处理函数
        const thirdItemClick = (id, value, parentId, gParentId) => {
            setMenuListExist(3, id, value, parentId, gParentId)
        };

        // 四级菜单项点击处理函数
        const fourthItemClick = (id, value, parentId, gParentId, gfParentId) => {
            setMenuListExist(4, id, value, parentId, gParentId, gfParentId)
        };

        // 权限菜单选项列表生成
        const optionOfMenuList = [];
        menuList.forEach((item) => {
            // 遍历当前一级菜单下属二级菜单，生成二级菜单选项列表
            const tempSubItems = [];
            if (item.children) {
                item.children.forEach((childrenItem) => {
                    // 遍历当前二级菜单下属三级菜单，生成三级菜单选项列表
                    const tempThirdItems = [];
                    if (childrenItem.children) {
                        childrenItem.children.forEach((thirdItem) => {
                            const tempFourthItems = [];
                            if(thirdItem.children) {
                                thirdItem.children.forEach((fourthItem) => {
                                    tempFourthItems.push(
                                        <Col key={fourthItem.id}>
                                            <Checkbox value={fourthItem.id}
                                                      onClick={(event) => {
                                                          fourthItemClick(fourthItem.id, event.target.checked, fourthItem.parentId, fourthItem.gParentId, fourthItem.gfParentId)
                                                      }}>{fourthItem.name}</Checkbox>
                                        </Col>)
                                        })
                            }
                            // 三级菜单选项写入
                            tempThirdItems.push(
                                thirdItem.children ?
                                    <Row key={thirdItem.id}>
                                        <Col key={thirdItem.id}>
                                            <Checkbox value={thirdItem.id}
                                                      onClick={(event) => {
                                                          thirdItemClick(thirdItem.id, event.target.checked, thirdItem.parentId, thirdItem.gParentId, thirdItem.gfParentId)
                                                      }}>{thirdItem.name}</Checkbox>
                                        </Col>
                                        <div className={thirdItem.children ? "fourthItemBox" : ""}
                                            style={{display: thirdItem.children ? "block" : "none"}}>
                                            {tempFourthItems}
                                        </div>
                                    </Row>
                                    :
                                    <Row key={thirdItem.id} className="subfourthItemBox">
                                        <Col key={thirdItem.id}>
                                            <Checkbox value={thirdItem.id}
                                                      onClick={(event) => {
                                                          thirdItemClick(thirdItem.id, event.target.checked, thirdItem.parentId, thirdItem.gParentId, thirdItem.gfParentId)
                                                      }}>{thirdItem.name}</Checkbox>
                                        </Col>
                                    </Row>
                            )
                        })
                    }
                    // 二级菜单选项写入
                    tempSubItems.push(
                        <Row key={childrenItem.id}>
                            <div className="">
                                <Col key={childrenItem.id}>
                                    <Checkbox value={childrenItem.id}
                                              onClick={(event) => {
                                                  subItemClick(childrenItem.id, event.target.checked, childrenItem.parentId)
                                              }}>{childrenItem.name}</Checkbox>
                                </Col>
                            </div>
                            <div className="thirdItemBox">
                                {tempThirdItems}
                            </div>
                        </Row>)
                })
            }
            // 一级菜单选项写入
            optionOfMenuList.push(
                <Row key={item.id}>
                    <div className="itemBox">
                        <Col key={item.id}>
                            <Checkbox value={item.id}
                                      onClick={(event) => {
                                          itemClick(item.id, event.target.checked)
                                      }}>{item.name}</Checkbox>
                        </Col>
                    </div>
                    <div className="subItemBox">
                        {tempSubItems}
                    </div>
                </Row>
            )
        });

        return (
            <Modal
                visible={visible}
                title="权限设置"
                width={1000}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                {
                    (menuList.length === 0 || menuListExist.length === "") ?
                        <div className="spin-box">
                            <Spin/>
                        </div>
                        :
                        <div className="role-authority">
                            <Form layout="vertical">
                                <FormItem className="roleMenuList" label="角色权限：">
                                    <Checkbox.Group style={{width: '100%'}} value={menuListExist}>
                                        {optionOfMenuList}
                                    </Checkbox.Group>
                                </FormItem>
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//角色权限设置组件
class RoleAuthority extends Component {
    state = {
        visible: false,
        // 可用权限菜单列表，即当前登录人权限菜单列表
        menuList: [],
        // 该岗位权限菜单列表
        menuListExist: [],
        // 该岗位初始权限菜单列表
        menuListExistInit: [],
        confirmLoading: false
    };

    // 权限菜单列表处理函数
    dataHandle = (data) => {
        // 列表中过滤掉status为true的项，得到有效的权限菜单列表
        const dataEffective = (para) => {
            return para.status === false
        };
        console.log(data)
        // 有效的权限菜单列表
        data = data.filter(dataEffective);
        console.log(data)
        // 一级菜单列表
        const tempResult = [];
        // 所需权限菜单列表
        const result = [];
        // 获取一级菜单列表（parentId为0的项）；
        const fnFilter = (para) => {
            return para.parentId === 0
        };
        console.log(data);
        data.filter(fnFilter).forEach((item) => {
            let temp = {
                id: item.id,
                name: item.name,
                url: item.url,
            };
            tempResult.push(temp)
        });
        console.log(tempResult)
        console.log(tempResult);
        // 遍历一级菜单，生成所需要的权限菜单列表
        tempResult.forEach((item) => {
            // 获取当前一级菜单下属二级菜单列表，写入children属性
            const fnFilter_ = (para) => {
                return para.parentId === item.id
            };
            if (data.filter(fnFilter_).length) {
                item.children = [];
                // 遍历二级菜单列表
                data.filter(fnFilter_).forEach((subItem) => {
                    // 获取当前二级菜单下属三级菜单列表，写入children属性
                    const fnFilter__ = (para) => {
                        return para.parentId === subItem.id
                    };
                    if (data.filter(fnFilter__).length) {
                        subItem.children = [];
                        // 遍历三级菜单列表
                        data.filter(fnFilter__).forEach((thirdItem) => {
                            // 获取当前三级菜单下属四级菜单，写入children属性
                            const fnFilter___ = (para) => {
                                return para.parentId === thirdItem.id
                            }
                            if (data.filter(fnFilter___).length) {
                                thirdItem.children = [];
                                // 遍历四级菜单列表
                                data.filter(fnFilter___).forEach((fourthItem) => {
                                    // 当前四级菜单信息对象生成
                                    let fourthData = {
                                        id: fourthItem.id,
                                        name: fourthItem.name,
                                        url: fourthItem.url,
                                        parentId: thirdItem.id,
                                        gParentId: subItem.id,
                                        gfParentId: item.id,
                                    }
                                    thirdItem.children.push(fourthData);
                                })
                            }

                            // 
                            // 当前三级菜单信息对象生成
                            let thirdData = {
                                id: thirdItem.id,
                                name: thirdItem.name,
                                url: thirdItem.url,
                                parentId: subItem.id,
                                gParentId: item.id,
                                children: thirdItem.children,
                            };
                            // 写入所属二级菜单children属性
                            subItem.children.push(thirdData)
                        })
                    }
                    // 当前二级菜单信息对象生成
                    let temp = {
                        id: subItem.id,
                        name: subItem.name,
                        url: subItem.url,
                        parentId: item.id,
                        children: subItem.children
                    };
                    // 写入所属一级菜单children属性
                    item.children.push(temp)
                });
            }
            // 写入result
            result.push(item)
        });
        console.log(555);
        console.log(result);
        return result
    };

    // 获取可用权限菜单列表
    getMenuList = () => {
        reqwest({
            // url: '/menu/getSysMenuByUserId', 
            url: '/admin/user/getMenuListByUserId',
            type: 'json',
            method: 'get',
            data: {
                // id: this.props.id
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: [
                //         {id: 111, name: "xx", parentId: 0, url: "/index/xx", status: true},
                //         {id: 1, name: "APP首页", parentId: 0, url: "/index/app-home", status: false},
                //         {id: 2, name: "科目管理", parentId: 1, url: "/index/app-home/subjects", status: false},
                //         {id: 28, name: "新增", parentId: 2, url: "/index/app-home/subjects", status: false},
                //         {id: 29, name: "修改", parentId: 2, url: "/index/app-home/subjects", status: false},
                //         {id: 30, name: "删除", parentId: 2, url: "/index/app-home/subjects", status: false},
                //         {id: 31, name: "查询", parentId: 2, url: "/index/app-home/subjects", status: false},
                //         {id: 3, name: "众筹名师讲堂", parentId: 1, url: "/index/app-home/crowdFunding", status: false},
                //         {id: 4, name: "推荐课程", parentId: 1, url: "/index/app-home/recommend-courses", status: false},
                //         {id: 5, name: "视频课程", parentId: 1, url: "/index/app-home/video-courses", status: false},
                //         {id: 6, name: "用户管理", parentId: 0, url: "/index/user-manage", status: false},
                //         {id: 7, name: "所有用户", parentId: 6, url: "/index/user-manage/users", status: false},
                //         {id: 8, name: "机构管理", parentId: 0, url: "/index/institution-manage", status: false},
                //         {
                //             id: 9,
                //             name: "所有机构",
                //             parentId: 8,
                //             url: "/index/institution-manage/institutions",
                //             status: false
                //         },
                //         {id: 10, name: "老师管理", parentId: 8, url: "/index/institution-manage/teachers", status: false},
                //         {id: 11, name: "课程管理", parentId: 8, url: "/index/institution-manage/courses", status: false},
                //         {id: 12, name: "资讯管理", parentId: 0, url: "/index/information-manage", status: false},
                //         {
                //             id: 13,
                //             name: "资讯列表",
                //             parentId: 12,
                //             url: "/index/information-manage/information",
                //             status: false
                //         },
                //         {
                //             id: 14,
                //             name: "资讯频道",
                //             parentId: 12,
                //             url: "/index/information-manage/information-channel",
                //             status: false
                //         },
                //         {id: 15, name: "商城管理", parentId: 0, url: "/index/mall-manage", status: false},
                //         {id: 16, name: "订单管理", parentId: 15, url: "/index/mall-manage/orders", status: false},
                //         {id: 17, name: "发货管理", parentId: 15, url: "/index/mall-manage/delivery", status: false},
                //         {id: 18, name: "商品管理", parentId: 15, url: "/index/mall-manage/goods", status: false},
                //         {id: 19, name: "财务管理", parentId: 0, url: "/index/financial-manage", status: false},
                //         {id: 20, name: "我的财务", parentId: 19, url: "/index/financial-manage/finance", status: false},
                //         {
                //             id: 21,
                //             name: "应收账款",
                //             parentId: 19,
                //             url: "/index/financial-manage/accounts-receivable",
                //             status: false
                //         },
                //         {id: 22, name: "银行卡", parentId: 19, url: "/index/financial-manage/bankcards", status: false},
                //         {id: 23, name: "账号管理", parentId: 0, url: "/index/backUser-manage", status: false},
                //         {id: 24, name: "所有账号", parentId: 23, url: "/index/backUser-manage/backUsers", status: false},
                //         {id: 25, name: "岗位管理", parentId: 23, url: "/index/backUser-manage/roles", status: false},
                //         {id: 26, name: "系统菜单", parentId: 0, url: "/index/menu-manage", status: false},
                //         {id: 27, name: "菜单管理", parentId: 26, url: "/index/menu-manage/menus", status: false}
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    console.log(json.data)
                    console.log(JSON.parse(sessionStorage.menuListData));
                    this.setState({
                        // 对原始权限菜单列表进行处理后写入
                        // menuList: this.dataHandle(JSON.parse(sessionStorage.menuListData)),
                        menuList: this.dataHandle(json.data),
                        // menuList: JSON.parse(sessionStorage.menuListOne),
                    })
                    console.log(this.state.menuList);
                } else {
                    message.error(json.message);
                }
            }
        })
    };

    // 获取该岗位当前权限菜单列表
    getMenuListExist = () => {
        reqwest({
            url: '/admin/role/getInfoByRoleId',
            type: 'json',
            method: 'get',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: this.props.id
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data:[
                //         {id: 1},
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    let data=[];
                    if (json.data) {
                        json.data.forEach((item) => {
                            data.push(item.id);
                        });
                        // 排序
                        data.sort((a, b) => {
                            return a - b
                        });
                        // 该处需进行对象深拷贝，防止menuListExistInit数据篡改
                        this.setState({
                            menuListExist: JSON.parse(JSON.stringify(data)),
                            menuListExistInit: JSON.parse(JSON.stringify(data))
                        });
                    }                   
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                    }
                }
            }
        })
    };

    // 权限菜单变更处理函数（无三级菜单项处理，已废弃）
    setMenuListExist__ = (type, id, value, parentId) => {
        if (type === 1) {
            let target = this.state.menuList.filter(item => id === item.id)[0];
            if (value) {
                let tempArr = this.state.menuListExist;
                tempArr.push(id);
                target.children.forEach((item) => {
                    tempArr.push(item.id)
                });
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                let tempArr = this.state.menuListExist;
                tempArr.splice(tempArr.indexOf(id), 1);
                target.children.forEach((item) => {
                    const index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        tempArr.splice(index, 1);
                    }
                });
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
        if (type === 2) {
            if (value) {
                let tempArr = this.state.menuListExist;
                if (tempArr.indexOf(parentId) === -1) {
                    tempArr.push(parentId);
                }
                tempArr.push(id);
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                let tempArr = this.state.menuListExist;
                tempArr.splice(tempArr.indexOf(id), 1);
                let target = this.state.menuList.filter(item => parentId === item.id)[0];
                let flag = false;
                target.children.forEach((item) => {
                    let index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        flag = true
                    }
                });
                if (!flag) {
                    tempArr.splice(tempArr.indexOf(parentId), 1);
                }
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
    };

    // 权限菜单变更处理函数
    setMenuListExist = (type, id, value, parentId, gParentId, gfParentId) => {
        // type：操作菜单级别标识；id：操作菜单id；value：操作菜单选择框当前状态；parentId：操作菜单父菜单id；gParentId：操作菜单父菜单的父菜单Id
        // 已选中菜单Id列表
        const tempArr = this.state.menuListExist;
        // 一级菜单变更处理
        if (type === 1) {
            // type, id, value
            // 获取当前操作菜单对象
            let target = this.state.menuList.filter(item => id === item.id)[0];
            if (value) {
                // 选中分支
                // 选中一级菜单项，则默认选中其下属所有二、三级菜单项
                // 一级菜单id写入
                tempArr.push(id);
                target.children.forEach((item) => {
                    // 二级菜单id写入
                    tempArr.push(item.id);
                    if (item.children) {
                        item.children.forEach((subItem) => {
                            // 三级菜单id写入
                            tempArr.push(subItem.id);
                            if (subItem.children) {
                                subItem.children.forEach((thirdItem) => {
                                    // 四级菜单id写入
                                    tempArr.push(thirdItem.id);
                                })
                            }
                        });
                    }
                });
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                // 取消选中分支
                // 取消选中一级菜单项，则默认取消选中其下属所有二、三级菜单项
                // 一级菜单id删除
                tempArr.splice(tempArr.indexOf(id), 1);
                target.children.forEach((item) => {
                    const index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        // 二级菜单id存在则删除
                        tempArr.splice(index, 1);
                        if (item.children) {
                            item.children.forEach((subItem) => {
                                const subIndex = tempArr.indexOf(subItem.id);
                                if (subIndex !== -1) {
                                    // 三级菜单id存在则删除
                                    tempArr.splice(subIndex, 1);

                                    if (subItem.children) {
                                        subItem.children.forEach((thirdItem) => {
                                            const thirdIndex = tempArr.indexOf(thirdItem.id)
                                            if (thirdIndex !== -1) {
                                                // 四级菜单id存在则删除
                                                tempArr.splice(thirdIndex, 1)
                                            }
                                        })
                                    }

                                }
                            });
                        }
                    }
                });
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
        // 二级菜单变更处理
        if (type === 2) {
            // type, id, value，parentId
            // 获取当前操作菜单所属一级菜单对象
            let parentTarget = this.state.menuList.filter(item => parentId === item.id)[0];
            // 获取当前操作菜单对象
            let target = parentTarget.children.filter(item => id === item.id)[0];
            if (value) {
                // 选中分支
                // 选中二级菜单项，则默认选中其所属一级菜单项及其下属所有三级、四级菜单项
                // 一级菜单为未选择状态，则id写入
                if (tempArr.indexOf(parentId) === -1) {
                    tempArr.push(parentId);
                }
                // 二级菜单id写入
                tempArr.push(id);
                if (target.children) {
                    target.children.forEach((item) => {
                        // 三级菜单id写入
                        tempArr.push(item.id)
                        if (item.children) {
                            item.children.forEach((subItem) => {
                                // 四级菜单id写入
                                tempArr.push(subItem.id)
                            })
                            
                        }
                    });
                }
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                // 取消选中分支
                // 取消选中二级菜单项，则默认取消选中其下属所有三级菜单项；若该二级菜单项已经是其一级菜单下属二级菜单中唯一一个选中项，则取消选中此二级菜单项的同时需取消选中其一级菜单项
                // 二级菜单id删除
                tempArr.splice(tempArr.indexOf(id), 1);
                // 所属一级菜单项是否取消选中判断
                let flag = false;
                parentTarget.children.forEach((item) => {
                    let index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        // 有选中项，flag设为true
                        flag = true
                    }
                });
                if (!flag) {
                    // flag为false表明所属一级菜单下属二级菜单均未选中，则取消选中该一级菜单
                    tempArr.splice(tempArr.indexOf(parentId), 1);
                }
                // 下属三、四级菜单取消选中
                if (target.children) {
                    target.children.forEach((item) => {
                        const index = tempArr.indexOf(item.id);
                        if (index !== -1) {
                            // 三级菜单id存在则删除
                            tempArr.splice(index, 1);
                            // 下属四级级菜单取消选中
                            if (item.children) {
                                item.children.forEach((subItem) => {
                                    const subIndex = tempArr.indexOf(subItem.id);
                                    if (subIndex !== -1) {
                                        // 四级菜单id存在则删除
                                        tempArr.splice(subIndex, 1);
                                    }
                                })
                            }
                        }
                    });
                }
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
        // 三级菜单变更处理
        if (type === 3) {
            // type, id, value，parentId
            // // 获取当前操作菜单所属一级菜单对象
            // let targetarget01 = this.state.menuList.filter(item => gParentId === item.id)[0];
            // // 获取当前操作菜单所属二级菜单对象
            // let parentTarget = parentTarget01.filter(item => parentId === item.id)[0];

            // 获取当前操作菜单所属一级菜单对象
            let target02 = this.state.menuList.filter(item => gParentId === item.id)[0];
            // 获取当前操作菜单所属二级菜单对象
            let target01 = target02.children.filter(item => parentId === item.id)[0];
            // 获取当前操作菜单对象
            let target = target01.children.filter(item => id === item.id)[0];
            if (value) {
                // 选中分支
                // 选中三级菜单项，则默认选中其所属一、二级菜单项及其下属所有四级菜单项
                // 一级菜单为未选择状态，则id写入
                if (tempArr.indexOf(gParentId) === -1) {
                    tempArr.push(gParentId);
                }
                // 二级菜单为未选择状态，则id写入
                if (tempArr.indexOf(parentId) === -1) {
                    tempArr.push(parentId);
                }
                // 三级菜单id写入
                tempArr.push(id);
                if (target.children) {
                    target.children.forEach((item) => {
                        // 四级菜单id写入
                        tempArr.push(item.id)
                    });
                }
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                // 取消选中分支
                tempArr.splice(tempArr.indexOf(id), 1);
                // // 获取当前操作菜单所属一级菜单对象
                // let target02 = this.state.menuList.filter(item => gParentId === item.id)[0];
                // // 获取当前操作菜单所属二级菜单对象
                // let target01 = target02.children.filter(item => parentId === item.id)[0];
                
                // 所属一级菜单项是否取消选中判断
                // let flag = false;
                // target02.children.forEach((item) => {
                //     let index = tempArr.indexOf(item.id);
                //     if (index !== -1) {
                //         // 有选中项，flag设为true
                //         flag = true
                //     }
                // });
                // if (!flag) {
                //     // flag为false表明所属一级菜单下属二级菜单均未选中，则取消选中该一级菜单
                //     tempArr.splice(tempArr.indexOf(parentId), 1);
                // }


                // 所属二级菜单项是否取消选中判断
                let flag01 = false;
                target01.children.forEach((item) => {
                    let index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        flag01 = true
                    }
                });
                if (!flag01) {
                    // 二级菜单项取消选中
                    tempArr.splice(tempArr.indexOf(parentId), 1);
                    // 所属一级菜单项是否取消选中判断
                    let flag02 = false;
                    target02.children.forEach((item) => {
                        let index = tempArr.indexOf(item.id);
                        if (index !== -1) {
                            flag02 = true
                        }
                    });
                    if (!flag02) {
                        // 一级菜单项取消选中
                        tempArr.splice(tempArr.indexOf(gParentId), 1);
                    }
                }
                
                 // 下属四级菜单取消选中
                if (target.children) {
                    target.children.forEach((item) => {
                        const index = tempArr.indexOf(item.id);
                        if (index !== -1) {
                            // 四级菜单id存在则删除
                            tempArr.splice(index, 1);
                        }
                    });
                }
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
        // 四级菜单变更处理
        if (type === 4) {
            console.log(444)
            if (value) {
                // 选中分支
                // 选中四级菜单项，则默认选中其所属一、二、三级菜单项
                // 一级菜单为未选择状态，则id写入
                if (tempArr.indexOf(gfParentId) === -1) {
                    tempArr.push(gfParentId);
                }
                // 二级菜单为未选择状态，则id写入
                if (tempArr.indexOf(gParentId) === -1) {
                    tempArr.push(gParentId);
                }
                // 三级菜单为未选择状态，则id写入
                if (tempArr.indexOf(parentId) === -1) {
                    tempArr.push(parentId);
                }
                // 四级菜单id写入
                tempArr.push(id);
                this.setState({
                    menuListExist: tempArr
                })
            } else {
                // 取消选中分支
                tempArr.splice(tempArr.indexOf(id), 1);
                // 获取当前操作菜单所属一级菜单对象
                console.log(this.state.menuList);
                console.log(gfParentId);
                let target03 = this.state.menuList.filter(item => gfParentId === item.id)[0];
                // 获取当前操作菜单所属二级菜单对象
                console.log(target03);
                console.log(gParentId);
                let target02 = target03.children.filter(item => gParentId === item.id)[0];
                // 获取当前操作菜单所属三级菜单对象
                console.log(target02);
                let target01 = target02.children.filter(item => parentId === item.id)[0];

                // 注意三级菜单

                // 所属三级菜单项是否取消选中判断
                let flag01 = false;
                target01.children.forEach((item) => {
                    let index = tempArr.indexOf(item.id);
                    if (index !== -1) {
                        flag01 = true
                    }
                });
                if (!flag01) {
                    // 三级菜单项取消选中
                    tempArr.splice(tempArr.indexOf(parentId), 1);
                    // 所属二级菜单项是否取消选中判断
                    let flag02 = false;
                    target02.children.forEach((item) => {
                        let index = tempArr.indexOf(item.id);
                        if (index !== -1) {
                            flag02 = true
                        }
                    });
                    if (!flag02) {
                        // 二级菜单项取消选中
                        tempArr.splice(tempArr.indexOf(gParentId), 1);

                        let flag03 = false;
                        target03.children.forEach((item) => {
                            let index = tempArr.indexOf(item.id);
                            if (index !== -1) {
                                flag03 = true
                            }
                        });
                        if (!flag03) {
                            // 一级菜单项取消选中
                            tempArr.splice(tempArr.indexOf(gfParentId), 1);
                        }
                    }
                }
                this.setState({
                    menuListExist: tempArr
                })
            }
        }
    };

    showModal = () => {
        // 获取可用角色权限菜单列表
        this.getMenuList();
        // 获取该角色当前权限菜单列表
        this.getMenuListExist();
        this.setState({
            visible: true
        })
    };

    handleCancel = () => {
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    menuList: [],
                    menuListExist: [],
                    menuListExistInit: [],
                    confirmLoading: false
                });
            })
        };
        if (this.state.menuList.length === 0) {
            cancel();
            return;
        }
        // 排序
        let data = this.state.menuListExist;
        data.sort((a, b) => {
            return a - b
        });
        // 信息比对
        if (this.state.menuListExistInit.toString() === data.toString()) {
            cancel()
        } else {
            confirm({
                title: '确认放弃修改？',
                content: "",
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    cancel();
                }
            });
        }
    };

    handleCreate = () => {
        if (this.state.menuList.length === 0) {
            return;
        }
        // 排序
        let data = this.state.menuListExist;
        data.sort((a, b) => {
            return a - b
        });
        console.log(data);
        // 信息比对
        if (this.state.menuListExistInit.toString() === data.toString()) {
            message.error("暂无信息更改，无法提交");
            return;
        }
        console.log(this.state.menuListExist);
        this.setState({
            confirmLoading: true
        });
        console.log(this.state.menuListExist);
        reqwest({
            // url: '/role/saveJurisdiction',
            url: '/admin/role/updateJurisdiction',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                roleId: this.props.id,
                menuIds: this.state.menuListExist,
                // menuId: this.state.menuListExist.join(","),
                // menuIds: 2,
                // menuIds: 3,
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    confirmLoading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("角色权限设置成功");
                    this.setState({
                        visible: false
                    }, () => {
                        this.setState({
                            menuList: [],
                            menuListExist: [],
                            menuListExistInit: [],
                            confirmLoading: false
                        });
                    });
                    this.props.recapture()
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            confirmLoading: false
                        })
                    }
                }
            }
        })
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>权限设置</span>
                <RoleAuthorityForm
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    menuList={this.state.menuList}
                    menuListExist={this.state.menuListExist}
                    setMenuListExist={this.setMenuListExist}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        )
    }
}

//角色编辑表单
const ItemEditForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, data, confirmLoading} = props;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="角色编辑"
                width={600}
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
                        <div className="role-edit role-form">
                            <Form layout="vertical">
                                <FormItem className="roleName" {...formItemLayout_16} label="角色名称：">
                                    {getFieldDecorator('roleName', {
                                        initialValue: data.roleName,
                                        rules: [{
                                            required: true,
                                            message: '角色名称不能为空'
                                        }]
                                    })(
                                        <Input placeholder="请填写角色名称"/>
                                    )}
                                </FormItem>
                                <FormItem className="remark" {...formItemLayout_16} label="角色描述：">
                                    {getFieldDecorator('remark', {
                                        initialValue: data.remark,
                                        rules: [{
                                            required: false,
                                            message: '角色描述'
                                        }]
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="请填写角色描述" rows={5}/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//角色编辑组件
class ItemEdit extends Component {
    state = {
        visible: false,
        // 初始详情信息
        data: {},
        confirmLoading: false
    };

    getData = () => {
        reqwest({
            url: '/admin/role/getById',
            type: 'json',
            method: 'get',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: this.props.id,
            },
            error: (XMLHttpRequest) => {
                message.error("详情获取失败");
                // const json = {
                //     result: 0,
                //     data: {
                //         role: {
                //             id: 1,
                //             roleName: ""
                //         }
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        data: json.data
                    })
                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                    }
                }
            }
        })
    };

    showModal = () => {
        // 获取初始详情信息
        this.getData();
        this.setState({
            visible: true,
        })
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        const itemList = ["roleName", "remark"];
        const result = {};
        itemList.forEach((item) => {
            if (values[item] !== initValues[item]) {
                result[item] = values[item];
            }
        });
        if (JSON.stringify(result) === "{}") {
            return false;
        } else {
            result.id = this.props.id;
            result.orgId = this.state.data.orgId;
            result.orgCode = this.state.data.orgCode;
            result.isSys = this.state.data.isSys;
            result.isDelete = this.state.data.delete;
            return result;
        }
    };

    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false,
            }, () => {
                this.setState({
                    data: {},
                    confirmLoading: false
                });
            })
        };
        form.validateFields((err, values) => {
            const result = this.dataContrast(values);
            if (result) {
                confirm({
                    title: '确认放弃修改？',
                    content: "",
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        cancel();
                    }
                });
            } else {
                cancel();
            }
        })
    };

    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const result = this.dataContrast(values);
            if (!result) {
                message.error("暂无信息更改，无法提交");
                return;
            }
            console.log(result);
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/admin/role/update',
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
                        message.success("角色信息编辑成功");
                        this.setState({
                            visible: false,
                        }, () => {
                            this.setState({
                                data: {},
                                confirmLoading: false
                            });
                        });
                        // 编辑成功，重新获取列表
                        this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            this.props.toLoginPage();
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                }
            })
        })
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>编辑</span>
                <ItemEditForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={this.state.data}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        )
    }
}

//成员名单表单
const NumDetailForm = Form.create()(
    (props) => {
        const {visible, onCancel, confirmLoading, loading, data, columns, pagination} = props;
        // const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="部门成员"
                width={600}
                onCancel={onCancel}
                // onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
                footer={null}
            >
                <div className="table-box">                    
                    <Table bordered
                      loading={loading}
                      dataSource={data}
                      pagination={pagination}
                      columns={columns}/>
                </div>
            </Modal>
        );
    }
);

//成员名单组件
class NumDetail extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        loading: false,
        data: [],
        pagination: {
            current: 1,
            pageSize: Number(localStorage.institutionPageSize) || 10,
            pageSizeOptions: ["5", "10", "15", "20"],
            showQuickJumper: true,
            showSizeChanger: true
        }
    };
                     
    columns = [
            {
                title: '姓名',
                dataIndex: 'username',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'username'),
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                width: '20%',
                render: (text, record) => this.renderColumns(text, record, 'phone'),
            },
            {
                title: '部门',
                dataIndex: 'departmentName',
                render: (text, record) => this.renderColumns(text, record, 'departmentName'),                
            },
        ];

    //列渲染
    renderColumns(text) {
        return (
            <Cell value={text}/>
        );
    }

    showModal = () => {
        this.setState({visible: true});
        this.getDataMemberList();
    };

    getDataMemberList = () => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/admin/user/list',
            type: 'json',
            method: 'get',
            data: {
                roleId: this.props.id,
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    // const memberList = [];
                    // json.data.userList.forEach((item, index) => {
                    //     memberList.push({
                    //         id: item.id,
                    //         userId: item.userId,
                    //         departmentId: item.departmentId,
                    //         userName: item.userName,
                    //         // phone: item.phone || "暂无",
                    //         departmentName: item.departmentName
                    //     })
                    // })
                    this.setState({
                        data: json.data.list,
                        loading: false,
                        pagination: {
                            total: json.data.total,
                            current: this.state.pagination.current,
                            pageSize: this.state.pagination.pageSize
                        }
                    })

                } else {
                    if (json.code === 901) {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === 902) {
                        message.error("登录信息已过期，请重新登录");
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

    handleCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.setState({
                confirmLoading: false,
                loading: false,
            });
        })       
    };

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
                url: '/menu/saveSysMenu',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    name: values.name,
                    parentId: this.props.id,
                    url: values.url,
                    type: 1
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("子部门添加成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                confirmLoading: false
                            });
                        });
                        this.props.recapture();
                    } else {
                        if (json.code === 901) {
                            message.error("请先登录");
                            this.props.toLoginPage();
                        } else if (json.code === 902) {
                            message.error("登录信息已过期，请重新登录");
                            this.props.toLoginPage();
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
            <a>
                <span onClick={() => this.showModal()}>{this.props.num}</span>
                <NumDetailForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    // onCreate={this.handleCreate}
                    confirmLoading={this.state.confirmLoading}
                    loading={this.state.loading}
                    data={this.state.data}
                    columns={this.columns}
                    pagination={this.pagination}
                />
            </a>
        );
    }
}

//角色列表
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            pagination: {
                current: 1,
                pageSize: Number(localStorage.roleSize) || 10,
                pageSizeOptions: ["5", "10", "15", "20"],
                showQuickJumper: true,
                showSizeChanger: true
            }
        };
        this.columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'index'),
            },
            {
                title: '角色名称',
                dataIndex: 'name',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'name'),
            },
            {
                title: '成员',
                dataIndex: 'roleNums',
                width: '15%',
                // render: (text, record) => this.renderColumns(text, record, 'roleNums'),
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            <NumDetail id={record.id} parentId={record.parentId} num={record.roleNums} recapture={this.getData}
                                        toLoginPage={this.props.toLoginPage}/>
                        </div>
                    )
                }
            },
            {
                title: '角色描述',
                dataIndex: 'remark',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'remark'),
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'updateTime'),
            },
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {/*添加人员*/}
                            <ItemAddMember 
                                id={record.id} 
                                roleId={record.roleId} 
                                orgId={record.orgId} 
                                recapture={this.getData} 
                                opStatus={this.props.opObj.bindUserRole}
                                toLoginPage={this.props.toLoginPage}/>                            
                            {/*设置权限*/}
                            <RoleAuthority 
                                id={record.id} 
                                recapture={this.getData} 
                                opStatus={this.props.opObj.updateJurisdiction}
                                toLoginPage={this.props.toLoginPage}/>
                            {/*编辑*/}
                            <ItemEdit 
                                id={record.id} 
                                recapture={this.getData} 
                                opStatus={this.props.opObj.modify}
                                toLoginPage={this.props.toLoginPage}/>
                            {/*删除*/}
                            <Popconfirm 
                                title="确认删除?"
                                placement="topRight"
                                onConfirm={() => this.itemDelete(record.id)}
                                onCancel=""
                                okType="danger"
                                okText="立即删除"
                                cancelText="取消">
                                <a style={{display: this.props.opObj.delete ? "inline" : "none"}}>删除</a>
                            </Popconfirm>
                        </div>
                    );
                },
            }
        ];
    };

    //列渲染
    renderColumns(text) {
        return (
            <Cell value={text}/>
        )
    };

    // 日期处理函数
    dateHandle = (para) => {
        const tempDate = new Date(para.replace("CST", "GMT+0800")),
            oMonthT = (tempDate.getMonth() + 1).toString(),
            oMonth = oMonthT.length <= 1 ? "0" + oMonthT : oMonthT,
            oDayT = tempDate.getDate().toString(),
            oDay = oDayT.length <= 1 ? "0" + oDayT : oDayT,
            oYear = tempDate.getFullYear().toString(),
            oTime = oYear + '-' + oMonth + '-' + oDay;
        return oTime;
    };

    dateHandle02 = (para) => {
        const add0 = (m) => {
            return m < 10 ? '0' + m : m;
        }
        //shijianchuo是整数，否则要parseInt转换
        const time = new Date(para),
            y = time.getFullYear(),
            m = time.getMonth()+1,
            d = time.getDate();
        return y + '-' + add0(m) + '-' + add0(d);
    };

    //获取本页信息
    getData = (keyword) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/admin/role/getRolePage',
            type: 'json',
            method: 'get',
            data: {
                roleName: keyword ? keyword.roleName : this.props.keyword.roleName,
                pageNum: this.state.pagination.current,
                pageSize: this.state.pagination.pageSize
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                message.error("获取失败");
                this.setState({
                    loading: false
                })
                // const json = {
                //     result: 0,
                //     data: {
                //         size: 2,
                //         list: [
                //             {
                //                 EId: null,
                //                 createTime: "",
                //                 createUserId: null,
                //                 delete: false,
                //                 id: null,
                //                 roleName: "",
                //                 updateTime: "",
                //             }
                //         ]
                //     }
                // };
            },
            success: (json) => {
                const data = [];
                if (json.result === 0) {
                    if (json.data) {
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
                            data.push({
                                key: index.toString(),
                                id: item.role.id,
                                index: index + 1,
                                name: item.role.roleName,
                                roleNums: item.userNum,
                                orgId: item.role.orgId,
                                remark: item.role.remark || "暂无",
                                // updateTime: item.updateTime ? this.dateHandle(item.updateTime) : "暂无",
                                updateTime: item.role.createTime ? this.dateHandle02(item.role.createTime) : "暂无",
                            })
                        })
                    }
                    this.setState({
                        loading: false,
                        data: data,
                        pagination: {
                            total: json.data.total,
                            current: this.state.pagination.current,
                            pageSize: this.state.pagination.pageSize
                        }
                    })
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
        })
    };

    //角色删除
    itemDelete = (para) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/admin/role/delete?id=' + para,
            type: 'json',
            method: 'delete',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("角色删除成功");
                    this.getData();
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
        })
    };

    //页码变化处理
    handleTableChange = (pagination) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        localStorage.roleSize = pagination.pageSize;
        pager.pageSize = Number(localStorage.roleSize);
        this.setState({
            pagination: pager
        }, () => {
            this.getData();
        })
    };

    componentWillMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.keyword !== this.props.keyword) {
            this.getData(nextProps.keyword);
        }
        if (nextProps.flag_add !== this.props.flag_add) {
            this.getData();
        }
    };

    render() {
        return <Table bordered
                      loading={this.state.loading}
                      dataSource={this.state.data}
                      pagination={this.state.pagination}
                      columns={this.columns}
                      onChange={this.handleTableChange}/>;
    }
}

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opObj: {},
            // 获取信息列表所需关键词
            keyword: {
                // 岗位名称
                roleName: ''
            },
            flag_add: false
        }
    };

    // 获取当前登录人对此菜单的操作权限
    setPower = () => {
        // 菜单信息为空则直接返回登陆页
        if (!sessionStorage.menuListOne) {
            this.toLoginPage();
            return
        }
        JSON.parse(sessionStorage.menuListOne).forEach((item) => {
            item.children.forEach((subItem) => {
                if (subItem.url === this.props.location.pathname) {
                    let data = {};
                    subItem.children.forEach((thirdItem) => {
                        data[thirdItem.url] = true;
                    })
                    this.setState({
                        opObj: data
                    })
                }
            })
        })
    };

    // 关键词写入
    setKeyword = (type, value) => {
        if (type === 1) {
            if (value !== this.state.keyword.roleName) {
                this.setState({
                    keyword: {
                        roleName: value,
                    }
                })
            }
        }
    };

    setFlag = () => {
        this.setState({
            flag_add: !this.state.flag_add
        })
    };

    // 登陆信息过期或不存在时的返回登陆页操作
    toLoginPage = () => {
        sessionStorage.clear();
        this.props.history.push('/')
    };

    componentWillMount() {
        this.setPower();
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

    render() {
        return (
            <div className="roles">
                {
                    this.state.opObj.select ?
                        <div>
                            <header className="clearfix">
                                <Search placeholder="请输入角色名称信息"
                                        onSearch={(value) => this.setKeyword(1, value)}
                                        enterButton
                                        style={{
                                            width: "320px",
                                            float: "left"
                                        }}
                                />
                                {/*岗位添加*/}
                                <div className="add-button" style={{float: "right"}}>
                                    <ItemAdd 
                                        opStatus={this.state.opObj.add} 
                                        setFlag={this.setFlag}
                                        toLoginPage={this.toLoginPage}/>
                                </div>
                            </header>
                            {/*岗位列表*/}
                            <div className="table-box">
                                <DataTable 
                                    opObj={this.state.opObj} 
                                    keyword={this.state.keyword}
                                    flag_add={this.state.flag_add} 
                                    toLoginPage={this.toLoginPage}/>
                            </div>
                        </div>
                        :
                        <p>暂无查询权限</p>
                }

            </div>
        )
    }
}

export default Roles;