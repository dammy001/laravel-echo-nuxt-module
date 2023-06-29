// @ts-expect-error exists
import { useNuxtApp } from '#imports'

export default function useEcho() {
  return useNuxtApp().$echo
}
