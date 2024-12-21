import { RegisterService } from './register.service';
import { Test } from '@nestjs/testing';
import { UsersService } from '../../user/services/users.service';
import { HashService } from './hash.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { HttpException } from '@nestjs/common';
import { Role } from '../../entities/role.entity';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let usersService: UsersService;
  let hashService: HashService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterService,
        UsersService,
        HashService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Role), useValue: {} },
      ],
    }).compile();

    registerService = moduleRef.get(RegisterService);
    usersService = moduleRef.get(UsersService);
    hashService = moduleRef.get(HashService);
  });

  it('should register user', async () => {
    const dto = {
      username: 'Kamil',
      email: 'kamil.zel1@gmail.com',
      password: 'vnjdkjj@!J1',
    };
    jest.spyOn(usersService, 'checkUser').mockResolvedValue(false);
    jest.spyOn(usersService, 'addNewUser').mockResolvedValue({} as User);
    jest.spyOn(hashService, 'hashPassword').mockImplementation((pas) => {
      return Promise.resolve(pas);
    });

    expect(await registerService.registerUser(dto)).toEqual({
      message: 'User registered successfully',
    });
  });

  it("shouldn't register user -> invalid email", async () => {
    const dto = {
      username: 'Kamil',
      email: 'kamil',
      password: 'vnjdkjj@!J1',
    };

    try {
      await registerService.registerUser(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect registration data');
    }
  });

  it("shouldn't register user -> invalid password", async () => {
    const dto = {
      username: 'Kamil',
      email: 'kamil.zel1@gmail.com',
      password: 'vnjdk',
    };

    try {
      await registerService.registerUser(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Incorrect registration data');
    }
  });

  it("shouldn't register user -> user exist", async () => {
    const dto = {
      username: 'Kamil',
      email: 'kamil.zel1@gmail.com',
      password: 'vnjdkjj@!J1',
    };
    jest.spyOn(usersService, 'checkUser').mockResolvedValue(true);

    try {
      await registerService.registerUser(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('User with given e-mail already exists');
    }
  });
});
