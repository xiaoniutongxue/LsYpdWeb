import Vue from 'vue'       /*引入vue*/
import VueRouter from 'vue-router'      /*引入路由*/
import index from '../view/index'       /*引入组件（入口）*/

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name:'index',
        component: index
    },
];

const router = new VueRouter({
    mode:'history',
    routes
});

export default router