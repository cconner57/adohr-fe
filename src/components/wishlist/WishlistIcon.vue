<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <svg
    v-if="name === 'bottle'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M10 2h4" />
    <path d="M11 2v3h2V2" />
    <path d="M9 5h6v2l2 3v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10l2-3V5z" />
    <path d="M7 14h10" />
  </svg>

  <svg
    v-else-if="name === 'bowl'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M4 11c0 5 3.5 8 8 8s8-3 8-8H4z" />
    <path d="M7 19l-1 2" />
    <path d="M17 19l1 2" />
    <path d="M8 7c1 1 1 2 0 3" />
    <path d="M12 7c1 1 1 2 0 3" />
    <path d="M16 7c1 1 1 2 0 3" />
  </svg>

  <svg
    v-else-if="name === 'can'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <ellipse cx="12" cy="5" rx="7" ry="3" />
    <path d="M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
    <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
  </svg>

  <svg
    v-else-if="name === 'treats' || name === 'kong' || name === 'chew'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M17.5 4a2.5 2.5 0 0 0-2.3 3.5l-6.4 6.4a2.5 2.5 0 1 0-1.3 2.6 2.5 2.5 0 1 0 3.5-2.3l6.4-6.4a2.5 2.5 0 1 0 2.6-1.3 2.5 2.5 0 0 0-2.5-2.5z"
    />
  </svg>

  <svg
    v-else-if="name === 'shield'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>

  <svg
    v-else-if="name === 'pill'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>

  <svg
    v-else-if="name === 'eye'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>

  <svg
    v-else-if="name === 'ear'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a2 2 0 1 1-4 0c0-3 3-5 3-7.5a2.5 2.5 0 0 0-5 0"
    />
    <path d="M10 8.5a2.5 2.5 0 0 1 5 0" />
  </svg>

  <svg
    v-else-if="name === 'first-aid'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="6" rx="2" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M12 10v6" />
    <path d="M9 13h6" />
  </svg>

  <svg
    v-else-if="name === 'blanket'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M3 11h18" />
    <path d="M7 5v14" />
    <path d="M17 5v14" />
  </svg>

  <svg
    v-else-if="name === 'bed'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>

  <svg
    v-else-if="name === 'spray' || name === 'cleaning'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M10 2v4" />
    <path d="M14 2v4" />
    <path d="M8 6h8l1 3H7l1-3z" />
    <path d="M7 9v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9" />
    <path d="M10 13h4" />
    <path d="M10 17h4" />
  </svg>

  <svg
    v-else-if="name === 'heating'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
    <circle cx="12" cy="12" r="4" />
  </svg>

  <svg
    v-else-if="name === 'litter'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10l2 10h12l2-10H4z" />
    <path d="M2 10h20" />
    <path d="M9 6l3-3 3 3" />
  </svg>

  <svg
    v-else-if="name === 'pads'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>

  <svg
    v-else-if="name === 'laundry'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M4 8h16l-2 12H6L4 8z" />
    <path d="M2 8h20" />
    <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
    <path d="M9 13l3 3 3-3" />
  </svg>

  <svg
    v-else-if="name === 'carrier'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="14" x="2" y="7" rx="3" />
    <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    <path d="M2 12h20" />
    <path d="M9 12v3a3 3 0 0 0 6 0v-3" />
  </svg>

  <svg
    v-else-if="name === 'crate'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M11 4v16M15 4v16M19 4v16M3 9h18M3 15h18" />
  </svg>

  <svg
    v-else-if="name === 'car'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
    />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>

  <svg
    v-else-if="name === 'feather'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <path d="M16 8L2 22" />
    <path d="M17.5 15H9" />
  </svg>

  <svg
    v-else-if="name === 'puzzle'"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <path d="M13 17h8M17 13v8" />
  </svg>

  <!-- Default Pet Paw Icon -->
  <svg
    v-else
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="16" r="3.5" />
    <circle cx="6" cy="10" r="2" />
    <circle cx="10" cy="6" r="2" />
    <circle cx="14" cy="6" r="2" />
    <circle cx="18" cy="10" r="2" />
  </svg>
</template>
