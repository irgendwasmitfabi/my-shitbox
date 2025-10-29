<template>
    <div class="flex justify-center">
        <div class="w-1/4">
            <div class="p-7">
                <h1>Create an Account</h1>
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
                <p class="mb-3"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="register">Register</button></p>
                <p class="mb-2.5"><button class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="signInWithGoogle">Sign up with Google</button></p>
            </div>
            <div>
                <router-link to="/"> Already have an account? </router-link>
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
    .then((data) => {
        console.log("Registered!")
        router.push('/feed')
    })
    .catch((error) => {
        console.log(error.code);
        switch (error.code) {
            case "auth/email-already-in-use":
                errMsg.value = "E-Mail already in use"
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