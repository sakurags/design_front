import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },
  {
    path: '/exam',
    name: 'exam',
    meta: {
      icon: 'md-menu',
      title: '考试管理'
    },
    component: Main,
    children: [
      {
        path: 'exam_1',
        name: 'exam_1',
        meta: {
          icon: 'md-funnel',
          title: '试卷管理'
        },
        component: parentView,
        children: [
          {
            path: 'exam_1_1',
            name: 'exam_1_1',
            meta: {
              icon: 'md-funnel',
              title: '批改试卷'
            },
            component: () => import('@/view/papers/markpaper.vue')
          },
          {
            path: 'exam_1_2',
            name: 'exam_1_2',
            meta: {
              icon: 'md-funnel',
              title: '查看试卷'
            },
            component: () => import('@/view/papers/viewpaper.vue')
          },
          {
            path: 'exam_1_3/:id',
            name: 'exam_1_3',
            hidden: false,
            meta: {
              icon: 'md-funnel',
              title: '试卷信息'
            },
            component: () => import('@/view/papers/paperdetails.vue')
          }
        ]
      },
      {
        path: 'exam_2',
        name: 'exam_2',
        meta: {
          access: ['super_admin'],
          icon: 'md-funnel',
          showAlways: true,
          title: '添加试题'
        },
        component: parentView,
        children: [
          {
            path: 'exam2_1',
            name: 'exam2_1',
            meta: {
              icon: 'md-funnel',
              title: '单选题'
            },
            component: () => import('@/view/question/mquestion.vue')
          },
          {
            path: 'exam2_2',
            name: 'exam2_2',
            meta: {
              icon: 'md-funnel',
              title: '多选题'
            },
            component: () => import('@/view/question/mquestions.vue')
          },
          {
            path: 'exam2_3',
            name: 'exam2_3',
            meta: {
              icon: 'md-funnel',
              title: '判断题'
            },
            component: () => import('@/view/question/tfquestion.vue')
          },
          {
            path: 'exam2_4',
            name: 'exam2_4',
            meta: {
              icon: 'md-funnel',
              title: '填空题'
            },
            component: () => import('@/view/question/fquestion.vue')
          },
          {
            path: 'exam2_5',
            name: 'exam2_5',
            meta: {
              icon: 'md-funnel',
              title: '简答题'
            },
            component: () => import('@/view/question/saquestion.vue')
          },
          {
            path: 'exam2_6',
            name: 'exam2_6',
            meta: {
              icon: 'md-funnel',
              title: '解答题'
            },
            component: () => import('@/view/question/aquestion.vue')
          },
        ]
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
