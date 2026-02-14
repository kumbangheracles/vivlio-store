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
    const adminId = "8425d51a-0527-4b93-85e5-2e8588563e93";

    const realBooks = [
      { title: "The Night Circus", author: "Erin Morgenstern" },
      { title: "The Shadow of the Wind", author: "Carlos Ruiz Zafón" },
      { title: "Shantaram", author: "Gregory David Roberts" },
      { title: "The Road Less Traveled", author: "M. Scott Peck" },
      {
        title: "The Immortal Life of Henrietta Lacks",
        author: "Rebecca Skloot",
      },
      { title: "The Girl on the Train", author: "Paula Hawkins" },
      { title: "The Goldfinch", author: "Donna Tartt" },
      { title: "The Help", author: "Kathryn Stockett" },
      { title: "A Thousand Splendid Suns", author: "Khaled Hosseini" },
      { title: "The Perks of Being a Wallflower", author: "Stephen Chbosky" },

      { title: "The Stand", author: "Stephen King" },
      { title: "The Exorcist", author: "William Peter Blatty" },
      { title: "Pet Sematary", author: "Stephen King" },
      { title: "American Gods", author: "Neil Gaiman" },
      { title: "Good Omens", author: "Neil Gaiman & Terry Pratchett" },
      { title: "The Color Purple", author: "Alice Walker" },
      { title: "Beloved", author: "Toni Morrison" },
      { title: "The Sun Also Rises", author: "Ernest Hemingway" },
      { title: "Lolita", author: "Vladimir Nabokov" },
      { title: "The Stranger", author: "Albert Camus" },

      { title: "The Metamorphosis", author: "Franz Kafka" },
      { title: "The Trial", author: "Franz Kafka" },
      { title: "Les Misérables", author: "Victor Hugo" },
      { title: "The Count of Monte Cristo", author: "Alexandre Dumas" },
      { title: "Don Quixote", author: "Miguel de Cervantes" },
      { title: "The Grapes of Wrath", author: "John Steinbeck" },
      { title: "East of Eden", author: "John Steinbeck" },
      { title: "The Bell Jar", author: "Sylvia Plath" },
      { title: "The Secret Garden", author: "Frances Hodgson Burnett" },
      { title: "Charlotte's Web", author: "E.B. White" },

      { title: "The Maze Runner", author: "James Dashner" },
      { title: "Divergent", author: "Veronica Roth" },
      { title: "Ready Player One", author: "Ernest Cline" },
      { title: "Ender's Game", author: "Orson Scott Card" },
      { title: "The Girl Who Drank the Moon", author: "Kelly Barnhill" },
      { title: "The Bone Clocks", author: "David Mitchell" },
      { title: "Cloud Atlas", author: "David Mitchell" },
      { title: "The Silence of the Lambs", author: "Thomas Harris" },
      { title: "The Bourne Identity", author: "Robert Ludlum" },
      { title: "The Martian Chronicles", author: "Ray Bradbury" },

      { title: "The Art of Thinking Clearly", author: "Rolf Dobelli" },
      { title: "Drive", author: "Daniel H. Pink" },
      { title: "Principles", author: "Ray Dalio" },
      { title: "The Hard Thing About Hard Things", author: "Ben Horowitz" },
      { title: "Good to Great", author: "Jim Collins" },
      { title: "The Innovator's Dilemma", author: "Clayton Christensen" },
      { title: "Hooked", author: "Nir Eyal" },
      { title: "Measure What Matters", author: "John Doerr" },
      { title: "The Four Agreements", author: "Don Miguel Ruiz" },
      { title: "Can't Hurt Me", author: "David Goggins" },

      { title: "Steve Jobs", author: "Walter Isaacson" },
      { title: "Elon Musk", author: "Ashlee Vance" },
      { title: "Becoming", author: "Michelle Obama" },
      { title: "Educated", author: "Tara Westover" },
      { title: "Born a Crime", author: "Trevor Noah" },
      { title: "The Wright Brothers", author: "David McCullough" },
      { title: "Shoe Dog", author: "Phil Knight" },
      { title: "The Diary of a Young Girl", author: "Anne Frank" },
      { title: "Into the Wild", author: "Jon Krakauer" },
      { title: "The Glass Castle", author: "Jeannette Walls" },

      { title: "Guns, Germs, and Steel", author: "Jared Diamond" },
      { title: "The Tipping Point", author: "Malcolm Gladwell" },
      { title: "Blink", author: "Malcolm Gladwell" },
      { title: "The Code Book", author: "Simon Singh" },
      { title: "The Elegant Universe", author: "Brian Greene" },
      {
        title: "Astrophysics for People in a Hurry",
        author: "Neil deGrasse Tyson",
      },
      {
        title: "Surely You're Joking, Mr. Feynman!",
        author: "Richard Feynman",
      },
      {
        title: "The Structure of Scientific Revolutions",
        author: "Thomas Kuhn",
      },
      { title: "Silent Spring", author: "Rachel Carson" },
      { title: "The Double Helix", author: "James D. Watson" },

      { title: "Clean Architecture", author: "Robert C. Martin" },
      {
        title: "Working Effectively with Legacy Code",
        author: "Michael Feathers",
      },
      { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr." },
      { title: "Continuous Delivery", author: "Jez Humble" },
      { title: "Site Reliability Engineering", author: "Betsy Beyer" },
      { title: "The DevOps Handbook", author: "Gene Kim" },
      { title: "Head First Design Patterns", author: "Eric Freeman" },
      { title: "Don't Make Me Think", author: "Steve Krug" },
      { title: "Sprint", author: "Jake Knapp" },
      { title: "Hooked on Phonics", author: "John B. King" },

      { title: "The Nightingale", author: "Kristin Hannah" },
      { title: "The Pillars of the Earth", author: "Ken Follett" },
      { title: "The Time Traveler's Wife", author: "Audrey Niffenegger" },
      { title: "Memoirs of a Geisha", author: "Arthur Golden" },
      { title: "The Lovely Bones", author: "Alice Sebold" },
      {
        title: "The Curious Incident of the Dog in the Night-Time",
        author: "Mark Haddon",
      },
      { title: "The Wind-Up Bird Chronicle", author: "Haruki Murakami" },
      { title: "The House of the Spirits", author: "Isabel Allende" },
      { title: "The Power", author: "Naomi Alderman" },
      { title: "The Underground Railroad", author: "Colson Whitehead" },
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
