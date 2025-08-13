"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [admins] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'herkalsuperadmin' LIMIT 1;`
    );
    if (admins.length === 0) {
      throw new Error("No admin found. Please seed admin user first.");
    }

    const adminId = admins[0].id;
    const { v4: uuidv4 } = require("uuid");
    return queryInterface.bulkInsert("genre", [
      {
        genreId: uuidv4(),
        genre_title: "Sci-fi",
        status: "UNPUBLISHED",
        createdByAdminId: adminId,
        description: `1. Definisi dan Ruang Lingkup
Science fiction, atau sci-fi, adalah genre fiksi spekulatif yang berfokus pada konsep-konsep ilmiah, teknologi masa depan, eksplorasi ruang angkasa, perjalanan waktu, kehidupan di planet lain, dan konsekuensi sosial atau biologis dari inovasi ilmiah. Genre ini sering menggabungkan pengetahuan ilmiah yang ada dengan imajinasi penulis untuk menciptakan dunia atau skenario yang belum terjadi, namun mungkin dapat terjadi di masa depan.

2. Tema dan Topik Umum
Tema-tema yang sering muncul dalam sci-fi antara lain kecerdasan buatan, robotika, genetik, evolusi manusia, realitas virtual, dan konflik antara manusia dan makhluk asing (alien). Tak jarang pula sci-fi mengangkat pertanyaan filosofis dan etis seperti: “Apa artinya menjadi manusia?”, “Apa dampak teknologi terhadap moralitas?”, atau “Apakah kita sendirian di alam semesta?” Genre ini sering bertindak sebagai cermin yang memantulkan kekhawatiran dan harapan umat manusia terhadap perkembangan ilmu pengetahuan dan teknologi.

3. Fungsi Sosial dan Budaya
Lebih dari sekadar hiburan, sci-fi sering menjadi medium untuk mengkritik atau mengeksplorasi isu sosial dan politik. Lewat metafora futuristik atau dunia alternatif, sci-fi bisa membahas rasisme, ketimpangan sosial, kolonialisme, kapitalisme, bahkan kehancuran lingkungan. Dengan demikian, genre ini memberikan ruang aman bagi penonton atau pembaca untuk memikirkan ulang realitas saat ini dalam konteks yang lebih luas dan spekulatif.

4. Perkembangan Historis
Genre ini telah berkembang sejak abad ke-19 dengan karya-karya awal seperti Frankenstein oleh Mary Shelley dan The Time Machine oleh H.G. Wells. Pada abad ke-20, sci-fi semakin populer melalui buku, film, dan serial televisi. Karya-karya seperti Dune oleh Frank Herbert, 2001: A Space Odyssey oleh Arthur C. Clarke dan Stanley Kubrick, serta Blade Runner karya Ridley Scott menjadi tonggak penting dalam perkembangan genre ini.

5. Pengaruh dan Daya Tarik Global
Sci-fi memiliki daya tarik lintas budaya dan generasi karena menawarkan petualangan intelektual dan imajinatif. Banyak penemuan nyata yang terinspirasi dari ide-ide sci-fi, seperti ponsel, internet, atau konsep robotika modern. Genre ini terus berkembang seiring dengan kemajuan teknologi, dan akan selalu relevan karena manusia tidak pernah berhenti bertanya: "Apa yang akan terjadi selanjutnya?`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        genreId: uuidv4(),
        genre_title: "Fantasy",
        status: "UNPUBLISHED",
        createdByAdminId: adminId,
        description: `Fantasy Cuy seru nich 😊😊`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("genre", null, {});
  },
};
