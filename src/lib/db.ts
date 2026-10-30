import fs from 'fs';
import path from 'path';
import { DatabaseSchema, EventItem, EventTheme, EventRegistration, Profile, EventCategory, EventMedia } from './types';
import { THEME_PRESETS } from './themePresets';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'college_events.json');

const INITIAL_CATEGORIES: EventCategory[] = [
  { id: 'cat-1', category_name: 'Technical Events', category_description: 'Coding contests, tech quizzes, robotics and technical challenges', created_at: new Date().toISOString() },
  { id: 'cat-2', category_name: 'Cultural Events', category_description: 'Music, dance, drama, fashion shows and artistic performances', created_at: new Date().toISOString() },
  { id: 'cat-3', category_name: 'Symposiums', category_description: 'Departmental paper presentations, technical symposiums and academic conclaves', created_at: new Date().toISOString() },
  { id: 'cat-4', category_name: 'Workshops', category_description: 'Hands-on practical workshops, bootcamps and expert training sessions', created_at: new Date().toISOString() },
  { id: 'cat-5', category_name: 'Hackathons', category_description: '24 to 36-hour continuous software and hardware build sprints', created_at: new Date().toISOString() },
  { id: 'cat-6', category_name: 'Sports Events', category_description: 'Inter-college tournaments, track and field, indoor & outdoor games', created_at: new Date().toISOString() },
  { id: 'cat-7', category_name: 'Department Events', category_description: 'Events organized by individual academic departments', created_at: new Date().toISOString() },
  { id: 'cat-8', category_name: 'Club Events', category_description: 'Student clubs, social responsibility, arts and literature chapters', created_at: new Date().toISOString() },
  { id: 'cat-9', category_name: 'Other College Events', category_description: 'Alumni meets, convocation, annual day and college-wide festivals', created_at: new Date().toISOString() },
];

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'admin-usr-1',
    full_name: 'Dr. K. Ravichandran (Administrator)',
    email: 'admin@hindusthan.net',
    password_hash: 'admin123',
    role: 'admin',
    department: 'Central Administration',
    register_number: 'FAC-ADMIN-01',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-hackathon-2026',
    title: 'HackHindusthan 2026 — 36-Hour National Hackathon',
    slug: 'hack-hindusthan-2026',
    tagline: 'Code. Innovate. Build the Autonomous Future.',
    short_description: 'Flagship 36-hour national level hackathon bringing together 500+ top developers to solve real-world problems using AI, Web3, and IoT.',
    description: `HackHindusthan 2026 is the premier annual national hackathon hosted by Hindusthan Educational and Charitable Trust. Over 36 hours of relentless innovation, student teams from across the nation will compete across diverse tracks including Generative AI, Smart Healthcare, Sustainable Smart Cities, and Decentralized Systems. 
    
Participants will receive direct mentorship from seasoned industry architects, cloud access credits, round-the-clock technical guidance, gourmet meals, and exciting recreation zones.`,
    category_id: 'cat-5',
    department: 'Computer Science & Engineering and Information Technology',
    organizer: 'Department of CSE & AI Society',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-11-20',
    end_date: '2026-11-22',
    start_time: '09:00',
    end_time: '18:00',
    venue: 'Dr. APJ Abdul Kalam Auditorium & Computing Labs, Main Campus',
    registration_enabled: true,
    registration_type: 'builtin',
    registration_deadline: '2026-11-15T23:59:59',
    publication_status: 'published',
    highlights: [
      '₹1,50,000 Grand Prize Pool',
      'Direct Fast-Track Internship Opportunities',
      'Free Cloud Compute & GPU Sandbox Access',
      'Industry Mentors from Top Tech Unicorns',
      'Food, Red Bull & Refreshments fully sponsored'
    ],
    schedule: [
      { time: 'Day 1 — 08:30 AM', title: 'Check-in & Networking Breakfast', description: 'Badge collection, kit distribution, and breakfast.' },
      { time: 'Day 1 — 10:00 AM', title: 'Grand Opening & Problem Statements Released', description: 'Inaugural address by the Chief Guest followed by hackathon kickoff.' },
      { time: 'Day 1 — 01:00 PM', title: 'Hacking Block 1 & Lunch', description: 'Ideation and prototype architecture setup.' },
      { time: 'Day 1 — 06:00 PM', title: 'Mentor Checkpoint 1', description: 'Technical review and feasibility assessment with assigned mentors.' },
      { time: 'Day 2 — 02:00 AM', title: 'Midnight Gaming & Pizza Break', description: 'Recharge session with arcade gaming and snacks.' },
      { time: 'Day 2 — 09:00 AM', title: 'Mentor Checkpoint 2 (Semi-Finals)', description: 'Functional code demo and progress audit.' },
      { time: 'Day 2 — 04:00 PM', title: 'Final Pitching to Jury & Award Ceremony', description: 'Top 10 teams pitch on main stage. Winners announced.' }
    ],
    rules: [
      'Team size must be between 2 to 4 members.',
      'All code, designs, and assets must be developed during the hackathon period.',
      'Pre-existing codebases are strictly prohibited; open source libraries and APIs are permitted.',
      'Strict adherence to the student code of conduct and academic integrity.'
    ],
    eligibility: 'Open to all undergraduate and postgraduate engineering, polytechnic, and arts & science students with valid college ID.',
    prizes: [
      { rank: '1st Place', title: 'Champion of HackHindusthan', reward: '₹75,000 Cash + Trophy + Paid Internship' },
      { rank: '2nd Place', title: 'First Runner Up', reward: '₹45,000 Cash + Trophy + Goodies' },
      { rank: '3rd Place', title: 'Second Runner Up', reward: '₹30,000 Cash + Certificate + Swag' },
      { rank: 'Special Track', title: 'Best AI/ML Innovation Award', reward: '₹15,000 + Cloud Credits' }
    ],
    coordinators: [
      { name: 'Prof. Suresh Kumar M.E.', role: 'Faculty Convener', phone: '+91 98421 55678', email: 'suresh.cse@hindusthan.net' },
      { name: 'Arun Prakash (Final CSE)', role: 'Lead Student Coordinator', phone: '+91 97890 12345', email: 'arun.hack@hindusthan.net' }
    ],
    sponsors: [
      { name: 'Google Cloud Platform', tier: 'Title Partner' },
      { name: 'GitHub Education', tier: 'Developer Partner' },
      { name: 'NVIDIA Inception', tier: 'AI Hardware Partner' }
    ],
    created_by: 'admin-usr-1',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-frame-fest-2026',
    title: 'FRAME FEST 2026 — Inter-College Cultural Extravaganza',
    slug: 'frame-fest-2026',
    tagline: 'Colors of Youth. Rhythms of Passion.',
    short_description: 'The mega annual cultural festival featuring music concerts, pro-shows, western & classical dance, theatrical drama, fashion walks, and culinary arts.',
    description: `FRAME FEST is Hindusthan Educational Trust's grand cultural fiesta celebrating youth talent, performing arts, and creative expression. With over 6,000 student attendees representing 80+ colleges, FRAME FEST 2026 transforms the campus into a dynamic wonderland of lights, melodies, and dramatic choreography.
    
The 3-day carnival hosts 25+ competitive events culminating in a star-studded celebrity musical evening.`,
    category_id: 'cat-2',
    department: 'Fine Arts Club & Student Affairs Council',
    organizer: 'Hindusthan Cultural Council',
    poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-12-05',
    end_date: '2026-12-07',
    start_time: '10:00',
    end_time: '21:00',
    venue: 'Hindusthan Open Air Amphitheatre & Central Lawns',
    registration_enabled: true,
    registration_type: 'builtin',
    registration_deadline: '2026-12-01T23:59:59',
    publication_status: 'published',
    highlights: [
      'Celebrity Musical Concert & DJ Night',
      'Inter-College Battle of the Bands',
      'Mega Runway Fashion League',
      'Street Dance Battle & Solo/Duet Western',
      'Art Installations & Street Food Fiesta'
    ],
    schedule: [
      { time: 'Day 1 — 10:00 AM', title: 'Grand Cultural Inauguration & Classical Dance', description: 'Traditional dance and fusion welcome performance.' },
      { time: 'Day 1 — 02:00 PM', title: 'Battle of the Bands', description: 'Electric showdown between top collegiate rock and fusion bands.' },
      { time: 'Day 2 — 11:00 AM', title: 'Western Group Dance Choreography', description: 'High-energy sync choreography competition.' },
      { time: 'Day 2 — 06:00 PM', title: 'The Royal Fashion Walk', description: 'Themed ethnic and modern couture showcase.' },
      { time: 'Day 3 — 05:00 PM', title: 'Valedictory & Celebrity Pro-Show Concert', description: 'Star musical performance by acclaimed playback artists.' }
    ],
    rules: [
      'Participants must bring their authorized college ID card and registration confirmation pass.',
      'Sound tracks and musical instrument setups must be submitted 1 hour prior to respective events.',
      'Vulgarity or offensive gestures will lead to immediate disqualification.'
    ],
    eligibility: 'All bonafide students of accredited colleges, universities, and polytechnics.',
    prizes: [
      { rank: 'Overall Rolling Trophy', title: 'Frame Fest Champions', reward: '₹1,00,000 + Diamond Rolling Trophy' },
      { rank: 'Battle of Bands Winner', title: 'Best College Band', reward: '₹40,000 + Studio Recording Session' },
      { rank: 'Fashion Show Winner', title: 'Couture Best Styling', reward: '₹35,000 + Model Portfolio' }
    ],
    coordinators: [
      { name: 'Dr. Malathi Sundaram', role: 'Staff Cultural Director', phone: '+91 94432 89012', email: 'cultural@hindusthan.net' },
      { name: 'Kavya Venkat (Final ECE)', role: 'President, Fine Arts Club', phone: '+91 99521 34567', email: 'kavya.fest@hindusthan.net' }
    ],
    created_by: 'admin-usr-1',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-yukti-symposium-2026',
    title: 'YUKTI 2026 — National Technical Symposium',
    slug: 'yukti-tech-symposium-2026',
    tagline: 'Bridging Theoretical Insights with Technological Excellence.',
    short_description: 'National multi-track technical conference featuring research paper presentations, project expo, CAD modeling, and algorithmic speed coding.',
    description: `YUKTI 2026 brings together budding engineering minds, researchers, and patent holders to discuss breakthrough scientific discoveries and engineering solutions. With specialized paper tracks vetted by IEEE and Springer reviewers, this symposium offers an esteemed platform for technical publication.
    
Registration for YUKTI 2026 has reached maximum capacity and is now officially closed.`,
    category_id: 'cat-3',
    department: 'Electronics & Communication and Electrical Engineering',
    organizer: 'Department of ECE & IEEE Student Chapter',
    poster_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-11-12',
    end_date: '2026-11-12',
    start_time: '09:30',
    end_time: '16:30',
    venue: 'Convention Center, Hindusthan Campus',
    registration_enabled: false, // NOTICE: REGISTRATION OFF
    registration_type: 'builtin',
    registration_deadline: '2026-10-25T23:59:59',
    publication_status: 'published',
    highlights: [
      'Keynote Address by Senior Scientist from ISRO',
      'Peer-Reviewed Proceedings in Indexed Conference Journals',
      'Hardware Prototype Exhibition with Investor Jury',
      'Certificates of Merit awarded to all finalists'
    ],
    schedule: [
      { time: '09:30 AM', title: 'Inaugural Session & Keynote Address', description: 'Address on Deep Space Exploration Avionics.' },
      { time: '11:00 AM', title: 'Technical Paper Presentation — Tracks A & B', description: 'Parallel presentations in Smart Embedded Systems and VLSI.' },
      { time: '01:00 PM', title: 'Networking Luncheon', description: 'Delegates interaction with visiting researchers.' },
      { time: '02:00 PM', title: 'Project Exhibition & Hardware Demos', description: 'Live prototype evaluation by technical judges.' },
      { time: '04:00 PM', title: 'Valedictory & Best Paper Awards', description: 'Distribution of cash awards and publication citations.' }
    ],
    rules: [
      'Papers must conform to the 2-column IEEE standard manuscript format.',
      'Maximum 3 authors per paper presentation.',
      'Plagiarism index must not exceed 12%.'
    ],
    eligibility: 'B.E./B.Tech, M.E./M.Tech, and Research Scholars.',
    prizes: [
      { rank: 'Best Research Paper', title: 'IEEE Excellence Trophy', reward: '₹20,000 + Journal Publication' },
      { rank: 'Best Hardware Prototype', title: 'Innovation Trophy', reward: '₹15,000 + Patent Filing Support' }
    ],
    coordinators: [
      { name: 'Dr. V. Natarajan Ph.D.', role: 'Head of Department, ECE', phone: '+91 94861 22334', email: 'natarajan.ece@hindusthan.net' }
    ],
    created_by: 'admin-usr-1',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-hindusthan-trophy-2026',
    title: 'Hindusthan Trophy 2026 — All India Inter-Collegiate Sports Meet',
    slug: 'hindusthan-trophy-2026',
    tagline: 'Strength. Speed. Spirit of Champions.',
    short_description: 'Premier sports carnival covering Athletics, Cricket, Football, Basketball, Volleyball, and Badminton across mens and womens categories.',
    description: `The Hindusthan Trophy is one of South India's grandest inter-collegiate sports meets, welcoming over 120 college athletic contingents. Featuring state-of-the-art synthetic tracks, floodlit turf grounds, and international-standard indoor wooden courts, athletes compete for supremacy and prestigious sports scholarships.`,
    category_id: 'cat-6',
    department: 'Department of Physical Education',
    organizer: 'Hindusthan Sports Board',
    poster_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-12-18',
    end_date: '2026-12-21',
    start_time: '07:00',
    end_time: '19:00',
    venue: 'Hindusthan Athletic Complex & Turf Grounds',
    registration_enabled: true,
    registration_type: 'builtin',
    registration_deadline: '2026-12-12T23:59:59',
    publication_status: 'published',
    highlights: [
      '₹2,50,000 Total Cash Prizes Across 14 Sports',
      'Olympic Torch Relay & Grand March Past',
      'Floodlit Football and Basketball Finals',
      'Sports Physiotherapy & First-Aid Support'
    ],
    schedule: [
      { time: 'Day 1 — 07:00 AM', title: 'Torch Lighting & Athletes March Past', description: 'Opening ceremony with college bands.' },
      { time: 'Day 1 — 09:00 AM', title: 'Athletic Heats & Track Events (100m, 400m, 1500m)', description: 'Qualifying rounds on the 400m synthetic track.' },
      { time: 'Day 2 — 08:00 AM', title: 'Cricket & Football Knockout Matches', description: 'Simultaneous knockout fixtures across 4 grounds.' },
      { time: 'Day 3 — 04:00 PM', title: 'Basketball & Volleyball Semifinals', description: 'Floodlit stadium fixtures.' },
      { time: 'Day 4 — 05:00 PM', title: 'Grand Finals & Trophy Presentation', description: 'Presentation of the Hindusthan Rolling Trophy.' }
    ],
    rules: [
      'Every college contingent must be accompanied by their Physical Director.',
      'Proper team jerseys and safety equipment are strictly required.',
      'Referees decisions are final and binding.'
    ],
    eligibility: 'Regular full-time collegiate students under 25 years of age.',
    prizes: [
      { rank: 'Overall Champions', title: 'Hindusthan Gold Cup', reward: '₹1,00,000 + Rolling Cup' },
      { rank: 'Athletics Individual Champion', title: 'Fastest Collegiate Athlete', reward: '₹25,000 + Gold Medal' }
    ],
    coordinators: [
      { name: 'Dr. R. Balaji', role: 'Director of Physical Education', phone: '+91 98433 77889', email: 'sports@hindusthan.net' }
    ],
    created_by: 'admin-usr-1',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'event-ai-cloud-workshop-2026',
    title: 'Cloud Native & Generative AI Architecture Masterclass',
    slug: 'ai-cloud-native-workshop-2026',
    tagline: 'Deploying Scalable Agentic Systems with Kubernetes & LLMs.',
    short_description: 'An intensive, hands-on masterclass led by principal cloud architects on container orchestration, microservices, and LLM fine-tuning.',
    description: `A hands-on, deep-dive workshop tailored for software engineers and aspiring cloud architects. Participants will build and deploy a production-grade multi-agent LLM application on Kubernetes clusters, implementing enterprise observability, Redis caching, and automated CI/CD pipelines.
    
Due to computing workstation limits, registrations for this cohort are closed.`,
    category_id: 'cat-4',
    department: 'Department of Computer Science & Engineering',
    organizer: 'Cloud Computing Research Cell',
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
    start_date: '2026-11-08',
    end_date: '2026-11-09',
    start_time: '09:00',
    end_time: '17:00',
    venue: 'High Performance Computing Lab, Block 4',
    registration_enabled: false, // NOTICE: REGISTRATION OFF
    registration_type: 'builtin',
    registration_deadline: '2026-10-28T23:59:59',
    publication_status: 'published',
    highlights: [
      'Each participant receives a dedicated $100 Cloud Lab Instance',
      'Live containerization with Docker and Kubernetes cluster rollout',
      'Building RAG pipelines with Vector Databases and LangChain',
      'Official Certificate of Completion recognized by Cloud Alliance'
    ],
    schedule: [
      { time: 'Day 1 — 09:00 AM', title: 'Containerization Fundamentals & Docker Deep Dive', description: 'Multi-stage builds, image optimization.' },
      { time: 'Day 1 — 02:00 PM', title: 'Kubernetes Pods, Deployments & Service Meshes', description: 'Hands-on cluster provisioning.' },
      { time: 'Day 2 — 09:00 AM', title: 'Retrieval Augmented Generation (RAG) Architecture', description: 'Vector embeddings and cosine similarity search.' },
      { time: 'Day 2 — 02:00 PM', title: 'End-to-End Production Deployment & Monitoring', description: 'Deploying agents with Prometheus and Grafana metrics.' }
    ],
    rules: [
      'Participants must bring their personal laptop with minimum 8GB RAM.',
      'Active GitHub and Google Cloud accounts must be created before arrival.'
    ],
    eligibility: 'Pre-final, final year students and tech enthusiasts with basic Linux/Python knowledge.',
    prizes: [
      { rank: 'Top Lab Assessment', title: 'Excellence Award', reward: 'Google Cloud Certification Exam Voucher' }
    ],
    coordinators: [
      { name: 'Dr. S. Karthikeyan', role: 'Associate Professor, CSE', phone: '+91 97900 44556', email: 'karthikeyan.cse@hindusthan.net' }
    ],
    created_by: 'admin-usr-1',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const INITIAL_THEMES: EventTheme[] = [
  {
    id: 'theme-hackathon-2026',
    event_id: 'event-hackathon-2026',
    ...THEME_PRESETS['hackathon'],
  },
  {
    id: 'theme-frame-fest-2026',
    event_id: 'event-frame-fest-2026',
    ...THEME_PRESETS['cultural-fest'],
  },
  {
    id: 'theme-yukti-symposium-2026',
    event_id: 'event-yukti-symposium-2026',
    ...THEME_PRESETS['tech-symposium'],
  },
  {
    id: 'theme-hindusthan-trophy-2026',
    event_id: 'event-hindusthan-trophy-2026',
    ...THEME_PRESETS['sports-arena'],
  },
  {
    id: 'theme-ai-cloud-workshop-2026',
    event_id: 'event-ai-cloud-workshop-2026',
    ...THEME_PRESETS['workshop-clean'],
  }
];

