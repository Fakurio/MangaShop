import {Test} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtGuard} from "./jwt.guard";
import {HttpException} from "@nestjs/common";

describe('JwtGuard', () => {
    let jwtGuard: JwtGuard
    let jwtService: JwtService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                JwtGuard,
                JwtService,
                { provide: ConfigService, useValue: {
                        get: jest.fn()
                } },
            ],
        }).compile();
        jwtGuard = moduleRef.get(JwtGuard);
        jwtService = moduleRef.get(JwtService);
    });

    it("should pass request", async () => {
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({
                headers: { authorization: 'token' },
            }),
        } as any;
        jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({} as Object)

        expect(await jwtGuard.canActivate(mockContext)).toBe(true);
    })

    it("should block request -> no authorization header", async () => {
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({
                headers: {},
            }),
        } as any;

        try {
            await jwtGuard.canActivate(mockContext);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toEqual('Unauthorized access');
        }
    })

    it("should block request -> empty authorization header", async () => {
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({
                headers: {authorization: ''},
            }),
        } as any;

        try {
            await jwtGuard.canActivate(mockContext);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toEqual('Unauthorized access');
        }
    })

    it("should pass request -> wrong token signature", async () => {
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({
                headers: { authorization: 'token' },
            }),
        } as any;
        jest.spyOn(jwtService, "verifyAsync").mockImplementation(() => {
            throw new Error();
        })

        try {
            await jwtGuard.canActivate(mockContext);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect(error.message).toEqual('Bad token');
        }
    })

})