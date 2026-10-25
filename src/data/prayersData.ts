export interface DevotionalPrayer {
  id: string;
  title: string;
  category: 'morning' | 'evening' | 'temptation' | 'repentance' | 'setback' | 'mind_renewal' | 'purity' | 'strength';
  subtitle: string;
  scriptureAnchor: string;
  body: string;
}

export const DEVOTIONAL_PRAYERS: DevotionalPrayer[] = [
  {
    id: 'p-morning',
    title: 'Morning Armour & Consecration Prayer',
    category: 'morning',
    subtitle: 'Stepping Onto the Battlefield Fully Armed',
    scriptureAnchor: 'Romans 12:1; Ephesians 6:11',
    body: `Heavenly Father, Commander of the armies of heaven,
I come before You this morning, offering my body as a living sacrifice, holy and acceptable to You. I do not step into this day defenseless, nor do I step in my own fragile strength.

I take up the Belt of Truth: I declare that Your Word is the only reality that governs my identity, my sexuality, and my desires.
I strap on the Breastplate of Righteousness: I stand covered in the perfect righteousness of Jesus Christ, and I commit to living out holy obedience, making no provision for the flesh.
I lace on the Shoes of Peace: My feet stand firm upon the gospel of peace. I will walk over the spikes of loneliness, boredom, and anxiety without being pierced.
I lift the Shield of Faith: When flaming arrows of impure memories, sudden thoughts, or seductive lies fly at me today, my faith in Your promises will extinguish every single one.
I put on the Helmet of Salvation: I guard my mind with the certainty of my eternal hope. I take every wandering thought captive to obey Christ.
I take up the Sword of the Spirit: The living Word of God is in my mouth and in my heart. When the enemy whispers, I will proclaim: "It is written!"

Lead me not into temptation, but deliver me from the evil one. For Yours is the kingdom, the power, and the glory forever.
In Jesus' mighty name, Amen.`
  },
  {
    id: 'p-evening',
    title: 'Evening Review & Holy Protection Prayer',
    category: 'evening',
    subtitle: 'Resting in God\'s Grace and Guarding the Night',
    scriptureAnchor: 'Psalm 4:8; Psalm 91:1-4',
    body: `Father of Mercy,
As the daylight closes and the stillness of night begins, I come to You in honest reflection. I review the hours of this day before Your open eyes.
Where I have resisted temptation by Your Spirit, I give You all the glory.
Where I entertained impure thoughts, hesitated to flee, or gave place to compromise, I confess it right now without excuse. I thank You that the blood of Jesus Christ cleanses me from all unrighteousness.

Lord, the nighttime has often been a battlefield of vulnerability, fatigue, and temptation. I ask You now to station Your angels around my bed.
I cast all my anxious thoughts, physical fatigue, and loneliness upon You.
I resolve to put away screens and devices, honoring You with quietness of soul.
Guard my dreams and subconscious mind with the Helmet of Salvation. Let my sleep be peaceful, holy, and restorative.

In peace I will both lie down and sleep, for You alone, O Lord, make me dwell in safety.
In the name of Jesus, my Fortress, Amen.`
  },
  {
    id: 'p-temptation',
    title: 'Urgent Prayer During Intense Temptation',
    category: 'temptation',
    subtitle: 'Cry of Deliverance in the Moment of Urge',
    scriptureAnchor: '1 Corinthians 10:13; Psalm 70:1',
    body: `Lord Jesus, help me right now!
I feel the pull of this urge. The bait is dangling before me and my flesh is enticed.
But I declare in Your holy name: I do not have to obey this craving! Sin is no longer my master!

You have promised that You will not let me be tempted beyond what I can bear, and that You have ALREADY provided the way of escape.
Open my eyes to that door right now!
Give me the courage to close this screen, drop this phone, walk out of this room, and turn my eyes away.
I extinguish this flaming arrow of lust with the Shield of Faith.
Jesus, You satisfy my soul more than any counterfeit pixel ever could. You are my living water.
Break the power of this urge, calm my racing pulse, and grant me holy self-control.
I run into Your strong tower and I am safe.
In Jesus' victorious name, Amen!`
  },
  {
    id: 'p-setback',
    title: 'Restoration Prayer After a Setback',
    category: 'setback',
    subtitle: 'Rising Again from Condemnation to Grace',
    scriptureAnchor: 'Proverbs 24:16; Romans 8:1; Hebrews 4:16',
    body: `Lord Jesus Christ,
I come to You with a broken and contrite heart. I fell. I looked where I should not have looked, I lingered where I should have fled, and I yielded to the deception of the flesh.
The enemy is already screaming at me, telling me I am a fraud, that I will never be free, and that You are disgusted with me.

Right now, by faith, I silence the accuser with the blood of the Lamb!
Your Word says: "There is now NO condemnation for those who are in Christ Jesus."
Your Word says: "The righteous falls seven times and rises again."
I do not stay in the ditch of despair. I get back up!
I confess my sin specifically and honestly. I do not minimize it.
Wash me clean, Lord. Cleanse the back plate of my righteousness.
Show me what open door or emotional trigger led to this fall: was it stress? boredom? late-night isolation?
Give me wisdom to slam that door shut.
Thank You that Your mercy is new this very moment. I receive Your forgiveness and I step back onto the battlefield.
In the name of Jesus, my Advocate and Deliverer, Amen.`
  },
  {
    id: 'p-repentance',
    title: 'Deep Prayer of Repentance and Cleansing',
    category: 'repentance',
    subtitle: 'Turning Wholly from the Counterfeit to the Living God',
    scriptureAnchor: 'Psalm 51:1-12; 2 Corinthians 7:10',
    body: `Have mercy on me, O God, according to Your steadfast love; according to Your abundant mercy blot out my transgressions.
Wash me thoroughly from my iniquity, and cleanse me from my sin!
Against You, You only, have I sinned and done what is evil in Your sight.

Lord, I turn away from the empty idols of pornography and lust.
I renounce the secret rooms of my heart where I entertained fantasies that grieve Your Spirit.
Create in me a clean heart, O God, and renew a right spirit within me.
Cast me not away from Your presence, and take not Your Holy Spirit from me.
Restore to me the joy of Your salvation, and uphold me with a willing spirit.
Fill my vision with the beauty of holiness. Let the purity of Jesus become my greatest joy.
Amen.`
  },
  {
    id: 'p-mind-renewal',
    title: 'Prayer for the Renewal of the Mind',
    category: 'mind_renewal',
    subtitle: 'Rewiring Neural Grooves with God\'s Word',
    scriptureAnchor: 'Romans 12:2; 2 Corinthians 10:5',
    body: `Father of Glory,
You know the neurological pathways that have been etched into my brain through years of compromised looking and repetitive habit.
You know the intrusive images that flash unbidden into my imagination.
I bring my brain, my memory, and my thought life to You for divine transformation.

Holy Spirit, You are the Master Surgeon. Where the enemy has grooved channels of lust and dopamine craving, begin the holy work of regrooving my mind with Scripture.
I surrender my thought life to the lordship of Jesus Christ.
Whenever an impure memory resurfaces, I will not entertain it. I take it captive as a prisoner of war and command it to submit to Jesus.
Transform me by the renewing of my mind, that I may test and approve what Your will is—Your good, pleasing, and perfect will.
In Jesus' name, Amen.`
  },
  {
    id: 'p-purity',
    title: 'Prayer for Sexual Purity and Heart Honor',
    category: 'purity',
    subtitle: 'Honoring God\'s Design for Sexuality',
    scriptureAnchor: '1 Thessalonians 4:3-5; Matthew 5:8',
    body: `Lord God,
You are holy, and You have called me to holiness.
Thank You that sex is Your sacred design, intended for the joy, bonding, and covenant of marriage between a man and a woman, picturing Christ and His bride.
Forgive me for the times I reduced this holy mystery to selfish consumption.

I pray for my heart: make it pure, sincere, and free of double-mindedness.
I pray for my eyes: let them look upon men and women as image-bearers of God with sacred worth, never as objects for gratification.
If I am single, help me guard my future spouse in purity today.
If I am married, let me rejoice exclusively in the spouse of my youth, finding complete contentment in our covenant love.
Blessed are the pure in heart, for they shall see God. Let this promise be my eternal compass.
Amen.`
  },
  {
    id: 'p-strength',
    title: 'Prayer for Perseverance and Kingdom Purpose',
    category: 'strength',
    subtitle: 'Living as a Conquering Soldier of the Cross',
    scriptureAnchor: 'Philippians 1:6; Jude 1:24-25',
    body: `Almighty Father,
I am confident of this very thing: that He who began a good work in me will bring it to completion at the day of Jesus Christ.
When the days are long and the battle feels exhausting, remind me that this struggle is not in vain.
Every time I resist, every time I choose Christ over compromise, spiritual muscle is being forged in me.

Break me out of small, inward living.
Give me a mission worthy of my calling: to love others selflessly, to share the gospel, to serve my community, and to bear witness to Your saving grace.
Make me a soldier who stands firm to the end.
Now to Him who is able to keep me from stumbling, and to present me blameless before His glory with great joy,
To the only God our Savior, through Jesus Christ our Lord,
Be glory, majesty, dominion, and authority, before all time and now and forever.
Amen!`
  }
];
