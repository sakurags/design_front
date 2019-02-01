<!--简答题-->
<template>

  <div>
    <Button  type="primary"@click="addquestion()">添加题目</Button>
    <Button  type="primary"@click="addmq()">添加到考试</Button>
    <Button type="error" @click="deletebyids()">删除</Button>
    <Input v-model="search.qname" placeholder="输入题目" style="width: auto" />
    <Input v-model="search.cname" placeholder="输入课程" style="width: auto" />
    <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)"></Button>
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
          <Input v-model="addForm.tanswer"  style="width: auto" />
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
          <Input v-model="addForm.tanswer"  style="width: auto" />
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
      :closable="false"
      v-model="modal4"
      title="添加到试卷"
      @on-ok="addtopaperdetail"
      @on-cancel=""
    >
      <Select v-model="papers" :label-in-value="true" @on-change="perChange2"  style="width:200px">
        <Option v-for="item in paperdata" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
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
        paperQue:{
          pid: 0,
          pname: "",
          list:[]
        },
        paperdata: [],
        papers: 0,
        papersname: "",
        modal4: false,

        modal1: false,
        modal2: false,
        pageSize: 4,
        pageNo: 1,
        totalPage: 0,
        totalCount: 0,
        selectdata: [],
        search:{
          qname: "",
          cname: ""
        },
        addForm: {
          id:"",
          name:"题目",
          tanswer: " 答案",
          fanswer: "A.错误1&B.错误2&D.错误3",
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
            key: 'tanswer'
          },
          {
            title: '分数',
            key: 'score'
          },
          {
            title: '课程名',
            key: 'cname'
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
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modifyQuestion(params.index)

                    }
                  }
                }, '修改')
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
        fetch({
          url: '/saque/page',
          method: 'get',
          params:{qname,cname,pageNo,pageSize}
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
          url: '/saque/add',
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

      perChange(value){
        this.addForm.cname = value.label;
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
            url:'/saque/getquebyid',
            method:'get',
            params: {id}
          }).then((result) => {
            this.addForm = result.data;
            this.modal2 = true;
          })
        });
      },
      deletebyids(){
        let ids = "";

        for (let i = 0; i < this.selectdata.length; i++) {
          ids = ids+","+ this.selectdata[i].id;
        }

        fetch({
          url:'/saque/delete',
          method:'delete',
          params: {ids}
        }).then((result) => {
          this.$Message.success('删除成功!');
          this.gopage(this.pageNo);
        })

      },
      //添加题目时选择试卷名
      perChange2(value){
        this.papersname= value.label;
      },
      addmq(){

        fetch({
          url:'/paper/getallpaper',
          method:'get',
        }).then((result) => {
          this.paperdata = result.data;
          this.modal4 = true;
          console.log(this.selectdata);
        })

      },
      addtopaperdetail(){
        this.paperQue.pid = this.papers;
        this.paperQue.pname = this.papersname;

        this.paperQue.list = this.selectdata;
        let paperQue = this.paperQue;
        fetch({
          url:'/saque/addque',
          method:'post',
          data:paperQue
        }).then((result) => {
          this.$Message.success('添加成功!');
          this.gopage(this.pageNo);
        })
      }


    },

    mounted: function () {
      this.gopage(1);
      /* fetch({
         url:'/list',
         method:'get',
         mode: 'cors',
         responseType: 'json'
       }).then((result) => {
         this.data6 = result.data;
       })*/


    }
  }
</script>
