<script setup lang="ts">
import Button from '../../common/ui/Button.vue'

interface Props {
  title?: string
  message?: string
  formType: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Application Received!',
  message: "Thank you for volunteering! We'll review your application and get back to you shortly.",
  formType: 'volunteer',
})

const emit = defineEmits(['reset'])

const handleReset = () => {
  emit('reset')
}

const headerText = () => {
  if (props.formType === 'volunteer') {
    return 'Application Received!'
  }
  if (props.formType === 'surrender') {
    return 'Form Received!'
  }
  if (props.formType === 'adoption') {
    return 'Application Received!'
  }
  if (props.formType === 'foster') {
    return 'Application Received!'
  }
  return ''
}

const messageText = () => {
  if (props.formType === 'volunteer') {
    return "Thank you for applying! We'll review your application and get back to you shortly."
  }
  if (props.formType === 'surrender') {
    return "We'll review your form and get back to you shortly."
  }
  if (props.formType === 'adoption') {
    return "We'll review your adoption application and get back to you shortly."
  }
  if (props.formType === 'foster') {
    return "We'll review your foster application and get back to you shortly."
  }
  return ''
}
</script>

<template>
  <div class="success-card">
    <div class="icon-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="success-icon"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <h3 class="success-title">{{ headerText() }}</h3>
    <p class="success-message">{{ messageText() }}</p>
    <div class="success-actions">
      <Button title="Return to Home" color="green" @click="handleReset" />
    </div>
  </div>
</template>

<style scoped lang="css">
.success-card {
  max-width: 600px;
  margin: 0 auto;
  background: var(--text-inverse);
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  padding: 60px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  text-align: center;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.icon-wrapper {
  color: var(--text-inverse);
  background-color: var(--color-primary);
  width: 96px;
  height: 110px;
  border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
}

.success-icon {
  width: 44px;
  height: 44px;
}

.success-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.success-message {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 400px;
}

.success-actions {
  display: flex;
  justify-content: center;
  width: 100%;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
