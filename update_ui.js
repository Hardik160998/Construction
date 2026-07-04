const fs = require('fs');

let content = fs.readFileSync('src/app/project-registry/page.tsx', 'utf8');

// 1. Put back the error messages
content = content.replace(
  /\{success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" \/>(.+?)<\/div>\}/g,
  '{error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}\n                {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-semibold text-sm flex items-center gap-3"><CheckCircle2 className="w-5 h-5 shrink-0" />$1</div>}'
);

// 2. Add roomNumber to state
content = content.replace(
  "projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: ''",
  "projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: '', roomNumber: ''"
);
content = content.replace(
  "projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: ''",
  "projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: '', roomNumber: ''"
);

// 3. Update the UI
const targetUI = `                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                        <input type="text" name="bhk" value={projectData.bhk} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 2BHK, 3BHK" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Area (sqft)</label>
                        <input type="text" name="areaSqft" value={projectData.areaSqft} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 1500" />
                      </div>`;

const newUI = `                      {projectData.projectType === 'Society' ? (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Room Number</label>
                          <div className="relative">
                            <select
                              name="roomNumber" required value={projectData.roomNumber} onChange={handleProjectChange}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-sm appearance-none cursor-pointer"
                            >
                              <option value="" className="text-slate-400">-- Select Room Number --</option>
                              {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={String(i+1)} className="text-slate-900">{i+1}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">BHK</label>
                            <input type="text" name="bhk" value={projectData.bhk} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 2BHK, 3BHK" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Area (sqft)</label>
                            <input type="text" name="areaSqft" value={projectData.areaSqft} onChange={handleProjectChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900 font-semibold shadow-sm" placeholder="e.g. 1500" />
                          </div>
                        </>
                      )}`;

content = content.replace(targetUI, newUI);

fs.writeFileSync('src/app/project-registry/page.tsx', content);
console.log('Update successful');
