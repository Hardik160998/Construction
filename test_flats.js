const seriesList = ['1-4', '101-104', '1001-1004'];
const floors = ['1', '2', '10', 'Ground'];

function generateFlats(numberSeries, floorStr) {
    let numbers = [];
    const ranges = numberSeries.split(',').map(s => s.trim());
    for (const range of ranges) {
      if (range.includes('-')) {
        const parts = range.split('-');
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.push(i.toString());
          }
        }
      } else {
        const val = parseInt(range, 10);
        if (!isNaN(val)) {
          numbers.push(val.toString());
        }
      }
    }

    if (floorStr) {
      numbers = numbers.map(n => {
        let suffix = n;
        // Extract the unit number (suffix) from the base number
        if (/^\\d+$/.test(n)) {
          if (n.length >= 3) {
            if (n.startsWith('1')) {
              suffix = n.substring(1);
            } else {
              suffix = n.slice(-2);
            }
          } else {
            suffix = n.padStart(2, '0');
          }
        }

        if (floorStr === 'Ground') {
          return \`G\${suffix}\`;
        } else {
          return \`\${floorStr}\${suffix}\`;
        }
      });
    }
    return numbers;
}

for (const s of seriesList) {
    console.log("Series:", s);
    for (const f of floors) {
        console.log("  Floor", f, ":", generateFlats(s, f).slice(0, 3).join(', '));
    }
}
