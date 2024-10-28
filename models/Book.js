// models/Book.js
class Book {
    constructor(title, author, pages, status, price, pagesRead, format, suggestedBy) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.price = price;
        this.pagesRead = pagesRead;
        this.finished = pagesRead >= pages ? 1 : 0; // 1 si terminé, sinon 0
        this.format = format;
        this.suggestedBy = suggestedBy;
    }

    currentlyAt() {
        return (this.pagesRead / this.pages) * 100; // Retourne le pourcentage de pages lues
    }

    deleteBook() {
        // Logique pour supprimer le livre
        console.log(`Livre ${this.title} supprimé.`);
    }
}

export default Book; // Exporter la classe Book
