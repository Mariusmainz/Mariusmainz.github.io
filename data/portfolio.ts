export interface PersonalInfo {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  location: string
  linkedin: string
  cvPath: string
  photoPath: string
  about: string
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  period: string
  description: string
}

export interface EducationEntry {
  id: string
  degree: string
  field: string
  institution: string
  period: string
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  tags: string[]
  detail: string
  type: 'professional' | 'personal'
}

export type Skills = Record<string, string[]>

export const personal: PersonalInfo = {
  name: 'Marius Mainz Elkjær',
  title: 'MSc Student · Electrical Engineering',
  tagline: 'IC design, embedded systems, and hardware-aware software.',
  email: 'Marius.mainze@gmail.com',
  phone: '+45 61 69 37 83',
  location: 'Copenhagen, Denmark',
  linkedin: 'https://www.linkedin.com/in/marius-mainz-elkjær-60664822b',
  cvPath: '/Resources/CV_english_mme.pdf',
  photoPath: '/Resources/photo_mme.jpg',
  about: `Electrical engineering student specializing in IC design. Experienced in designing, simulating, and testing electronic systems, with a strong foundation in circuit analysis and hardware-aware software development. Four years of experience in professional engineering teams, with a strong interest in startup environments.`,
}

export const experience: ExperienceEntry[] = [
  {
    id: 'ic-optimize',
    role: 'Student Assistant',
    company: 'IC Optimize',
    location: 'Kongens Lyngby',
    period: 'Jul 2025 – Present',
    description: 'Analog IC design, software development and testing.',
  },
  {
    id: 'pascal',
    role: 'Student Assistant',
    company: 'Pascal A/S',
    location: 'Herlev',
    period: 'Mar 2022 – Jul 2025',
    description: 'Led automated audio testing of class D amplifiers. Focus in software R&D with occasional hardware design tasks.',
  },
  {
    id: 'kite',
    role: 'Shop Manager',
    company: 'KiteDanmark',
    location: 'Copenhagen',
    period: '2019 – 2022',
    description: 'Managed shop operations.',
  },
  {
    id: 'avis',
    role: 'Car Rental Agent',
    company: 'Avis Budget Group',
    location: 'Copenhagen',
    period: 'May 2017 – Jun 2018',
    description: 'Customer service and vehicle fleet management.',
  },
]

export const education: EducationEntry[] = [
  {
    id: 'dtu-msc',
    degree: "Master's Degree",
    field: 'Electrical Engineering (IC Design)',
    institution: 'DTU',
    period: '2024 – Present',
  },
  {
    id: 'hkust',
    degree: 'Study Exchange',
    field: 'IC Design Engineering',
    institution: 'HKUST',
    period: 'Sep 2025 – Dec 2025',
  },
  {
    id: 'dtu-bsc',
    degree: "Bachelor's Degree",
    field: 'Electrical Engineering',
    institution: 'DTU',
    period: '2020 – 2023',
  },
]

export const projects: Project[] = [
  {
    id: 'audio-test',
    title: 'Automated Audio Test Setup',
    shortDescription: 'Fully automated test system for class D audio amplifiers.',
    tags: ['Python', 'Robot Framework', 'APx', 'Test Automation'],
    detail: 'Fully automated audio test setup mainly written in Python, used for production and R&D testing of class D amplifiers at Pascal A/S.',
    type: 'professional',
  },
  {
    id: 'pcb-gpio',
    title: 'GPIO Test PCB',
    shortDescription: 'PCB design for automated GPIO testing circuit.',
    tags: ['KiCAD', 'PCB Design', 'Hardware'],
    detail: 'Designed a custom PCB for automated GPIO functional testing, integrating with the Python test framework.',
    type: 'professional',
  },
  {
    id: 'openroad',
    title: 'Autonomous Digital Integration (OpenROAD)',
    shortDescription: 'Autonomous integration of digital blocks using OpenROAD Flow Scripts.',
    tags: ['Cadence', 'ORFS', 'IC Design', 'PDK'],
    detail: 'Autonomous integration of digital blocks in Cadence using OpenROAD Flow Scripts with a closed PDK for DTU.',
    type: 'professional',
  },
  {
    id: 'skill-gui',
    title: 'SKILL GUI for Virtuoso',
    shortDescription: 'Frontend SKILL GUI for Cadence Virtuoso.',
    tags: ['SKILL', 'Cadence', 'Virtuoso'],
    detail: 'Built a frontend GUI using the SKILL scripting language inside Cadence Virtuoso to streamline IC design workflows at IC Optimize.',
    type: 'professional',
  },
  {
    id: 'result-viewer',
    title: 'Result Viewer – IC Optimize OPUS',
    shortDescription: 'Application for viewing IC simulation results.',
    tags: ['Software', 'IC Design', 'Tooling'],
    detail: 'Result viewer application for IC Optimize OPUS, enabling engineers to visualize and compare simulation outputs efficiently.',
    type: 'professional',
  },
  {
    id: 'liquid-container',
    title: 'Automated Liquid Container',
    shortDescription: 'Embedded system with DC motors, sensors, and timer.',
    tags: ['Embedded', 'C', 'Sensors', 'DC Motors'],
    detail: 'Automated liquid container with DC motors, internal timer, sensors, and a trigger mechanism. Built as a personal embedded systems project.',
    type: 'personal',
  },
  {
    id: 'engagement-circuit',
    title: 'Engagement Feedback Circuit',
    shortDescription: 'LCD display circuit with cloud control.',
    tags: ['Embedded', 'IoT', 'LCD', 'Cloud'],
    detail: 'Engagement feedback circuit with LCD display and cloud control interface.',
    type: 'personal',
  },
  {
    id: 'thesis',
    title: 'Bachelor Thesis: Loudspeaker Protection',
    shortDescription: 'Dynamic DSP filters for loudspeaker protection.',
    tags: ['DSP', 'MATLAB', 'Audio', 'Thesis'],
    detail: '"Protection Algorithms for Loudspeakers": Investigation of dynamic filters for mechanical and thermal protection of loudspeakers using DSP.',
    type: 'personal',
  },
]

export const skills: Skills = {
  'Embedded & Hardware': ['Embedded Systems', 'PCB Design', 'FPGA', 'Circuit Analysis', 'Analog IC Design'],
  'Software & Tools': ['Python', 'C', 'C++', 'MATLAB', 'Robot Framework', 'Test Automation'],
  'EDA & CAD': ['Cadence', 'KiCAD', 'LTSpice', 'Xilinx Vivado', 'Quartus', 'ORFS', 'APx', 'OMNeT++'],
}
