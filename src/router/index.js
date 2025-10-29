import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "Home", component: () => import("../views/Home.vue") },
        { path: "/register", name: "Register", component: () => import("../views/Register.vue") },
        { 
            path: "/feed", 
            component: () => import("../views/Feed.vue"),
            meta: {
                requiresAuth: true,
            }
        },
    ]  
});

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

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        var user = await getCurrentUser(); 
        if (user) {
            to.meta.userUID = user.uid;
            next();
        } else {
            alert("You dont have access!");
            next("/");
        }
    } else {
        next();
    }
});

export default router;