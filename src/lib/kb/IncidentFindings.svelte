<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const exceptions = merged.filter(r => notes.oneDayMove.includes(r.id));
  const mismatches = groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
</script>

<p>{reports.length} exported rows contain <strong>{merged.length} unique reports</strong>; {reports.length - merged.length} repeated rows count once. Tenant locale, form and channel route the reports below. Intake tags disagree with that routing for {mismatches} reports.</p>
<table>
  <thead><tr><th>Problem / routing cause</th><th>Reports</th><th>Tenants</th><th>Received</th><th>Ticket</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr><td>{g.cause === 'parser' ? 'Shared parser reads month first' : 'booking-v3 prints a month-first hint'}</td><td>{g.reports.length}</td><td>{g.tenants}</td><td>{g.firstSeen} → {g.lastSeen}</td><td><a href="https://github.com/nicholashu/mega-s01e03/issues/{g.cause === 'parser' ? 1 : 2}">{g.cause}</a></td></tr>
    {/each}
  </tbody>
</table>
<p>The counts are routing assignments from the exported code, not proof that every report has the assigned root cause. The source classifier never reads report bodies or timestamps.</p>
<h2>Reports needing investigation</h2>
<p>{exceptions.length} flagged reports are already included in the parser count. Do not add them again or call them a confirmed timezone bug. Obtain original input dates, invite payloads, timestamps and timezones before deciding whether to split them.</p>
<ul>{#each exceptions as r (r.id)}<li><code>{r.id}</code> ({r.tenant}, {r.channel}): {r.body}</li>{/each}</ul>
{#each groups as g (g.cause)}
  {#if readAs(g, notes.oneDayMove)}<p>{readAs(g, notes.oneDayMove)} flagged reports remain routed under <code>{g.cause}</code>.</p>{/if}
{/each}
