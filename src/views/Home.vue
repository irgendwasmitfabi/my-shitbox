<template>
    <div class="flex justify-center">
        <div class="w-1/4">
            <div class="p-7">
                <h1>Log In</h1>
            </div>
        <div class="p-5">
            <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
            <div class="relative mb-6">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                    </svg>
                </div>
                <input v-model="email" type="text" id="input-group-1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@mail.com">
            </div>
            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input v-model="password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
            </div> 
        </div>
        <div v-if="errMsg" class="mb-6">
            <p class="block mb-2 text-sm font-medium text-red-700 dark:text-red-500">{{ errMsg }}</p>
        </div>
        <div class="flex flex-col">
            <button @click="register" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log In</button>
            <button @click="signInWithGoogle" type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
                <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
                </svg>
                Sign in with Google
            </button>
        </div>
        <div>
            <router-link to="/register"> Register </router-link>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onBeforeMount  } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

var email = ref("");
var password = ref("");
var errMsg = ref();
var router = useRouter();

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        var removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

onBeforeMount(async () => {
  var user = await getCurrentUser();
  if (user) {
    router.replace({ path: "/feed", query: { uid: user.uid } });
  }
});

const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
        router.push('/feed')
    })
    .catch((error) => {
        console.log(error.code);
        switch (error.code) {
            case "auth/invalid-email":
                errMsg.value = "Invalid E-Mail"
                break;
            case "auth/invalid-credential":
                errMsg.value = "Invalid Credentials"
                break;
            case "auth/user-not-found":
                errMsg.value = "No account with this E-Mail was found"
                break;
            case "auth/wrong-password":
                errMsg.value = "Incorrect password"
                break;
            default:
                break;
        }
    })
};

const signInWithGoogle = () => {
    var provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((result) => {
        console.log(result.user);
        router.push("/feed");
    })
    .catch((error) => {
        console.log(error.code);
    })
};
</script>