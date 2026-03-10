module.exports = (req, res) => {
  res.status(200).json({
    users: 1000,
    marketplaceItems: 500,
    recruiters: 50,
  });
};
