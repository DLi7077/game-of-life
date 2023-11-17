export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function printGrid<T>(grid: T[][]): void {
  for (const row of grid) {
    process.stdout.write(row.join(" "));
    console.log();
  }
}
