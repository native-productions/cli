import path from "path";

export function joinCwd(p: string): string {
  return path.join(process.cwd(), p)
}

console.log(path.basename(joinCwd('packages/envcrypt/samples/in/.env')))

console.log(joinCwd(`packages/out.enc`))