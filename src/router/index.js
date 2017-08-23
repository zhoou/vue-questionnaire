import Vue from 'vue'
import Router from 'vue-router'

const Login = r => require.ensure([], () => r(require('@/components/login/Login.vue')), 'Login');
const Layout = r => require.ensure([], () => r(require('@/components/layout/Layout.vue')), 'Layout');
const Questionare = r => require.ensure([], () => r(require('@/components/questionare/Questionare.vue')), 'Questionare');
const NewHome = r => require.ensure([], () => r(require('@/components/edit/Home.vue')), 'NewHome');
const NewQuestionare = r => require.ensure([], () => r(require('@/components/edit/New.vue')), 'NewQuestionare');
const Edit = r => require.ensure([], () => r(require('@/components/edit/Edit.vue')), 'Edit');

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/platform',
            component: Layout,
            children: [{
                path: 'questionare',
                component: Questionare
            }, {
                path: 'new',
                component: NewHome,
                children: [{
                    path: '/',
                    component: NewQuestionare
                }, {
                    path: 'edit',
                    component: Edit
                }]
            }]
        },
        {
            path: '*',
            redirect: '/login'
        }
    ]
});