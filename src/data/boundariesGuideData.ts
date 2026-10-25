export interface BoundaryGuideSection {
  id: string;
  title: string;
  category: 'dns' | 'safesearch' | 'os_restrictions' | 'apps' | 'physical_environment' | 'transparency';
  summary: string;
  steps: string[];
  tips: string;
}

export const BOUNDARIES_GUIDE: BoundaryGuideSection[] = [
  {
    id: 'transparency-notice',
    title: 'PWA Privacy & Technical Transparency',
    category: 'transparency',
    summary: 'What this Web Application Can and Cannot Do on Your Device',
    steps: [
      'This application runs in a secure, privacy-preserving browser sandbox as a Progressive Web App (PWA).',
      'It CANNOT silently monitor your web traffic, read other app histories, or block operating system network requests in the background.',
      'We do not spy on you or track your private activity. All your entries, checklists, and journal reflections remain strictly on your device.',
      'Because no website can forcibly police other phone apps without root system permissions, true digital boundaries require intentional setup of device filters, router DNS, and honest Christian accountability.'
    ],
    tips: 'God honors honest, deliberate fences. Combine the steps below with transparent accountability for ironclad protection.'
  },
  {
    id: 'dns-protection',
    title: 'Free DNS-Level Adult Content Blocking',
    category: 'dns',
    summary: 'Block Millions of Adult Domains at the Network Level in Under 2 Minutes',
    steps: [
      'Option 1 (CleanBrowsing Family Filter): Set your phone or home Wi-Fi router DNS to: Primary: 185.228.168.168, Secondary: 185.228.169.168. This automatically blocks adult content and forces SafeSearch across all connected devices.',
      'Option 2 (Cloudflare 1.1.1.3 for Families): Set Primary DNS to 1.1.1.3 and Secondary to 1.0.0.3 to block adult content and malware automatically.',
      'Option 3 (NextDNS): Create a free account at nextdns.io to customize adult site blocklists, enable SafeSearch enforcement, and view your own network shield status.',
      'On Android (Private DNS): Go to Settings -> Network & Internet -> Private DNS -> Select "Private DNS provider hostname" and enter: adult-filter-dns.cleanbrowsing.org.',
      'On iOS (Encrypted DNS profile): Download the CleanBrowsing iOS DNS mobile configuration profile to secure mobile cellular and Wi-Fi networks.'
    ],
    tips: 'Have a spouse, parent, or trusted accountability partner set a password on your router so you cannot easily revert DNS settings in a moment of weakness.'
  },
  {
    id: 'os-restrictions',
    title: 'Device-Level Restrictions (iOS & Android)',
    category: 'os_restrictions',
    summary: 'Lock Down Browsers and App Stores with Screen Time or Family Link',
    steps: [
      'Apple iOS (iPhone/iPad Screen Time):',
      '1. Go to Settings -> Screen Time -> Content & Privacy Restrictions -> Turn ON.',
      '2. Tap "Store, Web, Siri & Game Center Content" -> "Web Content" -> Select "Limit Adult Websites".',
      '3. Under "Never Allow", add any specific domains or social sites that trigger you.',
      '4. Set a 4-digit Screen Time Passcode that ONLY your accountability partner knows.',
      '5. Turn off Account Changes and App Deletion/Installation if compulsive app downloading is a temptation.',
      '',
      'Android Devices (Google Family Link / Digital Wellbeing):',
      '1. Open Google Chrome -> Settings -> Privacy and security -> Use secure DNS -> Choose CleanBrowsing Family filter.',
      '2. In Digital Wellbeing, set strict 15-minute daily timers on high-risk apps.',
      '3. Use Google Family Link with a trusted family member or mentor as the supervisory manager to lock mature app installs.'
    ],
    tips: 'The secret to effective device restrictions is giving the passcode to an accountability partner. If you know the code, it is merely a speed bump.'
  },
  {
    id: 'safesearch-enforcement',
    title: 'Enforcing SafeSearch Across Search Engines',
    category: 'safesearch',
    summary: 'Filter Explicit Results on Google, Bing, DuckDuckGo & YouTube',
    steps: [
      'Google: Visit google.com/safesearch -> Turn SafeSearch Filter to "Filter" (blocks explicit images, videos, and sites).',
      'Bing: Visit bing.com/account/general -> Under SafeSearch, select "Strict".',
      'DuckDuckGo: Go to duckduckgo.com/settings -> SafeSearch -> Select "Strict".',
      'YouTube: Scroll to the bottom of youtube.com or tap profile icon -> Turn "Restricted Mode" ON to hide potentially mature videos.',
      'Router Level: Enabling CleanBrowsing DNS automatically locks Google, Bing, and YouTube into strict SafeSearch for every device on your home network.'
    ],
    tips: 'SafeSearch prevents accidental exposure when searching for normal terms, removing unexpected visual triggers.'
  },
  {
    id: 'filtering-software',
    title: 'Reputable Accountability & Filtering Tools',
    category: 'apps',
    summary: 'Dedicated Christian Software for Screen Monitoring and Deep Protection',
    steps: [
      'Covenant Eyes: Comprehensive screen-monitoring and Christian accountability software that analyzes screen activity using AI and sends alerts to your chosen ally.',
      'Truple: High-frequency screenshot accountability for Windows, Mac, Android, and Linux with end-to-end encryption.',
      'Accountable2You: Detailed activity reporting across desktop and mobile platforms with instant trigger alerts sent to partners.',
      'BlockerX: Mobile website and app blocker with accountability partner notification and strict uninstallation prevention.',
      'Pluckeye: Strict command-line based browser filter that delays site unblocking by hours or days to thwart momentary impulses.'
    ],
    tips: 'Choose one reputable tool and connect it with your accountability partner. Transparency brings immense relief.'
  },
  {
    id: 'physical-environment',
    title: 'Physical & Environmental Boundaries (The Non-Tech Rules)',
    category: 'physical_environment',
    summary: 'Removing the Physical Setting Where 90% of Relapses Occur',
    steps: [
      'Rule 1: No Screens in the Bedroom at Night. Purchase a $10 analog alarm clock. Charge your smartphone, tablet, and laptop in the kitchen, hallway, or living room overnight.',
      'Rule 2: The Open Door Policy. Never use laptops or internet devices behind closed, locked doors in private rooms.',
      'Rule 3: Beware of HALT. When you feel Hungry, Angry, Lonely, or Tired, step away from screens. Your neurochemical willpower is at its absolute lowest.',
      'Rule 4: Immediate Flight. The moment you feel the urge to click or search, stand up physically. Walk out of the room, drink a tall glass of ice water, or step outdoors.',
      'Rule 5: Unstructured Time Management. Schedule your evenings and weekends with purposeful hobbies, reading, exercise, and fellowship so boredom does not invite temptation.'
    ],
    tips: 'Physical boundaries are often far more effective than digital blockers because they physically separate your body from the opportunity to sin.'
  }
];
