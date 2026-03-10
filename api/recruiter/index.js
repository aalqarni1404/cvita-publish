module.exports = (req, res) => {
  const candidates = [
    {
      id: 1,
      name: 'Olivia Thompson',
      title: 'UX Designer',
      description: '5+ years designing user experiences for web and mobile.',
      tags: ['#UX', '#design', '#figma'],
      unlocked: false,
    },
    {
      id: 2,
      name: 'Noah Williams',
      title: 'Product Manager',
      description: '6+ years leading cross-functional product teams.',
      tags: ['#product', '#management', '#leadership'],
      unlocked: false,
    res.status(200).json({ candidates });
  
  
};
