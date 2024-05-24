const axios = require("axios");
exports.fetchCategories = async (req, res) => {
  try {
    const form = new FormData();
    form.append("page", req.body.page);

    const categories = await axios.post(
      "https://demo2.meals4u.net/fe/api.test.php",
      form
    );

    return res.status(200).json({
      message: "Successfull",
      categories: categories.data,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
