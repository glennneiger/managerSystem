import React, {Component} from 'react';
import { 
    Route,
    Link,
    Switch,
    withRouter,
} from 'react-router-dom';
import {
    Table,
    Input,
    message,
    Popconfirm,
} from 'antd';
import reqwest from 'reqwest';
import UserDetail from './UserDetail';

const Search = Input.Search;

//单元格
const Cell = ({value}) => (
    <div>{value}</div>
);

//用户详情组件
// class UserDetails extends Component {
//     state = {
//         visible: false,
//         // 详细信息
//         data: "",
//         loading: true
//     };

//     // 日期处理函数
//     dateHandle = (para) => {
//         const tempDate = new Date(para.replace("CST", "GMT+0800")),
//             oMonthT = (tempDate.getMonth() + 1).toString(),
//             oMonth = oMonthT.length <= 1 ? "0" + oMonthT : oMonthT,
//             oDayT = tempDate.getDate().toString(),
//             oDay = oDayT.length <= 1 ? "0" + oDayT : oDayT,
//             oYear = tempDate.getFullYear().toString(),
//             oTime = oYear + '-' + oMonth + '-' + oDay;
//         return oTime;
//     };

//     dateHandle02 = (para) => {
//         const add0 = (m) => {
//             return m < 10 ? '0' + m : m;
//         }
//         //shijianchuo是整数，否则要parseInt转换
//         const time = new Date(para),
//             y = time.getFullYear(),
//             m = time.getMonth()+1,
//             d = time.getDate();
//         return y + '-' + add0(m) + '-' + add0(d);
//     };

//     // 获取详情
//     getData = () => {
//         reqwest({
//             url: '/sys/appUser/details',
//             type: 'json',
//             method: 'get',
//             data: {
//                 id: this.props.id
//             },
//             headers: {
//                 Authorization: sessionStorage.token
//             },
//             error: (XMLHttpRequest) => {
//                 message.error("获取失败");
//                 this.setState({
//                     loading: false
//                 })
//             },
//             success: (json) => {
//                 if (json.result === 0) {
//                     this.setState({
//                         data: json.data.appUser,
//                         loading: false
//                     })
//                 } else {
//                     if (json.code === 901) {
//                         message.error("请先登录");
//                         // 返回登陆页
//                         this.props.toLoginPage();
//                     } else if (json.code === 902) {
//                         message.error("登录信息已过期，请重新登录");
//                         // 返回登陆页
//                         this.props.toLoginPage();
//                     } else {
//                         message.error(json.message);
//                         this.setState({
//                             loading: false
//                         })
//                     }
//                 }
//             }
//         });
//     };

//     showModal = () => {
//         // 获取详情
//         this.getData();
//         this.setState({
//             visible: true,
//         })
//     };

//     handleCancel = () => {
//         this.setState({
//             visible: false
//         });
//     };

//     render() {
//         // 列表dataSource生成
//         let dataSource;
//         if(this.state.data){
//             // 详细信息对象存在，则写入dataSource
//             dataSource = [
//                 <div>
//                     <span className="item-name">姓名：</span>
//                     <span className="item-content">{this.state.data.nickname}</span>
//                 </div>,
//                 <div className="photo">
//                     <span className="item-name">头像：</span>
//                     <img src={this.state.data.photo} alt="" className="item-content"/>
//                 </div>,
//                 <div>
//                     <span className="item-name">联系电话：</span>
//                     <span className="item-content">{this.state.data.phone}</span>
//                 </div>,
//                 <div>
//                     <span className="item-name">生日：</span>
//                     <span
//                         className="item-content">{this.state.data.birthday ? this.dateHandle(this.state.data.birthday) : "暂无"}</span>
//                 </div>,
//                 <div>
//                     <span className="item-name">来源：</span>
//                     <span className="item-content">{this.state.data.appUserSource || "暂无"}</span>
//                 </div>,
//                 <div>
//                     <span className="item-name">状态：</span>
//                     <span className="item-content">{this.state.data.status===1 ? "禁用" : "启用"}</span>
//                 </div>
//             ];
//         }else{
//             // 详细信息不存在，则dataSource设为空字符串，列表展示为“暂无数据”
//             dataSource=""
//         }
//         return (
//             <a style={{display: this.props.opStatus ? "inline" : "none"}}>
//                 <span onClick={this.showModal}>详情</span>
//                 <Modal
//                     title="用户详情"
//                     visible={this.state.visible}
//                     footer={null}
//                     onCancel={this.handleCancel}
//                     destroyOnClose={true}
//                 >
//                     <div className="user-details">
//                         <div className="user-baseData">
//                             <List
//                                 size="small"
//                                 split="false"
//                                 dataSource={dataSource}
//                                 renderItem={item => (<List.Item>{item}</List.Item>)}
//                                 loading={this.state.loading}
//                             />
//                         </div>
//                     </div>
//                 </Modal>
//             </a>
//         );
//     }
// }

