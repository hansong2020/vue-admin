<template>
  <div v-if="show">
    <el-button
      type="primary"
      icon="el-icon-roundadd"
      class="handle-del mr10"
      @click="createProp"
    >添加属性</el-button>
    <el-button
      type="primary"
      icon="el-icon-roundadd"
      class="handle-del mr10"
      @click="dataTemplateShow"
    >数据模版</el-button>
    <el-table
      :data="propData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column v-if="false" prop="id" label="ID" />
      <el-table-column prop="identifier" label="属性标识" width="200" align="center" />
      <el-table-column prop="propName" label="属性名称" align="center" />
      <el-table-column prop="dataType" label="数据类型" align="center" />
      <el-table-column prop="attr" label="属性" :formatter="formatAttr" align="center" />
      <el-table-column prop="wrType" label="只读" :formatter="formatWRType" align="center" />
      <el-table-column prop="funcStatus" label="状态" :formatter="formatFuncStatus" align="center" />
      <el-table-column prop="propDesc" label="描述" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="editPropHandle(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            class="red"
            @click="delPropHandle(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            type="text"
            class="red"
            @click="release(scope.$index, scope.row)"
          >发布</el-button>
        </template>
      </el-table-column>
    </el-table><!--属性表单结束-->
    <el-dialog title="新增属性" :visible.sync="dialogAddPropVisible">
      <el-form ref="propForm" :model="propForm" :rules="propFormRules">
        <el-form-item label="属性名称" prop="propName">
          <el-input v-model="propForm.propName" label-width="50px" />
        </el-form-item>
        <!--                <el-form-item label="标识符"  prop="identifier">-->
        <!--                    <el-input v-model="propForm.identifier" :label-width="formLabelWidth" autocomplete="off"></el-input>-->
        <!--                </el-form-item>-->
        <byte-tree ref="byteCreateForm" :show="createByteShow" />

        <el-form-item label="读写类型" prop="wrType">
          <el-radio-group v-model="propForm.wrType">
            <el-radio label="1">读写</el-radio>
            <el-radio label="0">只读</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="propDesc">
          <el-input v-model="propForm.propDesc" placeholder="请输入描述" type="textarea" rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCreateCancel">取 消</el-button>
        <el-button type="primary" @click="onCreateProp">确 定</el-button>
      </div>
    </el-dialog><!--新增属性结束-->
    <el-dialog title="编辑属性" :visible.sync="dialogEditPropVisible">
      <el-form ref="propEditForm" :model="propEditForm" :rules="propFormRules">
        <el-form-item label="属性名称" prop="propName">
          <el-input v-model="propEditForm.propName" label-width="50px" />
        </el-form-item>
        <byte-retrieve-tree ref="retrieveTree" :show="true" :form-data="propEditForm" />
        <el-form-item label="读写类型" prop="wrType">
          <el-radio-group v-model="propEditForm.wrType">
            <el-radio :label="1">读写</el-radio>
            <el-radio :label="0">只读</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="propDesc">
          <el-input v-model="propEditForm.propDesc" placeholder="请输入描述" type="textarea" rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancelPropHandle">取 消</el-button>
        <el-button type="primary" @click="onEditSubmit">确 定</el-button>
      </div>
    </el-dialog><!--编辑属性结束-->

    <el-dialog title="数据模版" :visible.sync="templateShow">
      请求数据格式 <br>
      <json-viewer
        :value="templateRequest"
        :expand-depth="5"
        copyable
        boxed
        sort
      />
      数据说明模版<br>
      <json-viewer
        :value="templateData"
        :expand-depth="5"
        copyable
        boxed
        sort
      />
    </el-dialog><!--数据模版结束-->

  </div>
</template>

<script>

import {
  productPropsApi, propDelApi,
  propDetailApi, propsCreateApi,
  propsEditApi, propsReleaseApi, propsTemplateApi
} from '../../../api/product'

