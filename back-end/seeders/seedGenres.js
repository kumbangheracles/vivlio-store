require("dotenv").config();
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { Genre } = require("../models/index");

async function seedGenres() {
  const t = await sequelize.transaction();

  try {
    const [admins] = await sequelize.query(
      `SELECT id FROM Users WHERE username = 'herkalsuperadmin' LIMIT 1;`,
    );
    if (admins.length === 0) {
      throw new Error("No admin found. Please seed admin user first.");
    }

    const adminId = admins[0].id;

    const genresData = [
      {
        genre_title: "Fantasy",
        description:
          "Genre yang menampilkan elemen magis, dunia imajinatif, dan makhluk mitologi yang tidak ada di dunia nyata.",
      },
      {
        genre_title: "Science Fiction",
        description:
          "Genre yang mengeksplorasi konsep ilmu pengetahuan masa depan, teknologi canggih, dan perjalanan luar angkasa.",
      },
      {
        genre_title: "Mystery",
        description:
          "Genre yang berfokus pada pemecahan misteri, kejahatan, atau teka-teki yang menegangkan.",
      },
      {
        genre_title: "Thriller",
        description:
          "Genre yang penuh ketegangan, aksi cepat, dan situasi berbahaya yang membuat pembaca terus penasaran.",
      },
      {
        genre_title: "Horror",
        description:
          "Genre yang dirancang untuk menimbulkan rasa takut, ngeri, dan ketidaknyamanan pada pembaca.",
      },
      {
        genre_title: "Romance",
        description:
          "Genre yang berfokus pada hubungan percintaan dan perkembangan emosional antara karakter.",
      },
      {
        genre_title: "Historical Fiction",
        description:
          "Genre yang mengambil latar belakang periode sejarah tertentu dengan menggabungkan fakta dan imajinasi.",
      },
      {
        genre_title: "Adventure",
        description:
          "Genre yang menampilkan perjalanan seru, eksplorasi, dan tantangan yang mendebarkan.",
      },
      {
        genre_title: "Self Help",
        description:
          "Genre non-fiksi yang memberikan panduan praktis untuk meningkatkan kualitas hidup dan pengembangan diri.",
      },
      {
        genre_title: "Biography",
        description:
          "Genre yang menceritakan kisah nyata kehidupan seseorang secara detail dan mendalam.",
      },
      {
        genre_title: "Philosophy",
        description:
          "Genre yang membahas pemikiran mendalam tentang keberadaan, moralitas, dan hakikat kehidupan.",
      },
      {
        genre_title: "Psychology",
        description:
          "Genre yang mengulas perilaku manusia, proses mental, dan dinamika emosional secara ilmiah.",
      },
      {
        genre_title: "Dystopian",
        description:
          "Genre yang menggambarkan masyarakat masa depan yang penuh penindasan, ketidakadilan, dan kehancuran.",
      },
      {
        genre_title: "Crime",
        description:
          "Genre yang berkisah tentang kejahatan, pelaku, korban, dan proses penegakan hukum.",
      },
      {
        genre_title: "Drama",
        description:
          "Genre yang berfokus pada konflik emosional, hubungan antar karakter, dan pergolakan batin yang realistis.",
      },
    ];

    const insertData = genresData.map((genre) => ({
      genreId: uuidv4(),
      genre_title: genre.genre_title,
      description: genre.description,
      status: "PUBLISHED",
      createdByAdminId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Genre.bulkCreate(insertData, { transaction: t });

    await t.commit();

    console.log(`${insertData.length} genre berhasil dibuat!`);
    process.exit();
  } catch (error) {
    await t.rollback();
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedGenres();
