import { hydrate, mount } from 'svelte';
import App from './App.svelte';
const target = document.getElementById('app');
const options = {target, props:{path:location.pathname}};
if (target.hasChildNodes()) hydrate(App, options);
else mount(App, options);
