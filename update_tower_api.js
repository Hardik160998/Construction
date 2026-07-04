const fs = require('fs');

let content = fs.readFileSync('src/app/api/admin/tower/route.ts', 'utf8');

// Update POST API
content = content.replace(
  'const { projectId, towerName, totalFloors, totalHouses, numberSeries } = body;',
  'const { projectId, towerName, totalFloors, totalHouses, numberSeries, bhk } = body;'
);
content = content.replace(
  'if (numberSeries) payload.number_series = numberSeries;',
  'if (numberSeries) payload.number_series = numberSeries;\n    if (bhk) payload.bhk = bhk;'
);

fs.writeFileSync('src/app/api/admin/tower/route.ts', content);
console.log('API route updated');
