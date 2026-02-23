require("dotenv").config();
const { sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const { Articles, ArticleImages } = require("../models");

async function seedArticles() {
  const t = await sequelize.transaction();

  try {
    const adminId = "20cb820e-c6a6-4b99-94e4-463a6cc30087";

    const realArticles = [
      { title: "The Psychology Behind Consumer Behavior" },
      { title: "Minimalism in the Digital Age" },
      { title: "Cybersecurity Essentials for Modern Businesses" },
      { title: "The Impact of Social Media on Society" },
      { title: "Climate Change and Sustainable Innovation" },
      { title: "Mastering Time Management in a Busy World" },
      { title: "The Science of Productivity" },
      { title: "Blockchain Beyond Cryptocurrency" },
      { title: "The Art of Creative Thinking" },
      { title: "Data Privacy in the 21st Century" },
      { title: "How Startups Disrupt Traditional Industries" },
      { title: "The Power of Emotional Intelligence" },
      { title: "AI Ethics and Responsible Innovation" },
      { title: "The Future of Renewable Energy" },
      { title: "Understanding Financial Literacy" },
      { title: "Design Thinking for Problem Solving" },
      { title: "The Growth of the Creator Economy" },
      { title: "Navigating Career Changes Successfully" },
      { title: "The Role of Big Data in Decision Making" },
      { title: "Building Resilience in Uncertain Times" },
    ];

    const articlesData = realArticles.map((article, index) => ({
      id: uuidv4(),
      title: article.title,
      description: `${article.title} membahas berbagai aspek penting yang relevan dengan perkembangan zaman saat ini. 
      
      Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Voluptates recusandae, temporibus accusamus adipisci nemo 
      deserunt molestiae architecto dolore quaerat? 
      
      Artikel ini memberikan wawasan mendalam serta 
      analisis yang dapat membantu pembaca memahami topik secara komprehensif.`,
      createdByAdminId: adminId,
      status: index % 2 === 0 ? "PUBLISHED" : "UNPUBLISHED",
      isPopular: Math.random() > 0.7,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Articles.bulkCreate(articlesData, { transaction: t });

    const imagesData = articlesData.map((article) => ({
      id: uuidv4(),
      articleId: article.id,
      imageUrl: `https://picsum.photos/seed/article-${article.id}/800/500`,
      public_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await ArticleImages.bulkCreate(imagesData, { transaction: t });

    await t.commit();

    console.log(`${realArticles.length} Articles berhasil dibuat!`);
    process.exit();
  } catch (error) {
    await t.rollback();
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedArticles();
