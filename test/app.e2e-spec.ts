import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { AuthDto } from "src/auth/dto";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "test@example.com",
      password: "password",
    };

    describe("Invalid email", () => {
      it("should not signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: "123",
          })
          .expectStatus(400);
      });
    });

    describe("Empty body", () => {
      it("should not signup", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });
    });

    describe("Invalid password", () => {
      it("should not signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: "test@example.com",
          })
          .expectStatus(400);
      });
    });

    describe("Invalid credentials", () => {
      it("should not login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            email: "invalid@gmail.com",
            password: "password",
          })
          .expectStatus(403);
      });
    });

    describe("Signup", () => {
      it("should signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe("Invalid email", () => {
      it("should not login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            password: "123",
          })
          .expectStatus(400);
      });
    });

    describe("Empty body", () => {
      it("should not login", () => {
        return pactum.spec().post("/auth/login").expectStatus(400);
      });
    });

    describe("Invalid password", () => {
      it("should not login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            email: "test@example.com",
          })
          .expectStatus(400);
      });
    });

    describe("Login", () => {
      it("should login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe("User", () => {
    describe("Get me", () => {});

    describe("Edit user", () => {});
  });

  describe("Bookmarks", () => {
    describe("Create bookmark", () => {});
    describe("Get bookmarks", () => {});
    describe("Get bookmark by id", () => {});
    describe("Edit bookmark", () => {});
    describe("Delete bookmark", () => {});
  });
});
