import assert from 'node:assert/strict';
import fs from 'node:fs';
import { uniqueById, groupByCause, sameCause, causeOf } from './src/lib/kb/causes.ts';
const data = './src/lib/data/';
const tenants = new Map(fs.readdirSync(data + 'tenants').map(file => {
  const t = JSON.parse(fs.readFileSync(data + 'tenants/' + file));
  return [t.handle, t];
}));
const raw = JSON.parse(fs.readFileSync(data + 'reports-4471.json'));
const reports = uniqueById(raw).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, r => tenants.get(r.tenant));
// Repeated export rows must not inflate ticket counts.
assert.equal(uniqueById([...reports, reports[0]]).length, reports.length);
assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), reports.length);
// Same subject/tenant can require separate fixes; unknown causes cannot justify merging.
const alder = tenants.get('alder.physio');
assert.equal(sameCause({channel:'form'}, alder, {channel:'app'}, alder), false);
assert.equal(sameCause({channel:'app'}, alder, {channel:'email'}, alder), true);
assert.equal(sameCause({channel:'email'}, undefined, {channel:'email'}, undefined), false);
assert.equal(causeOf({channel:'form', meta:{intakeTag:'parser'}}, alder), 'hint');
const notes = JSON.parse(fs.readFileSync(data + 'desk-notes.json'));
const flagged = reports.filter(r => notes.oneDayMove.includes(r.id));
assert.equal(new Set(flagged.map(r => r.id)).size, notes.oneDayMove.length);
assert.ok(flagged.every(r => groups.find(g => g.cause === 'parser').reports.includes(r)));
console.log(JSON.stringify({rawRows:raw.length,uniqueReports:reports.length,groups:groups.map(({reports,...g})=>({...g,count:reports.length})),flaggedIds:flagged.map(r=>r.id)},null,2));