//用户编辑表单
// const ItemEditForm = Form.create()(
//     (props) => {
//         const {form, data} = props;
//         const {getFieldDecorator} = form;
        
//         return (
//             <Form>
//                 <FormItem className="title" {...formItemLayout_14} label="资讯标题：">
//                     {getFieldDecorator('title', {
//                         initialValue: data.title,
//                         rules: [{
//                             required: true,
//                             max: 42,
//                             message: '资讯标题不能为空',
//                         }],
//                     })(
//                         <Input placeholder="请输入资讯标题（6-42字）"/>
//                     )}
//                 </FormItem>               
//             </Form>
//         )
//     }
// );

//用户编辑组件
// class ItemEdit extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: {},
//             // 图片相关变量
//             // 初始图片
//             viewPic: "",
//             // 有效图片
//             effectPic: "",
//             // 保存待提交的图片
//             data_pic: "",
//             avatarEditor: {
//                 scale: 1,
//                 positionX: 0.5,
//                 positionY: 0.5
//             },
//             photoLoading: false,
//             confirmLoading: false
//         };
//         this.editor = ""
//     }

//     getData = (para) => {
//         reqwest({
//             url: '/news/getDetail',
//             type: 'json',
//             method: 'post',
//             headers: {
//                 Authorization: sessionStorage.token
//             },
//             data: {
//                 id: para
//             },
//             error: (err) => {
//                 // const json = {
//                 //     result: 0,
//                 //     data: {
//                 //         news: {
//                 //             id: 122,
//                 //             title: "最好的过分乐观开朗大方",
//                 //             photo: "eb75e82708d340a3b22246c2162138bf.jpeg",
//                 //             author: "淘儿学",
//                 //             views: 60,
//                 //             // summary: "每个孩子生来就是圆满俱足的，即“性本善”。那为什么随着孩子年龄的增长，却出现各种问题？其中很多问题的根源来自于家长。",
//                 //             // keyword: "李开发贷款",
//                 //             parentId: 50,
//                 //             typeId: 0,
//                 //             riches: '<html>↵<head>↵  <title></title>↵</head>↵<body>↵<p>我们应该都很熟悉《三字经》的第一句话&ldquo;人之初，性本善&rdquo;，这句话到底是什么意思呢？我觉得，这里面有一个关于教育的智慧。那就是，每个孩子生来就是圆满俱足的，即&ldquo;性本善&rdquo;。那为什么随着孩子年龄的增长，却出现各种问题？其中很多问题的根源来自于家长。</p>↵↵<p><br />&nbsp;</p>↵↵<p>殊不知，孩子的智慧天生圆满俱足，只不过在孩子成长过程中，家长有意、无意地制止了孩子的发展。比如，很多内向的孩子，家中会有一位强势的老爸或老妈，他们用批评与责骂制止了孩子的活泼，所以孩子才会变得内向。</p>↵↵<p><br />&nbsp;</p>↵↵<p>罗丹曾说：&ldquo;世界并不缺少美，只是缺少发现美的眼睛。&rdquo;家庭教育也是一样，孩子具备获得幸福的所有能力，但是现实生活中，家长的眼睛却很少发现孩子的美。总是觉得自己的孩子有着这样或那样的不足，对孩子的要求无限增加。</p>↵↵<p><br />&nbsp;</p>↵↵<p style="text-align: center;"><img max-width="600" src="http://5b0988e595225.cdn.sohucs.com/images/20180323/bf8a572f85cc493b96d35f20669bf4cd.jpeg" /></p>↵↵<p style="text-align: center;"><br />&nbsp;</p>↵↵<p>孩子做事情，接收到的指责与批评多于赞赏与表扬。经常处在大量负面信息的包围中，孩子怎能不对自己的能力产生怀疑？</p>↵↵<p><br />&nbsp;</p>↵↵<p>当孩子看不到自己身上的优点时，就无法显现自身的优势，久而久之本应有的优点也被隐藏了起来，变成了&ldquo;不足&rdquo;或&ldquo;待提高点&rdquo;我们称之为&ldquo;触点&rdquo;。针对这些触点，家长需要做的就是找到它，进而点燃和引爆，将触点变成孩子的成长点。</p>↵↵<p><br />&nbsp;</p>↵↵<p>那么，怎样点燃和引爆触点呢 ? 有的家长采取&ldquo;说&rdquo;的方式。</p>↵↵<p><br />&nbsp;</p>↵↵<p>一些孩子独立就能完成的事情，家长们却经常：</p>↵↵<blockquote>↵<p>&ldquo;宝贝儿，你这样做不对，你得这样做。&rdquo;</p>↵↵<p>&ldquo;这样不对，不对，快停下。&rdquo;</p>↵</blockquote>↵↵<p><br />&nbsp;</p>↵↵<p>为了让孩子走捷径，家长们时不时地给到孩子抛出自己的&ldquo;经验&rdquo;，结果好好的互动机会变成了说教。父母总是希望将自己总结出的&ldquo;经验&rdquo;让孩子全部吸收，这样孩子就可以少走一些弯路。可是孩子呢，年龄小的时候或许还听的进去一部分，随着年龄增长有自己的想法后，左耳朵进右耳朵出，不但没有什么效果，还会认为父母太唠叨。为什么呢？因为孩子天性喜欢自己去体验与探索。</p>↵↵<p><br />&nbsp;</p>↵↵<p style="text-align: center;"><img max-width="600" src="http://5b0988e595225.cdn.sohucs.com/images/20180323/fe84a1fcc9204e3788c31fad06a50473.jpeg" /></p>↵↵<p style="text-align: center;"><br />&nbsp;</p>↵↵<p>每一个孩子对宇宙都充满了好奇，即使《十万个为什么》也无法满足他们探索宇宙的欲望。可是生活中，我经常看到家长处处阻断孩子与宇宙的连接，还自以为所做的一切都是为了孩子好。孩子在公园玩耍，家长寸步不离地跟着孩子，稍微远一点就会喊&ldquo;慢点&rdquo;、&ldquo;回来&rdquo;；孩子用暖壶倒水，家长担心孩子会被烫伤，看到孩子接近暖瓶立刻制止，并要求孩子远离类似危险物；孩子对家中马桶充满好奇，刚想伸手触碰，家长马上呵斥：&ldquo;别碰，脏！&rdquo;</p>↵↵<p><br />&nbsp;</p>↵↵<p>当我们无法满足孩子好奇心的时候，孩子就会产生匮乏感，形成&ldquo;坑洞&rdquo;。所以，在孩子成长的过程中，父母要给孩子多创造机会，让孩子直接体验，从体验中收获成长。用&ldquo;体验&rdquo;代替&ldquo;说教&rdquo;，&ldquo;结果&rdquo;是最好的老师。</p>↵</body>↵</html>',
//                 //             // riches: '<html>↵<head>↵   <title></title>↵</head>↵<body>↵<p style="text-align: center;">01</p>↵↵<p>今天上午群里的妹子出了一道题，可能很多人也都做过：</p>↵↵<blockquote>↵<p>王师傅是卖鱼的，一公斤鱼进价48元，现市场价36元一斤。顾客买了两公斤，给了王师傅200元假钱，王师傅没零钱，于是找邻居换了200元。事后邻居存钱过程中发现钱是假的，被银行没收了，王师傅又赔了邻居200，请问王师傅一共亏了多少?</p>↵</blockquote>↵↵<p>&nbsp;</p>↵↵<p>&nbsp;</p>↵↵<p>这道题早几年出来的时候，把很多人都绕晕了，也包括我，群里出题的妹子今天一开始也是糊涂的。</p>↵↵<p><br />&nbsp;</p>↵↵<p>我后来仔细琢磨，为什么这题目看似很简单，却有很多人上当呢？我想大部分人都是在和邻居换钱又赔钱那个环节给绕晕的。</p>↵↵<p><br />&nbsp;</p>↵↵<p>其实换钱环节还有银行没收什么的都是烟雾弹，跟邻居换钱，给了假钱，再赔给邻居钱，这个环节就两个人交易，邻居一分钱没赚到，那么王师傅在这里是没损失的。</p>↵↵<p><br />&nbsp;</p>↵↵<p>这笔糊涂账从头到尾就只有200块钱假钱，那么算出结果大于200的答案都是错的。</p>↵↵<p><br />&nbsp;</p>↵↵<p>再说简单点，王师傅的亏损，只发生在与顾客的交易过程中，他亏的钱，只有找给顾客的零钱和鱼的成本。</p>↵↵<p><br />&nbsp;</p>↵↵<p>成甲的《好好学习》这本书里告诉我们，要发现事物的底层规律。看这本书受到启发后我暗暗观察，发现生活中真的有很多事情都有个共同点：就是大部分事情都有很多干扰，我们都会被表面的现象给蒙蔽，而看不到事情的本质和重点。</p>↵↵<p><br />&nbsp;</p>↵↵<p style="text-align: center;">02</p>↵↵<p>这个道理用在教育孩子上面也同样适用。</p>↵↵<p><br />&nbsp;</p>↵↵<p>我们在与孩子相处的时候，不可避免会与孩子之间发生一些矛盾和冲突，但我发现很多人当时都被情绪带着走了，而没去解决问题本身。当时的情绪就是扰乱我们思维的表象。</p>↵↵<p><br />&nbsp;</p>↵↵<p>我想每个家长都遇到过孩子顶嘴的时候，大部分人的第一反应是很愤怒：&ldquo;反了你了，居然敢顶嘴了啊！&rdquo;</p>↵↵<p><br />&nbsp;</p>↵↵<p>然后我们很多人是不是就忘了事情本身，而先处理孩子顶嘴这件事呢？</p>↵↵<p><br />&nbsp;</p>↵↵<p>我们之所以会出现这种愤怒情绪，是因为在我们的心里已经了假定了自己是对的，孩子是错的，还有就是我们在孩子面前是权威，孩子比我们弱，应该受我们管理。</p>↵↵<p><br />&nbsp;</p>↵↵<p>其实小孩子的认知不足，在大部分情况下，也确实是家长正确，孩子错了，但当孩子反抗时，我们不能强压，而应该让他感受到你们之间有一种公平、讲理的交流模式。</p>↵↵<p><br />&nbsp;</p>↵↵<p>上周有一天小茗爬上了一辆停在小区的货车车厢里玩耍，他站在边上随时都有可能摔下来，我在旁边看着很危险就喊他下来，他直接回我：&ldquo;不！&rdquo;</p>↵↵<p><br />&nbsp;</p>↵↵<p>我当时也是很生气，正要强行将他抱下来，顺便再揍他小屁股一顿，忽然心念一动又冷静了下来，就跟他说：&ldquo;妈妈让你下来，是因为那里很危险，你觉得我说的对吗？&rdquo;</p>↵↵<p><br />&nbsp;</p>↵↵<p>他点点头。</p>↵↵<p><br />&nbsp;</p>↵↵<p>我接着说：&ldquo;那你现在不想下来，你就说出你的理由，如果更正确更有道理，我就同意你继续待在上面。&rdquo;</p>↵↵<p><br />&nbsp;</p>↵↵<p>他想了一会儿，自己爬了下来。</p>↵↵<p><br />&nbsp;</p>↵↵<p>如果我一直在他&ldquo;顶嘴&rdquo;这件事情上反复纠缠，就偏离了原本的问题，而最后即使我通过强硬的手段震慑住了他，他心中怕是也不服的。</p>↵↵<p><br />&nbsp;</p>↵↵<p style="text-align: center;">03</p>↵↵<p>我自己比较重视孩子的教育这一块儿，也看了不少教育方面的书。然后就经常有朋友让我推荐育儿书籍，我也总是很热心地推荐几本我认为还不错的书。</p>↵↵<p><br />&nbsp;</p>↵↵<p>随着孩子慢慢长大，特别是现在能和我在思想上有交流之后，我发现，所有教育的问题，所有与孩子之间的矛盾，其实都是大人本身的问题。</p>↵↵<p><br />&nbsp;</p>↵↵<p>也就是说，你怎样处理和孩子之间的关系，考验的是你的处事能力。</p>↵↵<p><br />&nbsp;</p>↵↵<p>我们在生活工作中可能见过这样一些人，觉得他们特别&ldquo;帅&rdquo;，工作中他们总能找到最有效率的工作方法，我们会认为他们工作能力强；他们处理事情也总能处理得妥贴圆满，我们也往往会以为他们情商高。</p>↵↵<p><br />&nbsp;</p>↵↵<p>其实不是的，大部分道理都是相通的，能力也都是综合考量的，那些真正厉害的人，他们处理任何事情都高明。</p>↵↵<p><br />&nbsp;</p>↵↵<p>现在，有人再让我推荐育儿书，我总是会忍不住推荐其他不相干的，因为，在我现在看来，好的教育方法应该藏在哲学、心理学、甚至经济学里。而纯粹育儿的书，看一两本就够了，在孩子还小、思维表达能力都很弱的时候或许还有些用处，大一点后教育孩子真正的功夫应该放在自己身上，这才是教育问题的关键。</p>↵↵<p><br />&nbsp;</p>↵↵<p>你能控制自己的情绪了，就能很好地和孩子相处；你逻辑清晰了，就能一针见血地发现孩子的问题出在哪里；你做好了自己，才能做好家长。</p>↵↵<p><br />&nbsp;</p>↵↵<p>大部分情况下，你做好了自己，孩子也能做好他自己。</p>↵</body>↵</html>',
//                 //             cityId: 0,
//                 //             status: 1
//                 //         }
//                 //     },
//                 // };
//             },
//             success: (json) => {
//                 if (json.result === 0) {
//                     let data = json.data.news;
//                     // 资讯类型写入
//                     if (data.parentId === 0) {
//                         data.parentId = data.typeId;
//                         data.typeId = undefined
//                     }
//                     // 城市ID写入
//                     data.cityId = String(json.data.news.cityId);
//                     this.setState({
//                             data: data,
//                             viewPic: "http://image.taoerxue.com/" + json.data.news.photo,
//                             data_pic: json.data.news.photo
//                         }, () => {
//                             this.editor.setData(this.state.data.riches);
//                         }
//                     )
//                 } else {
//                     if (json.code === 901) {
//                         message.error("请先登录");
//                         // 返回登陆页
//                         this.props.toLoginPage();
//                     } else if (json.code === 902) {
//                         message.error("登录信息已过期，请重新登录");
//                         // 返回登陆页
//                         this.props.toLoginPage();
//                     } else {
//                         message.error(json.message);
//                     }
//                 }
//             }
//         });
//     };

