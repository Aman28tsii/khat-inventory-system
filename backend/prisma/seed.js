import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Company
  const company = await prisma.company.upsert({
    where: { code: 'KTC001' },
    update: {},
    create: {
      name: 'Khat Trading Company',
      code: 'KTC001',
      address: '123 Main Street, City',
      phone: '+251-XXX-XXXX',
      email: 'info@khattrading.com',
      taxId: 'TAX-001-XXXX',
    },
  });

  console.log('✅ Company created');

  // Create Branches
  const headquarters = await prisma.branch.upsert({
    where: { code: 'HQ001' },
    update: {},
    create: {
      companyId: company.id,
      name: 'Headquarters',
      code: 'HQ001',
      type: 'HEADQUARTERS',
      address: '456 Head Office Ave, City',
      phone: '+251-XXX-XXXX',
      email: 'hq@khattrading.com',
      isActive: true,
    },
  });

  const warehouse = await prisma.branch.upsert({
    where: { code: 'WH001' },
    update: {},
    create: {
      companyId: company.id,
      name: 'Central Warehouse',
      code: 'WH001',
      type: 'WAREHOUSE',
      address: '789 Storage Road, City',
      phone: '+251-XXX-XXXX',
      email: 'warehouse@khattrading.com',
      isActive: true,
    },
  });

  console.log('✅ Branches created');

  // Create Roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'SUPER_ADMIN' },
      update: {},
      create: {
        name: 'SUPER_ADMIN',
        description: 'Full system access',
        level: 100,
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: {
        name: 'ADMIN',
        description: 'Administrative access',
        level: 90,
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: 'MANAGER' },
      update: {},
      create: {
        name: 'MANAGER',
        description: 'Branch/Department manager',
        level: 70,
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: 'INVENTORY_MANAGER' },
      update: {},
      create: {
        name: 'INVENTORY_MANAGER',
        description: 'Inventory management',
        level: 60,
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: 'CASHIER' },
      update: {},
      create: {
        name: 'CASHIER',
        description: 'Point of sale operations',
        level: 30,
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: 'VIEWER' },
      update: {},
      create: {
        name: 'VIEWER',
        description: 'Read-only access',
        level: 10,
        isSystem: true,
      },
    }),
  ]);

  console.log('✅ Roles created');

  // Create Permissions
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'create' } },
      update: {},
      create: { resource: 'user', action: 'create', description: 'Create new users' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'read' } },
      update: {},
      create: { resource: 'user', action: 'read', description: 'View users' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'update' } },
      update: {},
      create: { resource: 'user', action: 'update', description: 'Update users' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'user', action: 'delete' } },
      update: {},
      create: { resource: 'user', action: 'delete', description: 'Delete users' },
    }),
    // Inventory permissions
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'create' } },
      update: {},
      create: { resource: 'inventory', action: 'create', description: 'Create inventory items' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'read' } },
      update: {},
      create: { resource: 'inventory', action: 'read', description: 'View inventory' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'update' } },
      update: {},
      create: { resource: 'inventory', action: 'update', description: 'Update inventory' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'inventory', action: 'delete' } },
      update: {},
      create: { resource: 'inventory', action: 'delete', description: 'Delete inventory' },
    }),
    // Sales permissions
    prisma.permission.upsert({
      where: { resource_action: { resource: 'sales', action: 'create' } },
      update: {},
      create: { resource: 'sales', action: 'create', description: 'Create sales' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'sales', action: 'read' } },
      update: {},
      create: { resource: 'sales', action: 'read', description: 'View sales' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'sales', action: 'update' } },
      update: {},
      create: { resource: 'sales', action: 'update', description: 'Update sales' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'sales', action: 'delete' } },
      update: {},
      create: { resource: 'sales', action: 'delete', description: 'Delete sales' },
    }),
    // Reports permissions
    prisma.permission.upsert({
      where: { resource_action: { resource: 'reports', action: 'read' } },
      update: {},
      create: { resource: 'reports', action: 'read', description: 'View reports' },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'reports', action: 'export' } },
      update: {},
      create: { resource: 'reports', action: 'export', description: 'Export reports' },
    }),
  ]);

  console.log('✅ Permissions created');

  // Assign permissions to SUPER_ADMIN role
  const superAdminRole = roles[0];
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Permissions assigned to SUPER_ADMIN');

  // Create Admin User (password: Admin@123)
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@khattrading.com' },
    update: {},
    create: {
      email: 'admin@khattrading.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      employeeId: 'EMP001',
      roleId: superAdminRole.id,
      branchId: headquarters.id,
      phone: '+251-XXX-XXXX',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Admin user created');
  console.log('📧 Email: admin@khattrading.com');
  console.log('🔑 Password: Admin@123');
  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });