import { closeMongodConnection, openMongodConnection } from './utils/mongoose-server';
import { Tag, TagModel, Video, VideoModel } from './utils/schema';
import { PaginateOption } from 'mongoose';

describe('Plugin: mongoose paginate', () => {
  let defaultOptions: PaginateOption;

  let tag_0: Tag;
  let tag_1: Tag;
  let video: Video;

  beforeAll(async () => {
    await openMongodConnection();
  });

  beforeEach(async () => {
    await TagModel.deleteMany({});
    await VideoModel.deleteMany({});

    defaultOptions = { page: 1, limit: 10 };

    tag_0 = await TagModel.create({ name: 'tag_0', description: 'description_0' });
    tag_1 = await TagModel.create({ name: 'tag_1', description: 'description_1' });
    await VideoModel.create({ name: 'video_0', tags: [tag_0._id], deleted: false });
    await VideoModel.create({ name: 'video_1', tags: [tag_1._id], deleted: false });
    video = await VideoModel.create({ name: 'video_2', tags: [tag_0._id, tag_1._id], deleted: false });
  });

  afterEach(async () => {
    defaultOptions = void 0;
    tag_0 = void 0;
    tag_1 = void 0;
    video = void 0;

    await VideoModel.deleteMany().exec();
    await TagModel.deleteMany().exec();
  });

  afterAll(async () => {
    await closeMongodConnection();
  });

  it('should be defined', async () => {
    expect(VideoModel.paginate(defaultOptions)).toBeDefined();
  });

  describe('pagination', () => {
    beforeEach(() => {
      defaultOptions.limit = 1;
    });

    it('should be returns pagination', async () => {
      defaultOptions.limit = 10;
      await VideoModel.deleteMany().exec();
      const received = await VideoModel.paginate(defaultOptions).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(0);
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

    it('should be returns pagination with "hasNext"', async () => {
      const received = await VideoModel.paginate(defaultOptions).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(1);
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

    it('should be returns pagination with "hasPrev" & "hasNext"', async () => {
      defaultOptions.page = 2;
      const received = await VideoModel.paginate(defaultOptions).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(1);
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

    it('should be returns pagination with "hasPrev"', async () => {
      defaultOptions.page = 3;
      const received = await VideoModel.paginate(defaultOptions).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(1);
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
  });

  describe('select', () => {
    it('should return all VideoModel fields', async () => {
      const received = await VideoModel.paginate(defaultOptions).select().exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(3);
      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeDefined();
      expect(received.docs[0].name).toBe('video_0');
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeDefined();
      expect(received.docs[0].tags).toBeInstanceOf(Array);
      expect(received.docs[0].tags.length).toBe(1);
      expect(received.docs[0]).toHaveProperty('deleted');
      expect(received.docs[0].deleted).toBeDefined();
      expect(received.docs[0].deleted).toBe(false);
    });

    it('should return only "name" field', async () => {
      const received = await VideoModel.paginate(defaultOptions).select('name').exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(3);
      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeDefined();
      expect(received.docs[0].name).toBe('video_0');
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeUndefined();
      expect(received.docs[0]).toHaveProperty('deleted');
      expect(received.docs[0].deleted).toBeUndefined();
    });

    it('should return all fields expect "name"', async () => {
      const received = await VideoModel.paginate(defaultOptions).select('-name').exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(3);
      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeUndefined();
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeDefined();
      expect(received.docs[0].tags).toBeInstanceOf(Array);
      expect(received.docs[0].tags.length).toBe(1);
      expect(received.docs[0]).toHaveProperty('deleted');
      expect(received.docs[0].deleted).toBeDefined();
      expect(received.docs[0].deleted).toBe(false);
    });
  });

  describe('populate', () => {
    it('should be populate "tags" fields', async () => {
      const received = await VideoModel.paginate(defaultOptions)
        .populate({ path: 'tags', select: ['name', 'description'], model: 'Tag' })
        .exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(3);

      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeDefined();
      expect(received.docs[0].name).toBe('video_0');
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeDefined();
      expect(received.docs[0].tags).toBeInstanceOf(Array);
      expect(received.docs[0].tags).toHaveLength(1);
      expect(received.docs[0].tags[0]).toBeDefined();
      expect(received.docs[0].tags[0]).toBeInstanceOf(Object);
      expect(received.docs[0].tags[0]).toHaveProperty('name');
      expect(received.docs[0].tags[0].name).toBeDefined();
      expect(received.docs[0].tags[0].name).toBe('tag_0');
      expect(received.docs[0].tags[0]).toHaveProperty('description');
      expect(received.docs[0].tags[0].description).toBeDefined();
      expect(received.docs[0].tags[0].description).toBe('description_0');

      expect(received.docs[1]).toBeDefined();
      expect(received.docs[1]).toBeInstanceOf(Object);
      expect(received.docs[1]).toHaveProperty('name');
      expect(received.docs[1].name).toBeDefined();
      expect(received.docs[1].name).toBe('video_1');
      expect(received.docs[1]).toHaveProperty('tags');
      expect(received.docs[1].tags).toBeDefined();
      expect(received.docs[1].tags).toBeInstanceOf(Array);
      expect(received.docs[1].tags).toHaveLength(1);
      expect(received.docs[1].tags[0]).toBeDefined();
      expect(received.docs[1].tags[0]).toBeInstanceOf(Object);
      expect(received.docs[1].tags[0]).toHaveProperty('name');
      expect(received.docs[1].tags[0].name).toBeDefined();
      expect(received.docs[1].tags[0].name).toBe('tag_1');
      expect(received.docs[1].tags[0]).toHaveProperty('description');
      expect(received.docs[1].tags[0].description).toBeDefined();
      expect(received.docs[1].tags[0].description).toBe('description_1');
    });
  });

  describe('query', () => {
    it('should return only no-deleted videos', async () => {
      const received = await VideoModel.paginate(defaultOptions).query({ deleted: false }).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(3);
      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeDefined();
      expect(received.docs[0].name).toBe('video_0');
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeDefined();
      expect(received.docs[0].tags).toBeInstanceOf(Array);
      expect(received.docs[0].tags.length).toBe(1);
      expect(received.docs[0]).toHaveProperty('deleted');
      expect(received.docs[0].deleted).toBeDefined();
      expect(received.docs[0].deleted).toBe(false);
    });

    it('should return only deleted videos', async () => {
      await VideoModel.updateOne({ _id: video.id }, { deleted: true }).exec();
      const received = await VideoModel.paginate(defaultOptions).query({ deleted: true }).exec();

      expect(received).toBeDefined();
      expect(received).toBeInstanceOf(Object);
      expect(received.docs).toBeDefined();
      expect(received.docs).toBeInstanceOf(Array);
      expect(received.docs).toHaveLength(1);
      expect(received.docs[0]).toBeDefined();
      expect(received.docs[0]).toBeInstanceOf(Object);
      expect(received.docs[0]).toHaveProperty('name');
      expect(received.docs[0].name).toBeDefined();
      expect(received.docs[0].name).toBe('video_2');
      expect(received.docs[0]).toHaveProperty('tags');
      expect(received.docs[0].tags).toBeDefined();
      expect(received.docs[0].tags).toBeInstanceOf(Array);
      expect(received.docs[0].tags).toHaveLength(2);
      expect(received.docs[0]).toHaveProperty('deleted');
      expect(received.docs[0].deleted).toBeDefined();
      expect(received.docs[0].deleted).toBe(true);
    });
  });
});
