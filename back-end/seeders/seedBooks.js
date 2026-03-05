require("dotenv").config();
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const {
  Book,
  BookGenres,
  BookCategory,
  Genre,
  BookStats,
  BookImage,
} = require("../models/index");

async function seedRealBooks() {
  const t = await sequelize.transaction();

  try {
    const categories = await BookCategory.findAll({
      where: { status: 1 },
    });
    const genres = await Genre.findAll({ transaction: t });

    if (!categories.length || !genres.length) {
      throw new Error("Category atau Genre belum ada");
    }
    console.log(
      "Category IDs:",
      categories.map((c) => ({ id: c.categoryId, name: c.name })),
    );

    const [admins] = await sequelize.query(
      `SELECT id FROM users WHERE username = 'herkalsuperadmin' LIMIT 1;`,
    );
    if (admins.length === 0) {
      throw new Error("No admin found. Please seed admin user first.");
    }

    const adminId = admins[0].id;

    const realBooks = [
      { title: "1984", author: "George Orwell" },
      { title: "Animal Farm", author: "George Orwell" },
      { title: "Brave New World", author: "Aldous Huxley" },
      { title: "Fahrenheit 451", author: "Ray Bradbury" },
      { title: "Dune", author: "Frank Herbert" },
      { title: "Foundation", author: "Isaac Asimov" },
      { title: "I, Robot", author: "Isaac Asimov" },
      {
        title: "Do Androids Dream of Electric Sheep?",
        author: "Philip K. Dick",
      },
      { title: "Ubik", author: "Philip K. Dick" },
      { title: "Neuromancer", author: "William Gibson" },

      { title: "Snow Crash", author: "Neal Stephenson" },
      { title: "Cryptonomicon", author: "Neal Stephenson" },
      { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin" },
      { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin" },
      { title: "The Dispossessed", author: "Ursula K. Le Guin" },
      { title: "Hyperion", author: "Dan Simmons" },
      { title: "The Fall of Hyperion", author: "Dan Simmons" },
      { title: "Old Man's War", author: "John Scalzi" },
      { title: "Redshirts", author: "John Scalzi" },
      { title: "Leviathan Wakes", author: "James S. A. Corey" },

      { title: "Caliban's War", author: "James S. A. Corey" },
      { title: "Abaddon's Gate", author: "James S. A. Corey" },
      { title: "The Blade Itself", author: "Joe Abercrombie" },
      { title: "Before They Are Hanged", author: "Joe Abercrombie" },
      { title: "Last Argument of Kings", author: "Joe Abercrombie" },
      { title: "The Name of the Wind", author: "Patrick Rothfuss" },
      { title: "The Wise Man's Fear", author: "Patrick Rothfuss" },
      { title: "Mistborn: The Final Empire", author: "Brandon Sanderson" },
      { title: "The Well of Ascension", author: "Brandon Sanderson" },
      { title: "The Hero of Ages", author: "Brandon Sanderson" },

      { title: "Warbreaker", author: "Brandon Sanderson" },
      { title: "Elantris", author: "Brandon Sanderson" },
      { title: "The Way of Kings", author: "Brandon Sanderson" },
      { title: "Words of Radiance", author: "Brandon Sanderson" },
      { title: "Oathbringer", author: "Brandon Sanderson" },
      { title: "Rhythm of War", author: "Brandon Sanderson" },
      { title: "The Hobbit", author: "J.R.R. Tolkien" },
      { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien" },
      { title: "The Two Towers", author: "J.R.R. Tolkien" },
      { title: "The Return of the King", author: "J.R.R. Tolkien" },

      { title: "The Silmarillion", author: "J.R.R. Tolkien" },
      { title: "The Children of Hurin", author: "J.R.R. Tolkien" },
      { title: "The Lies of Locke Lamora", author: "Scott Lynch" },
      { title: "Red Seas Under Red Skies", author: "Scott Lynch" },
      { title: "The Republic of Thieves", author: "Scott Lynch" },
      { title: "The Poppy War", author: "R.F. Kuang" },
      { title: "The Dragon Republic", author: "R.F. Kuang" },
      { title: "The Burning God", author: "R.F. Kuang" },
      { title: "Babel", author: "R.F. Kuang" },
      { title: "The Atlas Six", author: "Olivie Blake" },

      { title: "The Atlas Paradox", author: "Olivie Blake" },
      { title: "The Atlas Complex", author: "Olivie Blake" },
      { title: "Circe", author: "Madeline Miller" },
      { title: "The Song of Achilles", author: "Madeline Miller" },
      { title: "A Court of Thorns and Roses", author: "Sarah J. Maas" },
      { title: "A Court of Mist and Fury", author: "Sarah J. Maas" },
      { title: "A Court of Wings and Ruin", author: "Sarah J. Maas" },
      { title: "Throne of Glass", author: "Sarah J. Maas" },
      { title: "Crown of Midnight", author: "Sarah J. Maas" },
      { title: "Heir of Fire", author: "Sarah J. Maas" },

      { title: "Queen of Shadows", author: "Sarah J. Maas" },
      { title: "Empire of Storms", author: "Sarah J. Maas" },
      { title: "Kingdom of Ash", author: "Sarah J. Maas" },
      { title: "The Hunger Games", author: "Suzanne Collins" },
      { title: "Catching Fire", author: "Suzanne Collins" },
      { title: "Mockingjay", author: "Suzanne Collins" },
      {
        title: "The Ballad of Songbirds and Snakes",
        author: "Suzanne Collins",
      },
      { title: "Twilight", author: "Stephenie Meyer" },
      { title: "New Moon", author: "Stephenie Meyer" },
      { title: "Eclipse", author: "Stephenie Meyer" },

      { title: "Breaking Dawn", author: "Stephenie Meyer" },
      { title: "The Host", author: "Stephenie Meyer" },
      { title: "The Da Vinci Code", author: "Dan Brown" },
      { title: "Angels & Demons", author: "Dan Brown" },
      { title: "Inferno", author: "Dan Brown" },
      { title: "Origin", author: "Dan Brown" },
      { title: "Digital Fortress", author: "Dan Brown" },
      { title: "Deception Point", author: "Dan Brown" },
      { title: "The Alchemist", author: "Paulo Coelho" },
      { title: "Brida", author: "Paulo Coelho" },

      { title: "Veronika Decides to Die", author: "Paulo Coelho" },
      { title: "Eleven Minutes", author: "Paulo Coelho" },
      { title: "The Zahir", author: "Paulo Coelho" },
      { title: "The Pilgrimage", author: "Paulo Coelho" },
      { title: "Kafka on the Shore", author: "Haruki Murakami" },
      { title: "Norwegian Wood", author: "Haruki Murakami" },
      { title: "1Q84", author: "Haruki Murakami" },
      { title: "After Dark", author: "Haruki Murakami" },
      { title: "Colorless Tsukuru Tazaki", author: "Haruki Murakami" },
      {
        title: "Hard-Boiled Wonderland and the End of the World",
        author: "Haruki Murakami",
      },

      { title: "The Catcher in the Rye", author: "J.D. Salinger" },
      { title: "To Kill a Mockingbird", author: "Harper Lee" },
      { title: "Go Set a Watchman", author: "Harper Lee" },
      { title: "Of Mice and Men", author: "John Steinbeck" },
      { title: "Cannery Row", author: "John Steinbeck" },
      { title: "Travels with Charley", author: "John Steinbeck" },
      { title: "Slaughterhouse-Five", author: "Kurt Vonnegut" },
      { title: "Cat's Cradle", author: "Kurt Vonnegut" },
      { title: "Breakfast of Champions", author: "Kurt Vonnegut" },
      { title: "The Sirens of Titan", author: "Kurt Vonnegut" },

      { title: "The Kite Runner", author: "Khaled Hosseini" },
      { title: "And the Mountains Echoed", author: "Khaled Hosseini" },
      { title: "Life of Pi", author: "Yann Martel" },
      { title: "The Midnight Library", author: "Matt Haig" },
      { title: "How to Stop Time", author: "Matt Haig" },
      { title: "Reasons to Stay Alive", author: "Matt Haig" },
      { title: "Atomic Habits", author: "James Clear" },
      { title: "Deep Work", author: "Cal Newport" },
      { title: "Digital Minimalism", author: "Cal Newport" },
      { title: "So Good They Can't Ignore You", author: "Cal Newport" },

      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "Noise", author: "Daniel Kahneman" },
      { title: "The Power of Habit", author: "Charles Duhigg" },
      { title: "Smarter Faster Better", author: "Charles Duhigg" },
      { title: "Outliers", author: "Malcolm Gladwell" },
      { title: "David and Goliath", author: "Malcolm Gladwell" },
      { title: "Talking to Strangers", author: "Malcolm Gladwell" },
      {
        title: "The 7 Habits of Highly Effective People",
        author: "Stephen R. Covey",
      },
      { title: "First Things First", author: "Stephen R. Covey" },
      { title: "The 8th Habit", author: "Stephen R. Covey" },

      { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki" },
      { title: "Cashflow Quadrant", author: "Robert T. Kiyosaki" },
      { title: "Think and Grow Rich", author: "Napoleon Hill" },
      { title: "The Millionaire Next Door", author: "Thomas J. Stanley" },
      { title: "Your Money or Your Life", author: "Vicki Robin" },
      { title: "The Psychology of Money", author: "Morgan Housel" },
      { title: "Same as Ever", author: "Morgan Housel" },
      { title: "Zero to One", author: "Peter Thiel" },
      { title: "Lean Startup", author: "Eric Ries" },
      { title: "Rework", author: "Jason Fried" },

      { title: "Remote", author: "Jason Fried" },
      { title: "Getting Things Done", author: "David Allen" },
      { title: "Make Time", author: "Jake Knapp" },
      { title: "Show Your Work", author: "Austin Kleon" },
      { title: "Steal Like an Artist", author: "Austin Kleon" },
      { title: "Keep Going", author: "Austin Kleon" },
      { title: "Start with Why", author: "Simon Sinek" },
      { title: "Leaders Eat Last", author: "Simon Sinek" },
      { title: "Infinite Game", author: "Simon Sinek" },
      { title: "The Lean Product Playbook", author: "Dan Olsen" },

      { title: "Inspired", author: "Marty Cagan" },
      { title: "Empowered", author: "Marty Cagan" },
      {
        title: "Hooked: How to Build Habit-Forming Products",
        author: "Nir Eyal",
      },
      { title: "Indistractable", author: "Nir Eyal" },
      { title: "Refactoring", author: "Martin Fowler" },
      {
        title: "Patterns of Enterprise Application Architecture",
        author: "Martin Fowler",
      },
      { title: "Domain-Driven Design", author: "Eric Evans" },
      {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
      },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
      { title: "Code Complete", author: "Steve McConnell" },
    ];

    const booksData = realBooks.map((book, index) => ({
      id: uuidv4(),
      title: book.title,
      author: book.author,
      price: (Math.random() * 200000 + 80000).toFixed(2),
      quantity: Math.floor(Math.random() * 30) + 5,
      book_type: "PHYSICAL",
      description: `${book.title} adalah buku karya ${book.author} yang sangat populer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque modi excepturi veniam, totam ab tempora laudantium magnam odio debitis similique itaque repellendus possimus odit obcaecati neque aliquam voluptas ipsam! Impedit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate ducimus earum nobis. Consequatur, culpa. Atque molestias cupiditate praesentium, aspernatur consectetur necessitatibus sint officia perspiciatis, nihil quidem vitae distinctio beatae. Illum! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea similique quae recusandae error ducimus autem, perferendis voluptas earum qui mollitia dolorum sunt nihil totam. Veniam facere totam maiores fugit illo! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia quo vero ex? Pariatur inventore nam quas cum quis laborum perspiciatis ab unde accusantium, eaque esse vero reiciendis tempore nisi eos! Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, quisquam ex deserunt ut vitae temporibus illo a quasi. Reprehenderit ducimus delectus aspernatur esse consequuntur dolorum unde voluptatibus earum sequi distinctio! Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum tempore placeat, praesentium, odio quia asperiores accusantium illo culpa a modi voluptas, ab maxime. Libero labore ex nostrum dolore, excepturi suscipit! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae repudiandae molestias quisquam dignissimos nostrum, doloribus amet magni iusto et incidunt voluptatibus, quaerat possimus earum accusantium deleniti pariatur voluptates inventore fugiat. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem distinctio optio odio consectetur corporis numquam voluptatem commodi aut sit modi quas dolorum, dolore molestiae! At officia quaerat molestias earum laboriosam?`,
      status: "PUBLISHED",
      isRecomend: false,
      isPopular: false,
      categoryId: categories[index % categories.length].categoryId,
      createdByAdminId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Book.bulkCreate(booksData, { transaction: t });

    const statsData = booksData.map((book) => ({
      bookId: book.id,
      purchaseCount: Math.floor(Math.random() * 500),
      wishlistCount: Math.floor(Math.random() * 200),
      popularityScore: Math.floor(Math.random() * 100),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await BookStats.bulkCreate(statsData, { transaction: t });

    const imagesData = booksData.map((book) => ({
      bookId: book.id,
      imageUrl: `https://picsum.photos/seed/${book.id}/300/400`,
      public_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await BookImage.bulkCreate(imagesData, { transaction: t });

    const bookGenresData = [];

    booksData.forEach((book) => {
      const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 2);

      randomGenres.forEach((genre) => {
        bookGenresData.push({
          bookId: book.id,
          genreId: genre.genreId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    await BookGenres.bulkCreate(bookGenresData, { transaction: t });

    await t.commit();

    console.log(`${realBooks.length} Buku asli berhasil dibuat!`);
    process.exit();
  } catch (error) {
    await t.rollback();
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedRealBooks();
