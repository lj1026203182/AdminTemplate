/*
 * @Descripttion:
 * @version:
 * @Author: Lj
 * @Date: 2019-08-08 09:20:01
 * @LastEditors: Lj
 * @LastEditTime: 2019-08-14 11:54:51
 */
/*
============================
@Author:   LJ
@Version:  1.0
@DateTime: 2019-08-07 10:47:33
@Description: 权限访问控制
============================
*/
const DOMAIN = '/'

// 变量与接口名对应关系
const URL_MAP = {
  userConfig: DOMAIN + 'admin/Config/index',
  userConfigEdit: DOMAIN + 'admin/Config/edit',
  userApp: DOMAIN + 'admin/App/index',
  userAppEdit: DOMAIN + 'admin/App/edit',
  userLogLogin: DOMAIN + 'admin/Log/login',
  userLogDellogin: DOMAIN + 'admin/Log/dellogin',
  userLogLog: DOMAIN + 'admin/Log/log',
  userLogDellog: DOMAIN + 'admin/Log/dellog',
  userManager: DOMAIN + 'admin/Manager/index',
  userManagerAdd: DOMAIN + 'admin/Manager/add',
  userManagerEdit: DOMAIN + 'admin/Manager/edit',
  userManagerDel: DOMAIN + 'admin/Manager/del',
  userRole: DOMAIN + 'admin/Role/index',
  userRoleAdd: DOMAIN + 'admin/Role/add',
  userRoleEdit: DOMAIN + 'admin/Role/edit',
  userRoleDel: DOMAIN + 'admin/Role/del',
  userKnowledge: DOMAIN + 'admin/Knowledge/index',
  userKnowledgeAdd: DOMAIN + 'admin/Knowledge/add',
  userKnowledgeEdit: DOMAIN + 'admin/Knowledge/edit',
  userKnowledgeDel: DOMAIN + 'admin/Knowledge/del',
  userLinkagetype: DOMAIN + 'admin/Linkagetype/index',
  userLinkagetypeAdd: DOMAIN + 'admin/Linkagetype/add',
  userLinkagetypeEdit: DOMAIN + 'admin/Linkagetype/edit',
  userLinkagetypeDel: DOMAIN + 'admin/Linkagetype/del',
  userLinkage: DOMAIN + 'admin/Linkage/index',
  userLinkageAdd: DOMAIN + 'admin/Linkage/add',
  userLinkageEdit: DOMAIN + 'admin/Linkage/edit',
  userLinkageDel: DOMAIN + 'admin/Linkage/del',
  userUser: DOMAIN + 'admin/User/index',
  userUserDel: DOMAIN + 'admin/User/del',
  userUserEdit: DOMAIN + 'admin/User/edit',
  userUserAdd: DOMAIN + 'admin/User/add',
  userUsertype: DOMAIN + 'admin/Usertype/index',
  userUsertypeAdd: DOMAIN + 'admin/Usertype/add',
  userUsertypeEdit: DOMAIN + 'admin/Usertype/edit',
  userUsertypeDel: DOMAIN + 'admin/Usertype/del',
  userHidden: DOMAIN + 'admin/Hidden/index',
  userHiddenShow: DOMAIN + 'admin/Hidden/show',
  userHiddenDel: DOMAIN + 'admin/Hidden/del',
  userHiddenEdit: DOMAIN + 'admin/Hidden/edit',
  userNotice: DOMAIN + 'admin/Notice/index',
  userNoticeEdit: DOMAIN + 'admin/Notice/edit',
  userNoticeDel: DOMAIN + 'admin/Notice/del',
  userNoticeAdd: DOMAIN + 'admin/Notice/add'
}

// 接口访问权限对应的变量
var varMap = {
  userConfig: false,
  userConfigEdit: false,
  userApp: false,
  userAppEdit: false,
  userLogLogin: false,
  userLogDellogin: false,
  userLogLog: false,
  userLogDellog: false,
  userManager: false,
  userManagerAdd: false,
  userManagerEdit: false,
  userManagerDel: false,
  userRole: false,
  userRoleAdd: false,
  userRoleEdit: false,
  userRoleDel: false,
  userKnowledge: false,
  userKnowledgeAdd: false,
  userKnowledgeEdit: false,
  userKnowledgeDel: false,
  userLinkagetype: false,
  userLinkagetypeAdd: false,
  userLinkagetypeEdit: false,
  userLinkagetypeDel: false,
  userLinkage: false,
  userLinkageAdd: false,
  userLinkageEdit: false,
  userLinkageDel: false,
  userUser: false,
  userUserDel: false,
  userUserEdit: false,
  userUserAdd: false,
  userUsertype: false,
  userUsertypeAdd: false,
  userUsertypeEdit: false,
  userUsertypeDel: false,
  userHidden: false,
  userHiddenShow: false,
  userHiddenDel: false,
  userHiddenEdit: false,
  userNotice: false,
  userNoticeAdd: false,
  userNoticeEdit: false,
  userNoticeDel: false
}

// 登录时候获取可以并根据可以访问的接口更改限制前端页面的变量
const SetAccessRule = (urlList, urlMap, varMap) => {
  for (let item in urlList) {
    SetMapRelationTrue(urlList[item], urlMap, varMap)
  }
}

const SetMapRelationTrue = (url, urlMap, varMap) => {
  // 所有的url都改为小写
  for (let item in urlMap) {
    if (url === urlMap[item]) {
      varMap[item] = true
    }
  }
}

export { DOMAIN, URL_MAP, varMap, SetAccessRule }