//     //图片处理
//     //由图片网络url获取其base64编码
//     getBase64Image = (url, width, height) => {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
//         const image = new Image();
//         image.crossOrigin = '';
//         image.src = url;
//         image.onload = () => {
//             const canvas = document.createElement("canvas");
//             canvas.width = width ? width : image.width;
//             canvas.height = height ? height : image.height;
//             const ctx = canvas.getContext("2d");
//             ctx.fillStyle = "#fff";
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//             const dataURL = canvas.toDataURL("image/jpeg", 0.92);
//             this.setState({
//                 viewPic: dataURL,
//                 effectPic: dataURL,
//             })
//         };
//     };
//     // 初始图片写入
//     setViewPic = (para) => {
//         this.setState({
//             viewPic: para
//         })
//     };
//     // 设置图片缩放比例及偏移量
//     setAvatarEditor = (index, value) => {
//         if (this.state.viewPic.slice(26) === this.state.data_pic) {
//             // 图片有比例和偏移量的改动时，判断viewPic路径是否为网络路径，是则表明当前改动为第一次改动，此时需将viewPic,effectPic路径转为base64编码存入
//             this.getBase64Image(this.state.viewPic)
//         }
//         if (index === 1) {
//             this.setState({
//                 avatarEditor: {
//                     scale: value,
//                     positionX: this.state.avatarEditor.positionX,
//                     positionY: this.state.avatarEditor.positionY
//                 }
//             })
//         }
//         if (index === 2) {
//             this.setState({
//                 avatarEditor: {
//                     scale: this.state.avatarEditor.scale,
//                     positionX: value,
//                     positionY: this.state.avatarEditor.positionY
//                 }
//             })
//         }
//         if (index === 3) {
//             this.setState({
//                 avatarEditor: {
//                     scale: this.state.avatarEditor.scale,
//                     positionX: this.state.avatarEditor.positionX,
//                     positionY: value
//                 }
//             })
//         }
//     };
//     // 图片上传
//     picUpload = (para01, para02) => {
//         const formData = new FormData();
//         formData.append("file", para02);
//         this.setState({
//             photoLoading: true
//         });
//         reqwest({
//             url: '/file/upload',
//             type: 'json',
//             method: 'post',
//             processData: false,
//             data: formData,
//             error: (XMLHttpRequest) => {
//                 message.error("图片提交失败");
//                 this.setState({
//                     photoLoading: false
//                 })
//             },
//             success: (json) => {
//                 if (json.result === 0) {
//                     message.success("图片提交成功");
//                     this.setState({
//                         effectPic: para01,
//                         data_pic: json.data.url,
//                         photoLoading: false
//                     })
//                 } else {
//                     message.error(json.message);
//                     this.setState({
//                         photoLoading: false
//                     })
//                 }
//             }
//         });
//     };

