import { closeMongodConnection, openMongodConnection } from "./utils/mongoose-server";
import { Tag, TagModel, VideoModel } from "./utils/schema";

describe('Plugin: mongoose paginate', () => {
    let tag_0: Tag;
    let tag_1: Tag;

    beforeAll(async () => {
        await openMongodConnection();
    });

    beforeEach(async () => {
        await TagModel.deleteMany({});
        await VideoModel.deleteMany({});

        tag_0 = await TagModel.create({ name: 'tag_0', description: 'description_0' });
        tag_1 = await TagModel.create({ name: 'tag_1', description: 'description_1' });
    });

    it('should be returns empty collection of video', async () => {
        const received = await VideoModel.paginate();

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(0);
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(0);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(1);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(10);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(1);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(false);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(false);
    });

    it('should be returns collection of video without tags', async () => {
        await VideoModel.create({ name: 'video_1', tags: [] }, { name: 'video_2', tags: [] });

        const received = await VideoModel.paginate();

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(2);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_1');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeTruthy();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(0);
        expect(received.docs[1]).toBeTruthy();
        expect(received.docs[1]).toBeInstanceOf(Object);
        expect(received.docs[1]).toHaveProperty('name');
        expect(received.docs[1].name).toBeTruthy();
        expect(received.docs[1].name).toBe('video_2');
        expect(received.docs[1]).toHaveProperty('tags');
        expect(received.docs[1].tags).toBeTruthy();
        expect(received.docs[1].tags).toBeInstanceOf(Array);
        expect(received.docs[1].tags.length).toBe(0);
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(2);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(1);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(10);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(1);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(false);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(false);
    });

    it('should be returns collection of video with tags id', async () => {
        await VideoModel.create(
            { name: 'video_1', tags: [tag_0._id] }, 
            { name: 'video_2', tags: [tag_0._id, tag_1._id] }
        );

        const received = await VideoModel.paginate();

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(2);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_1');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeTruthy();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(1);
        expect(received.docs[0].tags[0]).toBeTruthy();
        expect(received.docs[0].tags[0]).toBeInstanceOf(Object);
        expect(received.docs[0].tags[0]).toHaveProperty('_id');
        expect(received.docs[0].tags[0]._id).toBeDefined();
        expect(received.docs[1]).toBeTruthy();
        expect(received.docs[1]).toBeInstanceOf(Object);
        expect(received.docs[1]).toHaveProperty('name');
        expect(received.docs[1].name).toBeTruthy();
        expect(received.docs[1].name).toBe('video_2');
        expect(received.docs[1]).toHaveProperty('tags');
        expect(received.docs[1].tags).toBeTruthy();
        expect(received.docs[1].tags).toBeInstanceOf(Array);
        expect(received.docs[1].tags.length).toBe(2);
        expect(received.docs[1].tags[0]).toBeTruthy();
        expect(received.docs[1].tags[0]).toBeInstanceOf(Object);
        expect(received.docs[1].tags[0]).toHaveProperty('_id');
        expect(received.docs[1].tags[0]._id).toBeDefined();
        expect(received.docs[1].tags[1]).toBeTruthy();
        expect(received.docs[1].tags[1]).toBeInstanceOf(Object);
        expect(received.docs[1].tags[1]).toHaveProperty('_id');
        expect(received.docs[1].tags[1]._id).toBeDefined();
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(2);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(1);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(10);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(1);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(false);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(false);
    });

    it('should be returns collection of video with populate tags', async () => {
        await VideoModel.create(
            { name: 'video_1', tags: [tag_0._id] }, 
            { name: 'video_2', tags: [tag_0._id, tag_1._id] }
        );

        const received = await VideoModel.paginate({
            populate: { path: 'tags', select: ['name', 'description'], model: 'Tag' }
        });

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(2);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_1');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeTruthy();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(1);
        expect(received.docs[0].tags[0]).toBeTruthy();
        expect(received.docs[0].tags[0]).toBeInstanceOf(Object);
        expect(received.docs[0].tags[0]).toHaveProperty('_id');
        expect(received.docs[0].tags[0]._id).toBeDefined();
        expect(received.docs[0].tags[0]).toHaveProperty('name');
        expect(received.docs[0].tags[0].name).toBeDefined();
        expect(received.docs[0].tags[0].name).toBe('tag_0');
        expect(received.docs[0].tags[0]).toHaveProperty('description');
        expect(received.docs[0].tags[0].description).toBeDefined();
        expect(received.docs[0].tags[0].description).toBe('description_0');
        expect(received.docs[1]).toBeTruthy();
        expect(received.docs[1]).toBeInstanceOf(Object);
        expect(received.docs[1]).toHaveProperty('name');
        expect(received.docs[1].name).toBeTruthy();
        expect(received.docs[1].name).toBe('video_2');
        expect(received.docs[1]).toHaveProperty('tags');
        expect(received.docs[1].tags).toBeTruthy();
        expect(received.docs[1].tags).toBeInstanceOf(Array);
        expect(received.docs[1].tags.length).toBe(2);
        expect(received.docs[1].tags[0]).toBeTruthy();
        expect(received.docs[1].tags[0]).toBeInstanceOf(Object);
        expect(received.docs[1].tags[0]).toHaveProperty('_id');
        expect(received.docs[1].tags[0]._id).toBeDefined();
        expect(received.docs[1].tags[0]).toHaveProperty('name');
        expect(received.docs[1].tags[0].name).toBeDefined();
        expect(received.docs[1].tags[0].name).toBe('tag_0');
        expect(received.docs[1].tags[0]).toHaveProperty('description');
        expect(received.docs[1].tags[0].description).toBeDefined();
        expect(received.docs[1].tags[0].description).toBe('description_0');
        expect(received.docs[1].tags[1]).toBeTruthy();
        expect(received.docs[1].tags[1]).toBeInstanceOf(Object);
        expect(received.docs[1].tags[1]).toHaveProperty('_id');
        expect(received.docs[1].tags[1]._id).toBeDefined();
        expect(received.docs[1].tags[1]).toHaveProperty('name');
        expect(received.docs[1].tags[1].name).toBeDefined();
        expect(received.docs[1].tags[1].name).toBe('tag_1');
        expect(received.docs[1].tags[1]).toHaveProperty('description');
        expect(received.docs[1].tags[1].description).toBeDefined();
        expect(received.docs[1].tags[1].description).toBe('description_1');
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(2);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(1);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(10);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(1);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(false);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(false);
    });

    it('should be returns collection of video paginated: should be doesnt have prev page & has next page', async () => {
        await VideoModel.create({ name: 'video_1' }, { name: 'video_2' }, { name: 'video_3' } );

        const received = await VideoModel.paginate({ limit: 1, page: 1 });

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(1);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_1');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeTruthy();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(0);
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(3);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(1);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(1);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(3);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(false);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(true);
    });

    it('should be returns collection of video paginated: should have prev & next page', async () => {
        await VideoModel.create({ name: 'video_1' }, { name: 'video_2' }, { name: 'video_3' } );

        const received = await VideoModel.paginate({ limit: 1, page: 2 });

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(1);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_2');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeDefined();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(0);
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(3);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(2);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(1);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(3);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(true);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(true);
    });

    it('should be returns collection of video paginated: should have prev & doesnt have next page', async () => {
        await VideoModel.create({ name: 'video_1' }, { name: 'video_2' }, { name: 'video_3' } );

        const received = await VideoModel.paginate({ limit: 1, page: 3 });

        expect(received).toBeTruthy();
        expect(received).toBeInstanceOf(Object);
        expect(received.docs).toBeTruthy();
        expect(received.docs).toBeInstanceOf(Array);
        expect(received.docs.length).toBe(1);
        expect(received.docs[0]).toBeTruthy();
        expect(received.docs[0]).toBeInstanceOf(Object);
        expect(received.docs[0]).toHaveProperty('name');
        expect(received.docs[0].name).toBeTruthy();
        expect(received.docs[0].name).toBe('video_3');
        expect(received.docs[0]).toHaveProperty('tags');
        expect(received.docs[0].tags).toBeDefined();
        expect(received.docs[0].tags).toBeInstanceOf(Array);
        expect(received.docs[0].tags.length).toBe(0);
        expect(received.docsCount).toBeDefined();
        expect(received.docsCount).toBe(3);
        expect(received.page).toBeDefined();
        expect(received.page).toBe(3);
        expect(received.limit).toBeDefined();
        expect(received.limit).toBe(1);
        expect(received.pagesCount).toBeDefined();
        expect(received.pagesCount).toBe(3);
        expect(received.hasPrev).toBeDefined();
        expect(received.hasPrev).toBe(true);
        expect(received.hasNext).toBeDefined();
        expect(received.hasNext).toBe(false);
    });

    afterEach(() => {
        tag_0 = null;
        tag_1 = null;
    });

    afterAll(async () => {
        await closeMongodConnection()
    });

});