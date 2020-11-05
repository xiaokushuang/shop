import ajaxRequest from "./axiosConfig";

const login = {
    //获取企业微信登录参数
    login: params =>
        ajaxRequest("GET", "/api/auth/crm_qywx_login", 1, params, false),
    //企业微信获取登录token
    loginMsg: params =>
        ajaxRequest(
            "GET",
            "/api/auth/crm_qywx_redirect_uri_finished",
            1,
            params,
            false
        ),
    //邮箱登录
    emailLogin: params =>
        ajaxRequest("POST", "/api/auth/crm_login", 1, params, false)
};
const getApproval = {
    //获取商户列表
    getApprovalList: params =>
        ajaxRequest("GET", "/api/crm/seller/unreview_seller", 1, params),
    //获取商户详情(通过商户id)
    getApprovalDetails: (id, params = {}) =>
        ajaxRequest("GET", `/api/crm/seller/seller/${id}`, 1, params),
    //获取商户详情(通过条目id)
    getApprovalRequRestDetails: (id, params = {}) =>
        ajaxRequest("GET", `/api/crm/seller/seller_request/${id}`, 1, params),
    //提交用户协议
    sendFiles: params =>
        ajaxRequest("POST", `/api/crm/seller/confirm_protocol_images`, 1, params)
};
const getBusiness = {
    BusinessList: params =>
        ajaxRequest("GET", "/api/crm/seller/normal_seller", 1, params),
    BusinessOptions: params =>
        ajaxRequest("GET", `/api/crm/user/roles/2/users`, 1, params),
    //id:商务id
    bindingBusiness: (id, params) =>
        ajaxRequest("POST", `/api/crm/user/users/${id}/sellers`, 1, params),
    //获取站点信息
    getSiteInformation: (id, params) =>
        ajaxRequest("GET", `/api/crm/seller/seller/${id}/store`, 1, params),
    getSupplementAgreement: (id, params) =>
        ajaxRequest("GET", `/api/crm/seller/seller_supplement/${id}`, 1, params),
    sendSupplementAgreement: params =>
        ajaxRequest(
            "POST",
            `/api/crm/seller/confirm_supplement_protocol_images`,
            1,
            params
        )
};
const examine = {
    //运营-财务审核
    opsOrFoExamine: params =>
        ajaxRequest("POST", "/api/crm/seller/review_seller", 1, params)
};
const organization = {
    //角色列表
    getRoleList: params => ajaxRequest("GET", "/api/crm/user/roles", 1, params),
    //用户列表
    getUserList: params => ajaxRequest("GET", "/api/crm/user/users", 1, params),
    //创建用户
    getCreateUser: params =>
        ajaxRequest("POST", "/api/crm/user/users", 1, params),
    //删除用户
    delUser: (params, id) =>
        ajaxRequest("DELETE", `/api/crm/user/users/${id}`, 1, params),
    //编辑用户
    editUser: (params, id) =>
        ajaxRequest("PUT", `/api/crm/user/users/${id}`, 1, params),
    //角色的用户列表
    getRelevanceList: (params, id) =>
        ajaxRequest("GET", `/api/crm/user/roles/${id}/users`, 1, params),
    //添加关联用户
    addRelevanceUser: (params, id) =>
        ajaxRequest("POST", `/api/crm/user/roles/${id}/users`, 1, params),
    //删除角色
    delRole: (params, id) =>
        ajaxRequest("DELETE", `/api/crm/user/roles/${id}`, 1, params),
    //创建角色
    createRole: params => ajaxRequest("POST", `/api/crm/user/roles`, 1, params),
    //重命名角色
    renameRole: (params, id) =>
        ajaxRequest("PUT", `/api/crm/user/roles/${id}`, 1, params),
    //设置角色权限
    setPermission: (params, id) =>
        ajaxRequest("POST", `/api/crm/user/roles/${id}/perms`, 1, params),
    //用户的角色列表
    getUsersRoleList: params =>
        ajaxRequest("GET", "/api/crm/user/users/my_roles", 1, params)
};
const returnVisit = {
    //回访进度列表
    getFollowProcess: params => ajaxRequest("GET", "/api/crm/seller/follow_process", 1, params),
    //回访记录列表
    getFollowRemark: params => ajaxRequest("GET", "/api/crm/seller/follow_remark", 1, params),
    //更新回访进度
    updateFollowProcess: params => ajaxRequest("POST", "/api/crm/seller/follow_process", 1, params),
    //提交回访记录
    updateFollowRemark: params => ajaxRequest("POST", "/api/crm/seller/follow_remark", 1, params),
}
const agentManagement = {
    //代理列表
    getAgentList: params => ajaxRequest("GET", "/api/crm/user/agent", 1, params),
    //代理详情
    getAgentInfoDetail: (params, id) => ajaxRequest("GET", `/api/crm/user/agent_info/${id}`, 1, params),
    //渠道列表
    getAgentSeller: params => ajaxRequest("GET", "/api/crm/user/agent_seller", 1, params),
    //分配商务列表
    distributeBusiness: (params, id) => ajaxRequest("POST", `/api/crm/user/users/${id}/agents`, 1, params),
    //获取代理个人信息
    getAgentInfo: params => ajaxRequest("GET", "/api/crm/user/agent_info", 1, params),
    //更新代理个人信息
    updateAgentInfo: params => ajaxRequest("POST", "/api/crm/user/confirm_agent_info", 1, params),
}
export {login, getApproval, organization, getBusiness, examine, returnVisit, agentManagement};