export default {
  name: 'PropMgrPage',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    productCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateData: {},
      templateRequest: {},
      templateShow: false,
      editByteShow: true,
      createByteShow: true,
      propData: [],
      delPropdialogVisible: false,
      dialogEditPropVisible: false,
      formLabelWidth: '120px',
      propEditForm: {
        propName: '',
        identifier: '',
        propDesc: '',
        attr: null,
        wrType: null,
        dataType: null,
        funcType: 'PROP'
      },

      propForm: {
        propName: '',
        identifier: '',
        propDesc: '',
        attr: null,
        wrType: null,
        funcType: 'PROP'
      },
      propFormRules: {
        propName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        identifier: [{ required: true, message: '请选输入标识符', trigger: 'blur' }],
        dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        propDesc: [{ max: 160, message: '描述最多160个字符', trigger: 'blur' }]
      },
      dialogAddPropVisible: false
    }
  },
  created() {
    this.initProps()
  },
  methods: {
    dataTemplateShow() {
      this.templateShow = true
    },

    release(index, row) {
      const id = row.id
      this.$confirm('确定要发布吗？', '提示', {
        type: 'warning'
      }).then(() => {
        propsReleaseApi(id).then(response => {
          console.log(response)
          this.$message.success('发布成功')
          this.initProps()
        }).catch(error => {
          reject(error)
        })
      }).catch(() => {})
    },
    createProp() {
      this.dialogAddPropVisible = true
    },
    formatWRType(row, column) {
      if (row.wrType == '1') {
        return '否'
      } else if (row.wrType == '0') {
        return '是'
      }
      return '-'
    },
    formatFuncStatus(row, column) {
      if (row.funcStatus == '1') {
        return '已发布'
      } else if (row.funcStatus == '0') {
        return '草稿'
      }
      return '-'
    },
    editPropHandle(index, row) {
      this.dialogEditPropVisible = true
      const id = row.id
      propDetailApi(id).then(data => {
        const retValue = data.data
        this.propEditForm = retValue
      })/** ajax end*/
    },
    delPropHandle(index, row) {
      const id = row.id
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        propDelApi(id).then(response => {
          console.log(response)
          this.$message.success('删除成功')
          this.initProps()
        }).catch(error => {
          reject(error)
        })
      }).catch(() => {})
    },
    initProps() {
      productPropsApi(this.productCode, 'PROP').then(data => {
        const retValue = data.data
        this.propData = retValue
      })

      const param = {
        productCode: this.productCode,
        funcType: 'PROP'
      }
      propsTemplateApi(param).then(data => {
        const retValue = data.data
        this.templateRequest = retValue.demoData
        this.templateData = retValue.template
      })
      this.$emit('initProps')
    },
    editCancelPropHandle() {
      this.dialogEditPropVisible = false
      this.$refs['propEditForm'].resetFields()
    },
    onEditSubmit() {
      this.$refs.propEditForm.validate(valid => {
        if (valid) {
          this.propEditForm.productCode = this.productCode
          const para = this.propEditForm
          let attrObj
          this.$nextTick(() => {
            attrObj = this.$refs.retrieveTree.getData()
          })

          para.attr = JSON.stringify(attrObj)
          propsEditApi(para).then(data => {
            this.$message.success('提交成功！')
            this.$refs['propEditForm'].resetFields()
            this.dialogEditPropVisible = false
            this.initProps()
          })/** end ajax*/
        }/** valid true*/ else {
          this.$message.success('校验失败！')
        }/** valid false*/
      })
    },

    onCreateCancel() {
      this.$refs['propForm'].resetFields()
      this.dialogAddPropVisible = false
    },
    onCreateProp() {
      const attr = this.$refs.byteCreateForm.getData()
      const attrObj = JSON.stringify(attr)
      this.propForm.productCode = this.productCode
      const para = this.propForm
      para.attr = attrObj
      para.identifier = attr.identifier
      this.$refs.propForm.validate(valid => {
        if (valid) {
          propsCreateApi(para).then(data => {
            const retValue = data.data
            const { msg, code } = data
            console.log(retValue)
            this.$message.success('提交成功！')
            this.$refs['propForm'].resetFields()
            this.dialogAddPropVisible = false
            this.initProps()
            this.$refs.byteCreateForm.reset()
          })/** end ajax*/
        }/** valid true*/ else {
          this.$message.success('校验失败！')
        }/** valid false*/
      })
    }/** func onCreateProp ends*/
  }
}
</script>

<style scoped>

</style>
