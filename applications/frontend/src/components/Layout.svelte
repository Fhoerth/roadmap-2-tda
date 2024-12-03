<script>
  export let content; // Propiedad para recibir contenido dinámico
</script>

<div class="flex flex-col w-full min-h-screen">
  <header class="bg-gray-800 shadow-md p-4 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <div class="text-2xl font-bold flex items-center gap-2">
        <span class="typoround text-gray-300">ROADMAP</span>
        <span class="typoround text-gray-100">2</span>
        <span class="typoround text-gray-300">TDA</span>
      </div>
    </div>
  </header>

  <main class="p-6 space-y-8 flex-grow bg-white">
    {#if content}
      {@html content}
    {:else}
      <slot /> <!-- Espacio para contenido hijo -->
    {/if}
  </main>
</div>
