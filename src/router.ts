import { createRouter, createWebHistory } from 'vue-router';
import Chat from './views/Chat.vue'; 
import Information from './views/Information.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: Chat,
    },
    {
      path: '/info',
      name: 'Information',
      component: Information,
    },
  ],
});

export default router;