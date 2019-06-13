require('dotenv').config(); // instatiate environment variables

const CONFIG = {}; // Make this global to use all over the application

CONFIG.app = process.env.APP || 'NoName';
CONFIG.app_domain = process.env.APP_DOMAIN || 'example.com';
CONFIG.server_port = process.env.SERVER_PORT || '3000';
CONFIG.hangar_port = process.env.HANGAR_PORT || '4000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '27017';

if (process.env.NODE_ENV === 'test') {
  CONFIG.db_name = process.env.DB_TEST_NAME || 'test_db';
  CONFIG.db_user = process.env.DB_TEST_USER || 'dbTester';
  CONFIG.db_password = process.env.DB_TEST_PASS || '123456';
} else {
  CONFIG.db_name = process.env.DB_NAME || 'dbName';
  CONFIG.db_user = process.env.DB_USER || 'dbAdmin';
  CONFIG.db_password = process.env.DB_PASSWORD || 'dummy-password';
}

// App test configurations
CONFIG.test_user = process.env.TEST_USER || 'tester';
CONFIG.test_user_pass = process.env.TEST_PASS || '123456';

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';
CONFIG.auth_unique_key = process.env.AUTH_UNIQUE_KEY || 'email';

module.exports = CONFIG;
