import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //这里放全局参数
        usersPermission: [],
        //登录用户
        userMsg: {},
        permission:[],//用户拥有权限
        updateNav:false,
    },
    mutations: {
        //这里是set方法
        setUsersPermission(state, usersPermission) {
            state.usersPermission = usersPermission;
        },
        setUpdateNav(state, updateNav) {
            state.updateNav = updateNav;
        },
        getUserMsg(state) {
            try {
                let userMsg = localStorage.getItem("fpp-userMsg");
                state.userMsg = JSON.parse(userMsg);
            } catch (error) {
                state.userMsg = {};
            }
        },
        initUserMsg(state) {
            state.userMsg = {};
            localStorage.removeItem("fpp-userMsg");
        },
        upDataUserMsg(state, vel) {
            try {
                localStorage.setItem("fpp-userMsg", JSON.stringify(vel));
                state.userMsg = vel;
            } catch (error) {
            }
        },
        savePermission(state, vel) {
            try {
                localStorage.setItem("fpp-permission", JSON.stringify(vel));
                state.permission = vel;
            } catch (error) {
            }
        }
    },
    getters: {
        //get方法
    },
    actions: {},
    modules: {}
});
