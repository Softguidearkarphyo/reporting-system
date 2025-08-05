import { ref } from 'vue';
export const position = ref([
  {
    id: 1,
    name: 'CEO',
    color: '#ffb600',
  },
  {
    id: 2,
    name: 'Assistant Manager',
    color: '#119da4',
  },
  {
    id: 3,
    name: 'Senior Developer',
    color: '#003b36',
  },
  {
    id: 4,
    name: 'PYTHON Developer',
    color: '#38040e',
  },
  {
    id: 5,
    name: 'PHP Developer',
    color: '#0466c8',
  },
  {
    id: 6,
    name: 'Junior PHP Developer',
    color: '#fe7f2d',
  },
  {
    id: 7,
    name: 'Junior Developer',
    color: '#941b0c',
  },
  {
    id: 8,
    name: 'Senior PHP Developer',
    color: '#4e148c',
  },
  {
    id: 9,
    name: 'Senior Ruby Developer',
    color: '#a4133c',
  },
  {
    id: 10,
    name: 'Senior JAVA Developer',
    color: '#02c39a',
  },
]);
export const role = ref([
  {
    id: 1,
    name: 'admin',
  },
  {
    id: 2,
    name: 'user',
  },
]);
export const sortKey = ref([
  {
    id: 1,
    value: 1,
  },
  {
    id: 2,
    value: 2,
  },
  {
    id: 3,
    value: 3,
  },
  {
    id: 4,
    value: 4,
  },
]);
export const project = ref([
  {
    id: 1,
    name: 'Mirai',
  },
  {
    id: 2,
    name: 'Kenja',
  },
  {
    id: 3,
    name: 'Jabee',
  },
]);
export const week_date = ref([
  { id: 1, name: 'one_week' },
  { id: 2, name: 'two_week' },
  { id: 3, name: 'three_week' },
  { id: 4, name: 'four_week' },
]);

export const dedicatedPosition = ref([
  {
    id: 1,
    value: 'PM',
  },
  {
    id: 2,
    value: 'SE',
  },
  {
    id: 3,
    value: '研修',
  },
]);

export const grade = ref([
  {
    id: 1,
    value: 'A+',
  },
  {
    id: 2,
    value: 'A',
  },
  {
    id: 3,
    value: 'B',
  },
]);

export const responsibility = ref([
  {
    id: 1,
    value: '実装',
  },
  {
    id: 2,
    value: '設計',
  },
]);

export const japaneseLevel = ref([
  {
    id: 1,
    value: 'N1',
  },
  {
    id: 2,
    value: 'N2',
  },
  {
    id: 3,
    value: 'N3',
  },
  {
    id: 4,
    value: 'N5',
  },
  {
    id: 5,
    value: 'N5',
  },
]);

export const symbols = ['-', 'O', '△', '×', 'C', 'CO', '×', 'C', 'CO'];

export const skillList = [
  'JAVA',
  'C#',
  'PHP',
  'C++',
  'ASP.Net',
  'Access',
  'RoR',
  'ColdFusion',
  'VB6',
  'HTML5',
  'JavaScript',
  'Laravel',
  'jquery',
  'bootstrap',
  'Python',
  'Angular',
  'Vue',
  'Nuxt',
  'React',
  'Next',
  'Redis',
  'AWS S3',
  'Postgres',
  'DB2',
  'mySQL',
  'Oracle',
];
export const periods = ref([
  {
    id: 1,
    name: '8:30 ~ 12:00',
    startTime: '8:30',
    finishTime: '12:00',
  },
  {
    id: 2,
    name: '1:00 ~ 5:30',
    startTime: '1:00',
    finishTime: '5:30',
  },
]);

export const lateTimes = ref([
  {
    id: 1,
    name: '8:30 ~ 9:00',
    value: '1',
  },
  {
    id: 2,
    name: '9:01 ~ 10:00',
    value: '2',
  },
  {
    id: 3,
    name: '10:01 ~ 10:30',
    value: '2',
  },
]);
export const timeSlots = ref([
  { id: 1, name: '08:30' },
  { id: 2, name: '09:00' },
  { id: 3, name: '09:30' },
  { id: 4, name: '10:00' },
  { id: 5, name: '10:30' },
  { id: 6, name: '11:00' },
  { id: 7, name: '11:30' },
  { id: 8, name: '12:00' },
  { id: 9, name: '12:30' },
  { id: 10, name: '13:00' },
  { id: 11, name: '13:30' },
  { id: 12, name: '14:00' },
  { id: 13, name: '14:30' },
  { id: 14, name: '15:00' },
  { id: 15, name: '15:30' },
  { id: 16, name: '16:00' },
  { id: 17, name: '16:30' },
  { id: 18, name: '17:00' },
  { id: 19, name: '17:30' },
  { id: 20, name: '18:00' },
  { id: 21, name: '18:30' },
  { id: 22, name: '19:00' },
  { id: 23, name: '19:30' },
  { id: 24, name: '20:00' },
  { id: 25, name: '20:30' },
  { id: 26, name: '21:00' },
  { id: 27, name: '21:30' },
  { id: 28, name: '22:00' },
  { id: 29, name: '22:30' },
  { id: 30, name: '23:00' },
  { id: 31, name: '23:30' },
  { id: 32, name: '24:00' },
]);
