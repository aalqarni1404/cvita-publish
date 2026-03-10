module.exports = (req, res) => {
  const data = {
    user: {
      name: 'Alex Morgan',
      title: 'Senior Product Designer',
    },
    aiCredits: 12,
    aiScore: 88,
    sections: [
      { title: 'Work Experience', completed: true },
      { title: 'Education', completed: true },
      { title: 'Skills', completed: false },
      { title: 'Projects', completed: false },
    ],
    tips: [
      'Add more accomplishments to your work experience.',
      'List relevant coursework in your education section.',
      'Highlight your key technical skills.',
    ],
  };
  res.status(200).json(data);
};
