import Vue from 'vue'
import Router from 'vue-router'

//非登录路由
const Login = () => import('@/views/login/Login')
const Register = () => import('@/views/register/Register');
const Silingsi = () => import('@/views/components/404');

//主路由
const Home = () => import('@/views/home/Home');
const Common = () => import('@/views/home/Common');

//文档路由
const ElementUIFormat = () => import('@/views/doc/ElementUIFormat');
const Design = () => import('@/views/doc/Design');
const WebStandard = () => import('@/views/doc/WebStandard');


// 去掉header和aside的登录页面路由
const Duli = () => import('@/views/home/independent/duli');


Vue.use(Router);

// admin：1，普通用户：2

let router = new Router({
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/silingsi',
      name: 'silingsi',
      component: Silingsi
    },
    //首页栏目--菜单 路由
    // {
    //   path: '/home',
    //   name: 'home',
    //   meta: {
    //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    //     title: '首页',
    //     icon: 'iconfont icon-home1',
    //     id: '1',
    //     bool: '',
    //     level: 1
    //   },
    //   component: Home,
    //   redirect: '/home/shouye',
    //   children: [
    //     {
    //       path: 'shouye',
    //       name: 'shouye',
    //       meta: {
    //         requireAuth: true,
    //         title: '首页',
    //         icon: 'iconfont icon-list',
    //         id: '1-1',
    //         bool: '',
    //         level: 2,
    //         permission: [1],
    //         url: '/home/shouye'
    //       },
    //       component: () => import('@/views/home/module-shouye/shouye'),
    //       children: []
    //     },
    //     { path: '*', component: Silingsi }
    //   ]
    // },
    //数据
    {
      path: '/shuju',
      name: 'shuju',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        title: '数据',
        icon: 'iconfont icon-lianmeng',
        id: '2',
        bool: '',
        level: 1,
      },
      component: Home,
      redirect: '/shuju/shujuguanli',
      children: [
        {
          path: 'shujuguanli',
          name: 'shujuguanli',
          meta: {
            requireAuth: true,
            title: '数据管理',
            icon: 'iconfont icon-lianmengguanli',
            id: '2-1',
            bool: '',
            level: 2,
            permission: [1],
            url: '/shuju/shujuguanli'
          },
          component: () => import('@/views/home/module-shuju/shujuguanli'),
          children: []
        },
        { path: '*', component: Silingsi }
      ]
    },
    {
      path: '/doc/elementuiformat',
      name: 'elementuiformat',
      component: ElementUIFormat
    },
    {
      path: '/doc/design',
      name: 'design',
      component: Design
    },
    {
      path: '/doc/webstandard',
      name: 'webstandard',
      component: WebStandard
    },
    { path: '*', component: Silingsi },
  ]
})

//登录拦截
router.beforeEach((to, from, next) => {
  if (JSON.parse(sessionStorage.getItem("userInfo")) && to.meta.permission && !to.meta.permission.includes(Number(JSON.parse(sessionStorage.getItem("userInfo")).role))) {
    //如果登录账户没有某个权限的页面，则输入该页面地址返回404；
    let url = to.fullPath.split("/")[1];
    if (url) {
      next({
        path: url + "/*"
      });
    } else {
      next({
        path: "/silingsi"
      });
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.matched.length === 0) {
    //如果未匹配到路由
    if (from.path) {
      next({ path: from.path });
    } else {
      next("/login");
    }
    //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
  } else if (to.meta.requireAuth) {
    //是否存在登录的标志
    if (localStorage.getItem("hasLogin")) {
      next();
    } else {
      next({
        path: "/login"
      });
    }
  } else {
    next();
  }
});
export default router;