//     dataContrast = (values) => {
//         const initValues = this.state.data;
//         const itemList = ["title", "parentId", "author", "views", "photo", "cityId", "keyword", "summary"];
//         const result = {};
//         itemList.forEach((item) => {
//             if (values[item] !== initValues[item]) {
//                 result[item] = values[item];
//             }
//         });
//         result.riches = values.riches;
//         console.log(result);
//         if (JSON.stringify(result) === "{}") {
//             return false;
//         } else {
//             result.id = this.props.id;
//             result.title = values.title;
//             return result;
//         }
//     };

//     handleCancel = () => {
//         const form = this.form;
//         const cancel = () => {
//             this.setState(
//                 {
//                     data: {},
//                     viewPic: "",
//                     effectPic: "",
//                     data_pic: "",
//                     avatarEditor: {
//                         scale: 1,
//                         positionX: 0.5,
//                         positionY: 0.5
//                     },
//                     photoLoading: false,
//                     confirmLoading: false
//                 }, () => {
//                     form.resetFields();
//                     this.props.setEdit("status", false)
//                 })
//         };
//         // 资讯基本信息为空的处理
//         if (JSON.stringify(this.state.data) === "{}") {
//             cancel();
//             return;
//         }
//         form.validateFields((err, values) => {
//             values.parentId = values.typeIds[0];
//             values.photo = this.state.data_pic;
//             values.cityId = values.cityId[1] || values.cityId[0];
//             const result = this.dataContrast(values);
//             if (result) {
//                 confirm({
//                     title: '已修改信息未保存，确认放弃修改？',
//                     content: "",
//                     okText: '确认',
//                     okType: 'danger',
//                     cancelText: '取消',
//                     onOk() {
//                         cancel();
//                     }
//                 });
//             } else {
//                 cancel();
//             }
//         })
//     };

