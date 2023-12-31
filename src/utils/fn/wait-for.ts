const LOOP_INTERVAL_IN_MS = 10
const MAX_DURATION_IN_SECONDS = 1000

/**
 * This function loops through a function rerunning all assertions
 * inside of it until it gets a truthy result.
 *
 * If the maximum duration is reached, it then rejects.
 *
 * @param expectations A function containing all tests assertions
 * @param maxDuration Maximum wait time before rejecting
 */
export async function waitFor(
  assertions: () => void | Promise<void>,
  maxDuration = MAX_DURATION_IN_SECONDS,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const interval = setInterval(async () => {
      elapsedTime += LOOP_INTERVAL_IN_MS

      try {
        await assertions()
        clearInterval(interval)
        resolve()
      } catch (error) {
        if (elapsedTime >= maxDuration) {
          reject(error)
        }
      }
    }, LOOP_INTERVAL_IN_MS)
  })
}
