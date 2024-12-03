import { mount } from 'svelte';

import App from './App.svelte';
import './css/app.css';

const app = mount(App, {
  target: document.getElementById('root')!,
});

export default app;