//     handleCreate = () => {
//         const form = this.form;
//         form.validateFields((err, values) => {
//             if (err) {
//                 return;
//             }
//             values.parentId = values.typeIds[0];
//             values.photo = this.state.data_pic;
//             values.cityId = values.cityId[1] || values.cityId[0];
//             values.riches = this.editor.getData();
//             const result = this.dataContrast(values);
//             if (!result) {
//                 message.error("暂无信息更改");
//                 return;
//             }
//             this.setState({
//                 confirmLoading: true
//             });
//             reqwest({
//                 url: '/news/modifyNews',
//                 type: 'json',
//                 method: 'post',
//                 headers: {
//                     Authorization: sessionStorage.token
//                 },
//                 data: result,
//                 error: (XMLHttpRequest) => {
//                     message.error("保存失败");
//                     this.setState({
//                         confirmLoading: false
//                     })
//                 },
//                 success: (json) => {
//                     if (json.result === 0) {
//                         form.resetFields();
//                         this.setState({
//                             data: {},
//                             viewPic: "",
//                             effectPic: "",
//                             data_pic: "",
//                             avatarEditor: {
//                                 scale: 1,
//                                 positionX: 0.5,
//                                 positionY: 0.5
//                             },
//                             photoLoading: false,
//                             confirmLoading: false
//                         });
//                         message.success("资讯信息修改成功");
//                         this.editor.setData("");
//                         this.props.setEdit("status", false);
//                         this.props.setEdit("flag");
//                     } else {
//                         if (json.code === 901) {
//                             message.error("请先登录");
//                             this.props.toLoginPage();
//                         } else if (json.code === 902) {
//                             message.error("登录信息已过期，请重新登录");
//                             this.props.toLoginPage();
//                         } else {
//                             message.error(json.message);
//                             this.setState({
//                                 confirmLoading: false
//                             })
//                         }
//                     }
//                 }
//             })
//         })
//     };

