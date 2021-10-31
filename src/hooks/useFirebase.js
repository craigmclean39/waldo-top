// FIREBASE
import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCT6VF6-hpwrvyxLt5FsnZ6lbhpk6F0TJs',
  authDomain: 'waldo-top.firebaseapp.com',
  projectId: 'waldo-top',
  storageBucket: 'waldo-top.appspot.com',
  messagingSenderId: '528968030396',
  appId: '1:528968030396:web:1f7ce4fd8d58c9cc0718b9',
};

const useFirebase = () => {
  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);
};

export { useFirebase };
