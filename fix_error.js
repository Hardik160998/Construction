const fs = require('fs');
let content = fs.readFileSync('src/app/project-registry/page.tsx', 'utf8');
content = content.replace(
  /\{success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" \/>(.+?)<\/div>\}/g,
  '{error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}\n                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />$1</div>}'
);
fs.writeFileSync('src/app/project-registry/page.tsx', content);
