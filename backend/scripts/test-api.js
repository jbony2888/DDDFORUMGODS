#!/usr/bin/env node

/**
 * Simple API test script
 * Tests all user endpoints
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, url, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { error: 'Failed to parse JSON response' };
    }

    return {
      status: response.status,
      data,
      success: response.ok,
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      error: error.message,
      success: false,
    };
  }
}

async function runTests() {
  log('\n🧪 Testing DDDFORUMGODS API\n', 'blue');
  log(`Base URL: ${BASE_URL}\n`, 'yellow');

  // Check if server is running
  log('Checking if server is running...', 'yellow');
  const healthCheck = await testEndpoint('GET', `${BASE_URL}/health`);
  if (!healthCheck.success && healthCheck.status === 0) {
    log('\n❌ Server is not running!', 'red');
    log('   Please start the server first:', 'yellow');
    log('   cd backend && npm run start:dev\n', 'yellow');
    process.exit(1);
  }
  log('   ✅ Server is running\n', 'green');

  // Test 1: Health Check
  log('1. Testing Health Check...', 'yellow');
  if (healthCheck.success) {
    log('   ✅ Health check passed', 'green');
  } else {
    log(`   ❌ Health check failed: ${healthCheck.data?.error || healthCheck.error || healthCheck.status}`, 'red');
  }

  // Test 2: Create User
  log('\n2. Testing Create User...', 'yellow');
  const createUser = await testEndpoint('POST', `${BASE_URL}/users/new`, {
    email: `test${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    firstName: 'Test',
    lastName: 'User',
  });

  if (createUser.success && createUser.data.success) {
    log('   ✅ User created successfully', 'green');
    log(`   User ID: ${createUser.data.data.id}`, 'blue');
    const userId = createUser.data.data.id;
    const userEmail = createUser.data.data.email;

    // Test 3: Get User by Email
    log('\n3. Testing Get User by Email...', 'yellow');
    const getUser = await testEndpoint('GET', `${BASE_URL}/users?email=${encodeURIComponent(userEmail)}`);
    if (getUser.success && getUser.data.success) {
      log('   ✅ User retrieved successfully', 'green');
    } else {
      log(`   ❌ Failed to retrieve user: ${getUser.data.error}`, 'red');
    }

    // Test 4: Edit User
    log('\n4. Testing Edit User...', 'yellow');
    const editUser = await testEndpoint('POST', `${BASE_URL}/users/edit/${userId}`, {
      firstName: 'Updated',
      lastName: 'Name',
    });
    if (editUser.success && editUser.data.success) {
      log('   ✅ User updated successfully', 'green');
    } else {
      log(`   ❌ Failed to update user: ${editUser.data.error}`, 'red');
    }

    // Test 5: Duplicate Username Error
    log('\n5. Testing Duplicate Username Error...', 'yellow');
    const duplicateUsername = await testEndpoint('POST', `${BASE_URL}/users/new`, {
      email: `different${Date.now()}@example.com`,
      username: createUser.data.data.username,
      firstName: 'Dup',
      lastName: 'User',
    });
    if (duplicateUsername.status === 409 && duplicateUsername.data.error === 'UsernameAlreadyTaken') {
      log('   ✅ Duplicate username error handled correctly', 'green');
    } else {
      log(`   ❌ Expected 409 UsernameAlreadyTaken, got ${duplicateUsername.status}`, 'red');
    }

    // Test 6: Duplicate Email Error
    log('\n6. Testing Duplicate Email Error...', 'yellow');
    const duplicateEmail = await testEndpoint('POST', `${BASE_URL}/users/new`, {
      email: userEmail,
      username: `different${Date.now()}`,
      firstName: 'Dup',
      lastName: 'User',
    });
    if (duplicateEmail.status === 409 && duplicateEmail.data.error === 'EmailAlreadyInUse') {
      log('   ✅ Duplicate email error handled correctly', 'green');
    } else {
      log(`   ❌ Expected 409 EmailAlreadyInUse, got ${duplicateEmail.status}`, 'red');
    }

    // Test 7: Validation Error
    log('\n7. Testing Validation Error...', 'yellow');
    const validationError = await testEndpoint('POST', `${BASE_URL}/users/new`, {
      email: 'missing@example.com',
      username: 'missing',
    });
    if (validationError.status === 400 && validationError.data.error === 'ValidationError') {
      log('   ✅ Validation error handled correctly', 'green');
    } else {
      log(`   ❌ Expected 400 ValidationError, got ${validationError.status}`, 'red');
    }

    // Test 8: User Not Found
    log('\n8. Testing User Not Found...', 'yellow');
    const notFound = await testEndpoint('POST', `${BASE_URL}/users/edit/99999`, {
      firstName: 'Ghost',
    });
    if (notFound.status === 404 && notFound.data.error === 'UserNotFound') {
      log('   ✅ User not found error handled correctly', 'green');
    } else {
      log(`   ❌ Expected 404 UserNotFound, got ${notFound.status}`, 'red');
    }
  } else {
    const errorMsg = createUser.data?.error || createUser.error || 'Unknown error';
    log(`   ❌ Failed to create user: ${errorMsg}`, 'red');
  }

  log('\n✨ Tests completed!\n', 'blue');
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ with native fetch support', 'red');
  log('   Or install node-fetch: npm install node-fetch', 'yellow');
  process.exit(1);
}

runTests().catch(console.error);

