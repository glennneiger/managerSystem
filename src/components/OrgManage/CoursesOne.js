import React, {Component} from 'react';
import {
    Table,
    Input,
    Button,
    Modal,
    Form,
    Select,
    Upload,
    Icon,
    message,
    Slider,
    Row,
    Col,
    List,
    Radio,
    InputNumber,
    DatePicker,
    Popconfirm,
    Cascader,
    Checkbox,
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
const RadioGroup = Radio.Group;
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
const formItemLayout_14 = {
    labelCol: {span: 4},
    wrapperCol: {span: 14},
};
const formItemLayout_16 = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

// 复制教师
const menu = (
    <Menu>
        <Menu.Item>已添加教师时</Menu.Item>
        <Menu.Item>未添加教师时</Menu.Item>
    </Menu>
);

// function onClick (e) {
//     console.log(e.key);
//     this.setState({
//         selectKeys: e.key,
//     })
// }

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

//新增课程表单
const ItemAddForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, courseType, setCourseType, viewPic, setViewPic, picUpload, avatarEditor, setAvatarEditor, photoList, setPhotoList, photoLoading, subjectList, studentTypeList, studentType, setStudentType, studentLevelList, lessonList, fn_lesson, characteristicList, fn_characteristic, institutionList, saveLoading, confirmLoading} = props;
        const {getFieldDecorator} = form;

        // 已上传图片列表
        const photoExist = [];
        photoList.forEach((item, index) => {
            photoExist.push(
                <div className="photoExist-item clearfix" key={index + 1}>
                    <img src={"http://image.taoerxue.com/" + item} alt=""/>
                    <div className="remove">
                        <Button type="dashed" shape="circle"
                                icon="minus" onClick={() => setPhotoList(index)}/>
                    </div>
                </div>
            )
        });

        // 由图片文件对象获取其base64编码
        const getBase64 = (img, callback) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        // 由图片地址获取其文件对象
        const dataURLtoFile = (url) => {
            let arr = url.split(','),
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: "image/jpeg" });
        };
        const setEditorRef = (editor) => this.editor = editor;
        // 图片文件选中后的相关操作
        const beforeUpload = (file) => {
            const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isIMG) {
                message.error('文件类型错误');
                return false
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('文件不能大于2M');
                return false
            }
            getBase64(file, (imageUrl) => {
                setViewPic(imageUrl);
            });
            return false
        };
        // 点击图片提交按钮的相关操作
        const picHandle = () => {
            if (viewPic) {
                const canvas = this.editor.getImage();
                const url = canvas.toDataURL("image/jpeg", 0.92);
                const file = dataURLtoFile(url);
                picUpload(file)
            } else {
                message.error("图片未选择");
            }
        };
        // 图片选择框：图片文件未选择时展示
        const uploadButton = (
            <div>
                <Icon type={'plus'}/>
                <div className="ant-upload-text" style={{display: viewPic ? "none" : "block"}}>选择图片</div>
            </div>
        );
        // 展示有效图片的canvas元素：图片文件已选择时展示
        const partImg = (
            <AvatarEditor
                ref={setEditorRef}
                image={viewPic}
                width={180}
                height={100}
                border={0}
                color={[255, 255, 255, 0.6]}
                scale={avatarEditor.scale}
                position={{x: avatarEditor.positionX, y: avatarEditor.positionY}}
                rotate={0}
            />
        );

        //科目选项生成
        const subjectOptions = [];
        subjectList.forEach((item) => {
            let children = [];
            item.list.forEach((subItem) => {
                children.push({value: subItem.id, label: subItem.name})
            });
            subjectOptions.push({value: item.id, label: item.name, children: children});
        });

        //适合年龄选项生成
        const optionsOfStudentAge = [];
        studentTypeList.forEach((item, index) => {
            optionsOfStudentAge.push(<Option key={index + 1} value={item.name}>{item.name}</Option>)
        });

        //适合基础选项生成
        const optionsOfStudentLevel = [];
        studentLevelList.forEach((item, index) => {
            optionsOfStudentLevel.push(<Option key={index + 1} value={item.id}>{item.name}</Option>)
        });

        //课时
        const lessonItems = [];
        const fnFilterSubItems = (para) => {
            return para.flag === true
        };
        const lessonItemsVisible = lessonList.filter(fnFilterSubItems);
        lessonItemsVisible.forEach((item, index) => {
            lessonItems.push(
                <FormItem className={"subItem" + (index + 1) + " subItem longItem unnecessary"} 
                          label={index === 0 ? "课时安排：" : ""}
                          key={item.index}>
                    {getFieldDecorator('subItem' + item.index, {
                        rules: [{
                            required: false,
                            max: 18,
                            pattern: /^[^@]+$/g,
                            message: "请按要求填写课时名称",
                        }]
                    })(
                        <div className="course-subItem-box">
                            <Input placeholder={"请输入课时名称（18字以内）"}
                                   defaultValue={item.value}
                                   onBlur={(event) => fn_lesson(item.index, event.target.value)}
                                   style={{width: "80%", marginRight: "10px"}}/>
                            <Button
                                type="dashed"
                                size="small"
                                onClick={() => fn_lesson(item.index)}
                                icon="minus"
                            >
                            </Button>
                        </div>
                    )}
                </FormItem>
            );
        });
        lessonItems.push(
            <FormItem
                className={lessonItemsVisible.length === 0 ? "subItemsAddButton subItemsAddButtonInit unnecessary" : "subItemsAddButton subItemsAddButtonChanged unnecessary"}
                label={lessonItemsVisible.length === 0 ? "课时安排：" : ""}
                key="subItemsAddButton">
                {getFieldDecorator('subItemsAddButton', {
                    rules: [{
                        required: false
                    }]
                })(
                    <div className="course-subItem-box">
                        <Button
                            type="dashed"
                            size="small"
                            onClick={() => fn_lesson()}
                            icon="plus"
                        >
                            添加课时
                        </Button>
                    </div>
                )}
            </FormItem>
        );

        //课程特色
        const characteristicItems = [];
        characteristicList.forEach((item, index) => {
            // 课程特色列表项生成
            characteristicItems.push(
                <FormItem
                    className={"characteristic" + (index + 1) + " characteristic longItem"} 
                    label={index === 0 ? "课程特色：" : ""}
                    key={item.index}>
                    {getFieldDecorator('characteristic' + item.index, {
                        initialValue: item.value,
                        rules: [{
                            required: true,
                            pattern: /^[^@]+$/g,
                            message: "请按要求填写课程特色",
                        }]
                    })(
                        <div className="course-characteristic-box">
                            <Input placeholder={"请输入课程特色（不能包含@等特殊字符）"}
                                   defaultValue={item.value}
                                   onBlur={(event) => fn_characteristic(index, event.target.value)}
                                   style={{width: "85%", marginRight: "10px"}}/>
                            <Button
                                type="dashed"
                                size="small"
                                onClick={() => fn_characteristic(index)}
                                icon="minus"
                                style={{display: characteristicList.length <= 1 ? "none" : "inline"}}
                            >
                            </Button>
                        </div>
                    )}
                </FormItem>
            );
        });
        // 添加按钮
        characteristicItems.push(
            <FormItem
                className={characteristicList.length === 0 ? "characteristicAddButton characteristicAddButtonInit longItem" : "characteristicAddButton characteristicAddButtonChanged longItem"}
                
                label={characteristicList.length === 0 ? "课程特色：" : ""}
                key="characteristicAddButton">
                {getFieldDecorator('characteristicAddButton', {
                    rules: [{
                        required: characteristicList.length === 0,
                        message: "课程特色不能少于1条",
                    }]
                })(
                    <div className="course-characteristic-box">
                        <Button
                            type="dashed"
                            size="small"
                            onClick={() => fn_characteristic()}
                            icon="plus"
                        >
                            添加课程特色
                        </Button>
                    </div>
                )}
            </FormItem>
        );

        // 多机构选项生成
        const institutionOptions = institutionList.map(item => <Checkbox key={item.id}
                                                                         value={item.id}>{item.name}</Checkbox>);

        return (
            <Modal
                visible={visible}
                title="添加课程"
                width={1100}
                onCancel={onCancel}
                footer={[
                    <Button key="back" onClick={onCancel} disabled={saveLoading || confirmLoading}>取消</Button>,
                    <Button key="save" type="primary" loading={saveLoading} disabled={confirmLoading}
                            onClick={() => onCreate(1)}>暂存</Button>,
                    <Button key="submit" type="primary" loading={confirmLoading} disabled={saveLoading}
                            onClick={() => onCreate(2)}>保存并提交</Button>
                ]}
                destroyOnClose={true}
            >
                <div className="course-add course-form item-form">
                    <Form layout="vertical">
                        <h4 className="add-form-title-h4">基础信息</h4>
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem className="name longItem" label="课程名称：">
                                    {getFieldDecorator('name', {
                                        rules: [{
                                            required: true,
                                            max: 30,
                                            message: '请按要求填写课程名称',
                                        }],
                                    })(
                                        <Input placeholder="请输入课程名称（30字以内）"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="courseType" label="课程类型：">
                                    {getFieldDecorator('courseType', {
                                        rules: [{
                                            required: true,
                                            message: '请选择课程类型',
                                        }],
                                    })(
                                        <RadioGroup onChange={(e) => {
                                            setCourseType(e.target.value)
                                        }}>
                                            <Radio value={0}>线下正式课</Radio>
                                            {/*<Radio value={1}>视频课程</Radio>*/}
                                            <Radio value={2}>线下体验课</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="typeId" label="所属科目：">
                                    {getFieldDecorator('typeId', {
                                        rules: [{
                                            required: true,
                                            message: '科目不能为空',
                                        }],
                                    })(
                                        <Cascader options={subjectOptions} placeholder="请选择所属教学科目"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="studentLevelId" label="适合基础：">
                                    {getFieldDecorator('studentLevelId', {
                                        rules: [{
                                            required: true,
                                            message: '请选择适合基础',
                                        }],
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请选择适合基础"
                                        >
                                            {optionsOfStudentLevel}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className={courseType === 2 ? "number itemNone" : "number"} label="开班人数：">
                                    {getFieldDecorator('number', {
                                        rules: [{
                                            required: courseType !== 2,
                                            message: '开班人数不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={0} step={1} style={{width: "100%"}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="duration" label="单节时长：">
                                    {getFieldDecorator('duration', {
                                        rules: [{
                                            required: true,
                                            message: '单节时常不能为空',
                                        }],
                                    })(
                                        <InputNumber placeholder="单节分钟数" min={1} precision={0} step={1}
                                                    style={{width: "100%"}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="count" label="课时数：">
                                    {getFieldDecorator('count', {
                                        rules: [{
                                            required: true,
                                            message: '课时数不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={0} step={1} style={{width: "100%"}}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={16}>
                                <FormItem className="studentType longItem" label="适合年龄：">
                                    {getFieldDecorator('studentType', {
                                        rules: [{
                                            required: false,
                                        }],
                                    })(
                                        <div>
                                            <Select
                                                value={studentType.str || undefined}
                                                style={{float: "left", width: "192px"}}
                                                placeholder="请选择适合年龄段"
                                                onChange={(value) => setStudentType(1, value)}
                                            >
                                                {optionsOfStudentAge}
                                            </Select>
                                            <span style={{float: "left", margin: "6px 10px 0"}}>或</span>
                                            <div style={{float: "left", marginTop: "4px"}}>
                                                <InputNumber value={studentType.ageOne} size="small" style={{width: "50px"}}
                                                            min={0} max={18} precision={0} step={1}
                                                            onChange={(value) => setStudentType(2, value)}/> 至 <InputNumber
                                                value={studentType.ageTwo} size="small" style={{width: "50px"}} min={0} max={18}
                                                precision={0} step={1} onChange={(value) => setStudentType(3, value)}/> 岁
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                        {/*课程课时项*/}
                        {lessonItems}
                        <p className="lessonHint">注：课时名称不能包含@等特殊字符</p>
                        
                        <Row gutter={24}>
                            <Col span={10}>
                                <FormItem className="photo" label="课程图片：">
                                    {getFieldDecorator('photo', {
                                        rules: [{
                                            required: true,
                                            message: '课程图片不能为空',
                                        }],
                                    })(
                                        <div className="itemBox">
                                            {photoExist}
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action="/file/upload"
                                                beforeUpload={beforeUpload}
                                            >
                                                {viewPic ? partImg : uploadButton}
                                                <p className="hint">（可上传1-5张图片）</p>
                                            </Upload>
                                            <Row>
                                                <Col span={4}>缩放：</Col>
                                                <Col span={12}>
                                                    <Slider min={1} max={1.5} step={0.01} value={avatarEditor.scale}
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
                                                    }}>
                                                图片提交
                                            </Button>
                                        </div>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        
                        <h4 className="add-form-title-h4">课程特色</h4>
                        {/*课程特色项*/}
                        {characteristicItems}
                        <h4 className="add-form-title-h4">课程详情</h4>
                        <FormItem className="sketch longItem" label="课程简介：">
                            {getFieldDecorator('sketch', {
                                rules: [{
                                    required: true,
                                    message: '课程简介不能为空',
                                }],
                            })(
                                <TextArea style={{resize: "none"}} placeholder="请填写课程简介" rows={10}/>
                            )}
                        </FormItem>
                        <FormItem className="target longItem" label="学习目标：">
                            {getFieldDecorator('target', {
                                rules: [{
                                    required: true,
                                    message: '学习目标不能为空',
                                }],
                            })(
                                <TextArea style={{resize: "none"}} placeholder="请填写学习目标"
                                          autosize={{minRows: 3, maxRows: 10}}/>
                            )}
                        </FormItem>
                        <h4 className="add-form-title-h4">购买须知</h4>
                        
                        <FormItem className="tips longItem" label="购买说明：">
                            {getFieldDecorator('tips', {
                                rules: [{
                                    required: true,
                                    message: '购买须知不能为空',
                                }],
                            })(
                                <TextArea style={{resize: "none"}} placeholder="请填写课程购买须知"
                                          autosize={{minRows: 5, maxRows: 10}}/>
                            )}
                        </FormItem>
                        <FormItem className="tips longItem" label="温馨提示：">
                            {getFieldDecorator('warmPrompt', {
                                rules: [{
                                    required: true,
                                    message: '温馨提示不能为空',
                                }],
                                initialValue: "如需要发票，请您在上课前向机构咨询",
                            })(
                                <TextArea style={{resize: "none"}} placeholder="如需要发票，请您在上课前向机构咨询"
                                          autosize={{minRows: 5, maxRows: 5}}/>
                            )}
                        </FormItem>
                        <FormItem className="tips longItem" label="官方说明：">
                            {getFieldDecorator('official', {
                                rules: [{
                                    required: true,
                                    message: '官方说明不能为空',
                                }],
                                initialValue: "为保障您的权益，建议使用淘儿学线上支付，若使用其他支付方式导致纠纷，淘儿学不承担任何责任，感谢您的理解和支持！"
                            })(
                                <TextArea style={{resize: "none"}} placeholder="为保障您的权益，建议使用淘儿学线上支付，若使用其他支付方式导致纠纷，淘儿学不承担任何责任，感谢您的理解和支持！"
                                          autosize={{minRows: 5, maxRows: 5}}/>
                            )}
                        </FormItem>
                        <FormItem
                            className={institutionOptions.length >= 1 ? "eIds longItem unnecessary" : "eIds longItem unnecessary itemNone"} label="将课程信息同步到如下分机构：">
                            {getFieldDecorator('eIds', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <Checkbox.Group style={{width: '100%'}}>
                                    {institutionOptions}
                                </Checkbox.Group>
                            )}
                        </FormItem>
                        <h4 className="add-form-title-h4">其他信息</h4>
                        <Row gutter={24}>
                            <Col span={8}>
                                <FormItem className="originalPrice" label="课程原价：">
                                    {getFieldDecorator('originalPrice', {
                                        rules: [{
                                            required: true,
                                            message: '课程原价不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={2} step={100} style={{width: "100%"}} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem className="price"  label="课程现价：">
                                    {getFieldDecorator('price', {
                                        rules: [{
                                            required: true,
                                            message: '课程现价不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={2} step={100} style={{width: "100%"}} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
    }
);

//新增课程组件
class ItemAdd extends Component {
    state = {
        visible: false,
        // 课程类型
        courseType: null,
        // 课程图片相关变量
        viewPic: "",
        photoList: [],
        avatarEditor: {
            scale: 1,
            positionX: 0.5,
            positionY: 0.5
        },
        photoLoading: false,
        // 科目列表
        subjectList: [],
        // 适合年龄列表
        studentTypeList: [],
        // 当前适合年龄字段信息
        studentType: {
            str: "",
            ageOne: null,
            ageTwo: null
        },
        // 适合基础列表
        studentLevelList: [],
        // 课程课时列表
        lessonList: [],
        // 课程特色列表
        characteristicList: [{index: 1, value: ""}],
        // 关联机构列表
        institutionList: [],
        // 暂存按钮状态变量
        saveLoading: false,
        // 提交按钮状态变量
        confirmLoading: false
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
                //             name: "01",
                //             list: [
                //                 {id: 11, name: "11"},
                //                 {id: 12, name: "12"},
                //                 {id: 13, name: "13"},
                //             ]
                //         },
                //         {
                //             id: 2,
                //             name: "02",
                //             list: [
                //                 {id: 21, name: "21"},
                //                 {id: 22, name: "22"},
                //                 {id: 23, name: "23"},
                //             ]
                //         },
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        subjectList: json.data
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

    // 获取适合年龄与适合基础列表
    getStudentTypeAndLevelList = () => {
        reqwest({
            url: '/course/getTypeAndBasics',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: {
                //         studentTypeList: [
                //             {id: 1, name: ""},
                //         ],
                //         studentLevelList: [
                //             {id: 1, name: ""},
                //         ],
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        studentTypeList: json.data.studentTypeList,
                        studentLevelList: json.data.studentLevelList,
                    })
                }
            }
        });
    };

    // 获取关联机构列表
    getInstitutionList = () => {
        reqwest({
            url: '/institution/getEducations',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: {
                //         list: [
                //             {id: 1, name: "01"},
                //             {id: 2, name: "02"},
                //             {id: 3, name: "03"},
                //             {id: 4, name: "04"},
                //         ]
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        institutionList: json.data.list
                    })
                }
            }
        });
    };

    showModal = () => {
        this.getSubjectList();
        this.getStudentTypeAndLevelList();
        this.getInstitutionList();
        this.setState({visible: true});
    };

    // 课程类型设置
    setCourseType = (value) => {
        this.setState({
            courseType: value
        })
    };

    // 图片处理
    setViewPic = (para) => {
        this.setState({
            viewPic: para
        })
    };
    setAvatarEditor = (index, value) => {
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
    picUpload = (para) => {
        if (this.state.photoList.length >= 5) {
            message.error("图片最多上传5张");
            return
        } else {
            const formData = new FormData();
            formData.append("file", para);
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
                        photoLoading: false,
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("图片提交成功");
                        let photoList = this.state.photoList;
                        photoList.push(json.data.url);
                        this.setState({
                            photoList: photoList,
                            viewPic: "",
                            avatarEditor: {
                                scale: 1,
                                positionX: 0.5,
                                positionY: 0.5
                            },
                            photoLoading: false,
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
        }
    };
    // 图片删除
    setPhotoList = (index) => {
        let data = this.state.photoList;
        data.splice(index, 1);
        this.setState({
            photoList: data
        })
    };

    // 适合年龄字段有效信息写入
    setStudentType = (type, value) => {
        // 分支1，适合年龄字符串信息写入
        if (type === 1) {
            this.setState({
                studentType: {
                    str: value,
                    ageOne: null,
                    ageTwo: null
                }
            })
        }
        // 分支2：年龄下限写入
        if (type === 2) {
            this.setState({
                studentType: {
                    str: (value || value === 0) ? "" : this.state.studentType.str,
                    ageOne: value,
                    ageTwo: this.state.studentType.ageTwo
                }
            })
        }
        // 年龄上限写入
        if (type === 3) {
            this.setState({
                studentType: {
                    str: (value || value === 0) ? "" : this.state.studentType.str,
                    ageOne: this.state.studentType.ageOne,
                    ageTwo: value
                }
            })
        }
    };

    // 课时字段处理
    fn_lesson = (index, value) => {
        const tempItems = this.state.lessonList;
        if (index === undefined) {
            // 索引为空，进入新增分支
            tempItems.push({
                index: tempItems.length ? (tempItems[tempItems.length - 1].index + 1) : 1,
                id: 0,
                value: "",
                flag: true
            });
            this.setState({
                lessonList: tempItems
            })
        } else {
            // 索引不为空
            tempItems.forEach((item, itemIndex) => {
                if (item.index === index) {
                    index = itemIndex
                }
            });
            if (value === undefined) {
                // value为空，进入删除分支
                if (tempItems[index].id) {
                    tempItems[index].flag = false;
                    tempItems[index].value = "";
                } else {
                    tempItems.splice(index, 1);
                }
                this.setState({
                    lessonList: tempItems
                })
            } else {
                // value不为空，进入value修改分支
                tempItems[index].value = value;
                this.setState({
                    lessonList: tempItems
                })
            }
        }
    };

    // 课程特色字段处理
    fn_characteristic = (index, value) => {
        if (index === undefined) {
            // 列表项新增分支
            const tempPara = this.state.characteristicList;
            tempPara.push({index: tempPara.length ? (tempPara[tempPara.length - 1].index + 1) : 1, value: ""});
            this.setState({
                characteristicList: tempPara
            })
        } else {
            if (value === undefined) {
                // 列表项删除分支
                const tempPara = this.state.characteristicList;
                tempPara.splice(index, 1);
                this.setState({
                    characteristicList: tempPara
                })
            } else {
                // 列表项修改分支
                const tempPara = this.state.characteristicList;
                tempPara[index].value = value;
                this.setState({
                    characteristicList: tempPara
                })
            }
        }
    };

    // 取消处理
    handleCancel = () => {
        const form = this.form;
        // 取消操作函数
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    courseType: null,
                    viewPic: "",
                    photoList: [],
                    avatarEditor: {
                        scale: 1,
                        positionX: 0.5,
                        positionY: 0.5
                    },
                    photoLoading: false,
                    subjectList: [],
                    studentTypeList: [],
                    studentType: {
                        str: "",
                        ageOne: null,
                        ageTwo: null
                    },
                    studentLevelList: [],
                    lessonListInit: [],
                    lessonList: [],
                    characteristicList: [{index: 1, value: ""}],
                    institutionList: [],
                    saveLoading: false,
                    confirmLoading: false
                });
            })
        };
        // 获取表单信息
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
    handleCreate = (type) => {
        const form = this.form;
        // 部分录入
        if (type === 1) {
            // 获取表单数据
            let values = form.getFieldsValue();
            // 空值处理
            if (!values.name) {
                message.error("课程名称不能为空");
                return
            }
            // 课程图片写入
            values.photo = this.state.photoList[0] || 0;
            values.photo2 = this.state.photoList[1] || 0;
            values.photo3 = this.state.photoList[2] || 0;
            values.photo4 = this.state.photoList[3] || 0;
            values.photo5 = this.state.photoList[4] || 0;
            // 课程typeId写入(二级科目id写入)
            values.typeId = values.typeId ? values.typeId[1] : null;
            // 适合年龄写入----------------------------------------------------------------------------------------------
            values.studentType = "";
            if (this.state.studentType.str) {
                // str存在，则写入studentType
                values.studentType = this.state.studentType.str
            } else {
                // str不存在的分支操作
                if (this.state.studentType.ageOne || this.state.studentType.ageOne === 0) {
                    if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                        if (this.state.studentType.ageOne >= this.state.studentType.ageTwo) {
                            message.error("适合年龄区间有误");
                            return;
                        }
                        values.studentType = this.state.studentType.ageOne + "-" + this.state.studentType.ageTwo + "岁"
                    } else {
                        message.error("适合年龄区间有误");
                        return;
                    }
                } else {
                    if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                        message.error("适合年龄区间有误");
                        return;
                    }
                }
            }
            // 校验studentType是否已存在于studentTypeList中，是则以id替换文本，studentType数据类型由string变更为number
            this.state.studentTypeList.forEach((item) => {
                if (item.name === values.studentType) {
                    values.studentType = item.id
                }
            });
            // studentType不存在于studentTypeList中，则将studentType的值写入suitAge并清空则studentType
            if (typeof(values.studentType) === typeof("")) {
                values.suitAge = values.studentType;
                values.studentType = ""
            }
            // 课程课时写入----------------------------------------------------------------------------------------------
            let lessonFlag = true;
            const lessonListChecked = [];
            const lessonList = [];
            this.state.lessonList.forEach((item) => {
                lessonListChecked.push("subItem" + item.index);
                if (item.id) {
                    // id存在，为修改或删除项
                    lessonList.push(item.id + "@" + item.value);
                } else {
                    // id不存在，为新增项
                    if (item.value) {
                        lessonList.push(item.value);
                    }
                }
            });
            // 课时字段合法性校验
            form.validateFieldsAndScroll(lessonListChecked, (err) => {
                if (err) {
                    lessonFlag = false
                }
            });
            if (lessonFlag) {
                // 合法则写入
                values.lessonName = lessonList;
            } else {
                // 不合法直接return
                return
            }
            // 课程特色写入----------------------------------------------------------------------------------------------
            let characteristicFlag = true;
            let characteristic = "";
            this.state.characteristicList.forEach((item) => {
                if (!item.value) {
                    return;
                }
                if (item.value.indexOf("@") === -1) {
                    characteristic += (item.value + "@");
                } else {
                    characteristicFlag = false
                }
            });
            if (characteristicFlag) {
                values.characteristic = characteristic.slice(0, -1);
            } else {
                message.error("请按要求填写课程特色");
                return
            }
            // 多机构信息写入
            if (values.eIds) {
                values.eIds = values.eIds.join(",")
            }
            // 温馨提示默认值
            // let hints = "如需要发票，请您在上课前向机构咨询";
            // 官方说明默认值
            // let officialDescription = "为保障您的权益，建议使用淘儿学线上支付，若使用其他支付方式导致纠纷，淘儿学不承担任何责任，感谢您的理解和支持！";
            this.setState({
                saveLoading: true
            });
            reqwest({
                url: '/course/publish',
                type: 'json',
                method: 'post',
                headers: {
                    Authorization: sessionStorage.token
                },
                data: {
                    name: values.name,
                    photo: values.photo,
                    photo2: values.photo2,
                    photo3: values.photo3,
                    photo4: values.photo4,
                    photo5: values.photo5,
                    typeId: values.typeId,
                    studentType: values.studentType,
                    suitAge: values.suitAge,
                    studentLevelId: values.studentLevelId,
                    courseType: values.courseType,
                    number: values.number,
                    duration: values.duration,
                    originalPrice: values.originalPrice,
                    price: values.price,
                    characteristic: values.characteristic,
                    sketch: values.sketch,
                    target: values.target,
                    count: values.count,
                    lessonName: values.lessonName,
                    tips: values.tips,
                    warmPrompt: values.warmPrompt,
                    official: values.official,
                    eIds: values.eIds
                },
                error: (XMLHttpRequest) => {
                    message.error("保存失败");
                    this.setState({
                        saveLoading: false
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("课程暂存成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                courseType: null,
                                viewPic: "",
                                photoList: [],
                                avatarEditor: {
                                    scale: 1,
                                    positionX: 0.5,
                                    positionY: 0.5
                                },
                                photoLoading: false,
                                subjectList: [],
                                studentTypeList: [],
                                studentType: {
                                    str: "",
                                    ageOne: null,
                                    ageTwo: null
                                },
                                studentLevelList: [],
                                lessonListInit: [],
                                lessonList: [],
                                characteristicList: [{index: 1, value: ""}],
                                institutionList: [],
                                saveLoading: false,
                                confirmLoading: false
                            });
                        });
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
                                saveLoading: false,
                            })
                        }
                    }
                }
            })
        }
        // 完全录入
        if (type === 2) {
            // 获取表单数据并进行必填项校验
            form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    return;
                }
                // 课程图片写入与校验
                values.photo = this.state.photoList[0] || 0;
                values.photo2 = this.state.photoList[1] || 0;
                values.photo3 = this.state.photoList[2] || 0;
                values.photo4 = this.state.photoList[3] || 0;
                values.photo5 = this.state.photoList[4] || 0;
                if (!values.photo) {
                    message.error("课程图片未提交");
                    return
                }
                // 课程typeId写入(二级科目id写入)
                values.typeId = values.typeId ? values.typeId[1] : null;
                // 适合年龄写入------------------------------------
                values.studentType = "";
                if (this.state.studentType.str) {
                    // str存在，则写入studentType
                    values.studentType = this.state.studentType.str
                } else {
                    // str不存在的分支操作
                    if (this.state.studentType.ageOne || this.state.studentType.ageOne === 0) {
                        if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                            if (this.state.studentType.ageOne >= this.state.studentType.ageTwo) {
                                message.error("适合年龄区间有误");
                                return;
                            }
                            values.studentType = this.state.studentType.ageOne + "-" + this.state.studentType.ageTwo + "岁"
                        } else {
                            message.error("适合年龄区间有误");
                            return;
                        }
                    } else {
                        if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                            message.error("适合年龄区间有误");
                            return;
                        }
                    }
                }
                if (!values.studentType) {
                    message.error("适合年龄不能为空");
                    return
                }
                // 校验studentType是否已存在于studentTypeList中，是则以id替换文本，studentType数据类型由string变更为number
                this.state.studentTypeList.forEach((item) => {
                    if (item.name === values.studentType) {
                        values.studentType = item.id
                    }
                });
                // studentType不存在于studentTypeList中，则将studentType的值写入suitAge并清空则studentType
                if (typeof(values.studentType) === typeof("")) {
                    values.suitAge = values.studentType;
                    values.studentType = ""
                }
                // 课程课时写入---------------------------------------
                const lessonList = [];
                this.state.lessonList.forEach((item) => {
                    if (item.id) {
                        // id存在，为修改或删除项
                        lessonList.push(item.id + "@" + item.value);
                    } else {
                        // id不存在，为新增项
                        if (item.value) {
                            lessonList.push(item.value);
                        }
                    }
                });
                values.lessonName = lessonList;
                // 课程特色写入---------------------------------------
                let characteristic = "";
                this.state.characteristicList.forEach((item) => {
                    if (!item.value) {
                        return;
                    }
                    characteristic += (item.value + "@");
                });
                values.characteristic = characteristic.slice(0, -1);
                if (values.eIds) {
                    values.eIds = values.eIds.join(",")
                }
                this.setState({
                    confirmLoading: true
                });
                reqwest({
                    url: '/course/publish',
                    type: 'json',
                    method: 'post',
                    headers: {
                        Authorization: sessionStorage.token
                    },
                    data: {
                        name: values.name,
                        photo: values.photo,
                        photo2: values.photo2,
                        photo3: values.photo3,
                        photo4: values.photo4,
                        photo5: values.photo5,
                        typeId: values.typeId,
                        studentType: values.studentType,
                        suitAge: values.suitAge,
                        studentLevelId: values.studentLevelId,
                        courseType: values.courseType,
                        number: values.number,
                        duration: values.duration,
                        originalPrice: values.originalPrice,
                        price: values.price,
                        characteristic: values.characteristic,
                        sketch: values.sketch,
                        target: values.target,
                        count: values.count,
                        lessonName: values.lessonName,
                        tips: values.tips,
                        warmPrompt: values.warmPrompt,
                        official: values.official,
                        eIds: values.eIds
                    },
                    error: (XMLHttpRequest) => {
                        message.error("保存失败");
                        this.setState({
                            confirmLoading: false
                        })
                    },
                    success: (json) => {
                        if (json.result === 0) {
                            reqwest({
                                url: '/course/checkCourse',
                                type: 'json',
                                method: 'post',
                                headers: {
                                    Authorization: sessionStorage.token
                                },
                                data: {
                                    id: json.data,
                                    status: 1
                                },
                                error: (XMLHttpRequest) => {
                                    message.error("提交审核失败");
                                    this.setState({
                                        confirmLoading: false
                                    })
                                },
                                success: (json) => {
                                    if (json.result === 0) {
                                        message.success("提交审核成功");
                                        this.setState({
                                            visible: false
                                        }, () => {
                                            this.setState({
                                                courseType: null,
                                                viewPic: "",
                                                photoList: [],
                                                avatarEditor: {
                                                    scale: 1,
                                                    positionX: 0.5,
                                                    positionY: 0.5
                                                },
                                                photoLoading: false,
                                                subjectList: [],
                                                studentTypeList: [],
                                                studentType: {
                                                    str: "",
                                                    ageOne: null,
                                                    ageTwo: null
                                                },
                                                studentLevelList: [],
                                                lessonListInit: [],
                                                lessonList: [],
                                                characteristicList: [{index: 1, value: ""}],
                                                institutionList: [],
                                                saveLoading: false,
                                                confirmLoading: false
                                            });
                                        });
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
                            });
                        } else {
                            message.error(json.message);
                            this.setState({
                                confirmLoading: false
                            })
                        }
                    }
                })
            });
        }
    };

    saveFormRef = (form) => {
        this.form = form;
    };

    render() {
        return (
            // <div style={{display: this.props.opStatus ? "block" : "none"}}>
            <div style={{display: "block"}}>
                {/* <Button type="" onClick={this.showModal}>复制课程</Button> */}
                <Dropdown overlay={menu} placement="bottomCenter">
                    <Button>复制教师</Button>
                </Dropdown>
                <Button type="primary" onClick={this.showModal} style={{marginLeft: 10}}>添加课程</Button>
                <ItemAddForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    courseType={this.state.courseType}
                    setCourseType={this.setCourseType}
                    subjectList={this.state.subjectList}
                    studentTypeList={this.state.studentTypeList}
                    studentType={this.state.studentType}
                    setStudentType={this.setStudentType}
                    studentLevelList={this.state.studentLevelList}
                    viewPic={this.state.viewPic}
                    setViewPic={this.setViewPic}
                    picUpload={this.picUpload}
                    avatarEditor={this.state.avatarEditor}
                    setAvatarEditor={this.setAvatarEditor}
                    photoList={this.state.photoList}
                    setPhotoList={this.setPhotoList}
                    photoLoading={this.state.photoLoading}
                    lessonList={this.state.lessonList}
                    fn_lesson={this.fn_lesson}
                    characteristicList={this.state.characteristicList}
                    fn_characteristic={this.fn_characteristic}
                    institutionList={this.state.institutionList}
                    saveLoading={this.state.saveLoading}
                    confirmLoading={this.state.confirmLoading}
                />
            </div>
        );
    }
}

//课程信息编辑表单
const ItemEditForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form, data, courseType, setCourseType, subjectList, studentTypeList, studentType, setStudentType, studentLevelList, viewPic, setViewPic, picUpload, avatarEditor, setAvatarEditor, photoList, setPhotoList, photoLoading, lessonList, fn_lesson, characteristicList, fn_characteristic, confirmLoading} = props;
        const {getFieldDecorator} = form;

        // 已上传图片列表
        const photoExist = [];
        photoList.forEach((item, index) => {
            photoExist.push(
                <div className="photoExist-item clearfix" key={index + 1}>
                    <img src={"http://image.taoerxue.com/" + item} alt=""/>
                    <div className="remove">
                        <Button type="dashed" shape="circle"
                                icon="minus" onClick={() => setPhotoList(index)}/>
                    </div>
                </div>
            )
        });

        // 由图片文件对象获取其base64编码
        const getBase64 = (img, callback) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        };
        // 由图片地址获取其文件对象
        const dataURLtoFile = (url) => {
            let arr = url.split(','),
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: "image/jpeg" });
        };
        const setEditorRef = (editor) => this.editor = editor;
        const beforeUpload = (file) => {
            const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isIMG) {
                message.error('文件类型错误');
                return false
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('文件不能大于2M');
                return false
            }
            getBase64(file, (imageUrl) => {
                setViewPic(imageUrl);
            });
            return false
        };
        const picHandle = () => {
            if (viewPic) {
                const canvas = this.editor.getImage();
                const url = canvas.toDataURL("image/jpeg", 0.92);
                const file = dataURLtoFile(url);
                picUpload(file)
            } else {
                message.error("图片未选择");
            }
        };
        const uploadButton = (
            <div>
                <Icon type={'plus'}/>
                <div className="ant-upload-text" style={{display: viewPic ? "none" : "block"}}>选择图片</div>
            </div>
        );
        const partImg = (
            <AvatarEditor
                ref={setEditorRef}
                image={viewPic}
                width={180}
                height={100}
                border={0}
                color={[255, 255, 255, 0.6]}
                scale={avatarEditor.scale}
                position={{x: avatarEditor.positionX, y: avatarEditor.positionY}}
                rotate={0}
            />
        );

        //科目选项生成
        const subjectOptions = [];
        subjectList.forEach((item) => {
            let children = [];
            item.list.forEach((subItem) => {
                children.push({value: subItem.id, label: subItem.name})
            });
            subjectOptions.push({value: item.id, label: item.name, children: children});
        });

        //适合年龄选项生成
        const optionsOfStudentAge = [];
        studentTypeList.forEach((item, index) => {
            optionsOfStudentAge.push(<Option key={index + 1} value={item.name}>{item.name}</Option>)
        });

        //适合基础选项生成
        const optionsOfStudentLevel = [];
        studentLevelList.forEach((item, index) => {
            optionsOfStudentLevel.push(<Option key={index + 1} value={item.id}>{item.name}</Option>)
        });

        //课时
        const lessonItems = [];
        const fnFilterSubItems = (para) => {
            return para.flag === true
        };
        const lessonItemsVisible = lessonList.filter(fnFilterSubItems);
        lessonItemsVisible.forEach((item, index) => {
            lessonItems.push(
                <FormItem className={"subItem" + (index + 1) + " subItem longItem unnecessary"} 
                        
                          label={index === 0 ? "课时安排：" : ""}
                          key={item.index}>
                    {getFieldDecorator('subItem' + item.index, {
                        rules: [{
                            required: false,
                            max: 18,
                            pattern: /^[^@]+$/g,
                            message: "请按要求填写课时名称",
                        }]
                    })(
                        <div className="course-subItem-box">
                            <Input placeholder={"请输入课时名称（18字以内）"}
                                   defaultValue={item.value}
                                   onBlur={(event) => fn_lesson(item.index, event.target.value)}
                                   style={{width: "80%", marginRight: "10px"}}/>
                            <Button
                                type="dashed"
                                size="small"
                                onClick={() => fn_lesson(item.index)}
                                icon="minus"
                            >
                            </Button>
                        </div>
                    )}
                </FormItem>
            );
        });
        lessonItems.push(
            <FormItem
                className={lessonItemsVisible.length === 0 ? "subItemsAddButton subItemsAddButtonInit unnecessary" : "subItemsAddButton subItemsAddButtonChanged unnecessary"}
                
                label={lessonItemsVisible.length === 0 ? "课时安排：" : ""}
                key="subItemsAddButton">
                {getFieldDecorator('subItemsAddButton', {
                    rules: [{
                        required: false
                    }]
                })(
                    <div className="course-subItem-box">
                        <Button
                            type="dashed"
                            size="small"
                            onClick={() => fn_lesson()}
                            icon="plus"
                        >
                            添加课时
                        </Button>
                    </div>
                )}
            </FormItem>
        );

        //课程特色
        const characteristicItems = [];
        characteristicList.forEach((item, index) => {
            // 课程特色列表项生成
            characteristicItems.push(
                <FormItem
                    className={"characteristic" + (index + 1) + " characteristic longItem"} 
                    
                    label={index === 0 ? "课程特色：" : ""}
                    key={item.index}>
                    {getFieldDecorator('characteristic' + item.index, {
                        initialValue: item.value,
                        rules: [{
                            required: true,
                            pattern: /^[^@]+$/g,
                            message: "请按要求填写课程特色",
                        }]
                    })(
                        <div className="course-characteristic-box">
                            <Input placeholder={"请输入课程特色（不能包含@等特殊字符）"}
                                   defaultValue={item.value}
                                   onBlur={(event) => fn_characteristic(index, event.target.value)}
                                   style={{width: "85%", marginRight: "10px"}}/>
                            <Button
                                type="dashed"
                                size="small"
                                onClick={() => fn_characteristic(index)}
                                icon="minus"
                                style={{display: characteristicList.length <= 1 ? "none" : "inline"}}
                            >
                            </Button>
                        </div>
                    )}
                </FormItem>
            );
        });
        // 添加按钮
        characteristicItems.push(
            <FormItem
                className={characteristicList.length === 0 ? "characteristicAddButton characteristicAddButtonInit longItem" : "characteristicAddButton characteristicAddButtonChanged longItem"}
                
                label={characteristicList.length === 0 ? "课程特色：" : ""}
                key="characteristicAddButton">
                {getFieldDecorator('characteristicAddButton', {
                    rules: [{
                        required: characteristicList.length === 0,
                        message: "课程特色不能少于1条",
                    }]
                })(
                    <div className="course-characteristic-box">
                        <Button
                            type="dashed"
                            size="small"
                            onClick={() => fn_characteristic()}
                            icon="plus"
                        >
                            添加课程特色
                        </Button>
                    </div>
                )}
            </FormItem>
        );

        return (
            <Modal
                visible={visible}
                title="课程编辑"
                width={650}
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
                        <div className="course-edit course-form item-form">
                            <Form layout="vertical">
                                <FormItem className="name longItem" {...formItemLayout_14} label="课程名称：">
                                    {getFieldDecorator('name', {
                                        initialValue: data.name,
                                        rules: [{
                                            required: true,
                                            max: 30,
                                            message: '请按要求填写课程名称',
                                        }],
                                    })(
                                        <Input placeholder="请输入课程名称（30字以内）"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    className="courseType" {...formItemLayout_10}
                                    label="课程类型：">
                                    {getFieldDecorator('courseType', {
                                        initialValue: data.courseType,
                                        rules: [{
                                            required: true,
                                            message: '请选择课程类型',
                                        }],
                                    })(
                                        <RadioGroup onChange={(e) => {
                                            setCourseType(e.target.value)
                                        }}>
                                            <Radio value={0}>线下正式课</Radio>
                                            {/*<Radio value={1}>视频课程</Radio>*/}
                                            <Radio value={2}>线下体验课</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                <FormItem className="photo" {...formItemLayout_14} label="课程图片：">
                                    {getFieldDecorator('photo', {
                                        initialValue: photoList[0],
                                        rules: [{
                                            required: true,
                                            message: '课程图片不能为空',
                                        }],
                                    })(
                                        <div className="itemBox">
                                            {photoExist}
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action="/file/upload"
                                                beforeUpload={beforeUpload}
                                            >
                                                {viewPic ? partImg : uploadButton}
                                                <p className="hint">（可上传1-5张图片）</p>
                                            </Upload>
                                            <Row>
                                                <Col span={4}>缩放：</Col>
                                                <Col span={12}>
                                                    <Slider min={1} max={1.5} step={0.01} value={avatarEditor.scale}
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
                                                    }}>
                                                图片提交
                                            </Button>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem className="typeId" {...formItemLayout_8} label="所属科目：">
                                    {getFieldDecorator('typeId', {
                                        initialValue: data.typeId ? [data.parentTypeId, data.typeId] : "",
                                        rules: [{
                                            required: true,
                                            message: '科目不能为空',
                                        }],
                                    })(
                                        <Cascader options={subjectOptions} placeholder="请选择所属教学科目"/>
                                    )}
                                </FormItem>
                                <FormItem className="studentType longItem" {...formItemLayout_16} label="适合年龄：">
                                    {getFieldDecorator('studentType', {
                                        rules: [{
                                            required: false,
                                        }],
                                    })(
                                        <div>
                                            <Select
                                                value={studentType.str || undefined}
                                                style={{float: "left", width: "195px"}}
                                                placeholder="请选择适合年龄段"
                                                onChange={(value) => setStudentType(1, value)}
                                            >
                                                {optionsOfStudentAge}
                                            </Select>
                                            <span style={{float: "left", margin: "6px 10px 0"}}>或</span>
                                            <div style={{float: "left", marginTop: "4px"}}>
                                                <InputNumber
                                                    value={studentType.ageOne} size="small"
                                                    style={{width: "50px"}} min={0} max={18} precision={0}
                                                    step={1}
                                                    onChange={(value) => setStudentType(2, value)}/>
                                                至
                                                <InputNumber
                                                    value={studentType.ageTwo} size="small" style={{width: "50px"}}
                                                    min={0}
                                                    max={18} precision={0} step={1}
                                                    onChange={(value) => setStudentType(3, value)}/>
                                                岁
                                            </div>
                                        </div>
                                    )}
                                </FormItem>
                                <FormItem className="studentLevelId" {...formItemLayout_8} label="适合基础：">
                                    {getFieldDecorator('studentLevelId', {
                                        initialValue: data.studentLevelId,
                                        rules: [{
                                            required: true,
                                            message: '请选择适合基础',
                                        }],
                                    })(
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="请选择适合基础"
                                        >
                                            {optionsOfStudentLevel}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    className={courseType === 2 ? "number itemNone" : "number"} {...formItemLayout_8}
                                    label="开班人数：">
                                    {getFieldDecorator('number', {
                                        initialValue: data.number,
                                        rules: [{
                                            required: courseType !== 2,
                                            message: '开班人数不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={0} step={1}/>
                                    )}
                                </FormItem>
                                <FormItem className="duration" {...formItemLayout_8} label="单节时长：">
                                    {getFieldDecorator('duration', {
                                        initialValue: data.duration,
                                        rules: [{
                                            required: true,
                                            message: '单节时常不能为空',
                                        }],
                                    })(
                                        <InputNumber placeholder="单节分钟数" min={1} precision={0} step={1}
                                                     style={{width: "120px"}}/>
                                    )}
                                </FormItem>
                                <FormItem className="count" {...formItemLayout_8} label="课时数：">
                                    {getFieldDecorator('count', {
                                        initialValue: data.count,
                                        rules: [{
                                            required: true,
                                            message: '课时数不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={0} step={1}/>
                                    )}
                                </FormItem>
                                {/*课程课时项*/}
                                {lessonItems}
                                <p className="lessonHint">注：课时名称不能包含@等特殊字符</p>
                                <FormItem className="target longItem" {...formItemLayout_14} label="学习目标：">
                                    {getFieldDecorator('target', {
                                        initialValue: data.target,
                                        rules: [{
                                            required: true,
                                            message: '学习目标不能为空',
                                        }],
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="请填写学习目标"
                                                  autosize={{minRows: 3, maxRows: 10}}/>
                                    )}
                                </FormItem>
                                {/*课程特色项*/}
                                {characteristicItems}
                                <FormItem className="sketch longItem" {...formItemLayout_14} label="课程简介：">
                                    {getFieldDecorator('sketch', {
                                        initialValue: data.sketch,
                                        rules: [{
                                            required: true,
                                            message: '课程简介不能为空',
                                        }],
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="请填写课程简介" rows={10}/>
                                    )}
                                </FormItem>
                                <FormItem className="originalPrice" {...formItemLayout_8} label="课程原价：">
                                    {getFieldDecorator('originalPrice', {
                                        initialValue: data.originalPrice,
                                        rules: [{
                                            required: true,
                                            message: '课程原价不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={2} step={100}/>
                                    )}
                                </FormItem>
                                <FormItem className="price" {...formItemLayout_8} label="课程现价：">
                                    {getFieldDecorator('price', {
                                        initialValue: data.price,
                                        rules: [{
                                            required: true,
                                            message: '课程现价不能为空',
                                        }],
                                    })(
                                        <InputNumber min={0} precision={2} step={100}/>
                                    )}
                                </FormItem>
                                <FormItem className="tips longItem" {...formItemLayout_14} label="购买须知：">
                                    {getFieldDecorator('tips', {
                                        initialValue: data.tips,
                                        rules: [{
                                            required: true,
                                            message: "购买须知不能为空"
                                        }],
                                    })(
                                        <TextArea style={{resize: "none"}} placeholder="请填写课程购买须知"
                                                  autosize={{minRows: 5, maxRows: 10}}/>
                                    )}
                                </FormItem>
                            </Form>
                        </div>
                }
            </Modal>
        );
    }
);

//课程信息编辑组件
class ItemEdit extends Component {
    state = {
        visible: false,
        // 课程基本信息
        data: {},
        // 课程类型
        courseType: null,
        // 课程图片相关变量
        viewPic: "",
        photoList: [],
        avatarEditor: {
            scale: 1,
            positionX: 0.5,
            positionY: 0.5
        },
        photoLoading: false,
        // 科目列表
        subjectList: [],
        // 适合年龄列表
        studentTypeList: [],
        // 当前适合年龄字段信息
        studentType: {
            str: "",
            ageOne: null,
            ageTwo: null
        },
        // 适合基础列表
        studentLevelList: [],
        // 初始课时列表
        lessonListInit: [],
        // 当前课时列表
        lessonList: [],
        // 课程特色列表
        characteristicList: [{index: 1, value: ""}],
        confirmLoading: false
    };

    // 获取课程基本信息
    getData = () => {
        reqwest({
            url: '/course/getDetail',
            type: 'json',
            method: 'post',
            data: {
                courseId: this.props.id
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: {
                //         courseInfo: {
                //             address: "",
                //             areaId: null,
                //             areaName: "",
                //             street: "",
                //             characteristic: "001@002@003",
                //             cityId: null,
                //             cityName: "",
                //             count: 1,
                //             courseType: 0,
                //             number: 1,
                //             createTime: "",
                //             duration: 1,
                //             lat: "",
                //             lng: "",
                //             name: "1",
                //             parentTypeId: 1,
                //             parentTypeName: "",
                //             photo: "1",
                //             photo2: "",
                //             photo3: "",
                //             photo4: "",
                //             photo5: "",
                //             originalPrice: "1",
                //             price: "1",
                //             provinceId: null,
                //             provinceName: "",
                //             status: null,
                //             studentLevelId: 2,
                //             studentLevelName: "",
                //             studentTypeIds: "2",
                //             submitTime: "",
                //             target: "1",
                //             sketch: "1",
                //             throughTime: "",
                //             typeId: 222,
                //             typeName: "",
                //             updateTime: "",
                //             tips: "1"
                //         }
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    // 已有机构图片写入
                    const photoList = [];
                    if (json.data.courseInfo.photo && json.data.courseInfo.photo !== "0") {
                        photoList.push(json.data.courseInfo.photo)
                    } else {
                        json.data.courseInfo.photo = 0;
                    }
                    if (json.data.courseInfo.photo2 && json.data.courseInfo.photo2 !== "0") {
                        photoList.push(json.data.courseInfo.photo2)
                    } else {
                        json.data.courseInfo.photo2 = 0;
                    }
                    if (json.data.courseInfo.photo3 && json.data.courseInfo.photo3 !== "0") {
                        photoList.push(json.data.courseInfo.photo3)
                    } else {
                        json.data.courseInfo.photo3 = 0
                    }
                    if (json.data.courseInfo.photo4 && json.data.courseInfo.photo4 !== "0") {
                        photoList.push(json.data.courseInfo.photo4)
                    } else {
                        json.data.courseInfo.photo4 = 0
                    }
                    if (json.data.courseInfo.photo5 && json.data.courseInfo.photo5 !== "0") {
                        photoList.push(json.data.courseInfo.photo5)
                    } else {
                        json.data.courseInfo.photo5 = 0
                    }
                    // 适合年龄字段为空处理
                    if (!json.data.courseInfo.studentTypeIds) {
                        json.data.courseInfo.studentTypeIds = ""
                    }
                    // 已有课程特色项写入
                    let tempCharacteristic = [];
                    if (json.data.courseInfo.characteristic) {
                        json.data.courseInfo.characteristic.split("@").forEach((item, index) => {
                            tempCharacteristic.push({index: index + 1, value: item});
                        });
                    } else {
                        tempCharacteristic = this.state.data_characteristic
                    }
                    // 信息写入
                    this.setState({
                        data: json.data.courseInfo,
                        courseType: json.data.courseInfo.courseType,
                        photoList: photoList,
                        characteristicList: tempCharacteristic,
                    }, () => {
                        // 基本信息写入后，获取适合年龄与适合基础列表，写入studentType
                        this.getStudentTypeAndLevelList();
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
                //         },
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        subjectList: json.data
                    })
                }
            }
        });
    };

    // 获取适合年龄与适合基础列表，写入studentType
    getStudentTypeAndLevelList = () => {
        reqwest({
            url: '/course/getTypeAndBasics',
            type: 'json',
            method: 'post',
            data: {
                eId: this.props.eId
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // if (json.result === 0) {
                //     let studentTypeName = "";
                //     const fnFilter = (para) => {
                //         return para.id === Number(this.state.data.studentTypeIds)
                //     };
                //     if (json.data.studentTypeList.filter(fnFilter)[0]) {
                //         studentTypeName = json.data.studentTypeList.filter(fnFilter)[0].name;
                //     }
                //     this.setState({
                //         studentTypeList: json.data.studentTypeList,
                //         studentType: {
                //             str: studentTypeName,
                //             ageOne: null,
                //             ageTwo: null
                //         },
                //         studentLevelList: json.data.studentLevelList,
                //     })
                // }
            },
            success: (json) => {
                if (json.result === 0) {
                    let studentTypeName = "";
                    const fnFilter = (para) => {
                        return para.id === Number(this.state.data.studentTypeIds)
                    };
                    if (json.data.studentTypeList.filter(fnFilter)[0]) {
                        studentTypeName = json.data.studentTypeList.filter(fnFilter)[0].name;
                    }
                    this.setState({
                        studentTypeList: json.data.studentTypeList,
                        studentType: {
                            str: studentTypeName,
                            ageOne: null,
                            ageTwo: null
                        },
                        studentLevelList: json.data.studentLevelList,
                    })
                }
            }
        });
    };

    //获取课时列表
    getLessonList = () => {
        reqwest({
            url: '/lesson/getLessonList',
            type: 'json',
            method: 'post',
            data: {
                courseId: this.props.id
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: [
                //         {id: 1, lessonName: "001"},
                //         {id: 2, lessonName: "002"},
                //         {id: 3, lessonName: "003"},
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    let dataInit = [];
                    let data = [];
                    if (json.data.length) {
                        json.data.forEach((item, index) => {
                            dataInit.push(item.id + "@" + item.lessonName);
                            data.push({index: index + 1, id: item.id, value: item.lessonName, flag: true});
                        });
                    }
                    this.setState({
                        lessonListInit: dataInit,
                        lessonList: data
                    })
                }
            }
        });
    };

    showModal = () => {
        this.getData();
        this.getSubjectList();
        this.getLessonList();
        this.setState({visible: true})
    };

    // 课程类型设置
    setCourseType = (value) => {
        this.setState({
            courseType: value
        })
    };

    // 图片处理
    getBase64Image = (url, width, height) => {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        const image = new Image();
        image.crossOrigin = '';
        image.src = url;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width ? width : image.width;
            canvas.height = height ? height : image.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/jpeg", 0.92);
            this.setState({
                viewPic: dataURL,
                effectPic: dataURL,
            })
        };
    };
    setViewPic = (para) => {
        this.setState({
            viewPic: para
        })
    };
    setAvatarEditor = (index, value) => {
        if (this.state.viewPic.slice(26) === this.state.data_pic) {
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
    picUpload = (para) => {
        if (this.state.photoList.length >= 5) {
            message.error("图片最多上传5张");
            return
        } else {
            const formData = new FormData();
            formData.append("file", para);
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
                        photoLoading: false,
                    })
                },
                success: (json) => {
                    if (json.result === 0) {
                        message.success("图片提交成功");
                        let photoList = this.state.photoList;
                        photoList.push(json.data.url);
                        this.setState({
                            photoList: photoList,
                            viewPic: "",
                            avatarEditor: {
                                scale: 1,
                                positionX: 0.5,
                                positionY: 0.5
                            },
                            photoLoading: false,
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
        }
    };
    // 图片删除
    setPhotoList = (index) => {
        let data = this.state.photoList;
        data.splice(index, 1);
        this.setState({
            photoList: data
        })
    };

    // 适合年龄字段有效信息写入
    setStudentType = (type, value) => {
        // 分支1，适合年龄字符串信息写入
        if (type === 1) {
            this.setState({
                studentType: {
                    str: value,
                    ageOne: null,
                    ageTwo: null
                }
            })
        }
        // 分支2：年龄下限写入
        if (type === 2) {
            this.setState({
                studentType: {
                    str: (value || value === 0) ? "" : this.state.studentType.str,
                    ageOne: value,
                    ageTwo: this.state.studentType.ageTwo
                }
            })
        }
        // 年龄上限写入
        if (type === 3) {
            this.setState({
                studentType: {
                    str: (value || value === 0) ? "" : this.state.studentType.str,
                    ageOne: this.state.studentType.ageOne,
                    ageTwo: value
                }
            })
        }
    };

    // 课时字段处理
    fn_lesson = (index, value) => {
        const tempItems = this.state.lessonList;
        if (index === undefined) {
            tempItems.push({
                index: tempItems.length ? (tempItems[tempItems.length - 1].index + 1) : 1,
                id: 0,
                value: "",
                flag: true
            });
            this.setState({
                lessonList: tempItems
            })
        } else {
            tempItems.forEach((item, itemIndex) => {
                if (item.index === index) {
                    index = itemIndex
                }
            });
            if (value === undefined) {
                if (tempItems[index].id) {
                    tempItems[index].flag = false;
                    tempItems[index].value = "";
                } else {
                    tempItems.splice(index, 1);
                }
                this.setState({
                    lessonList: tempItems
                })
            } else {
                tempItems[index].value = value;
                this.setState({
                    lessonList: tempItems
                })
            }
        }
    };

    // 课程特色字段处理
    fn_characteristic = (index, value) => {
        if (index === undefined) {
            // 列表项新增分支
            const tempPara = this.state.characteristicList;
            tempPara.push({index: tempPara.length ? (tempPara[tempPara.length - 1].index + 1) : 1, value: ""});
            this.setState({
                characteristicList: tempPara
            })
        } else {
            if (value === undefined) {
                // 列表项删除分支
                const tempPara = this.state.characteristicList;
                tempPara.splice(index, 1);
                this.setState({
                    characteristicList: tempPara
                })
            } else {
                // 列表项修改分支
                const tempPara = this.state.characteristicList;
                tempPara[index].value = value;
                this.setState({
                    characteristicList: tempPara
                })
            }
        }
    };

    // 信息比对函数
    dataContrast = (values) => {
        const initValues = this.state.data;
        // 待比对常规项
        const itemList = ["name", "courseType", "photo", "photo2", "photo3", "photo4", "photo5", "typeId", "studentLevelId", "count", "number", "duration", "originalPrice", "price", "target", "characteristic", "sketch", "tips"];
        const result = {};

        // 常规项比对
        itemList.forEach((item) => {
            if (values[item] !== initValues[item]) {
                result[item] = values[item];
            }
        });
        // 课程适合年龄项比对--------------------------------------
        // suitAge存在则suitAge写入result
        if (values.suitAge) {
            result.suitAge = values.suitAge
        } else {
            // suitAge不存在则进行studentType判断
            // 有变化则studentType写入result
            if (String(values.studentType) !== initValues.studentTypeIds) {
                result.studentType = values.studentType;
            }
        }
        // 课程课时项比对------------------------------------------
        values.lessonName.forEach((item, index) => {
            if (item !== this.state.lessonListInit[index]) {
                result.lessonName = values.lessonName
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

    // 取消处理
    handleCancel = () => {
        const form = this.form;
        // 取消操作函数
        const cancel = () => {
            this.setState({
                visible: false
            }, () => {
                this.setState({
                    data: {},
                    courseType: null,
                    viewPic: "",
                    photoList: [],
                    avatarEditor: {
                        scale: 1,
                        positionX: 0.5,
                        positionY: 0.5
                    },
                    photoLoading: false,
                    subjectList: [],
                    studentTypeList: [],
                    studentType: {
                        str: "",
                        ageOne: null,
                        ageTwo: null
                    },
                    studentLevelList: [],
                    lessonListInit: [],
                    lessonList: [],
                    characteristicList: [{index: 1, value: ""}],
                    confirmLoading: false,
                });
            })
        };
        // 课程基本信息为空的处理
        if (JSON.stringify(this.state.data) === "{}") {
            cancel();
            return;
        }
        // 获取表单数据
        let values = form.getFieldsValue();
        // 课程图片写入
        values.photo = this.state.photoList[0] || 0;
        values.photo2 = this.state.photoList[1] || 0;
        values.photo3 = this.state.photoList[2] || 0;
        values.photo4 = this.state.photoList[3] || 0;
        values.photo5 = this.state.photoList[4] || 0;
        // 课程typeId写入(二级科目id写入)
        values.typeId = values.typeId[1];
        // 适合年龄写入------------------------------------
        // studentType写入
        values.studentType = "";
        if (this.state.studentType.str) {
            // str存在，则写入studentType
            values.studentType = this.state.studentType.str
        } else {
            // str不存在，则写入ageOne与ageTwo拼接后的信息
            values.studentType = this.state.studentType.ageOne + "-" + this.state.studentType.ageTwo + "岁"
        }
        // 校验studentType是否已存在于studentTypeList中，是则以id替换文本，studentType数据类型由string变更为number
        this.state.studentTypeList.forEach((item) => {
            if (item.name === values.studentType) {
                values.studentType = item.id
            }
        });
        // studentType不存在于studentTypeList中，则将studentType的值写入suitAge并清空studentType
        if (values.studentType && (typeof(values.studentType) === "string")) {
            values.suitAge = values.studentType;
            values.studentType = ""
        }
        // 课程课时写入-------------------------------------
        const lessonList = [];
        this.state.lessonList.forEach((item) => {
            if (item.id) {
                // id存在，为修改或删除项
                lessonList.push(item.id + "@" + item.value);
            } else {
                // id不存在，为新增项
                lessonList.push(item.value);
            }
        });
        values.lessonName = lessonList;
        // 课程特色写入-------------------------------------
        let characteristic = "";
        this.state.characteristicList.forEach((item) => {
            if (!item.value) {
                return;
            }
            characteristic += (item.value + "@");
        });
        values.characteristic = characteristic.slice(0, -1);
        // 信息比对
        const result = this.dataContrast(values);
        // 比对结果处理
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
            cancel()
        }
    };

    // 确认处理
    handleCreate = () => {
        // 课程基本信息为空的处理
        if (JSON.stringify(this.state.data) === "{}") {
            return;
        }
        const form = this.form;
        // 获取表单数据并进行必填项校验
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            // 课程图片写入与校验
            values.photo = this.state.photoList[0] || 0;
            values.photo2 = this.state.photoList[1] || 0;
            values.photo3 = this.state.photoList[2] || 0;
            values.photo4 = this.state.photoList[3] || 0;
            values.photo5 = this.state.photoList[4] || 0;
            if (!values.photo) {
                message.error("课程图片未选择或未提交");
                return
            }
            // 课程typeId写入(二级科目id写入)
            values.typeId = values.typeId[1];
            // 适合年龄写入------------------------------------
            values.studentType = "";
            if (this.state.studentType.str) {
                // str存在，则写入studentType
                values.studentType = this.state.studentType.str
            } else {
                // str不存在的分支操作
                if (this.state.studentType.ageOne || this.state.studentType.ageOne === 0) {
                    if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                        if (this.state.studentType.ageOne >= this.state.studentType.ageTwo) {
                            message.error("适合年龄区间有误");
                            return;
                        }
                        values.studentType = this.state.studentType.ageOne + "-" + this.state.studentType.ageTwo + "岁"
                    } else {
                        message.error("适合年龄区间有误");
                        return;
                    }
                } else {
                    if (this.state.studentType.ageTwo || this.state.studentType.ageTwo === 0) {
                        message.error("适合年龄区间有误");
                        return;
                    }
                }
            }
            if (!values.studentType) {
                message.error("适合年龄不能为空");
                return;
            }
            // 校验studentType是否已存在于studentTypeList中，是则以id替换文本，studentType数据类型由string变更为number
            this.state.studentTypeList.forEach((item) => {
                if (item.name === values.studentType) {
                    values.studentType = item.id
                }
            });
            // studentType不存在于studentTypeList中，则将studentType的值写入suitAge并清空studentType
            if (values.studentType && (typeof(values.studentType) === "string")) {
                values.suitAge = values.studentType;
                values.studentType = ""
            }
            // 课程课时写入---------------------------------------
            const lessonList = [];
            this.state.lessonList.forEach((item) => {
                if (item.id) {
                    // id存在，为修改或删除项
                    lessonList.push(item.id + "@" + item.value);
                } else {
                    // id不存在，为新增项
                    lessonList.push(item.value);
                }
            });
            values.lessonName = lessonList;
            // 课程特色写入---------------------------------------
            let characteristic = "";
            this.state.characteristicList.forEach((item) => {
                if (!item.value) {
                    return;
                }
                characteristic += (item.value + "@");
            });
            values.characteristic = characteristic.slice(0, -1);
            // 信息比对
            const result = this.dataContrast(values);
            if (!result) {
                message.error("暂无信息更改");
                return;
            }
            this.setState({
                confirmLoading: true
            });
            reqwest({
                url: '/course/edit',
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
                        message.success("课程信息修改成功");
                        this.setState({
                            visible: false
                        }, () => {
                            this.setState({
                                data: {},
                                courseType: null,
                                viewPic: "",
                                photoList: [],
                                avatarEditor: {
                                    scale: 1,
                                    positionX: 0.5,
                                    positionY: 0.5
                                },
                                photoLoading: false,
                                subjectList: [],
                                studentTypeList: [],
                                studentType: {
                                    str: "",
                                    ageOne: null,
                                    ageTwo: null
                                },
                                studentLevelList: [],
                                lessonListInit: [],
                                lessonList: [],
                                characteristicList: [{index: 1, value: ""}],
                                confirmLoading: false,
                            });
                        });
                        this.props.recapture();
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

    render() {
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>编辑</span>
                <ItemEditForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    id={this.props.id}
                    data={this.state.data}
                    courseType={this.state.courseType}
                    setCourseType={this.setCourseType}
                    subjectList={this.state.subjectList}
                    studentType={this.state.studentType}
                    setStudentType={this.setStudentType}
                    studentTypeList={this.state.studentTypeList}
                    studentLevelList={this.state.studentLevelList}
                    viewPic={this.state.viewPic}
                    setViewPic={this.setViewPic}
                    picUpload={this.picUpload}
                    avatarEditor={this.state.avatarEditor}
                    setAvatarEditor={this.setAvatarEditor}
                    photoList={this.state.photoList}
                    setPhotoList={this.setPhotoList}
                    photoLoading={this.state.photoLoading}
                    lessonList={this.state.lessonList}
                    fn_lesson={this.fn_lesson}
                    characteristicList={this.state.characteristicList}
                    fn_characteristic={this.fn_characteristic}
                    confirmLoading={this.state.confirmLoading}
                />
            </a>
        );
    }
}

//课程详情组件
class ItemDetails extends Component {
    state = {
        visible: false,
        loading: true,
        // 学生类型列表
        studentTypeList: [],
        // 课程课时列表
        lessonList: [],
        // 课程基本信息
        data: "",
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

    // 获取该课程所属机构可见学生类型列表
    getStudentTypeList = () => {
        reqwest({
            url: '/course/getTypeAndBasics',
            type: 'json',
            method: 'post',
            data: {
                eId: this.props.eId
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: {
                //         studentTypeList: [
                //             {id: 1, name: ""},
                //         ],
                //         studentLevelList: [
                //             {id: 1, name: ""},
                //         ],
                //     }
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    this.setState({
                        studentTypeList: json.data.studentTypeList
                    })
                }
            }
        });
    };

    // 获取课程基本信息
    getData = () => {
        reqwest({
            url: '/course/getDetail',
            type: 'json',
            method: 'post',
            data: {
                courseId: this.props.id
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
                //         courseInfo: {
                //             address: "",
                //             areaId: null,
                //             areaName: "",
                //             characteristic: "",
                //             cityId: null,
                //             cityName: "",
                //             count: null,
                //             courseType: null,
                //             number: null,
                //             createTime: "",
                //             duration: null,
                //             lat: "",
                //             lng: "",
                //             name: "",
                //             parentTypeId: null,
                //             parentTypeName: "",
                //             photo: "",
                //             photo2: "",
                //             photo3: "",
                //             photo4: "",
                //             photo5: "",
                //             originalPrice: "",
                //             price: "",
                //             provinceId: null,
                //             provinceName: "",
                //             studentLevelId: null,
                //             studentLevelName: "",
                //             studentTypeIds: "",
                //             submitTime: "",
                //             target: "",
                //             sketch: "",
                //             throughTime: "",
                //             typeId: null,
                //             typeName: "",
                //             updateTime: "",
                //             status: null,
                //         }
                //     },
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    // 课程特色字段处理
                    const characteristic = [];
                    if (json.data.courseInfo.characteristic) {
                        json.data.courseInfo.characteristic.split("@").forEach((item, index) => {
                            characteristic.push(<p key={index}>{item}</p>);
                        });
                        json.data.courseInfo.characteristic = characteristic;
                    }
                    this.setState({
                        loading: false,
                        data: json.data.courseInfo
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

    // 获取课时列表
    getLessonList = () => {
        reqwest({
            url: '/lesson/getLessonList',
            type: 'json',
            method: 'post',
            data: {
                courseId: this.props.id
            },
            headers: {
                Authorization: sessionStorage.token
            },
            error: (XMLHttpRequest) => {
                // const json = {
                //     result: 0,
                //     data: [
                //         {id: 1, lessonName: ""},
                //     ]
                // };
            },
            success: (json) => {
                if (json.result === 0) {
                    let data = [];
                    json.data.forEach((item, index) => {
                        data.push(<p key={index}>{item.lessonName}</p>);
                    });
                    this.setState({
                        lessonList: data
                    })
                }
            }
        });
    };

    showModal = () => {
        this.getStudentTypeList();
        this.getLessonList();
        this.getData();
        this.setState({
            visible: true,
        })
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        let dataSource;
        if (this.state.data) {
            // 课程类型
            let tempCourseType = "";
            if (this.state.data.courseType === 0) {
                tempCourseType = "线下正式课";
            }
            if (this.state.data.courseType === 1) {
                tempCourseType = "视频课程";
            }
            if (this.state.data.courseType === 2) {
                tempCourseType = "线下体验课";
            }
            // 学生类型
            let tempStudentTypeName = "";
            if (this.state.studentTypeList.length && this.state.data.studentTypeIds) {
                const fn_filter = (item) => {
                    return item.id === Number(this.state.data.studentTypeIds);
                };
                tempStudentTypeName = this.state.studentTypeList.filter(fn_filter)[0] ? this.state.studentTypeList.filter(fn_filter)[0].name : "";
            }
            // 课程状态
            let tempStatus = "";
            if (this.state.data.status === 0) {
                tempStatus = "已驳回";
            }
            if (this.state.data.status === 1) {
                tempStatus = "审核中";
            }
            if (this.state.data.status === 2) {
                tempStatus = "审核通过";
            }
            if (this.state.data.status === 3) {
                tempStatus = "删除";
            }
            if (this.state.data.status === 4) {
                tempStatus = "已下架";
            }
            if (this.state.data.status === 5) {
                tempStatus = "暂存";
            }
            dataSource = [
                <div className="name">
                    <span className="item-name">课程名称：</span>
                    <span className="item-content">{this.state.data.name}</span>
                </div>,
                <div className="courseType">
                    <span className="item-name">课程类型：</span>
                    <span className="item-content">{tempCourseType || "暂无"}</span>
                </div>,
                <div className="eName">
                    <span className="item-name">所属机构：</span>
                    <span className="item-content">{this.state.data.EName || "暂无"}</span>
                </div>,
                <div className="subject">
                    <span className="item-name">科目：</span>
                    <span
                        className="item-content">{this.state.data.typeId ? (this.state.data.parentTypeName + "/" + this.state.data.typeName) : "暂无"}</span>
                </div>,
                <div className="photo">
                    <span className="item-name">图片一：</span>
                    {
                        this.state.data.photo && this.state.data.photo !== "0" ?
                            <img src={"http://image.taoerxue.com/" + this.state.data.photo} alt=""
                                 className="item-content"/>
                            :
                            <span className="item-content">暂无</span>
                    }
                </div>,
                <div className="photo">
                    <span className="item-name">图片二：</span>
                    {
                        this.state.data.photo2 && this.state.data.photo2 !== "0" ?
                            <img src={"http://image.taoerxue.com/" + this.state.data.photo2} alt=""
                                 className="item-content"/>
                            :
                            <span className="item-content">暂无</span>
                    }
                </div>,
                <div className="photo">
                    <span className="item-name">图片三：</span>
                    {
                        this.state.data.photo3 && this.state.data.photo3 !== "0" ?
                            <img src={"http://image.taoerxue.com/" + this.state.data.photo3} alt=""
                                 className="item-content"/>
                            :
                            <span className="item-content">暂无</span>
                    }
                </div>,
                <div className="photo">
                    <span className="item-name">图片四：</span>
                    {
                        this.state.data.photo4 && this.state.data.photo4 !== "0" ?
                            <img src={"http://image.taoerxue.com/" + this.state.data.photo4} alt=""
                                 className="item-content"/>
                            :
                            <span className="item-content">暂无</span>
                    }
                </div>,
                <div className="photo">
                    <span className="item-name">图片五：</span>
                    {
                        this.state.data.photo5 && this.state.data.photo5 !== "0" ?
                            <img src={"http://image.taoerxue.com/" + this.state.data.photo5} alt=""
                                 className="item-content"/>
                            :
                            <span className="item-content">暂无</span>
                    }
                </div>,
                <div className="studentTypeName">
                    <span className="item-name">适合年龄：</span>
                    <span className="item-content">{tempStudentTypeName || "暂无"}</span>
                </div>,
                <div className="studentLevelName">
                    <span className="item-name">适合基础：</span>
                    <span className="item-content">{this.state.data.studentLevelName || "暂无"}</span>
                </div>,
                <div className="number">
                    <span className="item-name">开班人数：</span>
                    <span
                        className="item-content">{(this.state.data.number === undefined || this.state.data.courseType === 2) ? "暂无" : this.state.data.number}</span>
                </div>,
                <div className="duration">
                    <span className="item-name">单节时长：</span>
                    <span
                        className="item-content">{this.state.data.duration ? (this.state.data.duration + "分钟") : "暂无"}</span>
                </div>,
                <div className="duration">
                    <span className="item-name">已购买份数：</span>
                    <span
                        className="item-content">{this.state.data.soldQuantity || "暂无"}</span>
                </div>,
                <div className="duration">
                    <span className="item-name">访问量：</span>
                    <span
                        className="item-content">{this.state.data.queryNum || "暂无"}</span>
                </div>,
                <div className="duration">
                    <span className="item-name">创建人：</span>
                    <span
                        className="item-content">{this.state.data.createUserName || "暂无"}</span>
                </div>,
                <div className="count">
                    <span className="item-name">课时数：</span>
                    <span className="item-content">{this.state.data.count || "暂无"}</span>
                </div>,
                <div className="lessonList">
                    <span className="item-name">课时安排：</span>
                    <div className="item-content">
                        {this.state.lessonList.length ? this.state.lessonList : "暂无"}
                    </div>
                </div>,
                <div className="characteristic">
                    <span className="item-name">课程特色：</span>
                    <pre>
                    <div className="item-content">{this.state.data.characteristic || "暂无"}</div>
                </pre>
                </div>,
                <div className="sketch">
                    <span className="item-name">课程简介：</span>
                    <pre>
                    <span className="item-content">{this.state.data.sketch || "暂无"}</span>
                </pre>
                </div>,
                <div className="target">
                    <span className="item-name">学习目标：</span>
                    <pre>
                    <span className="item-content">{this.state.data.target || "暂无"}</span>
                </pre>
                </div>,
                <div className="originalPrice">
                    <span className="item-name">课程原价：</span>
                    <span className="item-content">{this.state.data.originalPrice || "暂无"}</span>
                </div>,
                <div className="price">
                    <span className="item-name">课程现价：</span>
                    <span className="item-content">{this.state.data.price || "暂无"}</span>
                </div>,
                <div className="address">
                    <span className="item-name">详细地址：</span>
                    <span className="item-content">{this.state.data.address || "暂无"}</span>
                </div>,
                <div className="tips">
                    <span className="item-name">购买须知：</span>
                    <pre>
                    <span className="item-content">{this.state.data.tips || "暂无"}</span>
                </pre>
                </div>,
                <div className="createTime">
                    <span className="item-name">创建日期：</span>
                    <span
                        className="item-content">{this.state.data.createTime ? this.timeHandle(this.state.data.createTime) : ""}</span>
                </div>,
                <div className="opinion">
                    <span className="item-name">审核意见：</span>
                    <pre>
                    <span className="item-content">{this.state.data.opinion || "暂无"}</span>
                </pre>
                </div>,
                <div className="status">
                    <span className="item-name">课程状态：</span>
                    <span className="item-content">{tempStatus}</span>
                </div>
            ];
        } else {
            dataSource = ""
        }
        return (
            <a style={{display: this.props.opStatus ? "inline" : "none"}}>
                <span onClick={this.showModal}>详情</span>
                <Modal
                    title="课程详情"
                    width={600}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <div className="course-details item-details">
                        <div className="course-baseData">
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

//课程列表
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            typeList: [],
            type: null,
            data: [],
            pagination: {
                current: 1,
                pageSize: Number(localStorage.coursePageSize) || 10,
                pageSizeOptions: ["5", "10", "15", "20"],
                showQuickJumper: true,
                showSizeChanger: true
            },
        };
        this.columns = Number(sessionStorage.EId) === 0 ?
        // 系统管理员列配置（展示所属机构项）
        [
            {
                title: '序号',
                dataIndex: 'index',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'index'),
            },
            {
                title: '排序',
                dataIndex: 'sort',
                width: '5%',
                editable: true,
                // render: (text, record) => this.renderColumns(text, record, 'sort'),
            },
            {
                title: '课程名称',
                dataIndex: 'name',
                width: '10%',
                render: (text, record) => this.renderColumns(text, record, 'name'),
            },
            {
                title: '课程类型',
                dataIndex: 'courseType',
                width: '8%',
                render: (text, record) => this.renderColumns(text, record, 'courseType'),
            },
            {
                title: '所属机构',
                dataIndex: 'eName',
                width: '15%',
                render: (text, record) => this.renderColumns(text, record, 'eName'),
            },
            {
                title: '图片',
                dataIndex: 'photo',
                width: '5%',
                render: (text, record) => (
                    <img style={{width: '45px', height: "25px"}} alt="" src={record["photo"]}/>)
            },
            {
                title: '科目',
                dataIndex: 'typeName',
                width: '8%',
                filters: this.state.typeList,
                filterMultiple: false,
                render: (text, record) => this.renderColumns(text, record, 'typeName'),
            },
            {
                title: '开班人数',
                dataIndex: 'number',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'number'),
            },
            {
                title: '已购买份数',
                dataIndex: 'soldQuantity',
                width: '7%',
                render: (text, record) => this.renderColumns(text, record, 'soldQuantity'),
            },
            {
                title: '访问量',
                dataIndex: 'queryNum',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'queryNum'),
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'createUserName'),
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'createTime'),
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: '4%',
                render: (text, record) => this.renderColumns(text, record, 'status'),
            },
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {/*课程详情*/}
                            <ItemDetails id={record.id} eId={record.eId} opStatus={this.props.opObj.select}
                                         toLoginPage={this.props.toLoginPage}/>
                            {/*课程编辑（仅超级管理员可见）*/}
                            <ItemEdit id={record.id} eId={record.eId} recapture={this.getData}
                                      toLoginPage={this.props.toLoginPage}
                                      opStatus={this.props.opObj.modify && Number(sessionStorage.adminType) === 0 ? 1 : 0}/>
                            {/*课程下架*/}
                            <Popconfirm title="确认下架?"
                                        placement="topRight"
                                        onConfirm={() => this.itemBan(record.id)}
                                        onCancel=""
                                        okType="danger"
                                        okText="确认"
                                        cancelText="取消">
                                <a style={{display: this.props.opObj.modify && record.statusCode === 2 ? "inline" : "none"}}>下架</a>
                            </Popconfirm>
                        </div>
                    );
                },
            }
        ]
        :
        // 机构管理员列配置
        [
            {
                title: '序号',
                dataIndex: 'index',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'index'),
            },
            {
                title: '排序',
                dataIndex: 'sort',
                width: '5%',
                editable: true,
                // render: (text, record) => this.renderColumns(text, record, 'sort'),
            },
            {
                title: '课程名称',
                dataIndex: 'name',
                width: '10%',
                render: (text, record) => this.renderColumns(text, record, 'name'),
            },
            {
                title: '课程类型',
                dataIndex: 'courseType',
                width: '8%',
                render: (text, record) => this.renderColumns(text, record, 'courseType'),
            },
            {
                title: '图片',
                dataIndex: 'photo',
                width: '5%',
                render: (text, record) => (
                    <img style={{width: '45px', height: "25px"}} alt="" src={record["photo"]}/>)
            },
            {
                title: '科目',
                dataIndex: 'typeName',
                width: '8%',
                filters: this.state.typeList,
                filterMultiple: false,
                render: (text, record) => this.renderColumns(text, record, 'typeName'),
            },
            {
                title: '开班人数',
                dataIndex: 'number',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'number'),
            },
            {
                title: '已购买份数',
                dataIndex: 'soldQuantity',
                width: '7%',
                render: (text, record) => this.renderColumns(text, record, 'soldQuantity'),
            },
            {
                title: '访问量',
                dataIndex: 'queryNum',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'queryNum'),
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                width: '5%',
                render: (text, record) => this.renderColumns(text, record, 'createUserName'),
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                width: '6%',
                render: (text, record) => this.renderColumns(text, record, 'createTime'),
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: '4%',
                render: (text, record) => this.renderColumns(text, record, 'status'),
            },
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {/*课程详情*/}
                            <ItemDetails id={record.id} eId={record.eId} opStatus={this.props.opObj.select}
                                         toLoginPage={this.props.toLoginPage}/>
                            {/*课程下架*/}
                            <Popconfirm title="确认下架?"
                                        placement="topRight"
                                        onConfirm={() => this.itemBan(record.id)}
                                        onCancel=""
                                        okType="danger"
                                        okText="确认"
                                        cancelText="取消">
                                <a style={{display: this.props.opObj.modify && record.statusCode === 2 ? "inline" : "none"}}>下架</a>
                            </Popconfirm>
                        </div>
                    );
                },
            }
        ];
    }

    // 设置排序
    handleSave = (row) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/course/saveCourseSort',
            type: 'json',
            method: 'get',
            data: {
                // 机构Id
                courseId: row.id,
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

    // 课程类型处理
    courseTypeHandle = (courseType) => {
        return courseType === 0 ? "线下正式课" : "线下体验课";
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

    // 获取本页信息
    getData = (keyword) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/course/getCourseList',
            type: 'json',
            method: 'post',
            data: {
                parentTypeId: this.state.type,
                educationName: keyword ? keyword.educationName : this.props.keyword.educationName,
                courseName: keyword ? keyword.courseName : this.props.keyword.courseName,
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
                //         size: 100,
                //         list: [
                //             {
                //                 id: 1,
                //                 EId: null,
                //                 name: "",
                //                 typeName: "",
                //                 duration: null,
                //                 characteristic: "",
                //                 courseType: null,
                //                 photo: "",
                //                 price: "",
                //                 status: 5
                //             },
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
                        // 一级类目名称获取
                        let filterFn = (item_type) => {
                            return item_type.value === item.parentTypeId
                        };
                        const parentTypeName = this.state.typeList.filter(filterFn)[0] ? this.state.typeList.filter(filterFn)[0].text : "";
                        // 课程状态
                        let tempStatus = "";
                        if (item.status === 0) {
                            tempStatus = "已驳回";
                        }
                        if (item.status === 1) {
                            tempStatus = "审核中";
                        }
                        if (item.status === 2) {
                            tempStatus = "启用";
                        }
                        if (item.status === 3) {
                            tempStatus = "删除";
                        }
                        if (item.status === 4) {
                            tempStatus = "已下架";
                        }
                        data.push({
                            key: index.toString(),
                            id: item.id,
                            eId: item.EId || item.eduId,
                            eName: item.EName || item.eduName,
                            index: index + 1,
                            sort: item.sort,
                            name: item.name,
                            duration: item.duration,
                            photo: global.config.photoUrl + item.photo,
                            typeName: parentTypeName + "/" + item.typeName,
                            experience: item.experience,
                            courseType: item.courseType === 0 ? "线下正式课" : "线下体验课",
                            number: item.number || 0,
                            soldQuantity: item.soldQuantity || 0,
                            queryNum: item.queryNum || 0,
                            createUserName: item.createUserName || "暂无",
                            createTime: item.createTime ? this.dateHandle(item.createTime) : "",
                            statusCode: item.status,
                            status: tempStatus,
                            
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
                        this.setState({
                            loading: false
                        })
                    }
                }
            }
        });
    };

    // 获取科目列表
    getInstitutionTypeList = () => {
        reqwest({
            url: '/institution/getEducationTypeList',
            type: 'json',
            method: 'post',
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
                //     data: [
                //         {id: 1, name: "001"}
                //     ]
                // };
            },
            success: (json) => {
                const typeList = json.data.map((item) => {
                    return {text: item.name, value: item.id}
                });
                if (json.result === 0) {
                    this.setState({
                        typeList: typeList
                    }, () => {
                        // 一级类目写入后获取课程列表信息
                        this.getData();
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
                        this.setState({
                            loading: false
                        })
                    }
                }
            }
        });
    };

    //课程下架
    itemBan = (id) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/course/checkCourse',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id,
                status: 4
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success("课程下架成功");
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
    };

    //表格参数变化处理
    handleTableChange = (pagination, filters) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        localStorage.coursePageSize = pagination.pageSize;
        pager.pageSize = Number(localStorage.coursePageSize);
        this.setState({
            type: filters.type ? filters.type[0] : null,
            pagination: pager,
        }, () => {
            this.getData();
        });
    };

    componentWillMount() {
        // 获取科目列表，数据返回后再获取课程列表
        this.getInstitutionTypeList();
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

class CoursesOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opObj: {},
            // 获取课程列表所需关键词
            keyword: {
                educationName: '',
                courseName: '',
                startTime: "",
                endTime: "",
            },
            flag_add: false
        };
        this.educationName = "";
        this.courseName = "";
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
                    })
                    this.setState({
                        opObj: data
                    })
                }
            })
        })
    };

    // 搜索
    search = (type, value) => {
        // 系统管理员分支
        if (type === 0) {
            if (this.state.keyword.educationName === this.educationName && this.state.keyword.courseName === this.courseName) {
                return
            }
            this.setState({
                keyword: {
                    educationName: this.educationName,
                    courseName: this.courseName
                }
            })
        }
        // 机构管理员分支
        if (type === 1) {
            if (value !== this.state.keyword.courseName) {
                this.setState({
                    keyword: {
                        educationName: "",
                        courseName: value,
                    }
                })
            }
        }
    };

    // 搜索关键词设置
    setInstitutionName = (event) => {
        if (event.target.value === this.educationName) {
            return
        }
        this.educationName = event.target.value
    };
    setCourseName = (event) => {
        if (event.target.value === this.courseName) {
            return
        }
        this.courseName = event.target.value
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
        console.log(this.props.location)
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
            <div className="courses">
                {
                    this.state.opObj.select ?
                        <div>33333
                            <header className="clearfix">
                                <div>
                                    {/*系统管理员筛选项---------------------------------------------------*/}
                                    {/*课程名筛选*/}
                                    <div className="course-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "300px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="课程名称" onBlur={this.setCourseName}/>
                                    </div>
                                    {/*机构名筛选*/}
                                    <div className="institution-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "320px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="机构名称" onBlur={this.setInstitutionName}/>
                                    </div>
                                    {/*确认按钮*/}
                                    <Button style={{
                                                // display: Number(sessionStorage.EId) === 0 ? "block" : "none"
                                                marginRight: "20px",
                                            }}
                                            type="primary"
                                            onClick={() => this.search(0)}>
                                        <Icon type="search" style={{fontSize: "16px"}}/>
                                    </Button>
                                    {/*机构管理员筛选项---------------------------------------------------*/}
                                    <Search placeholder="请输入课程名称信息"
                                            onSearch={(value) => this.search(1, value)}
                                            enterButton
                                            style={{
                                                display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                                width: "320px",
                                                float: "left"
                                            }}
                                    />
                                    {/*课程创建日期筛选*/}
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
                                    {/*课程添加按钮（仅机构管理员可见）*/}
                                    <div className="add-button" style={{
                                        // display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                        display: "block",
                                        float: "right"
                                    }}>
                                        <ItemAdd opStatus={this.state.opObj.add} toLoginPage={this.toLoginPage}/>
                                    </div>
                                </div> 
                            </header>
                            {/*课程列表*/}
                            <div className="table-box">
                                <DataTable opObj={this.state.opObj} keyword={this.state.keyword}
                                           flag_add={this.state.flag_add} toLoginPage={this.toLoginPage}/>
                            </div>
                        </div>
                        :
                        <div>121212
                            <header className="clearfix">
                                <div>
                                    {/*系统管理员筛选项---------------------------------------------------*/}
                                    {/*课程名筛选*/}
                                    <div className="course-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "300px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="课程名称" onBlur={this.setCourseName}/>
                                    </div>
                                    {/*机构名筛选*/}
                                    <div className="institution-filter"
                                        style={{
                                            display: Number(sessionStorage.EId) === 0 ? "block" : "none",
                                            width: "320px",
                                            float: "left",
                                            marginRight: "20px"
                                        }}>
                                        <Input placeholder="机构名称" onBlur={this.setInstitutionName}/>
                                    </div>
                                    {/*确认按钮*/}
                                    <Button style={{
                                                // display: Number(sessionStorage.EId) === 0 ? "block" : "none"
                                                marginRight: "20px",
                                            }}
                                            type="primary"
                                            onClick={() => this.search(0)}>
                                        <Icon type="search" style={{fontSize: "16px"}}/>
                                    </Button>
                                    {/*机构管理员筛选项---------------------------------------------------*/}
                                    <Search placeholder="请输入课程名称信息"
                                            onSearch={(value) => this.search(1, value)}
                                            enterButton
                                            style={{
                                                display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                                width: "320px",
                                                float: "left"
                                            }}
                                    />
                                    {/*课程创建日期筛选*/}
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
                                    {/*课程添加按钮（仅机构管理员可见）*/}
                                    <div className="add-button" style={{
                                        // display: Number(sessionStorage.EId) !== 0 ? "block" : "none",
                                        display: "block",
                                        float: "right"
                                    }}>
                                        <ItemAdd opStatus={this.state.opObj.add} toLoginPage={this.toLoginPage}/>
                                    </div>
                                </div> 
                            </header>
                            {/*课程列表*/}
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

export default CoursesOne;