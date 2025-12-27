export class SeededRandom {
    private seed: number;
  
    constructor(seed: number) {
      this.seed = seed >>> 0;
    }
  
    next(): number {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      this.seed = x >>> 0;
      return this.seed;
    }
  
    int(minInclusive: number, maxInclusive: number): number {
      const range = maxInclusive - minInclusive + 1;
      const n = this.next() % range;
      return minInclusive + n;
    }
  
    pickIndex(length: number): number {
      if (length <= 0) throw new Error("Cannot pick from empty array");
      return this.int(0, length - 1);
    }
  }
  