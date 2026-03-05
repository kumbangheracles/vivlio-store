require("dotenv").config();
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { BookCategory } = require("../models/index");

async function seedCategories() {
  const t = await sequelize.transaction();

  try {
    const [admins] = await sequelize.query(
      `SELECT id FROM Users WHERE username = 'herkalsuperadmin' LIMIT 1;`,
    );
    if (admins.length === 0) {
      throw new Error("No admin found. Please seed admin user first.");
    }

    const adminId = admins[0].id;

    const categoriesData = [
      {
        name: "Fantasi",
        description:
          "Cerita yang menghadirkan dunia imajinatif dengan unsur sihir, makhluk mitologi, dan petualangan epik.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Fiksi Ilmiah",
        description:
          "Cerita yang mengeksplorasi teknologi masa depan, perjalanan luar angkasa, dan kemungkinan ilmiah.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Misteri",
        description:
          "Cerita yang berfokus pada pemecahan teka-teki, kejahatan, atau peristiwa yang belum terungkap.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Thriller",
        description:
          "Cerita penuh ketegangan dengan alur cepat yang membuat pembaca terus penasaran.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Horor",
        description:
          "Cerita yang dirancang untuk menimbulkan rasa takut, tegang, dan misteri.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Romansa",
        description:
          "Cerita yang berfokus pada hubungan cinta dan dinamika emosional antar tokoh.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Petualangan",
        description:
          "Cerita tentang perjalanan, eksplorasi, dan pengalaman penuh tantangan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Drama",
        description:
          "Cerita yang berfokus pada konflik emosional dan hubungan antar karakter.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Kriminal",
        description:
          "Buku yang membahas kejahatan, investigasi, dan dunia kriminal.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Psikologi",
        description:
          "Buku yang mempelajari perilaku manusia, pikiran, dan emosi.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Kesehatan",
        description:
          "Buku tentang kesehatan fisik, mental, nutrisi, dan gaya hidup sehat.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Kedokteran",
        description:
          "Literatur yang membahas ilmu kedokteran, penyakit, dan pengobatan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Agama & Spiritualitas",
        description:
          "Buku yang membahas ajaran agama, spiritualitas, dan nilai kehidupan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Pendidikan",
        description:
          "Buku yang berkaitan dengan metode belajar, pengajaran, dan dunia pendidikan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Seni & Desain",
        description:
          "Buku yang membahas seni visual, desain grafis, ilustrasi, dan kreativitas.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Fotografi",
        description:
          "Buku tentang teknik fotografi, komposisi, dan seni menangkap gambar.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Musik",
        description:
          "Buku yang membahas teori musik, sejarah musik, dan kisah musisi.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Film & Sinema",
        description:
          "Buku yang mengulas dunia perfilman, produksi film, dan kritik sinema.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Kuliner",
        description:
          "Buku resep, teknik memasak, dan eksplorasi budaya makanan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Travel & Wisata",
        description:
          "Buku panduan perjalanan, pengalaman wisata, dan eksplorasi budaya dunia.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Olahraga",
        description:
          "Buku tentang dunia olahraga, teknik latihan, dan kisah atlet.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Hobi & Kerajinan",
        description:
          "Buku tentang berbagai aktivitas hobi seperti DIY, kerajinan tangan, dan koleksi.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Teknologi Informasi",
        description:
          "Buku tentang komputer, pemrograman, keamanan siber, dan teknologi digital.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Data & Artificial Intelligence",
        description:
          "Buku yang membahas data science, machine learning, dan kecerdasan buatan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Startup",
        description:
          "Buku tentang membangun startup, inovasi bisnis, dan dunia teknologi startup.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Investasi",
        description:
          "Buku tentang strategi investasi, saham, dan pengelolaan aset.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Marketing",
        description:
          "Buku tentang strategi pemasaran, branding, dan komunikasi bisnis.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Manajemen",
        description:
          "Buku yang membahas kepemimpinan, organisasi, dan pengelolaan tim.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Lingkungan",
        description:
          "Buku tentang ekologi, perubahan iklim, dan keberlanjutan lingkungan.",
        isPopular: false,
        isSuggested: false,
      },
      {
        name: "Budaya & Antropologi",
        description:
          "Buku yang membahas budaya manusia, tradisi, dan kehidupan sosial masyarakat.",
        isPopular: false,
        isSuggested: false,
      },
    ];

    const insertData = categoriesData.map((cat) => ({
      categoryId: uuidv4(),
      name: cat.name,
      description: cat.description,
      status: true,
      isPopular: cat.isPopular,
      isSuggested: cat.isSuggested,
      createdByAdminId: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await BookCategory.bulkCreate(insertData, { transaction: t });

    await t.commit();

    console.log(`${insertData.length} kategori berhasil dibuat!`);
    process.exit();
  } catch (error) {
    await t.rollback();
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedCategories();