const INITIAL_MEDIA: EventMedia[] = [
  {
    id: 'media-1',
    event_id: 'event-hackathon-2026',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
  },
  {
    id: 'media-2',
    event_id: 'event-hackathon-2026',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
  },
  {
    id: 'media-3',
    event_id: 'event-frame-fest-2026',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
  },
  {
    id: 'media-4',
    event_id: 'event-frame-fest-2026',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
  }
];

const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'reg-sample-1',
    event_id: 'event-hackathon-2026',
    user_id: 'student-usr-1',
    full_name: 'Priya Sharma',
    email: 'student@hindusthan.net',
    register_number: '720721104042',
    department: 'Computer Science and Engineering',
    year: '4th Year',
    contact_number: '+91 98765 43210',
    registration_status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

function getInitialData(): DatabaseSchema {
  return {
    profiles: INITIAL_PROFILES,
    event_categories: INITIAL_CATEGORIES,
    events: INITIAL_EVENTS,
    event_themes: INITIAL_THEMES,
    event_media: INITIAL_MEDIA,
    event_registrations: INITIAL_REGISTRATIONS,
  };
}

let cachedDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      cachedDb = initialData;
      return cachedDb;
    }

    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    cachedDb = JSON.parse(raw);
    return cachedDb!;
  } catch (error) {
    console.error('Error reading database file, using in-memory fallback:', error);
    if (!cachedDb) {
      cachedDb = getInitialData();
    }
    return cachedDb;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  cachedDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving database to file:', error);
  }
}

