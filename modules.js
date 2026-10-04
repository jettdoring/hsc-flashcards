/*
  HSC Flashcards catalogue
  subjects: the built-in subjects and their module slots (shown even before they have cards).
  files:    the card files to load, one per module.

  To add a module: upload its cards-*.js file next to index.html, add its file name to `files`,
  and increase `version` by 1 (this makes every device fetch the new files instead of an old copy).
*/
window.HSC_CATALOG = {
  version: 3,
  subjects: [
    { id: 'chem', name: 'Chemistry', modules: [
      { id: 'chem-m5', code: 'Module 5', title: 'Equilibrium and Acid Reactions' },
      { id: 'chem-m6', code: 'Module 6', title: 'Acid/Base Reactions' },
      { id: 'chem-m7', code: 'Module 7', title: 'Organic Chemistry' },
      { id: 'chem-m8', code: 'Module 8', title: 'Applying Chemical Ideas' } ] },
    { id: 'phys', name: 'Physics', modules: [
      { id: 'phys-m5', code: 'Module 5', title: 'Advanced Mechanics' },
      { id: 'phys-m6', code: 'Module 6', title: 'Electromagnetism' },
      { id: 'phys-m7', code: 'Module 7', title: 'The Nature of Light' },
      { id: 'phys-m8', code: 'Module 8', title: 'From the Universe to the Atom' } ] },
    { id: 'eng', name: 'English Advanced', modules: [
      { id: 'eng-cm', code: 'Common Module', title: 'Texts and Human Experiences' },
      { id: 'eng-ma', code: 'Module A', title: 'Textual Conversations' },
      { id: 'eng-mb', code: 'Module B', title: 'Critical Study of Literature' },
      { id: 'eng-mc', code: 'Module C', title: 'The Craft of Writing' } ] },
    { id: 'maths', name: 'Mathematics', modules: [
      { id: 'maths-adv', code: 'Advanced', title: 'Mathematics Advanced' },
      { id: 'maths-ext1', code: 'Extension 1', title: 'Mathematics Extension 1' } ] }
  ],
  files: [
    'cards-chem-m5.js',
    'cards-chem-m6.js',
    'cards-chem-m7.js',
    'cards-chem-m8.js'
  ]
};
