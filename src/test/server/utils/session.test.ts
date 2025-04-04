// pnpm vitest run src/test/server/utils/session.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { type JWTPayload, SignJWT } from "jose";
import { cookies } from "next/headers";

// 模拟依赖模块
vi.mock("server-only", () => {
  return {};
});

vi.mock("next/headers", async () => {
  const mockStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };
  return {
    cookies: () => mockStore,
  };
});

// 导入被测试的模块
import {
  encrypt,
  decrypt,
  createSession,
  updateSession,
  deleteSession,
} from "@/server/utils/session";

describe("Session 会话工具函数", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("encrypt", () => {
    it("应该成功加密payload", async () => {
      const payload: JWTPayload = {
        sub: "user123",
        iat: Math.floor(Date.now() / 1000),
      };
      const token = await encrypt(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });

    it("应该包含正确的过期时间", async () => {
      const payload: JWTPayload = {
        sub: "user123",
      };
      const token = await encrypt(payload);
      const decoded = await decrypt(token);
      expect(decoded).toBeDefined();
      expect(decoded?.exp).toBeDefined();
      const now = Math.floor(Date.now() / 1000);
      const fourWeeks = 4 * 7 * 24 * 60 * 60;
      expect(decoded?.exp).toBeGreaterThan(now + fourWeeks - 60);
      expect(decoded?.exp).toBeLessThan(now + fourWeeks + 60);
    });
  });

  describe("decrypt", () => {
    it("应该成功解密有效token", async () => {
      const payload: JWTPayload = {
        sub: "user123",
        custom: "data",
      };
      const token = await encrypt(payload);
      const decoded = await decrypt(token);
      expect(decoded).toBeDefined();
      expect(decoded?.sub).toBe(payload.sub);
      expect(decoded?.custom).toBe(payload.custom);
    });

    it("无效token应该返回undefined", async () => {
      const invalidToken = "invalid.token.format";
      const result = await decrypt(invalidToken);
      expect(result).toBeUndefined();
    });

    it("undefined token应该返回undefined", async () => {
      const result = await decrypt(undefined);
      expect(result).toBeUndefined();
    });

    it("空字符串token应该返回undefined", async () => {
      const result = await decrypt("");
      expect(result).toBeUndefined();
    });

    it("过期token应该返回undefined", async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: JWTPayload = {
        sub: "user123",
        exp: now - 3600, // 设置为1小时前过期
        iat: now - 7200, // 设置为2小时前签发
      };
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(
          new TextEncoder().encode(
            process.env.SESSION_SECRET_KEY ?? "test-key",
          ),
        );
      const result = await decrypt(token);
      expect(result).toBeUndefined();
    });
  });

  describe("createSession", () => {
    it("应该正确创建会话并设置cookie", async () => {
      const subject = "user123";
      await createSession(subject);

      const cookieStore = await cookies();
      expect(cookieStore.set).toHaveBeenCalledTimes(1);
      const mockCall = (cookieStore.set as ReturnType<typeof vi.fn>).mock
        .calls[0] as [
        name: string,
        value: string,
        options: {
          httpOnly: boolean;
          secure: boolean;
          expires: Date;
          sameSite: "lax" | "strict" | "none";
          path: string;
        },
      ];
      const name = mockCall?.[0];
      const value = mockCall?.[1];
      const options = mockCall?.[2];

      expect(name).toBe("user-center-sawana-session");
      expect(typeof value).toBe("string");
      expect(options).toEqual(
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        }),
      );

      const decoded = await decrypt(value);
      expect(decoded?.sub).toBe(subject);
    });
  });

  describe("updateSession", () => {
    it("应该成功更新有效会话", async () => {
      const oldToken = await encrypt({ sub: "user123" });
      const cookieStore = await cookies();
      (cookieStore.get as ReturnType<typeof vi.fn>).mockReturnValue({
        value: oldToken,
      });

      const result = await updateSession();
      expect(result).toBe(true);
      expect(cookieStore.set).toHaveBeenCalledTimes(1);

      const mockCall = (cookieStore.set as ReturnType<typeof vi.fn>).mock
        .calls[0] as [
        name: string,
        value: string,
        options: {
          httpOnly: boolean;
          secure: boolean;
          expires: Date;
          sameSite: "lax" | "strict" | "none";
          path: string;
        },
      ];
      const name = mockCall?.[0];
      const newToken = mockCall?.[1];
      const decoded = await decrypt(newToken);
      expect(decoded?.sub).toBe("user123");
    });

    it("无效会话应该返回false", async () => {
      const cookieStore = await cookies();
      (cookieStore.get as ReturnType<typeof vi.fn>).mockReturnValue({
        value: "invalid.token",
      });
      const result = await updateSession();
      expect(result).toBe(false);
    });

    it("没有会话应该返回false", async () => {
      const cookieStore = await cookies();
      (cookieStore.get as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
      const result = await updateSession();
      expect(result).toBe(false);
    });
  });

  describe("deleteSession", () => {
    it("应该正确删除会话cookie", async () => {
      await deleteSession();
      const cookieStore = await cookies();
      expect(cookieStore.delete).toHaveBeenCalledTimes(1);
      expect(cookieStore.delete).toHaveBeenCalledWith(
        "user-center-sawana-session",
      );
    });
  });
});
