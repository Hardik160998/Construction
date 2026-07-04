const fs = require('fs'); 
let content = fs.readFileSync('src/app/project-registry/page.tsx', 'utf8'); 
content = content.replace("setProjectData({ projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '' });", "setProjectData({ projectName: '', location: '', status: '', description: '', coverImgUrl: '', expectedPossession: '', customerId: '', projectType: '', bhk: '', areaSqft: '' });"); 
fs.writeFileSync('src/app/project-registry/page.tsx', content);
