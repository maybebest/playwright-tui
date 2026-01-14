/**
 * Seeded random number generator for reproducible test runs
 * Uses xorshift algorithm for deterministic random number generation
 */
export class SeededRandom {
    private seed: number;
  
    /**
     * Create a new seeded random generator
     * @param seed - Initial seed value for deterministic random generation
     */
    constructor(seed: number) {
      this.seed = seed >>> 0;
    }
  
    /**
     * Generate next random number in sequence
     * @returns Random number based on current seed
     */
    next(): number {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      this.seed = x >>> 0;
      return this.seed;
    }
  
    /**
     * Generate random integer in range [minInclusive, maxInclusive]
     * @param minInclusive - Minimum value (inclusive)
     * @param maxInclusive - Maximum value (inclusive)
     * @returns Random integer in specified range
     */
    int(minInclusive: number, maxInclusive: number): number {
      const range = maxInclusive - minInclusive + 1;
      const n = this.next() % range;
      return minInclusive + n;
    }
  
    /**
     * Pick a random index from an array of given length
     * @param length - Length of the array
     * @returns Random index in range [0, length-1]
     * @throws Error if length is <= 0
     */
    pickIndex(length: number): number {
      if (length <= 0) throw new Error("Cannot pick from empty array");
      return this.int(0, length - 1);
    }
  }
  