document.addEventListener('DOMContentLoaded', function () {
  const bingoNameInput = document.getElementById('bingoName');
  const cardCountInput = document.getElementById('cardCount');
  const centerImageUrlInput = document.getElementById('centerImageUrl'); // Nova entrada para a URL da imagem
  const generateButton = document.getElementById('generateCards');
  const downloadButton = document.getElementById('downloadCSV');
  const loadButton = document.getElementById('loadCSV');
  const printButton = document.getElementById('printCards');
  const fileInput = document.getElementById('fileInput');
  const cardContainer = document.getElementById('cardContainer');

  let cards = [];

  const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const formatCounter = (number) => {
    return String(number).padStart(4, '0'); // Formata o contador para 4 dígitos
  };

  const generateBingoCard = () => {
    const numbers = Array(5).fill(null).map(() => Array(5).fill(null));
    for (let col = 0; col < 5; col++) {
      const start = col * 15 + 1;
      const end = start + 14;
      const columnNumbers = Array.from({ length: 15 }, (_, i) => i + start);
      for (let row = 0; row < 5; row++) {
        if (col === 2 && row === 2) {
          numbers[row][col] = 'FREE'; // Placeholder para imagem
        } else {
          const index = Math.floor(Math.random() * columnNumbers.length);
          numbers[row][col] = columnNumbers.splice(index, 1)[0];
        }
      }
    }
    return numbers;
  };

  const generateCards = () => {
    cards = [];
    const cardCount = parseInt(cardCountInput.value, 10);
    for (let i = 0; i < cardCount; i++) {
      cards.push({
        id: generateUniqueCode(),
        counter: formatCounter(i + 1), // Adiciona o contador formatado
        numbers: generateBingoCard(),
        imageUrl: centerImageUrlInput.value.trim() // Adiciona a URL da imagem
      });
    }
    displayCards();
    downloadButton.disabled = false;
    printButton.disabled = false;
    alert(`${cards.length} cartelas foram geradas com sucesso.`);
  };

  const displayCards = () => {
    cardContainer.innerHTML = '';
    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.innerHTML = `
        <div class="card-title">${bingoNameInput.value}</div>
        <div class="card-header">
          <div class="card-counter">${card.counter}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${['B', 'I', 'N', 'G', 'O'].map(letter => `<th>${letter}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${card.numbers.map((row, rowIndex) => `
              <tr>
                ${row.map((number, colIndex) => `
                  <td>
                    ${number === 'FREE' && colIndex === 2 && rowIndex === 2
                      ? card.imageUrl // Se houver URL, tenta carregar a imagem
                        ? `<img src="${card.imageUrl}" class="center-image" alt="FREE" onerror="this.onerror=null;this.style.display='none';">`
                        : 'FREE' // Se não houver URL, exibe 'FREE'
                      : number}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="card-code">${card.id}</div> <!-- Mover o código abaixo da tabela e à esquerda -->
      `;
      cardContainer.appendChild(cardElement);
    });
  };

  const downloadCSV = () => {
    let csv = 'Contador,Código da Cartela,B1,I1,N1,G1,O1,B2,I2,N2,G2,O2,B3,I3,N3,G3,O3,B4,I4,N4,G4,O4,B5,I5,N5,G5,O5\n';
    cards.forEach(card => {
      csv += `${card.counter},${card.id},`;
      for (let row = 0; row < 5; row++) {
        csv += card.numbers[row].join(',');
        if (row < 4) csv += ',';
      }
      csv += '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${bingoNameInput.value}_cards.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split('\n');
        cards = [];

        for (let i = 1; i < lines.length; i++) { // Skip the header line
          const line = lines[i].trim();
          if (line) {
            const values = line.split(',');
            const counter = values[0]; // Contador da cartela
            const id = values[1]; // ID da cartela
            const numbers = [];
            for (let row = 0; row < 5; row++) {
              numbers.push(values.slice(row * 5 + 2, row * 5 + 7).map(Number));
            }
            cards.push({ counter, id, numbers });
          }
        }

        displayCards();
        bingoNameInput.value = file.name.replace('.csv', '');
        downloadButton.disabled = false;
        printButton.disabled = false;
        alert(`${cards.length} cartelas foram carregadas com sucesso.`);
      };
      reader.readAsText(file);
    }
  };

  const printCards = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cartelas de Bingo - ${bingoNameInput.value}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .page {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: auto auto auto;
                gap: 10px;
                margin-bottom: 20px;
                page-break-after: always;
              }
              .card { 
                border: 1px solid black; 
                padding: 10px; 
                break-inside: avoid; 
                display: flex; 
                flex-direction: column; 
              }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 5px; text-align: center; }
              .card-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .card-header { display: flex; justify-content: flex-end; margin-bottom: 10px; }
              .card-counter { font-size: 24px; font-weight: bold; text-align: right; }
              .card-code { font-size: 12px; text-align: left; margin-top: 10px; }
              .center-image { width: 40px; height: 40px; object-fit: contain; display: block; margin: 0 auto; }
              @media print {
                .page { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${cards.map((card, index) => `
              ${index % 6 === 0 ? '<div class="page">' : ''}
              <div class="card">
                <div class="card-title">${bingoNameInput.value}</div>
                <div class="card-header">
                  <div class="card-counter">${card.counter}</div>
                </div>
                <table>
                  <tr>
                    <th>B</th>
                    <th>I</th>
                    <th>N</th>
                    <th>G</th>
                    <th>O</th>
                  </tr>
                  ${card.numbers.map((row, rowIndex) => `
                    <tr>
                      ${row.map((number, colIndex) => `
                        <td>
                          ${number === 'FREE' && colIndex === 2 && rowIndex === 2
                            ? card.imageUrl // Se houver URL, tenta carregar a imagem
                              ? `<img src="${card.imageUrl}" class="center-image" alt="FREE" onerror="this.onerror=null;this.style.display='none';">`
                              : 'FREE' // Se não houver URL, exibe 'FREE'
                            : number}
                        </td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </table>
                <div class="card-code">${card.id}</div>
              </div>
              ${(index + 1) % 6 === 0 || index === cards.length - 1 ? '</div>' : ''}
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  generateButton.addEventListener('click', generateCards);
  downloadButton.addEventListener('click', downloadCSV);
  loadButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileUpload);
  printButton.addEventListener('click', printCards);
});
