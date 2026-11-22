import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")

const SPEC_GLOBS = ["src/**/*.spec.ts", "src/**/*.spec.tsx", "netlify/**/*.spec.ts", "scripts/**/*.spec.ts"]
const RUNNER_TEST_CALL = /^\s*test(\.(each|skipIf|skip|only|todo))?\(/
const DESCRIBE_CALL = /^\s*describe\(\s*(["'`])(.*?)\1/
const FUNCTION_SUBJECT = /^[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*$/

function specFiles() {
    const pattern = SPEC_GLOBS.map((glob) => `'${glob}'`).join(" ")
    const out = execSync(`git ls-files ${pattern}`, { cwd: root, encoding: "utf8" }).trim()
    return out === "" ? [] : out.split("\n").filter(Boolean)
}

const failures = []

for (const file of specFiles()) {
    const lines = readFileSync(join(root, file), "utf8").split("\n")
    lines.forEach((line, index) => {
        const at = `${file}:${index + 1}`
        if (RUNNER_TEST_CALL.test(line)) {
            failures.push(`${at}  test(...) in a vitest spec; use it(...)`)
        }
        const describe = DESCRIBE_CALL.exec(line)
        if (describe !== null && FUNCTION_SUBJECT.test(describe[2])) {
            failures.push(`${at}  describe("${describe[2]}") names a function; name the behaviour`)
        }
    })
}

if (failures.length > 0) {
    console.error(failures.join("\n"))
    console.error(`\ntest-titles check failed with ${failures.length} finding(s)`)
    process.exit(1)
}

console.log(`test-titles check passed on ${specFiles().length} spec files`)
