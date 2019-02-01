<!--判断题-->
<template>

  <div>
    <Button type="error" @click="deletebyids()">删除</Button>
    <Input v-model="search.qname" placeholder="输入题目" style="width: auto" />
    <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)"></Button>
    <Select style="width:200px" :label-in-value="true"   v-model="search.cname" @on-change="gopage(1)" >
      <Option  v-for="item in statelist" :value="item.id" :key="item.id" > {{ item.name }}</Option>
    </Select>
    <Modal
      v-model="modal1"
      title="添加题目"
      @on-ok="addok"
      :closable="false">
      <Form ref="addForm" :model="addForm"  :label-width="80">
        <div>
          请输入题目：
          <Input v-model="addForm.name" style="width: 400px" /></div>
        <div>
          请输入答案：
          <Input  type="hidden" v-model="addForm.tanswer" style="display: inline"/>
          <i-switch size="large"  v-model="answer" @on-change="chooseAnswer">
            <span slot="open">正确</span>
            <span slot="close">错误</span>
          </i-switch>

        </div>

        <div>
          请填写分数：
          <Input v-model="addForm.score" placeholder="2" style="width: auto" />
        </div>
        <div>
          请选择课程：
          <Select style="width:200px" :label-in-value="true"   v-model="addForm.cid" @on-change="perChange" >
            <Option  v-for="item in courseList" :value="item.id" :key="item.id" > {{ item.name }}</Option>
          </Select>
        </div>

      </Form>
    </Modal>

    <Modal
      v-model="modal2"
      title="修改题目"
      @on-ok="addok"
      :closable="false">
      <Form ref="addForm" :model="addForm"  :label-width="80">
        <div>
          请输入题目：
          <Input v-model="addForm.name" style="width: 400px" /></div>
        <div>
          请输入答案：
          <Input  type="hidden" v-model="addForm.tanswer" style="display: inline"/>
          <i-switch size="large"  v-model="answer" @on-change="chooseAnswer">
            <span slot="open">正确</span>
            <span slot="close">错误</span>
          </i-switch>
        </div>
          <div>
          请填写分数：
          <Input v-model="addForm.score" placeholder="2" style="width: auto" />
        </div>
        <div>
          请选择课程：
          <Select style="width:200px" :label-in-value="true"   v-model="addForm.cid" @on-change="perChange" >
            <Option  v-for="item in courseList" :value="item.id" :key="item.id" > {{ item.name }}</Option>
          </Select>
        </div>

      </Form>
    </Modal>
    <Modal
      v-model="modal3"
      fullscreen
      title="查看答案"
      @on-ok="clearimgs"
      @on-cancel="clearimgs"
      :closable="false">
      <img  :src="imgsrc" style="width: 100%">
    </Modal>
    <Table  border ref="selection" :columns="columns7" :data="data6" @on-select="handleRowChange"></Table>
    <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage"
          show-total show-sizer show-elevator/>
  </div>


</template>

