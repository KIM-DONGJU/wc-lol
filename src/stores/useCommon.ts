import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

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

  const loadingSpinner = ref(false);
  const setLoadingSpinner = (loading: boolean) => {
    loadingSpinner.value = loading;
  };

  return {
    toastMessage,
    showToast,
    loadingSpinner,
    setLoadingSpinner,
  };
});
