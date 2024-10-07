document.getElementById("compareBtn").addEventListener("click", compareTexts);

function compareTexts() {
  const text1 = document.getElementById("text1").value.trim();
  const text2 = document.getElementById("text2").value.trim();

  const lines1 = text1.split('\n').map(line => line.trim()).filter(line => line !== '');
  const lines2 = text2.split('\n').map(line => line.trim()).filter(line => line !== '');

  const duplicates1 = findDuplicates(lines1);
  const duplicates2 = findDuplicates(lines2);

  const set1 = new Set(lines1);
  const set2 = new Set(lines2);

  const result1 = lines1.map(line => ({
    content: line,
    status: duplicates1.has(line) ? 'duplicate' : set2.has(line) ? 'unchanged' : 'removed'
  }));

  const result2 = lines2.map(line => ({
    content: line,
    status: duplicates2.has(line) ? 'duplicate' : set1.has(line) ? 'unchanged' : 'added'
  }));

  displayComparison(result1, "originalContent");
  displayComparison(result2, "modifiedContent");

  document.getElementById("results").style.display = "grid";
}

function findDuplicates(lines) {
  const seen = new Set();
  const duplicates = new Set();
  
  lines.forEach(line => {
    if (seen.has(line)) {
      duplicates.add(line);
    } else {
      seen.add(line);
    }
  });
  
  return duplicates;
}

function displayComparison(lines, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous results

  lines.forEach(line => {
    const pre = document.createElement('pre');
    pre.textContent = line.content;

    switch (line.status) {
      case 'added':
        pre.classList.add('green');
        break;
      case 'removed':
        pre.classList.add('red');
        break;
      case 'duplicate':
        pre.classList.add('yellow');
        break;
    }

    container.appendChild(pre);
  });
}