<script>
  import fetch from '../../utils/fetch.js';
  import formatDate from '../../utils/date'

  export default {
    data () {
      return {
        //七牛云相关
        defaultList: [],
        imgName: "",
        picHostName:"",
        visible: false,
        uploadList: [],
        uptoken:{},
        fileList:[],
        modal3: false,

        imgsrc: "",

        paperid:0,
        modal1: false,
        modal2: false,
        answer: true,
        pageSize: 10,
        pageNo: 1,
        totalPage: 0,
        totalCount: 0,
        selectdata: [],
        search:{
          qname: "",
          cname: ""
        },
        statelist:[
          {
            id: "",
            name: '全部'
          },
          {
            id: 1,
            name: '单选题'
          },
            {
            id: 2,
            name: '多选题'
          },
            {
            id: 3,
            name: '判断题'
          },
            {
            id: 4,
            name: '填空题'
          },
            {
            id: 5,
            name: '简答题'
          },
            {
            id: 6,
            name: '解答题'
          },

        ],
        addForm: {
          id:"",
          qid:0,
          name:"题目",
          tanswer: "正确",
          score:2,
          cid:0,
          cname:""
        },
        modifyForm: {
          name:"",
          tanswer: "",
          fanswer: ""
        },
        columns7: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            key: 'num',
            width: 80,
            sortable: true,
            align: 'center',
            render: (h, params) => {
              return h('span', params.index + (this.pageNo- 1) * this.pageSize + 1);
            }
          },
          {
            title: '题目',
            key: 'name',
          },
          {
            title: '正确答案',
            key: 'tanswer',
        render: (h, params) => {
          let state=params.row.state;
          if(state!==6)
            return h('div', {
              props: {
              },
            },params.row.tanswer)
          else
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  let src = this.data6[params.index].tanswer;
                  if (src=="") {
                    return  this.$Message.error('该题目没有答案!');
                  }
                  this.imgsrc = "http://plvaqmhf6.bkt.clouddn.com/" + src;
                  this.modal3 = true;
                }
              }
            }, '查看答案'),
          ]);
        }
          },
          {
            title: '错误答案',
            key: 'fanswer'
          },
          {
            title: '课程名字',
            key: 'cname'
          },
          {
            title: '分数',
            key: 'score'
          },

          {
            title: '添加时间',
            key: 'adddate',
            sortable: true,
            render: function (h, params) {
              return h('div',
                formatDate(new Date(params.row.adddate)));
            }

          },
          {
            title: '类型',
            key: 'state',
            render: (h, params) => {
              let texts = '';
              let state=params.row.state
              switch (state) {
                case 1:
                  texts = "单选题";
                  break;
                case 2:
                  texts = "多选题";
                  break;
                case 3:
                  texts = "判断题";
                  break;
                case 4:
                  texts = "填空题";
                  break;
                case 5:
                  texts = "简答题";
                  break;
                case 6:
                  texts = "解答题";
                  break;
                default:
                  break;
              }
              return h('div', {
                props: {
                },
              },texts)
            },
          },


          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看')
              ]);
            }
          }
        ],
        data6: [],
        courseList: [],
      }
    },
    methods: {
      handleRowChange(selection, row){
        this.selectdata = selection;
      },
      handleSelectAll (status) {
        this.$refs.selection.selectAll(status);

      },
      //展示行信息
      show (index) {
        this.$Modal.info({
          title: '题目信息',
          content: `Name：${this.data6[index].name}<br>正确答案：${this.data6[index].tanswer}<br>错误答案：${this.data6[index].fanswer}`
        })
      },
      gopage(pageNo){
        const pageSize = this.pageSize;
        let qname = this.search.qname;
        let cname = this.search.cname;
        let pid = this.paperid;
        fetch({
          url: '/pdet/page',
          method: 'get',
          params:{qname,cname,pageNo,pageSize,pid}
        }).then((result) => {
          this.data6=result.data.data;
          this.totalCount=result.data.count;
        });
      },
      addquestion(){
        fetch({
          url: '/cour/courses',
          method: 'get',
        }).then((result) => {

          this.courseList=result.data;
          this.modal1 = true;
        });
      },
      addok(){
        const mquestion = this.addForm;
        fetch({
          url: '/pdet/add',
          method: 'post',
          data: mquestion
        }).then((result) => {
          this.addForm.id = "";
          this.gopage(this.pageNo);
          this.$refs['addForm'].resetFields();
          this.$Message.success('Success!');
          // this.modal1 = false;
        });

      },
      clearimgs(){
        this.imgsrc = "";
      },
      /*修改题目*/
      modifyQuestion(index){
        let id=this.data6[index].id;

        fetch({
          url: '/cour/courses',
          method: 'get',
        }).then((result) => {

          this.courseList=result.data;

          fetch({
            url:'/pdet/getquebyid',
            method:'get',
            params: {id}
          }).then((result) => {
            this.addForm = result.data;
            if (result.data.tanswer=="正确") {
              this.answer = true;
            }else {
              this.answer = false;
            }
            this.modal2 = true;
          })
        });
      },

      perChange(value){
        this.addForm.cname = value.label;
      },

      deletebyids(){
        let ids = "";

        for (let i = 0; i < this.selectdata.length; i++) {
          ids = ids+","+ this.selectdata[i].id;
        }

        fetch({
          url:'/pdet/delete',
          method:'delete',
          params: {ids}
        }).then((result) => {
          this.$Message.success('删除成功!');
          this.gopage(this.pageNo);
        })

      },

      chooseAnswer(){

        if (this.answer==true) {
          this.addForm.tanswer = "正确";
        }
        else{
          this.addForm.tanswer = "错误";
        }

      },



    },

    mounted: function () {

      if (this.$route.params.id == null || this.$route.params.id == "") {
        this.$Message.success('请先选择试卷!');
        return this.$router.push({path: '/exam/exam_1/exam_1_2/'});
      }
      //接受url参数
      this.paperid = this.$route.params.id;
      this.gopage(1);
    }
  }
</script>
