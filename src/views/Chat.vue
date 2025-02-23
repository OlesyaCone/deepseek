<script>
import "../styles/chat.scss";
import axios from "axios";

export default {
  data() {
    return {
      newMessage: "",
      messages: [
        {
          text: "Привет! Это DeepSeek!",
          sender: "other",
          time: "10:01",
        },
      ],
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() === "") return;
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("API Key:", import.meta.env.VITE_API_KEY);
      this.messages.push({
        text: this.newMessage,
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      const userMessage = this.newMessage;
      this.newMessage = "";

      this.scrollToBottom();

      try {
        if (!import.meta.env.VITE_API_KEY) {
          throw new Error(
            "API ключ не найден. Убедитесь, что он задан в .env файле."
          );
        }

        const response = await axios.post(
          "https://api.deepseek.com/v1/chat/completions",
          {
            model: "deepseek-chat",
            messages: [{ role: "user", content: userMessage }],
            temperature: 0.7,
            max_tokens: 150,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );


        if (
          response.data &&
          response.data.choices &&
          response.data.choices.length > 0
        ) {
          const deepseekResponse = response.data.choices[0].message.content;
          this.messages.push({
            text: deepseekResponse,
            sender: "other",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        } else {
          throw new Error("Пустой ответ от API");
        }

        this.scrollToBottom();
      } catch (error) {
        console.error("Ошибка при запросе к DeepSeek API:", error);

        if (error.response) {
          console.error("Данные ответа сервера:", error.response.data);
          console.error("Статус ошибки:", error.response.status);
          console.error("Заголовки ответа:", error.response.headers);
        } else if (error.request) {
          console.error(
            "Запрос был отправлен, но ответ не получен:",
            error.request
          );
        } else {
          console.error("Ошибка при настройке запроса:", error.message);
        }

        this.messages.push({
          text: "Произошла ошибка при обработке запроса(API на данный момент не работает). Пожалуйста, попробуйте позже.",
          sender: "other",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$el.querySelector(".chat-messages");
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    },
  },
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.sender]"
      >
        <div class="message-content">{{ message.text }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Введите сообщение..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>
