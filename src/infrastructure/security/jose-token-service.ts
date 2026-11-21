import { SignJWT, jwtVerify } from "jose";
import type {
  TokenService,
  AccessTokenPayload,
} from "../../application/ports/token-service.js";

export class JoseTokenService implements TokenService {
  private readonly secret: Uint8Array;
  private readonly expiresIn: string;

  constructor() {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long");
    }

    this.secret = new TextEncoder().encode(secret);
    this.expiresIn = process.env.JWT_EXPIRES_IN || "15m";
  }

  async generateAccessToken(payload: {
    userId: number;
    email: string;
  }): Promise<string> {
    return new SignJWT({ email: payload.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(payload.userId))
      .setIssuedAt()
      .setExpirationTime(this.expiresIn)
      .sign(this.secret);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify(token, this.secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub) ||
      typeof payload.email !== "string"
    ) {
      throw new Error("Invalid token payload");
    }

    return {
      userId: Number(payload.sub),
      email: payload.email,
    };
  }
}
