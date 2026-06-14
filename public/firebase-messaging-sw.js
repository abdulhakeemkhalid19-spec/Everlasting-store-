importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AlzaSyD8J7fCRBuI4U9vJ9_qwwSg16sHXZDegUg',
  projectId: 'everlasting-store',
  messagingSenderId: '589398017448',
  appId: '1:589398017448:web:e678594b625e2fbb68899d',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification
  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  })
})
