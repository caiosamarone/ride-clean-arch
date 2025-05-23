import { Position } from '../../src/domain/entity/position';
import DistanceCalculator from '../../src/domain/service/distance-calculator';

describe('DistanceCalculator', () => {
  it('should return a distance from 10km', () => {
    const fisrtPlace = Position.create('fisrt-place', -25.4289, -49.2733);
    const secondPlace = Position.create('second-place', -25.3389, -49.2733);
    const distance = DistanceCalculator.calculateDistanceBetweenPositions([
      fisrtPlace,
      secondPlace,
    ]);
    expect(distance).toBe(10);
  });
});
