import { ref } from 'vue';

import { defineStore } from 'pinia';
import { supabase } from '@/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();

      return data.user;
    };

    const user = ref<User>();

    const initUserData = async () => {
      if (user.value) {
        return;
      }

      const userData = await getUserData();
      if (userData) {
        user.value = userData;
      }
    };

    return { user, initUserData };
  },
  {
    persist: [
      {
        storage: sessionStorage,
        paths: ['user'],
      },
    ],
  }
);
