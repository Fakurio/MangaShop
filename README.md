# MangaShop

MangaShop is a full-stack e-commerce prototype application built with **NestJS** for the backend API and **Svelte** for efficient frontend. Users can browse, search, and filter mangas, manage a persistent shopping cart, and view their order history.

---

## ✨ Features

* **User Authentication (JWT):** Secure user registration and login with JSON Web Tokens.
* **Manga Browse:**
    * Filter mangas by genre.
    * Filter mangas by price range.
    * Search mangas by title for quick discovery.
* **Persistent Shopping Cart:** Your cart contents are saved even after you log out, so you can pick up where you left off.
* **Order Management:**
    * View a comprehensive summary of all your past orders.
* **Review mangas**
    * Add comments and rating for chosen manga.

---

## 🚀 How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Fakurio/MangaShop.git
    cd MangaShop
    ```

2.  **Start the application:**
    ```bash
    docker-compose up -d
    ```
3.  **Access the application:**
    Once the containers are up, the application will be accessible in your web browser at:
    http://localhost:8080

---

## 🛠️ Technologies Used

**Backend:**
* **NestJS**
* **Typescript**
* **TypeORM**
* **MySQL**
* **JWT (JSON Web Tokens)**

**Frontend:**
* **Svelte**
* **Typescript**
* **Shadcn/ui**

---