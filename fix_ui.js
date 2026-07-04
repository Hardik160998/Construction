const fs = require('fs');

let content = fs.readFileSync('src/app/project-registry/page.tsx', 'utf8');

// 1. Remove BHK from Add Project Modal (and its wrapper div)
// The structure is:
// <div>
//   <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
//   <input type="text" name="bhk" value={projectData.bhk} ... />
// </div>
content = content.replace(
  /<div>\s*<label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK<\/label>\s*<input[^>]+name="bhk"[^>]+>\s*<\/div>/g,
  ''
);

// 2. Add BHK to Add Tower Modals (right before Number Series)
// We have two instances of:
// <div>
//   <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>
const towerBhkHtml = `<div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                      <input type="text" name="bhk" value={towerData.bhk} onChange={handleTowerChange} placeholder="e.g. 2BHK, 3BHK" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series</label>`;

content = content.replace(
  /<div>\s*<label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Number Series<\/label>/g,
  towerBhkHtml
);

// 3. Add bhk to towerData state
content = content.replace(
  "towerName: '', totalFloors: '', totalHouses: '', numberSeries: ''",
  "towerName: '', totalFloors: '', totalHouses: '', numberSeries: '', bhk: ''"
);

// 4. Update the handleTowerSubmit payload
content = content.replace(
  /numberSeries: towerData.numberSeries\s*}\)/g,
  'numberSeries: towerData.numberSeries,\n          bhk: towerData.bhk\n        })'
);

// 5. Update the Tower Progress Table to show BHK
content = content.replace(
  /<p className="text-sm font-semibold text-slate-500">\{tower\.total_floors\} Floors<\/p>/g,
  `<p className="text-sm font-semibold text-slate-500">{tower.total_floors || tower.total_houses} {tower.total_floors ? 'Floors' : 'Houses'} {tower.bhk && <span className="ml-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-lg">{tower.bhk}</span>}</p>`
);

fs.writeFileSync('src/app/project-registry/page.tsx', content);
console.log('UI updated successfully!');
