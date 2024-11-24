import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {MangasController} from "./mangas.controller";
import {MangasService} from "../services/mangas.service";
import {Manga} from "../../entities/manga.entity";


describe('MangasController', () => {
    let controller: MangasController;
    let mangasService: MangasService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                MangasController,
                MangasService,
                { provide: getRepositoryToken(Manga), useValue: {} }
            ],
        }).compile();
        controller = moduleRef.get(MangasController)
        mangasService = moduleRef.get(MangasService);
    });

    it("should return all mangas", async () => {
        jest.spyOn(mangasService, "getAll").mockResolvedValue([])

        expect(await controller.getAll()).toEqual([])
    })

    it("should return manga by id", async () => {
        jest.spyOn(mangasService, "getOne").mockResolvedValue({
            manga_id: 1
        } as Manga)

        expect(await controller.getOne(1)).toEqual({manga_id: 1})
        expect(mangasService.getOne).toHaveBeenCalledWith(1)
    })
});