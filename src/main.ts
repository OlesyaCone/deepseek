import { createApp } from 'vue';
import App from './App.vue';
import router from './router.ts'; // Импортируем роутер

const app = createApp(App);

app.use(router); // Подключаем роутер
app.mount('#app');