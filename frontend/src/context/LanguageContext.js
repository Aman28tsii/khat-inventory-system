import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    search: "Search",
    noData: "No Data Available",
    noItems: "No records found in the system",
    resource: "Resource",
    or: "or",
    all: "All",
    status: "Status",
    actions: "Actions",
    active: "Active",
    contact: "Contact",
    print: "Print",
    refresh: "Refresh",
    email: "Email",
    // ========== COMMON ==========
    
search: "Search",
    noData: "No Data Available",
    noItems: "No records found in the system",
    resource: "Resource",
or: "or",
all: "All",
status: "Status",
actions: "Actions",
active: "Active",
contact: "Contact",
print: "Print",
refresh: "Refresh",
email: "Email",
    appName: "Khat Inventory",
    inventoryReport: "Inventory Report",
    salesReport: "Sales Report",
    profitReport: "Profit Report",
    search: "Search...",
    welcome: "Welcome",
    profile: "My Profile",
    changePassword: "Change Password",
    notifications: "Notifications",
    logout: "Logout",
    user: "User",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    create: "Create",
    update: "Update",
    close: "Close",
    submit: "Submit",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    print: "Print",
    export: "Export",
    refresh: "Refresh",
    clear: "Clear",
    upload: "Upload",
    all: "All",
    none: "None",
    or: "or",
    notes: "Notes",
    contact: "Contact",
    warning: "Warning",
    success: "Success",
    status: "Status",
    amount: "Amount",
    total: "Total",
    actions: "Actions",
    created: "Created",
    updated: "Updated",
    items: "Items",
    of: "of",
    page: "Page",
    previous: "Previous",
    next: "Next",
    active: "Active",
    inactive: "Inactive",
    view: "View",
    used: "Used",
    resource: "Resource",

    // ========== NAVIGATION ==========
    dashboard: "Dashboard",
    inventory: "Inventory",
    products: "Products",
    batches: "Batches",
    stockMovements: "Stock Movements",
    sales: "Sales",
    purchases: "Purchases",
    transfers: "Transfers",
    reports: "Reports",
    customers: "Customers",
    suppliers: "Suppliers",
    users: "Users",
    roles: "Roles & Permissions",
    branches: "Branches",
    settings: "Settings",
    auditLogs: "Audit Logs",

    navigation: {
      main: "Main",
      operations: "Operations",
      management: "Management",
      system: "System"
    },

    // ========== AUTH ==========
    login: "Login",
    loginTitle: "Sign in to your account",
    register: "Register",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    signIn: "Sign In",
    signingIn: "Signing in...",
    invalidCredentials: "Invalid email or password",
    sessionExpired: "Session expired. Please login again",
    passwordChanged: "Password changed successfully",
    passwordReset: "Password reset email sent",
    currentPassword: "Current Password",
    newPassword: "New Password",
    minPassword: "Password must be at least 8 characters",
    passwordMismatch: "Passwords do not match",
    loginSuccess: "Login successful",
    logoutSuccess: "Logged out successfully",
    welcomeBack: "Welcome back",
    defaultAdmin: "Default admin: admin@khattrading.com / Admin@123",

    // ========== DASHBOARD ==========
    totalRevenue: "Total Revenue",
    totalSales: "Total Sales",
    totalProducts: "Total Products",
    activeUsers: "Active Users",
    alerts: "Alerts",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    salesTrend: "Sales & Revenue Trend",
    branchPerformance: "Branch Performance",
    inventoryDistribution: "Inventory Distribution",
    monthlyPerformance: "Monthly Performance",
    noActivity: "No recent activity",
    noAlerts: "All systems operating normally",
    lastUpdated: "Last updated",
    thisMonth: "This month",
    onlineNow: "Online now",
    inStock: "In Stock",
    executive: "Executive Dashboard",
    overview: "Overview of company performance",

    // ========== PURCHASES ==========
    purchases: {
      title: "Purchases",
      newPurchase: "New Purchase",
      purchaseNumber: "Purchase Number",
      supplier: "Supplier",
      noPurchases: "No purchases found",
      createPurchase: "Create Purchase Order",
      draft: "Draft",
      ordered: "Ordered",
      received: "Received",
      purchaseItems: "Purchase Items",
      purchaseDate: "Purchase Date",
      expectedDelivery: "Expected Delivery",
      actualDelivery: "Actual Delivery",
      orderStatus: "Order Status",
      receiveItems: "Receive Items"
    },

    // ========== BRANCHES ==========
    branches: {
      branch: "Branch",
      branchName: "Branch Name",
      branchCode: "Branch Code",
      branchType: "Branch Type",
      headquarters: "Headquarters",
      warehouse: "Warehouse",
      createBranch: "Create Branch",
      editBranch: "Edit Branch",
      noBranches: "No branches found",
      addBranch: "Add Branch",
      address: "Address",
      title: "Branches"
    },

    // ========== SALES ==========
    sales: {
      title: "Sales",
      totalAmount: "Total Amount",
      items: "Items",
      partial: "Partial",
      cancelled: "Cancelled",
      newSale: "New Sale",
      saleNumber: "Sale Number",
      saleDate: "Sale Date",
      customer: "Customer",
      walkInCustomer: "Walk-in Customer",
      subtotal: "Subtotal",
      tax: "Tax",
      discount: "Discount",
      paidAmount: "Paid Amount",
      balance: "Balance",
      paymentStatus: "Payment Status",
      paymentMethod: "Payment Method",
      payment: "Payment",
      processPayment: "Process Payment",
      pending: "Pending",
      completed: "Completed",
      returned: "Returned",
      paid: "Paid",
      overdue: "Overdue",
      createSale: "Create Sale",
      saleSummary: "Sale Summary",
      completeSale: "Complete Sale",
      quickAddCustomer: "Quick Add Customer",
      noSales: "No sales found",
      addItem: "Add Item",
      itemPrice: "Unit Price",
      itemTotal: "Item Total",
      view: "View"
    },

    // ========== PRODUCTS ==========
    products: {
      title: "Products",
      productManagement: "Product Management",
      productName: "Product Name",
      sku: "SKU",
      category: "Category",
      subCategory: "Sub Category",
      description: "Description",
      unit: "Unit",
      minStock: "Min Stock",
      maxStock: "Max Stock",
      reorderLevel: "Reorder Level",
      importCSV: "Import CSV",
      addProduct: "Add Product",
      noProducts: "No products found",
      editProduct: "Edit Product",
      createProduct: "Create Product",
      bulkImport: "Bulk Import"
    },

    // ========== INVENTORY ==========
    inventory: {
      title: "Inventory",
      batchManagement: "Batch Management",
      createBatch: "Create Batch",
      editBatch: "Edit Batch",
      stockMovements: "Stock Movements",
      batchNumber: "Batch Number",
      batch: "Batch",
      quantity: "Quantity",
      totalQuantity: "Total Quantity",
      remainingQuantity: "Remaining Quantity",
      availableQuantity: "Available Quantity",
      supplier: "Supplier",
      branch: "Branch",
      purchasePrice: "Purchase Price",
      sellingPrice: "Selling Price",
      arrivalDate: "Arrival Date",
      expiryDate: "Expiry Date",
      grade: "Grade",
      qualityInspection: "Quality Inspection",
      pendingInspection: "Pending Inspection",
      lowStock: "Low Stock",
      expiringSoon: "Expiring Soon",
      available: "Available",
      partial: "Partial",
      expired: "Expired",
      quarantined: "Quarantined",
      disposed: "Disposed",
      noBatches: "No batches found",
      addBatch: "Add Batch",
      completeInspection: "Complete Inspection",
      freshnessScore: "Freshness Score",
      totalProducts: "Total Products"
    },

    // ========== USERS ==========
    users: {
      title: "Users",
      firstName: "First Name",
      lastName: "Last Name",
      fullName: "Full Name",
      employeeId: "Employee ID",
      role: "Role",
      phone: "Phone Number",
      lastLogin: "Last Login",
      joined: "Joined",
      createUser: "Create User",
      editUser: "Edit User",
      userPermissions: "User Permissions",
      noUsers: "No users found",
      profileInformation: "Profile Information",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      avatar: "Profile Picture",
      resetPassword: "Reset Password",
      user: "User"
    },

    // ========== SUPPLIERS ==========
    suppliers: {
      title: "Suppliers",
      supplierName: "Supplier Name",
      supplierCode: "Supplier Code",
      contactPerson: "Contact Person",
      createSupplier: "Create Supplier",
      editSupplier: "Edit Supplier",
      noSuppliers: "No suppliers found"
    },

    // ========== CUSTOMERS ==========
    customers: {
      title: "Customers",
      customerName: "Customer Name",
      customerCode: "Customer Code",
      customerType: "Customer Type",
      individual: "Individual",
      business: "Business",
      wholesale: "Wholesale",
      retail: "Retail",
      creditLimit: "Credit Limit",
      paymentTerms: "Payment Terms",
      taxId: "Tax ID",
      createCustomer: "Create Customer",
      editCustomer: "Edit Customer",
      noCustomers: "No customers found",
      creditHistory: "Credit History",
      totalCredit: "Total Credit Given",
      totalPayments: "Total Payments",
      currentBalance: "Current Balance"
    },

    
    // ========== ROLES ==========
    roles: {
      title: "Roles & Permissions",
      description: "Manage system roles and their permissions",
      createRole: "Create Role",
      roleName: "Role Name",
      description: "Description",
      level: "Level",
      system: "System",
      fullAccess: "Full system access",
      adminAccess: "Administrative access",
      branchManager: "Branch manager",
      inventoryManagement: "Inventory management",
      posOperations: "Point of sale operations",
      readOnly: "Read-only access"
    },
    
    // ========== ROLES ==========
    roles: {
      title: "Roles & Permissions",
      description: "Manage system roles and their permissions",
      createRole: "Create Role",
      roleName: "Role Name",
      description: "Description",
      level: "Level",
      system: "System",
      fullAccess: "Full system access",
      adminAccess: "Administrative access",
      branchManager: "Branch manager",
      inventoryManagement: "Inventory management",
      posOperations: "Point of sale operations",
      readOnly: "Read-only access"
    },
    // ========== REPORTS ==========
    reports: {
      title: "Reports",
      inventoryReport: "Inventory Report",
      salesReport: "Sales Report",
      profitReport: "Profit Report",
      dateRange: "Date Range",
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      lastWeek: "Last Week",
      lastMonth: "Last Month",
      thisQuarter: "This Quarter",
      thisYear: "This Year",
      customRange: "Custom Range",
      startDate: "Start Date",
      endDate: "End Date",
      total: "Total",
      revenue: "Revenue",
      cost: "Cost",
      profit: "Profit",
      margin: "Margin",
      averageOrderValue: "Average Order Value",
      topProduct: "Top Product",
      exportPDF: "Export PDF",
      exportExcel: "Export Excel",
      applyFilters: "Apply Filters",
      clearFilters: "Clear Filters",
      noData: "No data available for the selected period"
    },

    // ========== SETTINGS ==========
    settings: {
      title: "Settings",
      general: "General Settings",
      security: "Security",
      companyName: "Company Name",
      companyEmail: "Company Email",
      companyPhone: "Company Phone",
      companyAddress: "Company Address",
      currency: "Currency",
      timezone: "Timezone",
      dateFormat: "Date Format",
      saveSettings: "Save Settings",
      settingsSaved: "Settings saved successfully",
      sessionTimeout: "Session Timeout (minutes)",
      maxLoginAttempts: "Max Login Attempts",
      preferences: "Preferences"
    },

    // ========== NOTIFICATIONS ==========
    notifications: {
      notificationCenter: "Notification Center",
      unread: "unread",
      read: "Read",
      markAllRead: "Mark All Read",
      deleteAll: "Delete All",
      noNotifications: "No notifications",
      allCaughtUp: "You're all caught up!",
      markAsRead: "Mark as read",
      newNotification: "New",
      viewAll: "View All Notifications",
      title: "Notifications"
    },

    // ========== MODALS ==========
    modals: {
      confirmDelete: "Confirm Delete",
      areYouSure: "Are you sure?",
      deleteWarning: "This action cannot be undone."
    },

    // ========== ERRORS ==========
    errors: {
      error: "Something went wrong",
      notFound: "Page not found",
      unauthorized: "Unauthorized access",
      forbidden: "Access denied",
      serverError: "Server error",
      networkError: "Network error",
      tryAgain: "Please try again",
      retry: "Retry",
      generic: "Something went wrong"
    },

    // ========== TRANSFERS ==========
    transfers: {
      title: "Transfers",
      newTransfer: "New Transfer",
      transferNumber: "Transfer Number",
      transferDate: "Transfer Date",
      fromBranch: "From Branch",
      toBranch: "To Branch",
      sourceBranch: "Source Branch",
      destinationBranch: "Destination Branch",
      expectedArrival: "Expected Arrival",
      transferStatus: "Transfer Status",
      approved: "Approved",
      inTransit: "In Transit",
      rejected: "Rejected",
      createTransfer: "Create Transfer",
      noTransfers: "No transfers found",
      itemsToTransfer: "Items to Transfer",
      transferSummary: "Transfer Summary"
    },

    // ========== POS ==========
    pos: {
      cart: "Cart",
      addToCart: "Add to Cart",
      removeFromCart: "Remove from Cart",
      clearCart: "Clear Cart",
      cartEmpty: "Cart is empty",
      checkout: "Checkout",
      cash: "Cash",
      card: "Card",
      mobileMoney: "Mobile Money",
      change: "Change",
      receipt: "Receipt",
      printReceipt: "Print Receipt",
      paymentSuccess: "Payment successful",
      paymentFailed: "Payment failed",
      scanProduct: "Scan or search product",
      price: "Price"
    }
  },

  am: {
    search: "ፈልግ",
    noData: "ምንም መረጃ የለም",
    noItems: "በስርዓቱ ውስጥ ምንም መዝገቦች አልተገኙም",
    resource: "ምንጭ",
    or: "ወይም",
    all: "ሁሉም",
    status: "ሁኔታ",
    actions: "ድርጊቶች",
    active: "ንቁ",
    contact: "የመገናኛ",
    print: "አትም",
    refresh: "አድስ",
    email: "ኢሜይል",
    // ========== COMMON ==========
    appName: "ጫት ኢንቬንተሪ",
    inventoryReport: "የኢንቬንተሪ ሪፖርት",
    salesReport: "የሽያጭ ሪፖርት",
    profitReport: "የትርፍ ሪፖርት",
    search: "ፈልግ...",
    welcome: "እንኳን ደህና መጡ",
    profile: "መገለጫ",
    changePassword: "የይለፍ ቃል ቀይር",
    notifications: "ማሳወቂያዎች",
    logout: "ውጣ",
    user: "ተጠቃሚ",
    loading: "በመጫን ላይ...",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    delete: "ሰርዝ",
    edit: "አስተካክል",
    add: "ጨምር",
    create: "ፍጠር",
    update: "አዘምን",
    close: "ዝጋ",
    submit: "አስገባ",
    confirm: "አረጋግጥ",
    yes: "አዎ",
    no: "አይ",
    print: "አትም",
    export: "ላክ",
    refresh: "አድስ",
    clear: "አጽዳ",
    upload: "ጫን",
    all: "ሁሉም",
    none: "ምንም",
    or: "ወይም",
    notes: "ማስታወሻዎች",
    contact: "የመገናኛ",
    warning: "ማንቂያ",
    success: "ተሳካ",
    status: "ሁኔታ",
    amount: "መጠን",
    total: "ድምር",
    actions: "ድርጊቶች",
    created: "ተፈጠረ",
    updated: "ተዘመነ",
    items: "እቃዎች",
    of: "ከ",
    page: "ገጽ",
    previous: "ቀዳሚ",
    next: "ቀጣይ",
    active: "ንቁ",
    inactive: "የቆመ",
    view: "ይመልከቱ",
    used: "ጥቅም ላይ የዋለ",
    resource: "ምንጭ",

    // ========== NAVIGATION ==========
    dashboard: "ዳሽቦርድ",
    inventory: "ኢንቬንተሪ",
    products: "ምርቶች",
    batches: "ባችዎች",
    stockMovements: "የእቃ እንቅስቃሴ",
    sales: "ሽያጭ",
    purchases: "ግዢ",
    transfers: "ዝውውር",
    reports: "ሪፖርቶች",
    customers: "ደንበኞች",
    suppliers: "አቅራቢዎች",
    users: "ተጠቃሚዎች",
    roles: "ሚናዎች እና ፍቃዶች",
    branches: "ቅርንጫፎች",
    settings: "ቅንብሮች",
    auditLogs: "የኦዲት መዝገቦች",

    navigation: {
      main: "ዋና",
      operations: "ሥራዎች",
      management: "አስተዳደር",
      system: "ሲስተም"
    },

    // ========== AUTH ==========
    login: "ግባ",
    loginTitle: "ወደ መለያዎ ይግቡ",
    register: "ተመዝገብ",
    email: "ኢሜይል አድራሻ",
    password: "የይለፍ ቃል",
    confirmPassword: "የይለፍ ቃል አረጋግጥ",
    forgotPassword: "የይለፍ ቃል ረሱ?",
    rememberMe: "አስታውሰኝ",
    signIn: "ግባ",
    signingIn: "በመግባት ላይ...",
    invalidCredentials: "የተሳሳተ ኢሜይል ወይም የይለፍ ቃል",
    sessionExpired: "ክፍለ ጊዜ አልቋል። እባክዎ እንደገና ይግቡ",
    passwordChanged: "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል",
    passwordReset: "የይለፍ ቃል ዳግም ማስጀመሪያ ኢሜይል ተልኳል",
    currentPassword: "አሁን ያለው የይለፍ ቃል",
    newPassword: "አዲስ የይለፍ ቃል",
    minPassword: "የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት",
    passwordMismatch: "የይለፍ ቃሎች አይዛመዱም",
    loginSuccess: "በተሳካ ሁኔታ ገብተዋል",
    logoutSuccess: "በተሳካ ሁኔታ ወጥተዋል",
    welcomeBack: "እንኳን በደህና መጡ",
    defaultAdmin: "ነባሪ አስተዳዳሪ: admin@khattrading.com / Admin@123",

    // ========== DASHBOARD ==========
    totalRevenue: "ጠቅላላ ገቢ",
    totalSales: "ጠቅላላ ሽያጭ",
    totalProducts: "ጠቅላላ ምርቶች",
    activeUsers: "ንቁ ተጠቃሚዎች",
    alerts: "ማንቂያዎች",
    recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
    quickActions: "ፈጣን ድርጊቶች",
    salesTrend: "የሽያጭ እና ገቢ አዝማሚያ",
    branchPerformance: "የቅርንጫፍ አፈጻጸም",
    inventoryDistribution: "የእቃ ክምችት ስርጭት",
    monthlyPerformance: "ወርሃዊ አፈጻጸም",
    noActivity: "ምንም የቅርብ ጊዜ እንቅስቃሴ የለም",
    noAlerts: "ሁሉም ስርዓቶች በመደበኛነት እየሰሩ ናቸው",
    lastUpdated: "የመጨረሻ ማዘመን",
    thisMonth: "በዚህ ወር",
    onlineNow: "አሁን በመስመር ላይ",
    inStock: "በክምችት ውስጥ",
    executive: "የሥራ አስፈፃሚ ዳሽቦርድ",
    overview: "የኩባንያው አፈፃፀም አጠቃላይ እይታ",

    // ========== PURCHASES ==========
    purchases: {
      title: "ግዢ",
      newPurchase: "አዲስ ግዢ",
      purchaseNumber: "የግዢ ቁጥር",
      supplier: "አቅራቢ",
      noPurchases: "ምንም ግዢዎች አልተገኙም",
      createPurchase: "የግዢ ትዕዛዝ ፍጠር",
      draft: "ረቂቅ",
      ordered: "ታዘዟል",
      received: "ተቀብሏል",
      purchaseItems: "የግዢ እቃዎች",
      purchaseDate: "የግዢ ቀን",
      expectedDelivery: "የሚጠበቀው መላኪያ",
      actualDelivery: "ትክክለኛው መላኪያ",
      orderStatus: "የትዕዛዝ ሁኔታ",
      receiveItems: "እቃዎች ተቀበል"
    },

    // ========== BRANCHES ==========
    branches: {
      branch: "ቅርንጫፍ",
      branchName: "የቅርንጫፍ ስም",
      branchCode: "የቅርንጫፍ ኮድ",
      branchType: "የቅርንጫፍ አይነት",
      headquarters: "ዋና መሥሪያ ቤት",
      warehouse: "መጋዘን",
      createBranch: "ቅርንጫፍ ፍጠር",
      editBranch: "ቅርንጫፍ አስተካክል",
      noBranches: "ምንም ቅርንጫፎች አልተገኙም",
      addBranch: "ቅርንጫፍ ጨምር",
      address: "አድራሻ",
      title: "ቅርንጫፎች"
    },

    // ========== SALES ==========
    sales: {
      title: "ሽያጭ",
      totalAmount: "ጠቅላላ ድምር",
      items: "እቃዎች",
      partial: "ከፊል",
      cancelled: "ተሰርዟል",
      newSale: "አዲስ ሽያጭ",
      saleNumber: "የሽያጭ ቁጥር",
      saleDate: "የሽያጭ ቀን",
      customer: "ደንበኛ",
      walkInCustomer: "የጎበኘ ደንበኛ",
      subtotal: "ንዑስ ድምር",
      tax: "ግብር",
      discount: "ቅናሽ",
      paidAmount: "የተከፈለ ድምር",
      balance: "ቀሪ",
      paymentStatus: "የክፍያ ሁኔታ",
      paymentMethod: "የክፍያ ዘዴ",
      payment: "ክፍያ",
      processPayment: "ክፍያ አከናውን",
      pending: "በመጠባበቅ ላይ",
      completed: "ተጠናቋል",
      returned: "ተመልሷል",
      paid: "ተከፍሏል",
      overdue: "ዘግይቷል",
      createSale: "ሽያጭ ፍጠር",
      saleSummary: "የሽያጭ ማጠቃለያ",
      completeSale: "ሽያጭ አጠናቅቅ",
      quickAddCustomer: "ደንበኛ በፍጥነት ጨምር",
      noSales: "ምንም ሽያጮች አልተገኙም",
      addItem: "እቃ ጨምር",
      itemPrice: "የእቃ ዋጋ",
      itemTotal: "የእቃ ድምር",
      view: "ይመልከቱ"
    },

    // ========== PRODUCTS ==========
    products: {
      title: "ምርቶች",
      productManagement: "የምርት አስተዳደር",
      productName: "የምርት ስም",
      sku: "SKU",
      category: "ምድብ",
      subCategory: "ንዑስ ምድብ",
      description: "መግለጫ",
      unit: "አሃድ",
      minStock: "ዝቅተኛ ክምችት",
      maxStock: "ከፍተኛ ክምችት",
      reorderLevel: "የድጋሚ ትዕዛዝ ደረጃ",
      importCSV: "CSV አስገባ",
      addProduct: "ምርት ጨምር",
      noProducts: "ምንም ምርቶች አልተገኙም",
      editProduct: "ምርት አስተካክል",
      createProduct: "ምርት ፍጠር",
      bulkImport: "በብዛት አስገባ"
    },

    // ========== INVENTORY ==========
    inventory: {
      title: "ኢንቬንተሪ",
      batchManagement: "የባች አስተዳደር",
      createBatch: "ባች ፍጠር",
      editBatch: "ባች አስተካክል",
      stockMovements: "የእቃ እንቅስቃሴ",
      batchNumber: "የባች ቁጥር",
      batch: "ባች",
      quantity: "ብዛት",
      totalQuantity: "ጠቅላላ ብዛት",
      remainingQuantity: "የቀረ ብዛት",
      availableQuantity: "ያለ ብዛት",
      supplier: "አቅራቢ",
      branch: "ቅርንጫፍ",
      purchasePrice: "የግዢ ዋጋ",
      sellingPrice: "የሽያጭ ዋጋ",
      arrivalDate: "የመድረሻ ቀን",
      expiryDate: "የማብቂያ ቀን",
      grade: "ደረጃ",
      qualityInspection: "የጥራት ምርመራ",
      pendingInspection: "ምርመራ በመጠባበቅ ላይ",
      lowStock: "ዝቅተኛ ክምችት",
      expiringSoon: "በቅርቡ የሚያበቃ",
      available: "ይገኛል",
      partial: "ከፊል",
      expired: "አልቋል",
      quarantined: "በኳራንቲን ውስጥ",
      disposed: "ተወግዷል",
      noBatches: "ምንም ባችዎች አልተገኙም",
      addBatch: "ባች ጨምር",
      completeInspection: "ምርመራ አጠናቅቅ",
      freshnessScore: "የትኩስነት ውጤት",
      totalProducts: "ጠቅላላ ምርቶች"
    },

    // ========== USERS ==========
    users: {
      title: "ተጠቃሚዎች",
      firstName: "ስም",
      lastName: "የአባት ስም",
      fullName: "ሙሉ ስም",
      employeeId: "የሰራተኛ መለያ",
      role: "ሚና",
      phone: "ስልክ ቁጥር",
      lastLogin: "የመጨረሻ መግቢያ",
      joined: "የተመዘገበበት",
      createUser: "ተጠቃሚ ፍጠር",
      editUser: "ተጠቃሚ አስተካክል",
      userPermissions: "የተጠቃሚ ፍቃዶች",
      noUsers: "ምንም ተጠቃሚዎች አልተገኙም",
      profileInformation: "የመገለጫ መረጃ",
      editProfile: "መገለጫ አስተካክል",
      saveChanges: "ለውጦች አስቀምጥ",
      avatar: "የመገለጫ ምስል",
      resetPassword: "የይለፍ ቃል ዳግም አስጀምር",
      user: "ተጠቃሚ"
    },

    // ========== SUPPLIERS ==========
    suppliers: {
      title: "አቅራቢዎች",
      supplierName: "የአቅራቢ ስም",
      supplierCode: "የአቅራቢ ኮድ",
      contactPerson: "የሚገናኝ ሰው",
      createSupplier: "አቅራቢ ፍጠር",
      editSupplier: "አቅራቢ አስተካክል",
      noSuppliers: "ምንም አቅራቢዎች አልተገኙም"
    },

    // ========== CUSTOMERS ==========
    customers: {
      title: "ደንበኞች",
      customerName: "የደንበኛ ስም",
      customerCode: "የደንበኛ ኮድ",
      customerType: "የደንበኛ አይነት",
      individual: "ግለሰብ",
      business: "ንግድ",
      wholesale: "በጅምላ",
      retail: "በችርቻሮ",
      creditLimit: "የብድር ገደብ",
      paymentTerms: "የክፍያ ውሎች",
      taxId: "የግብር መለያ",
      createCustomer: "ደንበኛ ፍጠር",
      editCustomer: "ደንበኛ አስተካክል",
      noCustomers: "ምንም ደንበኞች አልተገኙም",
      creditHistory: "የብድር ታሪክ",
      totalCredit: "ጠቅላላ የተሰጠ ብድር",
      totalPayments: "ጠቅላላ ክፍያዎች",
      currentBalance: "አሁን ያለው ቀሪ"
    },

    
    // ========== ROLES ==========
    roles: {
      title: "Roles & Permissions",
      description: "Manage system roles and their permissions",
      createRole: "Create Role",
      roleName: "Role Name",
      description: "Description",
      level: "Level",
      system: "System",
      fullAccess: "Full system access",
      adminAccess: "Administrative access",
      branchManager: "Branch manager",
      inventoryManagement: "Inventory management",
      posOperations: "Point of sale operations",
      readOnly: "Read-only access"
    },
    
    // ========== ROLES ==========
    roles: {
      title: "Roles & Permissions",
      description: "Manage system roles and their permissions",
      createRole: "Create Role",
      roleName: "Role Name",
      description: "Description",
      level: "Level",
      system: "System",
      fullAccess: "Full system access",
      adminAccess: "Administrative access",
      branchManager: "Branch manager",
      inventoryManagement: "Inventory management",
      posOperations: "Point of sale operations",
      readOnly: "Read-only access"
    },
    // ========== REPORTS ==========
    reports: {
      title: "ሪፖርቶች",
      inventoryReport: "የኢንቬንተሪ ሪፖርት",
      salesReport: "የሽያጭ ሪፖርት",
      profitReport: "የትርፍ ሪፖርት",
      dateRange: "የቀን ክልል",
      today: "ዛሬ",
      yesterday: "ትናንት",
      thisWeek: "በዚህ ሳምንት",
      lastWeek: "ባለፈው ሳምንት",
      lastMonth: "ባለፈው ወር",
      thisQuarter: "በዚህ ሩብ",
      thisYear: "በዚህ ዓመት",
      customRange: "ብጁ ክልል",
      startDate: "የመጀመሪያ ቀን",
      endDate: "የመጨረሻ ቀን",
      total: "ድምር",
      revenue: "ገቢ",
      cost: "ወጪ",
      profit: "ትርፍ",
      margin: "ህዳግ",
      averageOrderValue: "አማካይ የትዕዛዝ ዋጋ",
      topProduct: "ከፍተኛ ምርት",
      exportPDF: "PDF ላክ",
      exportExcel: "Excel ላክ",
      applyFilters: "ማጣሪያዎችን ተግብር",
      clearFilters: "ማጣሪያዎችን አጽዳ",
      noData: "ለተመረጠው ጊዜ ምንም መረጃ የለም"
    },

    // ========== SETTINGS ==========
    settings: {
      title: "ቅንብሮች",
      general: "አጠቃላይ ቅንብሮች",
      security: "ደህንነት",
      companyName: "የኩባንያ ስም",
      companyEmail: "የኩባንያ ኢሜይል",
      companyPhone: "የኩባንያ ስልክ",
      companyAddress: "የኩባንያ አድራሻ",
      currency: "ገንዘብ",
      timezone: "የሰዓት ሰቅ",
      dateFormat: "የቀን ቅርጸት",
      saveSettings: "ቅንብሮችን አስቀምጥ",
      settingsSaved: "ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል",
      sessionTimeout: "የክፍለ ጊዜ ጊዜ ማብቂያ (ደቂቃዎች)",
      maxLoginAttempts: "ከፍተኛ የመግቢያ ሙከራዎች",
      preferences: "ምርጫዎች"
    },

    // ========== NOTIFICATIONS ==========
    notifications: {
      notificationCenter: "የማሳወቂያ ማዕከል",
      unread: "ያልተነበበ",
      read: "ተነብቧል",
      markAllRead: "ሁሉም እንደተነበበ ምልክት አድርግ",
      deleteAll: "ሁሉም ሰርዝ",
      noNotifications: "ምንም ማሳወቂያዎች የሉም",
      allCaughtUp: "ሁሉንም አይተዋል!",
      markAsRead: "እንደተነበበ ምልክት አድርግ",
      newNotification: "አዲስ",
      viewAll: "ሁሉንም ማሳወቂያዎች ይመልከቱ",
      title: "ማሳወቂያዎች"
    },

    // ========== MODALS ==========
    modals: {
      confirmDelete: "መሰረዝ አረጋግጥ",
      areYouSure: "እርግጠኛ ነዎት?",
      deleteWarning: "ይህ ድርጊት ሊቀለበስ አይችልም።"
    },

    // ========== ERRORS ==========
    errors: {
      error: "ስህተት ተከስቷል",
      notFound: "ገጽ አልተገኘም",
      unauthorized: "ያልተፈቀደ መዳረሻ",
      forbidden: "መዳረሻ ተከልክሏል",
      serverError: "የአገልጋይ ስህተት",
      networkError: "የአውታረ መረብ ስህተት",
      tryAgain: "እባክዎ እንደገና ይሞክሩ",
      retry: "ደግመህ ሞክር",
      generic: "ስህተት ተከስቷል"
    },

    // ========== TRANSFERS ==========
    transfers: {
      title: "ዝውውር",
      newTransfer: "አዲስ ዝውውር",
      transferNumber: "የዝውውር ቁጥር",
      transferDate: "የዝውውር ቀን",
      fromBranch: "ከሚመጣበት ቅርንጫፍ",
      toBranch: "ወደሚሄድበት ቅርንጫፍ",
      sourceBranch: "ምንጭ ቅርንጫፍ",
      destinationBranch: "መድረሻ ቅርንጫፍ",
      expectedArrival: "የሚጠበቀው መድረሻ",
      transferStatus: "የዝውውር ሁኔታ",
      approved: "ተፈቅዷል",
      inTransit: "በመጓዝ ላይ",
      rejected: "ተቀባይነት አላገኘም",
      createTransfer: "ዝውውር ፍጠር",
      noTransfers: "ምንም ዝውውሮች አልተገኙም",
      itemsToTransfer: "ለማዛወር የሚቻሉ እቃዎች",
      transferSummary: "የዝውውር ማጠቃለያ"
    },

    // ========== POS ==========
    pos: {
      cart: "የግዢ ቅርጫት",
      addToCart: "ወደ ግዢ ቅርጫት ጨምር",
      removeFromCart: "ከግዢ ቅርጫት አስወግድ",
      clearCart: "ግዢ ቅርጫት አጽዳ",
      cartEmpty: "ግዢ ቅርጫት ባዶ ነው",
      checkout: "ክፍያ",
      cash: "ጥሬ ገንዘብ",
      card: "ካርድ",
      mobileMoney: "ሞባይል ገንዘብ",
      change: "ቀሪ",
      receipt: "ደረሰኝ",
      printReceipt: "ደረሰኝ አትም",
      paymentSuccess: "ክፍያ ተሳክቷል",
      paymentFailed: "ክፍያ አልተሳካም",
      scanProduct: "ምርት ይቃኙ ወይም ይፈልጉ",
      price: "ዋጋ"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    // Direct lookup first
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    
    // If not found, try nested lookup (for keys like 'navigation.main')
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return result || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};








