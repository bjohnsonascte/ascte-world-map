export interface School {
  name: string;
  shortName: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  studentCount: number;
  logoUrl: string;
}

export const schoolData: School[] = [
  // --- United Kingdom ---
  {
    name: "University of Oxford",
    shortName: "Oxford",
    country: "United Kingdom",
    coordinates: [-1.2577, 51.7520],
    studentCount: 5,
    logoUrl: "/logos/oxford.png",
  },
  {
    name: "University of Cambridge",
    shortName: "Cambridge",
    country: "United Kingdom",
    coordinates: [0.1218, 52.2053],
    studentCount: 4,
    logoUrl: "/logos/cambridge.png",
  },
  {
    name: "Imperial College London",
    shortName: "Imperial",
    country: "United Kingdom",
    coordinates: [-0.1749, 51.4988],
    studentCount: 3,
    logoUrl: "/logos/imperial.png",
  },
  // --- Germany ---
  {
    name: "Technical University of Munich",
    shortName: "TU Munich",
    country: "Germany",
    coordinates: [11.5680, 48.1351],
    studentCount: 4,
    logoUrl: "/logos/tumunich.png",
  },
  {
    name: "Heidelberg University",
    shortName: "Heidelberg",
    country: "Germany",
    coordinates: [8.7065, 49.3988],
    studentCount: 2,
    logoUrl: "/logos/heidelberg.png",
  },
  // --- France ---
  {
    name: "Sorbonne University",
    shortName: "Sorbonne",
    country: "France",
    coordinates: [2.3428, 48.8489],
    studentCount: 3,
    logoUrl: "/logos/sorbonne.png",
  },
  // --- Switzerland ---
  {
    name: "ETH Zurich",
    shortName: "ETH Zurich",
    country: "Switzerland",
    coordinates: [8.5482, 47.3769],
    studentCount: 3,
    logoUrl: "/logos/ethzurich.png",
  },
  // --- Canada ---
  {
    name: "University of Toronto",
    shortName: "U of T",
    country: "Canada",
    coordinates: [-79.3957, 43.6629],
    studentCount: 6,
    logoUrl: "/logos/toronto.png",
  },
  {
    name: "McGill University",
    shortName: "McGill",
    country: "Canada",
    coordinates: [-73.5772, 45.5048],
    studentCount: 3,
    logoUrl: "/logos/mcgill.png",
  },
  {
    name: "University of British Columbia",
    shortName: "UBC",
    country: "Canada",
    coordinates: [-123.2460, 49.2606],
    studentCount: 2,
    logoUrl: "/logos/ubc.png",
  },
  // --- Japan ---
  {
    name: "University of Tokyo",
    shortName: "U of Tokyo",
    country: "Japan",
    coordinates: [139.7622, 35.7126],
    studentCount: 4,
    logoUrl: "/logos/utokyo.png",
  },
  {
    name: "Kyoto University",
    shortName: "Kyoto",
    country: "Japan",
    coordinates: [135.7807, 35.0268],
    studentCount: 2,
    logoUrl: "/logos/kyoto.png",
  },
  // --- Australia ---
  {
    name: "University of Melbourne",
    shortName: "Melbourne",
    country: "Australia",
    coordinates: [144.9612, -37.7983],
    studentCount: 3,
    logoUrl: "/logos/melbourne.png",
  },
  {
    name: "University of Sydney",
    shortName: "Sydney",
    country: "Australia",
    coordinates: [151.1900, -33.8886],
    studentCount: 2,
    logoUrl: "/logos/sydney.png",
  },
  // --- South Korea ---
  {
    name: "Seoul National University",
    shortName: "SNU",
    country: "South Korea",
    coordinates: [126.9522, 37.4601],
    studentCount: 3,
    logoUrl: "/logos/snu.png",
  },
  {
    name: "KAIST",
    shortName: "KAIST",
    country: "South Korea",
    coordinates: [127.3595, 36.3721],
    studentCount: 2,
    logoUrl: "/logos/kaist.png",
  },
  // --- Singapore ---
  {
    name: "National University of Singapore",
    shortName: "NUS",
    country: "Singapore",
    coordinates: [103.7764, 1.2966],
    studentCount: 3,
    logoUrl: "/logos/nus.png",
  },
  // --- China ---
  {
    name: "Tsinghua University",
    shortName: "Tsinghua",
    country: "China",
    coordinates: [116.3266, 39.9998],
    studentCount: 4,
    logoUrl: "/logos/tsinghua.png",
  },
  {
    name: "Peking University",
    shortName: "Peking",
    country: "China",
    coordinates: [116.3104, 39.9929],
    studentCount: 2,
    logoUrl: "/logos/peking.png",
  },
  // --- India ---
  {
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    country: "India",
    coordinates: [72.9159, 19.1334],
    studentCount: 3,
    logoUrl: "/logos/iitbombay.png",
  },
  // --- Brazil ---
  {
    name: "University of São Paulo",
    shortName: "USP",
    country: "Brazil",
    coordinates: [-46.7298, -23.5590],
    studentCount: 2,
    logoUrl: "/logos/usp.png",
  },
  // --- Mexico ---
  {
    name: "UNAM",
    shortName: "UNAM",
    country: "Mexico",
    coordinates: [-99.1870, 19.3262],
    studentCount: 2,
    logoUrl: "/logos/unam.png",
  },
  // --- Netherlands ---
  {
    name: "Delft University of Technology",
    shortName: "TU Delft",
    country: "Netherlands",
    coordinates: [4.3736, 52.0021],
    studentCount: 2,
    logoUrl: "/logos/tudelft.png",
  },
  // --- Sweden ---
  {
    name: "KTH Royal Institute of Technology",
    shortName: "KTH",
    country: "Sweden",
    coordinates: [18.0686, 59.3293],
    studentCount: 2,
    logoUrl: "/logos/kth.png",
  },
  // --- Israel ---
  {
    name: "Technion – Israel Institute of Technology",
    shortName: "Technion",
    country: "Israel",
    coordinates: [35.0254, 32.7768],
    studentCount: 2,
    logoUrl: "/logos/technion.png",
  },
  // --- South Africa ---
  {
    name: "University of Cape Town",
    shortName: "UCT",
    country: "South Africa",
    coordinates: [18.4610, -33.9577],
    studentCount: 2,
    logoUrl: "/logos/uct.png",
  },
  // --- United Arab Emirates ---
  {
    name: "Khalifa University",
    shortName: "Khalifa",
    country: "United Arab Emirates",
    coordinates: [54.4349, 24.4539],
    studentCount: 2,
    logoUrl: "/logos/khalifa.png",
  },
  // --- Italy ---
  {
    name: "Politecnico di Milano",
    shortName: "PoliMi",
    country: "Italy",
    coordinates: [9.2270, 45.4787],
    studentCount: 2,
    logoUrl: "/logos/polimi.png",
  },
];

export function getTotalSchoolCount(): number {
  return schoolData.length;
}
