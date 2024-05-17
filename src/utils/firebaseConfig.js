// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6G-QJEOOl5-AZkMNt8--WZxJYi1mJiUo",
  authDomain: "taskmt-41269.firebaseapp.com",
  projectId: "taskmt-41269",
  storageBucket: "taskmt-41269.appspot.com",
  messagingSenderId: "973726530246",
  appId: "1:973726530246:web:fd1b6668e59142e7fb35c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const auth = getAuth(app);
const storage = getStorage(app);
export { auth, googleProvider, githubProvider, storage };