//     saveFormRef = (form) => {
//         this.form = form;
//     };

//     componentWillReceiveProps(nextProps) {
//         if (nextProps.status) {
//             this.getData(nextProps.id);
//         }
//     }

//     componentDidMount() {
//         this.editor = window.CKEDITOR.replace('TextArea2');
//     }

//     render() {
//         return (
//             <div className="edit-information" style={{display: this.props.status ? "block" : "none"}}>
//                 <header>
//                     <Button icon="left" onClick={this.handleCancel} disabled={this.state.confirmLoading}>返回</Button>
//                     <Button type="primary" onClick={this.handleCreate} style={{float: "right"}}
//                             loading={this.state.confirmLoading}>提交</Button>
//                 </header>
//                 <div className="content">
//                     <div className="item item-left information-form information-edit">
//                         <ItemEditForm
//                             ref={this.saveFormRef}
//                             data={this.state.data}
//                             channels={this.props.channels}
//                             viewPic={this.state.viewPic}
//                             effectPic={this.state.effectPic}
//                             data_pic={this.state.data_pic}
//                             setViewPic={this.setViewPic}
//                             avatarEditor={this.state.avatarEditor}
//                             setAvatarEditor={this.setAvatarEditor}
//                             picUpload={this.picUpload}
//                             photoLoading={this.state.photoLoading}
//                             provinceList={this.props.provinceList}
//                         />
//                     </div>
//                     <div className="item item-right">
//                         <textarea id="TextArea2" cols="20" rows="2" className="ckeditor"/>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

