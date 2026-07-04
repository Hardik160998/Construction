const fs = require('fs');

let content = fs.readFileSync('src/app/project-registry/page.tsx', 'utf8');

const addTowerUI = `                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>`;

const newAddTowerUI = `                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                      <input type="text" name="bhk" value={towerData.bhk} onChange={handleTowerChange} placeholder="e.g. 2BHK, 3BHK" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>`;

content = content.split(addTowerUI).join(newAddTowerUI);

fs.writeFileSync('src/app/project-registry/page.tsx', content);
console.log('UI updated successfully for all instances');
