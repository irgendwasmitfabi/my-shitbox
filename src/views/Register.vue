<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm">
      <div class="mb-8">
        <p class="text-[10px] tracking-[0.25em] uppercase text-[#444] mb-1">Get started</p>
        <h1 class="text-3xl font-bold uppercase tracking-widest text-[#f0ede8]">Register</h1>
        <div class="mt-3 w-8 h-0.5 bg-[#e8c84a]"></div>
      </div>
      <div class="flex flex-col gap-4 mb-6">
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] tracking-[0.2em] uppercase text-[#555]">E-Mail</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" fill="currentColor" viewBox="0 0 20 16">
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
            </svg>
            <input
              v-model="email"
              type="text"
              placeholder="name@mail.com"
              class="w-full bg-[#141414] border border-[#2a2a2a] text-sm text-[#c0bdb8] placeholder:text-[#333] pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-[#e8c84a] transition-colors duration-150"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] tracking-[0.2em] uppercase text-[#555]">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••••"
            class="w-full bg-[#141414] border border-[#2a2a2a] text-sm text-[#c0bdb8] placeholder:text-[#333] px-4 py-2.5 rounded-sm focus:outline-none focus:border-[#e8c84a] transition-colors duration-150"
          />
        </div>
      </div>
      <div v-if="errMsg" class="mb-4 px-3 py-2 border border-red-900/50 bg-red-950/30 rounded-sm">
        <p class="text-xs text-red-400 tracking-wide">{{ errMsg }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <button
          @click="register"
          class="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-semibold bg-[#e8c84a] text-[#0e0e0e] hover:bg-[#f0d660] transition-colors duration-150 rounded-sm"
        >
          Create Account
        </button>
        <button
          @click="signInWithGoogle"
          class="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-semibold border border-[#2a2a2a] text-[#888] hover:border-[#3a3a3a] hover:text-[#f0ede8] transition-all duration-150 rounded-sm flex items-center justify-center gap-2"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 18 19">
            <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
          </svg>
          Sign up with Google
        </button>
      </div>
      <div class="mt-6 pt-4 border-t border-[#1a1a1a]">
        <router-link to="/" class="text-[10px] tracking-[0.2em] uppercase text-[#444] hover:text-[#888] transition-colors duration-150">
          Already have an account? Log in &rarr;
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

var email = ref("");
var password = ref("");
var errMsg = ref();
var router = useRouter();

var register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then(() => router.push('/feed'))
    .catch((error) => {
      switch (error.code) {
        case "auth/email-already-in-use": errMsg.value = "E-Mail already in use"; break;
        default: break;
      }
    });
};

const signInWithGoogle = () => {
  signInWithPopup(getAuth(), new GoogleAuthProvider())
    .then(() => router.push("/feed"))
    .catch((error) => console.log(error.code));
};
</script>