//用户列表
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            pagination: {
                current: 1,
                pageSize: Number(localStorage.userPageSige) || 10,
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
                title: '昵称',
                dataIndex: 'nickname',
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, 'nickname'),
            },
            {
                title: '头像',
                dataIndex: 'photo',
                width: '10%',
                render: (text, record) => (<img style={{width: '30px', height: "30px"}} alt="" src={record.photo}/>)
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, 'phone'),
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: '12%',
                render: (text, record) => this.renderColumns(text, record, 'status'),
            },
            {
                title: '操作',
                dataIndex: '操作',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {/*用户详情组件*/}
                            {/*<UserDetails id={record.id} opStatus={this.props.opObj.select}/>*/}
                            {/*资讯编辑*/}
                            {/*<a onClick={() => this.props.setEdit("status", true, record.id)}>详情</a>
                            <a onClick={() => this.props.setEdit("status", true, record.id)}>详情</a>*/}
                            <Link 
                                to={"./user-detail?" + record.id}
                                style={{display: this.props.opObj.select ? "inline" : "none"}}
                                >详情</Link>
                            <Popconfirm title={record.status === "启用" ? "确认禁用？" : "确认启用？"}
                                        placement="topRight"
                                        onConfirm={() => this.itemStatus(record.id, record.status)}
                                        onCancel=""
                                        okType="danger"
                                        okText="确认"
                                        cancelText="取消">
                                <a style={{display: this.props.opObj.ban ? "inline" : "none"}}>{record.status === "启用" ? "禁用" : "启用"}</a>
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
        );
    };

    //获取本页信息
    getData = (keyword) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/sys/appUser/list',
            type: 'json',
            method: 'get',
            data: {
                phone: keyword ? keyword.name : this.props.keyword.name,
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
            },
            success: (json) => {
                const data = [];
                if (json.result === 0) {
                    // 现有用户数量写入
                    this.props.setTotal(json.data.total);
                    if (json.data.list) {
                        json.data.list.forEach((item, index) => {
                            data.push({
                                key: index.toString(),
                                id: item.id,
                                index: index + 1,
                                photo: item.photo,
                                nickname: item.nickname,
                                phone: item.phone,
                                // 0-正常 1-禁用
                                status: item.status ? "启用" : "禁用"
                            });
                        });
                    }
                    console.log(data)
                    this.setState({
                        loading: false,
                        data: data,
                        // 数据总量写入分页参数以确定分页数量
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
    };

    //帐号封禁与启用
    itemStatus = (id, status) => {
        this.setState({
            loading: true
        });
        reqwest({
            url: '/sys/appUser/ban',
            type: 'json',
            method: 'post',
            headers: {
                Authorization: sessionStorage.token
            },
            data: {
                id: id,
                // 0-正常 1-禁用
                status: status === "启用" ? 1 : 0
            },
            error: (XMLHttpRequest) => {
                message.error("保存失败");
                this.setState({
                    loading: false
                })
            },
            success: (json) => {
                if (json.result === 0) {
                    message.success(status === "启用" ? "帐号禁用成功" : "帐号启用成功");
                    this.getData();
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
        })
    };

    //表格参数变化处理
    handleTableChange = (pagination) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        localStorage.userPageSige = pagination.pageSize;
        pager.pageSize = Number(localStorage.userPageSige);
        this.setState({
            pagination: pager,
        }, () => {
            // 信息分页请求时，表格参数有变更需重新拉取列表
            this.getData();
        });
    };

    componentWillMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        //keyword, flag_add改变，则重新获取列表内容
        if (nextProps.keyword === this.props.keyword && nextProps.flag_add === this.props.flag_add) {
            return;
        }
        this.getData(nextProps.keyword);
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

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opObj: {},
            // 当前用户数量
            total: 0,
            flag_add: false,
            editStatus: false,
            editFlag: false,
            editId: "",
            // 列表筛选关键词
            keyword: {
                name: "",
            },
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
                    });
                    this.setState({
                        opObj: data
                    })
                }
            })
        });
    };

    // 当前用户数量写入
    setTotal = (value) => {
        this.setState({
            total: value,
        })
    };

    // 名称关键词设置
    setName = (value) => {
        console.log(value);
        if (value !== this.state.keyword.name) {
            this.setState({
                keyword: {
                    name: value,
                }
            })
        }
    };

    // 资讯编辑相关状态变量设置
    setEdit = (type, para, id) => {
        if (type === "status") {
            this.setState({
                editStatus: para,
                editId: id
            })
        }
        if (type === "flag") {
            this.setState({
                editFlag: !this.state.editFlag
            })
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
            <div className="users">
                {
                    this.state.opObj.select ?
                        <div>
                            <header className="clearfix" style={{background: "#FFF", padding: "24px"}}>
                                {/*用户名称筛选*/}
                                <Search
                                    placeholder="请输入用户名称或手机号"
                                    onSearch={this.setName}
                                    enterButton
                                    style={{width: "320px", float: "left", marginRight: "20px"}}
                                />
                            </header>
                            <div className="clearfix" style={{background: "#FFF", padding: "24px 24px 0"}}>                                  
                                <span>用户列表</span>
                                {/*当前用户数量*/}
                                <span
                                    style={{float: "right"}}>{this.state.total ? ("已有用户：" + this.state.total) : ""}</span>
                            </div>
                            <div className="table-box" style={{background: "#FFF", padding: "24px"}}>
                                <DataTable 
                                    opObj={this.state.opObj} 
                                    setTotal={this.setTotal} 
                                    setEdit={this.setEdit}
                                    editFlag={this.state.editFlag}
                                    keyword={this.state.keyword}
                                    flag_add={this.state.flag_add} 
                                    toLoginPage={this.toLoginPage}/>
                            </div>

                            <Switch>
                                <Route path="./UserDetail" component={UserDetail}></Route>                               
                            </Switch>

                            {/*资讯编辑组件*/}
                            {/*<ItemEdit 
                                      status={this.state.editStatus}
                                      setEdit={this.setEdit}
                                      // channels={this.state.typeList}
                                      // provinceList={this.state.provinceList}
                                      id={this.state.editId}
                                      toLoginPage={this.toLoginPage}/>*/}
                        </div>
                        :
                        <p>暂无查询权限</p>
                }
            </div>
        )
    }
}

export default withRouter(Users);