// ----------------- Helper CRUD operations -----------------

export function getAllEvents(options?: {
  category_id?: string;
  status?: string;
  department?: string;
  search?: string;
  publicOnly?: boolean;
}): (EventItem & { theme?: EventTheme; category?: EventCategory; registration_count: number })[] {
  const db = getDatabase();
  let events = [...db.events];

  if (options?.publicOnly) {
    events = events.filter((e) => e.publication_status === 'published');
  }

  if (options?.category_id && options.category_id !== 'all') {
    events = events.filter((e) => e.category_id === options.category_id);
  }

  if (options?.department && options.department !== 'all') {
    events = events.filter((e) =>
      e.department.toLowerCase().includes(options.department!.toLowerCase())
    );
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.tagline.toLowerCase().includes(q) ||
        e.short_description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }

  return events.map((event) => {
    const theme = db.event_themes.find((t) => t.event_id === event.id);
    const category = db.event_categories.find((c) => c.id === event.category_id);
    const regCount = db.event_registrations.filter((r) => r.event_id === event.id).length;
    return {
      ...event,
      theme,
      category,
      registration_count: regCount,
    };
  });
}

export function getEventBySlug(slug: string): (EventItem & { theme?: EventTheme; category?: EventCategory; media: EventMedia[]; registration_count: number }) | null {
  const db = getDatabase();
  const event = db.events.find((e) => e.slug === slug);
  if (!event) return null;

  const theme = db.event_themes.find((t) => t.event_id === event.id);
  const category = db.event_categories.find((c) => c.id === event.category_id);
  const media = db.event_media.filter((m) => m.event_id === event.id).sort((a, b) => a.display_order - b.display_order);
  const regCount = db.event_registrations.filter((r) => r.event_id === event.id).length;

  return {
    ...event,
    theme,
    category,
    media,
    registration_count: regCount,
  };
}

