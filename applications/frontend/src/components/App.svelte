<script lang="ts">
  import Counter from '../lib/Counter.svelte'
  import Layout from './Layout.svelte';

  import '../env';
</script>

<Layout>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      Vite
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      Svelte
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</Layout>

<style>
  .read-the-docs {
    color: #888;
  }
</style>
