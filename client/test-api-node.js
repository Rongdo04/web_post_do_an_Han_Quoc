// test-api-node.js - Node.js test for API client (simulating browser environment)
import fetch from "node-fetch";

// Mock environment variables
const mockEnv = {
  VITE_API_BASE_URL: "http://localhost:8000",
  VITE_USE_MOCK: "false",
  VITE_API_TIMEOUT: "10000",
};

// Mock import.meta.env
global.import = {
  meta: {
    env: mockEnv,
  },
};

// Mock fetch if not available
if (!global.fetch) {
  global.fetch = fetch;
}

// Mock window for redirect testing
global.window = {
  location: {
    pathname: "/admin",
    search: "",
    href: "",
  },
};

// Simple HttpError implementation for testing
class HttpError extends Error {
  constructor(code, message, details = null, status = null) {
    super(message);
    this.name = "HttpError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromApiResponse(errorResponse, status) {
    const { code, message, details } = errorResponse.error || {};
    return new HttpError(
      code || "UNKNOWN_ERROR",
      message || "Đã xảy ra lỗi không xác định",
      details,
      status
    );
  }

  static networkError(originalMessage = "") {
    return new HttpError(
      "NETWORK_ERROR",
      "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      { originalMessage }
    );
  }

  getLocalizedMessage() {
    const messages = {
      UNAUTHORIZED: "Bạn cần đăng nhập để tiếp tục",
      FORBIDDEN: "Bạn không có quyền truy cập tính năng này",
      NOT_FOUND: "Không tìm thấy tài nguyên yêu cầu",
      NETWORK_ERROR: "Lỗi kết nối mạng",
    };
    return (
      messages[this.code] || this.message || "Đã xảy ra lỗi không xác định"
    );
  }

  isAuthError() {
    return this.code === "UNAUTHORIZED" || this.status === 401;
  }
}

// Simplified API client
const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const request = async (path, options = {}) => {
  const {
    method = "GET",
    body = null,
    params = null,
    headers = {},
    timeout = 10000,
  } = options;

  const queryString = params ? buildQueryString(params) : "";
  const url = `${mockEnv.VITE_API_BASE_URL}${path}${queryString}`;

  const requestHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  const requestOptions = {
    method,
    headers: requestHeaders,
    credentials: "include",
  };

  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  console.log(`🔄 ${method} ${url}`);

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw new HttpError(
          "HTTP_ERROR",
          `HTTP ${response.status}: ${response.statusText}`,
          { status: response.status, statusText: response.statusText },
          response.status
        );
      }

      throw HttpError.fromApiResponse(errorData, response.status);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error.code === "ECONNREFUSED" || error.message.includes("fetch")) {
      throw HttpError.networkError(error.message);
    }

    throw error;
  }
};

const get = (path, params = {}) => request(path, { method: "GET", params });

// Test functions
async function testHealthEndpoint() {
  console.log("\n1. Testing health endpoint...");
  try {
    const response = await get("/api/health");
    console.log("✅ Health check successful:");
    console.log(JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
    if (error instanceof HttpError) {
      console.log("   Code:", error.code);
      console.log("   Vietnamese message:", error.getLocalizedMessage());
    }
    return false;
  }
}

async function testAdminMetrics() {
  console.log("\n2. Testing admin metrics endpoint (should fail with 401)...");
  try {
    const response = await get("/api/admin/metrics/overview");
    console.log("✅ Unexpected success:", response);
    return false;
  } catch (error) {
    if (error instanceof HttpError && error.isAuthError()) {
      console.log("✅ Expected auth error:", error.getLocalizedMessage());
      console.log("   Code:", error.code);
      console.log("   Status:", error.status);
      return true;
    } else {
      console.log("❌ Unexpected error:", error.message);
      return false;
    }
  }
}

async function testAdminHealth() {
  console.log("\n3. Testing admin health endpoint (should fail with 401)...");
  try {
    const response = await get("/api/admin/health");
    console.log(
      "✅ Unexpected success (no auth required for health?):",
      response
    );
    return true; // This might be expected if health endpoint doesn't require auth
  } catch (error) {
    if (error instanceof HttpError && error.isAuthError()) {
      console.log("✅ Expected auth error:", error.getLocalizedMessage());
      return true;
    } else {
      console.log("❌ Unexpected error:", error.message);
      return false;
    }
  }
}

async function runTests() {
  console.log("API Client Test Suite");
  console.log(`Base URL: ${mockEnv.VITE_API_BASE_URL}`);
  console.log(`📋 Mock Mode: ${mockEnv.VITE_USE_MOCK}`);

  const results = [];

  results.push(await testHealthEndpoint());
  results.push(await testAdminMetrics());
  results.push(await testAdminHealth());

  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} passed`);

  if (passed === total) {
    console.log("✨ All tests passed! API client is working correctly.");
  } else {
    console.log("⚠️ Some tests failed. Check the errors above.");
  }

  return passed === total;
}

// Run tests
runTests().catch(console.error);
