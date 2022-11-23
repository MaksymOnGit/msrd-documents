import {Req} from "@tsed/common";
import {Arg, OnVerify, Protocol, ProtocolOptions} from "@tsed/passport";
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import { passportJwtSecret } from 'jwks-rsa';

@Protocol({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider: passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${process.env.JWSK_URL}`
    }),
  } as StrategyOptions
} as ProtocolOptions)
export class JwtProtocol implements OnVerify {

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    // @ts-ignore
    req._sessionManager = undefined;
    req.user = jwtPayload;
    return jwtPayload.sub;
  }
}
