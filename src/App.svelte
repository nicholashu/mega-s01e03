<script>
  let {path} = $props();
  const pages = import.meta.glob('/src/routes/kb/**/+page.svx', {eager: true});
  const key = $derived('/src/routes' + path.replace(/\/$/, '') + '/+page.svx');
  const Page = $derived(pages[key]?.default);
</script>
{#if Page}<Page />{:else}<h1>Page not found</h1><a href="/kb">Knowledge base</a>{/if}
