import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';

describe('PredictionController', () => {
  let controller: PredictionController;
  let service: PredictionService;

  const serviceMock = {
    predictPrice: jest.fn(),
    predictYieldCrop: jest.fn(),
    predictYieldLivestock: jest.fn(),
    trainPrices: jest.fn(),
  } as unknown as PredictionService;

  beforeEach(() => {
    (serviceMock.predictPrice as jest.Mock).mockResolvedValue({
      price: 35,
      unit: 'kg',
    });
    (serviceMock.predictYieldCrop as jest.Mock).mockResolvedValue({
      mid: 2400,
      unit: 'kg',
      modelVersion: 'v0.1',
    });
    (serviceMock.predictYieldLivestock as jest.Mock).mockResolvedValue({
      mid: 12,
      unit: 'litres_per_session',
    });
    (serviceMock.trainPrices as jest.Mock).mockResolvedValue({
      version: 'v0.1',
      pairs: 3,
    });
    controller = new PredictionController(serviceMock);
    service = serviceMock;
  });

  it('should proxy price predictions', async () => {
    const response = await controller.price({
      commodity: 'Maize',
      market: 'Kericho',
    });
    expect(service.predictPrice as jest.Mock).toHaveBeenCalledWith({
      commodity: 'Maize',
      market: 'Kericho',
    });
    expect(response.service).toBe('python-ai');
    expect(response.price).toBeDefined();
  });

  it('should proxy crop yield predictions', async () => {
    const response = await controller.crop({
      crop: 'Maize',
      areaHa: 1.2,
      county: 'Kericho',
    });
    expect(service.predictYieldCrop as jest.Mock).toHaveBeenCalled();
    expect(response.mid).toBe(2400);
  });

  it('should block non-admin training calls', async () => {
    await expect(
      controller.train([], { role: 'FARMER' } as any),
    ).rejects.toThrow('Admins only');
  });

  it('should allow admin training calls', async () => {
    const rows: unknown[] = [{ commodity: 'Maize' }];
    const result = await controller.train(rows, { role: 'ADMIN' } as any);
    expect(service.trainPrices as jest.Mock).toHaveBeenCalledWith(rows);
    expect(result.version).toBe('v0.1');
  });
});
