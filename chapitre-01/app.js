const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) {
        console.log('Erreur lors de la lecture du fichier', err);
        return;
    }

    console.log(data);
})