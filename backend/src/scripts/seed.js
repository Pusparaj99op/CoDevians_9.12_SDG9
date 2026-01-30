require('dotenv').config();
const mongoose = require('mongoose');
const Bond = require('../models/Bond');

const bondsData = [
  {
    name: 'National Highway Infrastructure Bond',
    issuer: 'NHAI',
    returnRate: 7.5,
    riskLevel: 'Low',
    price: 10000,
    maturityYears: 5,
    description: 'Government-backed infrastructure bond for national highway development across India. Supports the Bharatmala Pariyojana project.',
    sector: 'Transportation',
    totalValue: 50000000000,
    availableUnits: 2500000,
    launchDate: new Date('2025-06-15')
  },
  {
    name: 'Metro Rail Development Bond',
    issuer: 'DMRC',
    returnRate: 8.2,
    riskLevel: 'Low',
    price: 25000,
    maturityYears: 7,
    description: 'Fund expansion of metro rail networks in major cities including Delhi, Mumbai, and Bangalore.',
    sector: 'Urban Transit',
    totalValue: 75000000000,
    availableUnits: 1500000,
    launchDate: new Date('2025-04-01')
  },
  {
    name: 'Green Energy Infrastructure Bond',
    issuer: 'IREDA',
    returnRate: 9.0,
    riskLevel: 'Medium',
    price: 15000,
    maturityYears: 10,
    description: 'Supporting renewable energy infrastructure projects including solar parks and wind farms across India.',
    sector: 'Energy',
    totalValue: 100000000000,
    availableUnits: 3000000,
    launchDate: new Date('2025-08-20')
  },
  {
    name: 'Smart City Development Bond',
    issuer: 'Smart City SPV',
    returnRate: 8.8,
    riskLevel: 'Medium',
    price: 20000,
    maturityYears: 8,
    description: 'Financing smart city initiatives including digital infrastructure, IoT systems, and sustainable urban development.',
    sector: 'Urban Development',
    totalValue: 60000000000,
    availableUnits: 1800000,
    launchDate: new Date('2025-03-10')
  },
  {
    name: 'Port & Logistics Bond',
    issuer: 'Sagarmala SPV',
    returnRate: 9.5,
    riskLevel: 'High',
    price: 50000,
    maturityYears: 12,
    description: 'Investment in port modernization, coastal economic zones, and integrated logistics infrastructure.',
    sector: 'Maritime',
    totalValue: 120000000000,
    availableUnits: 1200000,
    launchDate: new Date('2025-01-25')
  },
  {
    name: 'Rural Connectivity Bond',
    issuer: 'PMGSY',
    returnRate: 7.8,
    riskLevel: 'Low',
    price: 5000,
    maturityYears: 6,
    description: 'Funding rural road connectivity under Pradhan Mantri Gram Sadak Yojana for last-mile infrastructure.',
    sector: 'Rural Infrastructure',
    totalValue: 40000000000,
    availableUnits: 4000000,
    launchDate: new Date('2025-07-01')
  },
  {
    name: 'Water Infrastructure Bond',
    issuer: 'Jal Jeevan Mission',
    returnRate: 8.5,
    riskLevel: 'Medium',
    price: 10000,
    maturityYears: 8,
    description: 'Supporting water supply infrastructure and tap water connections to rural households.',
    sector: 'Water & Sanitation',
    totalValue: 80000000000,
    availableUnits: 2000000,
    launchDate: new Date('2025-05-15')
  },
  {
    name: 'Airport Modernization Bond',
    issuer: 'AAI',
    returnRate: 9.2,
    riskLevel: 'Medium',
    price: 30000,
    maturityYears: 10,
    description: 'Financing airport expansion and modernization projects under UDAN scheme.',
    sector: 'Aviation',
    totalValue: 90000000000,
    availableUnits: 1500000,
    launchDate: new Date('2025-02-28')
  },
  {
    name: 'Railway Infrastructure Bond',
    issuer: 'Indian Railways',
    returnRate: 8.0,
    riskLevel: 'Low',
    price: 15000,
    maturityYears: 7,
    description: 'Supporting railway modernization, new lines, and high-speed rail corridor development.',
    sector: 'Railways',
    totalValue: 150000000000,
    availableUnits: 5000000,
    launchDate: new Date('2025-09-01')
  },
  {
    name: 'Industrial Corridor Bond',
    issuer: 'NICDIT',
    returnRate: 10.0,
    riskLevel: 'High',
    price: 100000,
    maturityYears: 15,
    description: 'Investment in Delhi-Mumbai and other industrial corridors with integrated manufacturing zones.',
    sector: 'Industrial',
    totalValue: 200000000000,
    availableUnits: 1000000,
    launchDate: new Date('2025-11-15')
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mudra');
    console.log('📦 Connected to MongoDB');

    // Clear existing bonds
    await Bond.deleteMany({});
    console.log('🗑️  Cleared existing bonds');

    // Insert new bonds
    const insertedBonds = await Bond.insertMany(bondsData);
    console.log(`✅ Seeded ${insertedBonds.length} bonds successfully`);

    // Display inserted bonds
    insertedBonds.forEach((bond, index) => {
      console.log(`   ${index + 1}. ${bond.name} (${bond.issuer}) - ${bond.returnRate}%`);
    });

    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
