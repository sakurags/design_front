<!--查看试卷-->
<template>

  <div>
  <!--  <Button  type="primary" @click="handleSelectAll(true)">全选</Button>
    <Button  type="primary" @click="handleSelectAll(false)">取消全选</Button>-->
    <Button  type="primary"@click="addquestion()">添加试卷</Button>
    <Button type="error" @click="deletebyids()">删除</Button>
    <Input v-model="search.qname" placeholder="输入试卷" style="width: auto" />
    <Input v-model="search.cname" placeholder="输入课程" style="width: auto" />
    <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)"></Button>
    <Modal
      :closable="false"
      v-model="modal1"
      title="添加试卷"
      @on-ok="addok"
      @on-cancel="clearform"
    >
      <Form ref="addForm" :model="addForm" :label-width="80">
        <FormItem label="请输入试卷">
          <Input v-model="addForm.name" placeholder="Enter something..."></Input>
        </FormItem>

        <FormItem label="选择课程老师">
          <Row>
            <Col span="11">
              <Cascader v-model="value3" :data="ctdata" @on-change="shows"></Cascader>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="DatePicker">
          <Row>
            <Col span="10">
              <DatePicker type="datetime" v-model="addForm.starttime"  format="yyyy-MM-dd HH:mm:ss"  placeholder="Select date"></DatePicker>
            </Col>
            <Col span="3" style="text-align: center">-</Col>
            <Col span="10">
              <DatePicker type="datetime" v-model="addForm.endtime"  format="yyyy-MM-dd HH:mm:ss"  placeholder="Select date"></DatePicker>
            </Col>

          </Row>
        </FormItem>

        <FormItem label="请填写分数">
          <Input v-model="addForm.note" placeholder="备注" />
        </FormItem>

      </Form>
    </Modal>

    <Modal
      v-model="modal2"
      title="修改试卷"
      @on-ok="addok"
      @on-cancel="clearform"
      :closable="false"
    >
      <Form ref="addForm" :model="addForm" :label-width="80">
        <FormItem label="请输入试卷">
          <Input v-model="addForm.name" placeholder="Enter something..."></Input>
        </FormItem>

        <FormItem label="选择课程老师">
          <Row>
            <Col span="11">
              <Cascader v-model="value3" :data="ctdata" @on-change="shows"></Cascader>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="DatePicker">
          <Row>
            <Col span="10">
              <DatePicker type="datetime" v-model="addForm.starttime"  format="yyyy-MM-dd HH:mm:ss"  placeholder="Select date"></DatePicker>
            </Col>
            <Col span="3" style="text-align: center">-</Col>
            <Col span="10">
              <DatePicker type="datetime" v-model="addForm.endtime"  format="yyyy-MM-dd HH:mm:ss"  placeholder="Select date"></DatePicker>
            </Col>

          </Row>
        </FormItem>

        <FormItem label="请填写分数">
          <Input v-model="addForm.note" placeholder="备注" />
        </FormItem>

      </Form>
    </Modal>
    <Table  border ref="selection" :columns="columns7" :data="data6" @on-select="handleRowChange"></Table>
    <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage"
          show-total show-sizer show-elevator/>
  </div>


</template>

<script>
  import fetch from '../../utils/fetch.js';
  import formatDate from '../../utils/date'
  import formatDate2 from '../../utils/date2'

  export default {
    data () {
      return {
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

        value3: [],
        ctdata: [],
        addForm: {
          id:"",
          name:"",
          cid: 0,
          cname: "",
          tid:2,
          tname:"",
          adddate:"2019-11-11",
          starttime: "10:10:10",
          endtime: "12:12:12",
          note: ""
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
            title: '试卷',
            key: 'name',
          },
          {
            title: '课程名',
            key: 'cname'
          },
          {
            title: '教师名',
            key: 'tname'
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
            title: '开始时间',
            key: 'starttime',
            sortable: true,
            render: function (h, params) {
              return h('div',
                formatDate2(new Date(params.row.starttime)));
            }

          },
          {
            title: '结束时间',
            key: 'endtime',
            sortable: true,
            render: function (h, params) {
              return h('div',
                formatDate2(new Date(params.row.endtime)));
            }

          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let texts = '';
              let state=params.row.state
              switch (state) {
                case 1:
                  texts = "未开始";
                  break;
                case 2:
                  texts = "正在考试";
                  break;
                case 3:
                  texts = "考试结束";
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
            title: '备注',
            key: 'note'
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

                      this.$router.push({path:'/exam/exam_1/exam_1_3/'+(this.data6[params.index].id) })
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
          title: '试卷信息',
          content: `Name：${this.data6[index].name}<br>正确答案：${this.data6[index].tanswer}<br>错误答案：${this.data6[index].fanswer}`
        })
      },
      gopage(pageNo){
        const pageSize = this.pageSize;
        let qname = this.search.qname;
        let cname = this.search.cname;
        fetch({
          url: '/paper/page',
          method: 'get',
          params:{qname,cname,pageNo,pageSize}
        }).then((result) => {
          this.data6=result.data.data;
          this.totalCount=result.data.count;
        });
      },
      addquestion(){
        fetch({
          url: '/cour/ctdata',
          method: 'get',
        }).then((result) => {

          this.ctdata=result.data;
          this.modal1 = true;
        });
      },
      addok(){
        const mquestion = this.addForm;
        fetch({
          url: '/paper/add',
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
      /*修改试卷*/
      modifyQuestion(index){
        let id=this.data6[index].id;

        fetch({
          url: '/cour/ctdata',
          method: 'get',
        }).then((result) => {

          this.ctdata=result.data;

          fetch({
            url:'/paper/getquebyid',
            method:'get',
            params: {id}
          }).then((result) => {
            this.addForm = result.data;
            this.value3[0] =result.data.cid;
            this.value3[1] =result.data.tid ;
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
          url:'/paper/delete',
          method:'delete',
          params: {ids}
        }).then((result) => {
          this.$Message.success('删除成功!');
          this.gopage(this.pageNo);
        })

      },

      shows(value, selectedData) {
        alert(value);
        let label = selectedData[1].__label;
        let values = selectedData[1].__value;
        let split1 = label.split("/");
        let split2 = values.split(",");
        this.addForm.cid = split2[0];
        this.addForm.tid = split2[1];
        this.addForm.cname = split1[0];
        this.addForm.tname = split1[1];
      },
      clearform(){
        this.addForm = new Object();
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
