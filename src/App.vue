<template>
  <div class="flex flex-row w-full justify-center relative">
    <div>
      <Header/>
    </div>
    <div v-if="isLoggedIn" class="fixed top-5 right-5">
      <button @click="handleSignOut" type="button" class="text-white bg-emerald-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Log out
        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </button>
    </div>
  </div>
  <router-view/>
  <Footer/>
</template>

<script setup>
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
  import { onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'

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
