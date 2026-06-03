<template>
  <div class="min-h-screen bg-[#0e0e0e] text-[#f0ede8]">
    <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 bg-[#0e0e0e]/90 backdrop-blur-sm border-b border-[#2a2a2a]">
      <Header />
      <button
        v-if="isLoggedIn"
        @click="handleSignOut"
        class="flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-semibold px-4 py-2 border border-[#3a3a3a] text-[#a0a0a0] hover:border-[#f0ede8] hover:text-[#f0ede8] transition-all duration-200 rounded-sm"
      >
        Log out
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>
    </nav>
    <div class="pt-14">
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
  import { onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import Header from './components/Header.vue'

  var router = useRouter();
  var isLoggedIn = ref(false);

  var auth;
  onMounted(() => {
    auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    });
  });

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push("/");
    });
  };
</script>
