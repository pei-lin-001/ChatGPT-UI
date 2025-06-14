<template>
  <div class="login-wrapper">
    <!-- 顶部 ChatGPT 标题 -->
    <div class="login-header">
      <h1 class="login-brand">ChatGPT</h1>
    </div>

    <!-- 登录表单容器 -->
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">登录到您的账户</h2>
        
        <t-loading :loading="loading">
          <t-form :data="loginForm" :label-width="0" :rules="rules" ref="loginFormRef" @submit="onSubmit">
            <!-- 邮箱/用户名输入框 -->
            <t-form-item name="username">
              <t-input 
                v-model="loginForm.username" 
                placeholder="用户名或邮箱地址"
                size="large"
                class="login-input"
              />
            </t-form-item>

            <!-- 密码输入框 -->
            <t-form-item name="password">
              <t-input 
                v-model="loginForm.password" 
                type="password" 
                autocomplete="on" 
                placeholder="密码"
                size="large"
                class="login-input"
              />
            </t-form-item>

            <!-- 登录按钮 -->
            <t-form-item>
              <t-button 
                theme="primary" 
                type="submit" 
                size="large" 
                class="login-button"
                block
              >
                继续
              </t-button>
            </t-form-item>
          </t-form>
        </t-loading>

        <!-- 分隔线 -->
        <div class="divider">
          <span>或</span>
        </div>

        <!-- 第三方登录按钮 -->
        <div class="social-login">
          <t-button 
            variant="outline" 
            size="large" 
            class="social-button google-button"
            block
            @click="handleSocialLogin('google')"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </template>
            继续使用 Google 登录
          </t-button>

          <t-button 
            variant="outline" 
            size="large" 
            class="social-button microsoft-button"
            block
            @click="handleSocialLogin('microsoft')"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
            </template>
            继续使用 Microsoft 账户登录
          </t-button>

          <t-button 
            variant="outline" 
            size="large" 
            class="social-button apple-button"
            block
            @click="handleSocialLogin('apple')"
          >
            <template #icon>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </template>
            继续使用 Apple 登录
          </t-button>
        </div>

        <!-- 底部链接 -->
        <div class="login-footer">
          <t-link href="#" class="footer-link">使用条款</t-link>
          <span class="separator">|</span>
          <t-link href="#" class="footer-link">隐私政策</t-link>
        </div>

        <!-- 管理员快速登录提示 -->
        <div class="admin-hint">
          <t-alert theme="info" message="管理员账户：admin / 123456" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstanceFunctions, FormProps, FormRule, MessagePlugin } from 'tdesign-vue-next';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/store';

const userStore = useUserStore();
const loading = ref(false);
const router = useRouter();

// 默认设置管理员账户
const loginForm = reactive({
  username: 'admin',
  password: '123456',
});

const rules: Record<string, FormRule[]> = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const loginFormRef = ref<FormInstanceFunctions>(null);

const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    loading.value = true;
    
    try {
      // 使用模拟登录
      const data = await userStore.login('/0x/user/login', loginForm);
      
      if (data && data.admin_token) {
        if (data.is_admin) {
          // 管理员跳转到用户管理页面
          setTimeout(() => {
            router.push({ name: 'User' });
          }, 1000);
        } else {
          // 普通用户跳转到 ChatGPT 选择页面
          setTimeout(() => {
            router.push({ name: 'LoginChatgpt' });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      MessagePlugin.error('登录失败，请检查用户名和密码');
    } finally {
      loading.value = false;
    }
  } else {
    console.error('表单验证失败', firstError);
  }
};

const handleSocialLogin = (provider: string) => {
  MessagePlugin.info(`${provider} 登录功能暂未开放`);
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: #f7f7f8;
  display: flex;
  flex-direction: column;
}

.login-header {
  padding: 40px 0 20px;
  text-align: center;
}

.login-brand {
  font-size: 32px;
  font-weight: 600;
  color: #2d333a;
  margin: 0;
  letter-spacing: -0.5px;
}

.login-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d333a;
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.3;
}

.login-input {
  margin-bottom: 16px;
}

:deep(.login-input .t-input) {
  height: 52px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  transition: all 0.2s ease;
}

:deep(.login-input .t-input:focus) {
  border-color: #10a37f;
  box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
}

.login-button {
  height: 52px;
  background: #10a37f;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #0d8f6b;
  transform: translateY(-1px);
}

.divider {
  position: relative;
  text-align: center;
  margin: 32px 0;
  color: #6b7280;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-button {
  height: 52px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.social-button:hover {
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-button:hover {
  border-color: #4285f4;
}

.microsoft-button:hover {
  border-color: #00a4ef;
}

.apple-button:hover {
  border-color: #000;
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.footer-link {
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
}

.footer-link:hover {
  color: #10a37f;
}

.separator {
  margin: 0 12px;
  color: #d1d5db;
}

.admin-hint {
  margin-top: 24px;
}

:deep(.admin-hint .t-alert) {
  border-radius: 8px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}

:deep(.admin-hint .t-alert__message) {
  color: #0369a1;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 0 16px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .login-brand {
    font-size: 28px;
  }
}
</style>
</template>