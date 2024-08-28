import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface ShowToastMessageParams {
  message: string;
  color?: string;
  timeout?: number;
  isFooter?: boolean;
}

export const useCommonStore = defineStore('common', () => {
  const toastMessage = reactive({
    show: false,
    message: '',
    color: 'success',
    timeout: 5000,
    isFooter: false,
  });

  const showToast = ({
    message,
    color = 'success',
    timeout = 3000,
    isFooter = false,
  }: ShowToastMessageParams) => {
    toastMessage.show = true;
    toastMessage.message = message;
    toastMessage.color = color;
    toastMessage.timeout = timeout;
    toastMessage.isFooter = isFooter;
  };

  return {
    toastMessage,
    showToast,
  };
});
