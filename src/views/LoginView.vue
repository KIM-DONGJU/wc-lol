<template>
  <v-container class="login-root" fill-height style="max-width: 510px">
    <v-layout align-center class="w-100" row wrap>
      <v-card width="100%">
        <div class="pa-10">
          <h1 class="mb-10" style="text-align: center">로그인</h1>
          <form>
            <v-text-field v-model="bindId" label="ID" prepend-inner-icon="mdi-account" />
            <v-text-field
              v-model="bindPassword"
              label="Password"
              prepend-inner-icon="mdi-lock"
              type="password"
            />
            <!-- <v-btn
                    @click="addUserShow"
                    color="blue lighten-1 text-capitalize"
                    depressed
                    large
                    block
                    dark
                  >
                    Sign Up
                  </v-btn> -->
            <div id="G_OAuth_btn"></div>
          </form>
        </div>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script setup lang="ts">
import { supabase } from '@/supabase';
import { onMounted, ref } from 'vue';

const bindId = ref('');
const bindPassword = ref('');

const signInGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        accessType: 'offline',
        prompt: 'consent',
      },
      redirectTo: import.meta.env.DEV ? 'http://localhost:5173' : undefined,
    },
  });
};

const googleInit = () => {
  const google = window.google;
  google.accounts.id.initialize({
    // 개발자센터 client id
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: signInGoogle,
  });

  google.accounts.id.renderButton(document.getElementById('G_OAuth_btn') as HTMLElement, {
    theme: 'outline',
    size: 'large',
  });
};

onMounted(() => {
  googleInit();
});

const onGoogleLoginSuccess = (googleUser: any) => {
  console.log(googleUser);
};
</script>

<style scoped lang="scss">
.login-root {
  display: flex;
  align-items: center;
  height: calc(100vh - 53px);
  min-height: 400px;
}
</style>
