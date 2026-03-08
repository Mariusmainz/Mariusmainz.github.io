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
  description?: string
  images?: { src: string; caption?: string }[]
}

export interface ProjectMedia {
  type: 'image' | 'pdf' | 'press'
  src: string
  caption?: string
  label?: string
}

export interface Project {
  id: string
  title: string
  shortDescription: string
  tags: string[]
  detail: string
  type: 'professional' | 'personal' | 'academic'
  media?: ProjectMedia[]
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
    description: 'Specializing in IC design at DTU Electro. Coursework covers analog/digital IC design, VLSI, and semiconductor physics.',
  },
  {
    id: 'hkust',
    degree: 'Study Exchange',
    field: 'IC Design Engineering',
    institution: 'HKUST',
    period: 'Sep 2025 – Dec 2025',
    description: 'Exchange semester at Hong Kong University of Science and Technology, focusing on IC design engineering. Courses: CMOS VLSI Design, Semiconductor Devices for Integrated Circuit Design, Business for Electronic Engineers.',
    images: [
      { src: '/Resources/hk1.jpg' },
      { src: '/Resources/hk2.jpg' },
      { src: '/Resources/hk3.jpg' },
      { src: '/Resources/hk4.jpg' },
    ],
  },
  {
    id: 'dtu-bsc',
    degree: "Bachelor's Degree",
    field: 'Electrical Engineering',
    institution: 'DTU',
    period: '2020 – 2023',
    description: 'Core electrical engineering curriculum: circuit theory, signals, embedded systems, and electronics.',
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
    tags: ['Altium Designer', 'PCB Design', 'Hardware'],
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
    tags: ['Go', 'Vue', 'Wails', 'IC Design', 'Tooling'],
    detail: 'Result viewer application for IC Optimize OPUS built with Wails — combining a Go backend with a Vue frontend. Enables engineers to visualize and compare simulation outputs efficiently.',
    type: 'professional',
    media: [
      { type: 'image', src: '/Resources/projects/result-viewer-screenshot.png', caption: 'Result Viewer application' },
    ],
  },
  {
    id: 'liquid-container',
    title: 'Automated Liquid Container (Beer Bong)',
    shortDescription: 'Automated liquid dispenser with DC motors, sensors, and internal timer.',
    tags: ['Embedded', 'C', 'DC Motors', 'Sensors', '3D Printing'],
    detail: 'Ølbong is an automated liquid dispenser built from scratch — designed, assembled, and programmed as a personal embedded systems project. It uses DC motors, a custom trigger mechanism, internal timer logic, and multiple sensors to automate dispensing. Featured in Politiken.',
    type: 'personal',
    media: [
      { type: 'image', src: '/Resources/projects/olbong-render.png', caption: '3D render of the final design' },
      { type: 'image', src: '/Resources/projects/olbong-workspace.jpg', caption: 'Assembly workspace' },
      { type: 'press', src: '/Resources/projects/olbong-politiken.jpg', caption: 'Featured in Politiken' },
    ],
  },
  {
    id: 'engagement-circuit',
    title: 'Companio',
    shortDescription: 'Smart engagement feedback device with LCD display and cloud control.',
    tags: ['Embedded', 'IoT', 'LCD', 'Cloud', 'Product Design'],
    detail: 'Companio is a personal project exploring real-time engagement feedback through a hardware device with an LCD display and cloud-connected control interface. Includes a working prototype and a product application concept.',
    type: 'personal',
    media: [
      { type: 'image', src: '/Resources/projects/companio-prototype.png', caption: 'Prototype v2' },
      { type: 'pdf', src: '/Resources/projects/companio-application.pdf', label: 'View Application' },
    ],
  },
  {
    id: 'thesis',
    title: 'Bachelor Thesis: Loudspeaker Protection',
    shortDescription: 'Dynamic DSP filters for loudspeaker protection.',
    tags: ['DSP', 'MATLAB', 'Audio', 'Thesis'],
    detail: '"Protection Algorithms for Loudspeakers": Investigation of dynamic filters for mechanical and thermal protection of loudspeakers using DSP. Submitted as part of the BSc in Electrical Engineering at DTU.\n\nAbstract: This paper investigates a method for protecting a loudspeaker in an enclosure from thermal damage and mechanical excursion limits, that could cause harmonic distortion from nonlinearities or even mechanical damage, using an algorithm based on digital signal processing. Thermal protection is only briefly covered in this paper due to resource constraints, while mechanical protection is investigated in further depth. The algorithm is a feedforward system based on a linear loudspeaker model that neglects losses from the inductor. Measurements of the output voltage of an audio amplifier show that, with the algorithm implemented, the output voltage is limited with the expected characteristics but slightly underdamped. Other measurements of a loudspeaker show that the amount of total harmonic distortion is reduced in exposed frequency bands when applying the algorithm. In order to obtain a desired response, different tuning of parameters within the algorithm is discussed as well as the advantages and limitations of the algorithm.',
    type: 'academic',
    media: [
      { type: 'pdf', src: '/Resources/projects/loudspeaker-protection.pdf', label: 'Read Thesis' },
    ],
  },
  {
    id: 'drone',
    title: 'Autonomous Drone Navigation',
    shortDescription: 'Designed and built a self-stabilizing quadcopter from scratch — PCB, firmware, and CAD.',
    tags: ['Embedded', 'PCB Design', 'MATLAB', 'Control Systems', 'CAD'],
    detail: 'Designed and built a fully functioning quadcopter UAV from the ground up. Developed a custom PCB built around a Teensy 4.0 MCU and MPU9250 IMU, controlling four brushless motors via ESCs. Implemented the open-source dRehmFlight firmware for PID-based roll, pitch, and yaw stabilization. Modelled and simulated the system in MATLAB/Simscape to tune the controllers. The frame was parametrically CAD-modelled and 3D-printed in carbon fiber-infused PETG, resulting in a 1.25 kg platform with 3.5 kg of total motor thrust.',
    type: 'academic',
    media: [
      { type: 'pdf', src: '/Resources/projects/drone-poster.pdf', label: 'View Poster' },
    ],
  },
  {
    id: 'sorting-machine',
    title: 'Automated Sorting Machine',
    shortDescription: 'DTU group project: automated object sorting system.',
    tags: ['Embedded', 'Mechanical', 'DTU', 'Automation'],
    detail: 'Group project at DTU designing and building an automated sorting machine. Covers mechanical design, embedded control, and systems integration.',
    type: 'academic',
    media: [
      { type: 'pdf', src: '/Resources/projects/sorting-machine.pdf', label: 'View Report' },
    ],
  },
]

export const skills: Skills = {
  'Embedded & Hardware': ['Embedded Systems', 'PCB Design', 'FPGA', 'Circuit Analysis', 'Analog IC Design'],
  'Software & Tools': ['Python', 'C', 'C++', 'MATLAB', 'Robot Framework', 'Test Automation'],
  'EDA & CAD': ['Cadence', 'KiCAD', 'LTSpice', 'Xilinx Vivado', 'Quartus', 'ORFS', 'APx', 'OMNeT++'],
}
