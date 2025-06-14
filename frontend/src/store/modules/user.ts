import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { MessagePlugin } from 'tdesign-vue-next';

import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

// 模拟用户数据
const MOCK_USERS = [
  {
    username: 'admin',
    password: '123456',
    admin_token: 'mock_admin_token_123456',
    is_admin: true,
    name: '管理员'
  },
  {
    username: 'user',
    password: '123456',
    admin_token: 'mock_user_token_123456',
    is_admin: false,
    name: '普通用户'
  }
];

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '', // 默认token不走权限
    is_admin: false,
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(url: string, userInfo: Record<string, unknown>) {
      try {
        // 模拟登录验证
        const { username, password } = userInfo;
        
        // 查找匹配的用户
        const user = MOCK_USERS.find(u => 
          u.username === username && u.password === password
        );

        if (!user) {
          MessagePlugin.error('用户名或密码错误');
          return null;
        }

        // 模拟成功响应
        const data = {
          admin_token: user.admin_token,
          is_admin: user.is_admin,
          message: '登录成功'
        };

        this.token = data.admin_token;
        this.is_admin = data.is_admin;
        this.userInfo.name = user.name;
        
        // 保存到本地存储
        Cookies.set('user_token', data.admin_token, { expires: 7 });
        localStorage.setItem('user_token', data.admin_token);
        
        MessagePlugin.success('登录成功');
        return data;

      } catch (error) {
        console.error('Login error:', error);
        MessagePlugin.error('登录失败，请稍后重试');
        return null;
      }
    },

    async logout() {
      this.token = '';
      this.is_admin = false;
      this.userInfo = { ...InitUserInfo };
      
      // 清除本地存储
      Cookies.remove('user_token');
      localStorage.removeItem('user_token');
      sessionStorage.removeItem('user_token');
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token', 'is_admin', 'userInfo'],
  },
});