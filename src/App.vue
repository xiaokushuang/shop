<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
    </div>
</template>
<script>
    import store from "@/store/index";
    import {mapMutations} from "vuex";

    export default {
        store,
        name: "app",
        provide(){
            return {
                reload:this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        mounted() {
            this.getUserMsg()
        },
        methods: {
            ...mapMutations(["getUserMsg"]),
            reload(){
                this.isRouterAlive = false
                this.$nextTick(()=>{
                    this.isRouterAlive = true
                })
            }
        }
    };
</script>
<style lang="scss">
    @import "./assets/css/base.css";

    #app {
        font-family: PingFangSC-Medium, PingFang SC;
        color: #2c3e50;
    }
</style>
