importScripts('js/sw-utilis.js');
//https://gustavodeveloper597.github.io/pwa1/
const STATIC_CACHE = 'static-v2';
const DINAMIC_CACHE = 'dinamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/JavaEscritorio/pwa/06-twittor/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js'

];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {
    let cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SHELL);
    });
    let cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key != STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        })
    });
    e.waitUntil(respuesta);
});


self.addEventListener('fetch', e => {

    const resp = caches.match(e.request).then(response => {

        if (response) {
            console.log('existe ', e.request.url)
            return response;
        } else {
            console.log('No existe', e.request.url);
            return fetch(e.request).then(resp2 => {
                return actualizaCacheDinamico(DINAMIC_CACHE, e.request, resp2);
            });
        }
    });

    e.respondWith(resp);
});