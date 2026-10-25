import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Topic 1: The Elements of the Spiritual Armour
  {
    id: 'q-1',
    quizTopic: 'The Seven Elements of the Spiritual Armour',
    question: 'Why is the Belt of Truth the foundational piece of the Roman soldier\'s armour?',
    options: [
      'It was the heaviest and most decorative piece',
      'Everything else attaches to it; without it, the breastplate shifts and the sword has nowhere to hang',
      'It was used to throw at the enemy from a distance',
      'It was only worn during peacetime ceremonies'
    ],
    correctIndex: 1,
    explanation: 'As explained in Part 4, the belt holds the entire armor together. In the spiritual realm, lust is built on lies; truth is the foundation that exposes and destroys them.',
    scriptureRef: 'Ephesians 6:14a'
  },
  {
    id: 'q-2',
    quizTopic: 'The Seven Elements of the Spiritual Armour',
    question: 'What are the two plates that comprise the Breastplate of Righteousness?',
    options: [
      'Golden plate and Silver plate',
      'Front plate of Christ\'s imputed righteousness and Back plate of practical, lived-out righteousness',
      'Inner plate of willpower and Outer plate of church attendance',
      'Morning plate and Evening plate'
    ],
    correctIndex: 1,
    explanation: 'The front plate (Christ\'s righteousness) guards against Satan\'s accusations and shame. The back plate (practical righteousness through obedience and confession) protects against ambush.',
    scriptureRef: 'Ephesians 6:14b; 2 Corinthians 5:21'
  },
  {
    id: 'q-3',
    quizTopic: 'The Seven Elements of the Spiritual Armour',
    question: 'What is the ONLY offensive weapon in the Full Armour of God?',
    options: [
      'The Shield of Faith',
      'The Helmet of Salvation',
      'The Sword of the Spirit, which is the Word of God',
      'The Shoes of Peace'
    ],
    correctIndex: 2,
    explanation: 'Every other piece is defensive, enabling you to stand. The sword is the rhema—the spoken Word of God—that enables you to strike back, just as Jesus did with "It is written!"',
    scriptureRef: 'Ephesians 6:17b; Hebrews 4:12'
  },
  {
    id: 'q-4',
    quizTopic: 'The Seven Elements of the Spiritual Armour',
    question: 'In Roman warfare, how did the Shield of Faith (scutum) extinguish flaming arrows?',
    options: [
      'It was coated in ice',
      'It was covered in leather soaked in water so pitch arrows fizzled and died on impact',
      'It was made of solid glass',
      'It had arrows fired back automatically'
    ],
    correctIndex: 1,
    explanation: 'The large shield was soaked in water before battle. Spiritually, our shield of faith is soaked in the water of God\'s Word through daily meditation and memorization.',
    scriptureRef: 'Ephesians 6:16'
  },

  // Topic 2: Bible Verses Concerning Lust and Purity
  {
    id: 'q-5',
    quizTopic: 'Bible Verses Concerning Lust and Purity',
    question: 'According to Matthew 5:28, when does adultery occur in the eyes of Jesus?',
    options: [
      'Only when physical contact takes place',
      'When someone accidentally notices an attractive person',
      'When someone looks at another person with intentional lustful intent in their heart',
      'Only if other people find out about it'
    ],
    correctIndex: 2,
    explanation: 'Jesus radicalizes the command by shifting it from merely external acts to the internal intention of the heart, demolishing the rationalization that "it\'s harmless because nobody knows."',
    scriptureRef: 'Matthew 5:27-28'
  },
  {
    id: 'q-6',
    quizTopic: 'Bible Verses Concerning Lust and Purity',
    question: 'What distinctive warning does Paul give in 1 Corinthians 6:18 regarding sexual sin?',
    options: [
      'It is an unforgivable sin',
      'Every other sin is outside the body, but the sexually immoral person sins against his own body',
      'It only affects unmarried people',
      'It can be managed with moderate compromise'
    ],
    correctIndex: 1,
    explanation: 'Paul emphasizes that sexual sin uniquely defiles the body, which was bought with a price and is the temple of the Holy Spirit.',
    scriptureRef: '1 Corinthians 6:18-20'
  },
  {
    id: 'q-7',
    quizTopic: 'Bible Verses Concerning Lust and Purity',
    question: 'What biblical posture does the New Testament command toward lust and youthful passions?',
    options: [
      'Negotiation and gradual reduction',
      'Testing your willpower to prove your strength',
      'Urgent, decisive flight ("Flee from sexual immorality", "Flee youthful passions")',
      'Debating with the thought until it surrenders'
    ],
    correctIndex: 2,
    explanation: 'Scripture never commands us to negotiate with lust. The consistent biblical command is to FLEE immediately, like Joseph fleeing from Potiphar\'s wife.',
    scriptureRef: '1 Corinthians 6:18; 2 Timothy 2:22'
  },

  // Topic 3: Recognizing Temptation (James 1:13-15)
  {
    id: 'q-8',
    quizTopic: 'Recognizing Temptation',
    question: 'In the James 1:13-15 progression of sin, which stage represents the critical battleground where the bait hooks desire?',
    options: [
      'Stage 1: External Stimulus',
      'Stage 2: Being lured and enticed by inner desire (epithymia)',
      'Stage 5: Compulsive Bondage',
      'Stage 6: Spiritual Death'
    ],
    correctIndex: 1,
    explanation: 'The external stimulus itself is not sin (Jesus was tempted yet without sin). The critical battle is when the lure hooks into desire. If extinguished immediately, conception does not happen.',
    scriptureRef: 'James 1:14-15'
  },
  {
    id: 'q-9',
    quizTopic: 'Recognizing Temptation',
    question: 'Which of the following is TRUE regarding temptation versus sin?',
    options: [
      'Experiencing a temptation means you have already failed and sinned',
      'Jesus was never tempted in the flesh',
      'Temptation is the enemy\'s invitation; it only becomes sin when entertained and conceived in the heart',
      'Spiritual believers never experience temptation'
    ],
    correctIndex: 2,
    explanation: 'Hebrews 4:15 tells us Jesus was tempted in every way, yet without sin. Temptation is an external assault; sin occurs when we embrace and indulge the desire.',
    scriptureRef: 'Hebrews 4:15; James 1:14'
  },

  // Topic 4: Responding to Setbacks and Shame
  {
    id: 'q-10',
    quizTopic: 'Responding to Setbacks and Shame',
    question: 'What is the definition of a righteous person in Proverbs 24:16?',
    options: [
      'Someone who never struggles or falls',
      'Someone who achieves a 365-day streak without ever slipping',
      'Someone who falls seven times and gets back up again',
      'Someone who hides their struggles from others'
    ],
    correctIndex: 2,
    explanation: 'The righteous person is not defined by flawless perfection, but by whether they get back up! Getting back up and running to God is the mark of righteousness.',
    scriptureRef: 'Proverbs 24:16'
  },
  {
    id: 'q-11',
    quizTopic: 'Responding to Setbacks and Shame',
    question: 'What is the difference between Holy Spirit conviction and Satan\'s condemnation?',
    options: [
      'There is no difference; both make you feel awful',
      'Conviction says "Come to Me for cleansing"; Condemnation says "Stay away, you\'re too filthy"',
      'Condemnation leads to life, conviction leads to death',
      'Conviction only happens to unbelievers'
    ],
    correctIndex: 1,
    explanation: 'Holy Spirit conviction draws you toward the Father for cleansing and healing. Satan\'s condemnation drives you into shame, hiding, and despair.',
    scriptureRef: 'Romans 8:1; 1 John 1:9'
  },

  // Topic 5: Biblical Teachings About Repentance and Grace
  {
    id: 'q-12',
    quizTopic: 'Repentance and Grace',
    question: 'What does "metanoia" (biblical repentance) fundamentally mean?',
    options: [
      'Beating yourself up with guilt for three days before praying',
      'A complete change of mind that turns away from sin to embrace God\'s truth and grace',
      'Making a solemn vow in your own strength never to slip again',
      'Giving money to religious organizations'
    ],
    correctIndex: 1,
    explanation: 'Repentance is a transformational change of mind. You agree with God about your sin, turn away from counterfeits, and turn toward Christ.',
    scriptureRef: 'Acts 3:19; 2 Corinthians 7:10'
  },
  {
    id: 'q-13',
    quizTopic: 'Repentance and Grace',
    question: 'According to 1 John 1:9, on what basis does God forgive and cleanse our sins when we confess?',
    options: [
      'On the basis of our emotional penance',
      'Only if we have been clean for at least 7 days',
      'Because He is faithful and just, sealed by the finished atoning blood of Christ',
      'Only if our confession is public to the entire world'
    ],
    correctIndex: 2,
    explanation: 'God\'s justice was satisfied at Calvary. When we confess, God is faithful and just to forgive because Christ already paid the debt in full.',
    scriptureRef: '1 John 1:9; 2 Corinthians 5:21'
  },

  // Topic 6: Practical Ways to Avoid Known Triggers
  {
    id: 'q-14',
    quizTopic: 'Overcoming Known Triggers',
    question: 'What does the biblical principle of "making no provision for the flesh" (Romans 13:14) mean in modern life?',
    options: [
      'Eating fewer carbohydrates',
      'Leaving your smartphone plugged in next to your bed with incognito access enabled',
      'Slamming the door on temptation access routes: removing devices from bedrooms, blocking adult sites, and eliminating triggering apps',
      'Waiting until an urge strikes before deciding what to do'
    ],
    correctIndex: 2,
    explanation: 'Making provision means leaving a path open for sin. The back plate of practical righteousness requires cutting off access points and slam-shutting doors beforehand.',
    scriptureRef: 'Romans 13:14; Matthew 5:29'
  },
  {
    id: 'q-15',
    quizTopic: 'Overcoming Known Triggers',
    question: 'What is the primary spiritual danger of loneliness and isolation according to Proverbs 18:1?',
    options: [
      'You save money on social events',
      'Whoever isolates himself seeks his own desire and breaks out against sound judgment',
      'Solitude is always sinful under all conditions',
      'It makes you sleep too much'
    ],
    correctIndex: 1,
    explanation: 'Isolation is the enemy\'s playground. Secrecy enables lust to fester. Christian community and transparent accountability break the enemy\'s grip.',
    scriptureRef: 'Proverbs 18:1; Galatians 6:2'
  }
];