export function getEventById(id: string): EventItem | null {
  const db = getDatabase();
  return db.events.find((e) => e.id === id) || null;
}

export function createEvent(eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>, themeData?: Partial<EventTheme>): EventItem {
  const db = getDatabase();
  const newId = `event-${Date.now()}`;
  
  // Ensure unique slug
  let slug = eventData.slug || eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let counter = 1;
  const originalSlug = slug;
  while (db.events.some((e) => e.slug === slug)) {
    slug = `${originalSlug}-${counter++}`;
  }

  const now = new Date().toISOString();
  const newEvent: EventItem = {
    ...eventData,
    id: newId,
    slug,
    created_at: now,
    updated_at: now,
  };

  db.events.unshift(newEvent);

  // Setup theme
  const presetKey = themeData?.theme_preset || 'tech-symposium';
  const defaultPreset = THEME_PRESETS[presetKey as keyof typeof THEME_PRESETS] || THEME_PRESETS['tech-symposium'];

  const newTheme: EventTheme = {
    id: `theme-${newId}`,
    event_id: newId,
    ...defaultPreset,
    ...themeData,
    theme_preset: presetKey,
  };
  db.event_themes.push(newTheme);

  saveDatabase(db);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<EventItem>, themeUpdates?: Partial<EventTheme>): EventItem | null {
  const db = getDatabase();
  const eventIndex = db.events.findIndex((e) => e.id === id);
  if (eventIndex === -1) return null;

  // If slug was updated, ensure uniqueness
  if (updates.slug && updates.slug !== db.events[eventIndex].slug) {
    let slug = updates.slug;
    let counter = 1;
    const baseSlug = slug;
    while (db.events.some((e) => e.id !== id && e.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
    updates.slug = slug;
  }

  db.events[eventIndex] = {
    ...db.events[eventIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (themeUpdates) {
    const themeIndex = db.event_themes.findIndex((t) => t.event_id === id);
    if (themeIndex >= 0) {
      db.event_themes[themeIndex] = {
        ...db.event_themes[themeIndex],
        ...themeUpdates,
      };
    } else {
      const presetKey = themeUpdates.theme_preset || 'tech-symposium';
      const defaultPreset = THEME_PRESETS[presetKey as keyof typeof THEME_PRESETS] || THEME_PRESETS['tech-symposium'];
      db.event_themes.push({
        id: `theme-${id}`,
        event_id: id,
        ...defaultPreset,
        ...themeUpdates,
        theme_preset: presetKey,
      });
    }
  }

  saveDatabase(db);
  return db.events[eventIndex];
}

export function deleteEvent(id: string): boolean {
  const db = getDatabase();
  const initialLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length === initialLen) return false;

  db.event_themes = db.event_themes.filter((t) => t.event_id !== id);
  db.event_media = db.event_media.filter((m) => m.event_id !== id);
  db.event_registrations = db.event_registrations.filter((r) => r.event_id !== id);

  saveDatabase(db);
  return true;
}

export function registerUserForEvent(data: {
  event_id: string;
  user_id?: string;
  full_name: string;
  email: string;
  register_number: string;
  department: string;
  year: string;
  contact_number: string;
}): { success: boolean; message: string; registration?: EventRegistration } {
  const db = getDatabase();
  const event = db.events.find((e) => e.id === data.event_id);
  if (!event) {
    return { success: false, message: 'Event not found.' };
  }

  // CORE BUSINESS RULE: Registration ON/OFF Enforcement
  if (!event.registration_enabled) {
    return { success: false, message: 'Registration is closed or unavailable for this event.' };
  }

  if (event.publication_status !== 'published') {
    return { success: false, message: 'Event is not currently published.' };
  }

  // Check registration deadline if present
  if (event.registration_deadline) {
    const deadline = new Date(event.registration_deadline);
    if (new Date() > deadline) {
      return { success: false, message: 'The registration deadline for this event has passed.' };
    }
  }

  // Check unique constraint: user already registered for this event by email or register number
  const existing = db.event_registrations.find(
    (r) =>
      r.event_id === data.event_id &&
      (r.email.toLowerCase() === data.email.toLowerCase() ||
        (r.register_number && data.register_number && r.register_number.toLowerCase() === data.register_number.toLowerCase()))
  );

  if (existing) {
    return { success: false, message: 'You are already registered for this event with this email or register number.' };
  }

  const newReg: EventRegistration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event_id: data.event_id,
    user_id: data.user_id || `guest-${Date.now()}`,
    full_name: data.full_name,
    email: data.email,
    register_number: data.register_number,
    department: data.department,
    year: data.year,
    contact_number: data.contact_number,
    registration_status: 'confirmed',
    created_at: new Date().toISOString(),
  };

  db.event_registrations.push(newReg);
  saveDatabase(db);

  return { success: true, message: 'Registration successful!', registration: newReg };
}

export function getUserRegistrations(userId: string): (EventRegistration & { event: EventItem })[] {
  const db = getDatabase();
  const userRegs = db.event_registrations.filter((r) => r.user_id === userId);
  return userRegs.map((reg) => {
    const event = db.events.find((e) => e.id === reg.event_id)!;
    return {
      ...reg,
      event,
    };
  }).filter((r) => !!r.event);
}

export function getAdminStats() {
  const db = getDatabase();
  const total = db.events.length;
  const published = db.events.filter((e) => e.publication_status === 'published').length;
  const drafts = db.events.filter((e) => e.publication_status === 'draft').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = db.events.filter((e) => e.publication_status === 'published' && e.start_date > todayStr).length;
  const ongoing = db.events.filter((e) => e.publication_status === 'published' && e.start_date <= todayStr && e.end_date >= todayStr).length;
  const completed = db.events.filter((e) => e.publication_status === 'published' && e.end_date < todayStr).length;

  const regEnabled = db.events.filter((e) => e.registration_enabled).length;
  const regDisabled = db.events.filter((e) => !e.registration_enabled).length;
  const totalRegistrations = db.event_registrations.length;

  return {
    total,
    published,
    drafts,
    upcoming,
    ongoing,
    completed,
    regEnabled,
    regDisabled,
    totalRegistrations,
  };
}
