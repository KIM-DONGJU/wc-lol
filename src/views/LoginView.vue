<template>
  <v-container class="login-root" style="max-width: 450px" fill-height>
    <v-layout class="w-100" align-center row wrap>
      <v-card width="100%">
        <div class="pa-10">
          <h1 style="text-align: center" class="mb-10">로그인</h1>
          <form>
            <v-text-field v-model="bindId" label="ID" prepend-inner-icon="mdi-account" />
            <v-text-field
              v-model="bindPassword"
              prepend-inner-icon="mdi-lock"
              type="password"
              label="Password"
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
import { supabase } from '@/supabase'
import { onMounted, reactive, ref } from 'vue'
import { GoogleLogin } from 'vue3-google-login'

const bindId = ref('')
const bindPassword = ref('')

const signInGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        accessType: 'offline',
        prompt: 'consent'
      }
    }
  })
}

const googleInit = () => {
  let google = window.google
  google.accounts.id.initialize({
    // 개발자센터 client id
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: signInGoogle
  })

  google.accounts.id.renderButton(document.getElementById('G_OAuth_btn') as HTMLElement, {
    theme: 'outline',
    size: 'large'
  })
}

onMounted(() => {
  googleInit()
})

const onGoogleLoginSuccess = (googleUser: any) => {
  console.log(googleUser)
}
</script>

<style scoped lang="scss">
.login-root {
  min-height: 400px;
  height: calc(100vh - 53px);
  display: flex;
  align-items: center;
}
</style>
