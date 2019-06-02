import React, {Component} from 'react';
import {
    Table,
    Input,
    InputNumber,
    DatePicker,
    Button,
    Checkbox,
    Modal,
    Form,
    Select,
    Upload,
    Slider,
    Row,
    Col,
    Icon,
    message,
    List,
    Popconfirm,
    TreeSelect,
    Spin,
    Menu,
    Dropdown
} from 'antd';
import '../../config/config';
import reqwest from 'reqwest';
import AvatarEditor from 'react-avatar-editor'

const Search = Input.Search;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const confirm = Modal.confirm;

//栅格设置
const formItemLayout_8 = {
    labelCol: {span: 4},
    wrapperCol: {span: 8},
};
const formItemLayout_12 = {
    labelCol: {span: 4},
    wrapperCol: {span: 12},
};
const formItemLayout_14 = {
    labelCol: {span: 4},
    wrapperCol: {span: 14},
};

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

// 可编辑的单元格
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    state = {
        editing: false,
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    save = (e) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
        return (
        <td {...restProps}>
            {editable ? (
            <EditableContext.Consumer>
                {(form) => {
                    this.form = form;
                    return (
                        editing ? (
                        <FormItem style={{ margin: 0 }}>
                            {form.getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: false,
                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                    message: "只能输入数字",
                                }],
                                getValueFromEvent: (event) => {
                                    return event.target.value.replace(/\D/g, '')
                                },
                                initialValue: record[dataIndex],
                                })(
                                <Input style={{ textAlign: "center" }}
                                    ref={node => (this.input = node)}
                                    onPressEnter={this.save}
                                    onBlur={this.save}
                                />
                            )}
                        </FormItem>
                        ) : (
                        <div
                            className="editable-cell-value-wrap"
                            onClick={this.toggleEdit}
                        >
                            {restProps.children}
                        </div>
                        )
                    );
                }}
            </EditableContext.Consumer>
            ) : restProps.children}
        </td>
        );
    }
}

