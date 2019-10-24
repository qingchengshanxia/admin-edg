<!--
 * @Description: 
 * @Author: lhl
 * @Date: 2019-08-14 16:37:55
 * @LastEditors: lhl
 * @LastEditTime: 2019-10-23 16:20:11
 -->
<template>
  <!-- 用户管理 -->
  <div class="yonghuadmin-box">
    <div class="search-box clearfix">
      <div class="fl">
        <span>
          <el-input
            clearable
            placeholder="请输入用户名"
            size="small"
            style="width: 200px;"
            v-model="searchObj.username"
          >
          </el-input>
        </span>
        <el-button
          type="primary"
          plain
          size="small"
          style="margin-left:20px;"
          @click="dataList(true)"
          >查询</el-button
        >
        <el-button type="primary" plain size="small" @click="reset"
          >重置</el-button
        >
      </div>
      <div class="fr" style="margin-right:20px;">
        <el-button type="primary" plain size="small" @click="addUser"
          >新增</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
        border
        size="mini"
        highlight-current-row
        :height="getTableHeight"
        tooltip-effect="light"
        @row-click="clickRow"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          :show-overflow-tooltip="true"
          align="center"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          prop="role"
          :show-overflow-tooltip="true"
          align="center"
          label="用户角色"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.role == 1">管理员</span>
            <span v-if="scope.row.role == 2">普通用户</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="更新日期" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.hasOwnProperty('createTime')">
              <span>{{ $formatTime(scope.row.createTime) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              style="margin-right:10px;"
              @click="editUser(scope.row)"
              >编辑</el-button
            >
            <el-dropdown size="small">
              <span class="el-dropdown-link">
                <el-button type="text" size="small"
                  >更多 <i class="el-icon-arrow-down el-icon--right"></i
                ></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="delLM(scope.row.id)">
                  删除
                </el-dropdown-item>
                <el-dropdown-item @click.native="resetPassword(scope.row.id)">
                  重置密码
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="page.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalPage"
      >
      </el-pagination>
    </div>
    <el-dialog
      v-dialogDrag
      :title="userTitle"
      :visible.sync="isShowUser"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form ref="form" :model="userObj" label-width="150px">
        <el-form-item label="用户名:" required>
          <el-input
            v-model="userObj.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码:" required>
          <el-input
            v-model="userObj.password"
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        solt="footer"
        class="prot-list-moder-footer"
        style="text-align:right;"
      >
        <el-button type="primary" size="medium" @click="saveUser"
          >提交</el-button
        >
        <el-button type="info" plain size="medium" @click="isShowUser = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "yonghuadmin",
  data() {
    return {
      page: {
        totalPage: 0,
        page: 1, //当前第几页
        limit: 20 //一页多少条
      },
      loading: false,
      tableData: [],
      userTitle: "",
      isShowUser: false,
      userObj: {
        username: "",
        password: ""
      },
      searchObj: {
        username: ""
      },
      currow: ""
    };
  },
  props: [],
  components: {},
  methods: {
    pageSizeChange(size) {
      //分页多少条 变化
      this.page.limit = size;
      this.dataList(true);
    },
    currentPageChange(num) {
      //分页第几页 变化
      this.page.page = num;
      this.dataList(true);
    },
    clickRow(row, event, column) {
      //表格点击行
    },
    dataList(bool) {
      //获取数据列表
      let data = {};
      data.page = this.page.page;
      data.limit = this.page.limit;
      if (bool) {
        data.page = 1;
      }
      for (const key in this.searchObj) {
        if (this.searchObj.hasOwnProperty(key)) {
          if (this.searchObj[key]) {
            data[key] = this.searchObj[key];
          }
        }
      }
      this.loading = true;
      this.$http({
        url: this.$api.user.queryAllUser,
        data: data,
        success: function(res) {
          this.tableData = res.data;
          this.loading = false;
          this.page.totalPage = res.count;
        }.bind(this)
      });
    },
    saveUser() {
      //提交用户
      if (!this.userObj.username) {
        this.$message({
          type: "warning",
          message: "请输入用户名!"
        });
        return;
      }
      if (!this.userObj.password) {
        this.$message({
          type: "warning",
          message: "请输入用户密码!"
        });
        return;
      }
      let data = {};
      for (const key in this.userObj) {
        if (this.userObj.hasOwnProperty(key)) {
          data[key] = this.userObj[key];
        }
      }
      data.password = this.$md5(this.userObj.password + this.userObj.username);

      let url = "";
      if (this.userTitle == "编辑用户") {
        url = this.$api.user.editUserById;
        data.userId = this.currow.id;
      }else{
        url = this.$api.user.addUser;
        delete data.userId;
      }

      this.$confirm("此操作将" + this.userTitle + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: url,
            data: data,
            success: res => {
              this.isShowUser = false;
              this.$message({
                type: "success",
                message: `${this.userTitle}成功！`
              });
              this.dataList();
            }
          });
        })
        .catch(() => {});
    },
    addUser(){
      this.userTitle = "新增用户";
      this.isShowUser = true;
      for (const key in this.userObj) {
        if (this.userObj.hasOwnProperty(key)) {
          this.userObj[key] = '';
        }
      }
    },
    editUser(row) {
      this.userTitle = "编辑用户";
      this.isShowUser = true;
      for (const key in this.userObj) {
        if (this.userObj.hasOwnProperty(key)) {
          this.userObj[key] = row[key];
        }
      }
      this.currow = row;
    },
    delLM(id) {
      this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$api.user.deleteUserByUserId,
            data: {
              userId: id
            },
            success: res => {
              this.$message({
                type: "success",
                message: `删除成功！`
              });
              this.dataList();
            }
          });
        })
        .catch(() => {});
    },
    reset() {
      for (const key in this.searchObj) {
        if (this.searchObj.hasOwnProperty(key)) {
          this.searchObj[key] = "";
        }
      }
      this.dataList(true);
    },
    resetPassword(id) {
      //重置密码
      this.$confirm("此操作将重置该用户的密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$api.user.resetUserByUserId,
            data: {
              userId: id
            },
            success: res => {
              this.$message({
                type: "success",
                message: `重置密码成功！`
              });
              this.dataList();
            }
          });
        })
        .catch(() => {});
    }
  },
  computed: {
    getTableHeight() {
      return this.$store.state.globalVarFunction.tableHeight;
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // this.dataList();
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {}
};
</script>

<style scoped lang="scss">
.yonghuadmin-box {
  padding: 10px 10px 5px;
  .search-box {
    position: relative;
    .btn-right {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .table {
    padding-top: 10px;
  }
  .pagination {
    text-align: right;
  }
}
</style>
