import { generateUUID } from './generateUUID';
import { DepartmentDTO } from '../models/department';
import { EmployeeDTO } from '../models/employee';
import { CarbonTransactionDTO, EmissionFactorDTO, EnvironmentalGoalDTO } from '../models/carbon';
import { CSRActivityDTO, CSRParticipationDTO } from '../models/csr';
import { ChallengeDTO, ChallengeParticipationDTO } from '../models/challenge';
import { BadgeDTO, RewardDTO } from '../models/gamification';
import { PolicyDTO, AuditDTO, ComplianceIssueDTO } from '../models/governance';
import { NotificationDTO } from '../models/notification';
import { SettingsDTO } from '../models/settings';

export interface MockDatabase {
  departments: DepartmentDTO[];
  employees: EmployeeDTO[];
  emissionFactors: EmissionFactorDTO[];
  environmentalGoals: EnvironmentalGoalDTO[];
  carbonTransactions: CarbonTransactionDTO[];
  csrActivities: CSRActivityDTO[];
  csrParticipations: CSRParticipationDTO[];
  challenges: ChallengeDTO[];
  challengeParticipations: ChallengeParticipationDTO[];
  policies: PolicyDTO[];
  audits: AuditDTO[];
  complianceIssues: ComplianceIssueDTO[];
  badges: BadgeDTO[];
  rewards: RewardDTO[];
  notifications: NotificationDTO[];
  settings: SettingsDTO;
}

