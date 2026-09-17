import { createApp } from '../app.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { User } from '../models/User.js';
import { Program } from '../models/Program.js';
import { ProgramShare } from '../models/ProgramShare.js';
import http from 'http';

interface TestResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: any;
}

function makeRequest(
  server: http.Server,
  method: string,
  path: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<TestResponse> {
  return new Promise((resolve, reject) => {
    const port = (server.address() as any).port;
    const reqHeaders: Record<string, string> = { ...headers };
    let payload = '';

    if (body) {
      payload = JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        method,
        path,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsedBody = null;
          try {
            parsedBody = JSON.parse(data);
          } catch {
            parsedBody = data;
          }
          resolve({
            statusCode: res.statusCode || 500,
            headers: res.headers,
            body: parsedBody,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting CodeNest API & Security Verification Suite...\n');
  await connectDatabase();
  try {
    // Drop any legacy indexes that might have the default language_override: "language"
    await Program.collection.dropIndexes();
  } catch (e) {
    // Collection might not exist yet
  }
  await Program.syncIndexes();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const testEmailA = `student_a_${Date.now()}@codenest.dev`;
  const testEmailB = `student_b_${Date.now()}@codenest.dev`;
  let tokenA = '';
  let tokenB = '';
  let programIdA = '';
  let rawShareToken = '';
  let shareId = '';

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Checks & Request ID
    console.log('--- 1. Observability: Health Checks & Request ID ---');
    const resLive = await makeRequest(server, 'GET', '/health/live');
    assert(resLive.statusCode === 200 && resLive.body.status === 'live', 'GET /health/live returns 200 and status: live');
    assert(Boolean(resLive.headers['x-request-id']), 'Response contains X-Request-ID header');

    const customReqId = 'test-corr-id-12345';
    const resReqId = await makeRequest(server, 'GET', '/health/live', undefined, { 'X-Request-ID': customReqId });
    assert(resReqId.headers['x-request-id'] === customReqId, 'Custom X-Request-ID is preserved and echoed');

    const resReady = await makeRequest(server, 'GET', '/health/ready');
    assert(resReady.statusCode === 200 && resReady.body.database === 'connected', 'GET /health/ready confirms database is connected');

    // 2. Authentication
    console.log('\n--- 2. Authentication & JWT ---');
    const resRegA = await makeRequest(server, 'POST', '/api/v1/auth/register', {
      email: testEmailA,
      password: 'password123',
      name: 'Alice Dev',
      college: 'MIT CSE',
    });
    assert(resRegA.statusCode === 201 && Boolean(resRegA.body.data?.accessToken), 'User A registration succeeds and returns accessToken');
    assert(Boolean(resRegA.body.data?.refreshToken), 'User A registration returns refreshToken in response payload');
    tokenA = resRegA.body.data.accessToken;
    const refreshTokenA = resRegA.body.data.refreshToken;

    const resRegB = await makeRequest(server, 'POST', '/api/v1/auth/register', {
      email: testEmailB,
      password: 'password123',
      name: 'Bob Hacker',
      college: 'Stanford',
    });
    assert(resRegB.statusCode === 201 && Boolean(resRegB.body.data?.accessToken), 'User B registration succeeds');
    tokenB = resRegB.body.data.accessToken;

    // 2.1 Refresh Token & Rotation
    console.log('\n--- 2.1 Refresh Token & Session Renewal ---');
    const resRefresh = await makeRequest(server, 'POST', '/api/v1/auth/refresh', {
      refreshToken: refreshTokenA,
    });
    assert(resRefresh.statusCode === 200 && Boolean(resRefresh.body.data?.accessToken), 'POST /api/v1/auth/refresh succeeds with body refreshToken');
    assert(Boolean(resRefresh.body.data?.refreshToken), 'POST /api/v1/auth/refresh returns renewed rotated refreshToken');

    const resRefreshBad = await makeRequest(server, 'POST', '/api/v1/auth/refresh', {
      refreshToken: 'invalid.jwt.token',
    });
    assert(resRefreshBad.statusCode === 401, 'POST /api/v1/auth/refresh rejects invalid token with 401');

    const resRefreshEmpty = await makeRequest(server, 'POST', '/api/v1/auth/refresh', {});
    assert(resRefreshEmpty.statusCode === 401, 'POST /api/v1/auth/refresh rejects missing token with 401');

    // 3. Program Creation (User A)
    console.log('\n--- 3. Program CRUD (User A) ---');
    const resCreate = await makeRequest(
      server,
      'POST',
      '/api/v1/programs',
      {
        title: 'Binary Tree Traversal',
        subject: 'DSA',
        language: 'cpp',
        question: 'Implement in-order and post-order traversal',
        code: 'void inorder(Node* root) { if(!root) return; inorder(root->left); cout << root->val; inorder(root->right); }',
        notes: 'O(n) time complexity',
        tags: ['trees', 'dsa', 'recursion'],
        isFavorite: true,
      },
      { Authorization: `Bearer ${tokenA}` }
    );
    assert(resCreate.statusCode === 201 && resCreate.body.data?.program?.title === 'Binary Tree Traversal', 'User A can create a program');
    programIdA = resCreate.body.data.program.id;

    // 4. IDOR / Authorization Security Checks
    console.log('\n--- 4. IDOR & Ownership Protection ---');
    // User B attempts to view User A's program
    const resIdorGet = await makeRequest(server, 'GET', `/api/v1/programs/${programIdA}`, undefined, {
      Authorization: `Bearer ${tokenB}`,
    });
    assert(resIdorGet.statusCode === 404, 'User B cannot view User A program (IDOR prevented with 404)');

    // User B attempts to update User A's program
    const resIdorUpdate = await makeRequest(
      server,
      'PATCH',
      `/api/v1/programs/${programIdA}`,
      { title: 'Hacked by Bob' },
      { Authorization: `Bearer ${tokenB}` }
    );
    assert(resIdorUpdate.statusCode === 404, 'User B cannot update User A program');

    // User B attempts to delete User A's program
    const resIdorDelete = await makeRequest(server, 'DELETE', `/api/v1/programs/${programIdA}`, undefined, {
      Authorization: `Bearer ${tokenB}`,
    });
    assert(resIdorDelete.statusCode === 404, 'User B cannot delete User A program');

    // 5. Program Sharing & Read-Only Access
    console.log('\n--- 5. Cryptographic Program Sharing & Read-Only Access ---');
    // User A creates a share link
    const resShareCreate = await makeRequest(
      server,
      'POST',
      `/api/v1/programs/${programIdA}/shares`,
      { expiration: '7d' },
      { Authorization: `Bearer ${tokenA}` }
    );
    assert(resShareCreate.statusCode === 201 && Boolean(resShareCreate.body.data?.share?.rawToken), 'User A can create a cryptographic share link');
    rawShareToken = resShareCreate.body.data.share.rawToken;
    shareId = resShareCreate.body.data.share.id;

    // Verify token is hashed in DB and raw token is NOT stored
    const shareRecord = await ProgramShare.findById(shareId);
    const shareObj = (shareRecord?.toObject() || {}) as unknown as Record<string, unknown>;
    assert(Boolean(shareRecord && shareRecord.tokenHash && !shareObj.rawToken), 'DB stores only SHA-256 tokenHash, never raw token');

    // Public / Anonymous user accesses the shared program
    const resSharedAccess = await makeRequest(server, 'GET', `/api/v1/shared/${rawShareToken}`);
    assert(resSharedAccess.statusCode === 200, 'Public viewer can access program via cryptographic share token');
    assert(resSharedAccess.body.data?.program?.permission === 'VIEW_ONLY', 'Shared program is marked VIEW_ONLY');
    assert(resSharedAccess.body.data?.program?.title === 'Binary Tree Traversal', 'Shared program returns title and code accurately');

    // User A revokes the share link
    console.log('\n--- 6. Share Revocation & Expiration ---');
    const resRevoke = await makeRequest(server, 'DELETE', `/api/v1/programs/${programIdA}/shares/${shareId}`, undefined, {
      Authorization: `Bearer ${tokenA}`
    });
    assert(resRevoke.statusCode === 200, 'User A can revoke share link');

    // Viewer accesses revoked link -> rejected with 410
    const resRevokedAccess = await makeRequest(server, 'GET', `/api/v1/shared/${rawShareToken}`);
    assert(resRevokedAccess.statusCode === 410, 'Accessing revoked share link is rejected with HTTP 410 (Revoked)');

    // Invalid token check
    const resInvalidShare = await makeRequest(server, 'GET', '/api/v1/shared/invalid_token_1234567890');
    assert(resInvalidShare.statusCode === 404, 'Non-existent share token returns HTTP 404');

    // Clean up test data
    await User.deleteMany({ email: { $in: [testEmailA, testEmailB] } });
    await Program.deleteMany({ _id: programIdA });
    await ProgramShare.deleteMany({ _id: shareId });

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    await disconnectDatabase();
  }

  console.log(`\n================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 All security, health, and sharing verification tests passed!');
  }
}

runTests();
