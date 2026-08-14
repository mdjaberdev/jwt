const privateDataController =  async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Amr Facebook Idr Pass *******",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ${error}`,
    });
  }
}

module.exports = privateDataController