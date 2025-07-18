export default {
  common: {
    search: 'SEARCH',
    deleteConfirmTitle: 'Delete Confirmation',
    deleteConfirmText:
      'Are you sure to delete? # This action cannot be undone.',
    deleteBtnCancelText: 'cancel',
    deleteBtnText: 'delete',
    noDataText: 'No data available',
    submit: 'Submit',
    pagination: {
      range: 'showing {start} - {end} of {total} records',
    },
  },
  sidebar: {
    dashboard: 'dashboard',
    employeelists: 'employee lists',
    leaverecords: 'leave records',
    reporting: 'reporting',
    adminsetting: 'admin setting',
    reports: 'reports',
    weeklyworktime: 'weekly work time',
    employeereports: 'employee report',
    projectmenpower: 'project menpower',
    sixmonthssummary: '6 months summary',
    newproject: 'new project',
    newemployee: 'new employee',
    newemployeeleave: 'new employee leave',
    newfinerecord: 'new fine record',
    newemployeecard: 'new employee card',
    newemployeeskills: 'new employee skills',
    employeecompetency: 'employee competency',
    theme: 'Theme',
    show_project: 'Show Project'
  },
  message: {
    error404Text: 'We apologize,',
    error404Text2: 'the page you are looking for could not be found.',
    backhome: 'Go Home',
  },
  login: {
    username: 'Username',
    password: 'Password',
  },
  memberList: {
    title: 'Employee Lists',
    table: {
      name: 'Name',
      position: 'Position',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      action: 'Action',
    },
    deleteConfirmText:
      'Are you sure to delete this member? # This action cannot be undone.',
  },
  addProject: {
    title1: 'Project Registration',
    title2: 'Project Lists',
    table: {
      code: 'Code',
      name: 'Name',
      action: 'Action',
    },
    pagination: {
      range: 'showing {start} - {end} of {total} records',
    },
    deleteConfirmText:
      'Are you sure to delete this member? # This action cannot be undone.',
    form: {
      code: 'Code',
      eng_name: 'English Name',
      jp_name: 'Japanese Name',
    },
    deleteConfirmText:
      'Are you sure to delete this project? # This action cannot be undone.',
  },
  addMember: {
    title: 'Employee Registration',
    form: {
      eng_name: 'English Name',
      jp_name: 'Japanese Name',
      username: 'Username',
      password: 'Password',
      staff_no: 'Staff ID',
      address: 'Address',
      ph_number: 'Phone Number',
      position: 'Position',
      role: 'Role',
      email: 'Email',
      permanent_date: 'Permanent Date',
      ref_person: 'Reference Person',
      ref_ph_number: 'Reference Phone',
      project: 'Project',
      sort_key: 'Sort Key',
    },
  },
  addMemberSkill: {
    title: 'Employee Competency Form',
    form: {
      name: 'Name',
      role: 'Role',
      team: 'Team',
      permanent_date: 'Permanent Date',
      japanese_level: 'Japanese Level',
      experience: 'Experience',
    },
  },
  validation: {
    required: '{field} is required',
    username_mismatch: 'Username does not match',
    password_mismatch: 'Password does not match',
    email: '{field} must be a valid email',
    jp_character: '{field} must contain only Japanese characters',
    eng_char_num: '{field} must contain only English characters and numbers',
    min: '{field} must be at least {min} characters',
    max: '{field} must be no more than {max} characters',
    date_format: '{field} must be in YYYY-MM-DD format',
    unique: '{field} already exists',
  },
  showProject: {
    title: 'Work performance management',
    end_date: 'End Date',
    week_date: 'Week Date',
    table: {
      user_id: 'UserId',
      user_name: 'User Name',
      total_working_hour: 'Total Working Hour',
    },
  }
};
