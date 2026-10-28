import { render } from 'svelte/server';
import App from './App.svelte';
export function renderPage(path) { return render(App, {props:{path}}); }
