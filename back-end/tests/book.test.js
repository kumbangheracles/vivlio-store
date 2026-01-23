jest.mock("../models", () => ({
  Book: {
    findAndCountAll: jest.fn().mockResolvedValue({
      count: 1,
      rows: [
        {
          id: 1,
          title: "Clean Code",
        },
      ],
    }),
  },
  BookImage: {},
  Genre: {},
  BookReview: {},
  User: {},
  UserImage: {},
  BookStats: {},
}));

const bookController = require("../controller/book.controller");

describe("Book Controller", () => {
  it("should return books", async () => {
    const req = {
      query: {
        page: 1,
        limit: 10,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await bookController.getAllCommon(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        results: expect.any(Array),
      }),
    );
  });
});
