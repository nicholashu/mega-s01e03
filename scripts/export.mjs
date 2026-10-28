import fs from 'node:fs';
import path from 'node:path';
import {renderPage} from '../.render/render.js';
let template = fs.readFileSync('dist/index.html', 'utf8');
template = template.replace(/<script([^>]*?)src="([^"]+)"([^>]*)><\/script>/g,
  (_, before, src, after) => `<script${before}${after}>${fs.readFileSync('dist/'+src.replace(/^\//,''),'utf8').replaceAll('</script', '<\\/script')}</script>`);
template = template.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g,
  (_, href) => `<style>${fs.readFileSync('dist/'+href.replace(/^\//,''),'utf8')}</style>`);
const routes = fs.globSync('src/routes/kb/**/+page.svx').map(file => file.replace('src/routes','').replace('/+page.svx',''));
for (const route of routes) {
  const rendered = renderPage(route);
  const html = template.replace('<!--head-->', rendered.head).replace('<!--body-->', rendered.body);
  const dest = path.join('rendered', route, 'index.html');
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest, html);
  console.log(dest);
}
