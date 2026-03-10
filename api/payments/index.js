module.exports = (req, res) => {
  const payments = [
    { description: 'Course sale', amount: 49, date: '2026-02-02' },
    { description: 'Template sale', amount: 19, date: '2026-02-05' },
    { description: 'AI credit purchase', amount: 4, date: '2026-02-08' },
  ];
  res.status(200).json(payments);
};
