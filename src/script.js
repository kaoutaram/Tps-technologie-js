import Book from '../models/Book.js'; // Importer la classe Book

// Événement pour le formulaire d'ajout de livre
document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value);
    const status = document.getElementById('status').value;
    const price = parseFloat(document.getElementById('price').value); // Ajout de la lecture du prix
    const pagesRead = parseInt(document.getElementById('pagesRead').value);
    const format = document.getElementById('format').value;
    const suggestedBy = document.getElementById('suggestedBy').value;

    const newBook = new Book(title, author, pages, status, price, pagesRead, format, suggestedBy);

    // Envoyer le livre à votre API pour le stocker dans MongoDB
    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Livre ajouté :', data);
        displayBooks(); // Mettre à jour la liste des livres après l'ajout
        document.getElementById('bookForm').reset(); // Réinitialiser le formulaire
    })
    .catch((error) => {
        console.error('Erreur :', error);
    });
});

// Fonction pour afficher les livres
function displayBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            const bookItems = document.getElementById('bookItems');
            bookItems.innerHTML = ''; // Réinitialiser la liste

            data.forEach(book => {
                const li = document.createElement('li');
                const percentage = ((book.pagesRead / book.pages) * 100) || 0; // Calculer le pourcentage de pages lues
                li.textContent = `${book.title} par ${book.author} - ${percentage.toFixed(2)}% lu`;
                bookItems.appendChild(li);
            });

            updateStats(data); // Mettre à jour les statistiques après affichage
        })
        .catch(err => console.error('Erreur:', err));
}

// Mettre à jour les statistiques
function updateStats(books) {
    const totalBooks = books.filter(book => book.finished).length;
    const totalPages = books.reduce((acc, book) => acc + book.pagesRead, 0);

    document.getElementById('totalBooks').textContent = `Total de livres lus : ${totalBooks}`;
    document.getElementById('totalPages').textContent = `Total de pages lues : ${totalPages}`;
}

// Appeler displayBooks lors du chargement de la page
document.addEventListener('DOMContentLoaded', displayBooks);
