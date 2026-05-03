export function useLocalStorageRef<T = unknown>(
  key: string,
  defaultValue: T
): Ref<T> {
  const storedValue = localStorage.getItem(key)
  let originalValue = storedValue ? JSON.parse(storedValue) : defaultValue
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return originalValue
      },
      set(newValue) {
        trigger()
        originalValue = newValue
        localStorage.setItem(key, JSON.stringify(originalValue))
      },
    }
  })
}