//新增教师表单
const ItemAddForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, data, subjectList, viewPic, effectPic, data_pic, setViewPic, picUpload, avatarEditor, setAvatarEditor, photoLoading, confirmLoading} = props;
        const {getFieldDecorator} = form;
        console.log(3333)
        // console.log(data);
        // console.log(data.gender)

        // 图片处理
        const getBase64 = (img, callback) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        const setEditorRef = (editor) => this.editor = editor;
        const dataURLtoFile = (url) => {
            let arr = url.split(','),
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: "image/jpeg" });
        };
        const beforeUpload = (file) => {
            const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isIMG) {
                message.error('文件类型错误');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('文件不能大于2M');
            }
            if (isIMG && isLt2M) {
                getBase64(file, (imageUrl) => {
                    setViewPic(imageUrl);
                });
            }
            return false
        };
        const uploadButton = (
            <div>
                <Icon type={'plus'}/>
                <div className="ant-upload-text" style={{display: viewPic ? "none" : "block"}}>选择图片</div>
            </div>
        );
        const picHandle = () => {
            if (viewPic) {
                const canvas = this.editor.getImage();
                const url = canvas.toDataURL("image/jpeg", 0.92);
                if (url === effectPic) {
                    message.error("图片未改动，无法提交");
                    return
                }
                const file = dataURLtoFile(url);
                picUpload(url, file)
            } else {
                message.error("图片未选择");
            }
        };

        // const recordSetting = {};
        // recordSetting.subjectOne = false;
        // recordSetting.subjectTwo = true;
        // recordSetting.subjectThree = false;
        // recordSetting.subjectFour = true;
        // recordSetting.subjectFive = false;
        // recordSetting.subjectSix = true;
        // recordSetting.subjectSeven = false;
        // recordSetting.subjectEight = true;

        // function toggle (value) {
        //     console.log(value);
        //     console.log(222);
        //     if(recordSetting[value]) {
        //         recordSetting[value] = false;
        //         console.log(333); 
        //     } else {
        //             console.log(444);
        //         recordSetting[value] = true; 
        //     }
        // };

        function multipleChoose (value) {
            console.log("checked: ", value);
        }

        const partImg = (
            <AvatarEditor
                ref={setEditorRef}
                image={viewPic}
                width={80}
                height={80}
                border={0}
                color={[255, 255, 255, 0.6]}
                scale={avatarEditor.scale}
                position={{x: avatarEditor.positionX, y: avatarEditor.positionY}}
                rotate={0}
            />
        );

        return (
            <Modal
                visible={visible}
                title="添加教师"
                width={1000}
                onCancel={onCancel}
                onOk={onCreate}
                destroyOnClose={true}
                confirmLoading={confirmLoading}
            >
                <div className="teacher-add teacher-form item-form">
                    <Form layout="vertical">
                        <h4 className="add-form-title-h4">基础信息</h4>
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem className="name" label="教师姓名：">
                                    {getFieldDecorator('name', {
                                        initialValue: data.name ? data.name : '',
                                        rules: [{
                                            required: true,
                                            message: '姓名不能为空',
                                        }],
                                    })(
                                        <Input placeholder="请输入教师姓名"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="nickName" label="昵称：">
                                    {getFieldDecorator('nickName', {
                                        initialValue: data.nickName ? data.nickName : '',
                                        rules: [{
                                            required: true,
                                            message: '昵称不能为空'
                                        }],
                                    })(
                                        <Input placeholder="请填写教师昵称"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="gender" label="性别：">
                                    {getFieldDecorator('gender', {
                                        initialValue: data.gender,
                                        rules: [{
                                            required: true,
                                            message: '性别不能为空'
                                        }],
                                    })(
                                        <Select placeholder="请选择教师性别">
                                            <Option value={0}>女</Option>
                                            <Option value={1}>男</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="experienceAge" label="教龄(年)：">
                                    {getFieldDecorator('experienceAge', {
                                        initialValue: data.experienceAge ? data.experienceAge : '',
                                        rules: [{
                                            required: true,
                                            message: '教龄不能为空',
                                        }],
                                    })(
                                        <InputNumber style={{width: "100%"}} min={0} precision={0} step={1}/>
                                    )}
                                </FormItem>
                               
                            </Col>
                            <Col span={8}>
                                <FormItem className="typeIds longItem" label="教学科目：">
                                    {getFieldDecorator('typeIds', {
                                        initialValue: data.typeIds ? data.typeIds : '',
                                        rules: [{
                                            required: true,
                                            message: '科目不能为空',
                                        }],
                                    })(
                                        <TreeSelect
                                            style={{}}
                                            placeholder="请选择教室所教科目（最多三项）"
                                            treeCheckable={true}
                                            treeData={subjectList}
                                            showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="phone unnecessary" label="联系电话：">
                                    {getFieldDecorator('phone', {
                                        initialValue: data.phone ? data.phone : '',
                                        rules: [{
                                            required: false
                                        }],
                                    })(
                                        <Input placeholder="请输入教师联系方式"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem className="photo" label="教师头像：">
                                    {getFieldDecorator('photo', {
                                        initialValue: viewPic,
                                        rules: [{
                                            required: true,
                                            message: '教师头像不能为空',
                                        }],
                                    })(
                                        <div className="itemBox">
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action="/file/upload"
                                                beforeUpload={beforeUpload}
                                            >
                                                {viewPic ? partImg : uploadButton}
                                            </Upload>
                                            <Row>
                                                <Col span={4}>缩放：</Col>
                                                <Col span={12}>
                                                    <Slider min={0.5} max={1.5} step={0.01} value={avatarEditor.scale}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(1, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={4}>X：</Col>
                                                <Col span={12}>
                                                    <Slider min={0} max={1} step={0.01} value={avatarEditor.positionX}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(2, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={4}>Y：</Col>
                                                <Col span={12}>
                                                    <Slider min={0} max={1} step={0.01} value={avatarEditor.positionY}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(3, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Button type="primary"
                                                    onClick={picHandle}
                                                    loading={photoLoading}
                                                    style={{
                                                        position: "absolute",
                                                        right: "-20px",
                                                        bottom: "0"
                                                    }}>{data_pic ? "重新提交" : "图片提交"}</Button>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                        <h4 className="add-form-title-h4">教师简介</h4>
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem className="name" label="主攻方向：">
                                    {getFieldDecorator('principal', {
                                        initialValue: data.principal ? data.principal : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '主攻方向不能为空',
                                            },
                                            {
                                                max: 40,
                                                message: "主攻方向不能大于40个字符"
                                            }
                                        ],
                                    })(
                                        <Input placeholder="请输入主攻方向"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="name" label="教学理念：">
                                    {getFieldDecorator('teachingIdea', {
                                        initialValue: data.teachingIdea ? data.teachingIdea : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '教学理念不能为空',
                                            },
                                            {
                                                max: 40,
                                                message: "主攻方向不能大于40个字符"
                                            }
                                        ],
                                    })(
                                        <Input placeholder="请输入教学理念"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem className="description longItem" label="个人经历：">
                            {getFieldDecorator('description', {
                                initialValue: data.description ? data.description : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '个人经历不能为空',
                                    },
                                    {
                                        max: 600,
                                        message: "个人经历不能大于300个字"
                                    }
                                ],
                            })(
                                <TextArea style={{resize: "none"}} placeholder="请填写个人经历" rows={10}/>
                            )}
                        </FormItem>
                        <h4 className="add-form-title-h4">主攻授课</h4>
                        <FormItem className="description longItem">
                            {getFieldDecorator('multipleChooseSubject', {
                                rules: [
                                    {
                                        required: true,
                                        message: '未选择主攻授课',
                                    }
                                ],
                            })(
                                <Checkbox.Group style={{ width: '100%' }} onChange={multipleChoose}>
                                    <Row gutter={8}>
                                        <Col span={3}>
                                            <Checkbox value="课程1">课程1</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectOne} onClick={toggle("subjectOne")}>课程1</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程2">课程2</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectTwo} onClick={toggle("subjectTwo")}>课程2</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程3">课程3</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectThree} onClick={toggle("subjectThree")}>课程3</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程4">课程4</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectFour} onClick={toggle("subjectFour")}>课程4</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程5">课程5</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectFive} onClick={toggle("subjectFive")}>课程5</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程6">课程6</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectSix} onClick={toggle("subjectSix")}>课程6</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程7">课程7</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectSeven} onClick={toggle("subjectSeven")}>课程7</Button> */}
                                        </Col>
                                        <Col span={3}>
                                            <Checkbox value="课程8">课程8</Checkbox>
                                            {/* <Button type="primary" ghost={recordSetting.subjectEight} onClick={toggle("subjectEight")}>课程8</Button> */}
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </FormItem>
                        
                    </Form>
                </div>
            </Modal>
        );
    }
);

//新增教师组件
class ItemAdd extends Component {
    state = {//
        visible: false,
        data: {},
        // 图片相关变量--------------------------------------
        // 初始图片
        viewPic: "",
        // 有效图片：图片提交成功时写入，用以与提交时canvas生成的图片编码进行比对，已确定图片是否有改动
        effectPic: "",
        // 保存待提交的图片
        data_pic: "",
        // 图片缩放比例及偏移量变量
        avatarEditor: {
            scale: 1,
            positionX: 0.5,
            positionY: 0.5
        },
        // 图片提交按钮状态变量
        photoLoading: false,
        // 科目列表
        subjectList: [],
        confirmLoading: false,
        // recordSetting: {
        //     subjectOne: false,
        //     subjectTwo: true,
        //     subjectThree: true,
        //     subjectFour: true,
        //     subjectFive: true,
        //     subjectSix: false,
        //     subjectSeven: true,
        //     subjectEight: true,
        // } 
    };

    // 多选课程设置
    // toggle = (value) => {
    //     console.log(value);
        // console.log(this.state.recordSetting);
        // console.log(this.state.recordSetting[value])
        // if (this.state.recordSetting[value]) {
        //     console.log(2);
        //     this.setState({
        //         recordSetting: !this.state.recordSetting[value],
        //     })
        // } else {
        //     console.log(3);
        //     // this.state.recordSetting[value] = true
        //     this.setState({
        //         recordSetting: !this.state.recordSetting[value],
        //     })
        // }
    // }

    // toggle = (value) => {
    //     console.log(value);
    //     console.log(222);
    //     const recordSetting1 = {};
    //         recordSetting1.subjectOne = this.state.recordSetting.subjectOneOne;
    //         recordSetting1.subjectTwo = this.state.recordSetting.subjectTwo;
    //         recordSetting1.subjectThree = this.state.recordSetting.subjectThree;
    //         recordSetting1.subjectFour = this.state.recordSetting.subjectFour;
    //         recordSetting1.subjectFive = this.state.recordSetting.subjectFive;
    //         recordSetting1.subjectSix = this.state.recordSetting.subjectSix;
    //         recordSetting1.subjectSeven = this.state.recordSetting.subjectSeven;
    //         recordSetting1.subjectEight = this.state.recordSetting.subjectEight;
    //     if(recordSetting1[value]) {
    //         recordSetting1[value] = false;
    //         console.log(333);
    //         this.setState({
    //             recordSetting: recordSetting1,
    //         })
    //     } else {
    //         console.log(444);
    //         recordSetting1[value] = true;
    //         this.setState({
    //             recordSetting: recordSetting1,
    //         })
    //     }
    // };

    showModal = (key) => {
        if (key === '1') {
            this.getDataTeacherId();
            console.log(555);
        } else {
            this.setState({
                data: {},
            })
        }
        this.getSubjectList();
        this.setState({visible: true});
    };

    // 根据teacherId获取最近教师信息
    getData = (teacherId) => {
        reqwest({
            url: '/teacher/getDetail',
            type: 'json',
            method: 'post',
            data: {
                id: teacherId
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                
            },
            success: (json) => {
                if (json.result === 0) {
                    const typeIds = [String(json.data.teacher.typeId)];
                    if (json.data.teacher.typeIdTwo) {
                        typeIds.push(String(json.data.teacher.typeIdTwo))
                    }
                    if (json.data.teacher.typeIdThree) {
                        typeIds.push(String(json.data.teacher.typeIdThree))
                    }
                    json.data.teacher.typeIds = typeIds;
                    json.data.teacher.typeIdTwo = json.data.teacher.typeIdTwo ? json.data.teacher.typeIdTwo : 0;
                    json.data.teacher.typeIdThree = json.data.teacher.typeIdThree ? json.data.teacher.typeIdThree : 0;
                    this.setState({
                        data: json.data.teacher,
                        viewPic: "http://image.taoerxue.com/" + json.data.teacher.photo,
                        effectPic: "http://image.taoerxue.com/" + json.data.teacher.photo,
                        data_pic: json.data.teacher.photo,
                    });
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //获取所有的teacherId
    getDataTeacherId = (keyword) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/searchTeacherList',
            type: 'json',
            method: 'post',
            data: {
                status: "",
                educationName: "",
                teacherName: "",
                startTime: "",
                endTime: "",
                pageNum: 1,
                pageSize: 10
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
                const dataTeachersId = [];
                if (json.result === 0) {
                    if (json.data.list.length === 0 && this.state.pagination.current !== 1) {
                        this.setState({
                            pagination: {
                                current: 1,
                                pageSize: 10
                            }
                        }, () => {
                            this.getDataTeacherId();
                        });
                        return
                    }
                    json.data.list.forEach((item, index) => {
                        dataTeachersId.push(item.id);
                    });
                    let teacherId = Math.max.apply(null, dataTeachersId);
                    this.getData(teacherId);
                    console.log(dataTeachersId);
                    console.log(teacherId);
                    this.setState({
                        loading: false,
                    });
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    // 获取科目列表
    getSubjectList = () => {
        reqwest({
            url: '/institution/getEducationTypeList',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: [
                //         {
                //             id: 1,
                //             name: "",
                //             list: [
                //                 {id: 11, name: ""},
                //             ]
                //         }
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    const data = [];
                    json.data.forEach((item) => {
                        let subData = [];
                        if (item.list.length) {
                            item.list.forEach((subItem) => {
                                subData.push({
                                    key: subItem.id,
                                    value: String(subItem.id),
                                    label: subItem.name
                                })
                            })
                        }
                        data.push({
                            key: item.id,
                            value: String(item.id),
                            label: item.name,
                            children: subData
                        })
                    });
                    this.setState({
                        subjectList: data
                    })
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
                        message.error("登录信息已过期，请重新登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                    }
                }
            }
        });
    };

    // 图片处理-----------------------------------
    // 初始图片写入
    setViewPic = (para) => {
        this.setState({
            viewPic: para
        })
    };
    // 设置图片缩放比例及偏移量
    setAvatarEditor = (index, value) => {
        // 设置缩放比例
        if (index === 1) {
            this.setState({
                avatarEditor: {
                    scale: value,
                    positionX: this.state.avatarEditor.positionX,
                    positionY: this.state.avatarEditor.positionY
                }
            })
        }
        // 设置X轴的偏移量
        if (index === 2) {
            this.setState({
                avatarEditor: {
                    scale: this.state.avatarEditor.scale,
                    positionX: value,
                    positionY: this.state.avatarEditor.positionY
                }
            })
        }
        // 设置Y轴的偏移量
        if (index === 3) {
            this.setState({
                avatarEditor: {
                    scale: this.state.avatarEditor.scale,
                    positionX: this.state.avatarEditor.positionX,
                    positionY: value
                }
            })
        }
    };
    // 图片上传
    picUpload = (para01, para02) => {
        // 文件对象写入formData
        const formData = new FormData();
        formData.append("file", para02);
        this.setState({
            photoLoading: true
        });
        reqwest({
            url: '/file/upload',
            type: 'json',
            method: 'post',
            processData: false,
            data: formData,
            error: (XMLHttpRequest) => {
                message.error("图片提交失败");
                this.setState({
                    photoLoading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("图片提交成功");
                    // 图片上传成功，effectPic与data_pic写入
                    this.setState({
                        effectPic: para01,
                        data_pic: json.data.url,
                        photoLoading: false
                    })
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
                        message.error("登录信息已过期，请重新登录");
                        this.props.toLoginPage();
                    } else {
                        message.error(json.message);
                        this.setState({
                            photoLoading: false
                        })
                    }
                }
            }
        });
    };

    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    viewPic: "",
                    effectPic: "",
                    data_pic: "",
                    objPic: "",
                    avatarEditor: {
                        scale: 1,
                        positionX: 0.5,
                        positionY: 0.5
                    },
                    photoLoading: false,
                    subjectList: [],
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
        console.log(55);
        const form = this.form;
        console.log(form);
        form.validateFields((err, values) => {
            console.log(values);
            if (err) {
                return;
            }
            if (values.typeIds.length > 3) {
                message.error("教学科目最多选三项");
                return;
            }
            if (!this.state.data_pic) {
                message.error("图片未提交");
                return
            }
            values.typeId = Number(values.typeIds[0]);
            values.typeIdTwo = Number(values.typeIds[1]) || 0;
            values.typeIdThree = Number(values.typeIds[2]) || 0;
            values.photo = this.state.data_pic;
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/teacher/saveTeacher',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    name: values.name,
                    nickName: values.nickName,
                    phone: values.phone,
                    photo: values.photo,
                    gender: values.gender,
                    experienceAge: values.experienceAge,
                    description: values.description,
                    typeId: values.typeId,
                    typeIdTwo: values.typeIdTwo,
                    typeIdThree: values.typeIdThree,
                    principal: values.principal,
                    teachingIdea: values.teachingIdea,
                    multipleChooseSubject: values.multipleChooseSubject,
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        confirmLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("教师添加成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                viewPic: "",
                                effectPic: "",
                                data_pic: "",
                                objPic: "",
                                avatarEditor: {
                                    scale: 1,
                                    positionX: 0.5,
                                    positionY: 0.5
                                },
                                photoLoading: false,
                                subjectList: [],
                                confirmLoading: false
                            });
                        });
                        this.props.setFlag()
                    } else {
                        if (json.code === "901") {
                            message.error("请先登录");
                            this.props.toLoginPage();
                        } else if (json.code === "902") {
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
        });
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    handleMenuClick = (e) => {
        if (e.key === '1') {
            this.showModal(e.key);
            console.log(444)
        }
        if (e.key === '2') {
            message.error("你还没添加课程，请先添加课程，正在返回，请稍后", 3);
        }
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key='1'>已添加教师时</Menu.Item>
                <Menu.Item key='2'>未添加教师时</Menu.Item>
            </Menu>
        );
        return (
            // <div style={{display: this.props.opStatus ? "block" : "none"}}>
            <div style={{display: "block"}}>
                <Dropdown overlay={menu} placement="bottomCenter">
                    <Button>复制教师</Button>
                </Dropdown>
                
                <Button type="primary" onClick={this.showModal} style={{marginLeft: 10}}>添加教师</Button>
                <ItemAddForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={this.state.data}
                    viewPic={this.state.viewPic}
                    effectPic={this.state.effectPic}
                    data_pic={this.state.data_pic}
                    setViewPic={this.setViewPic}
                    avatarEditor={this.state.avatarEditor}
                    setAvatarEditor={this.setAvatarEditor}
                    picUpload={this.picUpload}
                    photoLoading={this.state.photoLoading}
                    subjectList={this.state.subjectList}
                    confirmLoading={this.state.confirmLoading}
                    recordSetting={this.state.recordSetting}
                    toggle={this.toggle}
                />
            </div>
        );
    }
}

//教师信息编辑表单
const ItemEditForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, data, viewPic, effectPic, data_pic, setViewPic, picUpload, avatarEditor, setAvatarEditor, photoLoading, subjectList, confirmLoading} = props;
        const {getFieldDecorator} = form;

        // 图片处理
        const getBase64 = (img, callback) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        const setEditorRef = (editor) => this.editor = editor;
        const dataURLtoFile = (url) => {
            let arr = url.split(','),
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: "image/jpeg" });
        };
        const beforeUpload = (file) => {
            const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isIMG) {
                message.error('文件类型错误');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('文件不能大于2M');
            }
            if (isIMG && isLt2M) {
                getBase64(file, (imageUrl) => {
                    setViewPic(imageUrl);
                });
            }
            return false
        };
        const uploadButton = (
            <div>
                <Icon type={'plus'}/>
                <div className="ant-upload-text" style={{display: viewPic ? "none" : "block"}}>选择图片</div>
            </div>
        );
        const picHandle = () => {
            if (viewPic && viewPic.slice(26) !== data_pic) {
                const canvas = this.editor.getImage();
                const url = canvas.toDataURL("image/jpeg", 0.92);
                if (url === effectPic) {
                    message.error("图片未改动，无法提交");
                    return
                }
                const file = dataURLtoFile(url);
                picUpload(url, file)
            } else {
                message.error("图片未改动，无法提交");
            }
        };
        const partImg = (
            <AvatarEditor
                ref={setEditorRef}
                image={viewPic}
                width={80}
                height={80}
                border={0}
                color={[255, 255, 255, 0.6]}
                scale={avatarEditor.scale}
                position={{x: avatarEditor.positionX, y: avatarEditor.positionY}}
                rotate={0}
            />
        );

        return (
            <Modal
                visible={visible}
                title="教师编辑"
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
                        <div className="teacher-edit teacher-form item-form">
                            <Form layout="vertical">
                                <FormItem className="name" {...formItemLayout_8} label="教师姓名：">
                                    {getFieldDecorator('name', {
                                        initialValue: data.name,
                                        rules: [{
                                            required: true,
                                            message: '请填写姓名',
                                        }],
                                    })(
                                        <Input placeholder="请输入教师姓名"/>
                                    )}
                                </FormItem>
                                <FormItem className="photo" {...formItemLayout_12} label="教师头像：">
                                    {getFieldDecorator('photo', {
                                        initialValue: viewPic,
                                        rules: [{
                                            required: true,
                                            message: '教师头像不能为空',
                                        }],
                                    })(
                                        <div className="itemBox">
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action="/file/upload"
                                                beforeUpload={beforeUpload}
                                            >
                                                {viewPic ? partImg : uploadButton}
                                            </Upload>
                                            <Row>
                                                <Col span={4}>缩放：</Col>
                                                <Col span={12}>
                                                    <Slider min={0.5} max={1.5} step={0.01} value={avatarEditor.scale}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(1, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={4}>X：</Col>
                                                <Col span={12}>
                                                    <Slider min={0} max={1} step={0.01} value={avatarEditor.positionX}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(2, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={4}>Y：</Col>
                                                <Col span={12}>
                                                    <Slider min={0} max={1} step={0.01} value={avatarEditor.positionY}
                                                            disabled={!viewPic}
                                                            onChange={(value) => {
                                                                setAvatarEditor(3, value)
                                                            }}/>
                                                </Col>
                                            </Row>
                                            <Button type="primary"
                                                    onClick={picHandle}
                                                    loading={photoLoading}
                                                    style={{
                                                        position: "absolute",
                                                        right: "-20px",
                                                        bottom: "0"
                                                    }}>图片提交</Button>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem className="phone unnecessary" {...formItemLayout_8} label="联系电话：">
                                    {getFieldDecorator('phone', {
                                        initialValue: data.phone,
                                        rules: [{
                                            required: false
                                        }],
                                    })(
                                        <Input placeholder="请输入教师联系方式"/>
                                    )}
                                </FormItem>
                                <FormItem className="gender" {...formItemLayout_8} label="性别：">
                                    {getFieldDecorator('gender', {
                                        initialValue: data.gender,
                                        rules: [{
                                            required: true,
                                            message: '性别不能为空'
                                        }],
                                    })(
                                        <Select placeholder="请选择教师性别">
                                            <Option value={0}>女</Option>
                                            <Option value={1}>男</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem className="nickName" {...formItemLayout_8} label="昵称：">
                                    {getFieldDecorator('nickName', {
                                        initialValue: data.nickName,
                                        rules: [{
                                            required: true,
                                            message: '姓名不能为空',
                                        }],
                                    })(
                                        <Input placeholder="请输入教师昵称"/>
                                    )}
                                </FormItem>
                                <FormItem className="experienceAge" {...formItemLayout_8} label="教龄(年)：">
                                    {getFieldDecorator('experienceAge', {
                                        initialValue: data.experienceAge,
                                        rules: [{
                                            required: true,
                                            message: '教龄不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={0} step={1}/>
                                    )}
                                </FormItem>
                                <FormItem className="typeIds longItem" {...formItemLayout_14} label="教学科目：">
                                    {getFieldDecorator('typeIds', {
                                        initialValue: data.typeIds,
                                        rules: [{
                                            required: true,
                                            message: '科目不能为空',
                                        }],
                                    })(
                                        <TreeSelect
                                            placeholder="请选择教室所教科目（最多三项）"
                                            treeCheckable={true}
                                            treeData={subjectList}
                                            showCheckedStrategy={TreeSelect.SHOW_CHILD}
                                        />
                                    )}
                                </FormItem>
                                <FormItem className="description longItem" {...formItemLayout_14} label="教师简介：">
                                    {getFieldDecorator('description', {
                                        initialValue: data.description,
                                        rules: [{
                                            required: true,
                                            message: '教师简介不能为空',
                                        }],
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="请填写教师简介" rows={10}/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//教师信息编辑组件
class ItemEdit extends Component {
    state = {
        visible: false,
        data: {},
        // 图片相关变量
        // 初始图片
        viewPic: "",
        // 有效图片
        effectPic: "",
        // 保存待提交的图片
        data_pic: "",
        avatarEditor: {
            scale: 1,
            positionX: 0.5,
            positionY: 0.5
        },
        photoLoading: false,
        // 科目列表
        subjectList: [],
        confirmLoading: false
    };

    getData = () => {
        reqwest({
            url: '/teacher/getDetail',
            type: 'json',
            method: 'post',
            data: {
                id: this.props.id
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: {
                //         teacher: {
                //             EId: null,
                //             createTime: "",
                //             description: "",
                //             experienceAge: null,
                //             gender: null,
                //             id: 67,
                //             name: "",
                //             nickName: "",
                //             parentTypeId: null,
                //             parentTypeName: "",
                //             phone: "",
                //             photo: "",
                //             status: null,
                //             typeId: null,
                //             typeName: "",
                //             typeIdTwo: null,
                //             typeIdThree: null,
                //             updateTime: ""
                //         }
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    const typeIds = [String(json.data.teacher.typeId)];
                    if (json.data.teacher.typeIdTwo) {
                        typeIds.push(String(json.data.teacher.typeIdTwo))
                    }
                    if (json.data.teacher.typeIdThree) {
                        typeIds.push(String(json.data.teacher.typeIdThree))
                    }
                    json.data.teacher.typeIds = typeIds;
                    json.data.teacher.typeIdTwo = json.data.teacher.typeIdTwo ? json.data.teacher.typeIdTwo : 0;
                    json.data.teacher.typeIdThree = json.data.teacher.typeIdThree ? json.data.teacher.typeIdThree : 0;
                    this.setState({
                        data: json.data.teacher,
                        viewPic: "http://image.taoerxue.com/" + json.data.teacher.photo,
                        effectPic: "http://image.taoerxue.com/" + json.data.teacher.photo,
                        data_pic: json.data.teacher.photo,
                    });
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    getSubjectList = () => {
        reqwest({
            url: '/institution/getEducationTypeList',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                const json = {
                    result: 0,
                    data: [
                        {
                            id: 1,
                            name: "",
                            list: [
                                {id: 11, name: ""},
                                {id: 12, name: ""},
                                {id: 13, name: ""},
                            ]
                        }
                    ]
                };
                if (json.result === 0) {
                    const data = [];
                    json.data.forEach((item) => {
                        let subData = [];
                        if (item.list.length) {
                            item.list.forEach((subItem) => {
                                subData.push({
                                    key: subItem.id,
                                    value: String(subItem.id),
                                    label: subItem.name
                                })
                            })
                        }
                        data.push({
                            key: item.id,
                            value: String(item.id),
                            label: item.name,
                            children: subData
                        })
                    });
                    this.setState({
                        subjectList: data
                    })
                }
            },
            success: (json) => {
                if (json.result === 0) {
                    const data = [];
                    json.data.forEach((item) => {
                        let subData = [];
                        if (item.list.length) {
                            item.list.forEach((subItem) => {
                                subData.push({
                                    key: subItem.id,
                                    value: String(subItem.id),
                                    label: subItem.name
                                })
                            })
                        }
                        data.push({
                            key: item.id,
                            value: String(item.id),
                            label: item.name,
                            children: subData
                        })
                    });
                    this.setState({
                        subjectList: data
                    })
                }
            }
        });
    };

    showModal = () => {
        this.getData();
        this.getSubjectList();
        this.setState({
            visible: true,
        })
    };

    //图片处理
    //由图片网络url获取其base64编码
    getBase64Image = (url, width, height) => {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        const image = new Image();
        image.crossOrigin = '';
        image.src = url;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width ? width : image.width;
            canvas.height = height ? height : image.height;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/jpeg", 0.92);
            this.setState({
                viewPic: dataURL,
                effectPic: dataURL,
            })
        };
    };
    // 初始图片写入
    setViewPic = (para) => {
        this.setState({
            viewPic: para
        })
    };
    // 设置图片缩放比例及偏移量
    setAvatarEditor = (index, value) => {
        if (this.state.viewPic.slice(26) === this.state.data_pic) {
            // 图片有比例和偏移量的改动时，判断viewPic路径是否为网络路径，是则表明当前改动为第一次改动，此时需将viewPic,effectPic路径转为base64编码存入
            this.getBase64Image(this.state.viewPic)
        }
        if (index === 1) {
            this.setState({
                avatarEditor: {
                    scale: value,
                    positionX: this.state.avatarEditor.positionX,
                    positionY: this.state.avatarEditor.positionY
                }
            })
        }
        if (index === 2) {
            this.setState({
                avatarEditor: {
                    scale: this.state.avatarEditor.scale,
                    positionX: value,
                    positionY: this.state.avatarEditor.positionY
                }
            })
        }
        if (index === 3) {
            this.setState({
                avatarEditor: {
                    scale: this.state.avatarEditor.scale,
                    positionX: this.state.avatarEditor.positionX,
                    positionY: value
                }
            })
        }
    };
    // 图片上传
    picUpload = (para01, para02) => {
        const formData = new FormData();
        formData.append("file", para02);
        this.setState({
            photoLoading: true
        });
        reqwest({
            url: '/file/upload',
            type: 'json',
            method: 'post',
            processData: false,
            data: formData,
            error: (XMLHttpRequest) => {
                message.error("图片提交失败");
                this.setState({
                    photoLoading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("图片提交成功");
                    this.setState({
                        effectPic: para01,
                        data_pic: json.data.url,
                        photoLoading: false
                    })
                } else {
                    message.error(json.message);
                    this.setState({
                        photoLoading: false
                    })
                }
            }
        });
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        const itemList = ["name", "photo", "phone", "gender", "nickName", "experienceAge", "typeId", "typeIdTwo", "typeIdThree", "description"];
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

    handleCancel = () => {
        const form = this.form;
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    data: {},
                    viewPic: "",
                    effectPic: "",
                    data_pic: "",
                    avatarEditor: {
                        scale: 1,
                        positionX: 0.5,
                        positionY: 0.5
                    },
                    photoLoading: false,
                    subjectList: [],
                    confirmLoading: false
                });
            })
        };
        if (!this.state.data.name) {
            cancel();
            return;
        }
        form.validateFields((err, values) => {
            values.photo = this.state.data_pic;
            values.typeId = values.typeIds ? Number(values.typeIds[0]) : 0;
            values.typeIdTwo = values.typeIds ? (Number(values.typeIds[1]) || 0) : 0;
            values.typeIdThree = values.typeIds ? (Number(values.typeIds[2]) || 0) : 0;
            const result = this.dataContrast(values);
            if (result) {
                confirm({
                    title: '已修改信息未保存，确认放弃修改？',
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
        if (String(this.state.data.name)==="{}") {
            return;
        }
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (values.typeIds.length > 3) {
                message.error("教学科目最多选三项");
                return;
            }
            // 教师头像和教学科目写入
            values.photo = this.state.data_pic;
            values.typeId = Number(values.typeIds[0]);
            values.typeIdTwo = Number(values.typeIds[1]) || 0;
            values.typeIdThree = Number(values.typeIds[2]) || 0;
            // value与初始data进行比对，得到修改项集合
            const result = this.dataContrast(values);
            if (!result) {
                message.error("暂无信息更改");
                return;
            }
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/teacher/edit',
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
                        message.success("教师信息修改成功，已提交审核");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                data: {},
                                viewPic: "",
                                effectPic: "",
                                data_pic: "",
                                avatarEditor: {
                                    scale: 1,
                                    positionX: 0.5,
                                    positionY: 0.5
                                },
                                photoLoading: false,
                                subjectList: [],
                                confirmLoading: false
                            });
                        });
                        this.props.recapture();
                    } else {
                        if (json.code === "901") {
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
            })
        });
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={() => this.showModal()}>编辑</span>
                <ItemEditForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    data={this.state.data}
                    viewPic={this.state.viewPic}
                    effectPic={this.state.effectPic}
                    data_pic={this.state.data_pic}
                    setViewPic={this.setViewPic}
                    avatarEditor={this.state.avatarEditor}
                    setAvatarEditor={this.setAvatarEditor}
                    picUpload={this.picUpload}
                    photoLoading={this.state.photoLoading}
                    subjectList={this.state.subjectList}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//教师详情组件
class ItemDetails extends Component {
    state = {
        visible: false,
        loading: true,
        data: ""
    };

    getData = () => {
        reqwest({
            url: '/teacher/getDetail',
            type: 'json',
            method: 'post',
            data: {
                id: this.props.id
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
                //         teacher: {
                //             EId: null,
                //             EName: "",
                //             createTime: "",
                //             description: "",
                //             experienceAge: null,
                //             gender: null,
                //             id: 67,
                //             name: "",
                //             nickName: "",
                //             parentTypeId: 1,
                //             parentTypeIdTwo: 1,
                //             parentTypeIdThree: 1,
                //             phone: "",
                //             photo: "",
                //             // status: 1,
                //             // typeId: 11,
                //             // typeIdTwo: 12,
                //             // typeIdThree: 14,
                //             updateTime: ""
                //         },
                //         typeName: "",
                //         typeNameTwo: "",
                //         typeNameThree: "",
                //         parentTypeName: "",
                //         parentTypeNameTwo: "",
                //         parentTypeNameThree: "",
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    json.data.teacher.typeName = json.data.typeName;
                    json.data.teacher.typeNameTwo = json.data.typeNameTwo;
                    json.data.teacher.typeNameThree = json.data.typeNameThree;
                    json.data.teacher.parentTypeName = json.data.parentTypeName;
                    json.data.teacher.parentTypeNameTwo = json.data.parentTypeNameTwo;
                    json.data.teacher.parentTypeNameThree = json.data.parentTypeNameThree;
                    this.setState({
                        loading: false,
                        data: json.data.teacher
                    });
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        let dataSource;
        if(this.state.data){
            const data = this.state.data;
            let tempGender = "";
            if (data.gender === 0) {
                tempGender = "女";
            }
            if (data.gender === 1) {
                tempGender = "男";
            }
            if (data.gender === 2) {
                tempGender = "？";
            }
            let tempStatus = "";
            if (data.status === 0) {
                tempStatus = "删除";
            }
            if (data.status === 1) {
                tempStatus = "正常";
            }
            if (data.status === 2) {
                tempStatus = "禁用";
            }
            if (data.status === 3) {
                tempStatus = "审核中";
            }
            if (data.status === 4) {
                tempStatus = "审核失败";
            }
            dataSource = [
                <div className="name">
                    <span className="item-name">姓名：</span>
                    <span className="item-content">{data.name}</span>
                </div>,
                <div className="photo">
                    <span className="item-name">照片：</span>
                    <img src={"http://image.taoerxue.com/" + this.state.data.photo} alt="" className="item-content"/>
                </div>,
                <div className="gender">
                    <span className="item-name">性别：</span>
                    <span className="item-content">{tempGender}</span>
                </div>,
                <div className="nickName">
                    <span className="item-name">昵称：</span>
                    <span className="item-content">{data.nickName}</span>
                </div>,
                <div className="EName">
                    <span className="item-name">所属机构：</span>
                    <span className="item-content">{data.EName}</span>
                </div>,
                <div className="phone">
                    <span className="item-name">联系电话：</span>
                    <span className="item-content">{data.phone || "暂无"}</span>
                </div>,
                <div className="subject">
                    <span className="item-name">教学科目一：</span>
                    <span className="item-content">{data.parentTypeName + "/" + data.typeName}</span>
                </div>,
                <div className="subject">
                    <span className="item-name">教学科目二：</span>
                    <span
                        className="item-content">{data.typeIdTwo ? data.parentTypeNameTwo + "/" + data.typeNameTwo : "暂无"}</span>
                </div>,
                <div className="subject">
                    <span className="item-name">教学科目三：</span>
                    <span
                        className="item-content">{data.typeIdThree ? data.parentTypeNameThree + "/" + data.typeNameThree : "暂无"}</span>
                </div>,
                <div className="seniority">
                    <span className="item-name">教龄：</span>
                    <span className="item-content">{data.experienceAge}年</span>
                </div>,
                <div className="profile">
                    <span className="item-name">简介：</span>
                    <pre>
                    <span className="item-content">{data.description}</span>
                </pre>
                </div>,
                <div className="status">
                    <span className="item-name">状态：</span>
                    <span className="item-content">{tempStatus}</span>
                </div>
            ];
        }else{
            dataSource=""
        }
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>详情</span>
                <Modal
                    title="教师详情"
                    width={600}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <div className="teacher-details item-details">
                        <div className="teacher-baseData">
                            <List
                                size="small"
                                split="false"
                                dataSource={dataSource}
                                renderItem={item => (<List.Item>{item}</List.Item>)}
                                loading={this.state.loading}
                            />
                        </div>
                    </div>
                </Modal>
            </a>
        );
    }
}

//教师列表
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            ghost: false,
            data: [],
            pagination: {
                current: 1,
                pageSize: Number(localStorage.teacherPageSize) || 10,
                pageSizeOptions: ["5", "10", "15", "20"],
                showQuickJumper: true,
                showSizeChanger: true
            },
        };
        this.columns = Number(sessionStorage.EId) === 0 ?
            // 系统管理员列配置（展示所属机构项）
            [
                {
                    title: "序号",
                    dataIndex: "index",
                    width: '6%',
                    render: (text, record) => this.renderColumns(text, record, "index"),
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    width: '6%',
                    editable: true,
                    // render: (text, record) => this.renderColumns(text, record, "sort"),
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    width: '10%',
                    render: (text, record) => this.renderColumns(text, record, 'name'),
                },
                {
                    title: '所属机构',
                    dataIndex: 'eName',
                    width: '20%',
                    render: (text, record) => this.renderColumns(text, record, 'eName'),
                },
                {
                    title: '照片',
                    dataIndex: 'photo',
                    width: '10%',
                    render: (text, record) => (
                        <img style={{width: '30px', height: "30px"}} src={record["photo"]} alt=""/>)
                },
                {
                    title: '性别',
                    dataIndex: 'gender',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'gender'),
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: '8%',
                    filters: [
                        {text: '正常', value: 1},
                        {text: '禁用', value: 2},
                    ],
                    filterMultiple: false,
                    render: (text, record) => this.renderColumns(text, record, 'status'),
                },
                {
                    title: '创建人',
                    dataIndex: 'createUser',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'createUser'),
                },
                {
                    title: '创建日期',
                    dataIndex: 'createTime',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'createTime'),
                },
                {
                    title: '操作',
                    dataIndex: '操作',
                    render: (text, record) => {
                        return (
                            <div className="editable-row-operations">
                                <ItemDetails id={record.id} opStatus={this.props.opObj.select} toLoginPage={this.props.toLoginPage}/>
                                <ItemEdit id={record.id} recapture={this.getData} toLoginPage={this.props.toLoginPage} opStatus={this.props.opObj.modify}/>
                                <Popconfirm title="确认禁用?"
                                            placement="topRight"
                                            onConfirm={() => this.itemBan(record.id)}
                                            onCancel=""
                                            okType="danger"
                                            okText="立即禁用"
                                            cancelText="取消">
                                    <a style={{display: this.props.opObj.modify && record.statusCode === 1 ? "inline" : "none"}}>禁用</a>
                                </Popconfirm>
                                <Popconfirm title="确认启用?"
                                            placement="topRight"
                                            onConfirm={() => this.itemOpen(record.id)}
                                            onCancel=""
                                            okType="danger"
                                            okText="立即启用"
                                            cancelText="取消">
                                    <a style={{display: this.props.opObj.modify && record.statusCode === 2 ? "inline" : "none"}}>启用</a>
                                </Popconfirm>
                            </div>
                        );
                    },
                }]
            :
            // 机构管理员列配置
            [
                {
                    title: "序号",
                    dataIndex: "index",
                    width: '6%',
                    render: (text, record) => this.renderColumns(text, record, "index"),
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    width: '6%',
                    editable: true,
                    // render: (text, record) => this.renderColumns(text, record, "sort"),
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    width: '10%',
                    render: (text, record) => this.renderColumns(text, record, 'name'),
                },
                {
                    title: '照片',
                    dataIndex: 'photo',
                    width: '10%',
                    render: (text, record) => (
                        <img style={{width: '30px', height: "30px"}} src={record["photo"]} alt=""/>)
                },
                {
                    title: '性别',
                    dataIndex: 'gender',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'gender'),
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: '8%',
                    filters: [
                        {text: '正常', value: 1},
                        {text: '禁用', value: 2},
                    ],
                    filterMultiple: false,
                    render: (text, record) => this.renderColumns(text, record, 'status'),
                },
                {
                    title: '创建人',
                    dataIndex: 'createUser',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'createUser'),
                },
                {
                    title: '创建日期',
                    dataIndex: 'createTime',
                    width: '8%',
                    render: (text, record) => this.renderColumns(text, record, 'createTime'),
                },
                {
                    title: '操作',
                    dataIndex: '操作',
                    render: (text, record) => {
                        return (
                            <div className="editable-row-operations">
                                <ItemDetails id={record.id} opStatus={this.props.opObj.select} toLoginPage={this.props.toLoginPage}/>
                                <ItemEdit id={record.id} recapture={this.getData} toLoginPage={this.props.toLoginPage} opStatus={this.props.opObj.modify}/>
                                <Popconfirm title="确认删除?"
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
                }]
    }

    // 设置排序
    handleSave = (row) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/saveTeacherSort',
            type: 'json',
            method: 'get',
            data: {
                // 机构Id
                teacherId: row.id,
                // 排序
                sort: Number(row.sort),
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
                if (json.result === 0) {
                    this.setState({
                        loading: false,
                    });
                    this.getData();
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //列渲染
    renderColumns(text) {
        return (
            <Cell value={text}/>
        );
    }

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

    //获取本页信息
    getData = (keyword) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/searchTeacherList',
            type: 'json',
            method: 'post',
            data: {
                status: this.props.keyword.status,
                educationName: keyword ? keyword.educationName : this.props.keyword.educationName,
                teacherName: keyword ? keyword.teacherName : this.props.keyword.teacherName,
                startTime: keyword ? keyword.startTime : this.props.keyword.startTime,
                endTime: keyword ? keyword.endTime : this.props.keyword.endTime,
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
                //         size: 102,
                //         list: [
                //             {
                //                 id: 1,
                //                 EId: 1,
                //                 EName: "",
                //                 photo: "",
                //                 name: "",
                //                 phone: "",
                //                 gender: null,
                //                 status: 1,
                //             },
                //             {
                //                 id: 2,
                //                 EId: 1,
                //                 EName: "",
                //                 photo: "",
                //                 name: "",
                //                 phone: "",
                //                 gender: null,
                //                 status: 2,
                //             }
                //         ]
                //     }
                // };
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
                        let tempGender = "";
                        if (item.gender === 0) {
                            tempGender = "女"
                        }
                        if (item.gender === 1) {
                            tempGender = "男"
                        }
                        if (item.gender === 2) {
                            tempGender = "?"
                        }
                        let tempStatus = "";
                        if (item.status === 0) {
                            tempStatus = "删除"
                        }
                        if (item.status === 1) {
                            tempStatus = "正常"
                        }
                        if (item.status === 2) {
                            tempStatus = "禁用"
                        }
                        if (item.status === 3) {
                            tempStatus = "审核中"
                        }
                        if (item.status === 4) {
                            tempStatus = "审核失败"
                        }
                        data.push({
                            key: index.toString(),
                            id: item.id,
                            index: index + 1,
                            sort: item.sort,
                            eName: item.EName,
                            photo: global.config.photoUrl + item.photo,
                            name: item.name,
                            gender: tempGender,
                            statusCode: item.status,
                            status: tempStatus,
                            createUser: item.createUser || "暂无",
                            createTime: item.createTime ? this.dateHandle(item.createTime) : "",
                        });
                    });
                    this.setState({
                        loading: false,
                        data: data,
                        pagination: {
                            total: json.data.size,
                            current: this.state.pagination.current,
                            pageSize: this.state.pagination.pageSize
                        }
                    });
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //删除
    itemDelete = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/checkTeacher',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id,
                status: 0
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("教师删除成功");
                    this.getData()
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //禁用
    itemBan = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/checkTeacher',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id,
                status: 2
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("教师禁用成功");
                    this.getData()
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //启用
    itemOpen = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/teacher/checkTeacher',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id,
                status: 1
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("教师启用成功");
                    this.getData()
                } else {
                    if (json.code === "901") {
                        message.error("请先登录");
                        // 返回登陆页
                        this.props.toLoginPage();
                    } else if (json.code === "902") {
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

    //表格参数变化处理
    handleTableChange = (pagination, filters) => {
        if (filters.status) {
            this.props.keyword.status = filters.status[0];
        }
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        localStorage.teacherPageSize = pagination.pageSize;
        pager.pageSize = Number(localStorage.teacherPageSize);
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
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
              return col;
            }
            return {
              ...col,
              onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: this.handleSave,
              }),
            };
        });
        return <Table bordered
                      components={components}
                      loading={this.state.loading}
                      dataSource={this.state.data}
                      pagination={this.state.pagination}
                      columns={columns}
                      onChange={this.handleTableChange}/>;
    }
}

class TeachersOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opObj: {},
            // 获取机构列表所需关键词
            keyword: {
                educationName: "",
                teacherName: '',
                startTime: "",
                endTime: "",
            },
            flag_add: false
        };
        this.educationName = "";
        this.teacherName = "";
    };

    // 获取当前登录人对此菜单的操作权限
    setPower = () => {
        // 菜单信息为空则直接返回登陆页
        if (!sessionStorage.menuList) {
            this.toLoginPage();
            return
        }
        JSON.parse(sessionStorage.menuList).forEach((item) => {
            item.children.forEach((subItem) => {
                if (subItem.url === this.props.location.pathname) {
                    let data = {};
                    subItem.children.forEach((thirdItem) => {
                        data[thirdItem.url] = true;
                    });
                    this.setState({
                        opObj: data
                    })
                }
            })
        });
    };

    search = (type, value) => {
        if (type === 0) {
            if (this.state.keyword.educationName === this.educationName && this.state.keyword.teacherName === this.teacherName) {
                return
            }
            this.setState({
                keyword: {
                    educationName: this.educationName,
                    teacherName: this.teacherName
                }
            })
        }
        if (type === 1) {
            if (value !== this.state.keyword.teacherName) {
                this.setState({
                    keyword: {
                        educationName: '',
                        teacherName: value,
                    }
                })
            }

        }
    };

    setInstitutionName = (event) => {
        if (event.target.value === this.educationName) {
            return
        }
        this.educationName = event.target.value
    };

    setTeacherName = (event) => {
        if (event.target.value === this.teacherName) {
            return
        }
        this.teacherName = event.target.value
    };

    setStartTime = (date, dateString) => {
        this.setState({
            keyword: {
                educationName: this.state.keyword.educationName,
                startTime: dateString,
                endTime: this.state.keyword.endTime,
            }
        })
    };

    setEndTime = (date, dateString) => {
        this.setState({
            keyword: {
                educationName: this.state.keyword.educationName,
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
            <div className="teachersOne">
                {
                    this.state.opObj.select ?
                        <div>
                            <header className="clearfix">
                                <div>
                                    <div className="teacher-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "150px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="教师姓名" onBlur={this.setTeacherName}/>
                                    </div>
                                    <div className="institution-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "320px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="机构名称" onBlur={this.setInstitutionName}/>
                                    </div>
                                    <Button style={{
                                                // display: Number(sessionStorage.EId) === 0 ? "block" : "none"
                                                marginRight: "20px",
                                            }}
                                            type="primary"
                                            onClick={() => this.search(0)}>
                                        <Icon type="search" style={{fontSize: "16px"}}/>
                                    </Button>
                                    <Search placeholder="请输入教师姓名信息"
                                            onSearch={(value) => this.search(1, value)}
                                            enterButton
                                            style={{
                                                display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                                width: "320px",
                                                float: "left"
                                            }}
                                    />
                                    {/*教师创建日期筛选*/}
                                    <span>日期筛选： </span>
                                    <DatePicker placeholder="请选择日期"
                                                style={{width: "120px"}}
                                                onChange={this.setStartTime}/>
                                    <span style={{margin: "0 10px"}}>至</span>
                                    <DatePicker placeholder="请选择日期"
                                                style={{width: "120px"}}
                                                onChange={this.setEndTime}/>
                                </div>
                                <div>
                                    {/*教师添加*/}           
                                    <div className="add-button" style={{float: "right"}}>
                                        <ItemAdd opStatus={this.state.opObj.add && Number(sessionStorage.EId) !== 0}
                                                toLoginPage={this.toLoginPage} setFlag={this.setFlag}/>
                                    </div>
                                </div>
                            </header>
                            <div className="table-box">
                                <DataTable opObj={this.state.opObj} keyword={this.state.keyword}
                                           flag_add={this.state.flag_add} toLoginPage={this.toLoginPage}/>
                            </div>
                        </div>
                        :
                        <div>
                            <header className="clearfix">
                                <div>
                                    <div className="teacher-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "150px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="教师姓名" onBlur={this.setTeacherName}/>
                                    </div>
                                    <div className="institution-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "320px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="机构名称" onBlur={this.setInstitutionName}/>
                                    </div>
                                    <Button style={{
                                                // display: Number(sessionStorage.EId) === 0 ? "block" : "none"
                                                marginRight: "20px",
                                            }}
                                            type="primary"
                                            onClick={() => this.search(0)}>
                                        <Icon type="search" style={{fontSize: "16px"}}/>
                                    </Button>
                                    <Search placeholder="请输入教师姓名信息"
                                            onSearch={(value) => this.search(1, value)}
                                            enterButton
                                            style={{
                                                display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                                width: "320px",
                                                float: "left"
                                            }}
                                    />
                                    {/*教师创建日期筛选*/}
                                    <span>日期筛选： </span>
                                    <DatePicker placeholder="请选择日期"
                                                style={{width: "120px"}}
                                                onChange={this.setStartTime}/>
                                    <span style={{margin: "0 10px"}}>至</span>
                                    <DatePicker placeholder="请选择日期"
                                                style={{width: "120px"}}
                                                onChange={this.setEndTime}/>
                                </div>
                                <div>
                                    {/*教师添加*/}           
                                    <div className="add-button" style={{float: "right"}}>
                                        <ItemAdd opStatus={this.state.opObj.add && Number(sessionStorage.EId) !== 0}
                                                toLoginPage={this.toLoginPage} setFlag={this.setFlag}/>
                                    </div>
                                </div>
                            </header>
                            <div className="table-box">
                                <DataTable opObj={this.state.opObj} keyword={this.state.keyword}
                                           flag_add={this.state.flag_add} toLoginPage={this.toLoginPage}/>
                            </div>
                        </div>
                        // <p>暂无查询权限</p>
                }
            </div>
        )
    }
}

export default TeachersOne;