export const seedMockDatabase = (): MockDatabase => {
  const now = new Date();

  // 1. Settings (1)
  const settings: SettingsDTO = {
    env_weight: 0.40,
    social_weight: 0.30,
    gov_weight: 0.30,
    auto_calculate_emissions: true,
    evidence_required: true,
    badge_auto_award: true,
    email_notifications: true,
    in_app_notifications: true,
  };

  // 2. Departments (8)
  const deptNames = [
    { name: 'Engineering', code: 'ENG' },
    { name: 'Human Resources', code: 'HR' },
    { name: 'Legal & Compliance', code: 'LEG' },
    { name: 'Operations & Logistics', code: 'OPS' },
    { name: 'Sales & Marketing', code: 'MKT' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Facilities & Real Estate', code: 'FAC' },
    { name: 'Product Management', code: 'PRD' },
  ];

  const departments: DepartmentDTO[] = deptNames.map((d) => ({
    id: generateUUID(),
    name: d.name,
    code: d.code,
    head_id: null,
    head_name: null,
    parent_department_id: null,
    employee_count: 0,
    status: 'active',
  }));

  // 3. Employees (30)
  const employeeNames = [
    { name: 'Sarah Jenkins', role: 'admin' },
    { name: 'Alex Rivera', role: 'employee' },
    { name: 'Elena Rostova', role: 'auditor' },
    { name: 'Marcus Vance', role: 'employee' },
    { name: 'Diana Prince', role: 'admin' },
    { name: 'Kenji Sato', role: 'employee' },
    { name: 'Clara Oswald', role: 'employee' },
    { name: 'David Tennant', role: 'employee' },
    { name: 'Aisha Rahman', role: 'employee' },
    { name: 'John Doe', role: 'employee' },
    { name: 'Jane Smith', role: 'employee' },
    { name: 'Robert Chen', role: 'employee' },
    { name: 'Emily Watson', role: 'employee' },
    { name: 'Michael Scott', role: 'employee' },
    { name: 'Pam Beesly', role: 'employee' },
    { name: 'Jim Halpert', role: 'employee' },
    { name: 'Dwight Schrute', role: 'employee' },
    { name: 'Angela Martin', role: 'employee' },
    { name: 'Oscar Martinez', role: 'auditor' },
    { name: 'Kevin Malone', role: 'employee' },
    { name: 'Toby Flenderson', role: 'employee' },
    { name: 'Kelly Kapoor', role: 'employee' },
    { name: 'Ryan Howard', role: 'employee' },
    { name: 'Stanley Hudson', role: 'employee' },
    { name: 'Phyllis Vance', role: 'employee' },
    { name: 'Creed Bratton', role: 'employee' },
    { name: 'Meredith Palmer', role: 'employee' },
    { name: 'Andy Bernard', role: 'employee' },
    { name: 'Erin Hannon', role: 'employee' },
    { name: 'Darryl Philbin', role: 'employee' },
  ] as const;

  const employees: EmployeeDTO[] = employeeNames.map((e, idx) => {
    const deptIdx = idx % departments.length;
    departments[deptIdx].employee_count += 1;
    return {
      id: generateUUID(),
      name: e.name,
      email: `${e.name.toLowerCase().replace(' ', '.')}@ecosphere.com`,
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?auto=format&fit=crop&w=100&h=100`,
      department_id: departments[deptIdx].id,
      xp: 500 + idx * 250,
      points: 100 + idx * 50,
      rank: 0, // calculated later
      role: e.role,
    };
  });

  // Calculate and assign Rank based on XP descending
  const sortedByXp = [...employees].sort((a, b) => b.xp - a.xp);
  employees.forEach((emp) => {
    emp.rank = sortedByXp.findIndex((s) => s.id === emp.id) + 1;
  });

  // Assign department heads (first employee in each department)
  departments.forEach((dept) => {
    const head = employees.find((emp) => emp.department_id === dept.id);
    if (head) {
      dept.head_id = head.id;
      dept.head_name = head.name;
    }
  });

  // 4. Emission Factors (15)
  const factorsData = [
    { name: 'Grid Electricity', factor: 0.385, unit: 'kWh' },
    { name: 'Natural Gas (Heating)', factor: 2.056, unit: 'therm' },
    { name: 'Diesel (Mobile)', factor: 10.18, unit: 'gallon' },
    { name: 'Gasoline (Mobile)', factor: 8.89, unit: 'gallon' },
    { name: 'Water Supply', factor: 0.0003, unit: 'gallon' },
    { name: 'Landfill Waste', factor: 0.42, unit: 'pound' },
    { name: 'Recycled Waste Offset', factor: -0.15, unit: 'pound' },
    { name: 'Short-Haul Air Flight', factor: 0.24, unit: 'passenger-mile' },
    { name: 'Long-Haul Air Flight', factor: 0.18, unit: 'passenger-mile' },
    { name: 'Train Travel', factor: 0.08, unit: 'passenger-mile' },
    { name: 'Heavy Duty Diesel Trucking', factor: 1.62, unit: 'mile' },
    { name: 'Office Paper Consumption', factor: 0.005, unit: 'page' },
    { name: 'Data Center Hosting (Cloud)', factor: 0.0005, unit: 'GB' },
    { name: 'Employee Commuting (Avg)', factor: 0.35, unit: 'mile' },
    { name: 'District Steam Heating', factor: 0.065, unit: 'lbs' },
  ];

  const emissionFactors: EmissionFactorDTO[] = factorsData.map((f) => ({
    id: generateUUID(),
    name: f.name,
    factor: f.factor,
    unit: f.unit,
    status: 'active',
  }));

  // 5. Environmental Goals (8)
  const environmentalGoals: EnvironmentalGoalDTO[] = [
    { id: generateUUID(), name: 'Reduce Scope 1 Fleet Diesel', category: 'Emissions', target_value: 10000, current_value: 11450, unit: 'kg CO2e', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
    { id: generateUUID(), name: 'Cut Office Paper Consumption', category: 'Resource Usage', target_value: 2000, current_value: 1200, unit: 'pages', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
    { id: generateUUID(), name: 'Zero Plastic Reforestation Target', category: 'Ecosystem', target_value: 500, current_value: 500, unit: 'trees', start_date: '2026-01-01T00:00:00Z', target_date: '2026-06-30T23:59:59Z', status: 'achieved' },
    { id: generateUUID(), name: 'Reduce Scope 2 Grid Consumption', category: 'Electricity', target_value: 50000, current_value: 46200, unit: 'kWh', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
    { id: generateUUID(), name: 'Reduce Waste-to-Landfill Weight', category: 'Waste Management', target_value: 12000, current_value: 14500, unit: 'lbs', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'failed' },
    { id: generateUUID(), name: 'Increase Rainwater Recycling Cap', category: 'Water Savings', target_value: 8000, current_value: 5400, unit: 'gallons', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
    { id: generateUUID(), name: 'Scope 3 Business Flight Reduction', category: 'Travel', target_value: 15000, current_value: 12050, unit: 'kg CO2e', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
    { id: generateUUID(), name: 'Data Center Green Energy Shift', category: 'Hosting', target_value: 100, current_value: 80, unit: '%', start_date: '2026-01-01T00:00:00Z', target_date: '2026-12-31T23:59:59Z', status: 'in-progress' },
  ];

  // 6. Carbon Transactions (75)
  const carbonTransactions: CarbonTransactionDTO[] = [];
  const sources = ['purchase', 'manufacturing', 'expense', 'fleet'] as const;
  for (let i = 0; i < 75; i++) {
    const date = new Date(now.getTime() - i * 2.5 * 24 * 60 * 60 * 1000); // spread over past 6 months
    const source = sources[i % sources.length];
    const dept = departments[i % departments.length];
    const factor = emissionFactors[i % emissionFactors.length];
    const val = 100 + (i * 12.5) % 800;
    const calc = val * factor.factor;

    carbonTransactions.push({
      id: generateUUID(),
      date: date.toISOString(),
      source,
      activity_value: Number(val.toFixed(1)),
      unit: factor.unit,
      calculated_emissions: Number(Math.abs(calc).toFixed(2)),
      department_id: dept.id,
      recorded_by: employees[i % employees.length].id,
      emission_factor: factor,
    });
  }

  // 7. CSR Activities (20)
  const csrNames = [
    'Urban Reforestation Day', 'Beach Litter Cleanup', 'Community Blood Drive',
    'Clothing Recycling Drive', 'Tech Reconditioning Workshop', 'E-Waste Recycling Drop',
    'Food Bank Volunteering', 'Youth Green Mentorship', 'Solar Panel Cleaning Volunteer',
    'Water Conservation Seminar', 'Local Park Restoration', 'Shelter Dog Walk Marathon',
    'Cycle-to-work Promotion Drive', 'Home Weatherization Project', 'Elderly Tech-literacy Day',
    'Organic Kitchen Garden Setup', 'School Tree Plant Drive', 'Wildlife Center Cleanup',
    'Office Energy Audit Audit', 'Eco-friendly Packaging Workshop'
  ];

  const csrActivities: CSRActivityDTO[] = csrNames.map((name, idx) => ({
    id: generateUUID(),
    title: name,
    description: `Volunteering event focused on supporting sustainability and community care through corporate sponsored actions for ${name}.`,
    category_id: idx % 2 === 0 ? 'cat-csr-env' : 'cat-csr-social',
    category_name: idx % 2 === 0 ? 'Environmental Care' : 'Social Inclusion',
    date: new Date(now.getTime() + (idx - 10) * 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: idx < 10 ? 'completed' : idx === 10 ? 'ongoing' : 'upcoming',
    target_participants: 20 + (idx * 5) % 30,
    current_participants: 0, // loaded on participations count
    points_awarded: 100 + (idx * 25) % 150,
  }));

  // 8. CSR Participations (50)
  const csrParticipations: CSRParticipationDTO[] = [];
  for (let i = 0; i < 50; i++) {
    const activity = csrActivities[i % csrActivities.length];
    const employee = employees[i % employees.length];
    const status = i % 4 === 0 ? 'pending' : i % 5 === 0 ? 'rejected' : 'approved';
    
    if (status === 'approved') {
      activity.current_participants += 1;
    }

    csrParticipations.push({
      id: generateUUID(),
      activity_id: activity.id,
      employee_id: employee.id,
      proof_url: status !== 'pending' ? `https://storage.ecosphere.com/proofs/proof-csr-${i}.jpg` : null,
      status,
      completion_date: status === 'approved' ? new Date(now.getTime() - i * 12 * 60 * 60 * 1000).toISOString() : null,
      points_earned: status === 'approved' ? activity.points_awarded : 0,
    });
  }

  // 9. Challenges (20)
  const challengeNames = [
    'Zero Single-use Plastic Week', 'Cycle or Walk to Work Challenge', 'Paperless Office Log',
    'Off-Peak Energy Consumption Shift', 'Meatless Monday Challenge', 'Digital Cleanup (Inbox Purge)',
    '10,000 Daily Steps Log', 'Thermostat Dial Down Campaign', 'LED Office Upgrade Signups',
    'Carpool Share Registry', 'Reusable Water Bottle Week', 'Bring Your Own Bag (BYOB) Drive',
    'Stair Climber Week (Skip Lift)', 'Local Reforestation Enrollment', 'Green Vendor Assessment Log',
    'Unplug Chargers Weekend', 'Cold Water Laundry Challenge', 'Donate Unused Books Drive',
    'Eco-conscious Commute Tracking', 'Recycling Champion Audit'
  ];

  const challenges: ChallengeDTO[] = challengeNames.map((name, idx) => ({
    id: generateUUID(),
    title: name,
    description: `A gamified sustainability campaign inviting employees to register and track personal logs for: ${name}.`,
    category_id: idx % 2 === 0 ? 'cat-chal-env' : 'cat-chal-social',
    xp: 200 + (idx * 50) % 300,
    difficulty: idx % 3 === 0 ? 'easy' : idx % 3 === 1 ? 'medium' : 'hard',
    evidence_required: idx % 2 === 0,
    deadline: new Date(now.getTime() + (idx - 8) * 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: idx < 5 ? 'completed' : idx < 15 ? 'active' : 'draft',
  }));

  // 10. Challenge Participations (60)
  const challengeParticipations: ChallengeParticipationDTO[] = [];
  for (let i = 0; i < 60; i++) {
    const challenge = challenges[i % challenges.length];
    const employee = employees[i % employees.length];
    const status = i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'rejected' : 'approved';
    const progress = status === 'approved' ? 100 : i % 3 === 0 ? 50 : 25;

    challengeParticipations.push({
      id: generateUUID(),
      challenge_id: challenge.id,
      employee_id: employee.id,
      progress,
      proof_url: challenge.evidence_required && progress === 100 ? `https://storage.ecosphere.com/proofs/proof-chal-${i}.jpg` : null,
      status,
      completion_date: progress === 100 && status === 'approved' ? new Date(now.getTime() - i * 18 * 60 * 60 * 1000).toISOString() : null,
      xp_awarded: progress === 100 && status === 'approved' ? challenge.xp : 0,
    });
  }

  // 11. Policies (12)
  const policyTitles = [
    'Anti-Bribery & Corruption Policy', 'Environmental Management Policy', 'Code of Business Conduct',
    'Whistleblower Protection Policy', 'Supplier Code of Conduct', 'Employee Data Privacy Directives',
    'Equal Opportunity & Diversity Policy', 'Occupational Health and Safety Guidelines', 'Information Security Standards',
    'Corporate Travel & Emissions Protocol', 'Waste Management Standard Operations', 'Human Rights & Fair Labor Policy'
  ];

  const policies: PolicyDTO[] = policyTitles.map((title, idx) => ({
    id: generateUUID(),
    title,
    code: `POL-ESG-${100 + idx}`,
    version: `${1 + (idx * 0.1).toFixed(1)}`,
    category: idx % 3 === 0 ? 'Environmental' : idx % 3 === 1 ? 'Social' : 'Governance',
    content: `This document outlines the standard directives, requirements, and compliance metrics expected under ${title}. All employees are required to acknowledge understanding.`,
    effective_date: new Date(now.getTime() - idx * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  }));

  // 12. Audits (15)
  const auditsData = [
    'Annual Greenhouse Gas Audit', 'ISO 14001 Pre-assessment', 'Water Safety Inspection Plant A',
    'Supplier Fair Trade Audit', 'Data Center PUE Validation', 'Occupational Safety Compliance',
    'Equal Pay Diversity Audit', 'Financial Integrity Review', 'Air Quality Inspection Office',
    'Hazardous Waste Storage Check', 'IT General Controls Audit', 'Supplier Supply Chain Integrity',
    'Anti-Money Laundering Review', 'Scope 3 Travel Ledger Valuation', 'E-Waste Recycling Facility Certification'
  ];

  const audits: AuditDTO[] = auditsData.map((title, idx) => ({
    id: generateUUID(),
    title,
    auditor: idx % 3 === 0 ? 'PricewaterhouseCoopers (PwC)' : idx % 3 === 1 ? 'Bureau Veritas' : 'Internal Audit Team',
    date: new Date(now.getTime() - idx * 10 * 24 * 60 * 60 * 1000).toISOString(),
    score: idx < 12 ? 80 + (idx * 3.5) % 20 : null,
    status: idx < 12 ? 'completed' : idx === 12 ? 'in-progress' : 'planned',
    scope: `Detailed verification of criteria associated with ${title}.`,
    findings: idx < 12 ? `All controls validated with ${idx % 3 === 0 ? 'no significant issues' : 'minor observations noted'}.` : null,
  }));

  // 13. Compliance Issues (20)
  const complianceData = [
    'Improper battery disposal in scrap bin', 'Missing safety valve inspection signature', 'PUE efficiency exceeded target at US-East server',
    'Supplier C contract lacking carbon disclosure clause', 'Minor data access logs encryption delay', 'Expired fire extinguisher at Lab B',
    'Equal pay metrics reporting delay', 'Travel logging receipts mismatch ENG dept', 'Unauthorized plastic cups in cafeteria',
    'HVAC temperature log delta breach', 'Chemical container missing classification tag', 'Safety goggles compliance violation at warehouse',
    'Incomplete whistleblower registry files', 'Overdue supplier safety self-audit', 'Carbon emission calculation tool validation mismatch',
    'Minor boiler emission limits breach', 'Failed backup generator exhaust test', 'IT password policy mismatch LEG system',
    'Facilities energy saving protocol lapse', 'Outdated policy acknowledgement logs MKT'
  ];

  const complianceIssues: ComplianceIssueDTO[] = complianceData.map((desc, idx) => {
    const owner = employees[idx % employees.length];
    const dept = departments[idx % departments.length];
    return {
      id: generateUUID(),
      title: desc.substring(0, 40),
      description: `Discovered compliance violation: ${desc}. Assessed under platform audits.`,
      audit_id: idx < audits.length ? audits[idx].id : null,
      severity: idx % 4 === 0 ? 'low' : idx % 4 === 1 ? 'medium' : idx % 4 === 2 ? 'high' : 'critical',
      owner_id: owner.id,
      owner_name: owner.name,
      due_date: new Date(now.getTime() + (idx - 5) * 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: idx < 10 ? 'resolved' : idx < 16 ? 'in-progress' : 'open',
      date_raised: new Date(now.getTime() - (idx + 2) * 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  // 14. Badges (15)
  const badges: BadgeDTO[] = [
    { id: generateUUID(), name: 'Carbon Fighter', description: 'Awarded for logging 5+ carbon transaction records.', unlock_rule: 'Log Count >= 5', icon: 'Leaf', active: true },
    { id: generateUUID(), name: 'Social Champion', description: 'Complete 3 CSR volunteer campaigns.', unlock_rule: 'CSR Approved >= 3', icon: 'Users', active: true },
    { id: generateUUID(), name: 'Governance Guard', description: 'Acknowledge 5 policies and raise 1 ticket.', unlock_rule: 'Policies >= 5 && Issues Raised >= 1', icon: 'Shield', active: true },
    { id: generateUUID(), name: 'Zero-Waste Hero', description: 'Complete the Zero Single-use Plastic week challenge.', unlock_rule: 'Challenge "Zero Single-use Plastic" completed', icon: 'Recycle', active: true },
    { id: generateUUID(), name: 'Cycle Champion', description: 'Log 15 entries on Commute challenge.', unlock_rule: 'Commute Logs >= 15', icon: 'Bike', active: true },
    { id: generateUUID(), name: 'Policy Guru', description: 'Acknowledge all policies.', unlock_rule: 'Acknowledge Count == Total Policies', icon: 'BookOpen', active: true },
    { id: generateUUID(), name: 'Safety Officer', description: 'Resolve 2 high severity compliance issues.', unlock_rule: 'Issues Resolved >= 2', icon: 'CheckSquare', active: true },
    { id: generateUUID(), name: 'Point Master', description: 'Earn a balance of 1000+ points.', unlock_rule: 'Points >= 1000', icon: 'Award', active: true },
    { id: generateUUID(), name: 'Auditor Companion', description: 'Assist in 3 environmental audits.', unlock_rule: 'Audits Assisted >= 3', icon: 'ClipboardList', active: true },
    { id: generateUUID(), name: 'Energy Saver', description: 'Complete off-peak energy challenges.', unlock_rule: 'Energy Challenges completed', icon: 'Zap', active: true },
    { id: generateUUID(), name: 'Social Star', description: 'Earn 500+ CSR XP points.', unlock_rule: 'CSR XP >= 500', icon: 'Star', active: true },
    { id: generateUUID(), name: 'Eco Guru', description: 'Reach Level 10.', unlock_rule: 'XP >= 2500', icon: 'GraduationCap', active: true },
    { id: generateUUID(), name: 'Green Traveler', description: 'Log train commutes over flights.', unlock_rule: 'Train logs >= 5', icon: 'Train', active: true },
    { id: generateUUID(), name: 'Team Head', description: 'First place in department ranking.', unlock_rule: 'Top Rank Department', icon: 'Crown', active: true },
    { id: generateUUID(), name: 'Active Participant', description: 'Join 10 challenges.', unlock_rule: 'Challenges Joined >= 10', icon: 'Flame', active: true },
  ];

  // 15. Rewards (20)
  const rewardCatalog = [
    'Reusable Bamboo Coffee Mug', 'Organic Cotton Canvas Tote', 'Mini Desktop Solar Power Station',
    'Desk Plant succulent kit', 'Eco-friendly Reusable Straw set', 'ESG Champion Polo Shirt',
    'Carbon Offset Certificate 500kg', 'Local Green Market Gift Card', 'Zero-waste beeswax wrap pack',
    'Organic herbal tea gift box', 'Stainless steel thermal bottle', 'Eco-friendly notebook cork cover',
    'Compostable phone case voucher', 'Solar rechargeable torch', 'Recycled ocean plastic laptop sleeve',
    'Plant-a-Tree Dedicated to You', 'FSC-Certified wooden desk organizer', 'All-natural bamboo toothbrush pack',
    'Biodegradable yoga mat', 'Fairtrade coffee beans bag'
  ];

  const rewards: RewardDTO[] = rewardCatalog.map((name, idx) => ({
    id: generateUUID(),
    name,
    description: `Redeemable merchandise item using your earned points: ${name}.`,
    points_required: 150 + (idx * 50) % 500,
    stock: idx % 5 === 0 ? 0 : 5 + (idx * 3) % 15,
    status: 'active',
    image_url: `https://images.unsplash.com/photo-${1600000000000 + idx * 50000}?auto=format&fit=crop&w=150&h=150`,
  }));

  // 16. Notifications (40)
  const notifications: NotificationDTO[] = [];
  const notifCategories = ['compliance', 'csr', 'challenge', 'badge', 'policy'] as const;
  for (let i = 0; i < 40; i++) {
    const emp = employees[i % employees.length];
    const category = notifCategories[i % notifCategories.length];
    notifications.push({
      id: generateUUID(),
      employee_id: emp.id,
      title: `System Alert: ${category.toUpperCase()}`,
      message: `Important update regarding your ESG portal tracking: details logged for ${category}.`,
      category,
      date: new Date(now.getTime() - i * 4 * 60 * 60 * 1000).toISOString(),
      is_read: i > 8,
    });
  }

  return {
    departments,
    employees,
    emissionFactors,
    environmentalGoals,
    carbonTransactions,
    csrActivities,
    csrParticipations,
    challenges,
    challengeParticipations,
    policies,
    audits,
    complianceIssues,
    badges,
    rewards,
    notifications,
    settings,
  };
};
